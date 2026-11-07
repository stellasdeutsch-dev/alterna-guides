/* Tostçu: доска меню заполняется строка за строкой, чашку ставят на стойку, пресс закрывается; строки-слова
   выписываются на доску по одной, доска и банки чуть отстают при прокрутке. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d15-row', { x: -14, opacity: 0, duration: 0.45, stagger: 0.18, ease: 'power2.out' })
    .from('.d15-cupwrap', { x: 90, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.2)
    .from('.d15-lidwrap', { y: -26, opacity: 0, duration: 0.6, ease: 'bounce.out' }, 0.5)
    .from('.d15-plate', { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, 0.9)
    .from('.d15-jar', { y: -12, opacity: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }, 0.3);
  const far = document.querySelector('.d15-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.07})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { x: -24, opacity: 0, duration: 0.45, delay: (i % 4) * 0.05, ease: 'power2.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
