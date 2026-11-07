/* Baharat: стрелка остроты пролетает от «acı» к «az acı», миски выставляют на прилавок, вывеска опускается;
   этикетки-слова и банки-фразы встают на полку по одной. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const tl = gsap.timeline({ delay: 0.2 });
  tl.from('.d19-sign-drop', { y: -90, duration: 1, ease: 'bounce.out' })
    .from('.d19-needle-wrap', { rotation: 78, svgOrigin: '0 0', duration: 1.6, ease: 'elastic.out(1, .45)' }, 0.3)
    .from('.d19-bowls > g', { y: 40, opacity: 0, duration: 0.55, stagger: 0.12, ease: 'back.out(1.8)' }, 0.4)
    .from('.d19-shelf > g', { y: -16, opacity: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' }, 0.6);
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: -24, scaleY: 0.94, opacity: 0, transformOrigin: '50% 100%', duration: 0.5, ease: 'back.out(1.7)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
