/* Katalog: при прокрутке ящик выезжает дальше, а лампа светит на стол. Карточки встают в ящик по одной. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const dr = document.querySelector('.kt-drawer__in');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 420) / 420;
      if (dr) dr.style.transform = `translate(${-6 * y}px, ${10 * y}px) scale(${1 + y * .06})`;
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 18, opacity: 0, duration: .38, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
