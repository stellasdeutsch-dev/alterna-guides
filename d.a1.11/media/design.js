/* Mahalle: булавки втыкаются в карту по одной, рынок обводится, табличка «KADIKÖY» ложится; флажки-слова
   втыкаются сверху, как булавки. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.2 })
    .from('.d11-carsi', { scale: 0.85, opacity: 0, transformOrigin: '50% 50%', duration: 0.7, ease: 'back.out(2)' })
    .from('.d11-pinw', { y: -70, opacity: 0, duration: 0.55, stagger: 0.18, ease: 'bounce.out' }, 0.3)
    .from('.d11-route', { opacity: 0, duration: 0.8 }, 1.1);
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: -36, rotation: i % 2 ? 3 : -3, transformOrigin: '20px 0%', opacity: 0, duration: 0.5, ease: 'back.out(1.8)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
