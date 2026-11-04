/* Галерея: при прокрутке посетитель в зале проходит мимо работ, этикетки появляются по одной. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const art = document.querySelector('.gl-art');
  const pl = document.querySelector('.gl-plinth');
  let t = false;
  addEventListener('scroll', () => {
    if (t) return; t = true;
    requestAnimationFrame(() => {
      t = false;
      const y = Math.min(scrollY, 600);
      if (art) art.setAttribute('transform', `translate(${y * -0.03} 0)`);
      if (pl) pl.setAttribute('transform', `translate(${y * 0.09} 0)`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card, .lx-group').forEach((c) => io.observe(c));
})();
