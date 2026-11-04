/* Kabartma: под каждым словом настоящая турецкая запись по Брайлю, точками. Фон сцены чуть смещается при прокрутке. */
(() => {
  const MAP = { a: '1', b: '12', c: '14', ç: '16', d: '145', e: '15', f: '124', g: '1245', ğ: '126', h: '125', ı: '35', i: '24', j: '245', k: '13', l: '123', m: '134', n: '1345', o: '135', ö: '246', p: '1234', q: '12345', r: '1235', s: '234', ş: '146', t: '2345', u: '136', ü: '1256', v: '1236', w: '2456', x: '1346', y: '13456', z: '1356' };
  const NS = 'http://www.w3.org/2000/svg';
  const lower = (t) => t.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase();
  const braille = (text, cls, d = 4.6, r = 1.75, cw = 15) => {
    const chars = [...lower(text)];
    const svg = document.createElementNS(NS, 'svg');
    const w = Math.max(1, chars.length * cw);
    svg.setAttribute('viewBox', `0 0 ${w} ${d * 2 + r * 2 + 1}`);
    svg.setAttribute('class', cls);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('preserveAspectRatio', 'xMinYMid meet');
    svg.setAttribute('fill', 'currentColor');
    chars.forEach((ch, k) => {
      for (const n of MAP[ch] || '') {
        const v = Number(n);
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', k * cw + r + (v > 3 ? d : 0));
        c.setAttribute('cy', r + 0.5 + ((v - 1) % 3) * d);
        c.setAttribute('r', r);
        svg.append(c);
      }
    });
    return svg;
  };
  document.querySelectorAll('.lx-card__tr').forEach((t) => t.closest('.lx-card__w')?.querySelector('.lx-card__tr')?.after(braille(t.textContent.trim(), 'kb-br')));
  const tr = document.querySelector('.lx-hero__tr');
  if (tr) tr.after(braille(tr.textContent.trim(), 'kb-title', 5.4, 2.1, 17));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const far = document.querySelector('.kb-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${Math.min(scrollY, 500) * 0.08})`); });
  }, { passive: true });
})();
