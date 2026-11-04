/* Riviera: солнце и ветки апельсина как отдельные слои плаката. При прокрутке солнце тонет в море. */
(() => {
  const hero = document.querySelector('.lx-hero');
  if (!hero) return;
  const mk = (cls) => { const d = document.createElement('div'); d.className = cls; d.setAttribute('aria-hidden', 'true'); hero.prepend(d); return d; };
  mk('ta-corner ta-corner--r'); mk('ta-corner ta-corner--l');
  const sun = mk('ta-sun');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; sun.style.transform = `translateY(${Math.min(scrollY, 500) * 0.2}px)`; });
  }, { passive: true });
})();
