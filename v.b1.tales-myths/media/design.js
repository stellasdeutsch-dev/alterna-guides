/* Minyatür: простая глубина для плоской миниатюры. Облака, ковёр и птица медленно смещаются при прокрутке, слова проявляются как позолота. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cl = document.querySelector('.mn-clouds');
  const sim = document.querySelector('.mn-sim');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 600);
      if (cl) cl.style.translate = `${y * .12}px 0`;
      if (sim) sim.style.translate = `${-y * .08}px ${y * .05}px`;
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, scale: .985, duration: .6, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
