/* Ebru: настоящая математика мраморирования. Капля раздвигает всё, что уже плавает на воде, шило протягивает линии.
   Узор живёт на холсте шапки, а его снимок идёт на обрезы карточек и вкладки. */
(() => {
  const cv = document.querySelector('.eb-water');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const INK = ['#7f9bd8', '#ea7f73', '#f1c86b', '#63c2ba', '#f5ecd7', '#bb94c8', '#f3dfbb', '#a3bfe8'];
  let seed = 41;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  let drops = [];
  const circle = (cx, cy, r, n = 120) => { const a = new Float32Array(n * 2); for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; a[i * 2] = cx + Math.cos(t) * r; a[i * 2 + 1] = cy + Math.sin(t) * r; } return a; };
  const push = (a, cx, cy, r) => { const r2 = r * r; for (let i = 0; i < a.length; i += 2) { const dx = a[i] - cx, dy = a[i + 1] - cy, d = dx * dx + dy * dy || 1e-3, k = Math.sqrt(1 + r2 / d); a[i] = cx + dx * k; a[i + 1] = cy + dy * k; } };
  const drop = (cx, cy, r, color) => { for (const d of drops) push(d.p, cx, cy, r); drops.push({ p: circle(cx, cy, r, r > 60 ? 240 : 120), c: color }); if (drops.length > 260) drops.shift(); };
  const tine = (x, z, c) => { const u = Math.pow(0.5, 1 / c); for (const d of drops) { const p = d.p; for (let i = 0; i < p.length; i += 2) p[i + 1] += z * Math.pow(u, Math.abs(p[i] - x)); } };
  const tineH = (y, z, c) => { const u = Math.pow(0.5, 1 / c); for (const d of drops) { const p = d.p; for (let i = 0; i < p.length; i += 2) p[i] += z * Math.pow(u, Math.abs(p[i + 1] - y)); } };
  const paint = (extra) => {
    ctx.fillStyle = '#efe3c8'; ctx.fillRect(0, 0, W, H);
    for (const d of drops) {
      const a = d.p; ctx.beginPath(); ctx.moveTo(a[0], a[1]);
      for (let i = 2; i < a.length; i += 2) ctx.lineTo(a[i], a[i + 1]);
      ctx.closePath(); ctx.fillStyle = d.c; ctx.fill();
    }
    if (extra) { ctx.beginPath(); ctx.arc(extra.x, extra.y, extra.r, 0, Math.PI * 2); ctx.fillStyle = extra.c; ctx.fill(); }
  };
  /* заготовка: батталь, потом гель-гит, потом хатип с концентрическими каплями */
  for (let i = 0; i < 70; i++) drop(rnd() * W, rnd() * H, 26 + rnd() * 46, INK[Math.floor(rnd() * INK.length)]);
  for (let x = 40; x < W; x += 74) tine(x, x % 148 < 74 ? 70 : -70, 12);
  for (let y = 40; y < H; y += 92) tineH(y, y % 184 < 92 ? 44 : -44, 10);
  [[430, 280], [700, 330], [860, 190], [560, 120], [300, 170], [130, 300], [860, 440]].forEach(([x, y], k) => {
    [[58, INK[(k + 1) % 4]], [40, '#f5ecd7'], [28, INK[(k + 2) % 4]], [15, '#f5ecd7'], [8, '#ea7f73']].forEach(([r, c]) => drop(x, y, r, c));
  });
  tine(430, 54, 26); tine(700, -48, 24); tineH(280, 22, 30);
  for (let i = 0; i < 90; i++) drop(rnd() * W, rnd() * H, 2.5 + rnd() * 7, INK[Math.floor(rnd() * 6)]);
  paint();
  const root = document.querySelector('.lx[data-design="ebru"]') || document.body;
  try { root.style.setProperty('--eb-tex', `url(${cv.toDataURL('image/jpeg', .82)})`); root.classList.add('eb-ready'); } catch (e) { /* без снимка остаётся заливка из css */ }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* кисть ходит над водой и роняет новые капли */
  const brush = document.querySelector('.eb-brush');
  const ring = document.querySelector('.eb-ring');
  const spots = [[520, 300], [640, 230], [760, 340], [590, 400], [700, 150], [470, 200], [830, 280], [650, 420]];
  let k = 0, busy = false;
  const COLORS = ['#ea7f73', '#7f9bd8', '#f1c86b', '#63c2ba', '#f5ecd7'];
  const move = (x, y) => { if (brush) brush.style.transform = `translate(${x}px, ${y}px)`; };
  move(spots[0][0], spots[0][1]);
  const animateDrop = (x, y, r, c) => {
    busy = true;
    const orig = drops.map((d) => d.p.slice());
    const t0 = performance.now(), dur = 1500;
    const step = (now) => {
      const t = Math.max(0, Math.min(1, (now - t0) / dur)), e = 1 - Math.pow(1 - t, 3), cr = Math.max(.1, r * e);
      drops.forEach((d, i) => { d.p.set(orig[i]); push(d.p, x, y, cr); });
      paint({ x, y, r: cr, c });
      if (t < 1) requestAnimationFrame(step);
      else { drops.forEach((d, i) => { d.p.set(orig[i]); }); drop(x, y, r, c); paint(); busy = false; }
    };
    requestAnimationFrame(step);
  };
  const seen = () => { const b = cv.getBoundingClientRect(); return b.bottom > 0 && b.top < innerHeight && !document.hidden; };
  setInterval(() => {
    if (busy || !seen()) return;
    k = (k + 1) % spots.length;
    const [x, y] = spots[k];
    const c = COLORS[k % COLORS.length];
    move(x, y);
    const dr = document.querySelector('.eb-drip'); if (dr) dr.setAttribute('fill', c === '#f5ecd7' ? '#a8312a' : c);
    setTimeout(() => {
      if (ring) { ring.style.transform = `translate(${x}px, ${y}px)`; ring.classList.remove('is-on'); void ring.getBoundingClientRect(); ring.classList.add('is-on'); }
      animateDrop(x, y, 26 + (k % 3) * 12, c);
    }, 900);
  }, 4200);
})();
