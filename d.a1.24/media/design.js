/* Dolmus: маршрутка въезжает и тормозит у остановки, табличка остановки вырастает, облачко «Müsait bir yerde» выскакивает;
   таблички-слова опускаются сверху и чуть качаются, как подвешенные на стекле. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d24-bus-wrap', { x: -420, duration: 1.5, ease: 'power3.out' })
    .from('.d24-stop', { y: 40, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, 0.5)
    .from('.d24-bubble', { scale: 0.4, opacity: 0, transformOrigin: '15% 100%', duration: 0.55, ease: 'back.out(2.4)' }, 1.4);
  const far = document.querySelector('.d24-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.08})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: -24, rotation: i % 2 ? 2.5 : -2.5, opacity: 0, transformOrigin: '50% 0', duration: 0.7, ease: 'elastic.out(1, 0.6)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
