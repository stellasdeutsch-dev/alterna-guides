/* Kare: раскадровка рисуется при загрузке, кадр за кадром. Карандаш идёт за прокруткой вдоль кадров, карточки слов появляются по очереди, как в истории. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const pencil = document.querySelector('.kr-pencil');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 500);
      if (pencil) pencil.style.translate = `${-y * .22}px ${y * .05}px`;
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { x: -14, opacity: 0, duration: .42, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
