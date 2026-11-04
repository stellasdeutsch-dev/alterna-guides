/* Meydan: при прокрутке толпа расходится слоями, плакаты поднимаются выше передних рядов. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const back = document.querySelectorAll('.op-back');
  const mid = document.querySelector('.op-mid');
  const front = document.querySelector('.op-front');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 500);
      back.forEach((b) => b.setAttribute('transform', `translate(0 ${y * -0.04})`));
      if (mid) mid.setAttribute('transform', `translate(${y * -0.03} ${y * 0.03})`);
      if (front) front.setAttribute('transform', `translate(${y * 0.05} ${y * 0.08})`);
    });
  }, { passive: true });
})();
