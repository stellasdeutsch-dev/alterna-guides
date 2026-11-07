/* Ada: остров поднимается из моря, паром подходит к причалу, указатель выскакивает; билеты-слова выезжают из кассы, строки расписания — по очереди. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d33-kosk > g', { y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' })
    .from('.d33-pine-wrap', { y: 30, opacity: 0, duration: 0.7, ease: 'power2.out' }, 0.2)
    .from('.d33-ferry', { x: -220, duration: 1.8, ease: 'power2.out' }, 0.1)
    .from('.d33-sign', { y: 50, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, 0.9);
  const far = document.querySelector('.d33-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.08})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 30, rotation: -2, opacity: 0, duration: 0.55, ease: 'power3.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
