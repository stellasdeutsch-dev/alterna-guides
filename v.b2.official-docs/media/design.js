/* Mühür: при прокрутке бумаги на столе расползаются. Карточки-досье ложатся стопкой по очереди. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const l = document.querySelector('.md-photos');
  const p = document.querySelector('.md-paper');
  let tick = false;
  if (innerWidth >= 768) addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 500);
      if (l) l.setAttribute('transform', `translate(${12 - y * 0.05} ${452 + y * 0.06}) rotate(${-5 - y * 0.012})`);
      if (p) p.setAttribute('transform', `translate(86 ${92 - y * 0.05}) rotate(${4 + y * 0.008})`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { x: -14, opacity: 0, duration: 0.36, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
