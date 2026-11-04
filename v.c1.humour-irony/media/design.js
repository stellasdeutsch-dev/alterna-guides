/* Sivri Dil: человек с газетой поднимается при прокрутке, карточки покачиваются при появлении. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const m = document.querySelector('.sv-man');
  let t = false;
  addEventListener('scroll', () => { if (t) return; t = true; requestAnimationFrame(() => { t = false; if (m) m.setAttribute('transform', `translate(0 ${Math.min(scrollY, 400) * .04})`); }); }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 14, opacity: 0, rotation: gsap.utils.random(-2.5, 2.5), duration: .42, ease: 'back.out(1.8)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
