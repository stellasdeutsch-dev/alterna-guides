/* Balat: дома поднимаются по склону один за другим, бельё развешивается; фасады-слова вырастают из цоколя, фразы — ступени. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d32-houses > g', { y: 60, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' })
    .from('.d32-laundry > g', { y: -24, opacity: 0, duration: 0.5, stagger: 0.07, ease: 'back.out(2)' }, 0.6)
    .from('.d32-cat', { x: -30, opacity: 0, duration: 0.6, ease: 'power2.out' }, 1);
  const far = document.querySelector('.d32-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.1})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 34, scaleY: 0.86, transformOrigin: '50% 100%', opacity: 0, duration: 0.55, ease: 'back.out(1.5)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
