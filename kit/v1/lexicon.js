/* Alterna kit v1 — поведение гайдов лексики: разделы, облако слов, карточки словаря, история с турецкими вставками,
   пошаговые диалоги, квест-симулятор, шпаргалка, свой скроллбар и печать ачивки. Разметку собирает pnpm lex:build. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const anim = () => !!window.gsap && !reduce;
  const say = (t) => window.AlternaKit?.speak(t);
  const tracker = (m, ...a) => window.AlternaTracker?.[m]?.(...a);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  /* ---------- облако слов ---------- */
  function cloud() {
    const ws = $$('.lx-cloud__w');
    if (!anim() || !ws.length) return;
    gsap.from(ws, { y: 18, opacity: 0, scale: 0.85, duration: 0.5, stagger: 0.04, ease: 'back.out(2)', delay: 0.15 });
    ws.forEach((w, i) => gsap.to(w, { y: i % 2 ? 3 : -3, duration: 1.8 + (i % 5) * 0.25, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.8 + (i % 7) * 0.1 }));
    document.addEventListener('click', (e) => {
      const w = e.target.closest('.lx-cloud__w');
      if (w) gsap.fromTo(w, { scale: 1.15 }, { scale: 1, duration: 0.45, ease: 'elastic.out(1, .4)' });
    });
  }

  /* ---------- оглавление разделов ---------- */
  function nav() {
    $$('[data-goto]').forEach((b) => b.addEventListener('click', () => $(`[data-section="${b.dataset.goto}"]`)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })));
    if (anim()) gsap.from('.lx-nav__b', { y: 14, opacity: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out', delay: 0.1 });
  }

  /* ---------- история: турецкие вставки звучат и показывают перевод ---------- */
  function story() {
    const box = $('.lx-story');
    if (!box) return;
    box.addEventListener('click', (e) => {
      const w = e.target.closest('.lx-tw');
      if (!w) return;
      $$('.lx-tw.is-on', box).forEach((x) => x !== w && x.classList.remove('is-on'));
      w.classList.toggle('is-on');
      if (anim()) gsap.fromTo(w, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    });
    if (anim()) ScrollTrigger.batch($$('p', box), { start: 'top 88%', once: true, onEnter: (b) => gsap.from(b, { y: 20, opacity: 0, duration: 0.5, stagger: 0.12 }) });
  }

  /* ---------- карточки: учить / проверить себя ---------- */
  function cards() {
    const sec = $('[data-section="sozluk"]');
    if (!sec) return;
    const all = $$('.lx-card', sec);
    const score = $('.lx-score', sec);
    const known = $('[data-known]', sec);
    const retry = $('[data-retry]', sec);
    if (anim()) {
      gsap.set(all, { y: 26, opacity: 0 });
      ScrollTrigger.batch(all, { start: 'top 92%', once: true, onEnter: (b) => gsap.to(b, { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out' }) });
    }
    const update = () => {
      known.textContent = String(all.filter((c) => c.classList.contains('is-known')).length);
      const left = all.filter((c) => c.classList.contains('is-unknown')).length;
      retry.hidden = !left || all.some((c) => !c.classList.contains('is-known') && !c.classList.contains('is-unknown'));
      if (sec.classList.contains('lx--retry') && !left) sec.classList.remove('lx--retry');
    };
    $$('[data-mode]', sec).forEach((b) => b.addEventListener('click', () => {
      const test = b.dataset.mode === 'test';
      $$('[data-mode]', sec).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      sec.classList.toggle('lx--test', test);
      all.forEach((c) => c.classList.remove('is-ex', 'is-open'));
      $$('.lx-card__more', sec).forEach((m) => { m.textContent = 'Примеры'; m.setAttribute('aria-expanded', 'false'); });
      score.hidden = !test;
      if (!test) sec.classList.remove('lx--retry');
      if (anim()) gsap.fromTo($$('.lx-card', sec).filter((c) => c.offsetParent), { rotationY: test ? -12 : 12, opacity: 0.4 }, { rotationY: 0, opacity: 1, duration: 0.45, stagger: 0.03, ease: 'power2.out' });
      update();
    }));
    sec.addEventListener('click', (e) => {
      const c = e.target.closest('.lx-card');
      if (!c) return;
      const more = e.target.closest('.lx-card__more');
      if (more) {
        const open = !c.classList.contains('is-ex');
        c.classList.toggle('is-ex', open);
        more.setAttribute('aria-expanded', String(open));
        more.textContent = open ? 'Скрыть примеры' : 'Примеры';
        if (open && anim()) gsap.from($$('.lx-ex, .lx-card__note', c), { opacity: 0, y: -8, duration: 0.35, stagger: 0.06 });
      } else if (e.target.closest('.lx-card__reveal')) {
        c.classList.add('is-open', 'is-ex');
        say(c.dataset.word);
        if (anim()) gsap.from($$('.lx-card__ru, .lx-ex', c), { opacity: 0, y: -8, duration: 0.35, stagger: 0.05 });
      } else if (e.target.closest('[data-know]')) {
        const ok = e.target.closest('[data-know]').dataset.know === '1';
        c.classList.remove('is-known', 'is-unknown');
        c.classList.add(ok ? 'is-known' : 'is-unknown');
        if (anim()) gsap.fromTo(c, { scale: 0.97 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
        update();
      }
    });
    retry.addEventListener('click', () => {
      all.filter((c) => c.classList.contains('is-unknown')).forEach((c) => c.classList.remove('is-open', 'is-ex', 'is-unknown'));
      sec.classList.add('lx--retry');
      update();
      sec.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
    /* сколько карточек ученик уже видел — для своего скроллбара */
    const seen = new Set();
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { seen.add(en.target); bar.words(seen.size, all.length); } }), { threshold: 0.6 });
    all.forEach((c) => io.observe(c));
    bar.words(0, all.length);
  }

  /* ---------- квест-симулятор: переписка с персонажем — нестандартное упражнение ---------- */
  async function simulator() {
    const root = $('a-exercise[data-sim]');
    if (!root || !window.AlternaKit) return;
    const id = root.getAttribute('ref');
    let data;
    try { data = await AlternaKit.exercise(id); } catch { return; } // kit сам покажет «Нет связи»
    const steps = data.items;
    const who = data.character || { name: 'Bot', role: '' };
    const top = el('div', 'lx-sim__top');
    const ava = el('span', 'lx-sim__ava', who.name.slice(0, 1));
    const name = el('div', 'lx-sim__name');
    name.append(el('b', '', who.name), el('small', '', who.role));
    const prog = el('div', 'lx-sim__prog');
    const progFill = el('span');
    prog.append(progFill);
    top.append(ava, name, prog);
    const feed = el('div', 'lx-sim__feed');
    feed.setAttribute('aria-live', 'polite');
    const choices = el('div', 'lx-sim__choices');
    const hint = el('p', 'lx-sim__hint');
    const start = el('button', 'ak-btn', 'Начать переписку');
    start.type = 'button';
    const foot = el('div', 'ak-ex__foot');
    foot.append(start);
    root.classList.add('ak-ex', 'lx-sim');
    root.replaceChildren(top, el('p', 'lx-sim__place', data.description || ''), feed, hint, choices, foot);

    let i = 0; let correct = 0; let tries = 0; let t0 = 0; let running = false; let wait = false;
    const bubble = (side, tr, ru) => {
      const b = el('div', `lx-sim__msg lx-sim__msg--${side}`);
      const t = el('p', 'lx-sim__tr', tr);
      t.lang = 'tr';
      t.dataset.say = tr;
      b.append(t, el('p', 'lx-sim__ru', ru));
      feed.append(b);
      if (anim()) gsap.from(b, { y: 12, opacity: 0, scale: 0.95, transformOrigin: side === 'me' ? 'right bottom' : 'left bottom', duration: 0.35, ease: 'back.out(2)' });
      feed.scrollTop = feed.scrollHeight;
      return b;
    };
    const typing = () => new Promise((res) => {
      const d = el('div', 'lx-sim__msg lx-sim__msg--bot lx-sim__typing');
      d.append(el('i'), el('i'), el('i'));
      feed.append(d);
      setTimeout(() => { d.remove(); res(); }, reduce ? 150 : 650);
    });
    const progress = () => { progFill.style.width = `${(100 * i) / steps.length}%`; };
    const ask = async () => {
      const st = steps[i];
      hint.textContent = '';
      choices.replaceChildren();
      await typing();
      bubble('bot', st.bot.tr, st.bot.ru);
      say(st.bot.tr);
      st.options.forEach((o, k) => {
        const b = el('button', 'lx-sim__opt');
        b.type = 'button';
        b.dataset.k = String(k);
        const t = el('b', '', o.tr);
        t.lang = 'tr';
        b.append(el('span', 'lx-sim__n', String(k + 1)), t, el('small', '', o.ru));
        choices.append(b);
      });
      if (anim()) gsap.from(choices.children, { y: 10, opacity: 0, duration: 0.3, stagger: 0.06 });
      tries = 0; t0 = performance.now(); wait = false;
    };
    const pick = async (k) => {
      if (wait || !running) return;
      const st = steps[i];
      const btn = choices.children[k];
      if (!btn || btn.disabled) return;
      tries++;
      const ok = k === st.answer;
      tracker('answer', { exerciseId: id, itemId: st.id, correct: ok, attempt: tries, answer: st.options[k].tr, timeMs: Math.round(performance.now() - t0) });
      if (!ok) {
        btn.disabled = true;
        btn.classList.add('is-wrong');
        hint.textContent = `Подсказка: ${st.options[k].hint || st.explanation}`;
        if (anim()) gsap.fromTo(btn, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, .3)' });
        return;
      }
      wait = true;
      if (tries === 1) correct++;
      choices.replaceChildren();
      hint.textContent = '';
      bubble('me', st.options[k].tr, st.options[k].ru);
      say(st.options[k].tr);
      i++;
      progress();
      if (st.reply) { await typing(); bubble('bot', st.reply.tr, st.reply.ru); }
      if (i < steps.length) setTimeout(ask, reduce ? 100 : 500);
      else finish();
    };
    const finish = async () => {
      running = false;
      if (data.final) { await typing(); bubble('bot', data.final.tr, data.final.ru); }
      tracker('complete', { exerciseId: id, correct, total: steps.length });
      const r = el('div', 'lx-sim__done');
      r.append(el('b', '', `${correct} из ${steps.length} с первой попытки`), el('span', '', correct === steps.length ? 'Как местный!' : 'Пройди ещё раз — станет легче.'));
      feed.append(r);
      if (anim()) gsap.from(r, { scale: 0.8, opacity: 0, duration: 0.5, ease: 'back.out(2)' });
      start.textContent = 'Ещё раз';
      start.hidden = false;
    };
    const begin = () => {
      i = 0; correct = 0; running = true;
      feed.replaceChildren();
      start.hidden = true;
      progress();
      tracker('start', id, 'practice');
      ask();
    };
    start.addEventListener('click', begin);
    choices.addEventListener('click', (e) => { const b = e.target.closest('.lx-sim__opt'); if (b) pick(Number(b.dataset.k)); });
    feed.addEventListener('click', (e) => { const t = e.target.closest('.lx-sim__tr'); if (t) say(t.dataset.say); });
    root.addEventListener('keydown', (e) => { if (/^[1-3]$/.test(e.key)) pick(Number(e.key) - 1); });
    /* для автопроверки: проходит квест правильными ответами */
    AlternaKit.registerSolver(id, async () => {
      if (!running) begin();
      while (running) {
        if (!wait && choices.children.length) pick(steps[i].answer);
        await new Promise((r) => setTimeout(r, 300));
      }
    });
  }

  /* ---------- диалоги по шагам ---------- */
  function dialogues() {
    $$('.lx-dlg').forEach((box) => {
      const chat = $('[data-chat]', box);
      const lines = $$('.lx-msg', chat);
      const next = $('[data-next]', box);
      const allBtn = $('[data-all]', box);
      let shown = 1;
      chat.classList.add('is-step');
      lines.forEach((l, i) => l.classList.toggle('is-hidden', i > 0));
      const reveal = (l) => {
        l.classList.remove('is-hidden');
        if (anim()) gsap.from(l, { y: 14, opacity: 0, scale: 0.96, transformOrigin: l.classList.contains('lx-msg--me') ? 'right bottom' : 'left bottom', duration: 0.4, ease: 'back.out(2)' });
      };
      const sync = () => { next.disabled = allBtn.disabled = shown >= lines.length; window.ScrollTrigger?.refresh(); };
      next.addEventListener('click', () => {
        if (shown >= lines.length) return;
        const l = lines[shown++];
        reveal(l);
        say($('.lx-msg__tr', l).dataset.say);
        sync();
      });
      allBtn.addEventListener('click', () => { while (shown < lines.length) reveal(lines[shown++]); sync(); });
      $('[data-ru]', box).addEventListener('change', (e) => chat.classList.toggle('no-ru', !e.target.checked));
      sync();
    });
  }

  /* ---------- шпаргалка ---------- */
  function cheat() {
    const table = $('.lx-table');
    if (!table) return;
    $('[data-hide-ru]').addEventListener('change', (e) => { table.classList.toggle('no-ru', e.target.checked); $$('tr', table).forEach((r) => r.classList.remove('peek')); });
    table.addEventListener('click', (e) => { const r = e.target.closest('tr'); if (r && table.classList.contains('no-ru')) r.classList.toggle('peek'); });
    if (anim()) ScrollTrigger.create({ trigger: table, start: 'top 85%', once: true, onEnter: () => gsap.from($$('tr', table), { x: -16, opacity: 0, duration: 0.35, stagger: 0.03 }) });
  }

  /* ---------- свой скроллбар: маршрут урока с остановками-секциями ---------- */
  const bar = {
    words: (n, total) => { if (bar.thumb) bar.thumb.textContent = `${n}/${total}`; },
  };
  function scrollbar() {
    const nav = $('[data-scrollbar]');
    if (!nav) return;
    const track = el('div', 'lx-bar__track');
    const fill = el('span', 'lx-bar__fill');
    const thumb = el('span', 'lx-bar__thumb', '0/0');
    thumb.setAttribute('aria-hidden', 'true');
    track.append(fill);
    const secs = $$('[data-section]');
    const max = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const vertical = () => matchMedia('(min-width: 768px)').matches;
    const marks = secs.map((s) => {
      const b = el('button', 'lx-bar__mark');
      b.type = 'button';
      b.dataset.key = s.dataset.section;
      b.setAttribute('aria-label', `К разделу «${$('h1, h2', s)?.textContent || s.dataset.section}»`);
      b.addEventListener('click', () => s.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }));
      track.append(b);
      return b;
    });
    track.append(thumb);
    nav.append(track);
    bar.thumb = thumb;
    const layout = () => marks.forEach((b, i) => b.style.setProperty('--at', Math.min(1, secs[i].offsetTop / max()).toFixed(4)));
    const progress = () => nav.style.setProperty('--p', Math.min(1, scrollY / max()).toFixed(4));
    const seek = (e) => {
      const r = track.getBoundingClientRect();
      const p = vertical() ? (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width;
      scrollTo(0, Math.max(0, Math.min(1, p)) * max());
    };
    track.addEventListener('pointerdown', (e) => { if (e.target.closest('.lx-bar__mark')) return; track.setPointerCapture(e.pointerId); seek(e); });
    track.addEventListener('pointermove', (e) => { if (track.hasPointerCapture(e.pointerId)) seek(e); });
    addEventListener('scroll', progress, { passive: true });
    addEventListener('resize', () => { layout(); progress(); });
    addEventListener('load', layout);
    addEventListener('alterna:read', (e) => {
      const m = marks.find((b) => b.dataset.key === e.detail.key);
      if (!m || m.classList.contains('is-read')) return;
      m.classList.add('is-read');
      if (anim()) gsap.fromTo(m, { scale: 1.8 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
    });
    layout();
    progress();
  }

  /* ---------- ачивка: печать в паспорт города ---------- */
  addEventListener('alterna:achievement', ({ detail }) => {
    const s = detail.badge.querySelector('.lx-stamp');
    if (!s) return;
    detail.timeline
      .fromTo(s, { scale: 2.6, rotation: -32, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, rotation: -9, opacity: 1, duration: 0.42, ease: 'power4.in' }, 0.5)
      .fromTo(detail.card, { x: 0 }, { x: 4, duration: 0.05, yoyo: true, repeat: 5, ease: 'none' }, 0.92)
      .from(s.querySelector('.lx-stamp__n'), { scale: 0.4, transformOrigin: '50% 50%', duration: 0.5, ease: 'elastic.out(1, .4)' }, 1);
  });

  function init() {
    scrollbar();
    nav();
    cloud();
    cards();
    story();
    dialogues();
    cheat();
    simulator();
    if (window.ScrollTrigger) addEventListener('orientationchange', () => ScrollTrigger.refresh());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
