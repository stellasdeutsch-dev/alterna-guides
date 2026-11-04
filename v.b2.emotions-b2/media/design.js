/* Sulu: второй слой краски проступает при прокрутке, пятна карточек медленно проявляются. Без анимаций всё уже нарисовано. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const late = document.querySelector('.sc-late');
  let tick = false;
  const upd = () => { tick = false; if (late) late.style.opacity = String(Math.min(1, 0.25 + scrollY / 380)); };
  addEventListener('scroll', () => { if (tick) return; tick = true; requestAnimationFrame(upd); }, { passive: true });
  upd();
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, duration: 0.7, ease: 'power1.out', clearProps: 'opacity' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card, .lx-group').forEach((c) => io.observe(c));
})();
