/* Akşam: торшер включается, кот запрыгивает на подоконник, чай ставят на столик, мама пишет «Ne yapıyorsun?»;
   стикеры-слова прилипают к холодильнику по одному, полка с книгами чуть отстаёт при прокрутке. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d14-glowwrap', { opacity: 0, duration: 1.4, ease: 'power2.out' })
    .from('.d14-catwrap', { y: -40, opacity: 0, duration: 0.8, ease: 'bounce.out' }, 0.3)
    .from('.d14-glass', { y: -36, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, 0.7)
    .from('.d14-book', { y: 14, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.9)
    .from('.d14-bubble > g', { scale: 0.4, opacity: 0, transformOrigin: '20% 100%', duration: 0.6, ease: 'back.out(2.4)' }, 1.3);
  const far = document.querySelector('.d14-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.08})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { scale: 1.12, y: -18, rotation: i % 2 ? 4 : -4, opacity: 0, duration: 0.5, ease: 'back.out(1.8)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
