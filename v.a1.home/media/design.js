/* Кукольный дом: комнаты зажигаются по очереди, лифт ездит, ключи покачиваются при прокрутке. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const keys = [...document.querySelectorAll('.ev-key')];
  let tick = false, last = 0;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const d = Math.max(-5, Math.min(5, (scrollY - last) * 0.12)); last = scrollY;
      keys.forEach((k, i) => k.style.setProperty('--tilt', `${d * (i % 2 ? 1 : -1)}deg`));
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { rotation: -2.5, y: -10, opacity: 0, duration: .5, ease: 'back.out(2)', transformOrigin: '30px 0', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
