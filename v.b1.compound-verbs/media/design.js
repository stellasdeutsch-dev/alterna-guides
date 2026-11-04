/* Bloklar: заголовок и слова разбираются на блоки. Текст не меняется, добавляются только обёртки. Цвет карточки зависит от глагола-защёлки. */
(() => {
  const h1 = document.querySelector('.lx-hero h1');
  if (h1) {
    const m = h1.textContent.trim().match(/^(.*?)\s(с\s.*)$/);
    if (m) {
      h1.textContent = '';
      const a = document.createElement('span'); a.className = 'bl-a'; a.textContent = m[1];
      const b = document.createElement('span'); b.className = 'bl-b is-in'; b.textContent = m[2];
      h1.append(a, ' ', b);
    }
  }
  const kind = (w) => (/kalmak$/.test(w) ? 'kalmak' : /olmak$/.test(w) ? 'olmak' : 'etmek');
  document.querySelectorAll('.lx-card').forEach((c) => {
    const w = c.dataset.word || '';
    c.dataset.k = kind(w);
    const t = c.querySelector('.lx-card__tr');
    if (!t) return;
    const m = t.textContent.trim().match(/^(.*?)\s?(etmek|olmak|kalmak)$/);
    if (!m || !m[1]) return;
    const spaced = /\s(etmek|olmak|kalmak)$/.test(t.textContent.trim());
    t.textContent = '';
    const n = document.createElement('span'); n.className = 'bl-n'; n.textContent = m[1];
    const v = document.createElement('span'); v.className = 'bl-v'; v.textContent = m[2];
    t.append(n, spaced ? ' ' : '', v);
  });
  document.querySelectorAll('.lx-table tr').forEach((r) => { const td = r.querySelector('td[lang="tr"]'); if (td) r.dataset.k = kind(td.childNodes[0]?.textContent.trim() || ''); });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const loose = document.querySelector('.bl-loose');
  const fig = document.querySelector('.bl-fig');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 400);
      if (loose) loose.setAttribute('transform', `translate(0 ${y * -0.05})`);
      if (fig) fig.setAttribute('transform', `translate(${y * 0.04} 0)`);
    });
  }, { passive: true });
})();
