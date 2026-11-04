/* Gün boyu: каждой строке дневника своё время и цвет неба. Солнце, потом луна идут по краю экрана вместе с прокруткой. */
(() => {
  const evening = /lesson-2/.test(location.pathname);
  const start = evening ? 15 * 60 : 6 * 60;
  const stops = [[6, '#ff9a7b'], [9, '#ffc65c'], [12, '#58b7ea'], [15, '#2f9fd0'], [18, '#f2734f'], [20, '#a4438f'], [22, '#8f7fd9'], [24, '#6f66c9']];
  const mix = (m) => {
    const h = Math.min(24, Math.max(6, m / 60));
    for (let i = 0; i < stops.length - 1; i++) if (h <= stops[i + 1][0]) return stops[i][1];
    return stops[stops.length - 1][1];
  };
  document.querySelectorAll('.lx-card').forEach((c, i) => {
    const m = start + i * 30;
    c.dataset.h = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    c.style.setProperty('--sky', mix(m));
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const orb = document.createElement('div');
  orb.className = 'gb-orb'; orb.setAttribute('aria-hidden', 'true');
  document.body.append(orb);
  let tick = false;
  const move = () => {
    tick = false;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const t = Math.min(1, scrollY / max);
    const a = t * Math.PI;
    const x = -Math.sin(a) * Math.min(70, innerWidth * .1);
    const y = (1 - Math.cos(a)) / 2 * (innerHeight - 200) + 90;
    orb.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    orb.classList.toggle('is-moon', t > .72);
    orb.classList.toggle('is-on', scrollY > innerHeight * .8);
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(move); } }, { passive: true });
  move();
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { x: -14, opacity: 0, duration: .34, ease: 'power2.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
