/* Galata: башня поднимается над крышами, дома встают по склону, стрелка компаса делает оборот и ищет север,
   таблички указателей раскрываются; карточки-указатели выезжают со своей стороны. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.2 })
    .from('.d21-houses > *', { y: 30, opacity: 0, duration: 0.5, stagger: 0.02, ease: 'power2.out' })
    .from('.d21-needle-wrap', { rotation: -340, svgOrigin: '0 0', duration: 1.8, ease: 'power3.out' }, 0.2)
    .from('.d21-sign-a', { scaleX: 0, transformOrigin: '0% 50%', duration: 0.5, ease: 'back.out(2)' }, 0.8)
    .from('.d21-sign-b', { scaleX: 0, transformOrigin: '100% 50%', duration: 0.5, ease: 'back.out(2)' }, 1);
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    const even = e.target.matches('.lx-card:nth-child(even)');
    gsap.from(e.target, { x: even ? 40 : -40, opacity: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
