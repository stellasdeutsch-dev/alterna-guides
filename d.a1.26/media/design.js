/* Pazar: тенты раскрываются, фрукты насыпаются горкой, ценники втыкаются в товар; слова-ценники
   выскакивают снизу, как будто их втыкают в прилавок, строки списка дописываются по одной. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const tl = gsap.timeline({ delay: 0.15 });
  tl.from('.d26-stall', { y: -30, opacity: 0, duration: 0.7, stagger: 0.18, ease: 'power3.out' })
    .from('.d26-stall use', { y: -40, opacity: 0, duration: 0.45, stagger: 0.025, ease: 'bounce.out' }, 0.4)
    .from('.d26-tag', { y: '+=50', opacity: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(2.4)' }, 1.1)
    .from('.d26-sign', { scale: 0.6, opacity: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(2)' }, 1.4);
  const back = document.querySelector('.d26-back');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (back) back.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.07})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    const card = e.target.classList.contains('lx-card');
    gsap.from(e.target, card
      ? { y: 40, opacity: 0, duration: 0.55, ease: 'back.out(2.2)', delay: (i % 3) * 0.06, clearProps: 'transform,opacity' }
      : { opacity: 0, x: 18, duration: 0.4, ease: 'power2.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
