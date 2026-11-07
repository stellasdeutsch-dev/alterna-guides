/* Pansiyon: звонок на стойке звенит, карточка Wi‑Fi поднимается, полотенца ложатся стопкой, солнце опускается к морю;
   таблички-«хэнгеры» со словами покачиваются, когда их вешают на ручку. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const tl = gsap.timeline({ delay: 0.2 });
  tl.from('.d02-view', { opacity: 0, duration: 0.8, ease: 'power1.out' })
    .from('.d02-towels', { y: -50, opacity: 0, duration: 0.6, ease: 'bounce.out' }, 0.4)
    .from('.d02-wifi', { y: 40, opacity: 0, duration: 0.6, ease: 'back.out(1.8)' }, 0.7)
    .to('.d02-bell', { y: 3, scaleY: 0.92, transformOrigin: '50% 100%', duration: 0.1, yoyo: true, repeat: 3, ease: 'power1.inOut' }, 1.2)
    .from('.d02-roofs', { y: 14, duration: 1.2, ease: 'power2.out' }, 0);
  const view = document.querySelector('.d02-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (view) view.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.05})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.fromTo(e.target, { rotation: -6, y: -14, opacity: 0, transformOrigin: '50% 0' }, { rotation: 0, y: 0, opacity: 1, duration: 0.9, ease: 'elastic.out(1, 0.45)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
