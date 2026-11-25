import { BIAYA_BAKAR, MENU_ITEMS } from './data';
import { CartItem } from './types';

// Data yang diingat di HP pelanggan (localStorage) setelah pesanan terkirim ke WhatsApp:
// nama + nomor WA (untuk isi otomatis checkout) dan isi pesanan terakhir (untuk "Pesan lagi").
// Semua akses dibungkus try/catch: mode private atau browser yang memblokir penyimpanan
// tidak boleh membuat app error.

const KUNCI_PELANGGAN = 'aminoto-pelanggan';
const KUNCI_PESAN_ULANG = 'aminoto-pesan-ulang';
const BATAS_UMUR_PESAN_ULANG_MS = 60 * 24 * 60 * 60 * 1000; // 60 hari

export interface DataPelanggan {
  nama: string;
  whatsapp: string;
}

export interface PesanUlang {
  cabang: string;
  items: CartItem[];
  total: number;
}

export function bacaPelanggan(): DataPelanggan | null {
  try {
    const data = JSON.parse(localStorage.getItem(KUNCI_PELANGGAN) ?? 'null');
    if (!data || typeof data.nama !== 'string' || typeof data.whatsapp !== 'string') return null;
    return { nama: data.nama, whatsapp: data.whatsapp };
  } catch {
    return null;
  }
}

export function simpanPelanggan(data: DataPelanggan) {
  try {
    localStorage.setItem(KUNCI_PELANGGAN, JSON.stringify(data));
  } catch {
    // Penyimpanan diblokir: isian tidak diingat, app tetap jalan.
  }
}

export function hapusPelanggan() {
  try {
    localStorage.removeItem(KUNCI_PELANGGAN);
  } catch {
    // Abaikan.
  }
}

// Yang disimpan hanya id menu, varian, dan jumlah. Harga dihitung ulang dari menu
// terbaru saat dibaca, supaya "Pesan lagi" tidak memakai harga lama.
export function simpanPesanUlang(cart: CartItem[], cabang: string) {
  try {
    const items = cart.map(c => ({ id: c.menuItem.id, varian: c.variant, jumlah: c.quantity }));
    localStorage.setItem(KUNCI_PESAN_ULANG, JSON.stringify({ waktu: Date.now(), cabang, items }));
  } catch {
    // Abaikan.
  }
}

export function bacaPesanUlang(): PesanUlang | null {
  try {
    const data = JSON.parse(localStorage.getItem(KUNCI_PESAN_ULANG) ?? 'null');
    if (!data || typeof data.waktu !== 'number' || !Array.isArray(data.items)) return null;
    if (Date.now() - data.waktu > BATAS_UMUR_PESAN_ULANG_MS) {
      localStorage.removeItem(KUNCI_PESAN_ULANG);
      return null;
    }
    const items: CartItem[] = [];
    for (const it of data.items) {
      const menu = MENU_ITEMS.find(m => m.id === it?.id);
      const jumlah = Number(it?.jumlah);
      if (!menu || !Number.isInteger(jumlah) || jumlah < 1) continue; // menu sudah dihapus / data rusak
      const varian = typeof it.varian === 'string' ? it.varian : undefined;
      const harga = menu.price + (varian?.startsWith('Bakar') ? BIAYA_BAKAR : 0);
      items.push({ menuItem: { ...menu, price: harga }, quantity: jumlah, variant: varian });
    }
    if (items.length === 0) return null;
    const total = items.reduce((s, c) => s + c.menuItem.price * c.quantity, 0);
    return { cabang: typeof data.cabang === 'string' ? data.cabang : '', items, total };
  } catch {
    return null;
  }
}
