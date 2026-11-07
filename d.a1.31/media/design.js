/* Aile: рамки проявляются на стене, полароиды по одному цепляются к верёвке, чай ставят на стол;
   слова-полароиды падают сверху и чуть поворачиваются, как будто их прикалывают прищепкой. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d31-frames > g', { opacity: 0, scale: 0.9, transformOrigin: '50% 50%', duration: 0.6, stagger: 0.12, ease: 'power2.out' })
    .from('.d31-line > g', { y: -90, opacity: 0, duration: 0.7, stagger: 0.14, ease: 'back.out(1.8)' }, 0.3)
    .from('.d31-album', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.6)
    .from('.d31-tea', { y: -50, opacity: 0, duration: 0.6, ease: 'bounce.out' }, 0.9);
  const frames = document.querySelector('.d31-frames');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (frames) frames.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.08})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: -36, rotation: i % 2 ? 6 : -6, transformOrigin: '50% 0', opacity: 0, duration: 0.7, ease: 'back.out(1.6)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
