/* Ring: ораторы по очереди бьют связками. Левый подаёт довод, правый возражает, таймер идёт. Карточки раундов выезжают с ударом при прокрутке. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const L = ['Öncelikle…', 'Dahası…', 'Kuşkusuz…', 'Özetle…'];
  const R = ['Buna karşın…', 'Oysa…', 'Ancak…', 'Öte yandan…'];
  const sl = document.querySelector('.sc-say-l'), sr = document.querySelector('.sc-say-r'), tm = document.querySelector('.sc-timer'), red = document.querySelector('.sc-red .sc-punch'), blue = document.querySelector('.sc-blue .sc-punch');
  let i = 0, left = 180, side = 0;
  setInterval(() => {
    if (document.hidden) return;
    if (side === 0) { if (sl) sl.textContent = L[i % 4]; red && red.classList.remove('is-hit'); red && void red.getBBox(); red && red.classList.add('is-hit'); }
    else { if (sr) sr.textContent = R[i % 4]; blue && blue.classList.remove('is-hit'); blue && void blue.getBBox(); blue && blue.classList.add('is-hit'); i++; }
    side = 1 - side;
  }, 2200);
  setInterval(() => {
    if (document.hidden || !tm) return;
    left = left <= 0 ? 180 : left - 1;
    tm.textContent = `0${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
  }, 1000);
  const far = document.querySelector('.sc-far');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { tick = false; if (far) far.setAttribute('transform', `translate(0 ${Math.min(scrollY, 500) * 0.06})`); });
  }, { passive: true });
  if (!window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    const odd = [...e.target.parentNode.children].indexOf(e.target) % 2 === 0;
    gsap.from(e.target, { x: odd ? -28 : 28, opacity: 0, duration: 0.32, ease: 'back.out(2.2)', clearProps: 'all' });
  }), { rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
