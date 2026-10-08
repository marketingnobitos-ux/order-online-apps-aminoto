# Roadmap Admin Aminoto

Catatan lintas sesi. Baca ini dulu saat mulai sesi baru di bagian admin.
Status: ✅ selesai · 🟡 kode siap, belum aktif · ⏳ menunggu user · ⬜ belum mulai.

## Aturan kerja
- Fokus UI admin dulu, pakai data palsu (`src/lib/mock-orders.ts`).
- Backend (Supabase, login, simpan order) dikerjakan belakangan, setelah UI disetujui.
- Tiap langkah: rencana dulu, tunggu persetujuan, baru tulis kode.

## Selesai
- ✅ MNA-01 Menu: Makanan 24, Minuman 13, Gurame 30rb
- ✅ MNA-02 Varian Telor Dadar / Ceplok
- ✅ MNA-03 Navigasi bawah tampil di semua halaman
- ✅ MNA-04 Jam buka cabang 11.00–22.00
- ✅ MNA-05 Pipeline deploy VPS (`./deploy.sh`, `deploy.env`)
- ✅ MNA-08 Lint 0 error, build lolos
- ✅ MNA-09 Skill ui-ux-pro-max terpasang (plugin lokal)
- ✅ MNA-11 UI admin dengan data palsu: filter cabang, ringkasan, rekap bulan/hari/cabang, daftar order, export CSV (`/admin`)
- 🟡 MNA-06 Simpan order ke Supabase saat kirim WA (kode ada di `Review.tsx`, nonaktif tanpa env)

## Menunggu user
- ⏳ ADM-01 Buat project Supabase, kirim Project URL + anon key
- ⏳ ADM-02 Jalankan `supabase/schema.sql` di SQL Editor
- ⏳ ADM-03 Buat akun admin di Supabase Auth
- ⏳ ADM-04 Keputusan kebijakan data pelanggan (nama, WA tersimpan di DB)

## Antrean
- ✅ MNA-20 Tombol + Tambah Order (form input admin, data disimpan di memori sampai refresh)
- ⬜ MNA-21 Desain ulang tampilan admin (setelah UI data palsu disetujui)
- ⬜ MNA-10 Isi env Supabase di VPS, build ulang, deploy (setelah ADM-01)
- ⬜ MNA-07 Login admin (Supabase Auth) (setelah ADM-02, ADM-03)
- ⬜ MNA-12 Ganti data palsu dengan query Supabase (setelah MNA-07)
- ⬜ MNA-13 Cek `/admin` saat refresh di server (nginx `try_files`)
- ⬜ MNA-14 Batasi spam order palsu (validasi, rate limit)
- ⬜ MNA-15 Uji export CSV di Excel
- ⬜ MNA-16 Cek ukuran bundle setelah `@supabase/supabase-js`
- ⬜ MNA-17 Rekap manual dan rekap app jalan paralel 1 bulan
- ⬜ MNA-18 Akun admin tambahan (opsional)
- ⬜ MNA-19 Backup tabel `orders` berkala

## Riwayat penting
- Commit admin awal: `2a6cf17` (Supabase + /admin), `3cc80b9` (header AMINOTO), `a0bc012` (UI data palsu).
- Login dan Supabase sengaja dilewati di UI tahap ini. `src/lib/supabase.ts` dan `supabase/schema.sql` tetap ada.
