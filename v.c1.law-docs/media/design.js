/* Kanunname: при прокрутке лучи из окон сдвигаются, статьи проявляются спокойно, без подскоков. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const a = document.querySelector('.kn-b1'), b = document.querySelector('.kn-b2');
  let t = false;
  addEventListener('scroll', () => { if (t) return; t = true; requestAnimationFrame(() => { t = false; const y = Math.min(scrollY, 600);
    if (a) a.setAttribute('transform', `translate(${y * .05} 0)`); if (b) b.setAttribute('transform', `translate(${y * -.05} 0)`); }); }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, duration: .5, ease: 'power1.out', clearProps: 'opacity' });
  }), { rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.lx-card, .lx-story p').forEach((c) => io.observe(c));
})();
