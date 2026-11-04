/* Nüfus: пирамида сама стареет: 1950, 1985, 2025. На прокрутке годы подгоняются к положению страницы. В карточке строка из десяти фигурок, закрашено по слову. */
(() => {
  document.querySelectorAll('.lx-card').forEach((card) => {
    const word = card.querySelector('.lx-card__tr')?.textContent || '';
    let h = 3; for (const ch of word) h = (h * 17 + ch.charCodeAt(0)) % 101;
    const on = 2 + (h % 7), row = document.createElement('span');
    row.className = 'nu-row'; row.setAttribute('aria-hidden', 'true'); row.dataset.ui = '';
    row.innerHTML = Array.from({ length: 10 }, (_, i) => `<i class="${i < on ? 'on' : ''}${i % 2 ? ' f' : ''}"></i>`).join('');
    card.querySelector('.lx-card__face')?.append(row);
  });
  const svgs = [...document.querySelectorAll('.nu-w, .nu-n')];
  if (!svgs.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let y = 0;
  const set = (v) => { y = v; svgs.forEach((s) => s.setAttribute('data-y', v)); };
  set(0);
  let id = setInterval(() => set((y + 1) % 3), 2800);
  let raf = 0, idle = 0;
  addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      if (scrollY > 900) return;
      clearInterval(id); clearTimeout(idle);
      set(Math.min(2, Math.floor(scrollY / 110)));
      idle = setTimeout(() => { id = setInterval(() => set((y + 1) % 3), 2800); }, 1800);
    });
  }, { passive: true });
})();
