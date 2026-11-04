/* Makale: сноски: каждое найденное слово в истории получает номер. Маркер в сцене дорисовывается по мере прокрутки. */
(() => {
  document.querySelectorAll('.lx-story').forEach((st) => { let n = 0; st.querySelectorAll('.lx-tw').forEach((t) => { n += 1; t.style.setProperty('--fn', `"${n}"`); }); });
  const hl = document.querySelector('.mk-hl');
  if (!hl || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const len = hl.getTotalLength();
  hl.style.strokeDasharray = String(len);
  let raf = 0;
  const go = () => { raf = 0; hl.style.strokeDashoffset = String(len * Math.max(0, 1 - scrollY / 260 - 0.35)); };
  go();
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(go); }, { passive: true });
})();
