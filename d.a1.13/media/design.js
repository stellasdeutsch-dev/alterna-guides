/* Vapur: паром выходит из-за края и швартуется в кадре, Галата поднимается из дымки, чайки догоняют корму;
   билеты-жетоны выкатываются, как монеты, и встают на место. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const ferry = document.querySelector('.d13-ferry')?.parentNode;
  const tl = gsap.timeline({ delay: 0.15 });
  if (ferry) tl.from(ferry, { x: -360, duration: 2.2, ease: 'power3.out' });
  tl.from('.d13-galata', { y: 30, opacity: 0, duration: 1.2, ease: 'power2.out' }, 0.2)
    .from('.d13-gull', { opacity: 0, duration: 1, stagger: 0.25, ease: 'power1.out' }, 1.2);
  const far = document.querySelector('.d13-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.08})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e, i) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { x: i % 2 ? 40 : -40, rotation: i % 2 ? 8 : -8, opacity: 0, duration: 0.6, ease: 'back.out(1.5)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
