/* Kubbe: роспись чаши поворачивается вслед за прокруткой, как будто идёшь под куполом */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const s = document.querySelector('.lx-scene'); if (!s) return;
  let t = 0;
  addEventListener('scroll', () => { if (t) return; t = requestAnimationFrame(() => { t = 0; s.style.setProperty('--sr', (scrollY * .06).toFixed(2)); }); }, { passive: true });
})();
