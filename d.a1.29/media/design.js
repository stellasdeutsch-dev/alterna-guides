/* Kambiyo: табло и банкомат выезжают, цифры курса перелистываются, комиссия банкомата «щёлкает»; квитанции-слова выползают как чек. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.timeline({ delay: 0.15 })
    .from('.d29-shop', { y: 26, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.d29-atm', { y: 40, opacity: 0, duration: 0.8, ease: 'back.out(1.6)' }, 0.25)
    .from('.d29-cafe', { y: 20, opacity: 0, duration: 0.7, ease: 'power2.out' }, 0.45)
    .from('.d29-rate', { scaleY: 0, transformOrigin: '50% 50%', duration: 0.35, stagger: 0.08, ease: 'power2.out' }, 0.7);
  const rates = [...document.querySelectorAll('.d29-rate')];
  let k = 0;
  const flip = (el) => {
    const alt = el.dataset.alt; if (!alt) return;
    gsap.timeline()
      .to(el, { scaleY: 0, transformOrigin: '50% 50%', duration: 0.16, ease: 'power1.in', onComplete: () => { el.dataset.alt = el.textContent; el.textContent = alt; } })
      .to(el, { scaleY: 1, duration: 0.2, ease: 'power1.out' });
  };
  if (rates.length) setInterval(() => { if (document.hidden) return; flip(rates[k % rates.length]); k += 1; }, 1700);
  const far = document.querySelector('.d29-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${Math.min(scrollY, 480) * 0.1})`); });
  }, { passive: true });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: -18, scaleY: 0.82, transformOrigin: '50% 0', opacity: 0, duration: 0.55, ease: 'power2.out', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card, .dy-goal__i').forEach((c) => io.observe(c));
})();
