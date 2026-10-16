/* Alterna kit v1: поведение гайдов лексики. Урок разбит на вкладки-разделы (как в приложении): словарь, история,
   диалоги, практика, квест, тест, шпаргалка. Здесь же прогресс урока, анимации и визуализации.
   Разметку собирает pnpm lex:build. Трекер kit считает чтение по секциям: активная вкладка и есть секция в фокусе. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const anim = () => !!window.gsap && !reduce;
  const say = (t) => window.AlternaKit?.speak(t);
  const tracker = (m, ...a) => window.AlternaTracker?.[m]?.(...a);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const meta = (n) => $(`meta[name="alterna:${n}"]`)?.content || '';
  const low = (s) => String(s || '').toLocaleLowerCase('tr').normalize('NFD').replace(/\u0307/g, '');

  /* ---------- локальный прогресс ученика: вкладки, выученные слова, открытые слова истории ---------- */
  const KEY = `alterna:lx:${meta('topic')}:${meta('lesson')}`;
  const store = (() => {
    let s = { done: [], known: [], found: [] };
    try { s = { ...s, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { /* приватный режим */ }
    return { get: () => s, save: () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ } } };
  })();

  /* ---------- кольца прогресса ---------- */
  function setRing(svg, pct, label) {
    if (!svg) return;
    const fg = $('.lx-ring__fg', svg);
    const tx = $('text', svg);
    const p = Math.max(0, Math.min(100, pct));
    if (anim()) {
      const o = { v: Number(fg.dataset.v || 0) };
      gsap.to(o, { v: p, duration: 0.7, ease: 'power2.out', onUpdate: () => fg.setAttribute('stroke-dasharray', `${o.v.toFixed(2)} 100`) });
    } else fg.setAttribute('stroke-dasharray', `${p} 100`);
    fg.dataset.v = String(p);
    if (tx) tx.textContent = label;
  }

  /* ---------- вкладки ---------- */
  const nav = $('.lx-tabs');
  const tabs = $$('.lx-tab');
  const panels = $$('.lx-panel');
  const keys = tabs.map((t) => t.dataset.tab);
  const tabOf = (k) => tabs.find((t) => t.dataset.tab === k);
  const panelOf = (k) => panels.find((p) => p.dataset.section === k);
  const entered = new Set();
  const onEnter = {};
  let cur = null;

  function show(key, { scroll = false, push = false, focus = false } = {}) {
    if (!keys.includes(key)) return false;
    const changed = key !== cur;
    cur = key;
    tabs.forEach((t) => {
      const on = t.dataset.tab === key;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p) => p.classList.toggle('is-active', p.dataset.section === key));
    const tab = tabOf(key);
    const panel = panelOf(key);
    if (push && location.hash !== `#${key}`) history.pushState(null, '', `#${key}`);
    if (focus) tab.focus({ preventScroll: true });
    /* активная вкладка видна в полосе вкладок на телефоне */
    const left = tab.offsetLeft - (nav.clientWidth - tab.offsetWidth) / 2;
    nav.scrollTo({ left: Math.max(0, left), behavior: reduce ? 'auto' : 'smooth' });
    if (scroll) {
      const y = Math.max(0, panel.getBoundingClientRect().top + scrollY - nav.offsetHeight - 6);
      if (Math.abs(scrollY - y) > 2) scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    }
    if (changed) {
      if (anim()) gsap.fromTo(panel, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out', clearProps: 'transform,opacity' });
      onEnter[key]?.(!entered.has(key));
      entered.add(key);
      dispatchEvent(new Event('scroll'));
    }
    return true;
  }

  function initTabs() {
    if (!nav || !tabs.length) return;
    document.body.classList.add('lx-tabbed');
    tabs.forEach((t) => t.addEventListener('click', () => show(t.dataset.tab, { scroll: true, push: true })));
    nav.addEventListener('keydown', (e) => {
      const i = keys.indexOf(cur);
      const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: keys.length - 1 }[e.key];
      if (to == null) return;
      e.preventDefault();
      show(keys[(to + keys.length) % keys.length], { push: true, focus: true, scroll: true });
    });
    document.addEventListener('click', (e) => {
      const go = e.target.closest('[data-tab-go]');
      if (go) show(go.dataset.tabGo, { scroll: true, push: true, focus: true });
    });
    const fromHash = () => location.hash.slice(1);
    addEventListener('popstate', () => show(fromHash(), { scroll: true }) || show(keys[0], { scroll: true }));
    addEventListener('hashchange', () => show(fromHash(), { scroll: true }));
    /* плеер и автопроверка просят показать секцию: { type: 'goto', section } → трекер шлёт alterna:goto */
    addEventListener('alterna:goto', (e) => show(e.detail?.section));
    if (!show(fromHash(), { scroll: true })) show(keys[0]);
    /* полоса под вкладками: сколько страницы прочитано */
    const progress = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      nav.style.setProperty('--p', Math.min(1, scrollY / max).toFixed(4));
    };
    addEventListener('scroll', progress, { passive: true });
    addEventListener('resize', progress);
    progress();
  }

  /* ---------- прогресс урока: галочки на вкладках и кольцо в шапке ---------- */
  const done = new Set(store.get().done.filter((k) => keys.includes(k)));
  function renderDone(k, fresh) {
    const t = tabOf(k);
    if (!t) return;
    t.classList.add('is-done');
    if (fresh && anim()) gsap.fromTo($('.lx-tab__ok', t), { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(3)' });
  }
  function ring() {
    const pct = Math.round((100 * done.size) / Math.max(1, keys.length));
    setRing($('.lx-app__ring'), pct, `${pct}%`);
    $('.lx-app__prog')?.setAttribute('title', `Пройдено разделов: ${done.size} из ${keys.length}`);
  }
  function mark(k) {
    if (!keys.includes(k) || done.has(k)) return;
    done.add(k);
    store.get().done = [...done];
    store.save();
    renderDone(k, true);
    ring();
  }
  function initProgress() {
    done.forEach((k) => renderDone(k, false));
    ring();
    addEventListener('alterna:read', (e) => { if (['sozluk', 'tarih', 'diyalog', 'cheat'].includes(e.detail?.key)) mark(e.detail.key); });
    const practiceIds = $$('[data-section="practice"] a-exercise').map((x) => x.getAttribute('ref'));
    const simId = $('a-exercise[data-sim]')?.getAttribute('ref');
    const quizId = $('a-quiz')?.getAttribute('ref');
    setInterval(() => {
      const st = tracker('state');
      if (!st) return;
      const ex = st.exercises || {};
      practiceIds.forEach((id) => { if (ex[id]?.done) $(`[data-step="${id}"]`)?.classList.add('is-done'); });
      if (practiceIds.length && practiceIds.every((id) => ex[id]?.done)) mark('practice');
      if (simId && ex[simId]?.done) mark('simulator');
      if (quizId && ex[quizId]?.passed) mark('check');
    }, 1500);
  }

  /* ---------- знакомство: счётчики и полоса групп слов ---------- */
  function hero() {
    if (!anim()) return;
    $$('.lx-stats b').forEach((b) => {
      const to = Number(b.textContent) || 0;
      const o = { v: 0 };
      gsap.to(o, { v: to, duration: 0.9, ease: 'power2.out', delay: 0.15, onUpdate: () => { b.textContent = String(Math.round(o.v)); } });
    });
    gsap.from('.lx-gbar__s', { scaleX: 0, transformOrigin: 'left center', duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.2 });
    gsap.from('.lx-tab', { y: 10, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out', clearProps: 'transform,opacity' });
  }

  /* ---------- словарь: фильтр по группам, поиск, карточки-перевёртыши, кнопка Знаю ---------- */
  function dictionary() {
    const sec = $('[data-section="sozluk"]');
    if (!sec) return;
    const cards = $$('.lx-card', sec);
    const chips = $$('[data-filter]', sec);
    const search = $('.lx-search', sec);
    const empty = $('.lx-empty', sec);
    const known = new Set(store.get().known);
    const knownOut = $('[data-known]', sec);
    let filter = 'all';

    const learned = () => {
      const n = cards.filter((c) => c.classList.contains('is-known')).length;
      knownOut.textContent = String(n);
      setRing($('.lx-learn__ring', sec), (100 * n) / Math.max(1, cards.length), String(n));
    };
    cards.forEach((c) => {
      if (known.has(c.dataset.word)) { c.classList.add('is-known'); $('.lx-card__know', c).setAttribute('aria-pressed', 'true'); }
    });
    learned();

    const cascade = (list) => { if (anim() && list.length) gsap.fromTo(list, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, stagger: 0.045, ease: 'power2.out', clearProps: 'transform,opacity' }); };
    const apply = () => {
      const q = low(search.value.trim());
      const shown = [];
      cards.forEach((c) => {
        const okG = filter === 'all' || c.dataset.g === filter;
        const okQ = !q || low(c.dataset.word).includes(q) || low($('.lx-card__ru', c).textContent).includes(q);
        c.hidden = !(okG && okQ);
        if (!c.hidden) shown.push(c);
      });
      $$('.lx-group, .lx-cards', sec).forEach((g) => { g.hidden = !shown.some((c) => c.dataset.g === g.dataset.g); });
      empty.hidden = shown.length > 0;
      cascade(shown.slice(0, 12));
    };
    chips.forEach((b) => b.addEventListener('click', () => {
      filter = b.dataset.filter;
      chips.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      apply();
    }));
    search.addEventListener('input', apply);

    const flip = (c) => {
      const open = !c.classList.contains('is-flipped');
      const btn = $('.lx-card__flip', c);
      const set = () => { c.classList.toggle('is-flipped', open); btn.textContent = open ? 'Слово' : 'Примеры'; btn.setAttribute('aria-expanded', String(open)); };
      if (!anim()) { set(); return; }
      gsap.timeline()
        .to(c, { rotationY: 90, duration: 0.16, ease: 'power1.in', transformPerspective: 900 })
        .call(set)
        .fromTo(c, { rotationY: -90 }, { rotationY: 0, duration: 0.24, ease: 'power2.out', transformPerspective: 900, clearProps: 'transform' })
        .from($$(open ? '.lx-card__back > *' : '.lx-card__face > *', c), { y: 8, opacity: 0, duration: 0.25, stagger: 0.04, clearProps: 'transform,opacity' }, '-=0.1');
    };
    sec.addEventListener('click', (e) => {
      const c = e.target.closest('.lx-card');
      if (!c) return;
      if (e.target.closest('.lx-say')) { if (anim()) gsap.fromTo(e.target.closest('.lx-say'), { scale: 1.25 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' }); return; }
      if (e.target.closest('a-say, .ak-say')) return;
      const k = e.target.closest('.lx-card__know');
      if (k) {
        const on = !c.classList.contains('is-known');
        c.classList.toggle('is-known', on);
        k.setAttribute('aria-pressed', String(on));
        if (on) known.add(c.dataset.word); else known.delete(c.dataset.word);
        store.get().known = [...known];
        store.save();
        if (anim()) gsap.fromTo(c, { scale: 0.96 }, { scale: 1, duration: 0.45, ease: 'back.out(3)' });
        learned();
        return;
      }
      flip(c);
    });
    sec.addEventListener('keydown', (e) => {
      const c = e.target.closest?.('.lx-card');
      if (c && e.target === c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); flip(c); }
    });
    $('[data-hide-ru]', sec).addEventListener('change', (e) => sec.classList.toggle('lx--quiz', e.target.checked));
    onEnter.sozluk = (first) => { if (first) cascade(cards.filter((c) => !c.hidden).slice(0, 12)); };
  }

  /* ---------- история: турецкие вставки звучат, показывают перевод, считаются открытыми ---------- */
  function storyTab() {
    const sec = $('[data-section="tarih"]');
    if (!sec) return;
    const box = $('.lx-story', sec);
    const tws = $$('.lx-tw', box);
    const chips = $$('[data-find]', sec);
    const found = new Set(store.get().found);
    const out = $('[data-found]', sec);
    const bar = $('.lx-found__bar i', sec);
    const update = () => {
      const n = chips.filter((c) => found.has(c.dataset.find)).length;
      out.textContent = String(n);
      bar.style.width = `${(100 * n) / Math.max(1, chips.length)}%`;
      chips.forEach((c) => c.classList.toggle('is-found', found.has(c.dataset.find)));
    };
    const open = (w) => {
      $$('.lx-tw.is-on', box).forEach((x) => x !== w && x.classList.remove('is-on'));
      w.classList.toggle('is-on');
      if (!found.has(w.dataset.say)) { found.add(w.dataset.say); store.get().found = [...found]; store.save(); update(); }
      if (anim()) gsap.fromTo(w, { scale: 1.14 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    };
    box.addEventListener('click', (e) => { const w = e.target.closest('.lx-tw'); if (w) open(w); });
    chips.forEach((c) => c.addEventListener('click', () => {
      const w = tws.find((x) => x.dataset.say === c.dataset.find);
      if (!w) return;
      w.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      say(w.dataset.say);
      open(w);
    }));
    update();
    onEnter.tarih = (first) => {
      if (!anim()) return;
      gsap.from($$('p', box), { y: 18, opacity: 0, duration: 0.45, stagger: 0.12, ease: 'power2.out', clearProps: 'transform,opacity' });
      if (first) gsap.fromTo(tws, { scale: 1 }, { scale: 1.12, duration: 0.18, yoyo: true, repeat: 1, stagger: 0.05, delay: 0.4, ease: 'power1.inOut', clearProps: 'transform' });
    };
  }

  /* ---------- диалоги: выбор диалога, реплики по одной с индикатором набора, точки прогресса ---------- */
  function dialogues() {
    const sec = $('[data-section="diyalog"]');
    if (!sec) return;
    const boxes = $$('.lx-dlg', sec);
    const sel = $$('[data-dlg]', sec);
    const pick = (i) => {
      sel.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.dlg === String(i))));
      boxes.forEach((b) => b.classList.toggle('is-on', b.dataset.dlgBox === String(i)));
      const box = boxes[i];
      if (anim() && box) gsap.fromTo(box, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'transform,opacity' });
    };
    sel.forEach((b) => b.addEventListener('click', () => pick(Number(b.dataset.dlg))));
    pick(0);

    boxes.forEach((box) => {
      const chat = $('[data-chat]', box);
      const lines = $$('.lx-msg', chat);
      const next = $('[data-next]', box);
      const allBtn = $('[data-all]', box);
      const dots = el('p', 'lx-dots');
      dots.dataset.ui = '';
      dots.setAttribute('aria-hidden', 'true');
      lines.forEach(() => dots.append(el('i')));
      $('.lx-dlg__head', box).append(dots);
      let shown = 1;
      let busy = false;
      chat.classList.add('is-step');
      lines.forEach((l, i) => l.classList.toggle('is-hidden', i > 0));
      const sync = () => {
        next.disabled = allBtn.disabled = shown >= lines.length;
        $$('i', dots).forEach((d, i) => d.classList.toggle('is-on', i < shown));
      };
      const reveal = (l) => {
        l.classList.remove('is-hidden');
        if (anim()) gsap.from(l, { y: 14, opacity: 0, scale: 0.96, transformOrigin: l.classList.contains('lx-msg--me') ? 'right bottom' : 'left bottom', duration: 0.4, ease: 'back.out(2)', clearProps: 'transform,opacity' });
      };
      next.addEventListener('click', () => {
        if (busy || shown >= lines.length) return;
        const l = lines[shown++];
        busy = true;
        next.disabled = true;
        const typing = el('div', `lx-typing${l.classList.contains('lx-msg--me') ? ' lx-typing--me' : ''}`);
        typing.dataset.ui = '';
        typing.append(el('i'), el('i'), el('i'));
        l.before(typing);
        setTimeout(() => {
          typing.remove();
          reveal(l);
          say($('.lx-msg__tr', l).dataset.say);
          busy = false;
          sync();
        }, reduce ? 60 : 520);
      });
      allBtn.addEventListener('click', () => {
        const rest = lines.slice(shown);
        shown = lines.length;
        rest.forEach((l) => l.classList.remove('is-hidden'));
        if (anim()) gsap.from(rest, { y: 12, opacity: 0, duration: 0.3, stagger: 0.06, clearProps: 'transform,opacity' });
        sync();
      });
      $('[data-ru]', box).addEventListener('change', (e) => chat.classList.toggle('no-ru', !e.target.checked));
      sync();
    });
  }

  /* ---------- упражнения: вспышка за верный ответ, покачивание за ошибку; итог теста диаграммой ---------- */
  function exercisesFx() {
    const quiz = $('a-quiz');
    const res = $('.lx-res');
    let mistakes = [];
    const fx = (exEl, cls) => {
      exEl.classList.remove('lx-fx-good', 'lx-fx-bad');
      void exEl.offsetWidth;
      exEl.classList.add(cls);
      setTimeout(() => exEl.classList.remove(cls), 800);
    };
    const watch = (exEl) => new MutationObserver(() => {
      const fb = $('.ak-feedback:not([data-fx])', exEl);
      if (fb && /is-(right|wrong)/.test(fb.className)) {
        fb.dataset.fx = '1';
        const ok = fb.classList.contains('is-right');
        fx(exEl, ok ? 'lx-fx-good' : 'lx-fx-bad');
        if (exEl === quiz) {
          if ($('.ak-ex__count', exEl)?.textContent.trim().startsWith('1 ')) mistakes = [];
          if (!ok) {
            const q = ($('.ak-body .ak-prompt', exEl)?.textContent || $('.ak-body', exEl)?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 140);
            mistakes.push({ q, why: $$('p', fb).map((p) => p.textContent).join(' ') });
          }
        }
      }
      const r = $('.ak-result:not([data-fx])', exEl);
      if (r) {
        r.dataset.fx = '1';
        if (anim()) gsap.from(r, { scale: 0.85, opacity: 0, duration: 0.5, ease: 'back.out(2)', clearProps: 'transform,opacity' });
        if (exEl === quiz && res) results(r);
      }
    }).observe(exEl, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    $$('a-exercise:not([data-sim]), a-quiz').forEach(watch);

    function results(r) {
      const [c, t] = ($('.ak-result__score', r)?.textContent.match(/\d+/g) || [0, 0]).map(Number);
      const pct = t ? Math.round((100 * c) / t) : 0;
      const pass = pct >= 80;
      res.hidden = false;
      res.replaceChildren();
      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('viewBox', '0 0 42 42');
      svg.setAttribute('class', 'lx-donut');
      svg.setAttribute('aria-hidden', 'true');
      const arc = (cls, len, off) => {
        const a = document.createElementNS(ns, 'circle');
        Object.entries({ cx: 21, cy: 21, r: 15.9155, class: cls, 'stroke-dasharray': `${len} ${100 - len}`, 'stroke-dashoffset': String(25 - off) }).forEach(([k, v]) => a.setAttribute(k, v));
        svg.append(a);
        return a;
      };
      arc('lx-donut__bg', 100, 0);
      const good = arc('lx-donut__good', pct, 0);
      if (pct < 100) arc('lx-donut__bad', 100 - pct, pct);
      const txt = document.createElementNS(ns, 'text');
      Object.entries({ x: 21, y: 23.5, 'text-anchor': 'middle' }).forEach(([k, v]) => txt.setAttribute(k, v));
      txt.textContent = `${pct}%`;
      svg.append(txt);
      const info = el('div', 'lx-res__info');
      info.append(el('b', '', pass ? 'Тест пройден' : 'Пока меньше 80%'), el('p', '', `Верно ${c} из ${t}. ${pass ? 'Урок засчитается, когда разделы прочитаны.' : 'Посмотри ошибки и пройди тест ещё раз.'}`));
      const legend = el('p', 'lx-res__legend');
      legend.append(el('span', 'is-good', `верно: ${c}`), el('span', 'is-bad', `ошибок: ${t - c}`));
      info.append(legend);
      res.append(svg, info);
      if (mistakes.length) {
        const ol = el('ol', 'lx-res__list');
        mistakes.forEach((m) => { const li = el('li'); li.append(el('b', '', m.q), el('span', '', m.why)); ol.append(li); });
        const h = el('p', 'lx-res__h', 'Ошибки и объяснения');
        res.append(h, ol);
      }
      res.classList.toggle('is-pass', pass);
      if (anim()) {
        gsap.from(res, { y: 16, opacity: 0, duration: 0.45, ease: 'power2.out', clearProps: 'transform,opacity' });
        gsap.from(good, { attr: { 'stroke-dasharray': '0 100' }, duration: 0.9, ease: 'power2.out', delay: 0.15 });
      }
    }
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
    const dots = el('div', 'lx-sim__dots');
    dots.setAttribute('aria-hidden', 'true');
    steps.forEach((_, k) => dots.append(el('i', '', String(k + 1))));
    top.append(ava, name, dots);
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
    const dot = (k, cls) => { const d = dots.children[k]; if (!d) return; d.className = cls; if (anim()) gsap.fromTo(d, { scale: 1.5 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' }); };
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
      feed.scrollTop = feed.scrollHeight;
      setTimeout(() => { d.remove(); res(); }, reduce ? 150 : 650);
    });
    const ask = async () => {
      const st = steps[i];
      hint.textContent = '';
      choices.replaceChildren();
      dot(i, 'is-cur');
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
        if (anim()) gsap.fromTo(btn, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, .3)' });
        return;
      }
      wait = true;
      if (tries === 1) correct++;
      dot(i, tries === 1 ? 'is-good' : 'is-ok');
      choices.replaceChildren();
      hint.textContent = '';
      bubble('me', st.options[k].tr, st.options[k].ru);
      say(st.options[k].tr);
      i++;
      if (st.reply) { await typing(); bubble('bot', st.reply.tr, st.reply.ru); }
      if (i < steps.length) setTimeout(ask, reduce ? 100 : 500);
      else finish();
    };
    const finish = async () => {
      running = false;
      if (data.final) { await typing(); bubble('bot', data.final.tr, data.final.ru); }
      tracker('complete', { exerciseId: id, correct, total: steps.length });
      const r = el('div', 'lx-sim__done');
      r.append(el('b', '', `${correct} из ${steps.length} с первой попытки`), el('span', '', correct === steps.length ? 'Как местный!' : 'Пройди ещё раз: станет легче.'));
      feed.append(r);
      feed.scrollTop = feed.scrollHeight;
      if (anim()) gsap.from(r, { scale: 0.8, opacity: 0, duration: 0.5, ease: 'back.out(2)' });
      start.textContent = 'Ещё раз';
      start.hidden = false;
    };
    const begin = () => {
      i = 0; correct = 0; running = true;
      feed.replaceChildren();
      [...dots.children].forEach((d) => { d.className = ''; });
      start.hidden = true;
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

  /* ---------- шпаргалка ---------- */
  function cheat() {
    const sec = $('[data-section="cheat"]');
    const table = $('.lx-table', sec || document);
    if (!table) return;
    $('[data-hide-ru]', sec).addEventListener('change', (e) => { table.classList.toggle('no-ru', e.target.checked); $$('tr', table).forEach((r) => r.classList.remove('peek')); });
    table.addEventListener('click', (e) => { const r = e.target.closest('tr'); if (r && table.classList.contains('no-ru')) r.classList.toggle('peek'); });
    onEnter.cheat = () => { if (anim()) gsap.from($$('tr', table).slice(0, 18), { x: -16, opacity: 0, duration: 0.3, stagger: 0.025, clearProps: 'transform,opacity' }); };
  }

  /* ---------- практика: шаги появляются при входе ---------- */
  onEnter.practice = () => { if (anim()) gsap.from('.lx-steps li', { y: 10, opacity: 0, duration: 0.35, stagger: 0.08, clearProps: 'transform,opacity' }); };

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
    dictionary();
    storyTab();
    dialogues();
    cheat();
    exercisesFx();
    initTabs();
    initProgress();
    hero();
    simulator();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
