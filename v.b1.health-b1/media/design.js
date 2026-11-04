/* Atlas: разворот тихо едет за прокруткой, таблицы раскрываются строка за строкой. Без анимаций всё на месте. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const far = document.querySelector('.at-far');
  const far2 = document.querySelector('.at-far2');
  const body = document.querySelector('.at-body');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 500);
      if (far) far.setAttribute('transform', `translate(0 ${y * 0.07})`);
      if (far2) far2.setAttribute('transform', `translate(0 ${y * 0.07})`);
      if (body) body.setAttribute('transform', `translate(0 ${y * -0.03})`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, y: 8, duration: 0.45, ease: 'power1.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card, .lx-group').forEach((c) => io.observe(c));
})();
