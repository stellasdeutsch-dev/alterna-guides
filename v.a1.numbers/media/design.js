/* Piyango: на шаре в карточке вместо значка стоит само число. Шары выкатываются при прокрутке. */
(() => {
  const N = { 'sıfır': '0', bir: '1', iki: '2', 'üç': '3', 'dört': '4', 'beş': '5', 'altı': '6', yedi: '7', sekiz: '8', dokuz: '9', on: '10', yirmi: '20', otuz: '30', 'kırk': '40', elli: '50', 'altmış': '60', 'yetmiş': '70', seksen: '80', doksan: '90', 'kaç?': '?', 'yüz': '100', bin: '1K', milyon: '1M', birinci: '1.', ikinci: '2.', 'üçüncü': '3.', 'kaçıncı?': '?.', son: 'SON', yaş: '26' };
  document.querySelectorAll('.lx-card').forEach((c, i) => {
    c.style.setProperty('--hue', String(i % 5));
    const ico = c.querySelector('.lx-ico'); const n = N[c.dataset.word];
    if (ico && n) { ico.dataset.n = n; ico.dataset.len = String(n.length); }
    c.style.setProperty('--ser', `"${String(1000 + i * 37).padStart(5, '0')}"`);
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    const ico = e.target.querySelector('.lx-ico');
    if (ico) gsap.from(ico, { x: -46, rotation: -240, duration: 0.6, ease: 'back.out(1.5)', clearProps: 'transform' });
  }), { rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
