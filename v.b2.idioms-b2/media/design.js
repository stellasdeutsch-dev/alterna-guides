/* Kilim: ковёр растёт при прокрутке: готовая часть ткани поднимается к основе. Куски ковра появляются ряд за рядом. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const woven = document.querySelector('.sc-woven');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (woven) woven.setAttribute('transform', `translate(0 ${Math.min(scrollY, 400) * -0.06})`); });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.fromTo(e.target, { clipPath: 'inset(100% 0 -20px 0)' }, { clipPath: 'inset(0% 0 -20px 0)', duration: 0.5, ease: 'steps(8)', clearProps: 'clipPath' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
