/* Dosya: красная нить от кнопки к кнопке идёт позади записок и пересчитывается при любом изменении сетки. */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const draw = (box) => {
    let svg = box.querySelector(':scope > .ds-string');
    if (!svg) {
      svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('class', 'ds-string');
      svg.setAttribute('aria-hidden', 'true');
      svg.append(document.createElementNS(NS, 'path'));
      box.prepend(svg);
    }
    const o = box.getBoundingClientRect();
    if (!o.width) return;
    svg.setAttribute('viewBox', `0 0 ${o.width} ${o.height}`);
    const pts = [...box.querySelectorAll('.lx-card')].filter((c) => c.offsetParent).map((c) => {
      const r = c.getBoundingClientRect();
      const s = getComputedStyle(c).getPropertyValue('--px').trim() || '50%';
      return [r.left - o.left + r.width * (parseFloat(s) / 100), r.top - o.top + 10];
    });
    const d = pts.map(([x, y], i) => {
      if (!i) return `M${x} ${y}`;
      const [a, b] = pts[i - 1];
      return `Q${(a + x) / 2} ${Math.max(b, y) + 14} ${x} ${y}`;
    }).join('');
    svg.firstChild.setAttribute('d', d);
  };
  const all = () => document.querySelectorAll('.lx-cards').forEach(draw);
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(all);
    document.querySelectorAll('.lx-cards').forEach((b) => ro.observe(b));
  }
  addEventListener('resize', all, { passive: true });
  addEventListener('load', all);
  all();
})();
