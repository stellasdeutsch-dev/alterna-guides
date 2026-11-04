/* Album: в карточках родных вместо значка стоит маленький сепийный снимок. Снимки ложатся на страницу при прокрутке. */
(() => {
  const P = { anne: 'f', baba: 'm', 'çocuk': 'k', 'oğul': 'b', 'kız': 'g', bebek: 'y', 'kardeş': 'kk', abla: 'g', 'ağabey': 'b', 'kız kardeş': 'g', 'erkek kardeş': 'b', 'kaç kardeşsin?': 'kk', ikiz: 'kk', anneanne: 'o', babaanne: 'o', dede: 'd', torun: 'k', aile: 'fm', amca: 'd', 'dayı': 'm', hala: 'f', teyze: 'f', kuzen: 'k', 'yeğen': 'b', akraba: 'fm', 'enişte': 'm', yenge: 'f', kayınvalide: 'o', 'eş': 'fm', evli: 'fm', 'bekâr': 'm', 'boşanmış': 'f', sevgili: 'fm', 'nişanlı': 'fm', 'evli misin?': 'fm' };
  const skin = '#e6d4b8'; const ink = '#3b2c1c';
  const fig = (t, x, s) => {
    const body = `<path d="M${x - 15 * s} 60c0-${16 * s} ${6 * s}-${20 * s} ${15 * s}-${20 * s}s${15 * s} ${4 * s} ${15 * s} ${20 * s}z" fill="${ink}"/>`;
    const head = `<circle cx="${x}" cy="${46 - 22 * s}" r="${10 * s}" fill="${skin}"/>`;
    const cy = 46 - 22 * s; let hair = '';
    if (t === 'f' || t === 'g') hair = `<path d="M${x - 11 * s} ${cy + 8 * s}c-${3 * s}-${22 * s} ${25 * s}-${22 * s} ${22 * s} 0c-${3 * s} ${2 * s}-${4 * s}-${8 * s}-${11 * s}-${10 * s}c-${6 * s} ${2 * s}-${8 * s} ${12 * s}-${11 * s} ${10 * s}z" fill="${ink}"/>`;
    if (t === 'm' || t === 'b') hair = `<path d="M${x - 10 * s} ${cy - 1}c0-${13 * s} ${20 * s}-${13 * s} ${20 * s} 0c-${6 * s}-${4 * s}-${14 * s}-${4 * s}-${20 * s} 0z" fill="${ink}"/>`;
    if (t === 'm') hair += `<path d="M${x - 5} ${cy + 4}q5 -3 10 0q-5 3 -10 0z" fill="${ink}"/>`;
    if (t === 'o') hair = `<path d="M${x - 11 * s} ${cy + 2}c-${2 * s}-${15 * s} ${24 * s}-${15 * s} ${22 * s} 0c-${5 * s}-${5 * s}-${16 * s}-${5 * s}-${22 * s} 0z" fill="#f4ecdc"/><circle cx="${x}" cy="${cy - 11 * s}" r="${4 * s}" fill="#f4ecdc"/>`;
    if (t === 'd') hair = `<path d="M${x - 10 * s} ${cy - 2}c0-${11 * s} ${20 * s}-${11 * s} ${20 * s} 0c-${5 * s}-${3 * s}-${15 * s}-${3 * s}-${20 * s} 0z" fill="#f4ecdc"/><path d="M${x - 6} ${cy + 4}q6 -3 12 0q-6 4 -12 0z" fill="#f4ecdc"/>`;
    if (t === 'y') hair = `<path d="M${x - 2} ${cy - 9 * s}q4 -5 7 -1" fill="none" stroke="${ink}" stroke-width="1.500"/>`;
    return body + head + hair;
  };
  const img = (c) => {
    let g = '';
    if (c === 'fm') g = fig('f', 18, 1) + fig('m', 42, 1.1);
    else if (c === 'kk') g = fig('b', 20, .85) + fig('g', 40, .85);
    else if (c === 'k') g = fig('b', 30, .85);
    else if (c === 'y') g = fig('y', 30, .75);
    else if (c === 'b' || c === 'g') g = fig(c, 30, .9);
    else g = fig(c, 30, 1.2);
    return `<svg viewBox="0 0 60 60" aria-hidden="true" focusable="false"><rect width="60" height="60" fill="#b6a485"/><path d="M0 44q30-8 60 0v16H0z" fill="#9b8a6c"/>${g}</svg>`;
  };
  document.querySelectorAll('.lx-card').forEach((c, i) => {
    c.style.setProperty('--tilt', `${[-1.200, .9, -.6, 1.300, -.9, .5][i % 6]}deg`);
    const ico = c.querySelector('.lx-ico'); const k = P[c.dataset.word];
    if (ico && k) { ico.innerHTML = img(k); ico.classList.add('is-photo'); }
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { y: 16, opacity: 0, scale: .98, duration: 0.5, ease: 'power2.out', clearProps: 'transform,opacity,scale,y' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
