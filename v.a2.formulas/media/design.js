/* Kalıplar: кадры комикса выскакивают по очереди. Без анимаций страница уже собрана. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.from('.fm-p', { scale: 0.86, rotate: () => gsap.utils.random(-5, 5), opacity: 0, duration: 0.45, stagger: 0.1, ease: 'back.out(2)', clearProps: 'all' });
  gsap.from('.fm-b', { scale: 0.4, transformOrigin: '30% 100%', duration: 0.4, delay: 0.5, ease: 'back.out(2.6)', clearProps: 'transform' });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { scale: 0.92, opacity: 0, duration: 0.3, ease: 'back.out(2.4)', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .lx-story p').forEach((c) => io.observe(c));
})();
