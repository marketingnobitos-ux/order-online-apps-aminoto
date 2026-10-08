// DATA CONTOH untuk UI admin. Bukan order asli. Dihapus saat backend Supabase siap.
// Bentuk field sama dengan tabel orders (lihat supabase/schema.sql).

export type MockOrderItem = { id: string; name: string; variant: string | null; qty: number; price: number };

export type MockOrder = {
  id: string;
  created_at: string; // ISO
  customer_name: string;
  whatsapp: string;
  branch: string;
  payment_method: string;
  note: string | null;
  items: MockOrderItem[];
  total: number;
};

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: 'mock-1',
    created_at: '2026-10-08T12:42:00+07:00',
    customer_name: 'budi santoso',
    whatsapp: '081200000001',
    branch: 'Aminoto Cipto',
    payment_method: 'QRIS',
    note: 'sambal pisah',
    items: [
      { id: 'm1', name: 'Pecel Lele', variant: null, qty: 1, price: 18000 },
      { id: 'm2', name: 'Ayam Negri', variant: 'Bakar, Paha', qty: 1, price: 25000 },
      { id: 'd3', name: 'Es Teh Manis', variant: null, qty: 1, price: 5000 },
    ],
    total: 48000,
  },
  {
    id: 'mock-2',
    created_at: '2026-10-08T11:18:00+07:00',
    customer_name: 'rina maulida',
    whatsapp: '081200000002',
    branch: 'Aminoto Sumber',
    payment_method: 'BAYAR DI TEMPAT',
    note: null,
    items: [{ id: 'm4', name: 'Bebek', variant: 'Goreng, Dada', qty: 1, price: 33000 }],
    total: 33000,
  },
  {
    id: 'mock-3',
    created_at: '2026-10-07T19:05:00+07:00',
    customer_name: 'andi pratama',
    whatsapp: '081200000003',
    branch: 'Aminoto Ciledug',
    payment_method: 'BCA',
    note: null,
    items: [
      { id: 'm1', name: 'Pecel Lele', variant: null, qty: 2, price: 18000 },
      { id: 't13', name: 'Telor Dadar / Ceplok', variant: 'Dadar', qty: 1, price: 7000 },
    ],
    total: 43000,
  },
  {
    id: 'mock-4',
    created_at: '2026-10-07T13:30:00+07:00',
    customer_name: 'sari dewi',
    whatsapp: '081200000004',
    branch: 'Aminoto Cipto',
    payment_method: 'QRIS',
    note: 'tanpa kol',
    items: [
      { id: 'm5', name: 'Nila', variant: 'Bakar', qty: 1, price: 27000 },
      { id: 'd13', name: 'Teh Manis Hangat', variant: null, qty: 2, price: 5000 },
    ],
    total: 37000,
  },
  {
    id: 'mock-5',
    created_at: '2026-10-06T10:02:00+07:00',
    customer_name: 'hendra',
    whatsapp: '081200000005',
    branch: 'Aminoto Sumber',
    payment_method: 'BCA',
    note: null,
    items: [{ id: 'm7', name: 'Tahu', variant: null, qty: 3, price: 3000 }],
    total: 9000,
  },
];
