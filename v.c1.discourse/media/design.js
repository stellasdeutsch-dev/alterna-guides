/* Makas: цвет линии по группе слов; пятый поезд едет вместе с прокруткой. */
(() => {
  const COL = ['#0f7a55', '#1c5fb0', '#d0640f', '#b3261e', '#6a3fb5', '#0f7a55'];
  document.querySelectorAll('.lx-panel[data-section="sozluk"] .lx-cards').forEach((c, i) => {
    c.style.setProperty('--c', COL[i % COL.length]);
    const g = c.previousElementSibling; if (g && g.classList.contains('lx-group')) g.style.setProperty('--c', COL[i % COL.length]);
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const t = document.querySelector('.ms-tr');
  if (!t) return;
  let raf = 0, dragging = false;
  addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      if (scrollY < 4) { if (dragging) { t.style.animationPlayState = ''; t.style.offsetDistance = ''; dragging = false; } return; }
      dragging = true; t.style.animationPlayState = 'paused'; t.style.offsetDistance = `${Math.min(96, 30 + scrollY / 24)}%`;
    });
  }, { passive: true });
})();
