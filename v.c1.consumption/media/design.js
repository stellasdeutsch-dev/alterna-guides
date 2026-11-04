/* Raf: коробки встают на полку, когда до них докрутили; полки при прокрутке чуть отстают от тележки. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const sh = document.querySelector('.rf-shelves');
  let t = false;
  addEventListener('scroll', () => { if (t) return; t = true; requestAnimationFrame(() => { t = false; if (sh) sh.setAttribute('transform', `translate(${Math.min(scrollY, 600) * -.05} 0)`); }); }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: -18, opacity: 0, duration: .4, ease: 'back.out(2)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
