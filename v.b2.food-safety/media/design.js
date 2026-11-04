/* Etiket: градусник витрины чуть плавает, лупа инспектора идёт за прокруткой и осматривает полку. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const t = document.querySelector('.sc-temp');
  const vals = ['+4 °C', '+4 °C', '+3 °C', '+4 °C', '+5 °C'];
  let i = 0;
  if (t) setInterval(() => { if (!document.hidden) t.textContent = vals[i++ % vals.length]; }, 2400);
  const lens = document.querySelector('.sc-lens');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (lens) lens.setAttribute('transform', `rotate(${Math.min(scrollY, 420) * -0.04} 462 424)`); });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { scale: 0.97, opacity: 0, duration: 0.3, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
