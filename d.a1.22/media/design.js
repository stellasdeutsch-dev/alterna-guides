/* Dolum: автомат и турникеты выезжают, на экране автомата баланс снова и снова растёт от 3 до 203 лир
   (в такт с купюрой), чеки-слова печатаются сверху вниз. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d22-machine', { y: 60, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.d22-gates > g', { y: 30, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(1.8)' }, 0.3);
  const bal = document.querySelector('.d22-bal');
  if (bal) {
    const o = { v: 3 };
    const show = () => { bal.textContent = `${Math.round(o.v)},00 ₺`; };
    gsap.timeline({ repeat: -1, delay: 0.6 })
      .set(o, { v: 3, onComplete: show })
      .to(o, { v: 203, duration: 1.8, ease: 'power1.inOut', onUpdate: show }, 2.4)
      .to({}, { duration: 1.8 });
  }
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: -18, scaleY: 0.7, opacity: 0, transformOrigin: '50% 0%', duration: 0.5, ease: 'power2.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
