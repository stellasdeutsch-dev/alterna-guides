/* Filiz: росток в сцене растёт с прокруткой, а по краям страницы вверх ползут два стебля с листьями. */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const make = (side) => {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('class', `fl-vine fl-vine--${side}`);
    s.setAttribute('viewBox', '0 0 64 800');
    s.setAttribute('preserveAspectRatio', 'none');
    s.setAttribute('aria-hidden', 'true');
    const d = 'M10 800C4 720 22 680 12 610C4 550 20 500 10 430C4 370 22 320 12 250C6 190 18 130 10 0';
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#3d9a3a'); p.setAttribute('stroke-width', '4'); p.setAttribute('vector-effect', 'non-scaling-stroke'); p.setAttribute('pathLength', '100'); p.setAttribute('stroke-dasharray', '100 100'); p.setAttribute('stroke-linecap', 'round');
    s.append(p);
    const leaves = [[12, 690], [16, 560], [11, 455], [14, 340], [12, 225], [12, 110]].map(([x, y], i) => {
      const l = document.createElementNS(NS, 'path');
      l.setAttribute('d', `M${x} ${y}c12 -14 28 -16 42 -10c-10 14 -28 20 -42 10z`);
      l.setAttribute('fill', i % 2 ? '#3d9a3a' : '#5cb044');
      l.style.transformBox = 'fill-box'; l.style.transformOrigin = '0 100%'; l.style.transition = 'transform .4s ease-out, opacity .3s';
      s.append(l);
      return { l, at: (800 - y) / 800 };
    });
    document.body.append(s);
    return { p, leaves };
  };
  const vines = [make('l'), make('r')];
  const sprout = document.querySelector('.fl-sprout');
  const paint = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const prog = Math.min(1, scrollY / max);
    const shown = still ? 1 : Math.max(0.06, prog * 1.05);
    vines.forEach((v, k) => {
      const q = k ? shown * 0.92 : shown;
      v.p.setAttribute('stroke-dasharray', `${q * 100} 100`);
      v.leaves.forEach(({ l, at }) => { const on = q >= at; l.style.opacity = on ? 1 : 0; l.style.transform = on ? 'scale(1)' : 'scale(.2)'; });
    });
    if (sprout && !still) sprout.style.transform = `scale(${(0.84 + Math.min(scrollY, 420) / 420 * 0.3).toFixed(3)})`;
  };
  let tick = false;
  addEventListener('scroll', () => { if (tick) return; tick = true; requestAnimationFrame(() => { tick = false; paint(); }); }, { passive: true });
  addEventListener('resize', paint);
  paint();
})();
