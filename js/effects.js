/* ── Artwork Slideshow BG ──────────────────────────────────────────────────────── */
function ArtworkSlideshowBG({ mode, isDark }) {
  const cfg = MODES[mode];
  const modeImgs = MODE_ART[mode];
  const startIdx = VISIT_SEED % modeImgs.length;
  const [active, setActive] = useState(0);
  const [slots, setSlots] = useState([
    { img: modeImgs[startIdx], animKey: 0 },
    { img: modeImgs[(startIdx + 1) % modeImgs.length], animKey: 1 },
  ]);
  const nextRef = useRef((startIdx + 1) % modeImgs.length);

  useEffect(() => {
    const imgs = MODE_ART[mode];
    const start = VISIT_SEED % imgs.length;
    setActive(0);
    setSlots([
      { img: imgs[start], animKey: Date.now() },
      { img: imgs[(start + 1) % imgs.length], animKey: Date.now() + 1 },
    ]);
    nextRef.current = (start + 1) % imgs.length;
  }, [mode]);

  useEffect(() => {
    const iv = setInterval(() => {
      const imgs = MODE_ART[mode];
      setActive(a => {
        const incoming = (a + 1) % 2;
        const newImgIdx = nextRef.current;
        nextRef.current = (newImgIdx + 1) % imgs.length;
        setSlots(s => s.map((sl, i) => i === incoming ? { img: imgs[newImgIdx], animKey: sl.animKey + 2 } : sl));
        return incoming;
      });
    }, 9000);
    return () => clearInterval(iv);
  }, [mode]);

  const overlayAlpha = isDark ? 0.32 : 0.18;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:0, overflow:'hidden', background:'#000' }}>
      {slots.map((sl, i) => (
        <div key={sl.animKey} style={{
          position:'absolute', inset:0,
          opacity: i === active ? 1 : 0,
          transition:'opacity 2.4s ease',
          zIndex: i === active ? 2 : 1,
        }}>
          <img src={ART_IMGS[sl.img]} alt="" style={{
            width:'100%', height:'100%', objectFit:'cover', display:'block',
            animation:`kb${sl.img % 6} 18s ease-in-out both`,
            filter: isDark ? 'brightness(0.92)' : 'brightness(1.05) saturate(0.95)',
          }} />
        </div>
      ))}
      <div style={{ position:'absolute', inset:0, zIndex:3, background:`rgba(0,0,0,${overlayAlpha})`, transition:'background 1s ease' }} />
      <div style={{ position:'absolute', inset:0, zIndex:4, background:'linear-gradient(180deg,rgba(0,0,0,0.18) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0.4) 75%,rgba(0,0,0,0.75) 100%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, zIndex:5, background:`radial-gradient(ellipse 80% 60% at 70% 40%, ${cfg.acc}15, transparent 65%)`, transition:'background 1.5s ease', pointerEvents:'none' }} />
    </div>
  );
}

