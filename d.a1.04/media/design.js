/* Aktarma: такси въезжает и счётчик крутится до 900 ₺, карта прикладывается к турникету, проездные карты выезжают из валидатора. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const meter = document.querySelector('.ak4-meter');
  const fare = document.querySelector('.ak4-fare');
  const tl = gsap.timeline({ delay: 0.2 });
  tl.from('.ak4-taxi', { x: -260, duration: 1.4, ease: 'power3.out' });
  if (meter) { const o = { v: 0 }; tl.to(o, { v: 900, duration: 1.6, ease: 'power1.in', onUpdate: () => { meter.textContent = `${Math.round(o.v / 10) * 10} ₺`; } }, 0.3); }
  if (fare) { const o = { v: 0 }; tl.to(o, { v: 40, duration: 0.8, ease: 'power2.out', onUpdate: () => { fare.textContent = `${Math.round(o.v)} ₺`; } }, 1.2); }
  tl.from('.ak4-entry', { y: 30, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, 0.4);
  const card = document.querySelector('.ak4-card');
  if (card) gsap.timeline({ repeat: -1, repeatDelay: 2.2, delay: 1.5 }).to(card, { x: 30, y: 30, duration: 0.6, ease: 'power2.inOut' }).to(card, { x: 0, y: 0, duration: 0.6, ease: 'power2.inOut' }, '+=0.5');
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 26, rotation: 2, opacity: 0, duration: 0.5, ease: 'back.out(1.6)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
