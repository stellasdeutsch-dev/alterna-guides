/* Apartman: группы слов подписаны как этажи, карточки «вкручиваются» по одной при прокрутке. Без анимаций всё и так на месте. */
(() => {
  document.querySelectorAll('.lx-group').forEach((g, i) => g.setAttribute('data-kat', String(i + 1)));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 10, opacity: 0, duration: 0.4, ease: 'power2.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
