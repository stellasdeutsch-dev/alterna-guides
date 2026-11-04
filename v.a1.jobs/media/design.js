/* Fabrika: бейджам раздаём табельный номер и штрихкод, люди идут к проходной в CSS. Бейджи покачиваются на шнурке при появлении. */
(() => {
  document.querySelectorAll('.lx-card').forEach((c, i) => {
    let h = 7; for (const ch of c.dataset.word) h = (h * 31 + ch.charCodeAt(0)) % 99991;
    const no = String(h % 9000 + 1000);
    c.style.setProperty('--no', `"NO ${no}"`);
    c.style.setProperty('--bar', `${2 + (h % 3)}px`);
    c.style.setProperty('--sway', `${[-1.2, .9, -.6, 1.1][i % 4]}deg`);
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { rotation: 4, transformOrigin: '50% -20px', duration: 0.9, ease: 'elastic.out(1, .4)', clearProps: 'transform' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
