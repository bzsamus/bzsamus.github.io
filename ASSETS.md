# Assets Guide — mr5am.github.io

A single reference for every place on the site that consumes an asset: where to put files, which JS file to edit, naming conventions, and how to add new worlds or works.

> **Hosting:** assets live in a Cloudflare R2 bucket served via `https://assets.mr5am.com/` (configured as `ASSET_BASE` in `js/data.js`). The local `assets/` directory is **gitignored** and used only as a staging area before upload. To get a file live: drop it into the local tree, then run `scripts/upload-assets.sh` (rclone) — no app rebuild needed.

---

## A. Folder layout (mirrors R2 bucket keys, minus the `assets/` prefix)

```
assets/                     ← local staging (gitignored)
├── image/
│   ├── hero/        # Painterly background art (PNG, ≥1920w, ≤2 MB)
│   └── works/       # Per-work cover images / project screenshots
└── video/
    ├── world/       # Per-world hero loop videos (calm, ambient, seamless)
    ├── hover/       # Per-world card hover preview clips (3–6s, ≤2 MB)
    └── works/       # Per-work case-study videos
```

The R2 bucket holds the same tree without the leading `assets/` segment — a hero image is uploaded as `image/hero/foo.png` and resolved at runtime to `https://assets.mr5am.com/image/hero/foo.png` via the `asset()` helper in `js/data.js`.

Create any missing subfolder before dropping files in. Keep filenames lowercase with hyphens.

---

## A2. Uploading to R2

Local `assets/` → R2 bucket `mr5am-assets`:

```sh
scripts/upload-assets.sh           # rclone copy ./assets r2:mr5am-assets
```

Requires a one-time `rclone config` for an `r2` remote pointing at the bucket's S3-compatible endpoint with an R2 API token (Object Read & Write).

Alternatives:
- Cloudflare dashboard drag-and-drop for one-off files.
- `wrangler r2 object put mr5am-assets/<key> --file=<localpath>` for individual files.

If you overwrite an existing key (same filename), purge it from Cloudflare cache afterwards: dashboard → Caching → Configuration → Purge by URL → `https://assets.mr5am.com/<key>`. New filenames don't need a purge.

---

## B. Asset catalogue

Every visible asset on the site, where it appears, and what to edit.

| # | Where shown | File location | Edit point |
|---|---|---|---|
| 1 | Loading screen blurred bg (random pick at boot) | R2: `image/hero/*.png` | `js/data.js` → `ART_IMGS[]` (add new path via `asset(...)`; auto-included via `VISIT_SEED % length`) |
| 2 | Site-wide slideshow background (`ArtworkSlideshowBG`) | references `ART_IMGS` | `js/data.js` → `MODE_ART[world]` (array of indices into `ART_IMGS`) |
| 3 | "Select a World" card image (home) | references `ART_IMGS` | `js/data.js` → `WORLD_ROUTE_META[world].heroImg` |
| 4 | "Select a World" card hover **video** | R2: `video/hover/<world>-hover.mp4` | `js/data.js` → `WORLD_HOVER_VIDEO[world]` (use `asset('video/hover/<world>-hover.mp4')`) |
| 5 | World page hero **video** background (full viewport) | R2: `video/world/<world>.mp4` | `js/data.js` → `WORLD_VIDEO[world]` (use `asset('video/world/<world>.mp4')`) |
| 6 | World page hero **image** fallback (when no video) | references `ART_IMGS` | `js/data.js` → `WORLD_ROUTE_META[world].heroImg` |
| 7 | World page works grid (per-world filtered) | per-work entries (img/video) | `js/data.js` → `WORKS_RAW[i].worlds: [...]` (add the world key) |
| 8 | Individual work cover image | R2: `image/works/<slug>.png` | `js/data.js` → `WORKS_RAW[i].img` (use `asset(...)`) |
| 9 | Individual work hover video (in work card) | R2: `video/works/<slug>.mp4` | `js/data.js` → `WORKS_RAW[i].video` (use `asset(...)`) |
| 10 | Project overlay (modal) media | same as work `img` / `video` | no extra config |
| 11 | World description copy | text only | `js/data.js` → `WORLD_DESCRIPTIONS[world]` |
| 12 | World name + accent colors + JP phrases | config only | `js/data.js` → `MODES[world]` and `WORLD_ROUTE_META[world]` |
| 13 | Curated extra gallery images (legacy / optional) | references `ART_IMGS` | `js/data.js` → `WORLD_GALLERIES[world]` (currently unused by world page) |

---

## C. Naming conventions

- **Lowercase, hyphens only** for new files. Example: `bloom-hover.mp4`, `torii-garden.png`.
- **World keys are canonical:** `bloom`, `core`, `reclaim`, `beyond`. Use these as filename prefixes/suffixes.
- **Work files:** kebab-case slug derived from `WORKS_RAW[i].title`. Example: `Moving Architecture` → `moving-architecture.png`.
- **Existing legacy files** (long underscore-separated Midjourney filenames) can stay; rename only when convenient.

---

## D. Format & size targets

### Images

