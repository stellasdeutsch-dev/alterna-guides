/* Kırmızı iplik: одна красная нить идёт от первого экрана через все карточки открытой вкладки. Пересчитывается при любой смене высоты страницы, тянется вслед за прокруткой. */
(() => {
  const main = document.querySelector('main');
  if (!main) return;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'ip-thread');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', '#d3122f');
  path.setAttribute('stroke-width', '2.4');
  path.setAttribute('stroke-linecap', 'round');
  svg.append(path);
  main.prepend(svg);
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let len = 0, raf = 0, mainTop = 0;

  const seen = (el) => el && el.offsetParent !== null;
  const rel = (el) => { const r = el.getBoundingClientRect(), m = main.getBoundingClientRect(); return { l: r.left - m.left, t: r.top - m.top, r: r.right - m.left, b: r.bottom - m.top, w: r.width, h: r.height }; };

  const points = () => {
    const pts = [];
    const m = main.getBoundingClientRect();
    const panel = main.querySelector('.lx-panel.is-active') || main.querySelector('.lx-panel');
    const hero = main.querySelector('.lx-hero');
    if (hero) { const h = rel(hero); pts.push([m.width * .5, h.b - 8]); }
    if (!panel) return pts;
    const cards = [...panel.querySelectorAll('.lx-card')].filter(seen);
    if (cards.length) {
      // ряды змейкой, чтобы нить не летела назад через всю страницу
      const rows = [];
      for (const c of cards) {
        const r = rel(c), row = rows.find((x) => Math.abs(x.t - r.t) < 40);
        if (row) row.items.push(r); else rows.push({ t: r.t, items: [r] });
      }
      rows.sort((a, b) => a.t - b.t);
      rows.forEach((row, i) => {
        row.items.sort((a, b) => a.l - b.l);
        if (i % 2) row.items.reverse();
        for (const r of row.items) pts.push([r.l + 26, r.t + 0]);
      });
      return pts;
    }
    // остальные вкладки: нить идёт по полю, петляя у блоков
    const blocks = [...panel.querySelectorAll('.lx-ph, .lx-story, .lx-dlg.is-on, a-exercise, a-quiz, .lx-table, .lx-foot')].filter(seen);
    const edge = Math.max(5, rel(panel).l - Math.min(40, (m.width - rel(panel).w) / 2 - 4));
    blocks.forEach((el, i) => { const r = rel(el); pts.push([i % 2 ? Math.min(m.width - 5, r.r + 7) : Math.max(edge, r.l - 7), r.t + r.h * .5]); });
    return pts;
  };

  const draw = () => {
    raf = 0;
    const W = main.scrollWidth, H = main.scrollHeight;
    svg.setAttribute('width', W); svg.setAttribute('height', H);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const p = points();
    if (p.length < 2) { path.removeAttribute('d'); return; }
    let d = `M${p[0][0]} ${p[0][1]}`;
    for (let i = 1; i < p.length; i++) {
      const [ax, ay] = p[i - 1], [bx, by] = p[i];
      const dy = by - ay, dx = bx - ax;
      if (Math.abs(dy) < 40 && Math.abs(dx) > 60) { d += ` C${(ax + dx * .3).toFixed(1)} ${(ay - 30).toFixed(1)} ${(bx - dx * .3).toFixed(1)} ${(by - 30).toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`; continue; }
      const sag = Math.min(46, 14 + Math.abs(dx) * .1);
      d += ` C${ax.toFixed(1)} ${(ay + Math.max(dy * .5, sag)).toFixed(1)} ${bx.toFixed(1)} ${(by - Math.max(dy * .5, sag)).toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
    }
    path.setAttribute('d', d);
    len = path.getTotalLength();
    pull();
  };

  const pull = () => {
    if (still || !len) { path.removeAttribute('stroke-dasharray'); return; }
    mainTop = main.getBoundingClientRect().top;
    const box = path.getBBox();
    const reach = innerHeight * .92 - mainTop - box.y;
    const q = Math.max(.02, Math.min(1, reach / Math.max(1, box.height)));
    path.setAttribute('stroke-dasharray', q >= 1 ? 'none' : `${(q * len).toFixed(0)} ${len.toFixed(0)}`);
  };

  const soon = () => { if (!raf) raf = requestAnimationFrame(draw); };
  new ResizeObserver(soon).observe(main);
  addEventListener('resize', soon);
  addEventListener('load', soon);
  document.addEventListener('click', () => { soon(); setTimeout(soon, 120); setTimeout(soon, 500); });
  let t = 0;
  if (!still) addEventListener('scroll', () => { if (!t) t = requestAnimationFrame(() => { t = 0; pull(); }); }, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(soon);
  soon();
})();
