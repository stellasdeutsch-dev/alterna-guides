/* Catal: при прокрутке левый и правый берега расходятся, а монета поднимается. Без анимаций мир стоит на месте. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const L = document.querySelector('.dc-left');
  const R = document.querySelector('.dc-right');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 500);
      if (L) L.setAttribute('transform', `translate(${(-y * 0.1).toFixed(1)} 0)`);
      if (R) R.setAttribute('transform', `translate(${(y * 0.1).toFixed(1)} 0)`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  let side = 1;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    side = -side;
    gsap.from(e.target, { opacity: 0, x: 22 * side, duration: 0.42, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
