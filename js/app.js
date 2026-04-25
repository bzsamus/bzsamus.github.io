/* ── App ─────────────────────────────────────────────────────────────────── */
function App() {
  const [loading, setLoading] = useState(true);
  const [tweaks, setTweaks] = useState(TWEAKS_DEFAULTS);
  const [mode, setMode] = useState(INITIAL_MODE);
  const [isDark, setIsDark] = useState(true);
  const [tweaksOn, setTweaksOn] = useState(false);
  const [portalTarget, setPortalTarget] = useState(null);

  const triggerPortal = (newMode) => {
    if (portalTarget || newMode === mode) return;
    setPortalTarget(newMode);
  };

  useEffect(() => {
    const handler = e => {
      if (e.data?.type === '__activate_edit_mode')   setTweaksOn(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOn(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({type:'__edit_mode_available'},'*');
    return () => window.removeEventListener('message', handler);
  }, []);

  useEffect(() => {
    const cfg = MODES[mode];
    const bg = isDark ? cfg.darkBg : cfg.lightBg;
    document.documentElement.style.setProperty('--acc', cfg.acc);
    document.documentElement.style.setProperty('--acc2', cfg.acc2);
    document.documentElement.style.setProperty('--bg', bg);
    document.body.style.background = bg;
    document.documentElement.style.background = bg;
    document.documentElement.style.color = isDark ? '#f0ece4' : '#1a1a1a';
  }, [mode, isDark]);

  const { name } = tweaks;

  return (
    <>
      {loading && <LoadingScreen mode={mode} isDark={isDark} onDone={() => setLoading(false)} />}

      <ArtworkSlideshowBG mode={mode} isDark={isDark} />
      <WeatherCanvas mode={mode} isDark={isDark} />
      <GrainOverlay isDark={isDark} />
      <CustomCursor mode={mode} />

      <PortalCanvas
        targetMode={portalTarget}
        onMidpoint={() => { if (portalTarget) setMode(portalTarget); }}
        onComplete={() => setPortalTarget(null)}
      />

      <div style={{ position:'relative', zIndex:7 }}>
        <Nav name={name} mode={mode} onPortal={triggerPortal} isDark={isDark} setIsDark={setIsDark} />
        <Hero name={name} mode={mode} isDark={isDark} />
      </div>

      <ContentBG mode={mode} isDark={isDark}>
        <StatsBar mode={mode} isDark={isDark} />
        <WorksSection mode={mode} isDark={isDark} />
        <VideoReelSection mode={mode} isDark={isDark} />
        <AboutSection name={name} mode={mode} isDark={isDark} />
        <ProcessSection mode={mode} isDark={isDark} />
        <ExperimentsSection mode={mode} isDark={isDark} />
        <ContactSection name={name} mode={mode} isDark={isDark} />
        <Footer name={name} mode={mode} isDark={isDark} />
      </ContentBG>

      <TweaksPanel visible={tweaksOn} tweaks={tweaks} setTweaks={setTweaks}
        mode={mode} setMode={setMode} isDark={isDark} setIsDark={setIsDark} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
