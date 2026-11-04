/* Plak: игла идёт к центру по мере прокрутки */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const s = document.querySelector('.lx-scene'); if (!s) return;
  let t = 0;
  addEventListener('scroll', () => { if (t) return; t = requestAnimationFrame(() => { t = 0; s.style.setProperty('--sa', (Math.min(1, scrollY / 900) * 9).toFixed(2)); }); }, { passive: true });
})();
