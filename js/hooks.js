/* ── useReveal ───────────────────────────────────────────────────────────── */
/* Adds .in class to element when it enters viewport (fires once). */
function useReveal(m = '-60px') {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('in'); obs.disconnect(); }
    }, { rootMargin: m });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
