/* Dürbün: двигаешь страницу и наводишь бинокль: скалы и лес слегка смещаются, карточки отмечаются следом. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const svg = document.querySelector('.lx-scene svg');
  const leo = svg && svg.querySelector('g[clip-path]');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 500);
      if (leo) leo.style.transform = `translateY(${y * 0.04}px)`;
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { x: 18, opacity: 0, duration: 0.4, ease: 'power2.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
