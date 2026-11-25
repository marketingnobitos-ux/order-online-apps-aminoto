// Deteksi versi web baru setelah deploy.
// Tab yang sudah terbuka sebelum deploy tetap menjalankan JS lama sampai dimuat ulang.
// Fungsi ini mengambil index.html terbaru (tanpa cache) dan membandingkan nama file JS
// utamanya (mis. /assets/index-AbC123.js) dengan yang sedang berjalan.

const POLA_SKRIP = /\/assets\/index-[\w-]+\.js/;
const KUNCI_RELOAD = 'aminoto-reload-ke';

// Nama file JS yang sedang berjalan. null saat `npm run dev` (tidak ada file ber-hash).
const skripSekarang = (): string | null => {
  const el = document.querySelector<HTMLScriptElement>('script[type="module"][src*="/assets/index-"]');
  return el?.getAttribute('src')?.match(POLA_SKRIP)?.[0] ?? null;
};

// true kalau server sudah memakai build lain dari yang sedang berjalan.
export async function adaVersiBaru(): Promise<boolean> {
  const sekarang = skripSekarang();
  if (!sekarang) return false;
  try {
    const res = await fetch('/', { cache: 'no-store' });
    if (!res.ok) return false;
    const terbaru = (await res.text()).match(POLA_SKRIP)?.[0];
    if (!terbaru || terbaru === sekarang) return false;
    // Pengaman: kalau sudah pernah reload demi versi ini tapi tetap dapat versi lama
    // (cache browser yang bandel), jangan reload berulang-ulang.
    try {
      if (sessionStorage.getItem(KUNCI_RELOAD) === terbaru) return false;
    } catch {
      // Abaikan.
    }
    return true;
  } catch {
    return false; // offline / jaringan putus: coba lagi nanti
  }
}

export function muatUlangKeVersiBaru() {
  // Catat target supaya pengaman di atas bekerja; lalu muat ulang.
  fetch('/', { cache: 'no-store' })
    .then(r => r.text())
    .then(html => {
      const terbaru = html.match(POLA_SKRIP)?.[0];
      try {
        if (terbaru) sessionStorage.setItem(KUNCI_RELOAD, terbaru);
      } catch {
        // Abaikan.
      }
    })
    .catch(() => {})
    .finally(() => window.location.reload());
}
