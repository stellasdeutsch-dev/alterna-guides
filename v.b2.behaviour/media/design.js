/* Пятна: при прокрутке крылья расходятся от оси, словно лист раскрывается обратно. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = document.querySelector('.lx-scene');
  let t = false;
  addEventListener('scroll', () => {
    if (t) return; t = true;
    requestAnimationFrame(() => {
      t = false;
      if (r) r.style.setProperty('--open', String(Math.min(scrollY, 600) * 0.22));
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, scale: 0.975, duration: 0.5, ease: 'power2.out', clearProps: 'opacity,transform' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
