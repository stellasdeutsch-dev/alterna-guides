/* Toplantı: сосед по столу кивает сам (CSS), сцена чуть сдвигается за прокруткой, служебные записки ложатся по очереди. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const back = document.querySelector('.tp-back--w');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick || !back) return; tick = true;
    requestAnimationFrame(() => { tick = false; back.style.transform = `translateY(${Math.min(scrollY, 500) * 0.08}px)`; });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 14, rotation: -1.2, opacity: 0, duration: 0.4, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
