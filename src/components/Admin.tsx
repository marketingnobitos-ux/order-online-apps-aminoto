import React, { useEffect, useMemo, useState } from 'react';
import { MOCK_ORDERS, MockOrder, MockOrderItem } from '../lib/mock-orders';
import { BRANCHES, MENU_ITEMS } from '../data';
import { supabase } from '../lib/supabase';

// Data order dari Supabase (tabel orders). Kalau env Supabase belum diset, pakai data contoh
// (mock-orders.ts) supaya UI tetap bisa dicoba lokal.

const PAYMENTS = ['QRIS', 'BCA', 'BAYAR DI TEMPAT'];
const BAKAR_EXTRA = 2000; // sama dengan aturan di Menu.tsx

// Aturan varian sama dengan Menu.tsx
const COOK_ITEMS = ['gurame', 'nila', 'ayam negri', 'ayam kampung', 'bebek'];
const CUT_ITEMS = ['ayam negri', 'ayam kampung', 'bebek'];
const EGG_ITEM = 'telor dadar / ceplok';

const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

// Tanggal dihitung di zona Asia/Jakarta (WIB), bukan zona perangkat.
const dayKey = (iso: string) => new Date(iso).toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });
const tanggalRamah = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
const jam = (iso: string) =>
  new Date(iso).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' });
const bulanRamah = (key: string) =>
  new Date(`${key}-01T00:00:00+07:00`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' });

type Periode = 'hari' | '7hari' | 'bulan' | 'semua';
const PERIODE: { id: Periode; label: string }[] = [
  { id: 'hari', label: 'Hari ini' },
  { id: '7hari', label: '7 hari' },
  { id: 'bulan', label: 'Bulan ini' },
  { id: 'semua', label: 'Semua' },
];

function dalamPeriode(iso: string, p: Periode) {
  if (p === 'semua') return true;
  const today = dayKey(new Date().toISOString());
  const d = dayKey(iso);
  if (p === 'hari') return d === today;
  if (p === 'bulan') return d.slice(0, 7) === today.slice(0, 7);
  const batas = new Date(`${today}T00:00:00+07:00`);
  batas.setDate(batas.getDate() - 6);
  return new Date(`${d}T00:00:00+07:00`) >= batas;
}

function groupBy(orders: MockOrder[], keyFn: (o: MockOrder) => string) {
  const map = new Map<string, { count: number; omzet: number }>();
  for (const o of orders) {
    const k = keyFn(o);
    const cur = map.get(k) ?? { count: 0, omzet: 0 };
    cur.count += 1;
    cur.omzet += o.total;
    map.set(k, cur);
  }
  return [...map.entries()];
}

function exportCsv(orders: MockOrder[]) {
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const header = ['Waktu (WIB)', 'Nama', 'WhatsApp', 'Cabang', 'Pembayaran', 'Item', 'Catatan', 'Total'];
  const rows = orders.map(o => [
    new Date(o.created_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
    o.customer_name, o.whatsapp, o.branch, o.payment_method,
    o.items.map(i => `${i.qty}x ${i.name}${i.variant ? ` (${i.variant})` : ''}`).join('; '),
    o.note ?? '', o.total,
  ]);
  const csv = [header, ...rows].map(r => r.map(esc).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }); // BOM agar Excel baca UTF-8
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `rekap-order-${dayKey(new Date().toISOString())}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

const chip = (aktif: boolean) =>
  `shrink-0 px-3.5 py-2 rounded-xl text-[13px] font-bold border transition-all ${aktif ? 'bg-[#06402B] text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`;
const pilihan = (aktif: boolean) =>
  `flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${aktif ? 'border-[#06402B] bg-[#F4FBF4] text-[#06402B]' : 'border-gray-200 bg-white text-gray-600'}`;
const field = 'w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:border-[#06402B] focus:ring-1 focus:ring-[#06402B]';

function Kartu({ label, nilai, hijau }: { label: string; nilai: string; hijau?: boolean }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm min-w-0">
      <p className="text-[11px] text-gray-500 font-semibold">{label}</p>
      <p className={`text-xl font-bold mt-0.5 break-words ${hijau ? 'text-[#06402B]' : 'text-gray-900'}`}>{nilai}</p>
    </div>
  );
}

function Ringkasan({ orders }: { orders: MockOrder[] }) {
  const omzet = orders.reduce((s, o) => s + o.total, 0);
  const rata = orders.length ? Math.round(omzet / orders.length) : 0;
  const perCabang = groupBy(orders, o => o.branch).sort((a, b) => b[1].omzet - a[1].omzet);
  const perHari = groupBy(orders, o => dayKey(o.created_at)).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  const perBulan = groupBy(orders, o => dayKey(o.created_at).slice(0, 7)).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  const maxCabang = Math.max(1, ...perCabang.map(([, v]) => v.omzet));

  return (
    <div className="flex flex-col gap-5">
      <section className="grid grid-cols-2 gap-3">
        <Kartu label="Total order" nilai={String(orders.length)} />
        <Kartu label="Omzet" nilai={rupiah(omzet)} hijau />
        <Kartu label="Rata-rata per order" nilai={rupiah(rata)} />
        <Kartu label="Cabang terlaris" nilai={perCabang[0]?.[0].replace('Aminoto ', '') ?? '-'} />
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
        <h2 className="text-sm font-bold text-[#06402B]">Per cabang</h2>
        {perCabang.length === 0 && <p className="text-sm text-gray-500">Belum ada order di periode ini.</p>}
        {perCabang.map(([nama, v]) => (
          <div key={nama} className="flex flex-col gap-1.5">
            <div className="flex justify-between gap-3 text-sm">
              <span className="font-semibold text-gray-800">{nama}</span>
              <span className="text-gray-600">{v.count} order · <strong className="text-gray-900">{rupiah(v.omzet)}</strong></span>
            </div>
            <div className="h-2 rounded-full bg-[#F4FBF4] overflow-hidden">
              <div className="h-full bg-[#06402B] rounded-full" style={{ width: `${(v.omzet / maxCabang) * 100}%` }} />
            </div>
          </div>
        ))}
      </section>

      <Rekap title="Per hari" rows={perHari} label={tanggalRamah} />
      <Rekap title="Per bulan" rows={perBulan} label={bulanRamah} />
    </div>
  );
}

function Rekap({ title, rows, label }: { title: string; rows: [string, { count: number; omzet: number }][]; label: (k: string) => string }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <h2 className="text-sm font-bold text-[#06402B] px-4 pt-4 pb-2">{title}</h2>
      {rows.length === 0 && <p className="px-4 pb-4 text-sm text-gray-500">Belum ada data.</p>}
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-3 px-4 py-3 border-t border-gray-100 text-sm">
          <span className="font-semibold text-gray-800 capitalize">{label(k.length === 7 ? k : `${k}T12:00:00+07:00`)}</span>
          <span className="text-gray-600 text-right shrink-0">{v.count} order · <strong className="text-gray-900">{rupiah(v.omzet)}</strong></span>
        </div>
      ))}
    </section>
  );
}