/* ── Weather Canvas (8 world atmospheres) ──────────────────────────────────── */
function WeatherCanvas({ mode, isDark }) {
  const canvasRef = useRef();
  const rafRef = useRef();
  const stRef = useRef({ mode, isDark, particles: [], t: 0 });
  const isMobile = navigator.maxTouchPoints > 0;

  useEffect(() => {
    stRef.current.mode = mode;
    stRef.current.isDark = isDark;
    stRef.current.particles = [];
  }, [mode, isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W, H;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const MAX = isMobile ? 28 : 55;

    const mkParticle = (ox, oy) => {
      const { mode: m, isDark: dk } = stRef.current;
      const t = `${m}_${dk ? 'n' : 'd'}`;
      const rx = ox !== undefined ? ox : Math.random() * W;
      const ry = oy !== undefined ? oy : Math.random() * H;

      if (t === 'bloom_d') return { t, x:rx, y:ry<0?-20:ry, vx:(Math.random()-.5)*.8, vy:Math.random()*.6+.3, sz:Math.random()*4+2, rot:Math.random()*Math.PI*2, rv:(Math.random()-.5)*.06, ph:Math.random()*Math.PI*2 };
      if (t === 'bloom_n') return { t, x:rx, y:ry, vx:(Math.random()-.5)*.22, vy:-(Math.random()*.18+.04), r:Math.random()*2.2+.8, ph:Math.random()*Math.PI*2, fr:Math.random()*.4+.2, sz:Math.random()*14+6 };
      if (t === 'core_d')  return { t, x:rx, y:ry, vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.28, sz:Math.random()*1.8+.4, isSpark:Math.random()<.1, ph:Math.random()*Math.PI*2, fr:Math.random()*.5+.2, al:Math.random()*.38+.1 };
      if (t === 'core_n')  return { t, x:rx<0?Math.random()*W*1.2:rx, y:ry<0?-10:ry, vx:-2.5, vy:10+Math.random()*6, len:Math.random()*14+8, al:Math.random()*.32+.1 };
      if (t === 'reclaim_d') return { t, x:rx, y:ry>H?H+20:ry, vx:(Math.random()-.5)*.5+.1, vy:-(Math.random()*.4+.15), sz:Math.random()*4+2, rot:Math.random()*Math.PI*2, rv:(Math.random()-.5)*.03, ph:Math.random()*Math.PI*2, al:Math.random()*.5+.25 };
      if (t === 'reclaim_n') return { t, x:rx, y:ry>H?H+20:ry, vx:(Math.random()-.5)*.4, vy:-(Math.random()*.8+.4), sz:Math.random()*6+4, ph:Math.random()*Math.PI*2, fr:Math.random()*.2+.1, al:Math.random()*.55+.3 };
      if (t === 'beyond_d') return { t, x:rx, y:ry, vx:(Math.random()-.5)*.18, vy:(Math.random()-.5)*.14, sz:Math.random()*1.1+.2, ph:Math.random()*Math.PI*2, fr:Math.random()*.6+.2, al:Math.random()*.45+.15 };
      if (t === 'beyond_n') return Math.random()<.88
        ? { t, isStar:true,  x:rx, y:ry, sz:Math.random()*1.4+.3, ph:Math.random()*Math.PI*2, fr:Math.random()*.5+.1 }
        : { t, isStar:false, x:rx, y:ry<0?Math.random()*H*.4:ry, vx:-2-Math.random()*3, vy:.5+Math.random(), len:Math.random()*60+30, al:Math.random()*.6+.3 };
      return null;
    };

    const spawnBurst = (bx, by, n = 10) => {
      for (let i = 0; i < n; i++) {
        const p = mkParticle(bx, by);
        if (!p) continue;
        const ang = (i / n) * Math.PI * 2;
        const spd = 1.5 + Math.random() * 3;
        p.vx = Math.cos(ang) * spd; p.vy = Math.sin(ang) * spd;
        p.burst = true;
        stRef.current.particles.push(p);
      }
    };

    const onInteract = e => {
      const el = e.target;
      if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'INPUT') return;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      spawnBurst(cx, cy);
    };
    document.addEventListener('click', onInteract);
    document.addEventListener('touchstart', onInteract, { passive: true });

    const fill = (n = MAX) => {
      const ps = stRef.current.particles;
      while (ps.length < n) { const p = mkParticle(); if (p) ps.push(p); }
    };
    fill();

    let ti = 0;
    const loop = () => {
      ti += 0.012;
      ctx.clearRect(0, 0, W, H);
      const { mode: m, isDark: dk, particles: ps } = stRef.current;
      const cfg = MODES[m];
      const [pr, pg, pb] = cfg.rgb;
      const wt = `${m}_${dk ? 'n' : 'd'}`;

      if (ps.length < MAX) { const p = mkParticle(); if (p) ps.push(p); }

      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        if (p.t !== wt) { ps.splice(i, 1); continue; }

        if (wt === 'bloom_d') {
          p.x += p.vx + Math.sin(ti + p.ph) * .3; p.y += p.vy; p.rot += p.rv;
          if (p.burst) { p.vx *= .94; p.vy *= .94; }
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.globalAlpha = p.al || .55;
          ctx.fillStyle = 'rgba(249,213,229,1)';
          ctx.beginPath(); ctx.ellipse(0, 0, p.sz, p.sz * .6, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          if (p.y > H + 30) ps.splice(i, 1);

        } else if (wt === 'bloom_n') {
          p.x += p.vx + Math.sin(ti*.3+p.ph)*.08; p.y += p.vy + Math.cos(ti*.25+p.ph*1.3)*.06;
          p.vx += (Math.random()-.5)*.008; p.vy += (Math.random()-.5)*.006;
          p.vx *= .996; p.vy *= .996;
          if (p.x<-40)p.x=W+40; if(p.x>W+40)p.x=-40;
          if (p.y<-80)p.y=H+40; if(p.y>H+40)p.y=-20;
          const al = (Math.sin(ti*p.fr+p.ph)*.5+.5)*.55+.08;
          const g1 = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.sz*2);
          g1.addColorStop(0,`rgba(${pr},${pg},${pb},${al*.55})`);
          g1.addColorStop(.4,`rgba(${pr},${pg},${pb},${al*.18})`);
          g1.addColorStop(1,`rgba(${pr},${pg},${pb},0)`);
          ctx.beginPath(); ctx.fillStyle=g1; ctx.arc(p.x,p.y,p.sz*2,0,Math.PI*2); ctx.fill();
          const g2 = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*1.8);
          g2.addColorStop(0,`rgba(255,248,220,${al*.9})`);
          g2.addColorStop(1,`rgba(${pr},${pg},${pb},0)`);
          ctx.beginPath(); ctx.fillStyle=g2; ctx.arc(p.x,p.y,p.r*1.8,0,Math.PI*2); ctx.fill();

        } else if (wt === 'core_d') {
          p.vx += (Math.random()-.5)*.015; p.vy += (Math.random()-.5)*.015;
          p.vx *= .99; p.vy *= .99;
          p.x += p.vx; p.y += p.vy;
          if (p.x<-20)p.x=W+20; if(p.x>W+20)p.x=-20;
          if (p.y<-20)p.y=H+20; if(p.y>H+20)p.y=-20;
          if (p.isSpark) {
            const sa = (Math.sin(ti*p.fr*4+p.ph)*.5+.5)*p.al*1.4;
            ctx.beginPath(); ctx.fillStyle=`rgba(0,220,255,${sa})`; ctx.arc(p.x,p.y,p.sz*1.2,0,Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.fillStyle=`rgba(180,240,255,${sa*.7})`; ctx.arc(p.x,p.y,p.sz*.4,0,Math.PI*2); ctx.fill();
          } else {
            const da = (Math.sin(ti*p.fr+p.ph)*.3+.7)*p.al;
            ctx.beginPath(); ctx.fillStyle=`rgba(180,200,220,${da})`; ctx.arc(p.x,p.y,p.sz,0,Math.PI*2); ctx.fill();
          }

        } else if (wt === 'core_n') {
          p.x += p.vx; p.y += p.vy;
          ctx.save(); ctx.globalAlpha = p.al;
          ctx.strokeStyle = 'rgba(0,220,255,1)'; ctx.lineWidth = .8;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * (p.len / p.vy), p.y - p.len); ctx.stroke();
          ctx.restore();
          if (p.y > H + 30) ps.splice(i, 1);

        } else if (wt === 'reclaim_d') {
          p.x += p.vx + Math.sin(ti+p.ph)*.3; p.y += p.vy; p.rot += p.rv;
          if (p.burst) { p.vx *= .94; p.vy *= .94; }
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.globalAlpha = p.al;
          ctx.fillStyle = 'rgba(200,240,210,1)';
          ctx.beginPath(); ctx.ellipse(0, 0, p.sz, p.sz * .65, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          if (p.y < -30) ps.splice(i, 1);

        } else if (wt === 'reclaim_n') {
          p.x += p.vx + Math.sin(ti*.4+p.ph)*.2; p.y += p.vy;
          const la = (Math.sin(ti*p.fr+p.ph)*.3+.7)*p.al;
          const lg = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.sz*3);
          lg.addColorStop(0,`rgba(${pr},${pg},${pb},${la})`); lg.addColorStop(.4,`rgba(${pr},${pg},${pb},${la*.4})`); lg.addColorStop(1,`rgba(${pr},${pg},${pb},0)`);
          ctx.beginPath(); ctx.fillStyle=lg; ctx.arc(p.x,p.y,p.sz*3,0,Math.PI*2); ctx.fill();
          ctx.save(); ctx.globalAlpha=la*.8; ctx.fillStyle=`rgb(${pr},${pg},${pb})`;
          ctx.beginPath(); ctx.arc(p.x,p.y,p.sz*.5,0,Math.PI*2); ctx.fill(); ctx.restore();
          if (p.y < -40) ps.splice(i, 1);

        } else if (wt === 'beyond_d') {
          p.vx += (Math.random()-.5)*.008; p.vy += (Math.random()-.5)*.008;
          p.vx *= .995; p.vy *= .995;
          p.x += p.vx; p.y += p.vy;
          if (p.x<-10)p.x=W+10; if(p.x>W+10)p.x=-10;
          if (p.y<-10)p.y=H+10; if(p.y>H+10)p.y=-10;
          const ba = (Math.sin(ti*p.fr+p.ph)*.5+.5)*p.al;
          ctx.beginPath(); ctx.fillStyle=`rgba(220,210,255,${ba})`; ctx.arc(p.x,p.y,p.sz,0,Math.PI*2); ctx.fill();

        } else if (wt === 'beyond_n') {
          if (p.isStar) {
            const sa = (Math.sin(ti*p.fr+p.ph)*.4+.6)*.7;
            ctx.beginPath(); ctx.fillStyle=`rgba(255,255,255,${sa})`; ctx.arc(p.x,p.y,p.sz,0,Math.PI*2); ctx.fill();
          } else {
            p.x += p.vx; p.y += p.vy;
            const sg = ctx.createLinearGradient(p.x,p.y,p.x-p.len,p.y-p.vy*(p.len/Math.abs(p.vx)));
            sg.addColorStop(0,`rgba(180,130,255,${p.al})`); sg.addColorStop(1,'rgba(180,130,255,0)');
            ctx.strokeStyle=sg; ctx.lineWidth=1.5;
            ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x-p.len,p.y-p.vy*(p.len/Math.abs(p.vx))); ctx.stroke();
            if (p.x < -60) ps.splice(i, 1);
          }
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('click', onInteract);
      document.removeEventListener('touchstart', onInteract);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, zIndex:6, pointerEvents:'none' }} />;
}

