/* Anahtar: дом проступает, герань на балконах распускается, связка ключей опускается на шнурке и звякает;
   бирки-слова повисают на кольце, качнувшись от левого верхнего угла. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d05-house', { y: 24, opacity: 0, duration: 0.8, ease: 'power2.out' })
    .from('.d05-balcony use', { scale: 0, transformOrigin: '50% 100%', duration: 0.5, stagger: 0.12, ease: 'back.out(2.4)' }, 0.5)
    .from('.d05-laundry', { opacity: 0, y: -10, duration: 0.5 }, 0.7)
    .from('.d05-keys', { y: -170, duration: 1.1, ease: 'bounce.out' }, 0.3);
  const h1 = document.querySelector('.lx-hero h1');
  if (h1) gsap.from(h1, { y: 20, rotation: -2, opacity: 0, duration: 0.7, delay: 0.5, ease: 'back.out(1.8)', clearProps: 'transform,opacity' });
  const tree = document.querySelector('.d05-tree');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (tree) tree.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.06})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.fromTo(e.target, { rotation: -9, opacity: 0, transformOrigin: '0 0' }, { rotation: 0, opacity: 1, duration: 0.9, ease: 'elastic.out(1, 0.5)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
