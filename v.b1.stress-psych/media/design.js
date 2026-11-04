/* Nefes: нить над морем расправляется по мере прокрутки: спутанный клубок слева становится ровной линией. Надпись в круге меняется в такт кольцам. */
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const meta = document.querySelector('.lx-hero__meta');
  const words = ['ara ver', 'kendine vakit ayır'];
  if (meta) meta.dataset.n = words[0];
  if (still) return;
  let k = 0;
  setInterval(() => { if (document.hidden || !meta) return; k = 1 - k; meta.dataset.n = words[k]; }, 8000);
  const threads = [...document.querySelectorAll('.nf-thread')];
  const build = (W, y, p) => {
    const big = W > 800, x0 = W * 0.03, x1 = W * 0.97, tang = big ? W * 0.06 : 40, amp = big ? 56 : 15, n = 220;
    let d = '';
    for (let i = 0; i < n; i++) {
      const s = i / (n - 1), w = Math.max(0, 1 - s * 2.6) ** 0.8 * (1 - p);
      const X = x0 + (x1 - x0) * s + w * tang * Math.sin(61 * s + 0.6) + w * tang * 0.6 * Math.cos(97 * s);
      const Y = y + w * amp * Math.sin(83 * s + 1.1) + w * amp * 0.6 * Math.cos(41 * s) + (1 - w) * 3 * Math.sin(s * 9);
      d += `${i ? 'L' : 'M'}${X.toFixed(1)} ${Y.toFixed(1)}`;
    }
    return d;
  };
  let tick = false;
  const paint = () => {
    tick = false;
    const p = Math.min(scrollY / 340, 1);
    threads.forEach((t) => { if (t.getClientRects().length) t.setAttribute('d', build(+t.dataset.w, +t.dataset.y, p)); });
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(paint); } }, { passive: true });
})();
