/* Telefon: фасад проявляется, рука поднимает телефон, на экране идёт таймер разговора;
   карточки контактов выезжают справа, как строки в телефонной книге. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d37-facade', { opacity: 0, duration: 0.8, ease: 'power1.out' })
    .from('.d37-phone-wrap', { y: 160, duration: 1, ease: 'power3.out' }, 0.2);
  const timer = document.querySelector('.d37-timer');
  if (timer) {
    let s = 8;
    setInterval(() => {
      if (document.hidden) return;
      s = (s + 1) % 600;
      timer.textContent = `0${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    }, 1000);
  }
  const facade = document.querySelector('.d37-facade');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (facade) facade.setAttribute('transform', `translate(0 ${Math.min(scrollY, 400) * 0.05})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { x: 30, opacity: 0, duration: 0.5, ease: 'power2.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i, .lx-msg').forEach((c) => io.observe(c));
})();
