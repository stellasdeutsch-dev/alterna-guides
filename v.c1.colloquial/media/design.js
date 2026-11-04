/* Duvar: при прокрутке рисунки на стене смещаются иначе, чем стена, наклейки шлёпаются на место. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const f = document.querySelector('.dv-far');
  let t = false;
  addEventListener('scroll', () => { if (t) return; t = true; requestAnimationFrame(() => { t = false; if (f) f.setAttribute('transform', `translate(${Math.min(scrollY, 600) * -.06} 0)`); }); }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { scale: 1.12, opacity: 0, rotation: gsap.utils.random(-5, 5), duration: .28, ease: 'power3.in', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
