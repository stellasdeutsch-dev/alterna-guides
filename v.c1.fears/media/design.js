/* Boşluk: тень фигуры вытягивается при прокрутке, тени карточек ложатся на пол, когда карточка показывается */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const s = document.querySelector('.lx-scene');
  let t = 0;
  if (s) addEventListener('scroll', () => { if (t) return; t = requestAnimationFrame(() => { t = 0; s.style.setProperty('--sl', Math.min(1, scrollY / 460).toFixed(3)); }); }, { passive: true });
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((es) => { for (const e of es) { if (e.isIntersecting) { e.target.classList.remove('bs-off'); io.unobserve(e.target); } } }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => { c.classList.add('bs-off'); io.observe(c); });
})();
