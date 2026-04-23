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

/* ── Works Stack (vertical cinematic) ────────────────────────────────────── */
function WorksSection({ mode, isDark }) {
  const cfg = MODES[mode];
  const hRef = useReveal();
  const [activeWork, setActiveWork] = useState(null);
  const heading = isDark ? '#f0ece4' : '#111';

  const filtered = useMemo(() => WORKS.filter(w => w.worlds.includes(mode)), [mode]);

  return (
    <section id="work" style={{ paddingTop:60 }}>
      <div ref={hRef} className="rv" style={{ padding:'0 32px 44px' }}>
        <div style={{ fontFamily:'Space Mono', fontSize:10, color:cfg.acc, letterSpacing:'.2em', textTransform:'uppercase', marginBottom:14 }}>
          002 / {cfg.label} WORLD —
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <h2 style={{ fontFamily:'Bebas Neue', fontSize:'clamp(52px,7vw,108px)', lineHeight:.92, letterSpacing:'.02em', color:heading }}>
            CREATED<br /><span style={{ WebkitTextStroke:`1px ${cfg.acc}`, color:'transparent' }}>& SHIPPED</span>
          </h2>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'Space Mono', fontSize:9, color:tx('rgba(255,255,255,0.28)','rgba(0,0,0,0.38)',isDark), letterSpacing:'.12em' }}>{filtered.length} WORKS</div>
            <div style={{ fontFamily:'Noto Sans JP', fontWeight:900, fontSize:13, color:tx('rgba(255,255,255,0.12)','rgba(0,0,0,0.15)',isDark), marginTop:2 }}>選ばれた作品</div>
          </div>
        </div>
      </div>

      {filtered.map((work, idx) => <WorkCardV key={work.id} work={work} cfg={cfg} isDark={isDark} index={idx} onOpen={setActiveWork} />)}

      {activeWork && <ProjectOverlay work={activeWork} cfg={cfg} isDark={isDark} onClose={() => setActiveWork(null)} />}
    </section>
  );
}
