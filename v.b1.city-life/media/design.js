/* Kavşak: при прокрутке машины и дальние дома смещаются с разной скоростью, будто автобус тронулся. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const far = document.querySelector('.ck-far');
  const scene = document.querySelector('.lx-scene svg');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 600);
      if (far) far.setAttribute('transform', `translate(${y * -0.06} 0)`);
      if (scene) scene.style.transform = `translateX(${y * -0.03}px) scale(${1 + y * 0.00008})`;
    });
  }, { passive: true });
})();
