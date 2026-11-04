/* Папка: при прокрутке главный снимок выезжает выше из папки, боковые расходятся. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const main = document.querySelector('.gz-main');
  const l = document.querySelector('.gz-photo--l');
  const r = document.querySelector('.gz-photo--r');
  let t = false;
  addEventListener('scroll', () => {
    if (t) return; t = true;
    requestAnimationFrame(() => {
      t = false;
      const y = Math.min(scrollY, 500);
      if (main) main.setAttribute('transform', `translate(0 ${y * -0.12})`);
      if (l) l.setAttribute('transform', `translate(${40 - y * 0.08} ${110 - y * 0.04}) rotate(${-8 - y * 0.008})`);
      if (r) r.setAttribute('transform', `translate(${1158 + y * 0.08} ${76 - y * 0.04}) rotate(${7 + y * 0.008})`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, y: 26, duration: 0.5, ease: 'power3.out', clearProps: 'opacity,transform' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
