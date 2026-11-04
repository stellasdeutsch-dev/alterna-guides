/* Yeşilçam: прокрутка крутит катушки и катит тележку с камерой по рельсам в сторону героев. Кадры въезжают сверху, как плёнка. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cam = document.querySelector('.yc-cam');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 500);
      if (cam) cam.setAttribute('transform', `translate(${y * 0.22} 0)`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: -22, opacity: 0, duration: 0.36, ease: 'power2.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
