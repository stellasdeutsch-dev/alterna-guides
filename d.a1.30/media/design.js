/* Sinyal: улица проступает, телефон поднимается снизу, полоски сигнала набираются; сим-карты «вставляются» сбоку. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d30-street', { opacity: 0, y: 14, duration: 0.8, ease: 'power2.out' })
    .from('.d30-phone', { y: 150, rotation: 6, transformOrigin: '50% 100%', duration: 1, ease: 'back.out(1.3)' }, 0.3)
    .from('.d30-tram-wrap', { opacity: 0, duration: 0.8, ease: 'power1.out' }, 0.6)
    .from('.lx-tag', { x: -30, opacity: 0, duration: 0.5, ease: 'power2.out', clearProps: 'transform,opacity' }, 0.2);
  const far = document.querySelector('.d30-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 480);
      if (far) far.setAttribute('transform', `translate(0 ${y * 0.12})`);
    });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { x: i % 2 ? 40 : -40, opacity: 0, duration: 0.55, ease: 'power3.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
