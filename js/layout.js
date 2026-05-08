/* ── Loading Screen ───────────────────────────────────────────────────────
   Art-house phased reveal:
   0-300ms   : background fades in (world hero image, blurred)
   300-2200  : MR5AM letters stagger in, progress bar fills, JP + entering text
   2200-3200 : letterbox bars slide IN from top+bottom and meet at center
   3200-3600 : bars slide OUT (top bar continues down, bottom continues up)
                — film-wipe through frame, revealing the site beneath. */
function LoadingScreen({ mode, isDark, onDone }) {
  const cfg = MODES[mode];
  const bg = isDark ? cfg.darkBg : cfg.lightBg;
  const fg = isDark ? '#f0ece4' : '#1a1a1a';
  const fg2 = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)';
  const [phase, setPhase] = useState(0);
  const name = 'MR5AM';
  const heroSrc = ART_IMGS[VISIT_SEED % ART_IMGS.length];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 2200); // bars close
    const t3 = setTimeout(() => setPhase(3), 3200); // bars open through
    const t4 = setTimeout(onDone, 3600);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, []);

  // Bar transforms — each 50vh tall, paired top/bottom.
  // closed = both at 0%; intro = offscreen (top -100%, bot 100%); exit = sweep through (top 100%, bot -100%).
  let topY = '-100%', botY = '100%';
  if (phase >= 2 && phase < 3) { topY = '0%'; botY = '0%'; }
  else if (phase >= 3) { topY = '100%'; botY = '-100%'; }

  const barBase = {
    position:'absolute', left:0, right:0, height:'50vh',
    transition:'transform .55s cubic-bezier(.77,0,.18,1)',
    willChange:'transform', zIndex:3,
  };
  const barTint = `rgba(${cfg.rgb.join(',')},0.18)`;

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:2000, overflow:'hidden',
      pointerEvents: phase >= 3 ? 'none' : 'all',
    }}>
      {/* Background hero image (always present, fades in) */}
      <div style={{
        position:'absolute', inset:0, overflow:'hidden',
        opacity: phase >= 1 ? 1 : 0,
        transition:'opacity 1.2s ease',
      }}>
        <img src={heroSrc} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'blur(8px) saturate(0.6) brightness(0.45)', transform:'scale(1.08)' }} />
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse 70% 60% at 50% 55%, transparent 0%, ${bg} 85%)` }} />
        <div style={{ position:'absolute', inset:0, background:bg, opacity: isDark ? 0.55 : 0.7 }} />
      </div>

      {/* Center stack — name, bar, JP, entering label */}
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:2,
        opacity: phase >= 2 ? 0 : 1,
        transition:'opacity .4s ease',
      }}>
        <div style={{ textAlign:'center' }}>
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
              transition:'width 1.6s cubic-bezier(.22,1,.36,1) 0.3s',
              boxShadow:`0 0 8px ${cfg.acc}`,
            }} />
          </div>
          <div style={{ fontFamily:'Noto Sans JP', fontWeight:700, fontSize:12, color:cfg.acc, letterSpacing:'.15em', marginTop:20, opacity:phase>=1?1:0, transition:'opacity 0.8s ease 0.8s' }}>
            {cfg.jp}
          </div>
          <div style={{ fontFamily:'Space Mono', fontSize:9, color:fg2, letterSpacing:'.2em', textTransform:'uppercase', marginTop:10, opacity:phase>=1?0.7:0, transition:'opacity 0.8s ease 1s' }}>
            ENTERING {cfg.label} · {isDark ? 'NIGHT' : 'DAY'}
          </div>
        </div>
      </div>

      {/* Letterbox bars — close, then sweep through */}
      <div style={{ ...barBase, top:0, transform:`translateY(${topY})`,
        background:`linear-gradient(180deg, ${bg} 0%, ${bg} 70%, ${barTint} 100%)` }} />
      <div style={{ ...barBase, bottom:0, transform:`translateY(${botY})`,
        background:`linear-gradient(0deg, ${bg} 0%, ${bg} 70%, ${barTint} 100%)` }} />

      {/* Center seam line — flashes when bars meet */}
      <div style={{
        position:'absolute', left:0, right:0, top:'50%', height:1, zIndex:4,
        background:cfg.acc, boxShadow:`0 0 18px ${cfg.acc}, 0 0 5px ${cfg.acc}`,
        opacity: phase === 2 ? 1 : 0,
        transform: phase === 2 ? 'scaleX(1)' : 'scaleX(0.1)',
        transformOrigin:'center',
        transition:'opacity .25s ease, transform .35s cubic-bezier(.22,1,.36,1)',
      }} />
    </div>
  );
}

/* ── Nav ─────────────────────────────────────────────────────────────────────── */
function Nav({ name, mode, onAnchor, onHome, isDark, setIsDark, isHome }) {
  const cfg = MODES[mode];
  const [sc, setSc] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (!isHome) { setActiveSection(null); return; }
    const ids = ['about','contact'];
    const els = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (els.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length === 0) { setActiveSection(null); return; }
      // Pick the one closest to the top of the viewport (smallest top offset).
      visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      setActiveSection(visible[0].target.id);
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

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
      <a
        href="/"
        aria-label="Return home"
        onClick={e => {
          if (typeof onHome === 'function') {
            e.preventDefault();
            onHome();
          }
        }}
        style={{ fontFamily:'Space Mono', fontSize:11, color:cfg.acc, letterSpacing:'.14em', textDecoration:'none' }}
      >
        {name}<span style={{ color:textFade }}> / {new Date().getFullYear()}</span>
      </a>

      <div style={{ display:'flex', gap:18, alignItems:'center' }}>
        {!isHome && (
          <a
            href="/"
            aria-label="Return home"
            onClick={e => {
              if (typeof onHome === 'function') {
                e.preventDefault();
                onHome();
              }
            }}
            style={{
              fontFamily:'Space Mono', fontSize:9, letterSpacing:'.14em', textTransform:'uppercase',
              color:cfg.acc, textDecoration:'none', border:`1px solid ${cfg.acc}44`,
              padding:'7px 12px', background:`${cfg.acc}10`, transition:'border-color .2s, background .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = cfg.acc; e.currentTarget.style.background = `${cfg.acc}20`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${cfg.acc}44`; e.currentTarget.style.background = `${cfg.acc}10`; }}
          >
            Home
          </a>
        )}
        <button onClick={() => setIsDark(d => !d)} title={isDark?'Day mode':'Night mode'}
          aria-label={isDark?'Switch to day mode':'Switch to night mode'}
          aria-pressed={!isDark}
          style={{
            width:28, height:28, borderRadius:'50%', cursor:'pointer',
            border:`1px solid ${cfg.acc}44`, background:isDark?cfg.acc+'18':cfg.acc+'22',
            color:cfg.acc, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .25s',
          }}>
          {isDark ? '☀' : '☾'}
        </button>
        {['about','contact'].map(s => {
          const isActive = activeSection === s;
          const baseColor = isActive ? cfg.acc : linkColor;
          return (
            <a key={s} href={`#${s}`} style={{
              fontFamily:'Space Mono', fontSize:9, letterSpacing:'.14em', textTransform:'uppercase',
              color:baseColor, textDecoration:'none', transition:'color .2s',
            }}
            onClick={e => { if (typeof onAnchor === 'function') { e.preventDefault(); onAnchor(s); } }}
            onMouseEnter={e => e.target.style.color = cfg.acc}
            onMouseLeave={e => e.target.style.color = baseColor}
            >{s}</a>
          );
        })}
      </div>
    </nav>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────────────────── */
