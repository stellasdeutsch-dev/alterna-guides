/* Plata: мультиметр показывает меняющееся напряжение, при прокрутке отвёртка подъезжает к винту, импульсы бегут быстрее. Без анимации всё стоит. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const read = document.querySelector('.pl-read');
  const vals = ['3.85', '3.84', '3.86', '3.91', '3.72', '0.00', '3.85'];
  let i = 0;
  if (read) setInterval(() => { if (document.hidden) return; i = (i + 1) % vals.length; read.textContent = vals[i]; }, 1400);
  const dial = document.querySelector('.pl-dial');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 600);
      if (dial) dial.setAttribute('transform', `rotate(${y * 0.2} 75 128)`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: -16, opacity: 0, duration: 0.3, ease: 'power3.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
