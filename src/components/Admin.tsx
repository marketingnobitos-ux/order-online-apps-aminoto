import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

type OrderItem = { id: string; name: string; variant: string | null; qty: number; price: number };
type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  whatsapp: string;
  branch: string;
  payment_method: string;
  note: string | null;
  items: OrderItem[];
  total: number;
};

const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

// Tanggal dihitung di zona Asia/Jakarta (WIB), bukan zona perangkat admin.
const dayKey = (iso: string) => new Date(iso).toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' }); // YYYY-MM-DD
const monthKey = (iso: string) => dayKey(iso).slice(0, 7); // YYYY-MM

function groupBy(orders: Order[], keyFn: (o: Order) => string) {
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

function exportCsv(orders: Order[]) {
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

function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError('Email atau password salah.');
    else onDone();
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#FDFBF7] p-5">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-3xl border border-gray-100 p-6 shadow-md flex flex-col gap-4">
        <h1 className="text-xl font-bold text-gray-900">Login Admin Aminoto</h1>
        <input
          type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#06402B]"
        />
        <input
          type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#06402B]"
        />
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        <button disabled={busy} className="w-full py-3 rounded-xl font-bold text-sm bg-[#06402B] text-white disabled:opacity-60">
          {busy ? 'Masuk...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const load = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5000);
    if (error) setLoadError('Gagal memuat order: ' + error.message);
    else setLoadError('');
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const totalOmzet = useMemo(() => orders.reduce((s, o) => s + o.total, 0), [orders]);
  const perDay = useMemo(() => groupBy(orders, o => dayKey(o.created_at)), [orders]);
  const perMonth = useMemo(() => groupBy(orders, o => monthKey(o.created_at)), [orders]);
  const perBranch = useMemo(() => groupBy(orders, o => o.branch), [orders]);

  const logout = async () => {
    await supabase?.auth.signOut();
    onLogout();
  };

  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] p-5 flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Rekap Order Aminoto</h1>
        <div className="flex gap-2">
          <button onClick={load} className="px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white">Muat ulang</button>
          <button onClick={() => exportCsv(orders)} className="px-3 py-2 rounded-xl text-xs font-bold bg-[#D4FF00] text-[#06402B]">Export CSV</button>
          <button onClick={logout} className="px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white">Keluar</button>
        </div>
      </header>

      {loadError && <p className="text-sm text-red-500 font-medium">{loadError}</p>}
      {loading && <p className="text-sm text-gray-500">Memuat...</p>}

      <section className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-[11px] text-gray-500 font-semibold">Total order</p>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-[11px] text-gray-500 font-semibold">Total omzet</p>
          <p className="text-2xl font-bold text-[#06402B]">{rupiah(totalOmzet)}</p>
        </div>
      </section>

      <Summary title="Per bulan" rows={perMonth} />
      <Summary title="Per hari" rows={perDay} />
      <Summary title="Per cabang" rows={perBranch} />

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-gray-900">Daftar order</h2>
        {orders.map(o => (
          <div key={o.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col gap-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{new Date(o.created_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</span>
              <span>{o.branch}</span>
            </div>
            <p className="font-bold text-sm text-gray-900 capitalize">{o.customer_name.toLowerCase()} · {o.whatsapp}</p>
            <p className="text-xs text-gray-700">
              {o.items.map(i => `${i.qty}x ${i.name}${i.variant ? ` (${i.variant})` : ''}`).join(', ')}
            </p>
            {o.note && <p className="text-xs italic text-gray-500">Catatan: {o.note}</p>}
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-500">{o.payment_method}</span>
              <span className="font-bold text-gray-900">{rupiah(o.total)}</span>
            </div>
          </div>
        ))}
        {!loading && orders.length === 0 && <p className="text-sm text-gray-500">Belum ada order.</p>}
      </section>
    </div>
  );
}

function Summary({ title, rows }: { title: string; rows: [string, { count: number; omzet: number }][] }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {rows.length === 0 && <p className="p-4 text-sm text-gray-500">Belum ada data.</p>}
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between px-4 py-3 border-b border-gray-50 last:border-0 text-sm">
            <span className="font-semibold text-gray-800">{k}</span>
            <span className="text-gray-600">{v.count} order · <strong className="text-gray-900">{rupiah(v.omzet)}</strong></span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Admin() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    if (!supabase) { setLoggedIn(false); return; }
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setLoggedIn(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!supabase) {
    return <div className="p-5 text-sm text-red-500">Supabase belum diset (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).</div>;
  }
  if (loggedIn === null) return <div className="p-5 text-sm text-gray-500">Memuat...</div>;
  if (!loggedIn) return <Login onDone={() => setLoggedIn(true)} />;
  return <Dashboard onLogout={() => setLoggedIn(false)} />;
}
