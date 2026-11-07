/* Balıkçı: лодка подплывает к причалу, на гриле появляется рыба, флажки взлетают, сэндвич и стакан турши
   ставят на столик; пакеты-слова «протягивают» по одному, мечеть и мост отстают при прокрутке. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d17-boatwrap', { x: 160, opacity: 0, duration: 1.4, ease: 'power3.out' })
    .from('.d17-flags', { y: -14, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, 0.9)
    .from('.d17-cup', { y: -40, opacity: 0, duration: 0.6, ease: 'bounce.out' }, 0.7)
    .from('.d17-sand', { x: 40, opacity: 0, duration: 0.6, ease: 'power3.out' }, 1);
  const far = document.querySelector('.d17-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.1})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 30, x: i % 2 ? 14 : -14, rotation: i % 2 ? 3 : -3, opacity: 0, duration: 0.55, ease: 'back.out(1.6)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
