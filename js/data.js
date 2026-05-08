/* ── Shared React hooks (resolved at runtime from React global) ─────────── */
var { useState, useEffect, useRef, useMemo } = React;

/* ── Visit seed ─────────────────────────────────────────────────────────── */
const VISIT_SEED = (() => {
  const k = 'mr5am_seed_v4';
  const e = sessionStorage.getItem(k);
  if (e) return parseInt(e);
  const s = Math.floor(Math.random() * 1e8);
  sessionStorage.setItem(k, s);
  return s;
})();

/* ── Random world — fresh every page load ───────────────────────────────── */
const WORLD_ORDER = ['bloom', 'core', 'reclaim', 'beyond'];
const MODE_KEYS = WORLD_ORDER;
const INITIAL_MODE = MODE_KEYS[Math.floor(Math.random() * MODE_KEYS.length)];
const HOME_ROUTE = 'home';
const ROUTE_KEYS = [HOME_ROUTE, ...MODE_KEYS];


const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const LOW_END_DEVICE = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 4);
const ALLOW_EXPENSIVE_EFFECTS = !(PREFERS_REDUCED_MOTION || LOW_END_DEVICE);

/* ── Hero background images (assets/image/hero/) ────────────────────────── */
const WORLD_ART = {
  bloom: [
    'assets/image/hero/bloom_A_painterly_anime_illustration_style_reminiscent_of_Stu_294dec26-a406-457f-afee-fa5eb74ce5b8_3.webp',
    'assets/image/hero/bloom_A_painterly_anime_illustration_style_reminiscent_of_Stu_7f0c1202-3d20-42ab-a8ef-db3e3aebaf9a_3.webp',
    'assets/image/hero/bloom_A_painterly_anime_illustration_style_reminiscent_of_Stu_a3487f1a-e707-4e1b-9ac4-3d6b75f03bac_3.webp',
    'assets/image/hero/bloom_Dual_scenery_above_and_below_the_water_surface._Above_t_ed2ed109-eb7d-479b-8f01-c558e15189da_3.webp',
  ],
  core: [
    'assets/image/hero/core_A_painterly_anime_illustration_style_reminiscent_of_Stu_16409917-dde5-4612-989e-64502a1b79d6_3.webp',
    'assets/image/hero/core_A_painterly_anime_illustration_style_reminiscent_of_Stu_924fcaa7-bb9d-413a-a5dc-080dbde8aaed_2.webp',
    'assets/image/hero/core_A_painterly_anime_illustration_style_reminiscent_of_Stu_9c58bc0e-17e6-4210-86e1-5b6eaccb3a08_1.webp',
    'assets/image/hero/core_dreamlike_mirrored_city_above_a_luminous_ocean_floating_fe7a87c4-e223-4885-aae4-9b6ad358a4d0_2.webp',
  ],
  reclaim: [
    'assets/image/hero/reclaim_A_painterly_anime_illustration_style_reminiscent_of_Stu_36584efa-2fa5-4252-ad0e-7a8d837b808d_0.webp',
    'assets/image/hero/reclaim_A_painterly_anime_illustration_style_reminiscent_of_Stu_36584efa-2fa5-4252-ad0e-7a8d837b808d_3.webp',
    'assets/image/hero/reclaim_A_painterly_anime_illustration_style_reminiscent_of_Stu_d2d2a9ca-f538-4e57-a36f-67ca8b331cdd_0.webp',
    'assets/image/hero/reclaim_a_wild_techo_landscape_with_mechs_and_cyberpunk_live_in_df105a3c-fea5-47da-88c2-bb27c9b5c461_2.webp',
  ],
  beyond: [
    'assets/image/hero/beyond_A_painterly_anime_illustration_style_reminiscent_of_Stu_0009dea5-dbcf-4358-80cf-b091b6c7f4e2_3.webp',
    'assets/image/hero/beyond_A_painterly_anime_illustration_style_reminiscent_of_Stu_212f4684-9216-4237-a233-3cfb78b9625b_2.webp',
    'assets/image/hero/beyond_A_painterly_anime_illustration_style_reminiscent_of_Stu_53ffea80-63ea-4408-9c62-7430c1a86ea6_3.webp',
    'assets/image/hero/beyond_A_painterly_anime_illustration_style_reminiscent_of_Stu_82237982-cf72-4296-88dd-704bd50f6c92_0.webp',
  ],
};
const ART_IMGS = WORLD_ORDER.flatMap(worldKey => WORLD_ART[worldKey]);
if (ALLOW_EXPENSIVE_EFFECTS) { ART_IMGS.forEach(s => { const i = new Image(); i.src = s; }); }

