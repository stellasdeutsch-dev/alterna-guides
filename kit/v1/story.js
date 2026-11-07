/* Alterna kit v1: урок маршрута в виде мини-истории. Без вкладок: главы идут одна за другой, тема объясняется через
   сюжет. Здесь: слова в рассказе (звук и перевод по нажатию), выборы героя, оглавление с полосой чтения, вход глав
   и кольцо прогресса. Свободные ответы, «а у тебя?» — в day.js. Разметку собирает pnpm day:build (tale в day.json). */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const anim = () => !!window.gsap && !reduce;
  const tracker = (m, ...a) => window.AlternaTracker?.[m]?.(...a);

  /* ---------- кольцо прогресса: главы прочитаны, выборы сделаны, задания и тест ---------- */
  const seen = new Set();
  const solved = new Set();
  const chapters = $$('.st-ch');
  const choices = $$('[data-choice]');
  const practiceIds = $$('[data-section="practice"] a-exercise').map((x) => x.getAttribute('ref'));
  const quizId = $('a-quiz')?.getAttribute('ref');
  let exDone = 0;
  let quizOk = false;
  function ring() {
    const total = chapters.length + choices.length + practiceIds.length + (quizId ? 1 : 0);
    const got = seen.size + solved.size + exDone + (quizOk ? 1 : 0);
    const pct = Math.round((100 * got) / Math.max(1, total));
    const svg = $('.lx-app__ring');
    const fg = svg && $('.lx-ring__fg', svg);
    if (fg) {
      if (anim()) {
        const o = { v: Number(fg.dataset.v || 0) };
        gsap.to(o, { v: pct, duration: 0.6, ease: 'power2.out', onUpdate: () => fg.setAttribute('stroke-dasharray', `${o.v.toFixed(2)} 100`) });
      } else fg.setAttribute('stroke-dasharray', `${pct} 100`);
      fg.dataset.v = String(pct);
      $('text', svg).textContent = `${pct}%`;
    }
    $('.lx-app__prog')?.setAttribute('title', `Пройдено: ${pct}%`);
  }
  setInterval(() => {
    const st = tracker('state');
    if (!st) return;
    const ex = st.exercises || {};
    const d = practiceIds.filter((id) => ex[id]?.done).length;
    const q = !!(quizId && ex[quizId]?.passed);
    if (d !== exDone || q !== quizOk) { exDone = d; quizOk = q; ring(); }
  }, 1500);

  /* ---------- слова в рассказе: звук даёт kit по data-say, здесь — перевод ---------- */
  document.addEventListener('click', (e) => {
    const w = e.target.closest('.st-w');
    if (!w) return;
    const open = w.getAttribute('aria-expanded') !== 'true';
    w.setAttribute('aria-expanded', String(open));
    w.classList.toggle('is-open', open);
    w.classList.add('is-heard');
    if (open && anim()) gsap.fromTo($('.st-w__ru', w), { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out', clearProps: 'transform,opacity' });
  });

  /* ---------- выбор героя: неверный ответ — забавное последствие и ещё попытка ---------- */
  choices.forEach((box) => {
    const out = $('.st-choice__then', box);
    $$('.st-opt', box).forEach((b) => b.addEventListener('click', () => {
      if (box.classList.contains('is-solved')) return;
      const ok = b.dataset.ok === 'true';
      b.classList.add(ok ? 'is-ok' : 'is-miss');
      out.hidden = false;
      out.className = `st-choice__then ${ok ? 'is-ok' : 'is-miss'}`;
      out.textContent = ok ? b.dataset.then : `${b.dataset.then} Попробуй другой ответ.`;
      if (ok) {
        box.classList.add('is-solved');
        $$('.st-opt', box).forEach((x) => { if (x !== b) x.disabled = true; });
        solved.add(box.dataset.choice);
        ring();
      } else b.disabled = true;
      if (anim()) {
        gsap.fromTo(out, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out', clearProps: 'transform,opacity' });
        if (ok) gsap.fromTo(b, { scale: 0.96 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
        else gsap.fromTo(b, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
      }
    }));
  });

  /* ---------- главы: вход при прокрутке, засчитываем прочитанное ---------- */
  const io = new IntersectionObserver((list) => {
    list.forEach((en) => {
      if (!en.isIntersecting) return;
      const ch = en.target;
      io.unobserve(ch);
      if (!seen.has(ch.id)) { seen.add(ch.id); ring(); }
      if (anim()) {
        gsap.from($$('.st-ch__k, .st-ch__h, .st-p, .st-b, .st-note, .st-quirk, .st-choice', ch), { y: 18, opacity: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', clearProps: 'transform,opacity' });
        gsap.from($('.st-ch__n', ch), { scale: 0, rotation: -60, duration: 0.6, ease: 'back.out(2.5)', clearProps: 'transform' });
      }
    });
  }, { rootMargin: '0px 0px -25% 0px' });
  chapters.forEach((c) => io.observe(c));

  /* ---------- оглавление: где ты сейчас, полоса прочитанного ---------- */
  const toc = $('.st-toc');
  const links = $$('[data-toc]');
  const targets = links.map((a) => document.getElementById(a.dataset.toc)).filter(Boolean);
  const progress = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    toc?.style.setProperty('--p', Math.min(1, scrollY / max).toFixed(4));
    const line = innerHeight * 0.35;
    let cur = targets[0];
    for (const t of targets) if (t.getBoundingClientRect().top < line) cur = t;
    links.forEach((a) => {
      const on = a.dataset.toc === cur?.id;
      if (on && !a.classList.contains('is-cur')) {
        /* текущий раздел виден в полосе оглавления на телефоне */
        const l = a.closest('.st-toc__l');
        if (l && l.scrollWidth > l.clientWidth) l.scrollTo({ left: Math.max(0, a.offsetLeft - (l.clientWidth - a.offsetWidth) / 2), behavior: reduce ? 'auto' : 'smooth' });
      }
      a.classList.toggle('is-cur', on);
      if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
  };
  addEventListener('scroll', progress, { passive: true });
  addEventListener('resize', progress);
  progress();
  /* плеер и автопроверка просят показать секцию */
  addEventListener('alterna:goto', (e) => document.getElementById(`p-${e.detail?.section}`)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }));

  /* ---------- вход: счётчики и подписи ---------- */
  if (anim()) {
    $$('.lx-stats b').forEach((b) => {
      const to = Number(b.textContent) || 0;
      const o = { v: 0 };
      gsap.to(o, { v: to, duration: 0.9, ease: 'power2.out', delay: 0.15, onUpdate: () => { b.textContent = String(Math.round(o.v)); } });
    });
    gsap.from('.st-toc__l li', { y: 8, opacity: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out', clearProps: 'transform,opacity' });
  }
  ring();
})();
