/* ── Loading Screen ──────────────────────────────────────────────────────── */
function LoadingScreen({ mode, isDark, onDone }) {
  const cfg = MODES[mode];
  const bg = isDark ? cfg.darkBg : cfg.lightBg;
  const fg = isDark ? '#f0ece4' : '#1a1a1a';
  const fg2 = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)';
  const [phase, setPhase] = useState(0);
  const name = 'MR5AM';

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 2600);
    const t3 = setTimeout(onDone, 3400);
    return () => [t1,t2,t3].forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:2000, background:bg,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      clipPath: phase === 2 ? 'circle(0% at 50% 50%)' : 'circle(150% at 50% 50%)',
      transition: phase === 2 ? 'clip-path 0.85s cubic-bezier(.77,0,.18,1)' : 'none',
      pointerEvents: phase === 2 ? 'none' : 'all',
    }}>
      <div style={{
        position:'absolute', inset:0, overflow:'hidden',
        opacity: phase >= 1 ? (isDark ? 0.12 : 0.18) : 0,
        transition:'opacity 1.2s ease 0.4s',
      }}>
        <img src={ART_IMGS[VISIT_SEED % ART_IMGS.length]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'blur(2px)' }} />
      </div>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, ${bg} 80%)` }} />
      <div style={{ position:'relative', zIndex:1, textAlign:'center' }}>
        <div style={{ fontFamily:'Bebas Neue', fontSize:'clamp(64px,12vw,160px)', lineHeight:.9, letterSpacing:'.06em', color:fg, display:'flex', justifyContent:'center' }}>
          {name.split('').map((ch, i) => (
            <span key={i} style={{
              display:'inline-block',
              opacity: phase >= 1 ? 1 : 0,
              transform: phase >= 1 ? 'none' : 'translateY(20px)',
              transition: `opacity 0.5s ease ${0.08 + i*0.06}s, transform 0.6s cubic-bezier(.22,1,.36,1) ${0.08 + i*0.06}s`,
            }}>{ch}</span>
          ))}
        </div>
        <div style={{ margin:'24px auto 0', width:200, height:1, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', position:'relative', overflow:'hidden' }}>
          <div style={{
            position:'absolute', top:0, left:0, height:'100%', background:cfg.acc,
            width: phase >= 1 ? '100%' : '0%',
            transition:'width 1.8s cubic-bezier(.22,1,.36,1) 0.3s',
            boxShadow:`0 0 8px ${cfg.acc}`,
          }} />
        </div>
        <div style={{ fontFamily:'Noto Sans JP', fontWeight:700, fontSize:12, color:cfg.acc, letterSpacing:'.15em', marginTop:20, opacity:phase>=1?1:0, transition:'opacity 0.8s ease 0.8s' }}>
          創造と芸術の世界へ
        </div>
        <div style={{ fontFamily:'Space Mono', fontSize:9, color:fg2, letterSpacing:'.2em', textTransform:'uppercase', marginTop:10, opacity:phase>=1?0.6:0, transition:'opacity 0.8s ease 1s' }}>
          ENTERING {cfg.label} · {isDark ? 'NIGHT' : 'DAY'}
        </div>
      </div>
    </div>
  );
}

/* ── Nav ─────────────────────────────────────────────────────────────────── */
function Nav({ name, mode, onPortal, isDark, setIsDark }) {
  const cfg = MODES[mode];
  const [sc, setSc] = useState(false);
  const [hovOrb, setHovOrb] = useState(null);
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navBg = sc ? (isDark ? `${cfg.darkBg}f0` : `${cfg.lightBg}f0`) : 'transparent';
  const textFade = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)';
  const linkColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)';

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:100,
      padding:'14px 32px', display:'flex', alignItems:'center', justifyContent:'space-between',
      background:navBg, backdropFilter:sc?'blur(14px)':'none',
      borderBottom:`1px solid ${sc?cfg.acc+'28':'transparent'}`, transition:'all .4s',
    }}>
      <span style={{ fontFamily:'Space Mono', fontSize:11, color:cfg.acc, letterSpacing:'.14em' }}>
        {name}<span style={{ color:textFade }}> / {new Date().getFullYear()}</span>
      </span>

      <div style={{ display:'flex', gap:10, alignItems:'center' }}>
        {Object.entries(MODES).map(([k, m]) => {
          const isActive = mode === k;
          const isHov = hovOrb === k;
          return (
            <div key={k} style={{ position:'relative', display:'flex', alignItems:'center' }}>
              <button
                onClick={() => k !== mode && onPortal(k)}
                onMouseEnter={() => setHovOrb(k)}
                onMouseLeave={() => setHovOrb(null)}
                title={m.label}
                style={{
                  width:isActive?30:22, height:isActive?30:22, borderRadius:'50%',
                  cursor:k===mode?'default':'pointer',
                  border:`2px solid ${isActive?m.acc:(isHov?m.acc+'88':(isDark?'rgba(255,255,255,0.12)':'rgba(0,0,0,0.14)'))}`,
                  background:isActive?m.acc:(isHov?`${m.acc}28`:`${m.acc}12`),
                  boxShadow:isActive?`0 0 14px ${m.acc}88, 0 0 5px ${m.acc}`:(isHov?`0 0 8px ${m.acc}44`:'none'),
                  transition:'all .25s cubic-bezier(.22,1,.36,1)', padding:0,
                }}
              />
              {(isHov || isActive) && (
                <span style={{
                  position:'absolute', top:'calc(100% + 7px)', left:'50%', transform:'translateX(-50%)',
                  fontFamily:'Space Mono', fontSize:7, letterSpacing:'.12em', color:m.acc,
                  whiteSpace:'nowrap', pointerEvents:'none',
                }}>{m.label}</span>
              )}
            </div>
          );
        })}
        <button onClick={() => setIsDark(d => !d)} title={isDark?'Day mode':'Night mode'} style={{
          marginLeft:4, width:28, height:28, borderRadius:'50%', cursor:'pointer',
          border:`1px solid ${cfg.acc}44`, background:isDark?cfg.acc+'18':cfg.acc+'22',
          color:cfg.acc, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .25s',
        }}>
          {isDark ? '☀' : '☾'}
        </button>
      </div>

      <div style={{ display:'flex', gap:28 }}>
        {['work','about','contact'].map(s => (
          <a key={s} href={`#${s}`} style={{
            fontFamily:'Space Mono', fontSize:9, letterSpacing:'.14em', textTransform:'uppercase',
            color:linkColor, textDecoration:'none', transition:'color .2s',
          }}
          onMouseEnter={e => e.target.style.color = cfg.acc}
          onMouseLeave={e => e.target.style.color = linkColor}
          >{s}</a>
        ))}
      </div>
    </nav>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
