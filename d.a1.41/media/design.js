/* İki deniz: купола и минареты поднимаются над площадью, карта Босфора разворачивается на парапете,
   билет ложится рядом; билеты-слова выдаются по одному, как из кассы. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const tl = gsap.timeline({ delay: 0.2 });
  tl.from('.d41-ayasofya', { y: 40, opacity: 0, duration: 1, ease: 'power2.out' })
    .from('.d41-sultanahmet', { y: 40, opacity: 0, duration: 1, ease: 'power2.out' }, 0.2);
  if (document.querySelector('.d41-map')) tl.from('.d41-map', { scaleY: 0.05, opacity: 0, svgOrigin: '660 208', duration: 0.8, ease: 'power3.out' }, 0.6);
  tl.from('.d41-ticket', { x: -60, opacity: 0, duration: 0.6, ease: 'back.out(1.6)' }, 1.1);
  const skyline = document.querySelectorAll('.d41-ayasofya, .d41-sultanahmet');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; const y = Math.min(scrollY, 400) * 0.07; skyline.forEach((g) => g.setAttribute('transform', `translate(0 ${y})`)); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { x: -26, opacity: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
