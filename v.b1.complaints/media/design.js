/* Şikâyet: штампы на листе ударяют один раз при появлении раздела, сцена покачивается при прокрутке. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const sign = document.querySelector('.sk-sign');
  const hero = document.querySelector('.lx-hero');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 400);
      if (sign) sign.setAttribute('transform', `rotate(${y * 0.012} 330 0)`);
      if (hero) hero.style.setProperty('--sk-off', `${8 + y * 0.012}px`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { scale: 1.06, opacity: 0, duration: 0.28, ease: 'power3.in', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-group').forEach((c) => io.observe(c));
})();
