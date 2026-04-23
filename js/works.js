/* ── Category config ──────────────────────────────────────────────────────── */
const CATEGORIES = ['ART', 'VIDEO', 'MUSIC', 'GAME', 'WEB'];
const CAT_JP   = { ART:'芸術', VIDEO:'映像', MUSIC:'音楽', GAME:'ゲーム', WEB:'ウェブ' };
const CAT_DESC = { ART:'Generative & Painterly', VIDEO:'Anime & Motion', MUSIC:'Generative & Ambient', GAME:'Indie & Experimental', WEB:'Systems & Interfaces' };

/* ── Project Overlay ─────────────────────────────────────────────────────── */
function ProjectOverlay({ work, cfg, isDark, onClose }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 10);
    const onKey = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, []);
  const close = () => { setOpen(false); setTimeout(onClose, 520); };
  const bg = isDark ? '#080808' : '#f5f4f0';
  const fg = isDark ? '#f0ece4' : '#111';
  const sub = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.5)';
  return (
    <div style={{ position:'fixed', inset:0, zIndex:800, pointerEvents: open ? 'all' : 'none' }}>
      <div onClick={close} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.72)', backdropFilter:'blur(5px)', opacity:open?1:0, transition:'opacity .4s' }} />
      <div className="proj-ov-panel" style={{
        position:'absolute', bottom:0, left:0, right:0, maxHeight:'90vh', overflowY:'auto',
        background:bg, borderRadius:'14px 14px 0 0', borderTop:`1px solid ${cfg.acc}44`,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
      }}>
        {work.img && (
          <div style={{ height:'42vh', overflow:'hidden', position:'relative' }}>
            <img src={work.img} alt={work.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top,${bg} 0%,transparent 55%)` }} />
          </div>
        )}
        <div style={{ padding: work.img ? '0 40px 60px' : '40px 40px 60px', marginTop: work.img ? -48 : 0 }}>
          <div style={{ display:'flex', justifyContent:'flex-end', paddingBottom:16 }}>
            <button onClick={close} style={{ fontFamily:'Space Mono', fontSize:9, letterSpacing:'.12em', color:sub, background:'none', border:`1px solid ${cfg.acc}33`, padding:'6px 16px', cursor:'pointer', borderRadius:2 }}>ESC / CLOSE</button>
          </div>
          <div style={{ fontFamily:'Space Mono', fontSize:8, color:cfg.acc, letterSpacing:'.22em', marginBottom:10 }}>{work.tag} · {work.year}</div>
          <h2 style={{ fontFamily:'Bebas Neue', fontSize:'clamp(52px,8vw,120px)', lineHeight:.88, color:fg, marginBottom:8, letterSpacing:'.02em' }}>{work.title}</h2>
          <div style={{ fontFamily:'Noto Sans JP', fontWeight:700, fontSize:15, color:`${cfg.acc}80`, marginBottom:20 }}>{work.jp}</div>
          <div style={{ fontFamily:'Space Mono', fontSize:11, color:sub, lineHeight:2 }}>{work.type}</div>
          <div style={{ marginTop:36, display:'flex', gap:14 }}>
            <a href="#" style={{ fontFamily:'Space Mono', fontSize:9, letterSpacing:'.14em', color:cfg.acc, border:`1px solid ${cfg.acc}`, padding:'10px 26px', textDecoration:'none', transition:'all .2s' }}
              onMouseEnter={e=>{e.currentTarget.style.background=cfg.acc;e.currentTarget.style.color='#000';}}
              onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=cfg.acc;}}
            >VIEW WORK ↗</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Work Card V (vertical cinematic) ────────────────────────────────────── */
function WorkCardV({ work, cfg, isDark, index, onOpen }) {
  const [hov, setHov] = useState(false);
  const ref = useReveal('-80px');
  return (
    <div ref={ref} className="rv work-v"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(work)}
      style={{ borderBottom:`1px solid ${cfg.acc}18` }}
    >
      {work.img
        ? <img src={work.img} alt={work.title} className="work-v-img" style={{ filter: isDark ? 'brightness(0.55)' : 'brightness(0.5) saturate(1.1)' }} />
        : <div style={{ position:'absolute', inset:0, background:`repeating-linear-gradient(45deg,${cfg.acc}06,${cfg.acc}06 1px,transparent 1px,transparent 22px)` }} />
      }
      {/* Overlays */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,rgba(0,0,0,.7) 0%,rgba(0,0,0,.15) 55%,rgba(0,0,0,0) 100%)' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,.65) 0%,rgba(0,0,0,0) 55%)' }} />
      <div style={{ position:'absolute', inset:0, background:`${cfg.acc}18`, opacity:hov?1:0, transition:'opacity .6s', mixBlendMode:'screen' }} />

      {/* Index number watermark */}
      <div style={{ position:'absolute', top:20, right:28, fontFamily:'Bebas Neue', fontSize:90, color:'rgba(255,255,255,0.05)', lineHeight:1, pointerEvents:'none' }}>
        {String(index+1).padStart(2,'0')}
      </div>

      {/* Tag */}
      <div style={{ position:'absolute', top:22, left:28, fontFamily:'Space Mono', fontSize:8, letterSpacing:'.14em', color:'#fff', background:'rgba(0,0,0,0.45)', backdropFilter:'blur(8px)', border:`1px solid ${cfg.acc}55`, padding:'3px 10px', borderRadius:1 }}>
        {work.tag}
      </div>

      {/* Content — slides up on hover */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'28px 28px 32px', transform:hov?'translateY(0)':'translateY(10px)', transition:'transform .5s cubic-bezier(.22,1,.36,1)' }}>
        <div style={{ fontFamily:'Noto Sans JP', fontWeight:900, fontSize:10, color:`rgba(255,255,255,${hov?.65:.3})`, letterSpacing:'.08em', marginBottom:6, transition:'color .3s' }}>
          {work.jp} · {work.year}
        </div>
        <h3 style={{ fontFamily:'Bebas Neue', fontSize:'clamp(34px,4.5vw,68px)', lineHeight:.9, letterSpacing:'.02em', color:'#fff', marginBottom:10 }}>{work.title}</h3>
        <div style={{ fontFamily:'Space Mono', fontSize:10, color:'rgba(255,255,255,0.45)', marginBottom:14 }}>{work.type}</div>
        {/* CTA */}
        <div style={{ display:'flex', alignItems:'center', gap:10, opacity:hov?1:0, transform:hov?'translateX(0)':'translateX(-14px)', transition:'all .4s cubic-bezier(.22,1,.36,1)' }}>
          <div style={{ width:28, height:1, background:cfg.acc }} />
          <span style={{ fontFamily:'Space Mono', fontSize:9, color:cfg.acc, letterSpacing:'.16em' }}>VIEW PROJECT</span>
          <span style={{ color:cfg.acc, fontSize:13 }}>→</span>
        </div>
      </div>
    </div>
  );
}

/* ── Category Tile ───────────────────────────────────────────────────────── */
function CategoryTile({ category, works, cfg, isDark, onSelect }) {
  const [hov, setHov] = useState(false);
  const ref = useReveal('-60px');
  const coverImg = works.find(w => w.img)?.img || null;
  return (
    <div ref={ref} className="rv cat-tile"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onSelect(category)}
      style={{ borderBottom:`1px solid ${cfg.acc}18` }}
    >
      {coverImg
        ? <img src={coverImg} alt="" className="cat-tile-img" />
        : <div style={{ position:'absolute', inset:0, background:`repeating-linear-gradient(45deg,${cfg.acc}05,${cfg.acc}05 1px,transparent 1px,transparent 22px)` }} />
      }
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,rgba(0,0,0,.88) 0%,rgba(0,0,0,.55) 45%,rgba(0,0,0,.18) 100%)' }} />
      {/* Accent left bar */}
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:cfg.acc, opacity:hov?1:0.25, transition:'opacity .3s' }} />

      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 40px 0 44px' }}>
        {/* Left */}
        <div>
          <div style={{ fontFamily:'Space Mono', fontSize:8, color:cfg.acc, letterSpacing:'.22em', marginBottom:4 }}>
            {CAT_JP[category]}
          </div>
          <div style={{
            fontFamily:'Bebas Neue', fontSize:'clamp(64px,7.5vw,118px)', lineHeight:.88, color:'#fff', letterSpacing:'.02em',
            transform: hov ? 'translateX(8px)' : 'translateX(0)', transition:'transform .4s cubic-bezier(.22,1,.36,1)',
          }}>
            {category}
          </div>
          <div style={{
            fontFamily:'Space Mono', fontSize:9, color:'rgba(255,255,255,0.38)', letterSpacing:'.1em', marginTop:7,
            opacity: hov ? 1 : 0, transform: hov ? 'translateY(0)' : 'translateY(6px)', transition:'all .35s .05s',
          }}>
            {CAT_DESC[category]}
          </div>
        </div>
        {/* Right */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10 }}>
          {works.length > 0 ? (
            <div style={{ fontFamily:'Space Mono', fontSize:10, color:'rgba(255,255,255,.5)', letterSpacing:'.12em' }}>
              {works.length} {works.length === 1 ? 'WORK' : 'WORKS'}
            </div>
          ) : (
            <div style={{ fontFamily:'Space Mono', fontSize:8, color:cfg.acc, letterSpacing:'.18em', border:`1px solid ${cfg.acc}55`, padding:'4px 12px' }}>
              SOON
            </div>
          )}
          <div style={{
            fontFamily:'Bebas Neue', fontSize:34, color:cfg.acc,
            opacity: hov ? 1 : 0.25, transform: hov ? 'translateX(6px)' : 'translateX(0)', transition:'all .35s',
          }}>→</div>
        </div>
      </div>
    </div>
  );
}

/* ── Category Detail ─────────────────────────────────────────────────────── */
function CategoryDetail({ category, works, cfg, isDark, onBack, onOpen }) {
  const hRef = useReveal();
  const heading = isDark ? '#f0ece4' : '#111';
  const sub = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.5)';
  return (
    <div>
      <div ref={hRef} className="rv" style={{ padding:'0 32px 44px' }}>
        <button onClick={onBack} style={{
          fontFamily:'Space Mono', fontSize:9, letterSpacing:'.14em', color:cfg.acc,
          background:'none', border:`1px solid ${cfg.acc}44`, padding:'7px 18px',
          cursor:'pointer', marginBottom:36, display:'inline-flex', alignItems:'center', gap:10,
          transition:'border-color .2s',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = cfg.acc}
          onMouseLeave={e => e.currentTarget.style.borderColor = `${cfg.acc}44`}
        >
          <span>←</span><span>ALL CATEGORIES</span>
        </button>
        <div style={{ fontFamily:'Space Mono', fontSize:10, color:cfg.acc, letterSpacing:'.2em', marginBottom:14 }}>
          002 / WORKS —
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <h2 style={{ fontFamily:'Bebas Neue', fontSize:'clamp(52px,7vw,108px)', lineHeight:.92, letterSpacing:'.02em', color:heading }}>
            {category}<br />
            <span style={{ WebkitTextStroke:`1px ${cfg.acc}`, color:'transparent' }}>{CAT_JP[category]}</span>
          </h2>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'Space Mono', fontSize:9, color:sub, letterSpacing:'.12em' }}>
              {works.length} {works.length === 1 ? 'WORK' : 'WORKS'}
            </div>
            <div style={{ fontFamily:'Space Mono', fontSize:9, color:sub, letterSpacing:'.1em', marginTop:4 }}>
              {CAT_DESC[category]}
            </div>
          </div>
        </div>
      </div>

      {works.length === 0 ? (
        <div style={{ margin:'0 32px 60px', padding:'80px 32px', textAlign:'center', border:`1px solid ${cfg.acc}22`, display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
          <div style={{ fontFamily:'Bebas Neue', fontSize:52, color:cfg.acc, opacity:.3 }}>IN PROGRESS</div>
          <div style={{ fontFamily:'Space Mono', fontSize:9, color:sub, letterSpacing:'.18em' }}>WORKS COMING SOON</div>
        </div>
      ) : (
        works.map((work, idx) => (
          <WorkCardV key={work.id} work={work} cfg={cfg} isDark={isDark} index={idx} onOpen={onOpen} />
        ))
      )}
    </div>
  );
}

/* ── Works Section ───────────────────────────────────────────────────────── */
function WorksSection({ mode, isDark }) {
  const cfg = MODES[mode];
  const hRef = useReveal();
  const [selectedCat, setSelectedCat] = useState(null);
  const [activeWork, setActiveWork] = useState(null);
  const heading = isDark ? '#f0ece4' : '#111';

  const worksByCat = useMemo(() =>
    Object.fromEntries(CATEGORIES.map(c => [c, WORKS.filter(w => w.tag === c)])),
    []
  );

  return (
    <section id="work" style={{ paddingTop:60 }}>
      {selectedCat ? (
        <CategoryDetail
          category={selectedCat}
          works={worksByCat[selectedCat]}
          cfg={cfg}
          isDark={isDark}
          onBack={() => setSelectedCat(null)}
          onOpen={setActiveWork}
        />
      ) : (
        <>
          <div ref={hRef} className="rv" style={{ padding:'0 32px 44px' }}>
            <div style={{ fontFamily:'Space Mono', fontSize:10, color:cfg.acc, letterSpacing:'.2em', textTransform:'uppercase', marginBottom:14 }}>
              002 / {cfg.label} WORLD —
            </div>
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
              <h2 style={{ fontFamily:'Bebas Neue', fontSize:'clamp(52px,7vw,108px)', lineHeight:.92, letterSpacing:'.02em', color:heading }}>
                CREATED<br /><span style={{ WebkitTextStroke:`1px ${cfg.acc}`, color:'transparent' }}>& SHIPPED</span>
              </h2>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:'Space Mono', fontSize:9, color:tx('rgba(255,255,255,0.28)','rgba(0,0,0,0.38)',isDark), letterSpacing:'.12em' }}>{WORKS.length} WORKS</div>
                <div style={{ fontFamily:'Noto Sans JP', fontWeight:900, fontSize:13, color:tx('rgba(255,255,255,0.12)','rgba(0,0,0,0.15)',isDark), marginTop:2 }}>選ばれた作品</div>
              </div>
            </div>
          </div>
          {CATEGORIES.map(cat => (
            <CategoryTile key={cat} category={cat} works={worksByCat[cat]} cfg={cfg} isDark={isDark} onSelect={setSelectedCat} />
          ))}
        </>
      )}
      {activeWork && <ProjectOverlay work={activeWork} cfg={cfg} isDark={isDark} onClose={() => setActiveWork(null)} />}
    </section>
  );
}
