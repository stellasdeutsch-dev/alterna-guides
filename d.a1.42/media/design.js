/* Hatıra: полароиды прошлых дней ложатся на крафт один за другим, наклейки прилепляются;
   наклейки-слова «приклеиваются» при прокрутке — с лёгким нажимом. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const photos = [...document.querySelectorAll('.d42-photo')].map((p) => p.parentNode);
  const tl = gsap.timeline({ delay: 0.2 });
  if (photos.length) tl.from(photos, { y: -50, opacity: 0, duration: 0.6, stagger: 0.25, ease: 'power3.out' });
  tl.from('.d42-sticker', { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.12, ease: 'back.out(2.4)' }, 0.8)
    .from('.d42-note', { x: 40, rotation: 20, opacity: 0, transformOrigin: '50% 0%', duration: 0.6, ease: 'power3.out' }, 1.2);
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { scale: 1.08, rotation: i % 2 ? 4 : -4, opacity: 0, duration: 0.45, ease: 'back.out(2)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
