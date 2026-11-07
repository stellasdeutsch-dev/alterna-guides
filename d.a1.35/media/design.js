/* Rüzgâr: солнце выходит, мост проступает из дымки, туча с дождиком наползает слева; плитки прогноза
   опускаются, как капли. Облака немного смещаются при прокрутке. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d35-sun', { y: 60, opacity: 0, duration: 1.4, ease: 'power2.out' })
    .from('.d35-bridge', { opacity: 0, y: 14, duration: 1, ease: 'power2.out' }, 0.2)
    .from('.d35-far', { opacity: 0, duration: 1, ease: 'power1.out' }, 0.1)
    .from('.d35-rainbox', { x: -160, opacity: 0, duration: 1.2, ease: 'power3.out' }, 0.5);
  const sky = document.querySelector('.d35-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (sky) sky.setAttribute('transform', `translate(0 ${Math.min(scrollY, 400) * 0.05})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: -22, scale: 0.97, opacity: 0, duration: 0.55, ease: 'power2.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i, .lx-msg').forEach((c) => io.observe(c));
})();
