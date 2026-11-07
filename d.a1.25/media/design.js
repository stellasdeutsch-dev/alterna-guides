/* Adres: башня поднимается из воды, табличка «14» прибивается к стене, булавка падает на адрес;
   таблички-слова «прибиваются» с лёгким поворотом, строки цели ложатся, как адрес на конверт. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d25-tower', { y: 40, opacity: 0, duration: 1.2, ease: 'power2.out' })
    .from('.d25-plate', { scale: 0.2, rotation: -20, opacity: 0, transformOrigin: '50% 50%', duration: 0.6, ease: 'back.out(2.2)' }, 0.5)
    .from('.d25-pin', { y: -140, opacity: 0, duration: 0.8, ease: 'bounce.out' }, 0.9);
  const far = document.querySelector('.d25-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.06})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    const card = e.target.classList.contains('lx-card');
    gsap.from(e.target, card
      ? { scale: 0.9, rotation: i % 2 ? 3 : -3, opacity: 0, duration: 0.5, ease: 'back.out(2)', clearProps: 'transform,opacity' }
      : { x: -24, opacity: 0, duration: 0.45, ease: 'power2.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
