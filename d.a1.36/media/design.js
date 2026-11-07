/* Buluşma: площадь проявляется, колонна с орлом поднимается, орёл расправляет крылья, часы выезжают слева;
   карточки-напоминания прикалываются по одной с лёгким покачиванием. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d36-town', { opacity: 0, y: 12, duration: 0.8, ease: 'power2.out' })
    .from('.d36-monument', { y: 60, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.1)
    .from('.d36-eagle-wrap', { scale: 0.4, opacity: 0, duration: 0.7, ease: 'back.out(2.2)', transformOrigin: '50% 100%' }, 0.7)
    .from('.d36-clock', { x: -120, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.3);
  const town = document.querySelector('.d36-town');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (town) town.setAttribute('transform', `translate(0 ${Math.min(scrollY, 400) * 0.06})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: -18, rotation: i % 2 ? 4 : -4, opacity: 0, duration: 0.55, ease: 'back.out(1.8)', transformOrigin: '50% 0', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i, .lx-msg').forEach((c) => io.observe(c));
})();
