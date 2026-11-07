/* Misafir: дверь распахивается, на пороге появляется гостья, поднос с чаем ставят на столик; подставки-слова ложатся на стол по одной. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.2 })
    .from('.d39-door', { scaleX: -2.8, svgOrigin: '380 180', duration: 1.3, ease: 'power2.inOut' })
    .from('.d39-guest', { opacity: 0, y: 10, duration: 0.6, ease: 'power2.out' }, 0.9)
    .from('.d39-table', { y: -30, opacity: 0, duration: 0.6, ease: 'back.out(1.8)' }, 0.5)
    .from('.d39-guestslip', { x: 40, opacity: 0, duration: 0.5, ease: 'power3.out' }, 1.3);
  const wall = document.querySelector('.d39-window');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (wall) wall.setAttribute('transform', `translate(0 ${Math.min(scrollY, 400) * 0.08})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { scale: 0.92, y: 18, rotation: i % 2 ? 3 : -3, opacity: 0, duration: 0.5, ease: 'back.out(1.7)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
