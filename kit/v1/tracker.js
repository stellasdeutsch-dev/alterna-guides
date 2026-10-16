/* Alterna tracker v1 — скрытый трекер гайда. Контракт: CLAUDE.md, раздел «Трекинг». */
(() => {
  'use strict';
  if (window.AlternaTracker) return;

  const meta = (n, d) => document.querySelector(`meta[name="alterna:${n}"]`)?.content || d;
  const topic = meta('topic', 'unknown');
  const guideVersion = Number(meta('version', '1'));
  const lesson = Number(meta('lesson', '1'));
  const script = document.currentScript;
  const endpoint = script?.dataset.endpoint || '';
  const params = new URLSearchParams(location.search);
  const debug = params.has('debug');
  const embedded = window.parent !== window;
  const parentOrigin = script?.dataset.parentOrigin || location.origin;

  const uuid = () => (crypto.randomUUID ? crypto.randomUUID() :
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 3) | 8).toString(16);
    }));
  const sessionId = uuid();
  const now = () => Date.now();

  let anonId = '';
  if (!embedded && endpoint) {
    try { anonId = localStorage.getItem('alterna:anon') || uuid(); localStorage.setItem('alterna:anon', anonId); }
    catch { anonId = uuid(); }
  }

  /* ---------- состояние ---------- */
  const sections = [];          // { key, words, el, seconds, read, viewed }
  const byKey = new Map();
  let current = null;
  let lastActivity = now();
  let activeSeconds = 0;
  let sinceHeartbeat = 0;
  const depthSent = new Set();
  const exercises = {};         // id → { answers, correct, total, done, scorePct, passed, kind }
  let checkPassed = false;
  let hasCheck = false;
  let completed = false;
  const log = [];
  let queue = [];

  /* ---------- события ---------- */
  function emit(type, data = {}) {
    const e = { v: 1, id: uuid(), type, topic, guideVersion, lesson, sessionId, ts: now(), data };
    log.push(e);
    if (log.length > 500) log.shift();
    queue.push(e);
    if (debug) { flush(); renderPanel(); }
    return e;
  }
  /* DOM-события для гайда и kit: свой скроллбар отмечает прочитанное, kit показывает ачивку */
  const fire = (n, detail) => dispatchEvent(new CustomEvent(`alterna:${n}`, { detail }));

  function flush() {
    if (!queue.length) return;
    if (!embedded && endpoint && navigator.onLine === false) return; // нет сети — копим и отправим по событию online
    const events = queue;
    queue = [];
    if (embedded) {
      try { window.parent.postMessage({ source: 'alterna-guide', events }, parentOrigin); } catch { /* ignore */ }
    } else if (endpoint) {
      const body = JSON.stringify({ anonId, events });
      if (!(navigator.sendBeacon && navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' })))) {
        fetch(endpoint, { method: 'POST', body, keepalive: true, headers: { 'content-type': 'application/json' } }).catch(() => {});
      }
    }
  }

  /* ---------- секции ---------- */
  const totalWords = () => sections.reduce((s, x) => s + x.words, 0);
  function readPct() {
    if (!sections.length) return 0;
    const total = totalWords();
    if (!total) return Math.round((100 * sections.filter((s) => s.read).length) / sections.length);
    const done = sections.filter((s) => s.read).reduce((s, x) => s + x.words, 0);
    return Math.round((100 * done) / total);
  }
  const needSeconds = (s) => Math.max(2, (s.words / 150) * 60 * 0.3);

  function collectSections() {
    if (document.querySelector('a-quiz')) hasCheck = true;
    document.querySelectorAll('[data-section]').forEach((el) => {
      const key = el.dataset.section;
      if (byKey.has(key)) return;
      const s = { key, words: Math.max(0, parseInt(el.dataset.words || '0', 10) || 0), el, seconds: 0, read: false, viewed: false };
      sections.push(s);
      byKey.set(key, s);
      io.observe(el);
    });
  }

  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const s = byKey.get(en.target.dataset.section);
      if (!s) continue;
      current = s;
      if (!s.viewed) { s.viewed = true; emit('section_view', { key: s.key }); }
    }
  }, { rootMargin: '-45% 0px -45% 0px' });

  /* ---------- активность ---------- */
  const touch = () => { lastActivity = now(); };
  ['scroll', 'wheel', 'pointerdown', 'pointermove', 'keydown', 'touchstart'].forEach((t) =>
    addEventListener(t, touch, { passive: true, capture: true }));

  /* у верхнего и нижнего края страницы короткие секции не доезжают до центра экрана.
     Там читаем как человек: время идёт первой видимой непрочитанной секции по порядку. */
  function atEdge() {
    const de = document.documentElement;
    const top = scrollY <= 4;
    const bottom = de.scrollHeight - innerHeight - scrollY <= 4;
    if (!top && !bottom) return;
    const visible = sections.filter((x) => { const r = x.el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; });
    if (!visible.length) return;
    const band = current && visible.includes(current) && !current.read ? current : null;
    const s = band || visible.find((x) => !x.read) || visible[visible.length - 1];
    if (current !== s) { current = s; if (!s.viewed) { s.viewed = true; emit('section_view', { key: s.key }); } }
  }

  function scrollDepth() {
    const de = document.documentElement;
    const max = de.scrollHeight - innerHeight;
    const pct = max <= 0 ? 100 : Math.min(100, Math.round((scrollY / max) * 100));
    for (const t of [25, 50, 75, 100]) {
      if (pct >= t && !depthSent.has(t)) { depthSent.add(t); emit('scroll_depth', { pct: t }); }
    }
  }
  addEventListener('scroll', scrollDepth, { passive: true });

  function maybeComplete() {
    if (completed) return;
    const pct = readPct();
    if (pct >= 80 && (!hasCheck || checkPassed)) {
      completed = true;
      emit('guide_complete', { readPct: pct, activeSeconds, checkPassed });
      flush();
      fire('complete', { readPct: pct, activeSeconds, checkPassed, lesson });
    }
  }

  setInterval(() => {
    const active = document.visibilityState === 'visible' && now() - lastActivity < 30000;
    if (!active) return;
    atEdge();
    activeSeconds++;
    sinceHeartbeat++;
    if (current) {
      current.seconds++;
      if (!current.read && current.seconds >= needSeconds(current)) {
        current.read = true;
        emit('section_read', { key: current.key, seconds: current.seconds, readPct: readPct() });
        fire('read', { key: current.key, readPct: readPct() });
        maybeComplete();
      }
    }
    if (sinceHeartbeat >= 15) {
      emit('heartbeat', { key: current?.key || null, activeSeconds: sinceHeartbeat });
      sinceHeartbeat = 0;
    }
    if (debug) renderPanel();
  }, 1000);

  setInterval(flush, 30000);
  addEventListener('online', flush);
  addEventListener('pagehide', () => {
    emit('guide_leave', { lastSection: current?.key || null, readPct: readPct(), activeSeconds });
    flush();
  });
  addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });

  /* ---------- команды плеера ---------- */
  addEventListener('message', (ev) => {
    if (ev.source !== window.parent || ev.origin !== parentOrigin) return;
    const m = ev.data || {};
    if (m.source !== 'alterna-player') return;
    /* гайд с вкладками сначала открывает нужную вкладку (alterna:goto), потом прокручиваем к секции */
    if (m.type === 'goto' && byKey.has(m.section)) {
      fire('goto', { section: m.section });
      requestAnimationFrame(() => byKey.get(m.section).el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
    if (m.type === 'flush') flush();
  });

  /* ---------- API ---------- */
  const ex = (id, kind = 'practice') => (exercises[id] ||= { kind, answers: 0, correct: 0, done: false });
  const api = {
    event: (type, data) => emit(type, data),
    start(exerciseId, kind = 'practice') { ex(exerciseId, kind); emit('exercise_start', { exerciseId, kind }); },
    answer({ exerciseId, itemId, correct, answer = null, timeMs = null, attempt = 1, type = 'custom' }) {
      const x = ex(exerciseId);
      x.answers++; if (correct) x.correct++;
      emit('exercise_answer', { exerciseId, itemId, type, correct: !!correct, attempt, timeMs, answer });
    },
    complete({ exerciseId, correct, total, kind, passPercent = 80, timeMs = null }) {
      const x = ex(exerciseId, kind);
      const k = kind || x.kind;
      const scorePct = total ? Math.round((100 * correct) / total) : 0;
      Object.assign(x, { done: true, scorePct, kind: k });
      if (k === 'check') {
        hasCheck = true;
        x.passed = scorePct >= passPercent;
        emit('quiz_complete', { exerciseId, correct, total, scorePct, passed: x.passed, passPercent });
        if (x.passed) checkPassed = true;
        maybeComplete();
      } else {
        emit('exercise_complete', { exerciseId, kind: k, correct, total, scorePct, timeMs });
      }
      flush();
    },
    registerCheck() { hasCheck = true; },
    state: () => ({
      topic, lesson, guideVersion, sessionId, embedded, readPct: readPct(), activeSeconds, completed,
      current: current?.key || null,
      sections: sections.map(({ key, words, seconds, read }) => ({ key, words, seconds, read, need: Math.ceil(needSeconds({ words })) })),
      exercises: JSON.parse(JSON.stringify(exercises)),
    }),
    log: () => log.slice(),
    flush,
  };
  window.AlternaTracker = api;

  /* очередь вызовов, сделанных до загрузки трекера */
  const q = window.__alternaQ || [];
  window.__alternaQ = { push: ([m, ...args]) => api[m]?.(...args) };
  q.forEach(([m, ...args]) => api[m]?.(...args));

  /* ---------- debug-панель ---------- */
  let panel = null;
  function renderPanel() {
    if (!debug) return;
    if (!panel) {
      const host = document.createElement('div');
      host.style.cssText = 'position:fixed;right:8px;bottom:8px;z-index:2147483647';
      document.body.appendChild(host);
      const root = host.attachShadow({ mode: 'open' });
      root.innerHTML = '<style>div{font:12px/1.4 ui-monospace,Menlo,monospace;background:rgba(14,21,34,.92);color:#e6ebf4;border-radius:10px;padding:10px 12px;width:min(340px,calc(100vw - 16px));max-height:45vh;overflow:auto;box-shadow:0 6px 24px rgba(0,0,0,.3)}b{color:#8fb4ff}.ok{color:#7ee2a8}i{color:#9aa7bd;font-style:normal}</style><div></div>';
      panel = root.querySelector('div');
    }
    const st = api.state();
    const secs = st.sections.map((s) => `${s.read ? '<span class=ok>✓</span>' : '·'} ${s.key} ${s.seconds}/${s.need}с`).join('<br>');
    const exs = Object.entries(st.exercises).map(([id, x]) => `${x.done ? '<span class=ok>✓</span>' : '·'} ${id} ${x.correct}/${x.answers}${x.done ? ` (${x.scorePct}%)` : ''}`).join('<br>');
    const last = log.slice(-12).reverse().map((e) => `<i>${new Date(e.ts).toLocaleTimeString()}</i> ${e.type}`).join('<br>');
    panel.innerHTML = `<b>${topic} · урок ${lesson}</b> ${completed ? '<span class=ok>пройден</span>' : ''}<br>прочитано ${st.readPct}% · активно ${st.activeSeconds}с · сейчас ${st.current || '—'}<br><br>${secs}<br><br>${exs || '<i>упражнений ещё не было</i>'}<br><br>${last}`;
  }

  /* ---------- старт ---------- */
  function init() {
    collectSections();
    new MutationObserver(collectSections).observe(document.body, { childList: true, subtree: true });
    emit('guide_open', {
      embedded, viewport: { w: innerWidth, h: innerHeight },
      pointer: matchMedia('(pointer: coarse)').matches ? 'coarse' : 'fine',
      sections: sections.length, words: totalWords(),
    });
    scrollDepth();
    if (debug) renderPanel();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
