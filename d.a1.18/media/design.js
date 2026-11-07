/* Davet: сообщение «улетает» из телефона конвертом, конверт открывается и показывает приглашение, в календаре
   отмечается дата; конверты-слова «приходят по почте» по одному, улица за окном отстаёт при прокрутке. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.2 })
    .from('.d18-phonewrap', { y: 40, opacity: 0, duration: 0.6, ease: 'power3.out' })
    .from('.d18-envin', { x: -230, y: 60, rotation: -24, scale: 0.4, opacity: 0, transformOrigin: '50% 50%', duration: 1.1, ease: 'power3.out' }, 0.4)
    .from('.d18-flap', { scaleY: -1, transformOrigin: '50% 100%', duration: 0.5, ease: 'power2.inOut' }, 1.5)
    .from('.d18-card', { y: 40, duration: 0.6, ease: 'back.out(1.8)' }, 1.95)
    .from('.d18-cal', { y: -30, opacity: 0, duration: 0.6, ease: 'power2.out' }, 0.6)
    .from('.d18-markwrap', { scale: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(3)' }, 1.4)
    .from('.d18-note', { y: -20, opacity: 0, duration: 0.5, ease: 'bounce.out' }, 1.8);
  const far = document.querySelector('.d18-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.08})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { x: i % 2 ? 60 : -60, y: -20, rotation: i % 2 ? 6 : -6, opacity: 0, duration: 0.6, ease: 'power3.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
