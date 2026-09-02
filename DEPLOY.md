# Panduan Deploy Aminoto ke VPS (Nginx)

Panduan langkah demi langkah untuk deploy website Aminoto dari GitHub ke VPS.
Ditulis untuk pemula — ikuti berurutan.

> **Semua nilai di bawah adalah PLACEHOLDER.** Ganti dengan milik Anda sendiri:
>
> | Placeholder            | Ganti dengan                                   | Contoh                     |
> | ---------------------- | ---------------------------------------------- | -------------------------- |
> | `YOUR_VPS_IP`          | Alamat IP VPS Anda                             | `203.0.113.10`             |
> | `youruser`             | Username SSH di VPS                            | `ubuntu` / `root`          |
> | `deliveryaminoto.my.id`| Domain Anda                                    | (domain Anda)              |
> | `/var/www/aminoto-repo`| Folder tempat repo di-clone                   | (bebas, folder repo)       |
> | `/var/www/deliveryaminoto` | Web root yang dilayani Nginx              | (bebas, folder web)        |

---

## 1. SSH ke VPS

Dari komputer Anda (Terminal / PowerShell / Git Bash):

```bash
ssh youruser@YOUR_VPS_IP
```

Masukkan password (atau pakai SSH key jika sudah diatur). Setelah masuk, prompt
berubah jadi user VPS Anda.

---

## 2. Cek prasyarat (Node.js, npm, git)

Di dalam VPS, cek dulu ketiganya sudah terpasang:

```bash
node -v && npm -v && git --version
```

- Kalau muncul nomor versi ketiganya → aman, lanjut.
- Kalau `node`/`npm` belum ada, pasang Node.js (disarankan versi LTS). Contoh di
  Ubuntu/Debian:

  ```bash
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

- Kalau `git` belum ada: `sudo apt-get install -y git`
- (Opsional tapi disarankan) pasang `rsync` untuk penyalinan lebih rapi:
  `sudo apt-get install -y rsync`

---

## 3. Clone repo (hanya sekali, pertama kali)

Clone repo ke folder yang Anda pilih. Contoh ke `/var/www/aminoto-repo`:

```bash
sudo mkdir -p /var/www
sudo chown -R "$USER":"$USER" /var/www          # agar tidak perlu sudo tiap kali
git clone https://github.com/marketingnobitos-ux/-ORDER-ONLINE-APPS-AMINOTO.git /var/www/aminoto-repo
cd /var/www/aminoto-repo
```

---

## 4. Sesuaikan & jalankan `deploy.sh`

`deploy.sh` sudah ikut ter-clone bersama repo. Sebelum pertama kali dipakai:

1. Buka dan sesuaikan **2 baris path** (cari tanda `>>> SESUAIKAN <<<`):

   ```bash
   nano deploy.sh
   ```

   - `REPO_DIR` → folder repo ini (mis. `/var/www/aminoto-repo`)
   - `WEB_ROOT` → web root Nginx (mis. `/var/www/deliveryaminoto`)

   Simpan di nano: `Ctrl+O` lalu `Enter`, keluar `Ctrl+X`.

2. Jadikan bisa dieksekusi (cukup sekali):

   ```bash
   chmod +x deploy.sh
   ```

3. Jalankan:

   ```bash
   ./deploy.sh
   ```

   Script akan: `git pull` → `npm ci` → `npm run build` → menyalin isi `dist/`
   ke web root. Tunggu sampai muncul `==> SELESAI.`

---

## 5. Konfigurasi Nginx (hanya sekali)

Buat server block agar Nginx melayani folder web root Anda.

```bash
sudo nano /etc/nginx/sites-available/deliveryaminoto
```

Isi dengan (sesuaikan `server_name` dan `root`):

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name deliveryaminoto.my.id www.deliveryaminoto.my.id;

    # Harus sama dengan WEB_ROOT di deploy.sh
    root /var/www/deliveryaminoto;
    index index.html;

    # App ini navigasinya berbasis state (bukan URL routing), tapi baris
    # ini aman sebagai jaring pengaman agar refresh tidak menghasilkan 404.
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache aset ber-hash (JS/CSS) lama — nama file berubah tiap build,
    # jadi aman di-cache panjang.
    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Aktifkan dan reload:

```bash
sudo ln -s /etc/nginx/sites-available/deliveryaminoto /etc/nginx/sites-enabled/
sudo nginx -t          # cek konfigurasi valid
sudo systemctl reload nginx
```

Buka `http://deliveryaminoto.my.id` di browser untuk cek.

### (Opsional) HTTPS gratis dengan Certbot

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d deliveryaminoto.my.id -d www.deliveryaminoto.my.id
```

Certbot akan menambah HTTPS otomatis dan mengurus perpanjangan sertifikat.

---

## 6. Update berikutnya (rutin)

Setiap ada perubahan kode yang sudah di-push ke GitHub, cukup:

```bash
ssh youruser@YOUR_VPS_IP
cd /var/www/aminoto-repo
./deploy.sh
```

Selesai — website langsung ter-update. Tidak perlu ulang langkah 3–5.

---

## Troubleshooting singkat

| Gejala                              | Kemungkinan penyebab & solusi                                              |
| ----------------------------------- | -------------------------------------------------------------------------- |
| Halaman lama masih muncul           | Cache browser — hard refresh `Ctrl+Shift+R`.                              |
| `403 Forbidden`                     | Nginx tak punya izin baca web root. Cek pemilik/izin folder `WEB_ROOT`.   |
| `nginx -t` error                    | Salah tulis di server block. Baca pesan errornya, perbaiki file config.   |
| `Permission denied` saat `./deploy.sh` | Belum `chmod +x deploy.sh`.                                            |
| Build gagal / out of memory         | VPS RAM kecil. Tambah swap, atau build lokal lalu upload `dist/` manual.  |
