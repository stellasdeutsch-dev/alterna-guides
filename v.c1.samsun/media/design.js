/* Bandırma: пароход идёт к берегу по мере прокрутки. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const s = document.querySelector('.bn-sail');
  if (!s) return;
  let raf = 0;
  const move = () => { raf = 0; s.style.transform = `translateX(${Math.min(scrollY, 500) * 0.28}px)`; };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(move); }, { passive: true });
})();
