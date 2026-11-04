/* Patent: настоящая кинематика: маховик вращается, шатун и поршень следуют за пальцем кривошипа. Прокрутка подгоняет машину. Без анимации чертёж стоит в исходном положении. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const q = (id) => document.getElementById(id);
  const fly = q('pt-fly'), con = q('pt-con'), con2 = q('pt-con2'), pin = q('pt-pin'), pin2 = q('pt-pin2'), rod = q('pt-rod'), cross = q('pt-cross');
  const piston = document.querySelector('.pt-piston');
  if (!fly || !con) return;
  const CX = 690, CY = 322, R = 38, L = 157;
  let a = 0, last = performance.now(), boost = 0, lastY = scrollY;
  const frame = (t) => {
    const dt = Math.min(t - last, 60); last = t;
    const dy = Math.abs(scrollY - lastY); lastY = scrollY;
    boost = Math.min(5, boost * 0.94 + dy * 0.02);
    a += dt * 0.0011 * (1 + boost);
    const px = CX + R * Math.cos(a), py = CY + R * Math.sin(a);
    const xh = px - Math.sqrt(L * L - (py - CY) * (py - CY));
    const d = `M${xh.toFixed(1)} ${CY}L${px.toFixed(1)} ${py.toFixed(1)}`;
    con.setAttribute('d', d); con2.setAttribute('d', d);
    pin.setAttribute('cx', px.toFixed(1)); pin.setAttribute('cy', py.toFixed(1)); pin2.setAttribute('cx', xh.toFixed(1));
    const dx = xh - 533;
    cross.setAttribute('x', (518 + dx).toFixed(1));
    rod.setAttribute('width', (118 + dx + 16).toFixed(1));
    rod.setAttribute('x', 408 + Math.min(0, dx));
    const pos = 384 + dx * 0.9;
    piston.setAttribute('x', pos.toFixed(1)); rod.setAttribute('x', (pos + 24).toFixed(1)); rod.setAttribute('width', (518 + dx - pos - 24 + 15).toFixed(1));
    fly.style.transform = `rotate(${a}rad)`;
    if (!document.hidden) requestAnimationFrame(frame); else setTimeout(() => requestAnimationFrame(frame), 400);
  };
  requestAnimationFrame(frame);
})();
