/* Pres: в карточках суффикс выделяется оттиском. Текст слова остаётся тем же. Задняя стена цеха смещается при прокрутке. */
(() => {
  document.querySelectorAll('.lx-card__tr').forEach((t) => {
    const w = t.textContent.trim();
    const m = w.match(/^(.+?)(laş|leş|la|le|al|el|ül|ar|er)(mak|mek)$/);
    if (!m) return;
    /* берём самый длинный подходящий суффикс с конца */
    const end = w.slice(-3);
    const stem = w.slice(0, -3);
    const suf = ['laş', 'leş', 'la', 'le', 'ül', 'al', 'ar', 'er'].find((s) => stem.endsWith(s) && stem.length > s.length);
    if (!suf) return;
    t.textContent = '';
    const b = document.createElement('span'); b.className = 'pr-suf'; b.textContent = suf;
    t.append(stem.slice(0, -suf.length), b, end);
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const back = document.querySelector('.pr-back');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (back) back.setAttribute('transform', `translate(0 ${Math.min(scrollY, 500) * 0.08})`); });
  }, { passive: true });
})();
