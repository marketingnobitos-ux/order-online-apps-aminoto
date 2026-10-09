# Backup tabel `orders` (ADM-25)

Cron di VPS menjalankan `scripts/backup-orders.sh` tiap hari jam 03:00 WIB.
Hasil: `~/backups/aminoto/orders-YYYY-MM-DD_HHMM.sql.gz`, disimpan 30 hari.
Connection string database **tidak** masuk repo.

## Pasang (sekali saja, di VPS)

1. Pasang `pg_dump` dengan versi sama atau lebih baru dari Postgres Supabase.
   Cek versi server di Supabase Dashboard → Settings → Infrastructure.
   Contoh untuk Postgres 17:
   ```bash
   sudo apt install -y postgresql-common
   sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y
   sudo apt install -y postgresql-client-17
   ```

2. Ambil connection string: Supabase Dashboard → Connect → **Session pooler**
   (bukan Direct connection, karena direct hanya IPv6). Formatnya:
   `postgresql://postgres.arppizmnunkoiwvsakbp:<PASSWORD>@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`

3. Simpan ke file rahasia:
   ```bash
   echo 'SUPABASE_DB_URL="postgresql://..."' > ~/.aminoto-backup.env
   chmod 600 ~/.aminoto-backup.env
   ```

4. Uji manual:
   ```bash
   cd /home/ubuntu/projects/aminoto && git pull
   chmod +x scripts/backup-orders.sh
   ./scripts/backup-orders.sh
   ```
   Harus muncul `[backup] OK ...`.

5. Pasang cron (`crontab -e`), tambahkan:
   ```
   CRON_TZ=Asia/Jakarta
   0 3 * * * /home/ubuntu/projects/aminoto/scripts/backup-orders.sh >> /home/ubuntu/backups/aminoto/backup.log 2>&1
   ```

## Cek backup jalan
```bash
ls -lh ~/backups/aminoto/
tail ~/backups/aminoto/backup.log
```

## Restore

Lihat isi dulu tanpa menyentuh database:
```bash
zcat ~/backups/aminoto/orders-2026-10-09_0300.sql.gz | less
```

Restore ke tabel baru `orders_restore` supaya data live tidak tertimpa:
```bash
zcat FILE.sql.gz | sed 's/public\.orders/public.orders_restore/g' | psql "$SUPABASE_DB_URL"
```
Bandingkan, lalu salin baris yang hilang ke `orders` lewat SQL editor.
Hapus `orders_restore` setelah selesai.

## Catatan
- Backup ada di VPS yang sama. Kalau VPS hilang, backup ikut hilang.
  Sesekali salin ke laptop: `scp ubuntu@43.129.49.26:backups/aminoto/*.sql.gz .`
- Isi backup berisi nama dan nomor WA pelanggan. Jangan upload ke tempat publik.
