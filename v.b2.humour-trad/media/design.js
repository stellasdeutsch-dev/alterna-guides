/* Perde: при прокрутке куклы наклоняются друг к другу, как будто мастер поворачивает палочки. Карточки подпрыгивают на своих палочках. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const k = document.querySelector('.sc-lean-k');
  const h = document.querySelector('.sc-lean-h');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const a = Math.min(scrollY, 420) * 0.022;
      if (k) k.setAttribute('transform', `rotate(${a} 170 600)`);
      if (h) h.setAttribute('transform', `rotate(${-a} 1110 600)`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 26, duration: 0.55, ease: 'back.out(2)', clearProps: 'transform' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
