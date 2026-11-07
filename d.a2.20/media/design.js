/* Fincan: кофейня собирается — окно проступает, стойка встаёт, Дениз выныривает из-за стойки, посуда приземляется на
   своё место, столик Айлы-ханым въезжает слева; окно чуть отстаёт при прокрутке. На выбор героя сцена отвечает:
   верный ответ — латте подпрыгивает и Дениз кивает, неверный — Дениз склоняет голову, чашка на блюдце дребезжит. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const $ = (s) => document.querySelector(s);
  if (!$('.e20-counter')) return;
  gsap.timeline({ delay: 0.1, defaults: { ease: 'power2.out' } })
    .from('.e20-win', { opacity: 0, y: -14, duration: 0.9 })
    .from('.e20-counter', { y: 40, opacity: 0, duration: 0.7 }, 0.15)
    .from('.e20-deniz', { y: 70, duration: 0.9, ease: 'back.out(1.4)' }, 0.45)
    .from('.e20-item', { y: -24, opacity: 0, duration: 0.55, stagger: 0.12, ease: 'bounce.out' }, 0.6)
    .from('.e20-table', { x: -80, opacity: 0, duration: 0.9 }, 0.35)
    .from('.e20-plant', { scale: 0.9, opacity: 0, transformOrigin: '50% 100%', duration: 0.8 }, 0.5);
  const far = $('.e20-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${(Math.min(scrollY, 480) * 0.07).toFixed(1)})`); });
  }, { passive: true });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.st-opt');
    if (!b) return;
    if (b.classList.contains('is-ok')) {
      gsap.fromTo('.e20-latte', { y: 0 }, { y: -10, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' });
      gsap.fromTo('.e20-nod', { y: 0 }, { y: 3, duration: 0.18, yoyo: true, repeat: 3, ease: 'sine.inOut' });
    } else if (b.classList.contains('is-miss')) {
      gsap.fromTo('.e20-head', { rotation: 0 }, { rotation: -8, svgOrigin: '650 170', duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut' });
      gsap.fromTo('.e20-fal', { x: -2.5 }, { x: 0, duration: 0.7, ease: 'elastic.out(1, 0.25)' });
    }
  });
})();
