/* Balkon: прокрутка это порыв ветра, бельё качается сильнее и успокаивается. Карточки слегка раскачиваются при появлении. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const scene = document.querySelector('.lx-scene');
  let g = 0, last = scrollY, on = false;
  const decay = () => {
    g *= 0.92;
    if (scene) scene.style.setProperty('--gust', `${g.toFixed(2)}deg`);
    if (Math.abs(g) > 0.05) requestAnimationFrame(decay); else { on = false; if (scene) scene.style.setProperty('--gust', '0deg'); }
  };
  addEventListener('scroll', () => {
    if (scrollY > 900) { last = scrollY; return; }
    g = Math.max(-11, Math.min(11, g + (scrollY - last) * 0.04));
    last = scrollY;
    if (!on) { on = true; requestAnimationFrame(decay); }
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { rotation: e.target.dataset.g === '1' ? 2.2 : -2.2, transformOrigin: '50% 0%', opacity: 0, duration: 0.7, ease: 'elastic.out(1, .5)', clearProps: 'all' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
