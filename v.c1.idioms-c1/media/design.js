/* Hoca: осёл идёт за прокруткой, оттиски ложатся на бумагу как при печати. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const w = document.querySelector('.hc-walk');
  let t = false;
  addEventListener('scroll', () => { if (t) return; t = true; requestAnimationFrame(() => { t = false; if (w) w.setAttribute('transform', `translate(${Math.min(scrollY, 700) * .12} 0)`); }); }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { scale: 1.04, opacity: 0, duration: .32, ease: 'power3.in', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
