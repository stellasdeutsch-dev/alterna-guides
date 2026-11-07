/* Tabela: стрелки раскладываются от столба, табличка «BAHARİYE CAD.» встаёт на место, заголовок-табличка качается на столбе;
   уличные таблички-слова переворачиваются сверху вниз, как будто их прикручивают к стене. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d07-left, .d07-right', { opacity: 0, y: 16, duration: 0.7, stagger: 0.1, ease: 'power2.out' })
    .from('.d07-street-sign', { scale: 0.4, opacity: 0, transformOrigin: '50% 50%', duration: 0.6, ease: 'back.out(2.2)' }, 0.4)
    .from('.d07-arrow', { scaleX: 0, duration: 0.5, stagger: 0.15, ease: 'back.out(1.8)' }, 0.6);
  const h1 = document.querySelector('.lx-hero h1');
  if (h1) gsap.fromTo(h1, { rotation: 5, transformOrigin: '50% -32px' }, { rotation: 0, duration: 1.6, delay: 0.4, ease: 'elastic.out(1, 0.3)', clearProps: 'transform' });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.fromTo(e.target, { rotationX: -60, opacity: 0, transformPerspective: 800, transformOrigin: '50% 0' }, { rotationX: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.6)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
