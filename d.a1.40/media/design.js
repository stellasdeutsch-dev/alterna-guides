/* Teşekkür: прилавок раскрывается, букет ставят на прилавок и завязывают бант, открытка «Teşekkürler!» встаёт рядом;
   открытки-слова опускаются по одной, как будто их кладут в букет. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.2 })
    .from('.d40-stall', { y: 20, opacity: 0, duration: 0.7, ease: 'power2.out' })
    .from('.d40-pots > g', { y: 30, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(1.8)' }, 0.3)
    .from('.d40-bouquet', { y: -50, opacity: 0, duration: 0.7, ease: 'bounce.out' }, 0.6)
    .from('.d40-bow-wrap', { scale: 0, svgOrigin: '685 258', duration: 0.6, ease: 'back.out(3)' }, 1.3)
    .from('.d40-card', { rotation: -30, opacity: 0, svgOrigin: '762 272', duration: 0.6, ease: 'back.out(2)' }, 1.5);
  const pier = document.querySelector('.d40-pier');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (pier) pier.setAttribute('transform', `translate(0 ${Math.min(scrollY, 400) * 0.08})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: -24, rotation: i % 2 ? 2.5 : -2.5, opacity: 0, duration: 0.55, ease: 'power3.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
