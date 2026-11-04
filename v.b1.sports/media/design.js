/* Stat: на табло идёт матч, минута прибавляется, пока сцена на экране. Трибуны приближаются при прокрутке. Наклейки приклеиваются по очереди. */
(() => {
  const hero = document.querySelector('.lx-hero');
  if (!hero) return;
  let min = 67;
  hero.style.setProperty('--dk', min);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  setInterval(() => {
    if (document.hidden || hero.getBoundingClientRect().bottom < 0) return;
    min = min >= 90 ? 46 : min + 1;
    hero.style.setProperty('--dk', min);
  }, 4000);
  const svg = document.querySelector('.st-w');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick || !svg) return; tick = true;
    requestAnimationFrame(() => { tick = false; svg.style.transform = `scale(${1 + Math.min(scrollY, 500) * 0.00022})`; });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { scale: 1.08, rotation: 3, opacity: 0, duration: 0.32, ease: 'power3.in', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
