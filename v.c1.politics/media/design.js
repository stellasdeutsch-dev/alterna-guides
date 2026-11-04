/* Seçim: при прокрутке амфитеатр чуть приподнимается, а блоки мест заполняются при загрузке. */
(() => {
  const arch = document.querySelector('.pl-arch');
  if (!arch || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rects = [...arch.querySelectorAll('rect')];
  rects.forEach((r, i) => { r.style.opacity = '0'; setTimeout(() => { r.style.transition = 'opacity .35s'; r.style.opacity = ''; }, 60 + (i * 900) / rects.length); });
  let raf = 0;
  addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; arch.style.transform = `translateY(${Math.min(scrollY, 500) * 0.08}px) scale(${1 + Math.min(scrollY, 500) * 0.00012})`; });
  }, { passive: true });
})();
