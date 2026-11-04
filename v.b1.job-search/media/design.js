/* Özgeçmiş: при прокрутке предметы расходятся от листа, как будто стол отодвигают. Без анимаций всё на месте. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const l = document.querySelector('.oz-l'), r = document.querySelector('.oz-r');
  if (!l || !r) return;
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 500);
      l.setAttribute('transform', `translate(${y * -0.09} ${y * 0.04})`);
      r.setAttribute('transform', `translate(${y * 0.09} ${y * 0.04})`);
    });
  }, { passive: true });
})();