/* ── Slideshow index sets (ArtworkSlideshowBG dependency) ──────────────── */
const MODE_ART = WORLD_ORDER.reduce((acc, worldKey, worldIdx) => {
  const baseIdx = worldIdx * WORLD_ART[worldKey].length;
  acc[worldKey] = WORLD_ART[worldKey].map((_, imgIdx) => baseIdx + imgIdx);
  return acc;
}, {});

/* ── Homepage world route metadata (single source of truth for labels) ─── */
const WORLD_ROUTE_META = {
  bloom:   { key:'bloom',   label:'Bloom',   heroImg:WORLD_ART.bloom[0], description:'Sunlit growth, quiet gardens, and weather held in color.' },
  core:    { key:'core',    label:'Core',    heroImg:WORLD_ART.core[0], description:'Dense machines, electric cities, and architecture under pressure.' },
  reclaim: { key:'reclaim', label:'Reclaim', heroImg:WORLD_ART.reclaim[0], description:'Ruins softened by rain, roots, and the patience of living green.' },
  beyond:  { key:'beyond',  label:'Beyond',  heroImg:WORLD_ART.beyond[0], description:'Orbit, silence, and the strange scale of distant light.' },
};

/* ── World page descriptions (single source of truth for body copy) ────── */
const WORLD_DESCRIPTIONS = {
  bloom: 'Bloom is a study in gentleness: sunlight passing through leaves, gardens widening after rain, and color treated as a living material.',
  core: 'Core follows the pulse of built worlds: metal, circuitry, pressure, and the uneasy beauty of systems that keep moving.',
  reclaim: 'Reclaim imagines the slow return of nature, where concrete becomes soil, machinery becomes shelter, and time edits everything.',
  beyond: 'Beyond looks outward toward orbit, distance, and silence, building scenes where scale becomes emotion and light feels almost ancient.',
};

/* ── World config ────────────────────────────────────────────────────────── */
const MODES = {
  bloom:   { label:'BLOOM',   darkBg:'#0c1209', lightBg:'#f5ede0', acc:'#f0a855', acc2:'#7ac47a', rgb:[240,168,85],  jp:'花ひらく世界へ', jpWords:['花咲く','自然','光明']   },
  core:    { label:'CORE',    darkBg:'#06090f', lightBg:'#e8ecf2', acc:'#00ccff', acc2:'#ff5533', rgb:[0,204,255],   jp:'機械の都市へ',   jpWords:['構造','機械','密度']     },
  reclaim: { label:'RECLAIM', darkBg:'#060d08', lightBg:'#e6ede6', acc:'#40d898', acc2:'#c89850', rgb:[64,216,152],  jp:'自然が還る世界へ', jpWords:['回帰','共存','時間']   },
  beyond:  { label:'BEYOND',  darkBg:'#06050e', lightBg:'#eef0f8', acc:'#8855e8', acc2:'#f0cc44', rgb:[136,85,232],  jp:'星の彼方へ',     jpWords:['超越','宇宙','静寂']     },
};

/* ── Theme helper ────────────────────────────────────────────────────────── */
const tx = (dark, light, isDark) => isDark ? dark : light;

