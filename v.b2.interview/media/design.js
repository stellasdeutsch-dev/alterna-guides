/* Görüşme: при прокрутке камера слегка наезжает на героев, карточки вопросов выкладываются по одной */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cam = document.querySelector('.gr-cam');
  const light = document.querySelector('.gr-light');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 500);
      if (cam) cam.setAttribute('transform', `translate(${y * 0.1} 0)`);
      if (light) light.setAttribute('transform', `translate(${y * -0.05} 0)`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 20, rotation: -2.5, opacity: 0, duration: 0.42, ease: 'back.out(1.5)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
