/* Pist: самолёт заходит на посадку и катится по полосе; сцена едет за прокруткой; бирки «прилетают» на ленту. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const plane = document.querySelector('.pi-plane');
  if (plane) {
    gsap.timeline({ delay: 0.2 })
      .from(plane, { x: -420, y: -170, rotation: -9, transformOrigin: '50% 50%', duration: 2.1, ease: 'power2.out' })
      .to(plane, { y: 3, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' })
      .to(plane, { x: 70, duration: 2.4, ease: 'power3.out' }, '<');
  }
  gsap.from('.pi-sign', { y: 40, opacity: 0, duration: 0.6, delay: 1.2, ease: 'back.out(2)' });
  const far = document.querySelector('.pi-far');
  const tower = document.querySelector('.pi-tower');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 480);
      if (far) far.setAttribute('transform', `translate(0 ${y * 0.12})`);
      if (tower) tower.setAttribute('transform', `translate(0 ${y * 0.06})`);
    });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { x: -40, rotation: -3, opacity: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
