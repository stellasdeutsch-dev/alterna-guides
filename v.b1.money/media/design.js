/* Banknot: розетка доворачивается за прокруткой, банкноты пачкой разлетаются при появлении. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const spins = document.querySelectorAll('.bn-scroll');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; spins.forEach((s) => { s.style.transform = `rotate(${scrollY * 0.06}deg)`; }); });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { x: -18, rotation: -2, opacity: 0, duration: 0.4, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
