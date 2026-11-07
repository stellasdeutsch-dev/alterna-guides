/* Pasaport: табло опускается, кабинки и очередь появляются, штамп раз за разом опускается на страницу паспорта
   и оставляет оттиск «GİRİŞ»; страницы-карточки ложатся одна за другой, как при листании. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d03-sign', { y: -40, opacity: 0, duration: 0.7, ease: 'back.out(1.6)' })
    .from('.d03-booths > g', { y: 30, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' }, 0.2)
    .from('.d03-queue > g', { x: -90, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, 0.4);
  const stamp = document.querySelector('.d03-stamp');
  const mark = document.querySelector('.d03-imprint');
  if (stamp && mark) {
    gsap.set(mark, { opacity: 0 });
    gsap.timeline({ repeat: -1, repeatDelay: 2.4, delay: 1.4 })
      .set(mark, { opacity: 0 })
      .to(stamp, { x: 14, y: 92, duration: 0.45, ease: 'power2.in' })
      .to(stamp, { y: 106, duration: 0.08, ease: 'none' })
      .set(mark, { opacity: 1 })
      .to(stamp, { y: 100, duration: 0.1, yoyo: true, repeat: 1 })
      .to(stamp, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' }, '+=0.15')
      .to(mark, { opacity: 0, duration: 0.6 }, '+=2');
  }
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.fromTo(e.target, { rotationY: -70, opacity: 0, transformPerspective: 900, transformOrigin: '0 50%' }, { rotationY: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
