/* Bauhaus: у каждого суффикса своя форма. Карточка получает форму своей группы, суффикс в слове выделяется цветом, диск поворачивается при прокрутке. */
(() => {
  const cur = document.querySelector('.lx-lessons a[aria-current]');
  const n = cur ? cur.textContent.trim() : '1';
  const forms = n === '1' ? ['is', 'ma'] : ['gi', 'im'];
  const rx = { is: /(y?[ıiuü]ş|ş)$/, ma: /(m[ae])$/, gi: /([gğk][ıiuü])$/, im: /([ıiuü]?m)$/ };
  document.querySelectorAll('.lx-cards').forEach((c) => {
    const f = forms[+c.dataset.g] || forms[0];
    c.dataset.form = f;
    c.querySelectorAll('.lx-card__tr').forEach((t) => {
      const w = t.textContent;
      const m = w.match(rx[f]);
      if (m && m.index > 0) t.innerHTML = `${w.slice(0, m.index)}<span class="bh-sfx">${m[1]}</span>`;
    });
  });
  document.querySelectorAll('.lx-group').forEach((g) => { g.dataset.form = forms[+g.dataset.g] || forms[0]; });
  const h = document.querySelector('.lx-hero h1');
  if (h) { let i = 0; h.innerHTML = h.textContent.replace(/-[^\s,]+,?/g, (m) => `<span class="bh-nb bh-nb--${++i}">${m}</span>`); }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const d = document.querySelector('.sc-disc');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (d) d.setAttribute('transform', `rotate(${scrollY * 0.12} 960 250)`); });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 18, opacity: 0, duration: 0.3, ease: 'power3.out', clearProps: 'all' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
