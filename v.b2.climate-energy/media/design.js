/* Enerji: прокрутка «идёт» вдоль полос потепления: температура на солнце растёт от 0,0° до +1,5°, заряд машины тикает. Без анимации значения стоят. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const t = document.querySelector('.en-t');
  const pct = document.querySelector('.en-pct');
  let n = 74;
  if (pct) setInterval(() => { if (document.hidden) return; n = n >= 100 ? 40 : n + 1; pct.textContent = n + '%'; }, 900);
  let tick = false;
  const upd = () => {
    tick = false;
    const k = Math.min(1, scrollY / 600);
    if (t) t.textContent = '+' + (1.5 * (0.2 + 0.8 * k)).toFixed(1).replace('.', ',') + '°';
  };
  addEventListener('scroll', () => { if (tick) return; tick = true; requestAnimationFrame(upd); }, { passive: true });
  upd();
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 14, opacity: 0, duration: 0.34, ease: 'power2.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
