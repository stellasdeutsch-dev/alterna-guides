/* Piksel: уровень едет за прокруткой, как в платформере. Счётчик в строке состояния считает слова, которые уже собраны в инвентарь. */
(() => {
  const score = document.querySelector('[data-px-score]');
  const count = () => { if (score) score.textContent = String(document.querySelectorAll('.lx-card.is-known').length).padStart(3, '0'); };
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('.lx-card__know')) setTimeout(count, 60); });
  setTimeout(count, 400);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const far = document.querySelector('.px-far');
  const mid = document.querySelector('.px-mid');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 700);
      if (far) far.style.transform = `translateX(${-Math.round(y * 0.03) * 2}px)`;
      if (mid) mid.style.transform = `translateX(${-Math.round(y * 0.06) * 2}px)`;
    });
  }, { passive: true });
})();
