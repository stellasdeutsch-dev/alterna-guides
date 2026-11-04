/* Pafta: при прокрутке карта плывёт под картушем, листы атласа разворачиваются один за другим. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const m = document.querySelector('.pf-map');
  let t = false;
  addEventListener('scroll', () => { if (t) return; t = true; requestAnimationFrame(() => { t = false; if (m) m.setAttribute('transform', `translate(${Math.min(scrollY, 500) * -.05} ${Math.min(scrollY, 500) * -.03})`); }); }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, rotationX: -14, transformOrigin: 'top center', duration: .42, ease: 'power2.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
