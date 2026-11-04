/* Tavla: кубики катаются при нажатии на вкладку, фишки ложатся на поля при появлении. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    const chip = e.target.querySelector('.lx-ico');
    gsap.from(e.target, { opacity: 0, duration: .3, clearProps: 'all' });
    if (chip) gsap.from(chip, { x: 70, scale: 1.2, rotation: 200, duration: .46, ease: 'power3.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
  const dice = document.querySelectorAll('.tv-die');
  const roll = () => dice.forEach((d, i) => gsap.fromTo(d, { rotation: -300 + i * 120, y: -46 }, { rotation: 0, y: 0, duration: .75, ease: 'bounce.out', transformOrigin: '50% 50%', overwrite: true }));
  document.querySelectorAll('.lx-tab').forEach((t) => t.addEventListener('click', roll));
  setTimeout(roll, 500);
})();
