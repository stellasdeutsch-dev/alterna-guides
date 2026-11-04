/* Каппадокия: при прокрутке шары поднимаются и расходятся, солнце выходит. Без движения всё на своих местах. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const q = (s) => document.querySelector(s);
  const far = q('.tr-rise--far'), mid = q('.tr-rise--mid'), near = q('.tr-rise--near'), sun = q('.tr-sunwrap');
  let t = false;
  addEventListener('scroll', () => {
    if (t) return; t = true;
    requestAnimationFrame(() => {
      t = false;
      const y = Math.min(scrollY, 700);
      if (far) far.setAttribute('transform', `translate(0 ${y * -0.12})`);
      if (mid) mid.setAttribute('transform', `translate(0 ${y * -0.3})`);
      if (near) near.setAttribute('transform', `translate(${y * 0.05} ${y * -0.5})`);
      if (sun) sun.setAttribute('transform', `translate(0 ${y * -0.22})`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out', clearProps: 'opacity,transform' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
