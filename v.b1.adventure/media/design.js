/* Macera: полы палатки распахиваются при прокрутке, стрелка компаса поворачивается вслед за страницей. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const fl = document.querySelector('.mc-fl');
  const fr = document.querySelector('.mc-fr');
  const nd = document.querySelector('.mc-needle');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 500);
      if (fl) fl.style.translate = `${-y * .14}px 0`;
      if (fr) fr.style.translate = `${y * .14}px 0`;
      if (nd) nd.style.rotate = `${y * .36}deg`;
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 14, rotate: -1.5, opacity: 0, duration: .4, ease: 'power2.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
