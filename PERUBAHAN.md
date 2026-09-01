# Ringkasan Perubahan — 1 Sep 2026

Dikerjakan otomatis dari hasil audit. Lint hijau, build sukses, tampilan diverifikasi
di viewport 390×844.

## Bloker (diperbaiki)
1. Jam operasional konsisten — jam order online (10.00–20.00 WIB) kini ditampilkan
   di Home tepat di bawah tombol "Pesan Sekarang", jadi pelanggan tahu sebelum menyusun keranjang.
2. Perhitungan jam buka dipindah ke zona Asia/Jakarta (WIB), tidak lagi mengikuti
   jam perangkat pelanggan. (src/data.ts: getJakartaHour / isOnlineOrderOpen)
3. Halaman Menu kini punya dropdown pilih cabang (Cipto/Sumber/Ciledug), tidak lagi
   hardcode "Aminoto Cipto". Terhubung ke state cabang di App.
4. Nomor WhatsApp Admin dipindah ke satu konstanta ADMIN_WHATSAPP di src/data.ts,
   dipakai di Review & Home. Ganti nomor cukup di satu tempat.

## Tipe & kode mati (diperbaiki)
- 18 error TypeScript hilang — union kategori di types.ts disamakan dengan data.ts.
  `npm run lint` sekarang HIJAU.
- Konstanta mati FAVORITE_ITEMS (berisi id 's3' yang tak ada) dihapus.
- Validasi nomor WhatsApp ditambah di Checkout (harus 9–15 digit, bukan sekadar tidak kosong).

## Perancah AI Studio (dibersihkan)
- 6 dependency mati dihapus: @google/genai, express, dotenv, motion, esbuild, autoprefixer
  (plus @types/express, tsx). Tak satu pun dipakai kode.
- vite.config.ts: logika DISABLE_HMR khusus AI Studio dihapus — hot reload normal lagi.
- .env.example: kunci GEMINI_API_KEY/APP_URL yang tak terpakai dihapus.
- package.json: nama diganti dari "react-example" → "aminoto-order-app".
- Import ikon tak terpakai dibersihkan (Checkout, Home).
- Tab "Menu Tambahan" yang terpotong di 390px kini bisa di-scroll.

## BELUM dikerjakan (keputusan ada di kamu — lihat CLAUDE.md)
- Testimoni karangan di Home, foto Unsplash, warna maroon/emas bar keranjang, selaraskan PRD.
