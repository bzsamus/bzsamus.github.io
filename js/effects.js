/* ── Artwork Slideshow BG ────────────────────────────────────────────────── */
function ArtworkSlideshowBG({ mode, isDark }) {
  const cfg = MODES[mode];
  const modeImgs = MODE_ART[mode];
  const startIdx = VISIT_SEED % modeImgs.length;
  const [active, setActive] = useState(0);
  const [slots, setSlots] = useState([
    { img: modeImgs[startIdx], animKey: 0 },
    { img: modeImgs[(startIdx + 1) % modeImgs.length], animKey: 1 },
  ]);
  const nextRef = useRef((startIdx + 2) % modeImgs.length);

  useEffect(() => {
    const imgs = MODE_ART[mode];
    const start = VISIT_SEED % imgs.length;
    setActive(0);
    setSlots([
      { img: imgs[start], animKey: Date.now() },
      { img: imgs[(start + 1) % imgs.length], animKey: Date.now() + 1 },
    ]);
    nextRef.current = (start + 2) % imgs.length;
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

/* ── Weather Canvas (8 world atmospheres) ────────────────────────────────── */
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
      if (t === 'forest_d') return { t, x:rx, y:ry<0?-20:ry, vx:(Math.random()-.5)*.8, vy:Math.random()*.6+.3, sz:Math.random()*4+2, rot:Math.random()*Math.PI*2, rv:(Math.random()-.5)*.06, ph:Math.random()*Math.PI*2 };
      if (t === 'forest_n') return { t, x:rx, y:ry, vx:(Math.random()-.5)*.22, vy:-(Math.random()*.18+.04), r:Math.random()*2.2+.8, ph:Math.random()*Math.PI*2, fr:Math.random()*.4+.2, sz:Math.random()*14+6 };
      if (t === 'azure_d')  return { t, x:rx<0?Math.random()*W*1.5:rx, y:ry<0?-10:ry, vx:-1.2, vy:8+Math.random()*4, len:Math.random()*12+8, al:Math.random()*.25+.08 };
      if (t === 'azure_n')  return { t, x:rx, y:ry<0?-10:ry, vx:(Math.random()-.5)*.3, vy:.5+Math.random()*.5, sz:Math.random()*3+1.5, ph:Math.random()*Math.PI*2, fr:Math.random()*.3+.1, al:Math.random()*.5+.2 };
      if (t === 'lotus_d')  return { t, x:rx, y:ry>H?H+20:ry, vx:(Math.random()-.5)*.6+.2, vy:-(Math.random()*.5+.2), sz:Math.random()*5+3, rot:Math.random()*Math.PI*2, rv:(Math.random()-.5)*.04, ph:Math.random()*Math.PI*2, al:Math.random()*.6+.3 };
      if (t === 'lotus_n')  return { t, x:rx, y:ry>H?H+20:ry, vx:(Math.random()-.5)*.4, vy:-(Math.random()*.8+.4), sz:Math.random()*6+4, ph:Math.random()*Math.PI*2, fr:Math.random()*.2+.1, al:Math.random()*.55+.3 };
      if (t === 'orbit_d')  return { t, x:rx, y:ry, vx:3+Math.random()*4, vy:-.5+Math.random(), len:Math.random()*40+20, al:Math.random()*.55+.2 };
      if (t === 'orbit_n')  return Math.random()<.88
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

        if (wt === 'forest_d') {
          p.x += p.vx + Math.sin(ti + p.ph) * .3; p.y += p.vy; p.rot += p.rv;
          if (p.burst) { p.vx *= .94; p.vy *= .94; }
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.globalAlpha = p.al || .55;
          ctx.fillStyle = 'rgba(249,213,229,1)';
          ctx.beginPath(); ctx.ellipse(0, 0, p.sz, p.sz * .6, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          if (p.y > H + 30) ps.splice(i, 1);

        } else if (wt === 'forest_n') {
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
          g2.addColorStop(0,`rgba(255,255,240,${al*.9})`);
          g2.addColorStop(1,`rgba(${pr},${pg},${pb},0)`);
          ctx.beginPath(); ctx.fillStyle=g2; ctx.arc(p.x,p.y,p.r*1.8,0,Math.PI*2); ctx.fill();

        } else if (wt === 'azure_d') {
          p.x += p.vx; p.y += p.vy;
          ctx.save(); ctx.globalAlpha = p.al;
          ctx.strokeStyle = 'rgba(168,216,234,1)'; ctx.lineWidth = .7;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * (p.len / p.vy), p.y - p.len); ctx.stroke();
          ctx.restore();
          if (p.y > H + 30) ps.splice(i, 1);

        } else if (wt === 'azure_n') {
          p.x += p.vx + Math.sin(ti+p.ph)*.15; p.y += p.vy;
          const aa = (Math.sin(ti*p.fr+p.ph)*.4+.6)*p.al;
          const ag = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.sz*4);
          ag.addColorStop(0,`rgba(61,159,192,${aa*.8})`); ag.addColorStop(1,`rgba(61,159,192,0)`);
          ctx.beginPath(); ctx.fillStyle=ag; ctx.arc(p.x,p.y,p.sz*4,0,Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.fillStyle=`rgba(140,230,255,${aa})`; ctx.arc(p.x,p.y,p.sz*.5,0,Math.PI*2); ctx.fill();
          if (p.y > H + 30) ps.splice(i, 1);

        } else if (wt === 'lotus_d') {
          p.x += p.vx + Math.sin(ti+p.ph)*.3; p.y += p.vy; p.rot += p.rv;
          if (p.burst) { p.vx *= .94; p.vy *= .94; }
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.globalAlpha = p.al;
          ctx.fillStyle = 'rgba(208,128,154,1)';
          ctx.beginPath(); ctx.ellipse(0, 0, p.sz, p.sz * .6, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          if (p.y < -30) ps.splice(i, 1);

        } else if (wt === 'lotus_n') {
          p.x += p.vx + Math.sin(ti*.4+p.ph)*.2; p.y += p.vy;
          const la = (Math.sin(ti*p.fr+p.ph)*.3+.7)*p.al;
          const lg = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.sz*3);
          lg.addColorStop(0,`rgba(232,168,74,${la})`); lg.addColorStop(.4,`rgba(232,168,74,${la*.4})`); lg.addColorStop(1,`rgba(232,168,74,0)`);
          ctx.beginPath(); ctx.fillStyle=lg; ctx.arc(p.x,p.y,p.sz*3,0,Math.PI*2); ctx.fill();
          ctx.save(); ctx.globalAlpha=la*.8; ctx.fillStyle='rgb(232,168,74)';
          ctx.beginPath(); ctx.ellipse(p.x,p.y,p.sz*.6,p.sz,0,0,Math.PI*2); ctx.fill(); ctx.restore();
          if (p.y < -40) ps.splice(i, 1);

        } else if (wt === 'orbit_d') {
          p.x += p.vx; p.y += p.vy;
          const og = ctx.createLinearGradient(p.x,p.y,p.x-p.len,p.y-(p.vy/Math.max(p.vx,.1))*p.len);
          og.addColorStop(0,'rgba(255,220,100,.8)'); og.addColorStop(1,'rgba(255,220,100,0)');
          ctx.save(); ctx.globalAlpha=p.al*(1-p.x/W*.5);
          ctx.strokeStyle=og; ctx.lineWidth=1.5;
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x-p.len,p.y-(p.vy/Math.max(p.vx,.1))*p.len); ctx.stroke();
          ctx.restore();
          if (p.x > W + 60) ps.splice(i, 1);

        } else if (wt === 'orbit_n') {
          if (p.isStar) {
            const sa = (Math.sin(ti*p.fr+p.ph)*.4+.6)*.7;
            ctx.beginPath(); ctx.fillStyle=`rgba(255,255,255,${sa})`; ctx.arc(p.x,p.y,p.sz,0,Math.PI*2); ctx.fill();
          } else {
            p.x += p.vx; p.y += p.vy;
            const sg = ctx.createLinearGradient(p.x,p.y,p.x-p.len,p.y-p.vy*(p.len/Math.abs(p.vx)));
            sg.addColorStop(0,`rgba(200,150,255,${p.al})`); sg.addColorStop(1,'rgba(200,150,255,0)');
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

/* ── Portal Canvas ───────────────────────────────────────────────────────── */
function PortalCanvas({ targetMode, onMidpoint, onComplete }) {
  const ref = useRef();
  useEffect(() => {
    if (!targetMode) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const cx = W / 2, cy = H / 2;
    const cfg = MODES[targetMode];
    const [pr, pg, pb] = cfg.rgb;
    const TOTAL = 80, MID = 38;
    let frame = 0, raf;
    const pts = Array.from({ length: 90 }, (_, i) => ({
      ang: (i / 90) * Math.PI * 2 + Math.random() * .2,
      rad: 60 + Math.random() * 220,
      spd: .04 + Math.random() * .06,
      sz: Math.random() * 3 + 1,
    }));
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      const prog = frame / TOTAL;
      const bgA = Math.min(prog * 4, 1) * .92;
      ctx.fillStyle = `rgba(0,0,0,${bgA})`;
      ctx.fillRect(0, 0, W, H);
      const pull = frame < MID ? frame / MID : 1;
      pts.forEach(p => {
        p.ang += p.spd * (1 + prog);
        const r = p.rad * (1 - pull * .75) + 5;
        const x = cx + Math.cos(p.ang) * r;
        const y = cy + Math.sin(p.ang) * r;
        const a = (.5 + .5 * Math.sin(p.ang)) * bgA;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${pr},${pg},${pb},${a})`;
        ctx.arc(x, y, p.sz, 0, Math.PI * 2);
        ctx.fill();
      });
      const glowR = (frame < MID ? (frame / MID) : (1 + (frame - MID) / (TOTAL - MID) * 3)) * Math.min(W, H) * .35;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      g.addColorStop(0, `rgba(${pr},${pg},${pb},${.7 * bgA})`);
      g.addColorStop(.35, `rgba(${pr},${pg},${pb},${.25 * bgA})`);
      g.addColorStop(1, `rgba(${pr},${pg},${pb},0)`);
      ctx.beginPath(); ctx.fillStyle = g; ctx.arc(cx, cy, glowR, 0, Math.PI * 2); ctx.fill();
      if (frame === MID) onMidpoint();
      frame++;
      if (frame < TOTAL) { raf = requestAnimationFrame(animate); } else { onComplete(); }
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, [targetMode]);

  if (!targetMode) return null;
  return <canvas ref={ref} style={{ position:'fixed', inset:0, zIndex:9000, pointerEvents:'all' }} />;
}

/* ── Grain Overlay ───────────────────────────────────────────────────────── */
function GrainOverlay({ isDark }) {
  return (
    <div className="grain-ov" style={{ opacity: isDark ? 0.045 : 0.028 }}>
      <svg><filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#gr)"/></svg>
    </div>
  );
}

/* ── Custom Cursor ───────────────────────────────────────────────────────── */
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
