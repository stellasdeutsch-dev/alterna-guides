/* Dosya: лента сдвигается от прокрутки, лупа медленно ходит по столу в CSS. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const t = document.querySelector('.cr-tapei');
  if (!t) return;
  let raf = 0;
  addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; t.style.transform = `translateX(${-Math.min(scrollY, 1200) * 0.18}px)`; });
  }, { passive: true });
})();
