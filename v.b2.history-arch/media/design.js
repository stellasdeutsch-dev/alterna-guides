/* Раскоп: при прокрутке рейка отмечает глубину, а находки слегка выходят из стены. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const mark = document.querySelector('.kz-mark');
  const f = document.getElementById('kz-finds');
  let t = false;
  addEventListener('scroll', () => {
    if (t) return; t = true;
    requestAnimationFrame(() => {
      t = false;
      const y = Math.min(scrollY, 500);
      if (mark) mark.setAttribute('y', String(-200 + y * 0.36));
      if (f) f.setAttribute('transform', `translate(0 ${y * -0.04})`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, y: 18, rotation: -1, duration: 0.5, ease: 'power2.out', clearProps: 'opacity,transform' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
