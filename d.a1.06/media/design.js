/* Sahil: солнце встаёт, стакан чая «ставят» на стол, симит подают; открытки-слова ложатся на стол по одной. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.sh-sun', { y: 70, opacity: 0, duration: 1.6, ease: 'power2.out' })
    .from('.sh-glass', { y: -60, opacity: 0, duration: 0.7, ease: 'bounce.out' }, 0.6)
    .from('.sh-plate', { x: -80, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.9);
  const sea = document.querySelector('.sh-shore');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (sea) sea.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.1})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: -30, rotation: i % 2 ? 5 : -5, opacity: 0, duration: 0.55, ease: 'power3.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
