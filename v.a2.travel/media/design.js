/* Bavul: наклейки «прилепляются» при загрузке, бирки покачиваются при появлении. Без анимаций всё уже на месте. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const st = document.querySelectorAll('.lx-scene svg > g[filter]');
  gsap.from(st, { scale: 1.5, opacity: 0, duration: 0.42, stagger: 0.09, ease: 'back.out(1.8)', transformOrigin: '50% 50%', clearProps: 'opacity' });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { rotate: -2.4, y: 10, opacity: 0, duration: 0.5, ease: 'back.out(2)', transformOrigin: '0 40px', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
