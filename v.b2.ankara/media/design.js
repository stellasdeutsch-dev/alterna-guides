/* Başkent: при прокрутке клин с заголовком чуть доворачивается, самолёт летит вперёд. Марки ложатся на страницу альбома по очереди. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const plane = document.querySelector('.sc-plane');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (plane) plane.setAttribute('transform', `translate(${Math.min(scrollY, 500) * -0.35} ${Math.min(scrollY, 500) * 0.04})`); });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { x: -14, rotate: -1.4, opacity: 0, duration: 0.4, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