function Hero({ name, mode, isDark }) {
  const cfg = MODES[mode];
  const [vis, setVis] = useState(false);
  const [discIdx, setDiscIdx] = useState(0);
  const discs = ['painterly worlds', 'generative art', 'anime films', 'original music', 'indie games', 'web systems'];
  useEffect(() => { setTimeout(() => setVis(true), 150); }, []);
  useEffect(() => {
    const iv = setInterval(() => setDiscIdx(i => (i+1) % discs.length), 2600);
    return () => clearInterval(iv);
  }, []);

  const tr = d => ({
    opacity: vis ? 1 : 0,
    transform: vis ? 'none' : 'translateY(32px)',
    transition: `opacity .9s ease ${d}s, transform 1s cubic-bezier(.22,1,.36,1) ${d}s`,
  });

  const subColor = 'rgba(255,255,255,0.55)';
  const dotInactive = 'rgba(255,255,255,0.15)';
  const jpColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.18)';
  const scrollColor = 'rgba(255,255,255,0.4)';
  const mq = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.22)';

  const lines = [
    { text:'BUILDING', outline:true  },
    { text:'WORLDS',   outline:false },
    { text:'FROM',     outline:true  },
    { text:'NOTHING',  outline:false },
  ];

  return (
    <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 32px 72px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:88, right:32, textAlign:'right', opacity:vis?1:0, transition:'opacity 1.4s ease 2s', pointerEvents:'none' }}>
        {['創造者','芸術家','製作者'].map((w,i) => (
          <div key={i} style={{ fontFamily:'Noto Sans JP', fontWeight:900, fontSize:11, color:jpColor, letterSpacing:'.06em', lineHeight:2.1 }}>{w}</div>
        ))}
      </div>
      <div style={{ position:'absolute', top:90, left:32, opacity:vis?.8:0, transition:'opacity 1s ease 2s', zIndex:10 }}>
        <div style={{ fontFamily:'Space Mono', fontSize:8, color:cfg.acc, letterSpacing:'.18em', border:`1px solid ${cfg.acc}55`, padding:'4px 12px', display:'inline-flex', alignItems:'center', gap:8, backdropFilter:'blur(6px)', background:`${cfg.acc}10` }}>
          <span style={{ width:5, height:5, borderRadius:'50%', background:cfg.acc, display:'inline-block', boxShadow:`0 0 6px ${cfg.acc}` }} />
          {cfg.label} · {isDark ? 'NIGHT' : 'DAY'}
        </div>
      </div>

      <div style={{ position:'relative', zIndex:7 }}>
        <div style={{ fontFamily:'Space Mono', fontSize:10, color:cfg.acc, letterSpacing:'.22em', textTransform:'uppercase', marginBottom:16, ...tr(.2) }}>
          ✦ PORTFOLIO · {new Date().getFullYear()} ✦
        </div>
        <h1 style={{ ...tr(.1), lineHeight:1 }}>
          {lines.map((ln, i) => (
            <span key={i} style={{
              display:'block', fontFamily:'Bebas Neue',
              fontSize:'clamp(68px,11.5vw,190px)', lineHeight:.87, letterSpacing:'.02em',
              color: ln.outline ? 'transparent' : (isDark ? '#f0ece4' : '#fff'),
              WebkitTextStroke: ln.outline ? '1.5px rgba(255,255,255,0.72)' : 'none',
            }}>{ln.text}</span>
          ))}
        </h1>
        <div style={{ marginTop:28, display:'flex', alignItems:'center', gap:16, ...tr(.45) }}>
          <div style={{ width:36, height:1, background:`linear-gradient(90deg,${cfg.acc},transparent)` }} />
          <span style={{ fontFamily:'Space Mono', fontSize:13, color:subColor, fontStyle:'italic', minWidth:200 }}>{discs[discIdx]}</span>
          <div style={{ display:'flex', gap:4 }}>
            {discs.map((_,i) => (
              <div key={i} style={{ width:i===discIdx?18:4, height:2, background:i===discIdx?cfg.acc:dotInactive, borderRadius:1, transition:'all .35s' }} />
            ))}
          </div>
        </div>
        <div style={{ marginTop:48, display:'flex', alignItems:'center', gap:12, opacity:vis?.45:0, transition:'opacity 1.2s ease 1.6s' }}>
          <div style={{ width:1, height:44, background:`linear-gradient(${cfg.acc},transparent)`, animation:'scrollPulse 2s ease infinite' }} />
          <span style={{ fontFamily:'Space Mono', fontSize:9, color:scrollColor, letterSpacing:'.2em', textTransform:'uppercase' }}>scroll</span>
        </div>
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, borderTop:'1px solid rgba(255,255,255,0.08)', overflow:'hidden', padding:'10px 0', opacity:vis?1:0, transition:'opacity 1.5s ease 1.8s', zIndex:7 }}>
        <div style={{ display:'flex', whiteSpace:'nowrap', animation:'mq 22s linear infinite', width:'max-content' }}>
          {[...Array(10)].map((_,i) => (
            <span key={i} style={{ fontFamily:'Space Mono', fontSize:10, color:mq, letterSpacing:'.2em', textTransform:'uppercase', padding:'0 28px' }}>
              art ✦ code ✦ music ✦ anime ✦ motion ✦ games ✦ systems ✦
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section BG wrapper ──────────────────────────────────────────────────── */
function ContentBG({ children, mode, isDark }) {
  const cfg = MODES[mode];
  const bg = isDark ? cfg.darkBg : cfg.lightBg;
  return (
    <div style={{ position:'relative', zIndex:7 }}>
      <div style={{ height:90, background:`linear-gradient(to bottom, transparent, ${bg})`, pointerEvents:'none' }} />
      <div style={{ background:bg, transition:'background 0.8s ease' }}>{children}</div>
    </div>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
function Footer({ name, mode, isDark }) {
  const cfg = MODES[mode];
  const dim = tx('rgba(255,255,255,0.1)','rgba(0,0,0,0.2)',isDark);
  return (
    <footer style={{ padding:'26px 32px', borderTop:`1px solid ${tx(cfg.acc+'12',cfg.acc+'20',isDark)}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <span style={{ fontFamily:'Space Mono', fontSize:9, color:dim, letterSpacing:'.1em' }}>© {new Date().getFullYear()} {name}</span>
      <span style={{ fontFamily:'Noto Sans JP', fontWeight:900, fontSize:11, color:tx('rgba(255,255,255,0.08)','rgba(0,0,0,0.15)',isDark) }}>愛情を持って作られた</span>
      <span style={{ fontFamily:'Space Mono', fontSize:9, color:dim, letterSpacing:'.1em' }}>#{VISIT_SEED.toString(16).slice(-4).toUpperCase()}</span>
    </footer>
  );
}
