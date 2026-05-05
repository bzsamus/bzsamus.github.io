#!/usr/bin/env bash
# Sync local assets/ → Cloudflare R2 bucket (served at https://assets.mr5am.com/).
# Mirrors the local tree minus the leading "assets/" segment, so a hero PNG at
# assets/image/hero/foo.png lands at R2 key image/hero/foo.png.
#
# One-time setup:
#   rclone config
#     name: r2
#     type: s3
#     provider: Cloudflare
#     access_key_id / secret_access_key: from Cloudflare R2 API token (Object R/W)
#     endpoint: https://<account-id>.r2.cloudflarestorage.com
#     region: auto
#
# Usage:
#   scripts/upload-assets.sh           # add/update files (no deletes)
#   scripts/upload-assets.sh --prune   # also delete remote files not in local tree

set -euo pipefail

REMOTE="${R2_REMOTE:-r2}"
BUCKET="${R2_BUCKET:-mr5am-assets}"
LOCAL_DIR="$(cd "$(dirname "$0")/.." && pwd)/assets"

if [[ ! -d "$LOCAL_DIR" ]]; then
  echo "No local assets/ directory at $LOCAL_DIR" >&2
  exit 1
fi

CMD=(rclone copy "$LOCAL_DIR" "$REMOTE:$BUCKET" --progress --checksum)
if [[ "${1:-}" == "--prune" ]]; then
  CMD=(rclone sync "$LOCAL_DIR" "$REMOTE:$BUCKET" --progress --checksum)
fi

echo "Running: ${CMD[*]}"
"${CMD[@]}"