| Use | Format | Min size | Target file size |
|---|---|---|---|
| Hero (R2: `image/hero/`) | PNG or JPG | 1920×1080 | ≤ 2 MB |
| Work cover (R2: `image/works/`) | PNG or JPG | 1280×800 | ≤ 500 KB |

Compress: `pngquant --quality=70-90 file.png` or `jpegoptim --max=82 file.jpg`.

### Videos

| Use | Codec | Resolution | Bitrate | Length | Target file size |
|---|---|---|---|---|---|
| World hero (R2: `video/world/`) | H.264 yuv420p | 1080p | 2–4 Mbps | seamless loop, 8–20s | ≤ 8 MB |
| Card hover (R2: `video/hover/`) | H.264 yuv420p | 720p | 1.5–2.5 Mbps | 3–6s loop | ≤ 2 MB |
| Work case study (R2: `video/works/`) | H.264 yuv420p | 1080p | 2–4 Mbps | any | ≤ 15 MB |

Encode template (drop audio, prep for web autoplay):
```sh
ffmpeg -i src.mov -vf "scale=1920:-2" -c:v libx264 -profile:v main \
  -pix_fmt yuv420p -crf 24 -preset slow -movflags +faststart -an out.mp4
```

For seamless loops, ensure first frame ≈ last frame. For ambience, aim for slow, low-motion content (camera drift, particles, water).

---

## E. How to add a new world

1. Pick a world key (kebab/lowercase), e.g. `aether`.
2. In `js/data.js`, add the key to `WORLD_ORDER` (it doubles as `MODE_KEYS`).
3. Add entries (matching all four existing worlds) in:
   - `MODES[aether]` — colors (`darkBg`, `lightBg`, `acc`, `acc2`, `rgb`), `label`, `jp`, `jpWords`
   - `WORLD_ROUTE_META[aether]` — `key`, `label`, `heroImg`, `description`
   - `WORLD_DESCRIPTIONS[aether]` — long-form blurb
   - `MODE_ART[aether]` — array of `ART_IMGS` indices for the slideshow
   - `WORLD_GALLERIES[aether]` — optional curated gallery (legacy)
   - `WORLD_VIDEO[aether]` — path or `null`
   - `WORLD_HOVER_VIDEO[aether]` — path or `null`
4. Drop assets into the local `assets/` staging tree, then `scripts/upload-assets.sh`:
   - `assets/image/hero/aether-*.png` (and reference indices in `MODE_ART`)
   - `assets/video/world/aether.mp4` (optional)
   - `assets/video/hover/aether-hover.mp4` (optional)
5. No CSS or component changes needed — `Nav`, `WorldStateSelector`, `WorldStatePage`, and the curtain transition all iterate `WORLD_ORDER` automatically.

---

## F. How to add a new work

1. Drop cover image into `assets/image/works/<slug>.png` (local staging).
2. (Optional) Drop case-study video into `assets/video/works/<slug>.mp4`.
3. Run `scripts/upload-assets.sh` to push the new files to R2.
4. Append entry to `WORKS_RAW` in `js/data.js`:
   ```js
   { id:10, title:'My Piece', type:'Generative Art', year:'2026',
     tag:'ART', jp:'作品', img:asset('image/works/my-piece.png'),
     video:asset('video/works/my-piece.mp4'), worlds:['bloom','reclaim'] }
   ```
   - `tag` must be one of: `ART`, `VIDEO`, `MUSIC`, `GAME`, `WEB`.
   - `worlds` is an array of world keys — the work appears in each listed world's gallery.
   - `img`/`video` may be `null` (e.g. music-only works render a striped placeholder).
4. The work auto-appears on each linked world page and (when reactivated) in the matching category tile.

---

## G. Asset preloading & fallbacks

- All entries in `ART_IMGS` are preloaded at boot (`js/data.js` line 32). Add new hero images to that array to get free preloading.
- `WORLD_VIDEO[world]` may be `null` → the world page hero falls back to `WORLD_ROUTE_META[world].heroImg`.
- `WORLD_HOVER_VIDEO[world]` may be `null` → home cards keep the existing image-zoom hover behaviour.
- `WORKS_RAW[i].img` may be `null` → work card renders a striped placeholder pattern.
- `WORKS_RAW[i].video` may be `null` → no hover-video overlay on the work card.

---

## H. Quick checklist when adding bespoke per-world videos today

The four worlds are: `bloom`, `core`, `reclaim`, `beyond`.

Drop files into local staging (R2 keys shown in parentheses):

```
assets/video/world/bloom.mp4       (R2: video/world/bloom.mp4)    # warm garden / sunbeam ambience
assets/video/world/core.mp4        (R2: video/world/core.mp4)     # mechanical / electric / neon density
assets/video/world/reclaim.mp4     (R2: video/world/reclaim.mp4)  # overgrown ruins, leaves moving
assets/video/world/beyond.mp4      (R2: video/world/beyond.mp4)   # space, drifting particles

assets/video/hover/bloom-hover.mp4
assets/video/hover/core-hover.mp4
assets/video/hover/reclaim-hover.mp4
assets/video/hover/beyond-hover.mp4
```

Then `scripts/upload-assets.sh`, and in `js/data.js` replace each `null` with `asset('video/world/<world>.mp4')` / `asset('video/hover/<world>-hover.mp4')`.
