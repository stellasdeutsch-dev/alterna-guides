/* Sınıf: наклейки лежат чуть криво, как их клеят школьники; заголовок раздела «пишется» мелом. */
(() => {
  document.querySelectorAll('.lx-card').forEach((c, i) => c.style.setProperty('--tilt', `${[-.7, .6, -.4, .8, -.5, .3][i % 6]}deg`));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.from('.lx-hero h1', { clipPath: 'inset(0 100% 0 0)', duration: 1.1, ease: 'power1.inOut', clearProps: 'clipPath' });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { scale: 1.05, opacity: 0, duration: 0.28, ease: 'power2.out', clearProps: 'transform,opacity,scale' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