/* ── Works data ──────────────────────────────────────────────────────────── */
const WORKS_RAW = [
  { id:1, title:'Torii Garden',        type:'Generative Art',   year:'2025', tag:'ART',   jp:'鳥居の庭', img:WORLD_ART.bloom[0],   video:null, worlds:['bloom','reclaim'] },
  { id:2, title:'Below & Above',       type:'Generative Art',   year:'2025', tag:'ART',   jp:'水面',     img:WORLD_ART.bloom[3],   video:null, worlds:['reclaim','beyond'] },
  { id:3, title:'Threshold',           type:'Anime Short',      year:'2024', tag:'VIDEO', jp:'閾値',     img:WORLD_ART.bloom[1],   video:null, worlds:['bloom','reclaim'] },
  { id:4, title:'Azure City',          type:'Generative Art',   year:'2024', tag:'ART',   jp:'蒼天',     img:WORLD_ART.core[0],    video:null, worlds:['core','beyond']   },
  { id:5, title:'Moving Architecture', type:'Generative Art',   year:'2024', tag:'ART',   jp:'動く城',   img:WORLD_ART.core[1],    video:null, worlds:['core','reclaim']  },
  { id:6, title:'Reclaimed',           type:'Generative Art',   year:'2023', tag:'ART',   jp:'自然回帰', img:WORLD_ART.reclaim[0], video:null, worlds:['reclaim']         },
  { id:7, title:'Pulse Engine',        type:'Generative Music', year:'2023', tag:'MUSIC', jp:'脈動',     img:null,        video:null, worlds:['core']            },
  { id:8, title:'From Orbit',          type:'Generative Art',   year:'2025', tag:'ART',   jp:'軌道から', img:WORLD_ART.beyond[1],  video:null, worlds:['beyond']          },
  { id:9, title:'E.V.A.',              type:'Generative Art',   year:'2025', tag:'ART',   jp:'船外活動', img:WORLD_ART.beyond[0],  video:null, worlds:['beyond']          },
];
const WORKS = [...WORKS_RAW].sort((a,b) =>
  Math.sin(VISIT_SEED*a.id*9301+49297) - Math.sin(VISIT_SEED*b.id*9301+49297)
);

/* ── Curated world galleries ────────────────────────────────────────────── */
const WORLD_GALLERIES = {
  // soft lighting / countryside / flowers / calm city
  bloom: WORLD_ART.bloom,

  // industrial / dense / cyberpunk / mechanical
  core: WORLD_ART.core,

  // overgrown / vines / nature + structure
  reclaim: WORLD_ART.reclaim,

  // space / sky / massive scale / surreal
  beyond: WORLD_ART.beyond,
};

/* ── Reel video ──────────────────────────────────────────────────────────── */
const REEL_VIDEO = null;

/* ── Per-world hero background videos ───────────────────────────────────── */
const WORLD_VIDEO = {
  bloom:   'assets/video/world/bloom.webm',
  core:    'assets/video/world/core.webm',
  reclaim: 'assets/video/world/reclaim.webm',
  beyond:  'assets/video/world/beyond.webm',
};

/* ── Per-world card hover videos (Select a World cards on home) ────────────
   Short ambient loops (3–6s, 720p, ≤2MB). Null = keep image+filter hover. */
const WORLD_HOVER_VIDEO = {
  bloom:   null, // assets/video/hover/bloom-hover.mp4
  core:    null, // assets/video/hover/core-hover.mp4
  reclaim: null, // assets/video/hover/reclaim-hover.mp4
  beyond:  null, // assets/video/hover/beyond-hover.mp4
};

/* ── Tweaks defaults (used by edit-mode integration) ────────────────────── */
const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "name": "mr5am",
  "tagline": "visual worlds · motion · sound · systems",
  "mode": "bloom"
}/*EDITMODE-END*/;
