/* Optik: стопка книг и часы едут за прокруткой, строки бланка появляются одна за другой. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const left = document.querySelector('.op-left');
  const right = document.querySelector('.op-right');
  const sheet = document.querySelector('.op-sheet');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 600);
      if (left) left.setAttribute('transform', `translate(0 ${(y * 0.12).toFixed(1)})`);
      if (right) right.setAttribute('transform', `translate(0 ${(y * -0.08).toFixed(1)})`);
      if (sheet) sheet.setAttribute('transform', `rotate(${(0.8 - y * 0.002).toFixed(3)} 600 320)`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, x: -10, duration: 0.32, ease: 'power1.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
