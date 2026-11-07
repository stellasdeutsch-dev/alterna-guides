/* Mesaj: окно и комби проявляются, телефон «ложится» на полку; пузыри-слова всплывают снизу,
   входящие слева, исходящие справа. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d38-window', { opacity: 0, duration: 0.8, ease: 'power1.out' })
    .from('.d38-phone', { y: 120, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.2);
  const far = document.querySelector('.d38-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${Math.min(scrollY, 400) * 0.05})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    const right = [...e.target.parentElement.children].indexOf(e.target) % 2 === 1;
    gsap.from(e.target, { y: 20, x: right ? 24 : -24, scale: 0.94, opacity: 0, duration: 0.5, ease: 'back.out(1.6)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
