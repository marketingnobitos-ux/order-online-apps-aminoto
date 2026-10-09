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
- ✅ ADM-12 Tabel `orders` + RLS (admin insert & read). Advisor keamanan 0 temuan
- ❌ ADM-10 DIMATIKAN (2026-10-09): order pelanggan tidak lagi disimpan ke Supabase. Insert di `Review.tsx` dihapus, policy `anon insert orders` di-drop. Order hanya masuk lewat input admin. Commit `30c1887`, deploy VPS live (bundle `index-CNGqzE1p.js`)
- ✅ ADM-13 Akun admin dibuat di Supabase Auth (1 akun, terkonfirmasi)
- ✅ ADM-16 Env Supabase ikut build VPS (`deploy.sh` export `deploy.env`), live
- ✅ ADM-17 Login admin email + password (Supabase Auth), live
- ✅ ADM-18 Data admin dari tabel `orders`; tombol Muat ulang & Keluar; simpan order input admin ke DB
- ✅ ADM-19 `/admin` dibuka langsung di server: HTTP 200
- ✅ ADM-27 Edge Function `baca-foto` (kini Sumopod `gpt-4.1-mini`, sebelumnya Gemini; source di repo, commit `fa3f3a1`) tersambung ke tombol Baca foto. Anon key ditolak (401), hanya admin login
- ✅ ADM-28 API key AI diisi user di Supabase secrets. Baca foto juga isi nama pemesan, foto dikecilkan ke 1024px (commit `132b271`). Belum diuji dengan foto order asli

## Menunggu user
- ⏳ ADM-25 Uji 9 Okt 2026: perintah cron persis dijalankan dalam lingkungan minimal (`env -i`), exit 0, `[backup] OK orders-2026-10-09_1342.sql.gz`. Sisa cek (tidak perlu menjalankan apa pun, cron otomatis): Sabtu 10 Okt 2026 setelah 03:00 WIB, di VPS jalankan `tail ~/backups/aminoto/backup.log; ls -lh ~/backups/aminoto/`. Harus ada `[backup] OK` dan file `orders-2026-10-10_0300.sql.gz`
- ⏳ ADM-14 Teks kebijakan privasi singkat. Prioritas turun sejak ADM-10 mati: app pelanggan tidak menyimpan data lagi, hanya admin yang input nama & WA

## Antrean
- ✅ ADM-15 Desain ulang admin: tab Ringkasan/Order/Tambah, filter periode + cabang, cari order, tanggal ramah, varian pakai tombol
- ❌ ADM-20 Tidak perlu lagi: sejak ADM-10 mati, anon tidak bisa insert, jadi tidak ada jalur spam order palsu
- 🔶 ADM-21 Export CSV disiapkan untuk Excel setelan Indonesia: pemisah `;`, WA tetap teks (08… dan 628… tidak hilang angka depan), waktu `2026-10-09 14:30` WIB, teks diawali `= + - @` diberi `'`. Lint + build lolos. Live (bundle `index-DcJ64Q8Z.js`). Sisa: user uji buka di Excel dengan data asli
- ✅ ADM-22 Bundle dikecilkan: Admin di-lazy load (`React.lazy`), supabase-js pindah ke chunk `Admin-*.js`. Bundle pelanggan 496 KB (gzip 140 KB) jadi 246 KB (gzip 74 KB). Live (bundle `index-DcJ64Q8Z.js`)
- 🔶 ADM-23 Uji ketepatan Baca foto 10 Okt–9 Nov 2026: admin cek tiap hasil dengan foto asli, catat yang salah di `docs/UJI-BACA-FOTO.md`, rekap tiap Senin. Target koreksi di bawah 5%. Order foto asli pertama sekaligus uji ADM-28
- ⬜ ADM-24 Akun admin tambahan (opsional)
- ✅ ADM-29 Tambah order jadi wizard 4 langkah (Foto nota → Data pemesan → Pesanan → Cek nota) dengan animasi, layar sukses "Kirim input berhasil". Catatan opsional (order dari foto tanpa catatan tetap bisa disimpan). Foto terbaca langsung ke langkah 2. Commit `1e4d289`, live (bundle `index-B0Mj25Sf.js`)
- ✅ ADM-25 Backup harian tabel `orders` aktif di VPS: `scripts/backup-orders.sh` (pg_dump 17, gzip, simpan 30 hari), cron 03:00 WIB, uji manual OK `orders-2026-10-09_1326.sql.gz`. Panduan `docs/BACKUP.md`
- ✅ ADM-26 UI input order dari foto: foto kamera/galeri → Baca foto → item, qty, catatan terisi (hasil contoh). Wajib: cabang, nama, WA, bayar. Catatan opsional sejak ADM-29

## Keputusan
- Baca foto awalnya Gemini Pro, lalu diganti Sumopod (`gpt-4.1-mini`). Key hanya di backend (Supabase secrets).
- Aturan CLAUDE.md "tidak memakai AI" belum diperbarui: AI dipakai khusus admin (baca foto). Perlu disetujui untuk diubah.

## Riwayat penting
- Commit admin awal: `2a6cf17` (Supabase + /admin), `3cc80b9` (header AMINOTO), `a0bc012` (UI data palsu), `faf1518` (tombol tambah order).
- Login dan Supabase sengaja dilewati di UI tahap ini. `src/lib/supabase.ts` dan `supabase/schema.sql` tetap ada.
- ID lama seri MNA tidak dipakai lagi. Pesan commit lama masih menyebutnya, jangan diubah.
- Repo GitHub pindah ke `marketingnobitos-ux/order-online-apps-aminoto` (9 Okt 2026). Remote laptop dan VPS sudah diganti.
- Supabase project: `aminoto-order` (ref `arppizmnunkoiwvsakbp`). Commit sambung backend: `78e47df`.
