/* Saat: табло «KALKIŞ» досчитывает время до 07:40, будильник падает на настил, табло выезжает; карточки времени
   поворачиваются, как стрелка, и встают на место. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const now = document.querySelector('.d09-now');
  const tl = gsap.timeline({ delay: 0.15 });
  tl.from('.d09-sun', { y: 60, opacity: 0, duration: 1.4, ease: 'power2.out' })
    .from('.d09-board', { y: 40, opacity: 0, duration: 0.7, ease: 'back.out(1.8)' }, 0.3)
    .from('.d09-clock', { y: -120, duration: 0.9, ease: 'bounce.out' }, 0.5);
  if (now) {
    const o = { m: 0 };
    tl.to(o, { m: 40, duration: 1.4, ease: 'power1.out', onUpdate: () => { now.textContent = `07:${String(Math.round(o.m)).padStart(2, '0')}`; } }, 0.4);
  }
  const far = document.querySelector('.d09-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.08})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { rotation: i % 2 ? 4 : -4, y: 24, opacity: 0, transformOrigin: '0% 100%', duration: 0.55, ease: 'power3.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
