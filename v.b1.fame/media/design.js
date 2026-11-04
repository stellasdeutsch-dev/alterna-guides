/* Hali: прокрутка вызывает щелчки вспышек у фотографов. Звезда идёт по ковру чуть ближе, карточки появляются снизу. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const fl = [...document.querySelectorAll('.ha-fl')];
  const star = document.querySelector('.ha-star');
  let last = scrollY, acc = 0, k = 0, ticking = false;
  addEventListener('scroll', () => {
    acc += Math.abs(scrollY - last); last = scrollY;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (star) star.style.translate = `0 ${Math.min(scrollY, 500) * 0.06}px`;
      });
    }
    if (acc < 170 || scrollY > 900 || !fl.length) return;
    acc = 0;
    fl[k++ % fl.length].animate([{ opacity: 0 }, { opacity: 1, offset: .25 }, { opacity: 0 }], { duration: 340, easing: 'ease-out' });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 16, opacity: 0, duration: 0.45, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
