/* Eşkal: в первом кадре полоски из фотобудки не значок, а сам признак: кудри, усы, очки, рост. */
(() => {
  const ink = '#111';
  const head = (o = {}) => {
    let h = `<path d="M6 60c0-14 10-20 24-20s24 6 24 20z" fill="#3a3a3a"/><circle cx="30" cy="26" r="16" fill="#e4e4de"/>`;
    if (o.hair === 'dark') h += `<path d="M14 26c-2-20 34-20 32 0-6-7-26-7-32 0z" fill="${ink}"/>`;
    if (o.hair === 'blond') h += `<path d="M13 28c-3-22 37-22 34 0-3-8-8-11-12-11-6 2-12 2-16 0-3 2-4 6-6 11z" fill="#fff" stroke="${ink}" stroke-width="1.500"/>`;
    if (o.hair === 'curl') h += [[14, 20], [19, 12], [27, 8], [35, 8], [42, 13], [46, 21]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.500" fill="${ink}"/>`).join('');
    if (o.hair === 'gray') h += `<path d="M14 24c-2-16 34-16 32 0-6-6-26-6-32 0z" fill="#fff" stroke="${ink}"/>`;
    if (o.bald) h += `<path d="M21 15q9-5 18 0" fill="none" stroke="#fff" stroke-width="2"/>`;
    h += o.eyes === 'big' ? `<circle cx="24" cy="26" r="4" fill="#fff" stroke="${ink}"/><circle cx="36" cy="26" r="4" fill="#fff" stroke="${ink}"/><circle cx="24" cy="26" r="2" fill="${ink}"/><circle cx="36" cy="26" r="2" fill="${ink}"/>` : `<circle cx="24" cy="26" r="1.600" fill="${ink}"/><circle cx="36" cy="26" r="1.600" fill="${ink}"/>`;
    if (o.glass) h += `<g fill="none" stroke="${ink}" stroke-width="1.600"><circle cx="24" cy="26" r="5"/><circle cx="36" cy="26" r="5"/><path d="M29 26h2"/></g>`;
    if (o.beard) h += `<path d="M15 30c0 12 8 13 15 13s15-1 15-13c-3 4-6 3-9 2-4-1-8-1-12 0-3 1-6 2-9-2z" fill="${ink}"/>`;
    if (o.mous) h += `<path d="M22 33q4-3 8-1q4-2 8 1q-4 3-8 1q-4 2-8-1z" fill="${ink}"/>`;
    if (o.smile) h += `<path d="M24 34q6 5 12 0" fill="none" stroke="${ink}" stroke-width="1.500" stroke-linecap="round"/>`;
    if (o.lines) h += `<path d="M18 20h5M37 20h5M20 36l3 2M40 36l-3 2" stroke="${ink}" stroke-width="1"/>`;
    return h;
  };
  const body = (w, top) => { const x = 30 - w / 2; return `<path d="M0 ${top}H60" stroke="#c8f000" stroke-width="1.500"/><circle cx="30" cy="${top + 7}" r="6" fill="#e4e4de"/><path d="M${x} 60V${top + 22}c0-5 ${w / 4}-7 ${w / 2}-7s${w / 2} 2 ${w / 2} 7V60z" fill="#e4e4de"/>`; };
  const S = {
    boy: body(14, 12), 'uzun boylu': body(14, 4), 'kısa boylu': body(14, 28), 'orta boylu': body(14, 16), 'zayıf': body(8, 12), 'şişman': body(32, 12),
    'saç': head({ hair: 'dark' }), 'sarışın': head({ hair: 'blond', smile: 1 }), esmer: head({ hair: 'dark', smile: 1 }), 'kıvırcık': head({ hair: 'curl' }), kel: head({ bald: 1 }), sakal: head({ hair: 'dark', beard: 1 }), 'bıyık': head({ hair: 'dark', mous: 1 }),
    'göz': head({ hair: 'dark', eyes: 'big' }), 'gözlüklü': head({ hair: 'dark', glass: 1 }), 'güzel': head({ hair: 'curl', smile: 1 }), 'yakışıklı': head({ hair: 'dark', smile: 1, mous: 1 }), 'genç': head({ hair: 'blond', eyes: 'big', smile: 1 }), 'yaşlı': head({ hair: 'gray', glass: 1, lines: 1 }),
  };
  document.querySelectorAll('.lx-card').forEach((c) => {
    const ico = c.querySelector('.lx-ico'); const s = S[c.dataset.word];
    if (ico && s) { ico.innerHTML = `<svg viewBox="0 0 60 60" aria-hidden="true" focusable="false">${s}</svg>`; ico.classList.add('is-face'); }
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || seen.has(e.target)) return;
    seen.add(e.target); io.unobserve(e.target);
    gsap.from(e.target, { x: -18, opacity: 0, duration: 0.32, ease: 'steps(4)', clearProps: 'transform,opacity,x' });
  }), { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.lx-card').forEach((c) => io.observe(c));
})();
