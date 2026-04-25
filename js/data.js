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
const MODE_KEYS = ['bloom', 'core', 'reclaim', 'beyond'];
const INITIAL_MODE = MODE_KEYS[Math.floor(Math.random() * MODE_KEYS.length)];
const HOME_ROUTE = 'home';
const ROUTE_KEYS = [HOME_ROUTE, ...MODE_KEYS];

/* ── Hero background images (assets/image/hero/) ────────────────────────── */
const ART_IMGS = [
  'assets/image/hero/mr5am_torii_flowers_sun_rays_sun_beams_in_the_style_of_multi-_2fb4ccc6-0778-433b-80f7-a274c8c3e6ae_2.png',
  'assets/image/hero/mr5am_A_painterly_anime_illustration_style_reminiscent_of_Stu_3eaab53c-c771-4d6c-8333-e797aa8bc109_2.png',
  'assets/image/hero/mr5am_A_painterly_anime_illustration_style_reminiscent_of_Stu_9c58bc0e-17e6-4210-86e1-5b6eaccb3a08_2.png',
  'assets/image/hero/mr5am_Dual_scenery_above_and_below_the_water_surface._Above_t_ed2ed109-eb7d-479b-8f01-c558e15189da_2.png',
  'assets/image/hero/mr5am_A_painterly_anime_illustration_style_reminiscent_of_Stu_347cd1e8-cbeb-4074-9730-834b0a65c0ec_3.png',
  'assets/image/hero/mr5am_A_painterly_anime_illustration_style_reminiscent_of_Stu_9c58bc0e-17e6-4210-86e1-5b6eaccb3a08_3.png',
  'assets/image/hero/mr5am_A_painterly_anime_illustration_style_reminiscent_of_Stu_ab2b930c-028a-4c8c-ac70-318cf341d5fc_1.png',
  'assets/image/hero/mr5am_A_painterly_anime_illustration_style_reminiscent_of_Stu_a40f8b1b-9f5f-44f9-a0b2-554d9e817cfd_0.png',
];
ART_IMGS.forEach(s => { const i = new Image(); i.src = s; });

/* ── Homepage world route metadata (single source of truth for labels) ─── */
const WORLD_ROUTE_META = {
  bloom:   { key:'bloom',   label:'Bloom',   heroImg:ART_IMGS[0], description:'Lush growth and warm sunlight.' },
  core:    { key:'core',    label:'Core',    heroImg:ART_IMGS[1], description:'Mechanical density and electric structure.' },
  reclaim: { key:'reclaim', label:'Reclaim', heroImg:ART_IMGS[2], description:'Nature returning through the ruins.' },
  beyond:  { key:'beyond',  label:'Beyond',  heroImg:ART_IMGS[7], description:'Deep space, silence, and cosmic scale.' },
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

/* ── World → artwork index mapping ──────────────────────────────────────── */
const MODE_ART = {
  bloom:   [0, 4, 5],
  core:    [1, 3, 6],
  reclaim: [2, 3, 4],
  beyond:  [7, 6, 1],
};

/* ── Works data ──────────────────────────────────────────────────────────── */
const WORKS_RAW = [
  { id:1, title:'Torii Garden',        type:'Generative Art',   year:'2025', tag:'ART',   jp:'鳥居の庭', img:ART_IMGS[0], video:null, worlds:['bloom','reclaim'] },
  { id:2, title:'Below & Above',       type:'Generative Art',   year:'2025', tag:'ART',   jp:'水面',     img:ART_IMGS[3], video:null, worlds:['reclaim','beyond'] },
  { id:3, title:'Threshold',           type:'Anime Short',      year:'2024', tag:'VIDEO', jp:'閾値',     img:ART_IMGS[4], video:null, worlds:['bloom','reclaim'] },
  { id:4, title:'Azure City',          type:'Generative Art',   year:'2024', tag:'ART',   jp:'蒼天',     img:ART_IMGS[1], video:null, worlds:['core','beyond']   },
  { id:5, title:'Moving Architecture', type:'Generative Art',   year:'2024', tag:'ART',   jp:'動く城',   img:ART_IMGS[2], video:null, worlds:['core','reclaim']  },
  { id:6, title:'Reclaimed',           type:'Generative Art',   year:'2023', tag:'ART',   jp:'自然回帰', img:ART_IMGS[5], video:null, worlds:['reclaim']         },
  { id:7, title:'Pulse Engine',        type:'Generative Music', year:'2023', tag:'MUSIC', jp:'脈動',     img:null,        video:null, worlds:['core']            },
  { id:8, title:'From Orbit',          type:'Generative Art',   year:'2025', tag:'ART',   jp:'軌道から', img:ART_IMGS[6], video:null, worlds:['beyond']          },
  { id:9, title:'E.V.A.',              type:'Generative Art',   year:'2025', tag:'ART',   jp:'船外活動', img:ART_IMGS[7], video:null, worlds:['beyond']          },
];
const WORKS = [...WORKS_RAW].sort((a,b) =>
  Math.sin(VISIT_SEED*a.id*9301+49297) - Math.sin(VISIT_SEED*b.id*9301+49297)
);

/* ── Reel video ──────────────────────────────────────────────────────────── */
const REEL_VIDEO = 'assets/video/reel.mp4';

/* ── Tweaks defaults (used by edit-mode integration) ────────────────────── */
const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "name": "mr5am",
  "tagline": "generative art · anime · music · games",
  "mode": "bloom"
}/*EDITMODE-END*/;
