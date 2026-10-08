// Baca foto layar kasir / nota jadi daftar item, jumlah, catatan, total.
// Model AI lewat Sumopod (format OpenAI). Key disimpan sebagai secret SUMOPOD_API_KEY
// (tidak pernah dikirim ke browser). Model bisa diganti lewat secret AI_MODEL.
// Hanya admin yang login (bukan anon key) yang boleh memanggil.
import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const tunggu = (ms: number) => new Promise((r) => setTimeout(r, ms));

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Gunakan POST.' }, 405);

  // Pastikan pemanggil adalah user yang login, bukan sekadar anon key.
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);
  const { data: userData, error: userErr } = await sb.auth.getUser(token);
  if (userErr || !userData?.user) return json({ error: 'Harus login sebagai admin.' }, 401);

  const apiKey = Deno.env.get('SUMOPOD_API_KEY')?.trim();
  if (!apiKey) return json({ error: 'SUMOPOD_API_KEY belum diisi di Supabase secrets.' }, 500);
  const model = Deno.env.get('AI_MODEL')?.trim() || 'gpt-4.1-mini';

  let body: { image?: string; mimeType?: string; menu?: string[] };
  try { body = await req.json(); } catch { return json({ error: 'Body bukan JSON.' }, 400); }
  const { image, mimeType = 'image/jpeg', menu = [] } = body;
  if (!image) return json({ error: 'Field image (base64) wajib.' }, 400);
  if (image.length > 8_000_000) return json({ error: 'Foto terlalu besar.' }, 413);

  const prompt = `Ini foto layar kasir atau nota pesanan rumah makan Pecel Lele Aminoto.\nBaca semua item pesanan. Cocokkan nama item ke daftar menu berikut (pakai nama PERSIS dari daftar; kalau tidak ada yang cocok, tulis nama aslinya):\n${menu.join(', ')}\nBalas HANYA JSON dengan bentuk:\n{"items":[{"name":string,"qty":number,"price":number}],"note":string,"total":number}\nprice = harga satuan dalam rupiah tanpa titik. note = catatan pesanan, kosongkan kalau tidak ada. total = total tertulis di foto.`;

  const payload = JSON.stringify({
    model,
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${image}` } },
      ],
    }],
    response_format: { type: 'json_object' },
    temperature: 0,
    max_tokens: 1000,
  });

  // Server AI kadang 503 (sibuk) atau 429 (limit sesaat): ulangi sampai 3x dengan jeda bertambah.
  let res: Response | undefined;
  for (let coba = 0; coba < 3; coba++) {
    if (coba > 0) await tunggu(1500 * coba);
    res = await fetch('https://ai.sumopod.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: payload,
    });
    if (res.status !== 503 && res.status !== 429) break;
    console.error(`AI ${res.status}, percobaan ${coba + 1}`);
  }

  if (!res!.ok) {
    const detail = await res!.text();
    console.error(`AI gagal ${res!.status}: ${detail.slice(0, 500)}`);
    const sibuk = res!.status === 503 || res!.status === 429;
    return json({
      error: sibuk ? 'Server AI sedang sibuk. Tunggu 1 menit lalu tekan Baca foto lagi.' : `AI gagal (${res!.status}).`,
      detail: detail.slice(0, 500),
    }, 502);
  }

  const data = await res!.json();
  const text: string = data?.choices?.[0]?.message?.content ?? '';
  try {
    // Jaga-jaga kalau model membungkus JSON dengan ```json ... ```
    return json(JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, '')));
  } catch {
    console.error(`Hasil AI bukan JSON: ${text.slice(0, 500)}`);
    return json({ error: 'Hasil AI bukan JSON.', raw: text.slice(0, 500) }, 502);
  }
});
