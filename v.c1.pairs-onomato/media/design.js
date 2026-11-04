/* Patır: эквалайзер подпрыгивает от скорости прокрутки, «Знаю» отвечает хлопком карточки. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const eq = document.querySelector('.pt-eq');
  let last = scrollY, raf = 0;
  addEventListener('scroll', () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; const v = Math.min(Math.abs(scrollY - last) / 90, .5); last = scrollY; if (eq) { eq.style.transform = `scaleY(${1 + v})`; clearTimeout(eq._t); eq._t = setTimeout(() => { eq.style.transform = ''; }, 140); } }); }, { passive: true });
  if (!window.gsap) return;
  document.addEventListener('click', (e) => { const b = e.target.closest('.lx-card__know'); if (b) gsap.fromTo(b.closest('.lx-card'), { scale: .96 }, { scale: 1, duration: .45, ease: 'elastic.out(1.4,.4)', clearProps: 'transform' }); });
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { scale: .86, opacity: 0, duration: .34, ease: 'back.out(2.4)', clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card, .lx-story p').forEach((c) => io.observe(c));
})();
