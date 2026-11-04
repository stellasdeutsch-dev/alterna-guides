/* Pembe: при прокрутке газетный график и порт смещаются с разной скоростью, строки котировок проявляются по одной. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const far = document.querySelector('.pb-far'), mid = document.querySelector('.pb-mid');
  let t = false;
  addEventListener('scroll', () => {
    if (t) return; t = true;
    requestAnimationFrame(() => { t = false; const y = Math.min(scrollY, 500);
      if (far) far.setAttribute('transform', `translate(0 ${y * .06})`);
      if (mid) mid.setAttribute('transform', `translate(${y * -.04} 0)`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, x: -10, duration: .35, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card, .lx-group').forEach((c) => io.observe(c));
})();
