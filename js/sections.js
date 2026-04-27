/* ── World State Selector ───────────────────────────────────────────────── */
function WorldStateSelector({ isDark, onSelectRoute }) {
  const [hoveredKey, setHoveredKey] = useState(null);
  const [focusedKey, setFocusedKey] = useState(null);
  const videoRefs = useRef({});
  const cards = Object.values(WORLD_ROUTE_META);

  const activate = (routeKey) => {
    if (typeof onSelectRoute === 'function') onSelectRoute(routeKey);
  };

  // Single video plays at a time — start hovered, pause/reset others.
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([k, vid]) => {
      if (!vid) return;
      if (k === hoveredKey || k === focusedKey) {
        vid.currentTime = 0;
        const p = vid.play();
        if (p && p.catch) p.catch(() => {});
      } else {
        vid.pause();
        try { vid.currentTime = 0; } catch (_) {}
      }
    });
  }, [hoveredKey, focusedKey]);

  return (
    <section style={{ padding:'92px 32px 84px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <h2 style={{ fontFamily:'Bebas Neue', fontSize:'clamp(52px,7vw,110px)', lineHeight:.9, letterSpacing:'.03em', textAlign:'center', color:isDark ? '#f0ece4' : '#1a1a1a' }}>
          Select a World State
        </h2>
        <p style={{ margin:'16px auto 38px', maxWidth:680, textAlign:'center', fontFamily:'Space Mono', fontSize:12, lineHeight:1.8, color:tx('rgba(255,255,255,0.48)','rgba(0,0,0,0.58)',isDark) }}>
          A collection of cinematic environments exploring the evolution of worlds.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16 }}>
          {cards.map((card) => {
            const active = hoveredKey === card.key || focusedKey === card.key;
            const hoverVideo = WORLD_HOVER_VIDEO[card.key] || null;
            return (
              <button
                key={card.key}
                type="button"
                className={`world-state-card zoom-surface${active ? ' is-hover' : ''}`}
                onClick={() => activate(card.key)}
                onMouseEnter={() => setHoveredKey(card.key)}
                onMouseLeave={() => setHoveredKey(null)}
                onFocus={() => setFocusedKey(card.key)}
                onBlur={() => setFocusedKey(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activate(card.key);
                  }
                }}
                aria-label={`Enter ${card.label} world state`}
                style={{
                  position:'relative',
                  minHeight:'clamp(200px,28vw,360px)',
                  border:`1px solid ${active ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.18)'}`,
                  borderRadius:6,
                  overflow:'hidden',
                  background:'#111',
                  textAlign:'left',
                  padding:0,
                  cursor:'pointer',
                  transform:active ? 'scale(1.02)' : 'scale(1)',
                  transition:'transform .24s ease, border-color .24s ease',
                }}
              >
                <img
                  src={card.heroImg}
                  alt=""
                  aria-hidden="true"
                  className="zoom-media"
                  style={{
                    position:'absolute',
                    inset:0,
                    ['--zoom-hover']:'1.06',
                    filter:active ? 'contrast(1.14) brightness(.9) saturate(1.05)' : 'contrast(1.03) brightness(.72) saturate(.8)',
                    transition:'filter .24s ease',
                  }}
                />
                {hoverVideo && (
                  <video
                    ref={(el) => { videoRefs.current[card.key] = el; }}
                    src={hoverVideo}
                    muted loop playsInline preload="metadata"
                    aria-hidden="true"
                  />
                )}
                <span style={{
                  position:'absolute', inset:0,
                  background:active ? 'linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.6))' : 'linear-gradient(180deg, rgba(0,0,0,0.22), rgba(0,0,0,0.72))',
                  transition:'background .24s ease',
                }} />
                <span style={{ position:'absolute', left:14, bottom:16, right:14 }}>
                  <span style={{ display:'block', fontFamily:'Bebas Neue', fontSize:34, letterSpacing:'.06em', color:'#fff' }}>{card.label}</span>
                  <span style={{ display:'block', marginTop:3, fontFamily:'Space Mono', fontSize:10, lineHeight:1.7, color:'rgba(255,255,255,0.75)' }}>
                    {card.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WorldGalleryCard({ src, idx, label }) {
  const cardRef = useReveal('-40px');

  return (
    <div
      ref={cardRef}
      className="rv zoom-surface"
      style={{
        position:'relative',
        borderRadius:6,
        overflow:'hidden',
        border:'1px solid rgba(255,255,255,0.12)',
        minHeight:180,
        transitionDelay:`${Math.min(idx * 70, 420)}ms`,
      }}
    >
      <img
        src={src}
        alt={`${label} gallery ${idx + 1}`}
        className="zoom-media"
        style={{ ['--zoom-hover']:'1.045' }}
      />
    </div>
  );
}

/* ── World State Page ───────────────────────────────────────────────────── */
function WorldStatePage({ worldKey, isDark, onNavigate }) {
  const safeWorldKey = MODE_KEYS.includes(worldKey) ? worldKey : 'bloom';
  const meta = WORLD_ROUTE_META[safeWorldKey] || WORLD_ROUTE_META.bloom;
  const cfg = MODES[safeWorldKey] || MODES.bloom;
  if (!meta || !cfg) return null;

  const worldOrder = WORLD_ORDER;
  const worldIdx = worldOrder.indexOf(safeWorldKey);
  const prevKey = worldOrder[(worldIdx - 1 + worldOrder.length) % worldOrder.length];
  const nextKey = worldOrder[(worldIdx + 1) % worldOrder.length];
  const heroVideo = WORLD_VIDEO[safeWorldKey] || null;
  const bodyCopy = WORLD_DESCRIPTIONS[safeWorldKey] ?? WORLD_DESCRIPTIONS.bloom ?? '';
  const worldWorks = WORKS_RAW.filter(w => w.worlds.includes(safeWorldKey));
  const heroRef = useRef();
  const [overlayWork, setOverlayWork] = useState(null);
  const [vis, setVis] = useState(false);

  const baseText = tx('rgba(255,255,255,0.78)', 'rgba(0,0,0,0.78)', isDark);
  const bodyText = tx('rgba(255,255,255,0.58)', 'rgba(0,0,0,0.58)', isDark);
  const subColor = 'rgba(255,255,255,0.55)';
  const mq = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.22)';
  const jpColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.18)';

  useEffect(() => {
    setVis(false);
    const t = setTimeout(() => setVis(true), 80);
    return () => clearTimeout(t);
  }, [safeWorldKey]);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    let rafId = null;
    const updateParallax = () => {
      rafId = null;
      const rect = heroEl.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      const progress = Math.max(0, Math.min(1, (viewH - rect.top) / (viewH + rect.height)));
      const offset = (progress - 0.5) * 48;
      heroEl.style.setProperty('--hero-parallax', `${offset.toFixed(2)}px`);
    };

    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', onScrollOrResize, { passive:true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [safeWorldKey]);

  const tr = d => ({
    opacity: vis ? 1 : 0,
    transform: vis ? 'none' : 'translateY(28px)',
    transition: `opacity .9s ease ${d}s, transform 1s cubic-bezier(.22,1,.36,1) ${d}s`,
  });

  return (
    <>
      {/* ─── Full-bleed hero ─── */}
      <section ref={heroRef} className="world-hero world-hero-full">
        {heroVideo ? (
          <video
            key={heroVideo}
            src={heroVideo}
            autoPlay muted loop playsInline
            className="world-hero-bg"
          />
        ) : (
          <img
            src={meta.heroImg}
            alt={`${meta.label} world`}
            className="world-hero-bg"
          />
        )}
        <div className="world-hero-vignette" />

        {/* Top-left day/night badge */}
        <div style={{ position:'absolute', top:90, left:32, zIndex:5, opacity:vis?.85:0, transition:'opacity 1s ease .8s' }}>
          <div style={{ fontFamily:'Space Mono', fontSize:8, color:cfg.acc, letterSpacing:'.18em', border:`1px solid ${cfg.acc}55`, padding:'4px 12px', display:'inline-flex', alignItems:'center', gap:8, backdropFilter:'blur(6px)', background:`${cfg.acc}10` }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:cfg.acc, display:'inline-block', boxShadow:`0 0 6px ${cfg.acc}` }} />
            {cfg.label} · {isDark ? 'NIGHT' : 'DAY'}
          </div>
        </div>

        {/* Top-right JP keywords */}
        <div style={{ position:'absolute', top:90, right:32, textAlign:'right', zIndex:5, opacity:vis?1:0, transition:'opacity 1.4s ease 1s', pointerEvents:'none' }}>
          {cfg.jpWords.map((w,i) => (
            <div key={i} style={{ fontFamily:'Noto Sans JP', fontWeight:900, fontSize:11, color:jpColor, letterSpacing:'.06em', lineHeight:2.1 }}>{w}</div>
          ))}
        </div>

        {/* Bottom-left main title */}
        <div style={{ position:'absolute', left:32, right:32, bottom:96, zIndex:5 }}>
          <div style={{ fontFamily:'Space Mono', fontSize:10, color:cfg.acc, letterSpacing:'.22em', textTransform:'uppercase', marginBottom:14, ...tr(.15) }}>
            ✦ World State · {String(worldIdx + 1).padStart(2,'0')} / {String(worldOrder.length).padStart(2,'0')} ✦
          </div>
          <h1 style={{
            ...tr(.05),
            fontFamily:'Bebas Neue',
            fontSize:'clamp(72px,14vw,180px)',
            lineHeight:.86,
            letterSpacing:'.05em',
            color:'#fff',
            margin:0,
          }}>
            {meta.label}
          </h1>
          <div style={{ marginTop:22, display:'flex', alignItems:'center', gap:16, ...tr(.4) }}>
            <div style={{ width:36, height:1, background:`linear-gradient(90deg,${cfg.acc},transparent)` }} />
            <span style={{ fontFamily:'Noto Sans JP', fontWeight:700, fontSize:14, color:cfg.acc, letterSpacing:'.1em' }}>{cfg.jp}</span>
          </div>
          <p style={{ marginTop:18, maxWidth:560, fontFamily:'Space Mono', fontSize:13, lineHeight:1.85, color:subColor, ...tr(.55) }}>
            {bodyCopy}
          </p>
        </div>

        {/* Scroll cue */}
        <div style={{ position:'absolute', left:32, bottom:42, display:'flex', alignItems:'center', gap:12, opacity:vis?.5:0, transition:'opacity 1.2s ease 1.6s', zIndex:5 }}>
          <div style={{ width:1, height:36, background:`linear-gradient(${cfg.acc},transparent)`, animation:'scrollPulse 2s ease infinite' }} />
          <span style={{ fontFamily:'Space Mono', fontSize:9, color:'rgba(255,255,255,0.4)', letterSpacing:'.2em', textTransform:'uppercase' }}>scroll</span>
        </div>

        {/* Bottom marquee */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, borderTop:'1px solid rgba(255,255,255,0.08)', overflow:'hidden', padding:'10px 0', opacity:vis?1:0, transition:'opacity 1.5s ease 1.8s', zIndex:5 }}>
          <div style={{ display:'flex', whiteSpace:'nowrap', animation:'mq 22s linear infinite', width:'max-content' }}>
            {[...Array(10)].map((_,i) => (
              <span key={i} style={{ fontFamily:'Space Mono', fontSize:10, color:mq, letterSpacing:'.2em', textTransform:'uppercase', padding:'0 28px' }}>
                {meta.label} ✦ {cfg.jpWords.join(' ✦ ')} ✦
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Below-fold content ─── */}
      <section style={{ borderTop:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'80px 32px 60px' }}>
          <div style={{ fontFamily:'Space Mono', fontSize:10, color:cfg.acc, letterSpacing:'.2em', textTransform:'uppercase', marginBottom:18 }}>
            About this world
          </div>
          <p style={{ margin:0, maxWidth:780, fontFamily:'Space Mono', fontSize:13, lineHeight:1.95, color:bodyText }}>
            {bodyCopy}
          </p>
        </div>
      </section>

      {/* Works for this world */}
      {worldWorks.length > 0 && (
        <section style={{ borderTop:`1px solid ${tx(cfg.acc+'18',cfg.acc+'28',isDark)}` }}>
          <div style={{ padding:'72px 32px 24px' }}>
            <div style={{ fontFamily:'Space Mono', fontSize:10, color:cfg.acc, letterSpacing:'.2em', textTransform:'uppercase', marginBottom:14 }}>
              Works · {String(worldWorks.length).padStart(2,'0')} pieces in {meta.label}
            </div>
            <h2 style={{ fontFamily:'Bebas Neue', fontSize:'clamp(48px,7vw,96px)', lineHeight:.9, letterSpacing:'.03em', margin:0, color:baseText }}>
              ART FROM THIS<br /><span style={{ color:cfg.acc }}>WORLD STATE.</span>
            </h2>
          </div>
          <div>
            {worldWorks.map((w, i) => (
              <WorkCardV key={w.id} work={w} cfg={cfg} index={i} isDark={isDark} onOpen={setOverlayWork} />
            ))}
          </div>
        </section>
      )}

      {/* Prev / Home / Next nav */}
      <section style={{ borderTop:`1px solid ${tx(cfg.acc+'18',cfg.acc+'28',isDark)}` }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'40px 32px 72px', display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:12, alignItems:'center' }}>
          <a
            href={`/${prevKey}`}
            aria-label={`Previous: ${WORLD_ROUTE_META[prevKey].label}`}
            onClick={(e) => { e.preventDefault(); onNavigate(prevKey); }}
            style={{ justifySelf:'start', border:`1px solid ${cfg.acc}55`, background:'transparent', color:baseText, fontFamily:'Space Mono', fontSize:11, letterSpacing:'.12em', textTransform:'uppercase', padding:'12px 16px', cursor:'pointer', textDecoration:'none' }}
          >
            ← Previous: {WORLD_ROUTE_META[prevKey].label}
          </a>
          <a
            href="/"
            aria-label="Back to Home"
            onClick={(e) => { e.preventDefault(); onNavigate(HOME_ROUTE); }}
            style={{ border:`1px solid ${cfg.acc}55`, background:`${cfg.acc}16`, color:baseText, fontFamily:'Space Mono', fontSize:11, letterSpacing:'.12em', textTransform:'uppercase', padding:'12px 16px', cursor:'pointer', textDecoration:'none' }}
          >
            Back to Home
          </a>
          <a
            href={`/${nextKey}`}
            aria-label={`Next: ${WORLD_ROUTE_META[nextKey].label}`}
            onClick={(e) => { e.preventDefault(); onNavigate(nextKey); }}
            style={{ justifySelf:'end', border:`1px solid ${cfg.acc}55`, background:'transparent', color:baseText, fontFamily:'Space Mono', fontSize:11, letterSpacing:'.12em', textTransform:'uppercase', padding:'12px 16px', cursor:'pointer', textDecoration:'none' }}
          >
            Next: {WORLD_ROUTE_META[nextKey].label} →
          </a>
        </div>
      </section>

      {overlayWork && (
        <ProjectOverlay work={overlayWork} cfg={cfg} isDark={isDark} onClose={() => setOverlayWork(null)} />
      )}
    </>
  );
}

/* ── Video Reel Section ──────────────────────────────────────────────────── */
function VideoReelSection({ mode, isDark }) {
  if (!REEL_VIDEO) return null;
  const cfg = MODES[mode];
  const sectionRef = useRef();
  const videoRef = useRef();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { videoRef.current?.play(); setPlaying(true); }
      else { videoRef.current?.pause(); setPlaying(false); }
    }, { threshold: 0.3 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  return (
    <section ref={sectionRef} style={{ position:'relative', width:'100%', height:'100vh', overflow:'hidden', borderTop:`1px solid ${tx(cfg.acc+'18',cfg.acc+'28',isDark)}` }}>
      <video
        ref={videoRef}
        src={REEL_VIDEO}
        muted loop playsInline
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
      />
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)' }} />
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
        <div style={{ fontFamily:'Bebas Neue', fontSize:'clamp(120px,20vw,280px)', lineHeight:1, color:'rgba(255,255,255,0.04)', letterSpacing:'.08em', userSelect:'none' }}>REEL</div>
      </div>
      <div style={{ position:'absolute', top:40, left:32, fontFamily:'Space Mono', fontSize:10, color:cfg.acc, letterSpacing:'.2em', textTransform:'uppercase' }}>
        007 / REEL_
      </div>
      <button onClick={toggle} style={{
        position:'absolute', bottom:48, left:32,
        width:52, height:52, borderRadius:'50%',
        border:`1px solid ${cfg.acc}88`, background:`${cfg.acc}20`,
        color:cfg.acc, fontSize:20, cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
        backdropFilter:'blur(8px)', transition:'all .2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = `${cfg.acc}40`; }}
        onMouseLeave={e => { e.currentTarget.style.background = `${cfg.acc}20`; }}
      >
        {playing ? '⏸' : '▶'}
      </button>
    </section>
  );
}

/* ── Stats Bar ───────────────────────────────────────────────────────────── */
function StatsBar({ mode, isDark }) {
  const cfg = MODES[mode];
  const ref = useRef();
  const [counts, setCounts] = useState([0,0,0,0]);
  const targets = [9, 5, 4, 6];
  const stats = [
    { label:'PROJECTS',    jp:'作品', suffix:'' },
    { label:'YEARS',       jp:'年間', suffix:'+' },
    { label:'MEDIUMS',     jp:'表現', suffix:'' },
    { label:'EXPERIMENTS', jp:'実験', suffix:'' },
  ];
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      targets.forEach((tgt, i) => {
        const dur = 1200, start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now()-start)/dur, 1);
          const eased = 1 - Math.pow(1-p, 3);
          setCounts(c => { const n=[...c]; n[i]=Math.round(eased*tgt); return n; });
          if (p < 1) requestAnimationFrame(tick);
        };
        setTimeout(() => requestAnimationFrame(tick), i * 130);
      });
    }, { rootMargin:'-40px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const border = `1px solid ${cfg.acc}20`;
  return (
    <div ref={ref} style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderTop:border, borderBottom:border, background:`rgba(${cfg.rgb.join(',')},0.04)` }}>
      {stats.map((s,i) => (
        <div key={i} style={{ padding:'28px 20px', textAlign:'center', borderRight:i<3?border:'none' }}>
          <div style={{ fontFamily:'Bebas Neue', fontSize:'clamp(44px,7vw,80px)', color:cfg.acc, lineHeight:1, letterSpacing:'.02em' }}>{counts[i]}{s.suffix}</div>
          <div style={{ fontFamily:'Space Mono', fontSize:8, color:tx('rgba(255,255,255,0.28)','rgba(0,0,0,0.38)',isDark), letterSpacing:'.18em', textTransform:'uppercase', marginTop:4 }}>{s.label}</div>
          <div style={{ fontFamily:'Noto Sans JP', fontWeight:700, fontSize:10, color:`${cfg.acc}44`, marginTop:3 }}>{s.jp}</div>
        </div>
      ))}
    </div>
  );
}

