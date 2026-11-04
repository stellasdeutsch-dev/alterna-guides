/* Nabız: пульс на мониторе чуть плавает, вид за окном едет за прокруткой, строки рецепта появляются по одной. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hr = document.querySelector('.sc-hr');
  const far = document.querySelector('.sc-far');
  const vals = [72, 73, 72, 71, 72, 74, 73, 72];
  let i = 0;
  if (hr) setInterval(() => { if (!document.hidden) hr.textContent = vals[i++ % vals.length]; }, 1600);
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${Math.min(scrollY, 500) * 0.05})`); });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 10, opacity: 0, duration: 0.35, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card, .lx-group').forEach((c) => io.observe(c));
})();
