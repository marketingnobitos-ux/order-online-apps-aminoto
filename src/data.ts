import { Branch, MenuItem } from './types';

export const BRANCHES: Branch[] = [
  {
    id: 'cipto',
    name: 'Aminoto Cipto',
    address: 'Jl. DR. Cipto Mangunkusumo No.199, Pekiringan, Kec. Kesambi, Kota Cirebon, Jawa Barat 45132',
    mapsUrl: 'https://www.google.com/maps/place/Pecel+Lele+Sambel+Dadak+Aminoto/@-6.7228936,108.5501909,950m/data=!3m2!1e3!4b1!4m6!3m5!1s0x2e6ee3a563e85147:0xacc385845008a051!8m2!3d-6.7228936!4d108.5501909!16s%2Fg%2F11x0q5tsk2',
  },
  {
    id: 'sumber',
    name: 'Aminoto Sumber',
    address: 'Jl. Pangeran Cakrabuana No.8, Kemantren, Kec. Sumber, Kabupaten Cirebon, Jawa Barat 45611',
    mapsUrl: 'https://www.google.com/maps/place/Pecel+Lele+Sambel+Dadak+Aminoto+Sumber/@-6.7585171,108.4922366,950m/data=!3m2!1e3!4b1!4m6!3m5!1s0x2e6f1f32b0accab7:0xe032e0ec913fd605!8m2!3d-6.7585171!4d108.4922366!16s%2Fg%2F11zhv9jv3w',
  },
  {
    id: 'ciledug',
    name: 'Aminoto Ciledug',
    address: 'Ciledug Tengah, Kec. Ciledug, Kabupaten Cirebon, Jawa Barat 45188',
    mapsUrl: 'https://maps.app.goo.gl/5w4LEtTEFnhvY5Jy6',
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // Makanan
  { id: 'm23', name: 'Nasi Putih', price: 5000, category: 'Makanan' },
  { id: 'm1', name: 'Pecel Lele', price: 18000, category: 'Makanan' },
  { id: 'm2', name: 'Ayam Negri', price: 23000, category: 'Makanan' },
  { id: 'm3', name: 'Ayam Kampung', price: 30000, category: 'Makanan' },
  { id: 'm4', name: 'Bebek', price: 33000, category: 'Makanan' },
  { id: 'm5', name: 'Nila', price: 25000, category: 'Makanan' },
  { id: 'm6', name: 'Gurame', price: 30000, category: 'Makanan' },
  { id: 'm7', name: 'Tahu', price: 3000, category: 'Makanan' },
  { id: 'm8', name: 'Tempe', price: 3000, category: 'Makanan' },
  { id: 'm9', name: 'Sayur Asem', price: 7000, category: 'Makanan' },
  { id: 'm10', name: 'Sambal Korek', price: 7000, category: 'Makanan' },
  { id: 'm11', name: 'Sambel Bawang', price: 7000, category: 'Makanan' },
  { id: 'm12', name: 'Sambel Dadak Xtra', price: 10000, category: 'Makanan' },
  { id: 'm13', name: 'Ati Ampela', price: 10000, category: 'Makanan' },
  { id: 'm14', name: 'Kepala Ayam', price: 7000, category: 'Makanan' },
  { id: 'm15', name: 'Cumi Asin', price: 10000, category: 'Makanan' },
  { id: 'm16', name: 'Sate Usus', price: 5000, category: 'Makanan' },
  { id: 'm17', name: 'Sate Kulit', price: 7000, category: 'Makanan' },
  { id: 'm18', name: 'Pete', price: 15000, category: 'Makanan' },
  { id: 'm19', name: 'Telor Dadar / Ceplok', price: 7000, category: 'Makanan' },
  { id: 'm20', name: 'Kol Goreng', price: 6000, category: 'Makanan' },
  { id: 'm21', name: 'Jukut Goreng', price: 8000, category: 'Makanan' },
  { id: 'm22', name: 'Pencok Katel', price: 8000, category: 'Makanan' },
  { id: 'm24', name: 'Krupuk 1 Bungkus', price: 5000, category: 'Makanan' },

  // Minuman
  { id: 'd13', name: 'Teh Manis Hangat', price: 5000, category: 'Minuman' },
  { id: 'd1', name: 'Tawar Hangat', price: 3000, category: 'Minuman' },
  { id: 'd2', name: 'Es Teh Tawar', price: 3000, category: 'Minuman' },
  { id: 'd3', name: 'Es Teh Manis', price: 5000, category: 'Minuman' },
  { id: 'd4', name: 'Es Jeruk', price: 10000, category: 'Minuman' },
  { id: 'd5', name: 'Jeruk Panas', price: 7000, category: 'Minuman' },
  { id: 'd6', name: 'Air Mineral', price: 5000, category: 'Minuman' },
  { id: 'd7', name: 'Samore', price: 8000, category: 'Minuman' },
  { id: 'd8', name: 'Kopi Sunyaragi', price: 15000, category: 'Minuman' },
  { id: 'd9', name: 'Teh Pucuk', price: 5000, category: 'Minuman' },
  { id: 'd10', name: 'Nipis Madu', price: 7000, category: 'Minuman' },
  { id: 'd11', name: 'Es Teh Kampul', price: 8000, category: 'Minuman' },
  { id: 'd12', name: 'Es Tjampolay', price: 8000, category: 'Minuman' }
];

// ── Konfigurasi terpusat ──────────────────────────────────────────
// Nomor WhatsApp Admin. Ubah DI SINI saja; dipakai di Review & Home.
export const ADMIN_WHATSAPP = '6288213044259';

// Link undangan grup komunitas WhatsApp (https://chat.whatsapp.com/...).
// Kosong = kartu Gabung Komunitas di halaman Pesanan Terkirim tidak ditampilkan.
export const KOMUNITAS_WA_URL = '';

// ── Jam buka (WIB / Asia-Jakarta) ──────────────────────────────────
// Semua jam dalam MENIT sejak 00.00 WIB. Semua cabang memakai jam yang sama.
// Hari Jumat outlet & order online baru buka 12.45 (setelah salat Jumat).
const jam = (h: number, m = 0) => h * 60 + m;

// Jam outlet (makan di tempat / ambil pesanan).
export const OUTLET_OPEN = jam(10);
export const OUTLET_OPEN_FRIDAY = jam(12, 45);
export const OUTLET_CLOSE = jam(22);

// Jam ORDER ONLINE, terpisah dari jam fisik outlet.
export const ONLINE_ORDER_OPEN = jam(10);
export const ONLINE_ORDER_OPEN_FRIDAY = jam(12, 45);
export const ONLINE_ORDER_CLOSE = jam(20);

// 600 -> "10.00", 765 -> "12.45"
export const formatJam = (menit: number) =>
  `${String(Math.floor(menit / 60)).padStart(2, '0')}.${String(menit % 60).padStart(2, '0')}`;

// Teks siap tampil, mis. "10.00 - 22.00".
export const JAM_OUTLET = `${formatJam(OUTLET_OPEN)} - ${formatJam(OUTLET_CLOSE)}`;
export const JAM_OUTLET_JUMAT = `${formatJam(OUTLET_OPEN_FRIDAY)} - ${formatJam(OUTLET_CLOSE)}`;
export const JAM_ORDER_ONLINE = `${formatJam(ONLINE_ORDER_OPEN)} - ${formatJam(ONLINE_ORDER_CLOSE)}`;
export const JAM_ORDER_ONLINE_JUMAT = `${formatJam(ONLINE_ORDER_OPEN_FRIDAY)} - ${formatJam(ONLINE_ORDER_CLOSE)}`;

// Selalu hitung hari & jam di zona Asia/Jakarta, bukan jam perangkat pelanggan.
export function getJakartaTime(waktu: Date = new Date()): { isFriday: boolean; minutes: number } {
  const bagian = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(waktu);
  const ambil = (tipe: string) => bagian.find(p => p.type === tipe)?.value ?? '';
  return {
    isFriday: ambil('weekday') === 'Fri',
    minutes: parseInt(ambil('hour'), 10) * 60 + parseInt(ambil('minute'), 10),
  };
}

export function isOutletOpen(waktu?: Date): boolean {
  const { isFriday, minutes } = getJakartaTime(waktu);
  return minutes >= (isFriday ? OUTLET_OPEN_FRIDAY : OUTLET_OPEN) && minutes < OUTLET_CLOSE;
}

export function isOnlineOrderOpen(waktu?: Date): boolean {
  const { isFriday, minutes } = getJakartaTime(waktu);
  return minutes >= (isFriday ? ONLINE_ORDER_OPEN_FRIDAY : ONLINE_ORDER_OPEN) && minutes < ONLINE_ORDER_CLOSE;
}