/* ── Curtain Transition ─────────────────────────────────────────────────────
   Replaces the canvas portal with a GPU-only letterbox sweep — performant,
   art-house feel. Phases: entering (300ms) → holding (100ms) → exiting (300ms). */
function CurtainTransition({ targetMode, onMidpoint, onComplete }) {
  const [phase, setPhase] = useState('idle'); // idle | entering | holding | exiting
  const onMidRef = useRef(onMidpoint);
  const onDoneRef = useRef(onComplete);
  onMidRef.current = onMidpoint;
  onDoneRef.current = onComplete;

  useEffect(() => {
    if (!targetMode) { setPhase('idle'); return; }
    setPhase('entering');
    const t1 = setTimeout(() => {
      onMidRef.current && onMidRef.current();
      setPhase('holding');
    }, 300);
    const t2 = setTimeout(() => setPhase('exiting'), 400);
    const t3 = setTimeout(() => {
      setPhase('idle');
      onDoneRef.current && onDoneRef.current();
    }, 720);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [targetMode]);

  if (!targetMode) return null;
  const cfg = MODES[targetMode];
  const [pr, pg, pb] = cfg.rgb;
  const tint = `rgba(${pr},${pg},${pb},0.18)`;

  let topY, botY;
  if (phase === 'entering' || phase === 'holding') { topY = '0%'; botY = '0%'; }
  else if (phase === 'exiting') { topY = '100%'; botY = '-100%'; }
  else { topY = '-100%'; botY = '100%'; }

  const seamVisible = phase === 'holding';
  const barBase = {
    position:'absolute', left:0, right:0, height:'50vh',
    transition:'transform .3s cubic-bezier(.77,0,.18,1)',
    willChange:'transform',
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9000, pointerEvents:'all', overflow:'hidden' }}>
      <div style={{ ...barBase, top:0, transform:`translateY(${topY})`,
        background:`linear-gradient(180deg, #000 0%, #000 70%, ${tint} 100%)` }} />
      <div style={{ ...barBase, bottom:0, transform:`translateY(${botY})`,
        background:`linear-gradient(0deg, #000 0%, #000 70%, ${tint} 100%)` }} />
      <div style={{
        position:'absolute', left:0, right:0, top:'50%', height:1,
        background:cfg.acc, boxShadow:`0 0 14px ${cfg.acc}, 0 0 4px ${cfg.acc}`,
        opacity: seamVisible ? 1 : 0,
        transform: seamVisible ? 'scaleX(1)' : 'scaleX(0.2)',
        transformOrigin:'center',
        transition:'opacity .12s ease, transform .18s cubic-bezier(.22,1,.36,1)',
      }} />
    </div>
  );
}

