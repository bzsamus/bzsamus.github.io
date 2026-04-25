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
              {name} is a creator of painterly worlds — generative art, anime films, music, games, and web systems that feel like places you've been in a dream.
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
