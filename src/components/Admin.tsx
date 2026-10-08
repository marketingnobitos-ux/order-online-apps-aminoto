import React, { useMemo, useState } from 'react';
import { MOCK_ORDERS, MockOrder } from '../lib/mock-orders';
import { BRANCHES } from '../data';

// Tahap UI: data masih palsu (mock-orders.ts). Login & Supabase menyusul setelah backend siap.

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

export function Admin() {
  const [branch, setBranch] = useState<string>('Semua');
  const [reloadKey, setReloadKey] = useState(0); // tombol Muat ulang (saat backend ada, ini memanggil Supabase)

  const orders = useMemo(
    () => (branch === 'Semua' ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.branch === branch)),
    [branch, reloadKey],
  );

  const totalOmzet = useMemo(() => orders.reduce((s, o) => s + o.total, 0), [orders]);
  const perDay = useMemo(() => groupBy(orders, o => dayKey(o.created_at)), [orders]);
  const perMonth = useMemo(() => groupBy(orders, o => monthKey(o.created_at)), [orders]);
  const perBranch = useMemo(() => groupBy(MOCK_ORDERS, o => o.branch), []);

  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] p-5 flex flex-col gap-6">
      <header className="flex justify-between items-center gap-3 flex-wrap">
        <div className="flex flex-col">
          <span className="font-extrabold text-[#06402B] text-lg tracking-tight uppercase">AMINOTO</span>
          <h1 className="text-sm font-semibold text-gray-500">Rekap Order · <span className="text-[#A35A08]">data contoh</span></h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setReloadKey(k => k + 1)} className="px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white">Muat ulang</button>
          <button onClick={() => exportCsv(orders)} className="px-3 py-2 rounded-xl text-xs font-bold bg-[#D4FF00] text-[#06402B]">Export CSV</button>
        </div>
      </header>

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
              {o.items.map(i => (
                <div key={i.id + (i.variant ?? '')} className="flex justify-between gap-3">
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
