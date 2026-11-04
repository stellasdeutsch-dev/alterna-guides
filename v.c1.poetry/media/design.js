/* Тушь: планы гор расходятся при прокрутке */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const s = document.querySelector('.lx-scene'); if (!s) return;
  let t = 0;
  addEventListener('scroll', () => { if (t) return; t = requestAnimationFrame(() => { t = 0; s.style.setProperty('--sy', Math.min(1, scrollY / 400).toFixed(3)); }); }, { passive: true });
})();
