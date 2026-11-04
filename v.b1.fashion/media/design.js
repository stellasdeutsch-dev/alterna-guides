/* Dergi: модель поднимается над заголовком при прокрутке, как на обложке. Развороты открываются из корешка. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const model = document.querySelector('.dg-model');
  const left = document.querySelector('.dg-left');
  const right = document.querySelector('.dg-right');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 600);
      if (model) model.style.translate = `0 ${(-y * 0.05).toFixed(1)}px`;
      if (left) left.setAttribute('transform', `translate(0 ${(y * 0.1).toFixed(1)})`);
      if (right) right.setAttribute('transform', `translate(0 ${(y * 0.14).toFixed(1)})`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { x: -18, opacity: 0, duration: 0.5, ease: 'power3.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
