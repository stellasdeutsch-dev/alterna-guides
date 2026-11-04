/* Terazi: чем дальше читаешь, тем тяжелее чаша совести: коромысло наклоняется с прокруткой */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const s = document.querySelector('.lx-scene'); if (!s) return;
  let t = 0;
  const set = () => { t = 0; s.style.setProperty('--ti', (Math.min(1, scrollY / 500) * 4.2).toFixed(2)); };
  addEventListener('scroll', () => { if (!t) t = requestAnimationFrame(set); }, { passive: true });
})();
