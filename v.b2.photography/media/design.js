/* Светлый стол: при прокрутке лист чуть съезжает, а плёнка и объектив двигаются быстрее него. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const film = document.querySelector('.kt-film');
  const lens = document.querySelector('.kt-lens');
  let t = false;
  addEventListener('scroll', () => {
    if (t) return; t = true;
    requestAnimationFrame(() => {
      t = false;
      const y = Math.min(scrollY, 600);
      if (film) film.setAttribute('transform', `translate(${y * 0.05} ${y * -0.1})`);
      if (lens) lens.setAttribute('transform', `translate(${190 + y * 0.08} ${610 - y * 0.12}) rotate(${y * 0.12})`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.fromTo(e.target, { opacity: 0.25, filter: 'brightness(1.5)' }, { opacity: 1, filter: 'brightness(1)', duration: 0.7, ease: 'power1.out', clearProps: 'opacity,filter' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
