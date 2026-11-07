/* Kapalıçarşı: арки свода проявляются от ближней к дальней, лампы опускаются на цепях, ковры разворачиваются;
   вывески-слова повисают и раскачиваются на цепочках, пока не остановятся. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d23-arches > path', { opacity: 0, duration: 0.35, stagger: 0.06, ease: 'power1.out' })
    .from('.d23-lamp', { y: -80, duration: 1, stagger: 0.12, ease: 'bounce.out' }, 0.4)
    .from('.d23-rug-wrap', { scaleY: 0, transformOrigin: '50% 0%', duration: 0.8, stagger: 0.15, ease: 'power2.out' }, 0.6);
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    if (e.target.matches('.lx-card')) gsap.fromTo(e.target, { rotation: 7, opacity: 0, transformOrigin: '50% -22px' }, { rotation: 0, opacity: 1, duration: 1.2, ease: 'elastic.out(1, .4)', clearProps: 'transform,opacity' });
    else gsap.from(e.target, { y: 24, opacity: 0, duration: 0.5, ease: 'power2.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
