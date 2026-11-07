/* Piknik: плед расстилается на траве, самовар ставят, тарелки появляются одна за другой;
   тарелочки-слова и блюдца-фразы ложатся на страницу с лёгким поворотом. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.2 })
    .from('.d20-blanket', { scaleY: 0, opacity: 0, transformOrigin: '50% 0%', duration: 0.9, ease: 'power3.out' })
    .from('.d20-samovar', { y: -50, opacity: 0, duration: 0.7, ease: 'bounce.out' }, 0.6)
    .from('.d20-food > g', { y: -24, scale: 0.6, opacity: 0, transformOrigin: '50% 50%', duration: 0.45, stagger: 0.1, ease: 'back.out(2)' }, 0.8);
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 30, scale: 0.92, rotation: i % 2 ? 3 : -3, opacity: 0, duration: 0.55, ease: 'back.out(1.6)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
