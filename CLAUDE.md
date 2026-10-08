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
- `ONLINE_ORDER_OPEN_HOUR` / `ONLINE_ORDER_CLOSE_HOUR` — jam layanan order online (WIB).
- `getJakartaHour()` / `isOnlineOrderOpen()` — selalu hitung jam di zona Asia/Jakarta,
  **jangan** pakai `new Date().getHours()` (itu mengikuti jam perangkat pelanggan).

## Aturan kerja untuk Claude
- Tunjukkan file yang akan diubah + rencana SEBELUM menulis kode; tunggu persetujuan.
- Jangan tambah dependency baru tanpa izin.
- Jangan buat fitur yang tidak diminta. Kalau ragu antara dua pendekatan, tanya dulu.
- Satu perubahan fokus per sesi; commit kecil-kecil.

## Utang teknis yang MASIH terbuka (belum dikerjakan)
- Testimoni "Budi/Rina/Andi" di Home masih karangan — ganti dengan review Google Maps asli.
- Foto banner catering masih hotlink Unsplash — ganti dengan foto milik Aminoto.
- Warna bar keranjang (maroon `#800000` + emas `#D4AF37`) menyimpang dari design system —
  putuskan: kembalikan ke sistem, atau resmikan sebagai warna aksen.
- PRD vs kode: bottom nav (FAQ vs Keranjang) dan urutan pilih-outlet — selaraskan dokumennya.
