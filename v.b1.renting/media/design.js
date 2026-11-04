/* Emlak: отражение улицы на стекле едет за прокруткой, листы слегка качаются (CSS). */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = document.querySelector('.em-reflect');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick || !r) return; tick = true;
    requestAnimationFrame(() => { tick = false; r.setAttribute('transform', `translate(${Math.min(scrollY, 600) * 0.14} 0)`); });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: -12, rotation: 1.4, opacity: 0, duration: 0.36, ease: 'back.out(1.6)', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