function DaftarOrder({ orders }: { orders: MockOrder[] }) {
  const [cari, setCari] = useState('');
  const q = cari.trim().toLowerCase();
  const hasil = q ? orders.filter(o => o.customer_name.toLowerCase().includes(q) || o.whatsapp.includes(q.replace(/\D/g, '') || q)) : orders;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input className={field} value={cari} onChange={e => setCari(e.target.value)} placeholder="Cari nama atau nomor WA..." aria-label="Cari order" />
        <button onClick={() => exportCsv(hasil)} className="shrink-0 px-3 rounded-xl text-xs font-bold bg-[#D4FF00] text-[#06402B]">Export CSV</button>
      </div>
      <p className="text-xs text-gray-500">{hasil.length} order</p>
      {hasil.map(o => (
        <details key={o.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm open:border-[#06402B]">
          <summary className="list-none cursor-pointer p-4 flex flex-col gap-1">
            <div className="flex justify-between gap-3 text-xs text-gray-500">
              <span className="capitalize">{tanggalRamah(o.created_at)} · {jam(o.created_at)}</span>
              <span className="shrink-0">{o.branch.replace('Aminoto ', '')}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="font-bold text-sm text-gray-900 capitalize">{o.customer_name}</span>
              <span className="font-bold text-sm text-[#06402B] shrink-0">{rupiah(o.total)}</span>
            </div>
            <span className="text-xs text-gray-500 truncate">{o.items.map(i => `${i.qty}x ${i.name}`).join(', ')}</span>
          </summary>
          <div className="px-4 pb-4 flex flex-col gap-2 text-xs text-gray-700 border-t border-dashed border-gray-200 pt-3">
            {o.items.map((i, idx) => (
              <div key={idx} className="flex justify-between gap-3">
                <span>{i.qty}x {i.name}{i.variant ? ` (${i.variant})` : ''}</span>
                <span className="tabular-nums shrink-0">{rupiah(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="flex justify-between"><span className="text-gray-500">WhatsApp</span><span>{o.whatsapp}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Pembayaran</span><span>{o.payment_method}</span></div>
            {o.note && <p className="italic text-gray-500">Catatan: {o.note}</p>}
          </div>
        </details>
      ))}
      {hasil.length === 0 && <p className="text-sm text-gray-500 text-center py-8">Tidak ada order yang cocok.</p>}
    </div>
  );
}

type DraftItem = { menuId: string; qty: number; cook: string; cut: string; egg: string };
const itemBaru = (): DraftItem => ({ menuId: MENU_ITEMS[0].id, qty: 1, cook: '', cut: '', egg: '' });

function infoItem(it: DraftItem) {
  const menu = MENU_ITEMS.find(m => m.id === it.menuId)!;
  const n = menu.name.toLowerCase();
  const butuhMasak = COOK_ITEMS.includes(n);
  const butuhPotong = CUT_ITEMS.includes(n);
  const butuhTelor = n === EGG_ITEM;
  const harga = menu.price + (butuhMasak && it.cook === 'Bakar' ? BAKAR_EXTRA : 0);
  const varian = butuhTelor ? it.egg : [butuhMasak ? it.cook : '', butuhPotong ? it.cut : ''].filter(Boolean).join(', ');
  const lengkap = (!butuhMasak || !!it.cook) && (!butuhPotong || !!it.cut) && (!butuhTelor || !!it.egg);
  return { menu, butuhMasak, butuhPotong, butuhTelor, harga, varian, lengkap };
}

// Kecilkan foto (sisi panjang 1600px, JPEG) lalu jadikan base64 untuk dikirim ke Edge Function.
async function fotoKeBase64(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const skala = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * skala);
  c.height = Math.round(bmp.height * skala);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.85).split(',')[1];
}

const normal = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '');

function TambahOrder({ onSave }: { onSave: (o: MockOrder) => Promise<string | null> }) {
  const [foto, setFoto] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [menyimpan, setMenyimpan] = useState(false);
  const [membaca, setMembaca] = useState(false);
  const [sudahDibaca, setSudahDibaca] = useState(false);
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');
  const [cabang, setCabang] = useState(BRANCHES[0].name);
  const [bayar, setBayar] = useState('');
  const [catatan, setCatatan] = useState('');
  const [items, setItems] = useState<DraftItem[]>([itemBaru()]);
  const [error, setError] = useState('');
  const [sukses, setSukses] = useState('');

  const setItem = (idx: number, patch: Partial<DraftItem>) =>
    setItems(prev => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const total = items.reduce((s, it) => s + infoItem(it).harga * it.qty, 0);

  const pilihFoto = (file: File | undefined) => {
    if (!file) return;
    if (foto) URL.revokeObjectURL(foto);
    setFoto(URL.createObjectURL(file));
    setFotoFile(file);
    setSudahDibaca(false);
    setSukses('');
  };

  const bacaFoto = async () => {
    if (!fotoFile) return;
    if (!supabase) return setError('Supabase belum diset, baca foto tidak tersedia.');
    setMembaca(true);
    setError('');
    try {
      const image = await fotoKeBase64(fotoFile);
      const { data, error: err } = await supabase.functions.invoke('baca-foto', {
        body: { image, mimeType: 'image/jpeg', menu: MENU_ITEMS.map(m => m.name) },
      });
      if (err || data?.error) throw new Error(data?.error || err?.message || 'Gagal membaca foto.');

      const hasil: { name: string; qty: number }[] = data.items ?? [];
      const cocok: DraftItem[] = [];
      const tidakCocok: string[] = [];
      for (const h of hasil) {
        const menu = MENU_ITEMS.find(m => normal(m.name) === normal(h.name))
          ?? MENU_ITEMS.find(m => normal(h.name).includes(normal(m.name)) || normal(m.name).includes(normal(h.name)));
        if (menu) cocok.push({ ...itemBaru(), menuId: menu.id, qty: Math.max(1, Math.round(h.qty) || 1) });
        else tidakCocok.push(h.name);
      }
      if (cocok.length) setItems(cocok);
      if (data.note) setCatatan(String(data.note));
      setSudahDibaca(true);
      if (tidakCocok.length) setError(`Tidak ada di menu, tambahkan manual: ${tidakCocok.join(', ')}`);
      else if (!cocok.length) setError('Tidak ada item terbaca. Coba foto lebih jelas atau isi manual.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal membaca foto.');
    } finally {
      setMembaca(false);
    }
  };

  const simpan = async () => {
    setSukses('');
    if (!nama.trim()) return setError('Nama pemesan wajib diisi.');
    if (!/^\+?[0-9]{9,15}$/.test(wa.replace(/[\s-]/g, ''))) return setError('Nomor WhatsApp tidak valid. Contoh: 081234567890');
    if (!bayar) return setError('Pilih metode pembayaran.');
    if (!catatan.trim()) return setError('Catatan wajib diisi. Tulis "-" kalau tidak ada.');
    const kurang = items.findIndex(it => !infoItem(it).lengkap);
    if (kurang >= 0) return setError(`Item ke-${kurang + 1}: pilih varian dulu.`);

    const orderItems: MockOrderItem[] = items.map(it => {
      const info = infoItem(it);
      return { id: info.menu.id, name: info.menu.name, variant: info.varian || null, qty: it.qty, price: info.harga };
    });
    setMenyimpan(true);
    const gagal = await onSave({
      id: `input-${Date.now()}`,
      created_at: new Date().toISOString(),
      customer_name: nama.trim(),
      whatsapp: wa.replace(/[\s-]/g, ''),
      branch: cabang,
      payment_method: bayar,
      note: catatan.trim() || null,
      items: orderItems,
      total,
    });
    setMenyimpan(false);
    if (gagal) return setError(gagal);
    setNama(''); setWa(''); setCatatan(''); setBayar(''); setItems([itemBaru()]); setError('');
    if (foto) URL.revokeObjectURL(foto);
    setFoto(null); setFotoFile(null); setSudahDibaca(false);
    setSukses(`Order ${nama.trim()} tersimpan (${rupiah(total)}).`);
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
        <h2 className="text-sm font-bold text-[#06402B]">Foto pesanan</h2>
        <p className="text-xs text-gray-500">Foto layar kasir atau nota. Item, jumlah, dan catatan diisi otomatis, lalu cek dulu.</p>
        {foto ? (
          <img src={foto} alt="Foto pesanan" className="w-full max-h-72 object-contain rounded-xl border border-gray-100 bg-gray-50" />
        ) : (
          <label htmlFor="foto-pesanan" className="flex flex-col items-center justify-center gap-1 py-8 rounded-xl border-2 border-dashed border-gray-300 text-sm font-bold text-[#06402B] cursor-pointer">
            Ambil / pilih foto
            <span className="text-xs font-medium text-gray-500">Kamera atau galeri</span>
          </label>
        )}
        <input id="foto-pesanan" type="file" accept="image/*" className="sr-only" onChange={e => { pilihFoto(e.target.files?.[0]); e.target.value = ''; }} />
        {foto && (
          <div className="flex gap-2">
            <label htmlFor="foto-pesanan" className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 text-center cursor-pointer">Ganti foto</label>
            <button type="button" onClick={bacaFoto} disabled={membaca} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#D4FF00] text-[#06402B] disabled:opacity-60">
              {membaca ? 'Membaca...' : sudahDibaca ? 'Baca ulang' : 'Baca foto'}
            </button>
          </div>
        )}
        {sudahDibaca && <p className="text-xs font-medium text-[#A35A08]">Terisi otomatis dari foto. Cek item & jumlah di bawah sebelum simpan.</p>}
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
        <h2 className="text-sm font-bold text-[#06402B]">Data pemesan</h2>
        <label className="flex flex-col gap-1 text-xs font-semibold text-gray-700">Nama pemesan <span className="sr-only">wajib</span>
          <input className={field} value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama lengkap" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-gray-700">Nomor WhatsApp
          <input className={field} type="tel" inputMode="tel" value={wa} onChange={e => setWa(e.target.value)} placeholder="081234567890" />
        </label>
        <div className="flex flex-col gap-1 text-xs font-semibold text-gray-700">Cabang
          <div className="flex gap-2 flex-wrap">
            {BRANCHES.map(b => (
              <button key={b.id} type="button" onClick={() => setCabang(b.name)} className={chip(cabang === b.name)}>{b.name.replace('Aminoto ', '')}</button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 text-xs font-semibold text-gray-700">Pembayaran
          <div className="flex gap-2 flex-wrap">
            {PAYMENTS.map(p => (
              <button key={p} type="button" onClick={() => setBayar(p)} className={chip(bayar === p)}>{p === 'BAYAR DI TEMPAT' ? 'Bayar di tempat' : p}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
        <h2 className="text-sm font-bold text-[#06402B]">Pesanan</h2>
        {items.map((it, idx) => {
          const info = infoItem(it);
          return (
            <div key={idx} className="flex flex-col gap-2 border border-gray-100 rounded-xl p-3">
              <div className="flex gap-2 items-center">
                <select className={field} value={it.menuId} onChange={e => setItem(idx, { menuId: e.target.value, cook: '', cut: '', egg: '' })} aria-label={`Menu item ${idx + 1}`}>
                  {['Makanan', 'Minuman'].map(kat => (
                    <optgroup key={kat} label={kat}>
                      {MENU_ITEMS.filter(m => m.category === kat).map(m => (
                        <option key={m.id} value={m.id}>{m.name} — {rupiah(m.price)}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100 shrink-0">
                  <button type="button" onClick={() => setItem(idx, { qty: Math.max(1, it.qty - 1) })} className="w-8 h-8 rounded-lg bg-white border border-gray-200 font-bold" aria-label="Kurangi">−</button>
                  <span className="w-6 text-center font-bold text-sm">{it.qty}</span>
                  <button type="button" onClick={() => setItem(idx, { qty: it.qty + 1 })} className="w-8 h-8 rounded-lg bg-white border border-gray-200 font-bold" aria-label="Tambah">+</button>
                </div>
              </div>
              {info.butuhMasak && (
                <div className="flex gap-2">
                  {['Goreng', 'Bakar'].map(c => (
                    <button key={c} type="button" onClick={() => setItem(idx, { cook: c })} className={pilihan(it.cook === c)}>{c}{c === 'Bakar' ? ' +2rb' : ''}</button>
                  ))}
                </div>
              )}
              {info.butuhPotong && (
                <div className="flex gap-2">
                  {['Paha', 'Dada'].map(c => (
                    <button key={c} type="button" onClick={() => setItem(idx, { cut: c })} className={pilihan(it.cut === c)}>{c}</button>
                  ))}
                </div>
              )}
              {info.butuhTelor && (
                <div className="flex gap-2">
                  {['Dadar', 'Ceplok'].map(c => (
                    <button key={c} type="button" onClick={() => setItem(idx, { egg: c })} className={pilihan(it.egg === c)}>{c}</button>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Subtotal <strong className="text-gray-900">{rupiah(info.harga * it.qty)}</strong></span>
                {items.length > 1 && (
                  <button type="button" onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))} className="font-bold text-red-500">Hapus</button>
                )}
              </div>
            </div>
          );
        })}
        <button type="button" onClick={() => setItems(prev => [...prev, itemBaru()])} className="py-2.5 rounded-xl border border-dashed border-gray-300 text-sm font-bold text-[#06402B]">+ Tambah item</button>
        <label className="flex flex-col gap-1 text-xs font-semibold text-gray-700">Catatan
          <input className={field} value={catatan} onChange={e => setCatatan(e.target.value)} placeholder="mis. sambal pisah" />
        </label>
      </section>

      <div className="sticky bottom-0 bg-[#FDFBF7] pt-2 pb-4 flex flex-col gap-2">
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        {sukses && <p className="text-xs font-medium text-[#06402B]">{sukses}</p>}
        <button type="button" onClick={simpan} disabled={menyimpan} className="w-full disabled:opacity-60 py-4 rounded-2xl text-sm font-bold bg-[#06402B] text-white shadow-md">
          {menyimpan ? 'Menyimpan...' : `Simpan order · ${rupiah(total)}`}
        </button>
      </div>
    </div>
  );
}

type Tab = 'ringkasan' | 'order' | 'tambah';
const TABS: { id: Tab; label: string }[] = [
  { id: 'ringkasan', label: 'Ringkasan' },
  { id: 'order', label: 'Order' },
  { id: 'tambah', label: '+ Tambah' },
];

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const masuk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) setError('Email atau password salah.');
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#FDFBF7] p-5">
      <form onSubmit={masuk} className="w-full max-w-sm bg-white rounded-3xl border border-gray-200 p-6 shadow-md flex flex-col gap-4">
        <div className="flex flex-col">
          <span className="font-extrabold text-[#06402B] text-lg tracking-tight uppercase">AMINOTO</span>
          <h1 className="text-sm font-semibold text-gray-500">Login Admin</h1>
        </div>
        <input id="admin-email" type="email" required autoComplete="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className={field} />
        <input id="admin-password" type="password" required autoComplete="current-password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className={field} />
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        <button disabled={busy} className="w-full py-3 rounded-xl font-bold text-sm bg-[#06402B] text-white disabled:opacity-60">{busy ? 'Masuk...' : 'Masuk'}</button>
      </form>
    </div>
  );
}

export function Admin() {
  const [sesi, setSesi] = useState<boolean | null>(supabase ? null : true);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSesi(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setSesi(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (sesi === null) return <div className="min-h-[100dvh] bg-[#FDFBF7] p-5 text-sm text-gray-500">Memuat...</div>;
  if (!sesi) return <Login />;
  return <Dashboard />;
}

function Dashboard() {
  const [tab, setTab] = useState<Tab>('ringkasan');
  const [branch, setBranch] = useState('Semua');
  const [periode, setPeriode] = useState<Periode>('semua');
  const [data, setData] = useState<MockOrder[]>(supabase ? [] : MOCK_ORDERS);
  const [memuat, setMemuat] = useState(!!supabase);
  const [loadError, setLoadError] = useState('');

  const muat = async () => {
    if (!supabase) return;
    setMemuat(true);
    const { data: rows, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5000);
    setLoadError(error ? `Gagal memuat order: ${error.message}` : '');
    if (!error) setData((rows as MockOrder[]) ?? []);
    setMemuat(false);
  };
  useEffect(() => { muat(); }, []);

  const simpanOrder = async (o: MockOrder): Promise<string | null> => {
    if (!supabase) { setData(prev => [o, ...prev]); return null; }
    const { id: _id, created_at: _c, ...baris } = o;
    const { error } = await supabase.from('orders').insert(baris);
    if (error) return `Gagal menyimpan: ${error.message}`;
    await muat();
    return null;
  };

  const keluar = () => { supabase?.auth.signOut(); };

  const orders = useMemo(
    () => data
      .filter(o => branch === 'Semua' || o.branch === branch)
      .filter(o => dalamPeriode(o.created_at, periode))
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1)),
    [data, branch, periode],
  );

  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7]">
      <div className="max-w-2xl mx-auto px-5 pb-10 flex flex-col gap-4">
        <header className="sticky top-0 z-10 bg-[#FDFBF7] pt-5 pb-3 flex flex-col gap-3 border-b border-gray-100">
          <div className="flex justify-between items-end gap-3">
            <div className="flex flex-col">
              <span className="font-extrabold text-[#06402B] text-lg tracking-tight uppercase leading-none">AMINOTO</span>
              <h1 className="text-sm font-semibold text-gray-500 mt-1">Admin{!supabase && <> · <span className="text-[#A35A08]">data contoh</span></>}</h1>
            </div>
            {supabase && (
              <div className="flex gap-2">
                <button onClick={muat} className="px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white">{memuat ? 'Memuat...' : 'Muat ulang'}</button>
                <button onClick={keluar} className="px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white">Keluar</button>
              </div>
            )}
          </div>
          <nav className="grid grid-cols-3 gap-1 bg-white border border-gray-200 rounded-2xl p-1" role="tablist" aria-label="Menu admin">
            {TABS.map(t => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
                className={`py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t.id ? 'bg-[#06402B] text-white' : 'text-gray-600'}`}>
                {t.label}
              </button>
            ))}
          </nav>
        </header>

        {loadError && <p className="text-sm text-red-500 font-medium">{loadError}</p>}

        {tab !== 'tambah' && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar" aria-label="Filter periode">
              {PERIODE.map(p => <button key={p.id} onClick={() => setPeriode(p.id)} className={chip(periode === p.id)}>{p.label}</button>)}
            </div>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar" aria-label="Filter cabang">
              {['Semua', ...BRANCHES.map(b => b.name)].map(n => (
                <button key={n} onClick={() => setBranch(n)} className={chip(branch === n)}>{n === 'Semua' ? 'Semua cabang' : n.replace('Aminoto ', '')}</button>
              ))}
            </div>
          </div>
        )}

        {tab === 'ringkasan' && <Ringkasan orders={orders} />}
        {tab === 'order' && <DaftarOrder orders={orders} />}
        {tab === 'tambah' && <TambahOrder onSave={simpanOrder} />}
      </div>
    </div>
  );
}
