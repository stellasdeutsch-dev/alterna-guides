/* Hurufat: заголовок разбирается на литеры и набирается при загрузке, на блоках карточек зеркальная первая буква. Валик катится за прокруткой. */
(() => {
  const h = document.querySelector('.lx-hero h1');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (h && !h.querySelector('.hf-l')) {
    const text = h.textContent.trim();
    h.setAttribute('aria-label', text);
    h.innerHTML = text.split(/\s+/).map((w) => `<span class="hf-w" aria-hidden="true">${[...w].map((c) => `<span class="hf-l">${c}</span>`).join('')}</span>`).join(' ');
    if (!still && window.gsap) gsap.from('.hf-l', { y: -26, opacity: 0, duration: .32, stagger: .022, ease: 'power2.out', clearProps: 'all' });
  }
  document.querySelectorAll('.lx-card').forEach((c) => {
    const w = c.dataset.word, i = c.querySelector('.lx-card__top .lx-ico');
    if (w && i) i.setAttribute('data-l', w[0]);
  });
  if (still) return;
  const b = document.querySelector('.hf-slab');
  let t = false;
  addEventListener('scroll', () => { if (t) return; t = true; requestAnimationFrame(() => { t = false; if (b) b.setAttribute('transform', `translate(${600 - Math.min(scrollY, 500) * .06} 92)`); }); }, { passive: true });
})();
