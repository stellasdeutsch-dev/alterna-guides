/* Sarmal: двойная спираль на canvas вращается и поворачивается от прокрутки; у каждой карточки своя последовательность из букв слова. */
(() => {
  const BASES = ['#2e9e5b', '#e5484d', '#e0a100', '#2f6fde'], L = 'ATGC';
  document.querySelectorAll('.lx-card').forEach((card) => {
    const word = card.querySelector('.lx-card__tr')?.textContent || '';
    let h = 7, s = '';
    for (let i = 0; i < 26; i++) { h = (h * 31 + word.charCodeAt(i % Math.max(1, word.length)) + i) % 9973; s += L[h % 4]; }
    const strip = document.createElement('span');
    strip.className = 'gx-seq'; strip.setAttribute('aria-hidden', 'true'); strip.dataset.ui = '';
    strip.innerHTML = [...s].map((c) => `<i data-b="${c}">${c}</i>`).join('');
    card.prepend(strip);
  });
  const c = document.querySelector('.gx-helix');
  const ctx = c && c.getContext('2d');
  if (!ctx) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, dpr = 1;
  const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; };
  const draw = (t) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const amp = Math.min(H * 0.34, 58), mid = H * 0.5, k = 2 * Math.PI / Math.max(230, Math.min(W * 0.42, 300)), ph = t / 2400 + scrollY / 170, tilt = H * 0.1 / Math.max(W, 1);
    const items = [], step = 16;
    for (let x = -30; x < W + 30; x += step) {
      const a = k * x + ph, ya = Math.sin(a), yb = -ya, za = Math.cos(a);
      items.push({ z: 0, x, ya: mid + ya * amp + (x - W / 2) * tilt, yb: mid + yb * amp + (x - W / 2) * tilt, za, i: Math.abs(Math.round(x / step)) % 4 });
    }
    for (const r of items) {
      ctx.globalAlpha = 0.45 + 0.4 * Math.abs(r.za);
      ctx.lineWidth = 3.4; ctx.lineCap = 'round';
      const my = (r.ya + r.yb) / 2;
      ctx.strokeStyle = BASES[r.i]; ctx.beginPath(); ctx.moveTo(r.x, r.ya); ctx.lineTo(r.x, my); ctx.stroke();
      ctx.strokeStyle = BASES[(r.i + 1) % 4 === 0 ? 1 : 3 - r.i]; ctx.beginPath(); ctx.moveTo(r.x, my); ctx.lineTo(r.x, r.yb); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    const strand = (key, zs, col, front) => {
      for (let n = 1; n < items.length; n++) {
        const p = items[n - 1], q = items[n], zz = zs * q.za;
        if ((zz >= 0) !== front) continue;
        ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineWidth = front ? 9.5 : 6.5; ctx.globalAlpha = front ? 1 : 0.55;
        ctx.beginPath(); ctx.moveTo(p.x, p[key]); ctx.lineTo(q.x, q[key]); ctx.stroke();
      }
    };
    strand('ya', 1, '#b0125f', false); strand('yb', -1, '#00796b', false);
    strand('ya', 1, '#b0125f', true); strand('yb', -1, '#00796b', true);
    ctx.globalAlpha = 1;
  };
  size();
  addEventListener('resize', () => { size(); draw(0); });
  draw(0);
  if (still) { addEventListener('scroll', () => draw(0), { passive: true }); return; }
  let last = 0;
  const loop = (t) => { requestAnimationFrame(loop); if (document.hidden || scrollY > H + 900 || t - last < 33) return; last = t; draw(t); };
  requestAnimationFrame(loop);
})();
