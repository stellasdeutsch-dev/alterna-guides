/* Alterna kit v1 — web components для гайдов. Контракт: CLAUDE.md, раздел «Контракт гайда». */

/* ---------- связь с трекером ---------- */
const track = (method, ...args) => {
  if (window.AlternaTracker) window.AlternaTracker[method](...args);
  else (window.__alternaQ ||= []).push([method, ...args]);
};

const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'text') el.textContent = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid);
  return el;
};

const shuffle = (arr, seed = 7) => {
  const a = arr.slice();
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const norm = (s) => String(s ?? '').normalize('NFC').replace(/[’‘`´]/g, "'").trim()
  .replace(/\s+/g, ' ').replace(/[.!?…]+$/, '').toLocaleLowerCase('tr');

const ICON = {
  say: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
};

/* ---------- данные упражнений ---------- */
/* при слабом интернете — 3 попытки с паузой; если не вышло, упражнение покажет кнопку «Повторить» */
let dataPromise = null;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function fetchExercises() {
  let last;
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(new URL('exercises.json', location.href));
      if (!r.ok) throw new Error(`exercises.json: ${r.status}`);
      return await r.json();
    } catch (e) { last = e; await sleep(800 * (i + 1)); }
  }
  throw last;
}
const loadExercises = () => (dataPromise ||= fetchExercises().catch((e) => { dataPromise = null; throw e; }));
const slowNet = () => { const c = navigator.connection; return !!c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || '')); };
const findExercise = async (id) => {
  const data = await loadExercises();
  const x = data.exercises.find((e) => e.id === id);
  if (!x) throw new Error(`Упражнение ${id} не найдено в exercises.json`);
  return x;
};

/* ---------- озвучка ---------- */
let trVoice = null;
const pickVoice = () => {
  const vs = window.speechSynthesis?.getVoices() || [];
  trVoice = vs.find((v) => /^tr(-|_|$)/i.test(v.lang)) || null;
};
if (window.speechSynthesis) { pickVoice(); speechSynthesis.addEventListener?.('voiceschanged', pickVoice); }

function speak(text, audio) {
  track('event', 'audio_play', { text });
  if (audio) { new Audio(audio).play().catch(() => {}); return true; }
  if (!window.speechSynthesis) return false;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'tr-TR';
  if (trVoice) u.voice = trVoice;
  u.rate = 0.9;
  speechSynthesis.speak(u);
  return true;
}

class ASay extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    const text = this.dataset.text || this.textContent.trim();
    const btn = h('button', { type: 'button', class: 'ak-say__btn', 'aria-label': `Послушать: ${text}` });
    btn.innerHTML = ICON.say;
    btn.addEventListener('click', () => {
      this.classList.add('ak-say--on');
      setTimeout(() => this.classList.remove('ak-say--on'), 900);
      speak(text, this.dataset.audio);
    });
    this.classList.add('ak-say');
    this.prepend(btn);
  }
}

class AWord extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    const tr = this.getAttribute('tr') || '';
    const ru = this.getAttribute('ru') || '';
    const say = h('a-say', { 'data-text': tr, 'data-audio': this.dataset.audio });
    say.textContent = tr;
    this.classList.add('ak-word');
    this.replaceChildren(say, h('span', { class: 'ak-word__ru', text: ru }));
  }
}

/* ---------- видео YouTube ---------- */
let ytApi = null;
const loadYT = () => (ytApi ||= new Promise((resolve, reject) => {
  if (window.YT?.Player) return resolve(window.YT);
  const prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(window.YT); };
  const s = h('script', { src: 'https://www.youtube.com/iframe_api' });
  s.onerror = reject;
  document.head.append(s);
}));

class AVideo extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    this.yt = this.getAttribute('yt');
    this.start = Number(this.getAttribute('start') || 0);
    this.end = Number(this.getAttribute('end') || 0);
    const title = this.getAttribute('title') || 'Видео';
    const channel = this.getAttribute('channel') || '';
    this.classList.add('ak-video');
    /* в режиме экономии трафика или на 2G обложку не грузим — только кнопка */
    const btn = h('button', { type: 'button', class: 'ak-video__cover', 'aria-label': `Смотреть: ${title}` },
      slowNet() ? null : h('img', { src: `https://i.ytimg.com/vi/${this.yt}/mqdefault.jpg`, alt: '', loading: 'lazy', decoding: 'async' }),
      h('span', { class: 'ak-video__play' }));
    btn.querySelector('.ak-video__play').innerHTML = ICON.play;
    btn.addEventListener('click', () => this.play());
    this.frame = h('div', { class: 'ak-video__frame' }, btn);
    const caption = h('div', { class: 'ak-video__meta' }, h('b', { text: title }), channel ? h('span', { text: ` · ${channel}` }) : null);
    this.replaceChildren(this.frame, caption);
  }

  fallback() {
    const url = `https://www.youtube.com/watch?v=${this.yt}${this.start ? `&t=${this.start}s` : ''}`;
    this.frame.replaceChildren(h('a', { class: 'ak-video__fallback', href: url, target: '_blank', rel: 'noopener' }, 'Видео не загрузилось — открыть на YouTube'));
  }

  async play() {
    const mount = h('div');
    this.frame.replaceChildren(mount);
    const timer = setTimeout(() => this.fallback(), 8000);
    try {
      const YT = await loadYT();
      const sent = new Set();
      let started = false;
      let poll = null;
      const len = () => (this.end || this.player.getDuration()) - this.start;
      const tick = () => {
        const p = Math.max(0, Math.min(100, ((this.player.getCurrentTime() - this.start) / Math.max(1, len())) * 100));
        for (const t of [25, 50, 75, 100]) {
          if (p >= t - 2 && !sent.has(t)) {
            sent.add(t);
            track('event', 'video_progress', { videoId: this.yt, pct: t });
            if (t === 100) track('event', 'video_complete', { videoId: this.yt });
          }
        }
      };
      this.player = new YT.Player(mount, {
        host: 'https://www.youtube-nocookie.com',
        videoId: this.yt,
        playerVars: { start: this.start, end: this.end || undefined, rel: 0, playsinline: 1, modestbranding: 1, autoplay: 1, origin: location.origin },
        events: {
          onReady: () => { clearTimeout(timer); this.player.playVideo(); },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) {
              if (!started) { started = true; track('event', 'video_play', { videoId: this.yt, start: this.start, end: this.end }); }
              clearInterval(poll); poll = setInterval(tick, 1000);
            } else { clearInterval(poll); tick(); }
          },
          onError: () => { clearTimeout(timer); this.fallback(); },
        },
      });
    } catch { clearTimeout(timer); this.fallback(); }
  }
}