function Hero({ name, mode, isDark }) {
  const cfg = MODES[mode];
  const [vis, setVis] = useState(false);
  const [discIdx, setDiscIdx] = useState(0);
  const discs = ['painted atmospheres', 'generative studies', 'animated fragments', 'original sound', 'playable sketches', 'web instruments'];
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

  const heroHeading = 'Worlds Painted in Light, Code, and Time';

  return (
    <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 32px 72px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:88, right:32, textAlign:'right', opacity:vis?1:0, transition:'opacity 1.4s ease 2s', pointerEvents:'none' }}>
        {cfg.jpWords.map((w,i) => (
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
          ✦ LIVING ARCHIVE · {new Date().getFullYear()} ✦
        </div>
        <h1 style={{
          ...tr(.1),
          fontFamily:'Bebas Neue',
          fontSize:'clamp(56px,9vw,140px)',
          lineHeight:.9,
          letterSpacing:'.02em',
          color: isDark ? '#f0ece4' : '#fff',
          maxWidth:1000,
        }}>
          {heroHeading}
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
              image ✦ code ✦ sound ✦ motion ✦ play ✦ atmosphere ✦ systems ✦
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section BG wrapper ────────────────────────────────────────────────────── */
function ContentBG({ children, mode, isDark, noRamp }) {
  const cfg = MODES[mode];
  const bg = isDark ? cfg.darkBg : cfg.lightBg;
  return (
    <div style={{ position:'relative', zIndex:7 }}>
      {!noRamp && (
        <div style={{ height:90, background:`linear-gradient(to bottom, transparent, ${bg})`, pointerEvents:'none' }} />
      )}
      <div style={{ background:bg, transition:'background 0.8s ease' }}>{children}</div>
    </div>
  );
}

/* ── Footer ────────────────────────────────────────────────────────────────────────── */
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
