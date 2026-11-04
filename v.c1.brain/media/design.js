/* Levha: нейросеть на canvas за всей страницей. Узлы связаны с соседями, по связям бегут импульсы, при прокрутке их становится больше. */
(() => {
  const c = document.createElement('canvas');
  c.className = 'lv-net'; c.setAttribute('aria-hidden', 'true');
  document.body.prepend(c);
  const x = c.getContext('2d');
  if (!x) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, dpr = 1, nodes = [], edges = [], pulses = [], boost = 0, last = scrollY;
  const seed = () => {
    dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr;
    const n = Math.round(Math.min(70, (W * H) / 15000));
    nodes = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 1.6 + Math.random() * 2.6, p: Math.random() * 6.28 }));
    edges = [];
    nodes.forEach((a, i) => {
      nodes.map((b, j) => [j, (a.x - b.x) ** 2 + (a.y - b.y) ** 2]).filter(([j]) => j > i).sort((p, q) => p[1] - q[1]).slice(0, 2).forEach(([j]) => {
        const b = nodes[j], mx = (a.x + b.x) / 2 + (Math.random() - .5) * 50, my = (a.y + b.y) / 2 + (Math.random() - .5) * 50;
        edges.push({ a, b, mx, my });
      });
    });
    pulses = [];
  };
  const pt = (e, t) => { const u = 1 - t; return [u * u * e.a.x + 2 * u * t * e.mx + t * t * e.b.x, u * u * e.a.y + 2 * u * t * e.my + t * t * e.b.y]; };
  const draw = (t) => {
    x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H);
    x.lineWidth = 1; x.strokeStyle = 'rgba(42,31,61,.17)';
    edges.forEach((e) => { x.beginPath(); x.moveTo(e.a.x, e.a.y); x.quadraticCurveTo(e.mx, e.my, e.b.x, e.b.y); x.stroke(); });
    nodes.forEach((n) => { x.fillStyle = 'rgba(42,31,61,.32)'; x.beginPath(); x.arc(n.x, n.y, n.r, 0, 6.28); x.fill(); });
    pulses.forEach((p) => {
      const [px, py] = pt(p.e, p.t);
      x.fillStyle = p.col; x.globalAlpha = .9; x.beginPath(); x.arc(px, py, 2.6, 0, 6.28); x.fill();
      x.globalAlpha = .18; x.beginPath(); x.arc(px, py, 8, 0, 6.28); x.fill(); x.globalAlpha = 1;
    });
  };
  const step = (t) => {
    if (!document.hidden) {
      if (edges.length && pulses.length < 10 + boost && Math.random() < .08 + boost * .02) pulses.push({ e: edges[Math.floor(Math.random() * edges.length)], t: 0, v: .006 + Math.random() * .01, col: Math.random() < .7 ? '#a1129a' : '#0b7d7a' });
      pulses.forEach((p) => { p.t += p.v * (1 + boost * .12); }); pulses = pulses.filter((p) => p.t < 1);
      boost *= .97; draw(t);
    }
    requestAnimationFrame(step);
  };
  seed(); addEventListener('resize', () => { seed(); draw(0); });
  if (still) { draw(0); return; }
  addEventListener('scroll', () => { boost = Math.min(20, boost + Math.abs(scrollY - last) / 40); last = scrollY; }, { passive: true });
  requestAnimationFrame(step);
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, duration: .5, ease: 'power1.out', clearProps: 'opacity' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((n) => io.observe(n));
})();
