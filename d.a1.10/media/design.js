/* Takvim: календарь «качнулся» на гвозде, чашку ставят на стол, блокнот подвигают; листки-слова отрываются
   с пачки и ложатся по одному. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d10-cal', { rotation: -8, transformOrigin: '50% 0%', duration: 1.6, ease: 'elastic.out(1, 0.35)' })
    .from('.d10-roofs', { y: 40, opacity: 0, duration: 0.9, ease: 'power2.out' }, 0.1)
    .from('.d10-steam', { opacity: 0, duration: 0.8 }, 0.8);
  const win = document.querySelector('.d10-roofs');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (win) win.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.06})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: -26, rotationX: -50, rotation: i % 2 ? 2 : -2, transformOrigin: '50% 0%', opacity: 0, duration: 0.6, ease: 'power3.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
