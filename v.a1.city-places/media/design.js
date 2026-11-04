/* Harita: булавки падают на карту по одной, карточки-таблички приезжают на шурупах. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.from('.hr-pin', { y: -60, opacity: 0, duration: .55, ease: 'bounce.out', stagger: .12, delay: .25, clearProps: 'transform,opacity' });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { scale: .96, opacity: 0, duration: .36, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .lx-group').forEach((c) => io.observe(c));
})();
