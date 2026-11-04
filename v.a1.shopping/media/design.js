/* Pazar: ценники покачиваются на бечёвке при прокрутке. На вкладке «Тест» итог считает общий скрипт, здесь только движение. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { rotation: gsap.utils.random([-7, 7]), y: -16, opacity: 0, transformOrigin: '50% 0', duration: .7, ease: 'elastic.out(1, .55)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
