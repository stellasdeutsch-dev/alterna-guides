/* Laboratuvar: при прокрутке чашка поворачивается под микроскопом, пробы появляются по одной, как будто их выставляют на стол */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const r = document.querySelector('.lb-rack');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 500);
      if (r) r.setAttribute('transform', `translate(0 ${-Math.sin(y / 40) * 3})`);
    });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { scale: .3, duration: 0.5, ease: 'back.out(1.6)', clearProps: 'transform' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card .lx-ico').forEach((c) => io.observe(c));
})();
