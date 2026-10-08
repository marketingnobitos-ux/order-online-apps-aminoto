import React, { useMemo, useState } from 'react';
import { MOCK_ORDERS, MockOrder, MockOrderItem } from '../lib/mock-orders';
import { BRANCHES, MENU_ITEMS } from '../data';

// Tahap UI: data masih palsu (mock-orders.ts). Order yang diinput admin hanya disimpan di memori
// sampai refresh. Login & Supabase menyusul setelah backend siap.

const PAYMENTS = ['QRIS', 'BCA', 'BAYAR DI TEMPAT'];
const BAKAR_EXTRA = 2000; // sama dengan aturan di Menu.tsx

const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

// Tanggal dihitung di zona Asia/Jakarta (WIB), bukan zona perangkat.
const dayKey = (iso: string) => new Date(iso).toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });
const monthKey = (iso: string) => dayKey(iso).slice(0, 7);

function groupBy(orders: MockOrder[], keyFn: (o: MockOrder) => string) {
  const map = new Map<string, { count: number; omzet: number }>();
  for (const o of orders) {
    const k = keyFn(o);
    const cur = map.get(k) ?? { count: 0, omzet: 0 };
    cur.count += 1;
    cur.omzet += o.total;
    map.set(k, cur);
  }
  return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

function exportCsv(orders: MockOrder[]) {
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const header = ['Waktu (WIB)', 'Nama', 'WhatsApp', 'Cabang', 'Pembayaran', 'Item', 'Catatan', 'Total'];
  const rows = orders.map(o => [
    new Date(o.created_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
    o.customer_name,
    o.whatsapp,
    o.branch,
    o.payment_method,
    o.items.map(i => `${i.qty}x ${i.name}${i.variant ? ` (${i.variant})` : ''}`).join('; '),
    o.note ?? '',
    o.total,
  ]);
  const csv = [header, ...rows].map(r => r.map(esc).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }); // BOM agar Excel baca UTF-8
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `rekap-order-${dayKey(new Date().toISOString())}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function Summary({ title, rows }: { title: string; rows: [string, { count: number; omzet: number }][] }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-base font-bold text-[#06402B]">{title}</h2>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {rows.length === 0 && <p className="p-4 text-sm text-gray-500">Belum ada data.</p>}
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 px-4 py-3 border-b border-gray-100 last:border-0 text-sm">
            <span className="font-semibold text-gray-800">{k}</span>
            <span className="text-gray-600 text-right">
              {v.count} order · <strong className="text-gray-900">{rupiah(v.omzet)}</strong>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

type DraftItem = { menuId: string; qty: number; variant: string };

function TambahOrder({ onSave, onCancel }: { onSave: (o: MockOrder) => void; onCancel: () => void }) {
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');
  const [cabang, setCabang] = useState(BRANCHES[0].name);
  const [bayar, setBayar] = useState(PAYMENTS[0]);
  const [catatan, setCatatan] = useState('');
  const [items, setItems] = useState<DraftItem[]>([{ menuId: MENU_ITEMS[0].id, qty: 1, variant: '' }]);
  const [error, setError] = useState('');

  const setItem = (idx: number, patch: Partial<DraftItem>) =>
    setItems(prev => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const hitung = (it: DraftItem) => {
    const menu = MENU_ITEMS.find(m => m.id === it.menuId);
    if (!menu) return 0;
    const extra = /bakar/i.test(it.variant) ? BAKAR_EXTRA : 0;
    return (menu.price + extra) * it.qty;
  };
  const total = items.reduce((s, it) => s + hitung(it), 0);

  const simpan = () => {
    if (!nama.trim()) return setError('Nama wajib diisi.');
    if (!/^[0-9+]{9,15}$/.test(wa.replace(/[\s-]/g, ''))) return setError('Nomor WhatsApp tidak valid.');
    if (items.some(it => it.qty < 1)) return setError('Jumlah minimal 1.');

    const orderItems: MockOrderItem[] = items.map(it => {
      const menu = MENU_ITEMS.find(m => m.id === it.menuId)!;
      const extra = /bakar/i.test(it.variant) ? BAKAR_EXTRA : 0;
      return {
        id: menu.id,
        name: menu.name,
        variant: it.variant.trim() || null,
        qty: it.qty,
        price: menu.price + extra,
      };
    });

    onSave({
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
  };

  const field = 'w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:border-[#06402B]';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-[#06402B]">Tambah order manual</h2>
        <button onClick={onCancel} className="text-xs font-bold text-gray-500">Batal</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-xs font-semibold text-gray-700">Nama pemesan
          <input className={field} value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-gray-700">Nomor WhatsApp
          <input className={field} type="tel" value={wa} onChange={e => setWa(e.target.value)} placeholder="081234567890" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-gray-700">Cabang
          <select className={field} value={cabang} onChange={e => setCabang(e.target.value)}>
            {BRANCHES.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-gray-700">Pembayaran
          <select className={field} value={bayar} onChange={e => setBayar(e.target.value)}>
            {PAYMENTS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-gray-700">Item</span>
        {items.map((it, idx) => (
          <div key={idx} className="grid grid-cols-[minmax(0,1fr)_64px] sm:grid-cols-[minmax(0,1.4fr)_64px_minmax(0,1fr)_auto] gap-2 items-center">
            <select className={field} value={it.menuId} onChange={e => setItem(idx, { menuId: e.target.value })}>
              {['Makanan', 'Minuman'].map(kat => (
                <optgroup key={kat} label={kat}>
                  {MENU_ITEMS.filter(m => m.category === kat).map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <input className={field} type="number" min={1} value={it.qty} onChange={e => setItem(idx, { qty: Math.max(1, Number(e.target.value) || 1) })} aria-label="Jumlah" />
            <input className={`${field} col-span-2 sm:col-span-1`} value={it.variant} onChange={e => setItem(idx, { variant: e.target.value })} placeholder="Varian, mis. Bakar, Paha" aria-label="Varian" />
            {items.length > 1 && (
              <button onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))} className="text-xs font-bold text-red-500 justify-self-end">Hapus</button>
            )}
          </div>
        ))}
        <button onClick={() => setItems(prev => [...prev, { menuId: MENU_ITEMS[0].id, qty: 1, variant: '' }])} className="self-start text-xs font-bold text-[#06402B]">+ Tambah item</button>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-gray-700">Catatan (opsional)
        <input className={field} value={catatan} onChange={e => setCatatan(e.target.value)} placeholder="mis. sambal pisah" />
      </label>

      <div className="flex justify-between items-center gap-3 flex-wrap border-t border-gray-100 pt-3">
        <span className="text-sm text-gray-600">Total <strong className="text-gray-900">{rupiah(total)}</strong></span>
        <button onClick={simpan} className="px-4 py-2.5 rounded-xl text-sm font-bold bg-[#06402B] text-white">Simpan order</button>
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

export function Admin() {
  const [branch, setBranch] = useState<string>('Semua');
  const [reloadKey, setReloadKey] = useState(0); // tombol Muat ulang (nanti memanggil Supabase)
  const [manual, setManual] = useState<MockOrder[]>([]);
  const [showForm, setShowForm] = useState(false);

  const allOrders = useMemo(() => [...manual, ...MOCK_ORDERS], [manual]);

  const orders = useMemo(
    () => (branch === 'Semua' ? allOrders : allOrders.filter(o => o.branch === branch)),
    [allOrders, branch, reloadKey],
  );

  const totalOmzet = useMemo(() => orders.reduce((s, o) => s + o.total, 0), [orders]);
  const perDay = useMemo(() => groupBy(orders, o => dayKey(o.created_at)), [orders]);
  const perMonth = useMemo(() => groupBy(orders, o => monthKey(o.created_at)), [orders]);
  const perBranch = useMemo(() => groupBy(allOrders, o => o.branch), [allOrders]);

  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] p-5 flex flex-col gap-6">
      <header className="flex justify-between items-center gap-3 flex-wrap">
        <div className="flex flex-col">
          <span className="font-extrabold text-[#06402B] text-lg tracking-tight uppercase">AMINOTO</span>
          <h1 className="text-sm font-semibold text-gray-500">Rekap Order · <span className="text-[#A35A08]">data contoh</span></h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowForm(s => !s)} className="px-3 py-2 rounded-xl text-xs font-bold bg-[#06402B] text-white">+ Tambah Order</button>
          <button onClick={() => setReloadKey(k => k + 1)} className="px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white">Muat ulang</button>
          <button onClick={() => exportCsv(orders)} className="px-3 py-2 rounded-xl text-xs font-bold bg-[#D4FF00] text-[#06402B]">Export CSV</button>
        </div>
      </header>

      {showForm && (
        <TambahOrder
          onSave={o => { setManual(prev => [o, ...prev]); setShowForm(false); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="flex gap-2 overflow-x-auto hide-scrollbar" role="tablist" aria-label="Filter cabang">
        {['Semua', ...BRANCHES.map(b => b.name)].map(name => (
          <button
            key={name}
            role="tab"
            aria-selected={branch === name}
            onClick={() => setBranch(name)}
            className={`shrink-0 px-4 py-2 rounded-xl text-[13px] font-bold border transition-all ${branch === name ? 'bg-[#06402B] text-white border-transparent' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            {name}
          </button>
        ))}
      </div>

      <section className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <p className="text-[11px] text-gray-500 font-semibold">Total order</p>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <p className="text-[11px] text-gray-500 font-semibold">Total omzet</p>
          <p className="text-2xl font-bold text-[#06402B]">{rupiah(totalOmzet)}</p>
        </div>
      </section>

      <Summary title="Per bulan" rows={perMonth} />
      <Summary title="Per hari" rows={perDay} />
      <Summary title="Per cabang (semua)" rows={perBranch} />

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-[#06402B]">Daftar order</h2>
        {orders.map(o => (
          <details key={o.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <summary className="list-none cursor-pointer p-4 flex flex-col gap-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{new Date(o.created_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</span>
                <span>{o.branch}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="font-bold text-sm text-gray-900 capitalize">{o.customer_name}</span>
                <span className="font-bold text-sm text-gray-900">{rupiah(o.total)}</span>
              </div>
            </summary>
            <div className="px-4 pb-4 flex flex-col gap-2 text-xs text-gray-700 border-t border-dashed border-gray-200 pt-3">
              {o.items.map((i, idx) => (
                <div key={idx} className="flex justify-between gap-3">
                  <span>{i.qty}x {i.name}{i.variant ? ` (${i.variant})` : ''}</span>
                  <span className="tabular-nums">{rupiah(i.price * i.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between"><span className="text-gray-500">WhatsApp</span><span>{o.whatsapp}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Pembayaran</span><span>{o.payment_method}</span></div>
              {o.note && <p className="italic text-gray-500">Catatan: {o.note}</p>}
            </div>
          </details>
        ))}
        {orders.length === 0 && <p className="text-sm text-gray-500">Belum ada order.</p>}
      </section>
    </div>
  );
}
