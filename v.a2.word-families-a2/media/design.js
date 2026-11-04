/* Ekler: суффикс в заголовке не рвётся на дефисе, ячейки загораются при появлении, сцена живёт в CSS. */
(() => {
  const h = document.querySelector('.lx-hero h1');
  if (h && !h.children.length) h.innerHTML = h.textContent.replace(/-[^\s,]+,?/g, (m) => `<span style="white-space:nowrap">${m}</span>`);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.from('.wf-t .wf-c', { opacity: 0, scale: 0.7, duration: 0.3, stagger: { each: 0.012, from: 'random' }, ease: 'back.out(2)', clearProps: 'opacity,transform' });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { opacity: 0, scale: 0.9, duration: 0.3, ease: 'back.out(2)', clearProps: 'all' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
