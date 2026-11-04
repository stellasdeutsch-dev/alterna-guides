/* Saat kulesi: стрелки показывают настоящее время, шестерни вращаются сами. Листки календаря отрываются при появлении. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hour = document.querySelector('.sk-h--hour'), min = document.querySelector('.sk-h--min'), sec = document.querySelector('.sk-h--sec');
  const set = (el, deg) => { if (el) el.style.transform = `rotate(${deg}deg)`; };
  const draw = () => {
    const d = new Date();
    const s = d.getSeconds(), m = d.getMinutes() + s / 60, h = d.getHours() + m / 60;
    set(hour, h * 15); set(min, m * 6); set(sec, s * 6);
  };
  draw();
  if (reduce) return;
  setInterval(() => { if (!document.hidden) draw(); }, 1000);
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { rotationX: -28, y: -14, opacity: 0, transformOrigin: '50% 0', duration: .45, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
