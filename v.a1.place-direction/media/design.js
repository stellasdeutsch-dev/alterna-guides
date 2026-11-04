/* Pusula: стрелка компаса ищет север и следит за прокруткой, таблички выезжают к столбу со своей стороны. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const n = document.querySelector('.pu-needle');
  if (n) {
    let cur = 0, target = 18, tick = false;
    const draw = () => { cur += (target - cur) * .06; n.setAttribute('transform', `rotate(${cur.toFixed(2)} 600 215)`); if (Math.abs(target - cur) > .05) requestAnimationFrame(draw); else tick = false; };
    const go = () => { if (!tick) { tick = true; requestAnimationFrame(draw); } };
    go();
    addEventListener('scroll', () => { target = 18 + Math.min(scrollY, 900) * .4; go(); }, { passive: true });
    setInterval(() => { if (document.hidden || scrollY > 800) return; target += (Math.random() - .5) * 30; go(); }, 3200);
  }
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    const i = [...e.target.parentNode.children].indexOf(e.target);
    gsap.from(e.target, { x: i % 2 ? 26 : -26, opacity: 0, duration: .42, ease: 'power3.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
