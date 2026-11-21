/* HTML Mastery - core engine. (c) Wilfred Wanyoike */
(function () {
  'use strict';
  var body = document.body, ROOT = body.getAttribute('data-root') || '', CUR = body.getAttribute('data-mod') || '';
  var MODS = window.MODULES || [];
  function store(get, k, v) { try { var p = JSON.parse(localStorage.getItem('hm_progress') || '{}'); if (get) return p; p[k] = v; localStorage.setItem('hm_progress', JSON.stringify(p)); } catch (e) { return {}; } }
  var prog = store(true) || {};
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function T(k, f) { return (window.HM_T && window.HM_T(k)) || f; }
  function md(s) { return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>'); }
  window.HM = { esc: esc, md: md, store: store };

  /* ---------- Sector 1: dates + Leitner schedule ---------- */
  var BOX_DAYS = { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16 };
  function todayISO() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function addDays(iso, n) { var p = iso.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function leitner() { var p = store(true) || {}; return p.leitner && p.leitner.version === 1 ? p.leitner : { version: 1 }; }
  function getCardState(id) { var s = leitner()[id]; return s && s.box ? { box: s.box, due: s.due, last: s.last || null } : { box: 1, due: todayISO(), last: null }; }
  function setCardState(id, st) { var l = leitner(); l[id] = { box: st.box, due: st.due, last: st.last }; l.version = 1; store(false, 'leitner', l); }
  function isDue(st) { return st.due <= todayISO(); }
  /* Transitions (Sector 1): Again / Hard / Good / Easy from the spec's table. */
  var NEXT = {
    again: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 },
    hard: { 1: 1, 2: 1, 3: 2, 4: 3, 5: 4 },
    good: { 1: 2, 2: 3, 3: 4, 4: 5, 5: 5 },
    easy: { 1: 3, 2: 4, 3: 5, 4: 5, 5: 5 }
  };
  function reviewCard(id, grade) {
    var st = getCardState(id), box = (NEXT[grade] || NEXT.good)[st.box] || 1, today = todayISO();
    setCardState(id, { box: box, due: addDays(today, BOX_DAYS[box]), last: today });
    return getCardState(id);
  }
  function cardId(mid, index) { return mid + '-' + index; }
  function moduleCardIds(mid) { return (window.CARDS[mid] || []).map(function (_, i) { return cardId(mid, i); }); }
  function buildDueQueue(selectedModuleIds) {
    var on = {}, out = [], today = todayISO();
    (selectedModuleIds || []).forEach(function (id) { on[id] = 1; });
    MODS.forEach(function (m) {
      if (!on[m.id]) return;
      (window.CARDS[m.id] || []).forEach(function (_, i) {
        var id = cardId(m.id, i), st = getCardState(id);
        if (st.due <= today) out.push({ id: id, mid: m.id, index: i, front: window.CARDS[m.id][i].f, back: window.CARDS[m.id][i].b, box: st.box });
      });
    });
    return out;
  }
  function boxCounts(selectedModuleIds) {
    var c = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, due: 0 }, today = todayISO(), on = {};
    (selectedModuleIds || []).forEach(function (id) { on[id] = 1; });
    MODS.forEach(function (m) {
      if (!on[m.id]) return;
      (window.CARDS[m.id] || []).forEach(function (_, i) {
        var st = getCardState(cardId(m.id, i));
        c[st.box] = (c[st.box] || 0) + 1;
        if (st.due <= today) c.due++;
      });
    });
    return c;
  }

  /* ---------- Sector 1: weak spots ---------- */
  function weakAll() { var p = store(true) || {}; return p.weak && p.weak.version === 1 ? p.weak : { version: 1 }; }
  function recordWeak(mid, ok) {
    if (!mid) return;
    var w = weakAll(), s = w[mid] || { wrong: 0, total: 0, last: null, topics: {} };
    s.total++; if (!ok) s.wrong++;
    s.last = todayISO(); w[mid] = s; w.version = 1;
    store(false, 'weak', w);
  }
  function weakRows() {
    var w = weakAll(), rows = [];
    MODS.forEach(function (m) { var s = w[m.id]; if (s && s.total) rows.push({ id: m.id, num: m.num, title: m.title, slug: m.slug, wrong: s.wrong, total: s.total, last: s.last, rate: s.wrong / s.total }); });
    return rows.sort(function (a, b) { return b.rate - a.rate || b.wrong - a.wrong; });
  }
  function quizModule(q) {
    var ids = Object.keys(window.QUIZ || {});
    for (var k = 0; k < ids.length; k++) {
      var bank = window.QUIZ[ids[k]];
      for (var j = 0; j < bank.length; j++) if (bank[j] === q) return ids[k];
    }
    return null;
  }
  /* seen items (Sector 1 daily plan "one new item") */
  function seenAll() { var p = store(true) || {}; return p.seen || { cards: {}, quiz: {} }; }
  function markSeen(kind, key) { var s = seenAll(); s[kind] = s[kind] || {}; if (!s[kind][key]) { s[kind][key] = todayISO(); store(false, 'seen', s); } }

  window.HM.todayISO = todayISO;
  window.HM.addDays = addDays;
  window.HM.getCardState = getCardState;
  window.HM.setCardState = setCardState;
  window.HM.isDue = isDue;
  window.HM.reviewCard = reviewCard;
  window.HM.cardId = cardId;
  window.HM.buildDueQueue = buildDueQueue;
  window.HM.boxCounts = boxCounts;
  window.HM.recordWeak = recordWeak;
  window.HM.weakRows = weakRows;
  window.HM.quizModule = quizModule;
  window.HM.seenAll = seenAll;
  window.HM.markSeen = markSeen;

  /* ---------- shell: topbar + drawer + prev/next + footer ---------- */
  function shell() {
    body.classList.add('hasnav');
    var tb = document.createElement('div'); tb.className = 'topbar';
    tb.innerHTML = '<button id="menu" aria-label="' + T('menu', 'Menu') + '">☰ ' + T('menu', 'Menu') + '</button><a class="brand" href="' + ROOT + 'index.html" aria-label="Zane Learning Hub, home"><img src="' + ROOT + 'img/logo-bar.png" width="660" height="240" alt="Zane Learning Hub"></a><a class="tb" href="' + ROOT + 'study.html">' + T('study', 'Study') + '</a>';
    body.insertBefore(tb, body.firstChild);
    var dr = document.createElement('nav'); dr.className = 'drawer'; dr.setAttribute('aria-label', 'Course');
    var h = '<a href="' + ROOT + 'index.html"><span class="n">⌂</span>' + T('home', 'Course home') + '</a><a href="' + ROOT + 'study.html"><span class="n">★</span>' + T('studyMode', 'Study: flashcards &amp; quiz') + '</a><a href="' + ROOT + 'weak.html"><span class="n">▽</span>' + T('weak', 'Weak spots') + '</a><a href="' + ROOT + 'exam.html"><span class="n">✎</span>' + T('exam', 'Mock exam') + '</a>';
    var part = 0;
    MODS.forEach(function (m) {
      if (m.part !== part) { part = m.part; h += '<h4>Part ' + part + '</h4>'; }
      var live = m.status === 'ready', done = prog[m.id] && prog[m.id].best >= 0;
      h += '<a class="' + (live ? '' : 'soon') + (m.id === CUR ? ' cur' : '') + '" href="' + (live ? ROOT + 'modules/' + m.slug + '.html' : '#') + '"><span class="n">' + m.num + '</span>' + esc(m.title) + (done ? '<span class="tick">✓</span>' : '') + '</a>';
    });
    dr.innerHTML = h; body.insertBefore(dr, tb.nextSibling);
    var sc = document.createElement('div'); sc.className = 'scrim'; body.insertBefore(sc, dr);
    var mb = tb.querySelector('#menu'); dr.id = 'drawer'; mb.setAttribute('aria-controls', 'drawer'); mb.setAttribute('aria-expanded', 'false');
    function tog(o, back) { dr.classList.toggle('open', o); sc.classList.toggle('on', o); mb.setAttribute('aria-expanded', o ? 'true' : 'false'); if (o) { var a = dr.querySelector('a:not(.soon)'); if (a) a.focus(); } else if (back) mb.focus(); }
    mb.onclick = function () { tog(true); }; sc.onclick = function () { tog(false); };
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dr.classList.contains('open')) tog(false, true); });
    var f = document.createElement('footer');
    f.innerHTML = '<b>Zane Learning Hub</b> &middot; HTML Mastery: a complete course for exam success<br>&copy; Wilfred Wanyoike. All rights reserved. &middot; <a href="' + ROOT + 'changelog.html">Changelog</a>';
    body.appendChild(f);
    if (CUR) {
      var i = MODS.findIndex(function (m) { return m.id === CUR; }), pn = document.querySelector('.pn');
      if (pn && i > -1) {
        var p = MODS[i - 1], n = MODS[i + 1], x = '';
        x += p && p.status === 'ready' ? '<a class="btn alt" href="' + p.slug + '.html">← ' + esc(p.title) + '</a>' : '<span></span>';
        x += n && n.status === 'ready' ? '<a class="btn" href="' + n.slug + '.html">' + esc(n.title) + ' →</a>' : '<a class="btn" href="../study.html">Study mode →</a>';
        pn.innerHTML = x;
      }
      var cur = prog[CUR] || {}; if (!cur.visited) { cur.visited = true; if (cur.best == null) cur.best = -1; store(false, CUR, cur); }
    }
  }

  /* ---------- tiny syntax highlighter (operates on escaped text) ---------- */
  function hl(code) {
    var t = code.textContent, o = esc(t);
    o = o.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '\u0001$1\u0002');
    o = o.replace(/([\w:-]+)=(&quot;|")([^"\n]*?)(&quot;|")/g, '<span class="at">$1</span>=<span class="st">"$3"</span>');
    o = o.replace(/(&lt;\/?)([a-zA-Z][\w-]*|!DOCTYPE)/gi, '$1<span class="tg">$2</span>');
    o = o.replace(/\u0001([\s\S]*?)\u0002/g, function (m, c) { return '<span class="cm">' + c.replace(/<span[^>]*>|<\/span>/g, '') + '</span>'; });
    code.innerHTML = o;
  }
  function codeBlocks() {
    document.querySelectorAll('pre > code').forEach(function (c) {
      if (c.getAttribute('data-lang') !== 'text') hl(c);
      var b = document.createElement('button'); b.className = 'copy'; b.textContent = 'Copy';
      b.onclick = function () { var t = c.textContent; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { b.textContent = 'Copied ✓'; }, function () { b.textContent = 'Select & copy'; }); setTimeout(function () { b.textContent = 'Copy'; }, 1500); };
      c.parentNode.appendChild(b);
    });
  }

  /* ---------- live editor ---------- */
  function editors() {
    document.querySelectorAll('textarea.try-src').forEach(function (src) {
      var orig = src.value, w = document.createElement('div'); w.className = 'try';
      w.innerHTML = '<div class="bar"><b>▶ Try it: ' + esc(src.getAttribute('data-title') || 'Live editor') + '</b><button class="g" data-a="reset">Reset</button><button data-a="run">Run</button></div><div class="cols"><textarea spellcheck="false" aria-label="HTML code editor"></textarea><iframe sandbox="allow-scripts allow-modals" title="Live preview"></iframe></div>';
      var ta = w.querySelector('textarea'), fr = w.querySelector('iframe'); ta.value = orig;
      function run() { fr.srcdoc = ta.value; }
      w.querySelector('[data-a=run]').onclick = run; w.querySelector('[data-a=reset]').onclick = function () { ta.value = orig; run(); };
      ta.addEventListener('keydown', function (e) { if (e.key === 'Tab') { e.preventDefault(); var s = ta.selectionStart; ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = s + 2; } if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') run(); });
      var t; ta.addEventListener('input', function () { clearTimeout(t); t = setTimeout(run, 600); });
      /* The preview is mounted on first use (Run, Ctrl+Enter, typing, or focusing the editor) rather
         than at page load: dozens of live documents cost far more than they are worth until asked for. */
      var started = false;
      function boot() { if (!started) { started = true; run(); } }
      w.querySelector('[data-a=run]').addEventListener('click', boot, true);
      ta.addEventListener('focus', boot, { once: true });
      src.parentNode.replaceChild(w, src);
    });
  }

  /* ---------- quiz engine (also used by study + exam) ---------- */
  window.HM.renderQuiz = function (el, qs, opts) {
    opts = opts || {}; var score = 0, answered = 0, mid = opts.mid || null;
    el.innerHTML = (opts.title ? '<h3>' + esc(opts.title) + '</h3>' : '');
    qs.forEach(function (q, qi) {
      var d = document.createElement('div'); d.className = 'q';
      d.innerHTML = '<p>' + (qi + 1) + '. ' + md(q.q) + '</p>';
      q.o.forEach(function (o, oi) {
        var b = document.createElement('button'); b.className = 'opt'; b.innerHTML = md(o);
        b.onclick = function () {
          if (d.getAttribute('data-done')) return; d.setAttribute('data-done', 1); answered++;
          var ok = oi === q.a; if (ok) score++; b.classList.add(ok ? 'ok' : 'no');
          if (!ok) d.querySelectorAll('.opt')[q.a].classList.add('ok');
          var w = d.querySelector('.why'); if (w) w.classList.add('on');
          /* Sector 1: every attempt updates that module's weak-spot record. */
          var qm = mid || quizModule(q);
          if (qm) { recordWeak(qm, ok); markSeen('quiz', qm + ':' + (window.QUIZ[qm] || []).indexOf(q)); }
          if (answered === qs.length) done();
        };
        d.appendChild(b);
      });
      var w = document.createElement('div'); w.className = 'why'; w.innerHTML = '💡 ' + md(q.w || ''); d.appendChild(w); el.appendChild(d);
    });
    var sc = document.createElement('div'); sc.className = 'score'; el.appendChild(sc);
    function done() {
      var pct = Math.round(score / qs.length * 100);
      sc.innerHTML = 'Score: ' + score + '/' + qs.length + ' (' + pct + '%) ' + (pct >= 80 ? '🏆 Distinction' : pct >= 50 ? '👍 Pass: review the 💡 notes' : '📖 Re-read the module, then retry') + '<br><br>';
      var r = document.createElement('button'); r.className = 'btn'; r.textContent = 'Retry'; r.onclick = function () { window.HM.renderQuiz(el, qs, opts); }; sc.appendChild(r);
      if (opts.save) { var c = store(true)[opts.save] || {}; c.best = Math.max(c.best || 0, pct); c.visited = true; store(false, opts.save, c); }
      if (opts.onDone) opts.onDone(score, qs.length);
    }
  };
  function pageQuiz() {
    var el = document.querySelector('.quiz[data-id]'); if (!el || !window.QUIZ) return;
    var id = el.getAttribute('data-id'); if (!(window.QUIZ[id] || []).length) { el.remove(); return; }
    window.HM.renderQuiz(el, window.QUIZ[id], { title: 'Check your understanding', save: id, mid: id });
  }

  function init() { if (document.body.hasAttribute('data-nonav')) return; shell(); codeBlocks(); editors(); pageQuiz(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
