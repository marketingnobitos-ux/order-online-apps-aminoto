# CLAUDE.md — Aminoto Order App

Konteks proyek untuk sesi Claude Code / Cowork. Baca ini sebelum mengubah kode.

## Produk
- Aplikasi pemesanan Pecel Lele Aminoto. Customer memesan lewat app, pesanan
  diteruskan ke WhatsApp Admin. **Bukan** checkout langsung, **tanpa** payment gateway.
- Tidak ada akun/login. Customer hanya mengisi Nama + Nomor WhatsApp.
- Metode bayar (manual): Transfer BCA, QRIS, Bayar di Tempat.
- Tidak ada driver/pengantaran. Self-pickup di outlet (customer pesan Gojek/Grab sendiri).
- 3 cabang: Aminoto Cipto, Sumber, Ciledug. 35 item menu, ditampilkan tanpa foto produk.

## Flow inti
Home → (pilih cabang di Menu) → Menu → Keranjang → Checkout (nama, WA, metode bayar)
→ Review → Kirim ke WhatsApp Admin.

## Stack (dari package.json)
- React 19 + TypeScript, Vite 6, Tailwind CSS 4 (via @tailwindcss/vite), ikon lucide-react.
- App customer: 100% sisi klien, tanpa AI.
- Admin: tersambung Supabase (login + tabel `orders`). Fitur "input order dari foto"
  memanggil Gemini lewat Edge Function `baca-foto`. API key Gemini hanya di server
  Supabase, **tidak pernah** di kode klien.

## Perintah
- `npm install` — pasang dependency
- `npm run dev` — server dev (port 3000)
- `npm run build` — build produksi
- `npm run lint` — typecheck (`tsc --noEmit`). **Wajib dijalankan terpisah**:
  `vite build` TIDAK melakukan typecheck, jadi error tipe bisa lolos tanpa lint.

## Design system (JANGAN diubah tanpa diminta)
- Primary lime `#D4FF00`, secondary forest green `#06402B`, background warm white `#FDFBF7`.
- Tanpa gradient (kecuali overlay foto). Font Poppins. Mobile-first, target 390×844 px.
- Arah desain: "Premium Modern Indonesian Street Food". Bukan tampilan kasir/marketplace.

## Konfigurasi terpusat (src/data.ts)
- `ADMIN_WHATSAPP` — nomor WA admin. Ubah **di sini saja**.
- `KOMUNITAS_WA_URL` — link undangan grup komunitas WA (kosong = kartu komunitas disembunyikan).
- Jam buka dalam menit sejak 00.00 WIB, sama untuk semua cabang:
  - `OUTLET_OPEN` / `OUTLET_OPEN_FRIDAY` / `OUTLET_CLOSE` — outlet 10.00–22.00, Jumat mulai 12.45.
  - `ONLINE_ORDER_OPEN` / `ONLINE_ORDER_OPEN_FRIDAY` / `ONLINE_ORDER_CLOSE` — order online
    10.00–20.00, Jumat mulai 12.45.
  - Teks tampilan (`JAM_OUTLET`, `JAM_ORDER_ONLINE`, versi `_JUMAT`) dibentuk dari konstanta itu.
- `getJakartaTime()` / `isOutletOpen()` / `isOnlineOrderOpen()` — selalu hitung hari & jam di zona
  Asia/Jakarta, **jangan** pakai `new Date().getHours()` (itu mengikuti jam perangkat pelanggan).

## Aturan kerja untuk Claude
- Tunjukkan file yang akan diubah + rencana SEBELUM menulis kode; tunggu persetujuan.
- Jangan tambah dependency baru tanpa izin.
- Jangan buat fitur yang tidak diminta. Kalau ragu antara dua pendekatan, tanya dulu.
- Satu perubahan fokus per sesi; commit kecil-kecil.

## Utang teknis yang MASIH terbuka (belum dikerjakan)
- Bagian "Kata #WargaAminoto" di Home disembunyikan sampai `ULASAN` di `src/data.ts` diisi
  review Google Maps asli (testimoni karangan Budi/Rina/Andi sudah dihapus).
- PRD vs kode: bottom nav (FAQ vs Keranjang) dan urutan pilih-outlet — selaraskan dokumennya.
