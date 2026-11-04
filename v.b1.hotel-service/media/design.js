/* Resepsiyon: стрелка лифта, ключи и звонок двигаются в CSS. При прокрутке стена чуть отстаёт от стойки, бирки подвешиваются по одной. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const back = document.querySelector('.rs-back');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick || !back) return; tick = true;
    requestAnimationFrame(() => { tick = false; back.style.transform = `translateY(${Math.min(scrollY, 500) * 0.12}px)`; });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: -14, rotation: -2, transformOrigin: '50% 0', opacity: 0, duration: 0.55, ease: 'elastic.out(1, .6)', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