/* ── Grain Overlay ──────────────────────────────────────────────────────────────────── */
function GrainOverlay({ isDark }) {
  return (
    <div className="grain-ov" style={{ opacity: isDark ? 0.045 : 0.028 }}>
      <svg><filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#gr)"/></svg>
    </div>
  );
}

/* ── Custom Cursor ───────────────────────────────────────────────────────────────────── */
function CustomCursor({ mode }) {
  const ringRef = useRef();
  const dotRef = useRef();
  const pos = useRef({ x:-200, y:-200, tx:-200, ty:-200, link:false });
  const modeRef = useRef(mode);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    if (navigator.maxTouchPoints > 0) return;
    document.documentElement.classList.add('has-cursor');
    const onMove = e => { pos.current.tx = e.clientX; pos.current.ty = e.clientY; };
    const onOver = e => {
      const tag = e.target.tagName;
      pos.current.link = tag === 'A' || tag === 'BUTTON' || !!e.target.closest('a,button,[data-cursor]');
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    let raf;
    const tick = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * .12;
      p.y += (p.ty - p.y) * .12;
      const cfg = MODES[modeRef.current];
      const ring = ringRef.current, dot = dotRef.current;
      if (ring && dot) {
        ring.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,-50%)`;
        dot.style.transform  = `translate(${p.tx}px,${p.ty}px) translate(-50%,-50%)`;
        ring.style.width  = p.link ? '44px' : '22px';
        ring.style.height = p.link ? '44px' : '22px';
        ring.style.borderColor = p.link ? cfg.acc : `${cfg.acc}55`;
        ring.style.background  = p.link ? `${cfg.acc}20` : 'transparent';
        dot.style.background = cfg.acc;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      document.documentElement.classList.remove('has-cursor');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (navigator.maxTouchPoints > 0) return null;
  return (
    <>
      <div ref={ringRef} className="cur-ring" style={{ width:22, height:22, border:'1.5px solid rgba(255,255,255,.4)' }} />
      <div ref={dotRef}  className="cur-dot"  style={{ width:4, height:4, background:'#fff' }} />
    </>
  );
}
