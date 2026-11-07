/* Nobetci: вывеска ECZANE загорается, коробочки встают на полки, рецепт протягивают в кадр;
   коробочки-слова «ставят» на полку с лёгким отскоком, капсулы-фразы выкатываются слева. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.lx-scene use', { y: '-=18', opacity: 0, duration: 0.4, stagger: 0.03, ease: 'power2.out' })
    .from('.d28-rx', { x: '-=160', rotation: -30, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.3)
    .from('.d28-cat', { opacity: 0, duration: 0.8 }, 0.9);
  const side = document.querySelector('.d28-side');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (side) side.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.06})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    const card = e.target.classList.contains('lx-card');
    gsap.from(e.target, card
      ? { y: -30, opacity: 0, duration: 0.6, ease: 'bounce.out', delay: (i % 3) * 0.05, clearProps: 'transform,opacity' }
      : { x: -30, opacity: 0, duration: 0.45, ease: 'back.out(1.8)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
