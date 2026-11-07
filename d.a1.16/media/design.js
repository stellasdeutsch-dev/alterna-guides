/* Hesap: папку со счётом кладут на стол, монеты падают стопкой, гость машет «Hesap, lütfen!»;
   обрывки чеков-слов выезжают снизу, как из кассы, окно и картина отстают при прокрутке. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d16-folderwrap', { y: 50, opacity: 0, duration: 0.7, ease: 'power3.out' })
    .from('.d16-coins', { y: -60, opacity: 0, duration: 0.6, ease: 'bounce.out' }, 0.4)
    .from('.d16-bubble > g', { scale: 0.3, opacity: 0, transformOrigin: '25% 100%', duration: 0.55, ease: 'back.out(2.4)' }, 0.9)
    .from('.d16-till', { x: 60, opacity: 0, duration: 0.7, ease: 'power2.out' }, 0.2);
  const far = document.querySelector('.d16-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.08})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 34, opacity: 0, duration: 0.55, ease: 'power2.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
