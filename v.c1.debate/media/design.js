/* Münazara: таймер считает секунды, ход переходит от одной трибуны к другой; при прокрутке трибуны сходятся к центру. */
(() => {
  const s = document.querySelector('.db-s'), t = document.querySelector('.db-time');
  if (!s || !t || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let left = 120, turn = 'l';
  const fmt = (n) => `0${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
  setInterval(() => {
    if (document.hidden) return;
    left -= 1;
    if (left < 0 || left % 9 === 0 && left !== 120) { turn = turn === 'l' ? 'r' : 'l'; s.setAttribute('data-turn', turn); }
    if (left < 0) left = 120;
    t.textContent = fmt(left);
  }, 1000);
  const l = document.querySelector('.db-mv-l'), r = document.querySelector('.db-mv-r');
  let raf = 0;
  addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; const v = Math.min(scrollY, 420) * 0.12; l.style.transform = `translateX(${v}px)`; r.style.transform = `translateX(${-v}px)`; });
  }, { passive: true });
})();
