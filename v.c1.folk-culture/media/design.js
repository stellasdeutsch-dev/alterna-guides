/* Halay: хоровод идёт по кругу вокруг заголовка: у каждого танцора свой угол, ближние крупнее, руки считаются каждый кадр */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const scene = document.querySelector('.lx-scene');
  if (!scene) return;
  const svg = () => [...scene.querySelectorAll('svg')].find((s) => getComputedStyle(s).display !== 'none');
  let cur = null, parts = null;
  const bind = () => {
    cur = svg(); if (!cur) return;
    const ring = cur.querySelector('.hl-ring'), d = ring.dataset;
    const items = [...ring.querySelectorAll('.hl-d')].map((el, i) => ({ el, i }));
    parts = { ring, chain: cur.querySelector('.hl-chain'), items, n: items.length, cx: +d.cx, cy: +d.cy, a: +d.a, b: +d.b, s0: +d.s0, s1: +d.s1 };
  };
  bind();
  addEventListener('resize', bind);
  let inView = true;
  if ('IntersectionObserver' in window) new IntersectionObserver((e) => { inView = e[0].isIntersecting; }).observe(scene);
  let lastSort = 0, sy = 0;
  addEventListener('scroll', () => { sy = Math.min(1, scrollY / 500); scene.style.setProperty('--sy', sy.toFixed(3)); }, { passive: true });
  const frame = (t) => {
    requestAnimationFrame(frame);
    if (!inView || document.hidden || !parts) return;
    const p = parts, w = t / 1000 * (2 * Math.PI / 96);
    const pts = [];
    for (const it of p.items) {
      const th = it.i * 2 * Math.PI / p.n + .2 + w;
      const x = p.cx + p.a * Math.cos(th), s = Math.sin(th), y = p.cy + p.b * s, sc = p.s0 + (p.s1 - p.s0) * (s + 1) / 2;
      it.y = y;
      it.el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sc.toFixed(3)})`);
      pts.push([x, y - 96 * sc]);
    }
    let d = `M${pts[0][0].toFixed(0)} ${pts[0][1].toFixed(0)}`;
    for (let k = 1; k <= p.n; k++) {
      const a = pts[k - 1], b = pts[k % p.n];
      d += `Q${((a[0] + b[0]) / 2).toFixed(0)} ${((a[1] + b[1]) / 2 - 20).toFixed(0)} ${b[0].toFixed(0)} ${b[1].toFixed(0)}`;
    }
    p.chain.setAttribute('d', d);
    if (t - lastSort > 900) { lastSort = t; [...p.items].sort((a, b) => a.y - b.y).forEach((it) => p.ring.append(it.el)); }
  };
  requestAnimationFrame(frame);
})();
