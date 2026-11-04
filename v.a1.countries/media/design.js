/* Pasaport: на странице карточки меняется чернила штампа, глобус крутится в CSS. Карточки появляются как штамп: с лёгким ударом. */
(() => {
  document.querySelectorAll('.lx-card').forEach((c, i) => c.style.setProperty('--tilt', `${[-7, 5, -3, 8, -5, 3][i % 6]}deg`));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    const ico = e.target.querySelector('.lx-ico');
    if (ico) gsap.from(ico, { scale: 1.5, opacity: 0, duration: 0.3, ease: 'power3.in', clearProps: 'transform,opacity,scale' });
  }), { rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