/* ── About ───────────────────────────────────────────────────────────────── */
function AboutSection({ name, mode, isDark }) {
  const cfg = MODES[mode];
  const ref = useReveal();
  const heading = isDark ? '#f0ece4' : '#111';
  const body = tx('rgba(255,255,255,0.38)','rgba(0,0,0,0.55)',isDark);
  const border = tx(`${cfg.acc}14`,`${cfg.acc}22`,isDark);
  const sub = tx('rgba(255,255,255,0.25)','rgba(0,0,0,0.4)',isDark);
  const skills = [
    { en:'GENERATIVE ART', jp:'生成芸術', sub:'Canvas · GLSL · Three.js · p5.js' },
    { en:'ANIME / VIDEO',  jp:'アニメ',   sub:'AE · Blender · AI animation' },
    { en:'MUSIC',          jp:'音楽',     sub:'Suno · Generative composition' },
    { en:'GAMES',          jp:'ゲーム',   sub:'Unity · Godot · Experimental' },
    { en:'WEB',            jp:'ウェブ',   sub:'React · Node · Full-stack' },
  ];
  return (
    <section id="about" style={{ padding:'80px 32px', borderTop:`1px solid ${tx(cfg.acc+'18',cfg.acc+'28',isDark)}` }}>
      <div ref={ref} className="rv">
        <div style={{ fontFamily:'Space Mono', fontSize:10, color:cfg.acc, letterSpacing:'.2em', textTransform:'uppercase', marginBottom:48 }}>003 / ABOUT_</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'60px 80px', alignItems:'start' }}>
          <div>
            <h2 style={{ fontFamily:'Bebas Neue', fontSize:'clamp(52px,6vw,96px)', lineHeight:.9, letterSpacing:'.02em', color:heading, marginBottom:20 }}>
              WORLDS<br />BUILT<br /><span style={{ color:cfg.acc }}>BY HAND.</span>
            </h2>
            <div style={{ fontFamily:'Noto Sans JP', fontWeight:900, fontSize:20, color:`${cfg.acc}44`, marginBottom:28 }}>手で作られた世界。</div>
            <p style={{ fontFamily:'Space Mono', fontSize:11, color:body, lineHeight:2, marginBottom:14 }}>
              I create cinematic environments that explore how worlds evolve over time...
            </p>
            <p style={{ fontFamily:'Space Mono', fontSize:11, color:body, lineHeight:2 }}>
              Inspired by light through leaves, water at dusk, and structures slowly swallowed by nature. Every pixel placed with intent.
            </p>
          </div>
          <div>
            {skills.map((s,i) => (
              <div key={i} style={{ padding:'17px 0', borderBottom:`1px solid ${border}`, display:'grid', gridTemplateColumns:'1fr auto', alignItems:'center', gap:16 }}>
                <div>
                  <div style={{ fontFamily:'Bebas Neue', fontSize:17, color:tx('rgba(255,255,255,0.7)','rgba(0,0,0,0.75)',isDark), letterSpacing:'.05em' }}>{s.en}</div>
                  <div style={{ fontFamily:'Space Mono', fontSize:10, color:sub, marginTop:2 }}>{s.sub}</div>
                </div>
                <div style={{ fontFamily:'Noto Sans JP', fontWeight:700, fontSize:11, color:`${cfg.acc}66`, textAlign:'right' }}>{s.jp}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Process ─────────────────────────────────────────────────────────────── */
function ProcessSection({ mode, isDark }) {
  const cfg = MODES[mode];
  const ref = useReveal();
  const steps = [
    { n:'01', jp:'観察', en:'OBSERVE',    desc:'Find the thing that shouldn\'t exist yet.' },
    { n:'02', jp:'実験', en:'EXPERIMENT', desc:'Break the tools. Use them wrong. Find the accident.' },
    { n:'03', jp:'構築', en:'BUILD',      desc:'Code it. Animate it. Make it breathe.' },
    { n:'04', jp:'解放', en:'RELEASE',    desc:'Ship it. Let it mutate in the wild.' },
  ];
  return (
    <section style={{ padding:'80px 32px', borderTop:`1px solid ${tx(cfg.acc+'18',cfg.acc+'28',isDark)}` }}>
      <div ref={ref} className="rv">
        <div style={{ fontFamily:'Space Mono', fontSize:10, color:cfg.acc, letterSpacing:'.2em', textTransform:'uppercase', marginBottom:48 }}>004 / PROCESS_</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }}>
          {steps.map((s,i) => (
            <div key={i} style={{ borderTop:`2px solid ${cfg.acc}44`, paddingTop:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10 }}>
                <span style={{ fontFamily:'Bebas Neue', fontSize:40, color:`${cfg.acc}44`, lineHeight:1 }}>{s.n}</span>
                <span style={{ fontFamily:'Noto Sans JP', fontWeight:900, fontSize:11, color:`${cfg.acc}66` }}>{s.jp}</span>
              </div>
              <div style={{ fontFamily:'Bebas Neue', fontSize:20, color:tx('rgba(255,255,255,0.7)','rgba(0,0,0,0.75)',isDark), letterSpacing:'.06em', marginBottom:10 }}>{s.en}</div>
              <div style={{ fontFamily:'Space Mono', fontSize:10, color:tx('rgba(255,255,255,0.3)','rgba(0,0,0,0.45)',isDark), lineHeight:1.75, fontStyle:'italic' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Experiments ─────────────────────────────────────────────────────────── */
function ExperimentsSection({ mode, isDark }) {
  const cfg = MODES[mode];
  const ref = useReveal();
  const bg = isDark ? cfg.darkBg : cfg.lightBg;
  const exps = [
    { title:'Shader Garden',  tag:'GLSL',  year:'ongoing', jp:'影の庭' },
    { title:'Type Machine',   tag:'JS',    year:'2025',    jp:'活字機' },
    { title:'Sound Grid',     tag:'AUDIO', year:'2025',    jp:'音格子' },
    { title:'Pixel Ritual',   tag:'ART',   year:'2024',    jp:'儀式' },
    { title:'Form Studies',   tag:'CSS',   year:'2024',    jp:'形状' },
    { title:'Data Portraits', tag:'GEN',   year:'2023',    jp:'肖像' },
  ];
  return (
    <section style={{ padding:'80px 32px', borderTop:`1px solid ${tx(cfg.acc+'18',cfg.acc+'28',isDark)}` }}>
      <div ref={ref} className="rv">
        <div style={{ fontFamily:'Space Mono', fontSize:10, color:cfg.acc, letterSpacing:'.2em', textTransform:'uppercase', marginBottom:48 }}>005 / EXPERIMENTS_</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:`${cfg.acc}20` }}>
          {exps.map((e,i) => (
            <div key={i} style={{ background:bg, padding:'22px 18px', cursor:'pointer', position:'relative', overflow:'hidden', transition:'background .25s' }}
              onMouseEnter={ev => ev.currentTarget.style.background = isDark ? `color-mix(in srgb,${bg} 80%,white 3%)` : `color-mix(in srgb,${bg} 80%,${cfg.acc} 6%)`}
              onMouseLeave={ev => ev.currentTarget.style.background = bg}
            >
              <div style={{ fontFamily:'Noto Sans JP', fontWeight:900, fontSize:30, color:`${cfg.acc}1a`, position:'absolute', bottom:-4, right:8, lineHeight:1 }}>{e.jp}</div>
              <div style={{ fontFamily:'Space Mono', fontSize:8, color:cfg.acc, letterSpacing:'.12em', marginBottom:10, border:`1px solid ${cfg.acc}33`, display:'inline-block', padding:'1px 6px' }}>{e.tag}</div>
              <div style={{ fontFamily:'Bebas Neue', fontSize:20, color:tx('rgba(255,255,255,0.65)','rgba(0,0,0,0.7)',isDark), letterSpacing:'.04em' }}>{e.title}</div>
              <div style={{ fontFamily:'Space Mono', fontSize:9, color:tx('rgba(255,255,255,0.2)','rgba(0,0,0,0.35)',isDark), marginTop:4 }}>{e.year}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Contact ─────────────────────────────────────────────────────────────── */
function ContactSection({ name, mode, isDark }) {
  const cfg = MODES[mode];
  const ref = useReveal();
  const [hov, setHov] = useState(null);
  const links = [
    { label:'EMAIL',   val:`hello@${name}.com`,  href:'#' },
    { label:'GITHUB',  val:`github.com/${name}`, href:'#' },
    { label:'TWITTER', val:`@${name}`,           href:'#' },
    { label:'READ.CV', val:`read.cv/${name}`,    href:'#' },
  ];
  const heading = isDark ? '#f0ece4' : '#111';
  return (
    <section id="contact" style={{ padding:'80px 32px', borderTop:`1px solid ${tx(cfg.acc+'18',cfg.acc+'28',isDark)}` }}>
      <div ref={ref} className="rv">
        <div style={{ fontFamily:'Space Mono', fontSize:10, color:cfg.acc, letterSpacing:'.2em', textTransform:'uppercase', marginBottom:24 }}>006 / CONTACT_</div>
        <h2 style={{ fontFamily:'Bebas Neue', fontSize:'clamp(72px,10vw,160px)', lineHeight:.88, letterSpacing:'.02em', marginBottom:56, color:heading }}>
          REACH<br /><span style={{ WebkitTextStroke:`1px ${cfg.acc}`, color:'transparent' }}>OUT_</span>
        </h2>
        <p style={{ margin:'-30px 0 30px', maxWidth:680, fontFamily:'Space Mono', fontSize:11, lineHeight:1.9, color:tx('rgba(255,255,255,0.42)','rgba(0,0,0,0.58)',isDark) }}>
          Open to collaborations involving visual storytelling and worldbuilding.
        </p>
        <div>
          {links.map((l,i) => (
            <a key={i} href={l.href}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
              style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'17px 0', borderBottom:`1px solid ${tx(cfg.acc+'18',cfg.acc+'28',isDark)}`, textDecoration:'none', transition:'transform .22s', transform:hov===i?'translateX(14px)':'none' }}
            >
              <span style={{ fontFamily:'Space Mono', fontSize:9, color:tx('rgba(255,255,255,0.25)','rgba(0,0,0,0.35)',isDark), letterSpacing:'.14em', width:72 }}>{l.label}</span>
              <span style={{ fontFamily:'Bebas Neue', fontSize:22, letterSpacing:'.05em', flex:1, paddingLeft:24, color:hov===i?cfg.acc:tx('rgba(255,255,255,0.65)','rgba(0,0,0,0.65)',isDark), transition:'color .2s' }}>{l.val}</span>
              <span style={{ color:hov===i?cfg.acc:tx('rgba(255,255,255,0.2)','rgba(0,0,0,0.25)',isDark), transition:'all .2s', transform:hov===i?'translate(4px,-4px)':'none', display:'inline-block', fontSize:18 }}>↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Tweaks Panel ────────────────────────────────────────────────────────── */
function TweaksPanel({ visible, tweaks, setTweaks, mode, setMode, isDark, setIsDark }) {
  if (!visible) return null;
  const cfg = MODES[mode];
  const panelBg = isDark ? '#0d150e' : '#faf7f2';
  const labelColor = isDark ? '#4a5a4d' : '#888';
  const inputBg = isDark ? '#111' : '#fff';
  const inputBorder = isDark ? '#1e2a20' : '#ddd';
  const inputColor = isDark ? '#f0ece4' : '#111';
  const chipBorder = isDark ? '#1e2a20' : '#ddd';
  const chipColor = isDark ? '#4a5a4d' : '#888';
  const upd = (k,v) => {
    setTweaks(t => ({...t,[k]:v}));
    window.parent.postMessage({type:'__edit_mode_set_keys',edits:{[k]:v}},'*');
  };
  return (
    <div className="tp" style={{ background:panelBg, border:`1px solid ${cfg.acc}33`, boxShadow:`0 20px 60px rgba(0,0,0,${isDark?.7:.15}), 0 0 0 1px ${cfg.acc}18` }}>
      <div style={{ fontFamily:'Bebas Neue', fontSize:14, color:cfg.acc, letterSpacing:'.1em' }}>TWEAKS</div>
      <label style={{ color:labelColor }}>Name / Handle</label>
      <input type="text" value={tweaks.name} onChange={e => upd('name',e.target.value)} style={{ background:inputBg, border:`1px solid ${inputBorder}`, color:inputColor }} />
      <label style={{ color:labelColor }}>Visual Mode</label>
      <div className="chips">
        {Object.entries(MODES).map(([k,m]) => (
          <button key={k} className={`chip${mode===k?' on':''}`}
            style={{ border:`1px solid ${mode===k?m.acc:chipBorder}`, background:mode===k?m.acc+'22':'transparent', color:mode===k?m.acc:chipColor }}
            onClick={() => { setMode(k); upd('mode',k); }}>{m.label}</button>
        ))}
      </div>
      <label style={{ color:labelColor }}>Appearance</label>
      <div className="chips">
        {[['dark','DARK',true],['light','LIGHT',false]].map(([k,lbl,val]) => (
          <button key={k} className={`chip${isDark===val?' on':''}`}
            style={{ border:`1px solid ${isDark===val?cfg.acc:chipBorder}`, background:isDark===val?cfg.acc+'22':'transparent', color:isDark===val?cfg.acc:chipColor }}
            onClick={() => setIsDark(val)}>{lbl}</button>
        ))}
      </div>
    </div>
  );
}
