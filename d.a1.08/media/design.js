/* Zil: в подъезде зажигается свет, кто-то жмёт кнопку «3 DEMİR» — дверь соседа приоткрывается и снова закрывается;
   таблички-слова «нажимаются», как кнопки домофона, когда появляются на экране. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.2 })
    .from('.d08-bulb', { opacity: 0.2, duration: 0.15, repeat: 3, yoyo: true, ease: 'none' })
    .from('.d08-stairs', { opacity: 0, x: -20, duration: 0.6, ease: 'power2.out' }, 0)
    .to('.d08-door', { scaleX: 0.8, transformOrigin: '100% 50%', duration: 0.7, ease: 'power2.inOut' }, 1.2)
    .to('.d08-door', { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, '+=1.4');
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.timeline({ onComplete: () => gsap.set(e.target, { clearProps: 'transform,opacity' }) })
      .fromTo(e.target, { scale: 0.92, y: 16, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' })
      .to(e.target, { scale: 0.985, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.inOut' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
