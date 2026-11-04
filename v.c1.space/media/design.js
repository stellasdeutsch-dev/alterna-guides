/* Akdağ: звёзды старинной карты, тушью на бумаге, на canvas за всей страницей. Они чуть мерцают и смещаются при прокрутке. */
(() => {
  const c = document.createElement('canvas');
  c.className = 'ak-sky';
  c.setAttribute('aria-hidden', 'true');
  document.body.prepend(c);
  const ctx = c.getContext('2d');
  if (!ctx) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [], W = 0, H = 0, dpr = 1;
  const COLORS = ['#27357e', '#27357e', '#5a4a2a', '#a84a1f'];
  const seed = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    const n = Math.round(Math.min(150, (W * H) / 8000));
    stars = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H * 1.4, r: Math.random() ** 3 * 2.2 + 0.5, p: Math.random() * 6.28, s: 0.4 + Math.random() * 1.4, d: 0.03 + Math.random() * 0.1, col: COLORS[Math.floor(Math.random() * 4)], cross: Math.random() < 0.14 }));
  };
  const draw = (t) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const sc = scrollY;
    for (const s of stars) {
      const y = ((s.y - sc * s.d) % (H * 1.4) + H * 1.4) % (H * 1.4);
      if (y > H) continue;
      ctx.globalAlpha = still ? 0.5 : 0.3 + 0.35 * Math.abs(Math.sin(t / 1000 * s.s + s.p));
      ctx.fillStyle = s.col;
      ctx.strokeStyle = s.col;
      if (s.cross) {
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(s.x - 5, y); ctx.lineTo(s.x + 5, y); ctx.moveTo(s.x, y - 5); ctx.lineTo(s.x, y + 5); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(s.x, y, s.r, 0, 6.28); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  };
  seed();
  addEventListener('resize', () => { seed(); draw(0); });
  if (still) { draw(0); addEventListener('scroll', () => draw(0), { passive: true }); return; }
  const loop = (t) => { if (!document.hidden) draw(t); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
})();
