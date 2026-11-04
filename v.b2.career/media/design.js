/* Настолка: при прокрутке карточки ложатся на стол, словно их раздают. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, y: 24, rotation: 2.5, duration: 0.45, ease: 'back.out(1.6)', clearProps: 'opacity,transform' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
  const pa = document.querySelector('.ks-stack');
  let t = false;
  addEventListener('scroll', () => {
    if (t) return; t = true;
    requestAnimationFrame(() => {
      t = false;
      if (pa) pa.style.opacity = String(Math.max(0.35, 1 - scrollY / 900));
    });
  }, { passive: true });
})();
