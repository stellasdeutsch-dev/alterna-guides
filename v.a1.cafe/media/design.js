/* Lokanta: сцена едет за прокруткой, позиции меню «подаются» по одной. Без анимаций всё и так на месте. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const far = document.querySelector('.sc-far');
  const near = document.querySelector('.sc-near');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 520);
      if (far) far.setAttribute('transform', `translate(0 ${y * 0.1})`);
      if (near) near.setAttribute('transform', `translate(0 ${y * -0.05})`);
    });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 12, opacity: 0, duration: 0.42, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .lx-group').forEach((c) => io.observe(c));
})();
