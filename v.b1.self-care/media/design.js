/* Hamam: пар и капли в CSS. При прокрутке пештемаль покачивается, этикетки появляются по одной. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const steam = document.querySelector('.hm-steam');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick || !steam) return; tick = true;
    requestAnimationFrame(() => { tick = false; steam.setAttribute('transform', `translate(0 ${Math.min(scrollY, 500) * -0.16})`); });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 12, opacity: 0, duration: 0.42, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
