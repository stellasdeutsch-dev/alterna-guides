/* İki yüz: заголовок делится по шву на два регистра, карточки получают свой материал по группе. Шов расходится при прокрутке, машинка стучит, а телефон пишет. */
(() => {
  const h = document.querySelector('.lx-hero h1');
  if (h && !h.querySelector('span')) {
    const m = h.textContent.trim().match(/^(\S+)\s+(.+)$/);
    if (m) h.innerHTML = `<span class="iy-f">${m[1]}</span> <span class="iy-c">${m[2]}</span>`;
  }
  const cur = document.querySelector('.lx-lessons a[aria-current]');
  const n = cur ? cur.textContent.trim() : '1';
  document.querySelectorAll('.lx-cards').forEach((c) => {
    const g = c.dataset.g;
    const casual = n === '1' ? g === '0' : g === '1';
    c.classList.add(casual ? 'is-hoodie' : 'is-tux');
  });
  document.querySelectorAll('.lx-group').forEach((c) => {
    const g = c.dataset.g;
    const casual = n === '1' ? g === '0' : g === '1';
    c.classList.add(casual ? 'is-hoodie' : 'is-tux');
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const L = document.querySelector('.sc-left'), R = document.querySelector('.sc-right'), ML = document.querySelector('.sc-man-l'), MR = document.querySelector('.sc-man-r');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const d = Math.min(scrollY, 400) * 0.05;
      if (L) L.setAttribute('transform', `translate(${-d} 0)`);
      if (R) R.setAttribute('transform', `translate(${d} 0)`);
      if (ML) ML.setAttribute('transform', `translate(${-d} 0)`);
      if (MR) MR.setAttribute('transform', `translate(${d} 0)`);
    });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    const hood = e.target.closest('.is-hoodie');
    gsap.from(e.target, hood ? { scale: 0.92, opacity: 0, duration: 0.3, ease: 'back.out(2.4)', clearProps: 'all' } : { y: 6, opacity: 0, duration: 0.5, ease: 'power1.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
