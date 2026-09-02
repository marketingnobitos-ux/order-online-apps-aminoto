#!/usr/bin/env bash
#
# deploy.sh — Deploy Aminoto Order App ke VPS (Nginx)
# Jalankan DI VPS, dari dalam folder repo hasil clone:  ./deploy.sh
#
# Alur: git pull -> npm ci -> npm run build -> salin isi dist/ ke web root Nginx.
#
# KONFIGURASI PATH tidak ditulis di file ini (biar tidak bentrok saat git pull).
# Buat file `deploy.env` di folder yang sama — file itu TIDAK ikut git.
# Lihat `deploy.env.example` untuk template.
# ---------------------------------------------------------------------------

# Berhenti kalau ada error, variabel belum diset, atau pipe gagal.
set -euo pipefail

# Folder tempat script ini berada (= folder repo). Dipakai untuk menemukan
# deploy.env dan sebagai default REPO_DIR.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Muat konfigurasi path dari deploy.env bila ada.
if [ -f "$SCRIPT_DIR/deploy.env" ]; then
  # shellcheck source=/dev/null
  . "$SCRIPT_DIR/deploy.env"
fi

# REPO_DIR default ke lokasi script ini; WEB_ROOT wajib diisi lewat deploy.env.
REPO_DIR="${REPO_DIR:-$SCRIPT_DIR}"
WEB_ROOT="${WEB_ROOT:-}"
BRANCH="${BRANCH:-main}"

# --- Validasi konfigurasi --------------------------------------------------
if [ -z "$WEB_ROOT" ]; then
  echo "ERROR: WEB_ROOT belum diset." >&2
  echo "Buat file deploy.env di sebelah deploy.sh (lihat deploy.env.example), contoh:" >&2
  echo '  REPO_DIR="/home/ubuntu/projects/aminoto"' >&2
  echo '  WEB_ROOT="/var/www/aminoto"' >&2
  exit 1
fi
if [ ! -d "$REPO_DIR/.git" ]; then
  echo "ERROR: REPO_DIR bukan repo git yang valid: $REPO_DIR" >&2
  exit 1
fi

# Penyalinan ke web root biasanya butuh root. Pakai sudo hanya bila belum root.
SUDO=""
if [ "$(id -u)" -ne 0 ]; then
  SUDO="sudo"
fi

echo "==> Konfigurasi: REPO_DIR=$REPO_DIR | WEB_ROOT=$WEB_ROOT | BRANCH=$BRANCH"

echo "==> [1/5] Masuk ke folder repo: $REPO_DIR"
cd "$REPO_DIR"

echo "==> [2/5] Ambil kode terbaru dari GitHub (git pull origin $BRANCH)"
git pull origin "$BRANCH"

echo "==> [3/5] Pasang dependency"
# npm ci = install bersih sesuai package-lock.json (lebih andal di server).
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

echo "==> [4/5] Build produksi (npm run build) -> menghasilkan folder dist/"
npm run build

echo "==> [5/5] Salin isi dist/ ke web root: $WEB_ROOT"
# rsync menyalin ISI dist/ (perhatikan '/' di akhir 'dist/'); --delete membuang
# file lama yang sudah tidak ada di dist/ supaya aset ber-hash lama tak menumpuk.
$SUDO mkdir -p "$WEB_ROOT"
if command -v rsync >/dev/null 2>&1; then
  $SUDO rsync -a --delete dist/ "$WEB_ROOT/"
else
  echo "    (rsync tidak ada, pakai rm + cp)"
  $SUDO rm -rf "${WEB_ROOT:?}/"*
  $SUDO cp -r dist/. "$WEB_ROOT/"
fi

echo ""
echo "==> SELESAI. Situs sudah diperbarui."
echo "    Web root : $WEB_ROOT"
echo "    Buka domain Anda di browser untuk memverifikasi."
echo "    (Kalau tampilan belum berubah, hard-refresh: Ctrl+Shift+R)"
