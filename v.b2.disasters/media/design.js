/* Sismograf: перо ведёт запись от спокойной линии к всплеску и обратно. При прокрутке лента пишет быстрее. Без анимации запись видна целиком. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const trace = document.getElementById('ds-trace');
  const arm = document.getElementById('ds-arm');
  const tip = document.getElementById('ds-tip');
  if (!trace || !arm || !tip) return;
  const len = trace.getTotalLength();
  trace.style.strokeDasharray = `${len}`;
  let p = 0, last = performance.now(), hold = 0, ly = scrollY, boost = 0;
  const set = (q) => {
    trace.style.strokeDashoffset = `${len * (1 - q)}`;
    const pt = trace.getPointAtLength(len * q);
    tip.setAttribute('cx', pt.x.toFixed(1)); tip.setAttribute('cy', pt.y.toFixed(1));
    arm.setAttribute('d', `M1238 190L${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`);
  };
  const frame = (t) => {
    const dt = Math.min(t - last, 60); last = t;
    const d = Math.abs(scrollY - ly); ly = scrollY; boost = Math.min(4, boost * .93 + d * .02);
    if (hold > 0) { hold -= dt; }
    else {
      p += dt / 16000 * (1 + boost);
      if (p >= 1) { p = 0; hold = 2600; }
    }
    set(hold > 0 ? 1 : p);
    if (document.hidden) setTimeout(() => requestAnimationFrame(frame), 500); else requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
