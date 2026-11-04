/* Doğa: листы бумаги двигаются с разной скоростью при прокрутке и за указателем. Без анимаций сцена уже на месте. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const L = [['.nt-l0', 0.34, 3], ['.nt-l1', 0.24, 6], ['.nt-l2', 0.16, 10], ['.nt-l3', 0.1, 15], ['.nt-l4', 0.05, 22], ['.nt-l5', 0, 30]]
    .map(([s, y, x]) => [document.querySelector(s), y, x]).filter((a) => a[0]);
  let px = 0, tick = false;
  const draw = () => { tick = false; const sy = Math.min(scrollY, 640); for (const [el, y, x] of L) el.setAttribute('transform', `translate(${(px * x).toFixed(1)} ${(sy * y).toFixed(1)})`); };
  const ask = () => { if (!tick) { tick = true; requestAnimationFrame(draw); } };
  addEventListener('scroll', ask, { passive: true });
  addEventListener('pointermove', (e) => { if (e.pointerType === 'touch') return; px = e.clientX / innerWidth - 0.5; ask(); }, { passive: true });
  if (window.gsap) gsap.from(L.map((a) => a[0]), { y: (i) => 90 - i * 10, opacity: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out', clearProps: 'opacity' });
})();
