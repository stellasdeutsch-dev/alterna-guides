/* Veda: автобус на Измир подъезжает к перрону, колёса крутятся и замирают, соседка выходит проводить,
   чемодан ставят рядом; магниты-слова «прилипают» к холодильнику с лёгким щелчком. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.2 })
    .from('.d43-bus-go', { x: -560, duration: 1.8, ease: 'power3.out' })
    .from('.d43-spin', { rotation: -900, transformOrigin: '50% 50%', duration: 1.8, ease: 'power3.out' }, 0)
    .from('.d43-neighbor', { x: -40, opacity: 0, duration: 0.7, ease: 'power2.out' }, 1.2)
    .from('.d43-case', { y: -40, opacity: 0, duration: 0.6, ease: 'bounce.out' }, 1.5);
  const city = document.querySelector('.d43-canopy');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (city) city.setAttribute('transform', `translate(0 ${Math.min(scrollY, 400) * 0.06})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { scale: 0.94, y: -14, rotation: i % 2 ? 2 : -2, opacity: 0, duration: 0.4, ease: 'back.out(3)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
