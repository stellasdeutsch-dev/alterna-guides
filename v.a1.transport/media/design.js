/* Otogar: собираем табло из букв и перекидываем их. Автобус едет быстрее при прокрутке. */
(() => {
  const rows = [...document.querySelectorAll('.ot-row')];
  const LEN = 7;
  const CH = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ0123456789: ';
  const group = (txt, cls) => { const g = document.createElement('span'); g.className = `ot-g ${cls}`; [...txt].forEach((c) => { const f = document.createElement('span'); f.className = 'ot-f'; f.dataset.c = c; f.textContent = c; g.append(f); }); return g; };
  rows.forEach((r) => { r.append(group(r.dataset.t, 'ot-g--t'), group(r.dataset.flap.padEnd(LEN, ' '), ''), group(r.dataset.p, 'ot-g--t')); });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const spin = (f, delay) => {
    const end = f.dataset.c; let n = 6 + Math.floor(Math.random() * 8);
    setTimeout(function step() {
      if (n-- <= 0) { f.textContent = end; return; }
      f.textContent = CH[Math.floor(Math.random() * CH.length)];
      setTimeout(step, 70);
    }, delay);
  };
  const flipAll = () => rows.forEach((r, i) => r.querySelectorAll('.ot-f').forEach((f, k) => spin(f, i * 120 + k * 35)));
  flipAll();
  /* раз в 14 секунд две строки табло меняются местами, пока сцена на экране */
  const words = ['OTOBÜS', 'METRO', 'DOLMUŞ', 'TRAMVAY', 'TREN', 'TAKSİ', 'UÇAK'];
  let w = 4;
  const scene = document.querySelector('.lx-scene');
  setInterval(() => {
    if (!scene || scene.getBoundingClientRect().bottom < 0 || document.hidden) return;
    const r = rows[Math.floor(Math.random() * rows.length)];
    const fs = r.querySelectorAll('.ot-g:not(.ot-g--t) .ot-f');
    const txt = words[w++ % words.length].padEnd(LEN, ' ');
    fs.forEach((f, k) => { f.dataset.c = txt[k]; spin(f, k * 40); });
  }, 7000);
})();
