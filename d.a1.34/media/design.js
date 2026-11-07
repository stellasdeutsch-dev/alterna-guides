/* Liste: блокнот ложится на стол, заметки прилепляются к стене; пункты чек-листа вписываются по одной строке. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d34-book', { y: 90, opacity: 0, duration: 0.9, ease: 'power3.out' })
    .from('.d34-window', { opacity: 0, duration: 0.8, ease: 'power1.out' }, 0)
    .from('.d34-pin--a', { y: -30, rotation: -12, opacity: 0, duration: 0.6, ease: 'back.out(2)', transformOrigin: '50% 0' }, 0.5)
    .from('.d34-pin--b', { y: -30, rotation: 12, opacity: 0, duration: 0.6, ease: 'back.out(2)', transformOrigin: '50% 0' }, 0.7);
  const far = document.querySelector('.d34-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${Math.min(scrollY, 400) * 0.06})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { x: -24, opacity: 0, duration: 0.5, ease: 'power2.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
