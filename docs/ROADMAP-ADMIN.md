# Roadmap Admin Aminoto

Catatan lintas sesi. Baca ini dulu saat mulai sesi baru di bagian admin.
Semua ID memakai seri **ADM-** (tidak ada seri lain).
Status: ✅ selesai · 🟡 kode siap, belum aktif · ⏳ menunggu user · ⬜ belum mulai.

## Aturan kerja
- Fokus UI admin dulu, pakai data palsu (`src/lib/mock-orders.ts`).
- Backend (Supabase, login, simpan order) dikerjakan belakangan, setelah UI disetujui.
- Tiap langkah: rencana dulu, tunggu persetujuan, baru tulis kode.

## Selesai
- ✅ ADM-01 Menu: Makanan 24, Minuman 13, Gurame 30rb
- ✅ ADM-02 Varian Telor Dadar / Ceplok
- ✅ ADM-03 Navigasi bawah tampil di semua halaman
- ✅ ADM-04 Jam buka cabang 11.00–22.00
- ✅ ADM-05 Pipeline deploy VPS (`./deploy.sh`, `deploy.env`)
- ✅ ADM-06 Lint 0 error, build lolos
- ✅ ADM-07 Skill ui-ux-pro-max terpasang (plugin lokal)
- ✅ ADM-08 UI admin dengan data palsu: filter cabang, ringkasan, rekap bulan/hari/cabang, daftar order, export CSV (`/admin`)
- ✅ ADM-09 Tombol + Tambah Order (form input admin, data disimpan di memori sampai refresh)
- ✅ ADM-11 Project Supabase `aminoto-order` (ref `arppizmnunkoiwvsakbp`, Singapore, gratis) dibuat via MCP
- ✅ ADM-12 Tabel `orders` + RLS (anon insert, admin insert & read). Advisor keamanan 0 temuan
- ✅ ADM-10 Order pelanggan tersimpan ke Supabase saat kirim WA (live, gagal simpan tidak ganggu WA)
- ✅ ADM-13 Akun admin dibuat di Supabase Auth (1 akun, terkonfirmasi)
- ✅ ADM-16 Env Supabase ikut build VPS (`deploy.sh` export `deploy.env`), live
- ✅ ADM-17 Login admin email + password (Supabase Auth), live
- ✅ ADM-18 Data admin dari tabel `orders`; tombol Muat ulang & Keluar; simpan order input admin ke DB
- ✅ ADM-19 `/admin` dibuka langsung di server: HTTP 200
- ✅ ADM-27 Edge Function `baca-foto` (Gemini) tersambung ke tombol Baca foto. Anon key ditolak (401), hanya admin login
- ✅ ADM-28 API key Gemini diisi user di Supabase secrets (belum diuji dengan foto asli)

## Menunggu user
- ⏳ ADM-14 Teks kebijakan privasi singkat (nama & WA pelanggan kini tersimpan di DB)

## Antrean
- ✅ ADM-15 Desain ulang admin: tab Ringkasan/Order/Tambah, filter periode + cabang, cari order, tanggal ramah, varian pakai tombol
- ⬜ ADM-20 Batasi spam order palsu (validasi, rate limit)
- ⬜ ADM-21 Uji export CSV di Excel
- ⬜ ADM-22 Kecilkan bundle: sekarang 496 KB (gzip 140 KB), naik dari 266 KB karena supabase-js. Pisah halaman admin (lazy load)
- ⬜ ADM-23 Rekap manual dan rekap app jalan paralel 1 bulan
- ⬜ ADM-24 Akun admin tambahan (opsional)
- ⬜ ADM-25 Backup tabel `orders` berkala
- ✅ ADM-26 UI input order dari foto: foto kamera/galeri → Baca foto → item, qty, catatan terisi (hasil contoh). Wajib: cabang, nama, WA, bayar, catatan

## Keputusan
- Baca foto pakai Gemini Pro (berbayar, data tidak dipakai Google). Key hanya di backend.
- Aturan CLAUDE.md "tidak memakai AI" belum diperbarui: AI dipakai khusus admin (baca foto). Perlu disetujui untuk diubah.

## Riwayat penting
- Commit admin awal: `2a6cf17` (Supabase + /admin), `3cc80b9` (header AMINOTO), `a0bc012` (UI data palsu), `faf1518` (tombol tambah order).
- Login dan Supabase sengaja dilewati di UI tahap ini. `src/lib/supabase.ts` dan `supabase/schema.sql` tetap ada.
- ID lama seri MNA tidak dipakai lagi. Pesan commit lama masih menyebutnya, jangan diubah.
- Supabase project: `aminoto-order` (ref `arppizmnunkoiwvsakbp`). Commit sambung backend: `78e47df`.
