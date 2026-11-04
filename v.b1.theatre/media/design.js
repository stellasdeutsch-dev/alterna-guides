/* Sahne: занавес разъезжается при загрузке, а при прокрутке снова сходится, будто начинается антракт. Гаснет прожектор, когда сцена уходит с экрана. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const l = document.querySelector('.sh-cl__in');
  const r = document.querySelector('.sh-cr__in');
  const lx = document.querySelector('.lx');
  let tick = false;
  const up = () => {
    tick = false;
    const y = Math.min(scrollY, 600) / 600;
    const dx = y * 110;
    if (l) l.style.translate = `${dx}px 0`;
    if (r) r.style.translate = `${-dx}px 0`;
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(up); } }, { passive: true });
  if (lx) lx.classList.add('sh-open');
})();
