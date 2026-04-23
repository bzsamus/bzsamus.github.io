/* ── Shared React hooks (resolved at runtime from React global) ─────────── */
const { useState, useEffect, useRef, useMemo } = React;

/* ── Visit seed ─────────────────────────────────────────────────────────── */
const VISIT_SEED = (() => {
  const k = 'mr5am_seed_v4';
  const e = sessionStorage.getItem(k);
  if (e) return parseInt(e);
  const s = Math.floor(Math.random() * 1e8);
  sessionStorage.setItem(k, s);
  return s;
})();

/* ── Random mode — fresh every page load ────────────────────────────────── */
const MODE_KEYS = ['forest', 'azure', 'lotus', 'orbit'];
const INITIAL_MODE = MODE_KEYS[Math.floor(Math.random() * MODE_KEYS.length)];

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

/* ── Mode config ─────────────────────────────────────────────────────────── */
const MODES = {
  forest: { label:'FOREST', darkBg:'#0b1410', lightBg:'#f3ede0', acc:'#b87d2a', acc2:'#6db88a', rgb:[184,125,42] },
  azure:  { label:'AZURE',  darkBg:'#080f1c', lightBg:'#e8f3fb', acc:'#3d9fc0', acc2:'#e0b840', rgb:[61,159,192]  },
  lotus:  { label:'LOTUS',  darkBg:'#060d0b', lightBg:'#e8f5f1', acc:'#2daa88', acc2:'#d0809a', rgb:[45,170,136]  },
  orbit:  { label:'ORBIT',  darkBg:'#08060f', lightBg:'#f3f0fa', acc:'#a855d4', acc2:'#e8a84a', rgb:[168,85,212]  },
};

/* ── Theme helper ────────────────────────────────────────────────────────── */
const tx = (dark, light, isDark) => isDark ? dark : light;

/* ── Mode → artwork index mapping ───────────────────────────────────────── */
const MODE_ART = {
  forest: [0, 4, 5],
  azure:  [1, 3, 6],
  lotus:  [2, 3, 4],
  orbit:  [7, 6, 1],
};

/* ── Works data ──────────────────────────────────────────────────────────── */
const WORKS_RAW = [
  { id:1, title:'Torii Garden',        type:'Generative Art',   year:'2025', tag:'ART',   jp:'鳥居の庭', img:ART_IMGS[0], worlds:['forest','lotus'] },
  { id:2, title:'Below & Above',       type:'Generative Art',   year:'2025', tag:'ART',   jp:'水面',     img:ART_IMGS[3], worlds:['azure','lotus']  },
  { id:3, title:'Threshold',           type:'Anime Short',      year:'2024', tag:'VIDEO', jp:'閾値',     img:ART_IMGS[4], worlds:['forest','lotus'] },
  { id:4, title:'Azure City',          type:'Generative Art',   year:'2024', tag:'ART',   jp:'蒼天',     img:ART_IMGS[1], worlds:['azure','orbit']  },
  { id:5, title:'Moving Architecture', type:'Generative Art',   year:'2024', tag:'ART',   jp:'動く城',   img:ART_IMGS[2], worlds:['orbit','azure']  },
  { id:6, title:'Reclaimed',           type:'Generative Art',   year:'2023', tag:'ART',   jp:'自然回帰', img:ART_IMGS[5], worlds:['forest','lotus'] },
  { id:7, title:'Pulse Engine',        type:'Generative Music', year:'2023', tag:'MUSIC', jp:'脈動',     img:null,        worlds:['orbit','azure']  },
  { id:8, title:'From Orbit',          type:'Generative Art',   year:'2025', tag:'ART',   jp:'軌道から', img:ART_IMGS[6], worlds:['orbit']          },
  { id:9, title:'E.V.A.',              type:'Generative Art',   year:'2025', tag:'ART',   jp:'船外活動', img:ART_IMGS[7], worlds:['orbit']          },
];
const WORKS = [...WORKS_RAW].sort((a,b) =>
  Math.sin(VISIT_SEED*a.id*9301+49297) - Math.sin(VISIT_SEED*b.id*9301+49297)
);

/* ── Tweaks defaults (used by edit-mode integration) ────────────────────── */
const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "name": "mr5am",
  "tagline": "generative art · anime · music · games",
  "mode": "forest"
}/*EDITMODE-END*/;
