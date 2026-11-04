/* Glic: заголовок дрожит при появлении и на прокрутке, сцена разъезжается по слоям от прокрутки. */
(() => {
  const h = document.querySelector('.lx-hero h1');
  if (h) h.dataset.t = h.textContent;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const kick = () => { if (!h) return; h.classList.remove('is-gl'); void h.offsetWidth; h.classList.add('is-gl'); };
  setTimeout(kick, 500);
  const net = document.querySelector('.gl-net'), face = document.querySelector('.gl-face'), code = document.querySelector('.gl-code');
  let tick = 0, lastKick = 0;
  addEventListener('scroll', () => {
    if (tick) return;
    tick = requestAnimationFrame(() => {
      tick = 0;
      const y = Math.min(scrollY, 700);
      if (net) net.style.transform = `translateY(${y * -0.05}px)`;
      if (code) code.style.transform = `translateY(${y * -0.11}px)`;
      if (face) face.style.transform = `translateY(${y * 0.03}px)`;
      if (y > 40 && y < 600 && performance.now() - lastKick > 1400) { lastKick = performance.now(); kick(); }
    });
  }, { passive: true });
})();
