/* Fener: прокрутка запускает лишний залп салюта. Нажал «Знаю» на карточке, и от неё разлетается конфетти. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const bursts = [...document.querySelectorAll('.fn-burst')];
  let lastY = scrollY, acc = 0, k = 0;
  addEventListener('scroll', () => {
    acc += Math.abs(scrollY - lastY); lastY = scrollY;
    if (acc < 180 || scrollY > 900 || !bursts.length) return;
    acc = 0;
    const b = bursts[k++ % bursts.length];
    b.animate([{ transform: 'scale(.15)', opacity: 0 }, { transform: 'scale(.9)', opacity: 1, offset: .35 }, { transform: 'scale(1.1)', opacity: 0 }], { duration: 1300, easing: 'ease-out' });
  }, { passive: true });
  const COL = ['#ff6b4a', '#ffc23d', '#25c2a0', '#ff7fb0', '#fff6d0'];
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.lx-card__know');
    if (!btn || btn.getAttribute('aria-pressed') === 'true' || !window.gsap) return;
    const card = btn.closest('.lx-card'); const r = card.getBoundingClientRect();
    for (let i = 0; i < 14; i++) {
      const s = document.createElement('i');
      s.setAttribute('aria-hidden', 'true');
      s.style.cssText = `position:fixed;z-index:60;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;width:8px;height:8px;background:${COL[i % 5]};border-radius:${i % 2 ? '50%' : '1px'};pointer-events:none`;
      document.body.append(s);
      const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 90;
      gsap.to(s, { x: Math.cos(a) * d, y: Math.sin(a) * d + 40, rotation: 240, opacity: 0, duration: 0.85, ease: 'power2.out', onComplete: () => s.remove() });
    }
  });
})();
