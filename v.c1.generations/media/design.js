/* Kuşaklar: каждое слово заголовка набрано шрифтом своего времени; указатель на рулетке едет с прокруткой */
(() => {
  const h = document.querySelector('.lx-hero h1');
  if (h) {
    const words = h.textContent.trim().split(/\s+/);
    h.setAttribute('aria-label', h.textContent.trim());
    h.textContent = '';
    words.forEach((w, i) => {
      const s = document.createElement('span');
      s.className = 'gn-wd gn-w' + Math.min(i, 3);
      s.setAttribute('aria-hidden', 'true');
      s.textContent = w;
      h.append(s, ' ');
    });
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const s = document.querySelector('.lx-scene'); if (!s) return;
  let t = 0;
  addEventListener('scroll', () => { if (t) return; t = requestAnimationFrame(() => { t = 0; s.style.setProperty('--sy', Math.min(1, scrollY / 900).toFixed(3)); }); }, { passive: true });
})();
