import { Branch, MenuItem } from './types';

export const BRANCHES: Branch[] = [
  {
    id: 'cipto',
    name: 'Aminoto Cipto',
    address: 'Jl. DR. Cipto Mangunkusumo No.199, Pekiringan, Kec. Kesambi, Kota Cirebon, Jawa Barat 45132',
    mapsUrl: 'https://www.google.com/maps/place/Pecel+Lele+Sambel+Dadak+Aminoto/@-6.7228936,108.5501909,950m/data=!3m2!1e3!4b1!4m6!3m5!1s0x2e6ee3a563e85147:0xacc385845008a051!8m2!3d-6.7228936!4d108.5501909!16s%2Fg%2F11x0q5tsk2',
    status: 'BUKA',
    hours: '10.00 - 22.00',
  },
  {
    id: 'sumber',
    name: 'Aminoto Sumber',
    address: 'Jl. Pangeran Cakrabuana No.8, Kemantren, Kec. Sumber, Kabupaten Cirebon, Jawa Barat 45611',
    mapsUrl: 'https://www.google.com/maps/place/Pecel+Lele+Sambel+Dadak+Aminoto+Sumber/@-6.7585171,108.4922366,950m/data=!3m2!1e3!4b1!4m6!3m5!1s0x2e6f1f32b0accab7:0xe032e0ec913fd605!8m2!3d-6.7585171!4d108.4922366!16s%2Fg%2F11zhv9jv3w',
    status: 'BUKA',
    hours: '10.00 - 22.00',
  },
  {
    id: 'ciledug',
    name: 'Aminoto Ciledug',
    address: 'Ciledug Tengah, Kec. Ciledug, Kabupaten Cirebon, Jawa Barat 45188',
    mapsUrl: 'https://maps.app.goo.gl/5w4LEtTEFnhvY5Jy6',
    status: 'BUKA',
    hours: '10.00 - 22.00',
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // Makanan
  { id: 'm1', name: 'Pecel Lele', price: 18000, category: 'Makanan' },
  { id: 'm2', name: 'Ayam Negri', price: 23000, category: 'Makanan' },
  { id: 'm3', name: 'Ayam Kampung', price: 30000, category: 'Makanan' },
  { id: 'm4', name: 'Bebek', price: 33000, category: 'Makanan' },
  { id: 'm5', name: 'Nila', price: 25000, category: 'Makanan' },
  { id: 'm6', name: 'Gurame', price: 35000, category: 'Makanan' },

  // Minuman
  { id: 'd1', name: 'Tawar Hangat', price: 3000, category: 'Minuman' },
  { id: 'd2', name: 'Es Teh Manis', price: 3000, category: 'Minuman' },
  { id: 'd3', name: 'Teh Manis Hangat', price: 5000, category: 'Minuman' },
  { id: 'd4', name: 'Es Jeruk', price: 10000, category: 'Minuman' },
  { id: 'd5', name: 'Jeruk Panas', price: 7000, category: 'Minuman' },
  { id: 'd6', name: 'Air Mineral Samore', price: 5000, category: 'Minuman' },
  { id: 'd7', name: 'Kopi Sunyaragi', price: 8000, category: 'Minuman' },
  { id: 'd8', name: 'Teh Pucuk', price: 5000, category: 'Minuman' },
  { id: 'd9', name: 'Nipis Madu', price: 7000, category: 'Minuman' },
  { id: 'd10', name: 'Es Teh Kampul', price: 8000, category: 'Minuman' },
  { id: 'd11', name: 'Es Tjampolay', price: 8000, category: 'Minuman' },

  // Menu Tambahan
  { id: 't1', name: 'Tahu', price: 3000, category: 'Menu Tambahan' },
  { id: 't2', name: 'Tempe', price: 3000, category: 'Menu Tambahan' },
  { id: 't3', name: 'Sayur Asem', price: 7000, category: 'Menu Tambahan' },
  { id: 't4', name: 'Sambal Korek', price: 7000, category: 'Menu Tambahan' },
  { id: 't5', name: 'Sambel Bawang', price: 7000, category: 'Menu Tambahan' },
  { id: 't6', name: 'Sambel Dadak Xtra', price: 10000, category: 'Menu Tambahan' },
  { id: 't7', name: 'Ati Ampela', price: 10000, category: 'Menu Tambahan' },
  { id: 't8', name: 'Kepala Ayam', price: 7000, category: 'Menu Tambahan' },
  { id: 't9', name: 'Cumi Asin', price: 10000, category: 'Menu Tambahan' },
  { id: 't10', name: 'Sate Usus', price: 5000, category: 'Menu Tambahan' },
  { id: 't11', name: 'Sate Kulit', price: 7000, category: 'Menu Tambahan' },
  { id: 't12', name: 'Pete', price: 15000, category: 'Menu Tambahan' },
  { id: 't13', name: 'Telor Dadar / Ceplok', price: 7000, category: 'Menu Tambahan' },
  { id: 't14', name: 'Kol Goreng', price: 6000, category: 'Menu Tambahan' },
  { id: 't15', name: 'Jukut Goreng', price: 8000, category: 'Menu Tambahan' },
  { id: 't16', name: 'Pencok Katel', price: 8000, category: 'Menu Tambahan' },
  { id: 't17', name: 'Nasi Putih', price: 5000, category: 'Menu Tambahan' },
  { id: 't18', name: 'Krupuk 1 Bungkus', price: 5000, category: 'Menu Tambahan' }
];

// ── Konfigurasi terpusat ──────────────────────────────────────────
// Nomor WhatsApp Admin. Ubah DI SINI saja; dipakai di Review & Home.
export const ADMIN_WHATSAPP = '6288213044259';

// Jam layanan pemesanan online (WIB / Asia-Jakarta), 24 jam.
// Catatan: ini jam ORDER ONLINE, terpisah dari jam fisik outlet.
export const ONLINE_ORDER_OPEN_HOUR = 10;
export const ONLINE_ORDER_CLOSE_HOUR = 20;

// Selalu hitung jam di zona Asia/Jakarta, bukan jam perangkat pelanggan.
export function getJakartaHour(): number {
  const h = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    hour12: false,
  }).format(new Date());
  return parseInt(h, 10);
}

export function isOnlineOrderOpen(): boolean {
  const h = getJakartaHour();
  return h >= ONLINE_ORDER_OPEN_HOUR && h < ONLINE_ORDER_CLOSE_HOUR;
}
