/* Ekran: лампы и антенна качаются в CSS, а при прокрутке картинка на кинескопе чуть плывёт, как при плохом приёме. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const roll = document.querySelector('.md-tick');
  const tv = document.querySelector('.lx-scene svg');
  if (!tv) return;
  let tick = 0;
  addEventListener('scroll', () => {
    if (tick) return;
    tick = requestAnimationFrame(() => { tick = 0; tv.style.transform = `translateY(${Math.min(scrollY, 600) * 0.12}px)`; });
  }, { passive: true });
  void roll;
})();
