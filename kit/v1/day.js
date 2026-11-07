/* Alterna kit v1: поведение уроков маршрута «день в городе». Общая часть (вкладки, словарь, диалог, квест, тест)
   — в lexicon.js; здесь блоки, которых у лексики нет: цель дня, подготовка, текст для чтения, «а у тебя?»
   и задания со свободным ответом (ответ пишешь сам, потом сравниваешь с образцом). Разметку собирает pnpm day:build. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const anim = () => !!window.gsap && !reduce;
  const say = (t) => window.AlternaKit?.speak(t);
  const tracker = (m, ...a) => window.AlternaTracker?.[m]?.(...a);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  /* панель стала видимой: lexicon.js ставит is-active — ловим, чтобы проиграть вход блока один раз */
  const onShow = (key, fn) => {
    const p = $(`.lx-panel[data-section="${key}"]`);
    if (!p) return;
    let done = false;
    const run = () => { if (!done && p.classList.contains('is-active')) { done = true; fn(p); } };
    new MutationObserver(run).observe(p, { attributes: true, attributeFilter: ['class'] });
    run();
  };

  /* ---------- цель дня: фразы выезжают по одной, номер «щёлкает» ---------- */
  function goal() {
    onShow('hedef', (p) => {
      if (!anim()) return;
      gsap.from($$('.dy-goal__i', p), { x: -24, opacity: 0, duration: 0.45, stagger: 0.09, ease: 'power3.out', clearProps: 'transform,opacity' });
      gsap.from($$('.dy-goal__n', p), { scale: 0, rotation: -90, duration: 0.5, stagger: 0.09, ease: 'back.out(3)', delay: 0.1, clearProps: 'transform' });
      gsap.from($$('.dy-prep__chip', p), { y: 10, opacity: 0, duration: 0.3, stagger: 0.05, delay: 0.35, clearProps: 'transform,opacity' });
    });
    onShow('oyun', (p) => { if (anim()) gsap.from($$('.dy-pairs__i', p), { scale: 0.9, opacity: 0, duration: 0.35, stagger: 0.06, ease: 'back.out(2)', clearProps: 'transform,opacity' }); });
    document.addEventListener('click', (e) => {
      const c = e.target.closest('.dy-prep__chip, .dy-goal__w b');
      if (!c) return;
      c.classList.add('is-heard');
      if (anim()) gsap.fromTo(c, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    });
  }

  /* ---------- текст: предложения подсвечиваются по нажатию, перевод раскрывается ---------- */
  function reading() {
    onShow('okuma', (p) => { if (anim()) gsap.from($$('.dy-read__s', p), { y: 10, opacity: 0, duration: 0.35, stagger: 0.07, ease: 'power2.out', clearProps: 'transform,opacity' }); });
    document.addEventListener('click', (e) => {
      const s = e.target.closest('.dy-read__s');
      if (!s) return;
      $$('.dy-read__s.is-on').forEach((x) => x !== s && x.classList.remove('is-on'));
      s.classList.add('is-on', 'is-heard');
    });
  }

  /* ---------- «а у тебя?»: образец ответа, отметка «сказал вслух» ---------- */
  function you() {
    $$('[data-reveal]').forEach((b) => b.addEventListener('click', () => {
      const m = b.nextElementSibling;
      const open = m.hidden;
      m.hidden = !open;
      b.setAttribute('aria-expanded', String(open));
      b.textContent = open ? 'Скрыть образец' : 'Показать образец';
      if (open) { say(m.dataset.say); if (anim()) gsap.from(m, { y: 8, opacity: 0, duration: 0.35, ease: 'power2.out', clearProps: 'transform,opacity' }); }
    }));
    $$('[data-said]').forEach((c) => c.addEventListener('change', () => {
      const box = c.closest('.dy-speak');
      box.classList.toggle('is-done', c.checked);
      if (c.checked && anim()) gsap.fromTo(box, { scale: 0.97 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
    }));
    onShow('yasiz', (p) => { if (anim()) gsap.from($$('.dy-you, .dy-speak, .dy-culture', p), { y: 16, opacity: 0, duration: 0.4, stagger: 0.12, ease: 'power2.out', clearProps: 'transform,opacity' }); });
  }

  /* ---------- задание со свободным ответом: пишешь сам → образец → сравниваешь ---------- */
  async function free(root) {
    if (!window.AlternaKit) return;
    const id = root.getAttribute('ref');
    let data;
    try { data = await AlternaKit.exercise(id); } catch { return; } // kit сам покажет «Нет связи»
    const items = data.items;
    root.classList.add('ak-ex', 'dy-free');
    let i = 0; let filled = 0; let t0 = 0; let started = 0;
    const render = () => {
      const it = items[i];
      const head = el('div', 'ak-ex__head');
      head.append(el('span', 'ak-ex__title', data.instruction || ''), el('span', 'ak-ex__count', `${i + 1} / ${items.length}`));
      const bar = el('div', 'ak-ex__bar');
      const fill = el('span');
      fill.style.width = `${(100 * i) / items.length}%`;
      bar.append(fill);
      const body = el('div', 'ak-body dy-free__body');
      if (it.q) {
        const q = el('p', 'dy-free__q', it.q);
        q.lang = 'tr';
        q.dataset.say = it.q;
        body.append(q);
      }
      if (it.task) body.append(el('p', 'dy-free__task', it.task));
      const lab = el('label', 'dy-free__lab');
      const ta = el('textarea', 'dy-free__in');
      ta.rows = it.task ? 4 : 2;
      ta.lang = 'tr';
      ta.spellcheck = false;
      ta.setAttribute('autocapitalize', 'sentences');
      ta.placeholder = 'Напиши по-турецки';
      lab.append(el('span', 'dy-free__hint', 'Твой ответ'), ta);
      body.append(lab);
      const fb = el('div', 'ak-feedback');
      fb.setAttribute('aria-live', 'polite');
      const btn = el('button', 'ak-btn', 'Сравнить с образцом');
      btn.type = 'button';
      const foot = el('div', 'ak-ex__foot');
      foot.append(btn);
      root.replaceChildren(head, bar, body, fb, foot);
      t0 = performance.now();
      let shown = false;
      btn.addEventListener('click', () => {
        if (!shown) {
          shown = true;
          const ok = ta.value.trim().length > 1;
          if (ok) filled++;
          tracker('answer', { exerciseId: id, itemId: it.id, type: 'custom', correct: ok, attempt: 1, answer: ta.value.trim(), timeMs: Math.round(performance.now() - t0) });
          ta.readOnly = true;
          fb.className = `ak-feedback ${ok ? 'is-right' : 'is-wrong'}`;
          const m = el('p', 'dy-free__model', it.model);
          m.lang = 'tr';
          m.dataset.say = it.model;
          fb.replaceChildren(el('b', '', ok ? 'Сравни со своим ответом' : 'Попробуй написать сам, а пока образец:'), m, el('p', '', 'Совпадать слово в слово не нужно: важно, чтобы мысль была та же.'));
          if (anim()) gsap.from(fb, { y: 10, opacity: 0, duration: 0.35, ease: 'power2.out', clearProps: 'transform,opacity' });
          btn.textContent = i + 1 < items.length ? 'Дальше' : 'Результат';
          btn.focus({ preventScroll: true });
        } else if (i + 1 < items.length) { i++; render(); $('.dy-free__in', root)?.focus({ preventScroll: true }); }
        else finish();
      });
      ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) btn.click(); });
    };
    const finish = () => {
      tracker('complete', { exerciseId: id, correct: filled, total: items.length, timeMs: Math.round(performance.now() - started) });
      const r = el('div', 'ak-result');
      r.append(el('b', 'ak-result__score', `${filled} из ${items.length}`), el('span', '', filled === items.length ? 'Все ответы написаны' : 'Готово'));
      const again = el('button', 'ak-btn ak-btn--ghost', 'Ещё раз');
      again.type = 'button';
      again.addEventListener('click', begin);
      const foot = el('div', 'ak-ex__foot');
      foot.append(again);
      root.replaceChildren(r, foot);
      if (anim()) gsap.from(r, { scale: 0.85, opacity: 0, duration: 0.5, ease: 'back.out(2)', clearProps: 'transform,opacity' });
    };
    const begin = () => { i = 0; filled = 0; started = performance.now(); tracker('start', id, 'practice'); render(); };
    begin();
    root.addEventListener('click', (e) => { const t = e.target.closest('[data-say]'); if (t && root.contains(t)) say(t.dataset.say); });
    /* для автопроверки: пишет образцы и проходит задание */
    AlternaKit.registerSolver(id, async () => {
      begin();
      for (let k = 0; k < items.length; k++) {
        const ta = $('.dy-free__in', root);
        ta.value = items[k].model;
        $('.ak-ex__foot .ak-btn', root).click();
        $('.ak-ex__foot .ak-btn', root).click();
      }
    });
  }

  function init() {
    goal();
    reading();
    you();
    $$('a-exercise[data-free]').forEach(free);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
