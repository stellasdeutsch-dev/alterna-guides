/* Dilek: большой назар следит за указателем и за прокруткой. Ленты качаются только пока сцена на экране. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const pupil = document.querySelector('.dl-pupil');
  if (!pupil) return;
  const R = 15;
  let tx = 0, ty = 0, x = 0, y = 0, on = false;
  const loop = () => {
    x += (tx - x) * .08; y += (ty - y) * .08;
    pupil.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
    if (Math.abs(tx - x) > .05 || Math.abs(ty - y) > .05) requestAnimationFrame(loop); else on = false;
  };
  const aim = (cx, cy) => {
    const b = pupil.getBoundingClientRect();
    const dx = cx - (b.left + b.width / 2), dy = cy - (b.top + b.height / 2), d = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, d / 260) * R;
    tx = dx / d * k; ty = dy / d * k;
    if (!on) { on = true; requestAnimationFrame(loop); }
  };
  addEventListener('pointermove', (e) => aim(e.clientX, e.clientY), { passive: true });
  addEventListener('scroll', () => aim(innerWidth / 2, innerHeight), { passive: true });
  /* назар коротко вздрагивает, когда слово отмечено выученным */
  document.addEventListener('click', (e) => {
    const k = e.target.closest && e.target.closest('.lx-card__know');
    if (!k || !window.gsap) return;
    gsap.fromTo(k.closest('.lx-card'), { rotate: -1.2 }, { rotate: 0, duration: .5, ease: 'elastic.out(1, .4)', clearProps: 'rotate' });
  });
})();
