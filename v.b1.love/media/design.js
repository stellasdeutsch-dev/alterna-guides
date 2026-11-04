/* Mektup: предметы на столе чуть расходятся при прокрутке. Письма раскрываются, как будто их разворачивают. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const svg = document.querySelector('.lx-scene svg');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      if (svg) svg.style.translate = `0 ${Math.min(scrollY, 700) * 0.08}px`;
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { scaleY: 0.92, opacity: 0, transformOrigin: '50% 0%', duration: 0.5, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
