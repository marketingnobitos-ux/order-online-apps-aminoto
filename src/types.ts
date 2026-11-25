// Sub-kategori yang tampil sebagai tab di halaman Menu pelanggan.
export type KelompokMenu = 'Lauk Utama' | 'Nasi & Pelengkap' | 'Sate & Jeroan' | 'Sambal' | 'Sayur' | 'Minuman';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  // Kategori lama, masih dipakai halaman Admin.
  category: 'Makanan' | 'Minuman';
  kelompok: KelompokMenu;
  favorit?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  variant?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  mapsUrl?: string;
}

export type ViewState = 'home' | 'menu' | 'cart' | 'checkout' | 'review' | 'faq' | 'terkirim';

export type PaymentMethod = 'BCA' | 'QRIS' | 'BAYAR DI TEMPAT';

// Ringkasan pesanan yang sudah dikirim ke WhatsApp Admin. Disimpan di HP pelanggan
// (localStorage, maks. 3 jam) supaya halaman Pesanan Terkirim tetap bisa dibuka lagi.
export interface PesananTerakhir {
  kode: string;
  waktu: number; // epoch ms saat pesanan dikirim
  nama: string;
  whatsapp: string;
  cabang: string;
  metodeBayar: PaymentMethod;
  catatan: string;
  items: { nama: string; varian?: string; jumlah: number; subtotal: number }[];
  total: number;
  pesanWa: string;
}
