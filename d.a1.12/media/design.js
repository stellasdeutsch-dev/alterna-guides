/* Bakkal: маркиза раскрывается, корзину с хлебом выносят к двери, велосипед подкатывает; ценники-слова
   повисают на нитке и покачиваются, прежде чем встать на полку. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d12-awning', { scaleY: 0.2, opacity: 0, transformOrigin: '50% 0%', duration: 0.8, ease: 'back.out(1.6)' })
    .from('.d12-shelf > *', { y: -16, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }, 0.3)
    .from('.d12-steam', { opacity: 0, duration: 0.8 }, 0.9);
  const upper = document.querySelector('.d12-upper');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (upper) upper.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.08})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: -30, rotation: i % 2 ? 6 : -6, transformOrigin: '50% 0%', opacity: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
