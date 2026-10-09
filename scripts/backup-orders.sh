#!/usr/bin/env bash
# Backup harian tabel public.orders dari Supabase ke folder lokal VPS.
# Dipanggil oleh cron. Panduan pasang & restore: docs/BACKUP.md
set -euo pipefail

ENV_FILE="${ENV_FILE:-$HOME/.aminoto-backup.env}"
BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/aminoto}"
KEEP_DAYS="${KEEP_DAYS:-30}"

if [ ! -f "$ENV_FILE" ]; then
  echo "[backup] $ENV_FILE tidak ada" >&2
  exit 1
fi
# shellcheck disable=SC1090
. "$ENV_FILE"
: "${SUPABASE_DB_URL:?SUPABASE_DB_URL belum diisi di $ENV_FILE}"
case "$SUPABASE_DB_URL" in
  postgresql://*|postgres://*) ;;
  *) echo "[backup] SUPABASE_DB_URL bukan URL postgresql://" >&2; exit 1 ;;
esac

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

STAMP="$(TZ=Asia/Jakarta date +%Y-%m-%d_%H%M)"
OUT="$BACKUP_DIR/orders-$STAMP.sql.gz"
TMP="$OUT.part"
trap 'rm -f "$TMP"' EXIT

# pg_dump di PATH bisa versi lain (VPS punya 16); Supabase butuh >= 17.
PG_DUMP="${PG_DUMP:-/usr/lib/postgresql/17/bin/pg_dump}"
[ -x "$PG_DUMP" ] || PG_DUMP=pg_dump

"$PG_DUMP" "$SUPABASE_DB_URL" \
  --table=public.orders \
  --no-owner --no-privileges \
  | gzip > "$TMP"

# File gzip kosong (~20 byte) berarti dump gagal diam-diam.
if [ "$(stat -c %s "$TMP")" -lt 100 ]; then
  rm -f "$TMP"
  echo "[backup] hasil dump terlalu kecil, dibatalkan" >&2
  exit 1
fi

mv "$TMP" "$OUT"
chmod 600 "$OUT"

find "$BACKUP_DIR" -name 'orders-*.sql.gz' -mtime +"$KEEP_DAYS" -delete

echo "[backup] OK $OUT ($(du -h "$OUT" | cut -f1))"
