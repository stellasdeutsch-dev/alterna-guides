/* Sergi: глаз на картине следит за курсором и за прокруткой. Текст и разметка не меняются. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const pupil = document.querySelector('.sg-pupil');
  const eye = document.querySelector('.sg-eye');
  if (!pupil || !eye) return;
  const look = (x, y) => {
    const r = eye.getBoundingClientRect();
    const dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 200);
    pupil.setAttribute('transform', `translate(${(dx / d * 15 * k).toFixed(1)} ${(dy / d * 8 * k).toFixed(1)})`);
  };
  addEventListener('pointermove', (e) => look(e.clientX, e.clientY), { passive: true });
  let t = 0;
  const idle = setInterval(() => {
    if (document.hidden) return;
    t += 1;
    const r = eye.getBoundingClientRect();
    look(r.left + r.width / 2 + Math.cos(t * 1.7) * 220, r.top + r.height / 2 + Math.sin(t * 2.3) * 140);
  }, 1900);
  addEventListener('pointermove', () => clearInterval(idle), { once: true, passive: true });
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; const r = eye.getBoundingClientRect(); look(r.left + r.width / 2, r.top + r.height / 2 + 300); });
  }, { passive: true });
})();
