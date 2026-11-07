/* Beden: вешалки по очереди съезжают на штангу, табличка скидки выпрыгивает, палитра раскрывается;
   бирки-слова раскачиваются на шнурке, когда появляются на экране. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d27-hang', { x: '-=160', opacity: 0, duration: 0.8, stagger: 0.14, ease: 'power3.out' })
    .from('.d27-swatch circle', { scale: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.07, ease: 'back.out(3)' }, 0.6)
    .from('.d27-sale', { y: '+=60', opacity: 0, duration: 0.6, ease: 'back.out(2)' }, 0.9);
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    const card = e.target.classList.contains('lx-card');
    gsap.from(e.target, card
      ? { rotation: i % 2 ? 8 : -8, y: -16, opacity: 0, transformOrigin: '50% 0', duration: 0.9, ease: 'elastic.out(1, 0.5)', clearProps: 'transform,opacity' }
      : { scale: 0.96, opacity: 0, duration: 0.4, ease: 'power2.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
