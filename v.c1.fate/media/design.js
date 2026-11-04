/* Çarkıfelek: колесо докручивается вслед за прокруткой */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const s = document.querySelector('.lx-scene'); if (!s) return;
  let t = 0;
  addEventListener('scroll', () => { if (t) return; t = requestAnimationFrame(() => { t = 0; s.style.setProperty('--sp', (scrollY * .35).toFixed(1)); }); }, { passive: true });
})();
