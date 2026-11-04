/* Bağlantı: вагон SONRA подъезжает к ÖNCE, потом детали пазла встают на свои места. Без анимаций всё уже сцеплено. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 3, defaults: { ease: 'power2.inOut' } });
  tl.from('.cn-wagon', { x: 70, duration: 1.6 }, 0.4)
    .from('.cn-jaw', { x: 44, duration: 1.6 }, 0.4)
    .from('.cn-pin', { y: -70, duration: 0.5, ease: 'bounce.out' }, 2)
    .to(['.cn-wagon', '.cn-jaw'], { x: 70, duration: 1.4 }, 6)
    .to('.cn-pin', { y: -70, duration: 0.4 }, 5.7);
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { x: 16, opacity: 0, duration: 0.4, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
