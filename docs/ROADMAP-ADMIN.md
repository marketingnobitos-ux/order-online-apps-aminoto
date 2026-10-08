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
- 🟡 ADM-10 Simpan order ke Supabase saat kirim WA (kode ada di `Review.tsx`, nonaktif tanpa env)

## Menunggu user
- ⏳ ADM-11 Buat project Supabase, kirim Project URL + anon key
- ⏳ ADM-12 Jalankan `supabase/schema.sql` di SQL Editor
- ⏳ ADM-13 Buat akun admin di Supabase Auth
- ⏳ ADM-14 Keputusan kebijakan data pelanggan (nama, WA tersimpan di DB)

## Antrean
- ✅ ADM-15 Desain ulang admin: tab Ringkasan/Order/Tambah, filter periode + cabang, cari order, tanggal ramah, varian pakai tombol
- ⬜ ADM-16 Isi env Supabase di VPS, build ulang, deploy (setelah ADM-11)
- ⬜ ADM-17 Login admin (Supabase Auth) (setelah ADM-12, ADM-13)
- ⬜ ADM-18 Ganti data palsu dengan query Supabase (setelah ADM-17)
- ⬜ ADM-19 Cek `/admin` saat refresh di server (nginx `try_files`)
- ⬜ ADM-20 Batasi spam order palsu (validasi, rate limit)
- ⬜ ADM-21 Uji export CSV di Excel
- ⬜ ADM-22 Cek ukuran bundle setelah `@supabase/supabase-js`
- ⬜ ADM-23 Rekap manual dan rekap app jalan paralel 1 bulan
- ⬜ ADM-24 Akun admin tambahan (opsional)
- ⬜ ADM-25 Backup tabel `orders` berkala

## Riwayat penting
- Commit admin awal: `2a6cf17` (Supabase + /admin), `3cc80b9` (header AMINOTO), `a0bc012` (UI data palsu), `faf1518` (tombol tambah order).
- Login dan Supabase sengaja dilewati di UI tahap ini. `src/lib/supabase.ts` dan `supabase/schema.sql` tetap ada.
- ID lama seri MNA tidak dipakai lagi. Pesan commit lama masih menyebutnya, jangan diubah.
