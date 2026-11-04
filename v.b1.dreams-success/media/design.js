/* Zirve: альпинист идёт по маршруту сам и быстрее от прокрутки; гряды едут с разной скоростью. */
(() => {
  const route = document.getElementById('zv-route');
  const man = document.getElementById('zv-climber');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !route || !man) return;
  const L = route.getTotalLength();
  const p1 = document.querySelector('.zv-p1');
  const p2 = document.querySelector('.zv-p2');
  let t = 0.1, last = performance.now(), sy = scrollY, vis = true;
  const place = () => { const q = route.getPointAtLength(L * Math.min(t, 0.985)); man.setAttribute('transform', `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})`); };
  const frame = (now) => {
    const dt = Math.min(now - last, 80); last = now;
    if (vis && !document.hidden) { t += dt / 90000; if (t > 0.985) t = 0.02; place(); }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  addEventListener('scroll', () => {
    const d = Math.abs(scrollY - sy); sy = scrollY;
    t = Math.min(0.985, t + d / 6000);
    vis = sy < 900;
    const y = Math.min(sy, 700);
    if (p1) p1.setAttribute('transform', `translate(0 ${(y * 0.09).toFixed(1)})`);
    if (p2) p2.setAttribute('transform', `translate(0 ${(y * 0.04).toFixed(1)})`);
  }, { passive: true });
})();
