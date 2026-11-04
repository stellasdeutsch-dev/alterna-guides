/* Стол проверки: слово «слухи» в заголовке вычёркивается красным, при прокрутке лупа съезжает вдоль листа. */
(() => {
  const h = document.querySelector('.lx-hero h1');
  if (h) h.innerHTML = h.innerHTML.replace('слухи,', '<span class="mt-rumor">слухи,</span>');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const tape = document.querySelector('.mt-tape');
  let t = false;
  addEventListener('scroll', () => {
    if (t) return; t = true;
    requestAnimationFrame(() => {
      t = false;
      const y = Math.min(scrollY, 500);
      if (tape) tape.setAttribute('transform', `translate(0 ${y * 0.16})`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, y: 12, duration: 0.45, ease: 'power2.out', clearProps: 'opacity,transform' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
