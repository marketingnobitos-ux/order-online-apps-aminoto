#!/usr/bin/env bash
#
# deploy.sh — Deploy Aminoto Order App ke VPS (Nginx)
# Jalankan script ini DI VPS, di dalam folder repo hasil clone.
#
# Alur: git pull -> npm ci -> npm run build -> salin isi dist/ ke web root Nginx.
#
# Cara pakai (di VPS):
#   chmod +x deploy.sh      # cukup sekali
#   ./deploy.sh
#
# ---------------------------------------------------------------------------

# Berhenti kalau ada error, variabel belum diset, atau pipe gagal.
set -euo pipefail

# ======================= >>> SESUAIKAN 2 BARIS INI <<< ======================
# Lokasi repo hasil clone di VPS (folder yang berisi package.json):
REPO_DIR="/var/www/aminoto-repo"          # >>> SESUAIKAN <<<

# Web root yang dilayani Nginx (yang ditunjuk oleh 'root' di server block):
WEB_ROOT="/var/www/deliveryaminoto"       # >>> SESUAIKAN <<<
# ===========================================================================

# Branch yang dipakai untuk deploy (biarkan 'main' kecuali Anda tahu mau ganti).
BRANCH="main"

echo "==> [1/5] Masuk ke folder repo: $REPO_DIR"
cd "$REPO_DIR"

echo "==> [2/5] Ambil kode terbaru dari GitHub (git pull origin $BRANCH)"
git pull origin "$BRANCH"

echo "==> [3/5] Pasang dependency (npm ci)"
# npm ci = install bersih sesuai package-lock.json (lebih andal di server).
# Kalau package-lock.json tidak ada, jatuh ke 'npm install'.
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

echo "==> [4/5] Build produksi (npm run build) -> menghasilkan folder dist/"
npm run build

echo "==> [5/5] Salin isi dist/ ke web root: $WEB_ROOT"
# Pastikan web root ada.
mkdir -p "$WEB_ROOT"

# rsync menyalin ISI dist/ (perhatikan tanda '/' di akhir 'dist/').
# --delete menghapus file lama di web root yang sudah tidak ada di dist/,
# supaya aset ber-hash lama (mis. index-XXXX.js) tidak menumpuk / basi.
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete dist/ "$WEB_ROOT/"
else
  # Fallback kalau rsync belum terpasang: bersihkan lalu salin ulang.
  echo "    (rsync tidak ada, pakai rm + cp)"
  rm -rf "${WEB_ROOT:?}/"*
  cp -r dist/. "$WEB_ROOT/"
fi

echo ""
echo "==> SELESAI. Situs sudah diperbarui."
echo "    Web root : $WEB_ROOT"
echo "    Buka domain Anda di browser untuk memverifikasi."
echo "    (Kalau tampilan belum berubah, hard-refresh: Ctrl+Shift+R)"
