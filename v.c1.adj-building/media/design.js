/* İmbik: в колбу входит существительное, из неё капает прилагательное. Слова меняются сами; уровень в правой колбе растёт при прокрутке. */
(() => {
  const P = [['toplum', '-sal', 'toplumsal'], ['tarih', '-sel', 'tarihsel'], ['barış', '-çıl', 'barışçıl'], ['yeşil', '-imsi', 'yeşilimsi'], ['çocuk', '-su', 'çocuksu'], ['yemek', '-hane', 'yemekhane'], ['asker', '-î', 'askerî'], ['birey', '-sel', 'bireysel']];
  const n = document.querySelector('.im-noun'), s = document.querySelector('.im-suf'), a = document.querySelector('.im-adj'), l = document.querySelector('.im-lvl');
  if (!n || !s || !a || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let i = 0;
  setInterval(() => {
    if (document.hidden) return;
    i = (i + 1) % P.length;
    [n, s, a].forEach((t) => t.classList.add('is-out'));
    setTimeout(() => { n.textContent = P[i][0]; s.textContent = P[i][1]; a.textContent = P[i][2]; [n, s, a].forEach((t) => t.classList.remove('is-out')); }, 320);
  }, 3400);
  let raf = 0;
  addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; if (l) l.style.transform = `translateY(${-Math.min(scrollY, 500) * 0.09}px)`; });
  }, { passive: true });
})();
