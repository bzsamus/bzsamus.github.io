/* ── App ─────────────────────────────────────────────────────────────────── */
function App() {
  const parseRouteFromPath = (pathname) => {
    const trimmed = (pathname || '/').replace(/\/+$/, '') || '/';
    if (trimmed === '/') return HOME_ROUTE;
    const key = trimmed.slice(1);
    return MODE_KEYS.includes(key) ? key : HOME_ROUTE;
  };
  const toPath = (routeKey) => routeKey === HOME_ROUTE ? '/' : `/${routeKey}`;

  const [loading, setLoading] = useState(true);
  const [tweaks, setTweaks] = useState(TWEAKS_DEFAULTS);
  const [currentRoute, setCurrentRoute] = useState(() => parseRouteFromPath(window.location.pathname));
  const [renderedRoute, setRenderedRoute] = useState(() => parseRouteFromPath(window.location.pathname));
  const [routeTransitionClass, setRouteTransitionClass] = useState('');
  const [mode, setMode] = useState(INITIAL_MODE);
  const [isDark, setIsDark] = useState(true);
  const [tweaksOn, setTweaksOn] = useState(false);
  const [portalTarget, setPortalTarget] = useState(null);

  const triggerPortal = (newMode) => {
    if (portalTarget || newMode === mode) return;
    setPortalTarget(newMode);
  };

  useEffect(() => {
    const derivedRoute = parseRouteFromPath(window.location.pathname);
    if (derivedRoute === HOME_ROUTE && window.location.pathname !== '/') {
      window.history.replaceState({ route: HOME_ROUTE }, '', '/');
    } else {
      window.history.replaceState({ route: derivedRoute }, '', toPath(derivedRoute));
    }
    if (derivedRoute !== HOME_ROUTE) {
      setMode(derivedRoute);
    }
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const routeFromPath = parseRouteFromPath(window.location.pathname);
      setCurrentRoute(routeFromPath);
      if (routeFromPath !== HOME_ROUTE && routeFromPath !== mode) {
        triggerPortal(routeFromPath);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [mode]);

  const navigateToRoute = (routeKey) => {
    if (!ROUTE_KEYS.includes(routeKey)) return;
    const nextPath = toPath(routeKey);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({ route: routeKey }, '', nextPath);
    }
    setCurrentRoute(routeKey);
    if (routeKey !== HOME_ROUTE) {
      triggerPortal(routeKey);
    }
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

  useEffect(() => {
    if (currentRoute === renderedRoute) return;

    const fromIsHome = renderedRoute === HOME_ROUTE;
    const fromIsWorld = MODE_KEYS.includes(renderedRoute);
    const toIsWorld = MODE_KEYS.includes(currentRoute);
    const shouldAnimateRoute = toIsWorld && (fromIsHome || fromIsWorld);

    if (!shouldAnimateRoute) {
      setRenderedRoute(currentRoute);
      setRouteTransitionClass('');
      return;
    }

    const transitionMs = 500;
    const halfMs = transitionMs / 2;
    setRouteTransitionClass('route-exit');

    const swapTimer = window.setTimeout(() => {
      setRenderedRoute(currentRoute);
      setRouteTransitionClass('route-enter');
    }, halfMs);

    const endTimer = window.setTimeout(() => {
      setRouteTransitionClass('');
    }, transitionMs);

    return () => {
      window.clearTimeout(swapTimer);
      window.clearTimeout(endTimer);
    };
  }, [currentRoute, renderedRoute]);

  const { name } = tweaks;
  const handleWorldSelect = (routeKey) => {
    if (!MODE_KEYS.includes(routeKey)) return;
    navigateToRoute(routeKey);
  };
  const handlePortalRoute = (routeKey) => {
    if (!MODE_KEYS.includes(routeKey)) return;
    navigateToRoute(routeKey);
  };

  return (
    <>
      {loading && <LoadingScreen mode={mode} isDark={isDark} onDone={() => setLoading(false)} />}

      <ArtworkSlideshowBG mode={mode} isDark={isDark} />
      <WeatherCanvas mode={mode} isDark={isDark} />
      <GrainOverlay isDark={isDark} />

      <PortalCanvas
        targetMode={portalTarget}
        onMidpoint={() => { if (portalTarget) setMode(portalTarget); }}
        onComplete={() => setPortalTarget(null)}
      />

      <div style={{ position:'relative', zIndex:7 }}>
        <Nav name={name} mode={mode} onPortal={handlePortalRoute} isDark={isDark} setIsDark={setIsDark} />
        <Hero name={name} mode={mode} isDark={isDark} />
      </div>

      <ContentBG mode={mode} isDark={isDark}>
        <div className={`route-transition-shell ${routeTransitionClass}`.trim()}>
          {renderedRoute === HOME_ROUTE ? (
            <>
              <WorldStateSelector isDark={isDark} onSelectRoute={handleWorldSelect} />
              <WorksSection mode={mode} isDark={isDark} />
              <AboutSection name={name} mode={mode} isDark={isDark} />
              <ContactSection name={name} mode={mode} isDark={isDark} />
            </>
          ) : (
            <WorldStatePage worldKey={renderedRoute} isDark={isDark} onNavigate={navigateToRoute} />
          )}
        </div>
      </ContentBG>

      <TweaksPanel visible={tweaksOn} tweaks={tweaks} setTweaks={setTweaks}
        mode={mode} setMode={setMode} isDark={isDark} setIsDark={setIsDark} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
