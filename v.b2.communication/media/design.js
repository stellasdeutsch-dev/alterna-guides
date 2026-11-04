/* Коммутатор: при прокрутке шнуры чуть провисают сильнее, модули загораются по одному. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, y: 8, duration: 0.38, ease: 'power2.out', clearProps: 'opacity,transform' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
  const shadows = document.querySelectorAll('.st-cord');
  let t = false;
  addEventListener('scroll', () => {
    if (t) return; t = true;
    requestAnimationFrame(() => {
      t = false;
      const y = Math.min(scrollY, 400);
      shadows.forEach((s, i) => s.setAttribute('transform', `translate(0 ${(i % 3 + 1) * y * 0.02})`));
    });
  }, { passive: true });
})();