/* ---------- упражнения: типы ---------- */
const TR_CHARS = ['ç', 'ğ', 'ı', 'İ', 'ö', 'ş', 'ü'];

function choiceList(options, onPick) {
  let picked = -1;
  const btns = options.map((o, i) => h('button', {
    type: 'button', class: 'ak-opt', 'data-key': String(i + 1),
    onclick: () => { picked = i; btns.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i))); onPick?.(i); },
  }, h('span', { class: 'ak-opt__n', text: String(i + 1) }), h('span', { text: o })));
  btns.forEach((b) => b.setAttribute('aria-pressed', 'false'));
  return { el: h('div', { class: 'ak-opts', role: 'group' }, btns), get: () => picked, btns, set: (i) => btns[i]?.click() };
}

const TYPES = {
  multiple_choice(item, ctx) {
    const list = choiceList(item.options, ctx.changed);
    return {
      el: h('div', {}, item.say ? sayLine(item.say) : null, h('p', { class: 'ak-prompt', text: item.prompt }), list.el),
      ready: () => list.get() >= 0,
      check: () => {
        const ok = list.get() === item.answer;
        list.btns.forEach((b, i) => b.classList.toggle('is-right', i === item.answer));
        if (!ok) list.btns[list.get()]?.classList.add('is-wrong');
        return { correct: ok, answer: item.options[list.get()], right: item.options[item.answer] };
      },
      solve: () => list.set(item.answer),
    };
  },

  true_false(item, ctx) {
    const list = choiceList(['Верно', 'Неверно'], ctx.changed);
    const idx = item.answer ? 0 : 1;
    return {
      el: h('div', {}, item.say ? sayLine(item.say) : null, h('p', { class: 'ak-prompt', text: item.statement }), list.el),
      ready: () => list.get() >= 0,
      check: () => {
        const ok = list.get() === idx;
        list.btns[idx].classList.add('is-right');
        if (!ok) list.btns[list.get()]?.classList.add('is-wrong');
        return { correct: ok, answer: list.get() === 0, right: item.answer ? 'Верно' : 'Неверно' };
      },
      solve: () => list.set(idx),
    };
  },

  gap_fill(item, ctx) {
    const parts = item.text.split('___');
    const gaps = [];
    const line = h('p', { class: 'ak-gapline' });
    parts.forEach((p, i) => {
      line.append(p);
      if (i < parts.length - 1) {
        const opts = item.options?.[i];
        if (opts) {
          const g = h('span', { class: 'ak-gap ak-gap--chip', text: '…' });
          g._value = '';
          gaps.push({ el: g, get: () => g._value, set: (v) => { g._value = v; g.textContent = v; } });
          line.append(g);
        } else {
          const inp = h('input', { class: 'ak-gap ak-gap--input', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': `Пропуск ${i + 1}`, oninput: ctx.changed });
          gaps.push({ el: inp, get: () => inp.value, set: (v) => { inp.value = v; } });
          line.append(inp);
        }
      }
    });
    const chips = [];
    item.options?.forEach((opts, gi) => {
      if (!opts) return;
      const list = choiceList(opts, (i) => { gaps[gi].set(opts[i]); ctx.changed(); });
      chips.push(list.el);
    });
    const hasInput = gaps.some((g) => g.el.tagName === 'INPUT');
    let lastInput = gaps.find((g) => g.el.tagName === 'INPUT')?.el;
    gaps.forEach((g) => g.el.tagName === 'INPUT' && g.el.addEventListener('focus', () => { lastInput = g.el; }));
    const kb = hasInput ? h('div', { class: 'ak-trkb', 'aria-label': 'Турецкие буквы' }, TR_CHARS.map((c) => h('button', {
      type: 'button', class: 'ak-trkb__k', text: c, tabindex: '-1',
      onclick: () => {
        const inp = lastInput; if (!inp) return;
        const s = inp.selectionStart ?? inp.value.length; const e = inp.selectionEnd ?? s;
        inp.value = inp.value.slice(0, s) + c + inp.value.slice(e);
        inp.focus(); inp.setSelectionRange(s + 1, s + 1); ctx.changed();
      },
    }))) : null;
    return {
      el: h('div', {}, item.translation ? h('p', { class: 'ak-hint', text: item.translation }) : null, line, ...chips, kb),
      ready: () => gaps.every((g) => norm(g.get())),
      check: () => {
        const res = gaps.map((g, i) => (item.answers[i] || []).some((a) => norm(a) === norm(g.get())));
        gaps.forEach((g, i) => g.el.classList.add(res[i] ? 'is-right' : 'is-wrong'));
        return { correct: res.every(Boolean), answer: gaps.map((g) => g.get()), right: item.answers.map((a) => a[0]).join(' · ') };
      },
      solve: () => gaps.forEach((g, i) => g.set(item.answers[i][0])),
    };
  },

  matching(item, ctx) {
    const rights = shuffle(item.pairs.map((p, i) => ({ text: p.right, i })), item.pairs.length + 3);
    const pairs = new Map();
    let sel = null;
    const L = item.pairs.map((p, i) => h('button', { type: 'button', class: 'ak-match__l', onclick: () => { sel = i; paint(); } }, p.left));
    const R = rights.map((r) => h('button', {
      type: 'button', class: 'ak-match__r', onclick: () => {
        if (sel == null) return;
        for (const [k, v] of pairs) if (v === r.i) pairs.delete(k);
        pairs.set(sel, r.i); sel = null; paint(); ctx.changed();
      },
    }, r.text));
    const COLORS = 6;
    function paint() {
      L.forEach((b, i) => { b.dataset.pair = pairs.has(i) ? String(i % COLORS) : ''; b.setAttribute('aria-pressed', String(sel === i)); });
      R.forEach((b, j) => { const k = [...pairs].find(([, v]) => v === rights[j].i)?.[0]; b.dataset.pair = k != null ? String(k % COLORS) : ''; });
    }
    paint();
    return {
      el: h('div', { class: 'ak-match' }, h('div', { class: 'ak-match__col' }, L), h('div', { class: 'ak-match__col' }, R)),
      ready: () => pairs.size === item.pairs.length,
      check: () => {
        let all = true;
        L.forEach((b, i) => { const ok = pairs.get(i) === i; all &&= ok; b.classList.add(ok ? 'is-right' : 'is-wrong'); });
        return { correct: all, answer: Object.fromEntries([...pairs].map(([k, v]) => [item.pairs[k].left, item.pairs[v].right])), right: item.pairs.map((p) => `${p.left} → ${p.right}`).join(', ') };
      },
      solve: () => { item.pairs.forEach((_, i) => pairs.set(i, i)); paint(); },
    };
  },

  build_sentence(item, ctx) {
    const pool = shuffle([...item.words, ...(item.distractors || [])].map((w, i) => ({ w, i })), item.words.length * 7 + 1);
    const chosen = [];
    const out = h('div', { class: 'ak-build__line', 'aria-live': 'polite' });
    const tiles = pool.map((t) => h('button', { type: 'button', class: 'ak-tile', onclick: () => { chosen.push(t); render(); } }, t.w));
    function render() {
      out.replaceChildren(...chosen.map((t, k) => h('button', { type: 'button', class: 'ak-tile ak-tile--in', onclick: () => { chosen.splice(k, 1); render(); } }, t.w)));
      tiles.forEach((b, j) => { b.disabled = chosen.includes(pool[j]); });
      ctx.changed();
    }
    const valid = [item.words, ...(item.alternatives || [])].map((ws) => norm(ws.join(' ')));
    return {
      el: h('div', { class: 'ak-build' }, item.translation ? h('p', { class: 'ak-prompt', text: item.translation }) : null, out, h('div', { class: 'ak-build__pool' }, tiles)),
      ready: () => chosen.length > 0,
      check: () => {
        const said = chosen.map((t) => t.w).join(' ');
        const ok = valid.includes(norm(said));
        out.classList.add(ok ? 'is-right' : 'is-wrong');
        return { correct: ok, answer: said, right: item.words.join(' ') };
      },
      solve: () => { chosen.length = 0; item.words.forEach((w) => chosen.push(pool.find((t) => t.w === w && !chosen.includes(t)))); render(); },
    };
  },

  sort_buckets(item, ctx) {
    const picks = new Map();
    const rows = item.entries.map((en, i) => {
      const list = choiceList(item.buckets.map((b) => b.label), (k) => { picks.set(i, item.buckets[k].id); ctx.changed(); });
      list.el.classList.add('ak-opts--row');
      return { en, list, row: h('div', { class: 'ak-sort__row' }, h('span', { class: 'ak-sort__word', text: en.text }), list.el) };
    });
    return {
      el: h('div', { class: 'ak-sort' }, rows.map((r) => r.row)),
      ready: () => picks.size === item.entries.length,
      check: () => {
        let all = true;
        rows.forEach((r, i) => {
          const ok = picks.get(i) === r.en.bucket; all &&= ok;
          r.row.classList.add(ok ? 'is-right' : 'is-wrong');
        });
        return { correct: all, answer: Object.fromEntries([...picks].map(([k, v]) => [item.entries[k].text, v])), right: item.entries.map((e) => `${e.text} → ${item.buckets.find((b) => b.id === e.bucket)?.label}`).join(', ') };
      },
      solve: () => rows.forEach((r) => r.list.set(item.buckets.findIndex((b) => b.id === r.en.bucket))),
    };
  },

  error_hunt(item, ctx) {
    let tapped = -1;
    let fix = null;
    const fixBox = h('div', { class: 'ak-hunt__fix' });
    const toks = item.tokens.map((t, i) => h('button', {
      type: 'button', class: 'ak-tok', onclick: () => {
        tapped = i; toks.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
        fix = null;
        if (item.options) {
          const list = choiceList(item.options, (k) => { fix = item.options[k]; ctx.changed(); });
          fixBox.replaceChildren(h('p', { class: 'ak-hint', text: 'Как правильно?' }), list.el);
          fixBox._list = list;
        }
        ctx.changed();
      },
    }, t));
    return {
      el: h('div', { class: 'ak-hunt' }, h('p', { class: 'ak-hint', text: item.prompt || 'Нажми на слово с ошибкой' }), h('div', { class: 'ak-hunt__line' }, toks), fixBox),
      ready: () => tapped >= 0 && (!item.options || fix != null),
      check: () => {
        const ok = tapped === item.wrong && (!item.options || norm(fix) === norm(item.fix));
        toks[item.wrong].classList.add('is-right');
        if (tapped !== item.wrong) toks[tapped]?.classList.add('is-wrong');
        return { correct: ok, answer: { token: item.tokens[tapped], fix }, right: `${item.tokens[item.wrong]} → ${item.fix}` };
      },
      solve: () => { toks[item.wrong].click(); if (item.options) fixBox._list.set(item.options.findIndex((o) => norm(o) === norm(item.fix))); },
    };
  },
};

function sayLine(text) {
  const s = h('a-say', { 'data-text': text });
  s.textContent = 'Послушай';
  return h('div', { class: 'ak-sayline' }, s);
}

/* ---------- упражнения: движок ---------- */
const solvers = new Map();

class AExercise extends HTMLElement {
  get kind() { return 'practice'; }

  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    this._load = this.load();
  }

  async load() {
    this.classList.add('ak-ex');
    if (this.kind === 'check') track('registerCheck');
    const id = this.getAttribute('ref');
    try {
      this.data = await findExercise(id);
    } catch (e) {
      const offline = e instanceof TypeError || !navigator.onLine;
      if (offline) {
        this.replaceChildren(h('p', { class: 'ak-hint', text: 'Нет связи — упражнение не загрузилось.' }),
          h('button', { type: 'button', class: 'ak-btn ak-btn--ghost', onclick: () => { this._load = this.load(); } }, 'Повторить'));
      } else {
        this.replaceChildren(h('p', { class: 'ak-error', text: String(e.message || e) }));
        console.error(e);
      }
      return;
    }
    if (this.data.type === 'custom') return; // логика нестандартного упражнения — в самом гайде
    this.attempt = 1;
    this.restart();
    this.addEventListener('keydown', (e) => this.onKey(e));
  }

  restart() {
    this.idx = 0;
    this.correct = 0;
    this.started = performance.now();
    this.itemStarted = performance.now();
    track('start', this.data.id, this.kind);
    this.renderItem();
  }

  onKey(e) {
    if (e.target.tagName === 'INPUT' && e.key !== 'Enter') return;
    if (/^[1-9]$/.test(e.key)) {
      const opt = this.querySelector(`.ak-body .ak-opt[data-key="${e.key}"]`);
      if (opt && !opt.disabled) { opt.click(); e.preventDefault(); }
    } else if (e.key === 'Enter') {
      if (this.primary && !this.primary.disabled) { this.primary.click(); e.preventDefault(); }
    }
  }

  renderItem() {
    const items = this.data.items;
    const raw = items[this.idx];
    const type = raw.type || this.data.type;
    const ctx = { changed: () => { this.primary.disabled = !this.view.ready(); } };
    this.view = TYPES[type](raw, ctx);
    this.feedback = h('div', { class: 'ak-feedback', 'aria-live': 'polite' });
    this.primary = h('button', { type: 'button', class: 'ak-btn', disabled: true, onclick: () => this.onPrimary() }, 'Проверить');
    this.mode = 'check';
    const head = h('div', { class: 'ak-ex__head' },
      h('span', { class: 'ak-ex__title', text: this.data.instruction || '' }),
      h('span', { class: 'ak-ex__count', text: `${this.idx + 1} / ${items.length}` }));
    const bar = h('div', { class: 'ak-ex__bar' }, h('span', { style: `width:${(100 * this.idx) / items.length}%` }));
    this.replaceChildren(head, bar, h('div', { class: 'ak-body', 'data-type': type }, this.view.el), this.feedback, h('div', { class: 'ak-ex__foot' }, this.primary));
    this.itemStarted = performance.now();
  }

  onPrimary() {
    if (this.mode === 'check') {
      const raw = this.data.items[this.idx];
      const res = this.view.check();
      if (res.correct) this.correct++;
      this.querySelectorAll('.ak-body button:not(.ak-say__btn), .ak-body input').forEach((b) => { b.disabled = true; });
      track('answer', {
        exerciseId: this.data.id, itemId: raw.id ?? String(this.idx + 1), type: raw.type || this.data.type,
        correct: res.correct, answer: res.answer, timeMs: Math.round(performance.now() - this.itemStarted), attempt: this.attempt,
      });
      this.feedback.className = `ak-feedback ${res.correct ? 'is-right' : 'is-wrong'}`;
      this.feedback.replaceChildren(
        h('b', { text: res.correct ? 'Верно' : 'Не совсем' }),
        !res.correct && res.right ? h('p', {}, 'Правильно: ', h('b', { text: String(res.right) })) : null,
        raw.explanation ? h('p', { text: raw.explanation }) : null);
      this.mode = 'next';
      this.primary.textContent = this.idx + 1 < this.data.items.length ? 'Дальше' : 'Результат';
      this.primary.disabled = false;
      this.primary.focus({ preventScroll: true });
    } else if (this.idx + 1 < this.data.items.length) {
      this.idx++;
      this.renderItem();
      this.querySelector('.ak-body button:not(.ak-say__btn), .ak-body input')?.focus({ preventScroll: true });
    } else {
      this.finish();
    }
  }

  finish() {
    const total = this.data.items.length;
    const pass = this.data.passPercent ?? 80;
    const pct = Math.round((100 * this.correct) / total);
    track('complete', { exerciseId: this.data.id, correct: this.correct, total, kind: this.kind, passPercent: pass, timeMs: Math.round(performance.now() - this.started) });
    const passed = pct >= pass;
    const msg = this.kind === 'check'
      ? (passed ? 'Проверка пройдена' : `Нужно ${pass}% — попробуй ещё раз`)
      : (pct === 100 ? 'Без ошибок' : 'Готово');
    this.result = { correct: this.correct, total, pct, passed };
    const again = h('button', { type: 'button', class: 'ak-btn ak-btn--ghost', onclick: () => { this.attempt++; this.restart(); } }, 'Ещё раз');
    this.primary = again;
    this.replaceChildren(h('div', { class: `ak-result ${this.kind === 'check' ? (passed ? 'is-right' : 'is-wrong') : ''}` },
      h('b', { class: 'ak-result__score', text: `${this.correct} из ${total}` }),
      h('span', { text: msg })), h('div', { class: 'ak-ex__foot' }, again));
  }

  /* для автопроверки: проходит упражнение правильными ответами */
  async autoSolve() {
    await this._load;
    if (!this.data) return;
    if (this.data.type === 'custom') { await solvers.get(this.data.id)?.(); return; }
    if (this.result) { this.attempt++; this.restart(); }
    for (let i = 0; i < this.data.items.length; i++) {
      this.view.solve();
      this.primary.disabled = false;
      this.onPrimary();
      this.onPrimary();
    }
  }
}

class AQuiz extends AExercise {
  get kind() { return 'check'; }
}

/* любой элемент с data-say="турецкий текст" озвучивается по нажатию — для палитр, таблиц, схем */
document.addEventListener('click', (e) => {
  const el = e.target.closest?.('[data-say]');
  if (!el || el.closest('a-say')) return;
  speak(el.dataset.say, el.dataset.audio);
  el.classList.add('ak-speaking');
  setTimeout(() => el.classList.remove('ak-speaking'), 700);
});

customElements.define('a-say', ASay);
customElements.define('a-word', AWord);
customElements.define('a-video', AVideo);
customElements.define('a-exercise', AExercise);
customElements.define('a-quiz', AQuiz);

/* ---------- API для гайдов ---------- */
window.AlternaKit = {
  speak,
  exercise: findExercise,
  /* нестандартное упражнение регистрирует функцию, которая проходит его правильно — нужна автопроверке */
  registerSolver: (id, fn) => solvers.set(id, fn),
  async solveAll() {
    await loadExercises().catch(() => null);
    await new Promise((r) => setTimeout(r, 0));
    for (const el of document.querySelectorAll('a-exercise, a-quiz')) await el.autoSolve();
  },
  solvers: () => [...solvers.keys()],
};
