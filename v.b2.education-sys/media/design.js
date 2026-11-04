/* Класс: при прокрутке солнечное пятно ползёт по доске, ученики чуть опускаются. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const sun = document.querySelector('.es-sun');
  const kids = document.querySelectorAll('.es-kid');
  let t = false;
  addEventListener('scroll', () => {
    if (t) return; t = true;
    requestAnimationFrame(() => {
      t = false;
      const y = Math.min(scrollY, 500);
      if (sun) sun.setAttribute('transform', `translate(${y * -0.3} ${y * 0.05})`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, y: 12, duration: 0.42, ease: 'power2.out', clearProps: 'opacity,transform' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
