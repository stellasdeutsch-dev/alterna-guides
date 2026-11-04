/* Boyacı: у каждого слова своя выкраска. В уроке про цвета это сам цвет, в уроке про пары простая картинка-сравнение. Слова заголовка покрашены. */
(() => {
  const P = { renk: 'conic-gradient(#e8352b,#ff8a1f,#ffcc1a,#27a85a,#1f7fe0,#8a3fd6,#ff6fae,#e8352b)', beyaz: '#fdfcf7', siyah: '#1a1a1f', 'kırmızı': '#e8352b', mavi: '#1f7fe0', 'yeşil': '#27a85a', 'sarı': '#ffcc1a', turuncu: '#ff8a1f', mor: '#8a3fd6', pembe: '#ff6fae', kahverengi: '#8a5426', gri: '#9aa0a6', lacivert: '#16306e', 'açık': '#bfe0ff', koyu: '#0c3a78', 'ne renk?': 'conic-gradient(#1f7fe0,#ff6fae,#ffcc1a,#27a85a,#1f7fe0)' };
  const G = {
    'büyük': '<circle cx="30" cy="30" r="26"/>', 'küçük': '<circle cx="30" cy="30" r="8"/>', uzun: '<rect x="4" y="25" width="52" height="10" rx="3"/>', 'kısa': '<rect x="22" y="25" width="16" height="10" rx="3"/>',
    yeni: '<path d="M30 6l6 18 18 6-18 6-6 18-6-18-18-6 18-6z"/>', eski: '<path d="M10 16l8 3 6-5 8 5 8-4 10 5-2 26H12z" opacity=".55"/>',
    ucuz: '<text x="30" y="42" text-anchor="middle" font-size="34" font-weight="900" font-family="\'LX Montserrat\',sans-serif">₺</text>', 'pahalı': '<text x="30" y="40" text-anchor="middle" font-size="24" font-weight="900" font-family="\'LX Montserrat\',sans-serif">₺₺₺</text>',
    iyi: '<path d="M10 32l13 13 28-30" fill="none" stroke-width="8" stroke="currentColor" stroke-linecap="round"/>', 'kötü': '<path d="M14 14l32 32M46 14L14 46" fill="none" stroke-width="8" stroke="currentColor" stroke-linecap="round"/>',
    temiz: '<path d="M22 12l3 9 9 3-9 3-3 9-3-9-9-3 9-3zM42 30l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>', kirli: '<circle cx="18" cy="20" r="8"/><circle cx="40" cy="16" r="5"/><circle cx="34" cy="38" r="10"/><circle cx="12" cy="44" r="4"/>',
    'hızlı': '<path d="M6 18h22M2 30h30M6 42h22M34 14l20 16-20 16z"/><path d="M6 18h22M2 30h30M6 42h22" fill="none" stroke="currentColor" stroke-width="5"/>', 'yavaş': '<circle cx="34" cy="30" r="14"/><path d="M4 46h44q-4-6-14-6H16c-2-8-4-12-8-12-6 0-6 10-4 18z"/>',
    kolay: '<path d="M4 46h52L4 34z"/>', zor: '<path d="M4 50L28 8l12 18 6-8 10 32z"/>',
  };
  const pal = ['#ffcc1a', '#7fd0ff', '#ff9db8', '#9be58a', '#c9a8ff', '#ffb066'];
  const dark = new Set(['siyah', 'mavi', 'lacivert', 'mor', 'koyu', 'kırmızı', 'kahverengi', 'yeşil']);
  document.querySelectorAll('.lx-card').forEach((c, i) => {
    const w = c.dataset.word; let h = 7; for (const ch of w) h = (h * 31 + ch.charCodeAt(0)) % 9973;
    c.style.setProperty('--code', `"BY-${String(h).padStart(4, '0')}"`);
    const col = P[w] || pal[Number(c.dataset.g || 0) * 2 % 6 + (i % 2)];
    c.style.setProperty('--sw', col);
    c.style.setProperty('--on', dark.has(w) ? '#fff' : '#111');
    const ico = c.querySelector('.lx-ico');
    if (ico && P[w]) ico.classList.add('is-color');
    if (ico && G[w]) { ico.innerHTML = `<svg viewBox="0 0 60 60" fill="currentColor" aria-hidden="true" focusable="false">${G[w]}</svg>`; ico.classList.add('is-draw'); }
  });
  const h1 = document.querySelector('.lx-hero h1');
  if (h1) { const cs = ['#b3141c', '#0b57b3', '#6a23b8', '#0a7a3f', '#b3141c']; h1.innerHTML = h1.textContent.split(/\s+/).map((w, i) => `<span style="color:${cs[i % cs.length]}">${w}</span>`).join(' '); }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { rotation: -5, y: 16, opacity: 0, transformOrigin: '50% 100%', duration: 0.45, ease: 'back.out(1.6)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
