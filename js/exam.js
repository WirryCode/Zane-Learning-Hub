/* HTML Mastery: timed, graded mock exam. Draws PER questions from every module's QUIZ bank,
   shuffles questions and options, counts down from a stored end time (survives a refresh),
   locks each answer once chosen, grades on submit or at 00:00. Reuses the quiz CSS (.quiz .q .opt .why),
   not HM.renderQuiz, because an exam must not reveal answers while it runs. (c) Wilfred Wanyoike */
(function () {
  'use strict';
  var PER = 2, MINUTES = 45, LOW = 5 * 60000, KEY = 'hm_exam_run', SID = 'm21';
  var HM = window.HM, esc = HM.esc, md = HM.md;
  var root, S = null, timer = null, announced = {};
  var mods = (window.MODULES || []).filter(function (m) { return m.id !== SID && m.status === 'ready' && window.QUIZ[m.id] && window.QUIZ[m.id].length >= PER; });
  var TOTAL = mods.length * PER;

  /* ---------- helpers ---------- */
  function shuffle(a) { for (var k = a.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = a[k]; a[k] = a[j]; a[j] = t; } return a; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function qh(q) { var s = q.q + '|' + q.o.join('|'), h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; } /* detects an edited question bank */
  function modOf(id) { return mods.filter(function (m) { return m.id === id; })[0]; }
  function stats() { return (HM.store(true) || {})[SID] || {}; }
  function band(pct) {
    if (pct >= 80) return { label: '🏆 Distinction', msg: 'Excellent. You are exam-ready: keep the cheat sheet nearby for a last skim.' };
    if (pct >= 50) return { label: '👍 Pass', msg: 'A solid pass. Read the explanations for every miss, then retry for Distinction (80%+).' };
    return { label: '📖 Retry', msg: 'Not there yet (pass mark is 50%). Revise the modules flagged below, then retry with fresh questions.' };
  }

  /* ---------- storage (try/catch like HM.store; the exam still runs in memory if saving is blocked) ---------- */
  function warn(show) { var w = document.getElementById('exwarn'); if (w) w.hidden = !show; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); warn(false); } catch (e) { warn(true); } }
  function wipe() { try { localStorage.removeItem(KEY); } catch (e) {} }
  function valid(s) {
    if (!s || s.v !== 1 || !s.qs || s.qs.length !== TOTAL || !s.ans || s.ans.length !== TOTAL) return false;
    return s.qs.every(function (r) { var q = window.QUIZ[r.m] && window.QUIZ[r.m][r.i]; return q && r.p && r.p.length === q.o.length && r.h === qh(q); });
  }
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY)); return valid(s) ? s : null; } catch (e) { return null; } }
  function record(res) { /* best score + attempt count + the questions just seen (so a retry draws fresh ones) */
    var c = stats();
    c.best = Math.max(typeof c.best === 'number' ? c.best : 0, res.pct); c.attempts = (Number(c.attempts) || 0) + 1;
    c.last = S.qs.map(function (r) { return r.m + ':' + r.i; }); c.lastPct = res.pct; c.visited = true;
    HM.store(false, SID, c); S.best = c.best; S.attempts = c.attempts;
  }

  /* ---------- sampling and grading ---------- */
  function start() {
    var seen = {}; (stats().last || []).forEach(function (k) { seen[k] = 1; });
    var qs = [];
    mods.forEach(function (m) {
      var bank = window.QUIZ[m.id], idx = bank.map(function (_, i) { return i; });
      var fresh = shuffle(idx.filter(function (i) { return !seen[m.id + ':' + i]; })), old = shuffle(idx.filter(function (i) { return seen[m.id + ':' + i]; }));
      fresh.concat(old).slice(0, PER).forEach(function (i) { qs.push({ m: m.id, i: i, h: qh(bank[i]), p: shuffle(bank[i].o.map(function (_, j) { return j; })) }); });
    });
    var now = Date.now();
    S = { v: 1, start: now, end: now + MINUTES * 60000, qs: shuffle(qs), ans: [], phase: 'run', counted: false };
    for (var k = 0; k < TOTAL; k++) S.ans.push(null);
    announced = {}; save(); showRun(true);
  }
  function grade() {
    var per = {}, score = 0;
    var items = S.qs.map(function (r, n) {
      var q = window.QUIZ[r.m][r.i], right = r.p.indexOf(q.a), got = S.ans[n], ok = got === right;
      per[r.m] = per[r.m] || [0, 0]; per[r.m][1]++; if (ok) { per[r.m][0]++; score++; }
      return { n: n, r: r, q: q, right: right, got: got, ok: ok };
    });
    return { score: score, total: S.qs.length, pct: Math.round(score / S.qs.length * 100), per: per, items: items };
  }
  function answered() { return S.ans.filter(function (a) { return a !== null; }).length; }

  /* ---------- screens ---------- */
  function showIntro() {
    clearInterval(timer);
    var c = stats(), has = typeof c.best === 'number' && c.best >= 0;
    root.innerHTML = '<div class="ex-intro"><div class="ex-stats">' + (has ? '<span class="chip">Best score: ' + c.best + '%</span><span class="chip">Attempts: ' + (Number(c.attempts) || 0) + '</span>' : '<span class="chip">No attempts yet</span>') + '</div>' +
      '<h2>The rules</h2><ul>' +
      '<li><b>' + TOTAL + ' questions</b>: ' + PER + ' from each of the ' + mods.length + ' modules, in random order with shuffled options.</li>' +
      '<li><b>' + MINUTES + ' minutes.</b> The clock keeps running if you refresh or close the tab, and the exam submits itself at 00:00.</li>' +
      '<li><b>Answers lock</b> the moment you pick one. No going back, so read each question twice.</li>' +
      '<li>Unanswered questions score zero. Grades: <b>Distinction</b> 80% and above, <b>Pass</b> 50% and above, otherwise <b>Retry</b>.</li>' +
      '<li>When you finish you get a module-by-module breakdown and the explanation for every question you missed. Each attempt draws fresh questions where possible.</li></ul>' +
      '<p><button class="btn big" id="exgo" type="button">Start the exam</button></p>' +
      '<p class="small" style="text-align:left">Not ready? Skim the <a href="modules/mock-exam.html">cheat sheet and acronym vault</a> or drill <a href="study.html">Study mode</a> first.</p></div>';
    document.getElementById('exgo').onclick = start;
  }

  function showRun(focus) {
    root.innerHTML = '<div class="ex-bar" id="exbar"><span class="ex-clock" id="exclock" role="timer" aria-label="Time remaining"></span>' +
      '<span class="ex-count"><b id="exans">0</b> / ' + TOTAL + ' answered</span><button class="btn" id="exsub" type="button">Submit</button>' +
      '<div class="ex-prog" aria-hidden="true"><i id="exprog"></i></div><div class="ex-confirm" id="exconf" hidden></div></div>' +
      '<p class="small" id="exwarn" hidden>This browser is blocking saving, so do not refresh: you would lose the exam.</p>' +
      '<details class="ex-map"><summary>Question map (jump to a question)</summary><div class="ex-map-g" id="exmap"></div></details>' +
      '<div class="quiz" id="exqs"><h3 id="exh" tabindex="-1">Mock exam: ' + TOTAL + ' questions</h3></div>' +
      '<div class="fcnav"><button class="btn" id="exsub2" type="button">Submit exam</button></div><div class="sr" id="exlive" role="status" aria-live="polite"></div>';
    var box = document.getElementById('exqs'), map = document.getElementById('exmap');
    S.qs.forEach(function (r, n) {
      var q = window.QUIZ[r.m][r.i], d = document.createElement('div'); d.className = 'q'; d.id = 'eq-' + n;
      d.innerHTML = '<p id="eqp-' + n + '">' + (n + 1) + '. ' + md(q.q) + '</p><div role="group" aria-labelledby="eqp-' + n + '"></div>';
      var g = d.lastChild;
      r.p.forEach(function (orig, j) { var b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.innerHTML = md(q.o[orig]); b.onclick = function () { choose(n, j); }; g.appendChild(b); });
      box.appendChild(d);
      var a = document.createElement('a'); a.href = '#eq-' + n; a.id = 'em-' + n; a.textContent = n + 1; a.setAttribute('aria-label', 'Question ' + (n + 1)); map.appendChild(a);
    });
    S.ans.forEach(function (j, n) { if (j !== null) lock(n); });
    document.getElementById('exsub').onclick = document.getElementById('exsub2').onclick = askSubmit;
    var left = S.end - Date.now(); [10, 5, 1].forEach(function (m) { if (left <= m * 60000) announced[m] = 1; });
    refresh(); tick(); clearInterval(timer); timer = setInterval(tick, 250);
    if (focus) document.getElementById('exh').focus();
    save();
  }

  function lock(n) { /* pressed state on the chosen option, aria-disabled on all (stay focusable so keyboard focus is not lost) */
    var g = document.querySelector('#eq-' + n + ' [role=group]'), btns = g.children;
    for (var j = 0; j < btns.length; j++) { btns[j].setAttribute('aria-disabled', 'true'); if (j === S.ans[n]) { btns[j].classList.add('sel'); btns[j].setAttribute('aria-pressed', 'true'); } }
    document.getElementById('em-' + n).classList.add('done');
  }
  function choose(n, j) {
    if (!S || S.phase !== 'run' || S.ans[n] !== null) return;
    S.ans[n] = j; lock(n); refresh(); save();
  }
  function refresh() {
    var a = answered(); document.getElementById('exans').textContent = a;
    document.getElementById('exprog').style.width = (a / TOTAL * 100) + '%';
  }

  function tick() {
    if (!S || S.phase !== 'run') return;
    var left = S.end - Date.now();
    if (left <= 0) { submit(true); return; }
    var sec = Math.ceil(left / 1000), el = document.getElementById('exclock');
    if (el) { el.textContent = pad(Math.floor(sec / 60)) + ':' + pad(sec % 60); el.classList.toggle('low', left < LOW); }
    [10, 5, 1].forEach(function (m) {
      if (left <= m * 60000 && !announced[m]) { announced[m] = 1; var l = document.getElementById('exlive'); if (l) l.textContent = m + (m === 1 ? ' minute' : ' minutes') + ' left'; }
    });
  }

  function askSubmit() {
    var left = TOTAL - answered(); if (!left) { submit(false); return; }
    var c = document.getElementById('exconf'); c.hidden = false;
    c.innerHTML = '<p style="margin:0 0 .3rem">You have <b>' + left + '</b> unanswered question' + (left > 1 ? 's' : '') + ', which score zero. Submit now?</p><button class="btn" id="exyes" type="button">Yes, submit</button><button class="btn alt" id="exno" type="button">Keep going</button>';
    var no = document.getElementById('exno'); no.focus();
    function close() { c.hidden = true; c.innerHTML = ''; document.getElementById('exsub').focus(); }
    no.onclick = close; document.getElementById('exyes').onclick = function () { submit(false); };
    c.onkeydown = function (e) { if (e.key === 'Escape') { e.preventDefault(); close(); } };
  }

  function submit(auto) {
    if (!S || S.phase === 'done') return;
    clearInterval(timer);
    S.phase = 'done'; S.auto = !!auto; S.submitted = Math.min(Date.now(), S.end);
    var res = grade(); if (!S.counted) { S.counted = true; record(res); }
    /* Sector 1: every graded answer (right or wrong) updates that module's weak-spot record. */
    res.items.forEach(function (it) { HM.recordWeak(it.r.m, it.ok); });
    save(); showResult(res, true);
  }

  function showResult(res, focus) {
    var used = S.submitted - S.start, b = band(res.pct), c = stats();
    var best = Number(S.best != null ? S.best : c.best), att = Number(S.attempts != null ? S.attempts : c.attempts);
    var weak = mods.filter(function (m) { return res.per[m.id] && res.per[m.id][0] < res.per[m.id][1]; });
    var h = '<div class="ex-res"><h2 id="exh" tabindex="-1">Your result</h2><div class="big">' + res.score + ' / ' + res.total + ' &middot; ' + res.pct + '%</div><div class="band">' + b.label + '</div>' +
      (S.auto ? '<p>⏱ Time ran out, so the exam was submitted automatically.</p>' : '') +
      '<p>Time used: ' + Math.floor(used / 60000) + ' min ' + Math.floor(used % 60000 / 1000) + ' s &middot; Best score: ' + best + '% &middot; Attempts: ' + att + '</p><p>' + b.msg + '</p>' +
      '<div class="fcnav" style="justify-content:flex-start;margin-top:.8rem"><button class="btn" id="exretry" type="button">Retry with fresh questions</button><a class="btn alt" href="modules/mock-exam.html">Cheat sheet</a><button class="btn alt" id="exhome" type="button">Exam home</button></div></div>';
    h += '<h2>Breakdown by module</h2>' + (weak.length ? '<p>Revise first: ' + weak.map(function (m) { return '<a href="weak.html?m=' + m.id + '">M' + m.num + ' ' + esc(m.title) + '</a>'; }).join(', ') + '.</p>' : '<p>Every module answered correctly. Superb.</p>');
    h += '<table class="t ex-bk"><tr><th>Module</th><th>Score</th><th></th></tr>';
    mods.forEach(function (m) {
      var p = res.per[m.id] || [0, PER];
      h += '<tr><td><a href="weak.html?m=' + m.id + '">M' + m.num + ' ' + esc(m.title) + '</a></td><td>' + p[0] + ' / ' + p[1] + '</td><td class="bar"><span class="meter"><i class="' + (p[0] === p[1] ? 'full' : '') + '" style="width:' + Math.round(p[0] / p[1] * 100) + '%"></i></span></td></tr>';
    });
    h += '</table><h2>Review</h2><div class="ex-rv-tools"><button class="btn" id="exw" type="button" aria-pressed="true"></button><button class="btn alt" id="exall" type="button" aria-pressed="false">All ' + res.total + ' questions</button></div><div class="quiz" id="exrv"></div>';
    root.innerHTML = h;
    var wrong = res.items.filter(function (it) { return !it.ok; }), W = document.getElementById('exw'), A = document.getElementById('exall');
    W.textContent = 'Wrong or unanswered (' + wrong.length + ')';
    function review(all) {
      var list = all ? res.items : wrong, box = document.getElementById('exrv'); box.innerHTML = '';
      W.setAttribute('aria-pressed', !all); A.setAttribute('aria-pressed', all); W.className = all ? 'btn alt' : 'btn'; A.className = all ? 'btn' : 'btn alt';
      if (!list.length) box.innerHTML = '<p>Nothing to review: a perfect paper. 🎉</p>';
      list.forEach(function (it) { box.appendChild(reviewItem(it)); });
    }
    W.onclick = function () { review(false); }; A.onclick = function () { review(true); };
    review(!wrong.length);
    document.getElementById('exretry').onclick = start;
    document.getElementById('exhome').onclick = function () { wipe(); S = null; showIntro(); };
    if (focus) { document.getElementById('exh').focus(); window.scrollTo(0, 0); }
  }

  function reviewItem(it) {
    var m = modOf(it.r.m), d = document.createElement('div'); d.className = 'q';
    var tag = it.got === null ? '<span class="ex-tag n">Not answered</span>' : it.ok ? '<span class="ex-tag k">Correct</span>' : '<span class="ex-tag w">Wrong</span>';
    d.innerHTML = '<div class="ex-meta">' + tag + '<span class="ex-tag m"><a href="weak.html?m=' + m.id + '">M' + m.num + ' ' + esc(m.title) + '</a></span></div><p>' + (it.n + 1) + '. ' + md(it.q.q) + '</p>';
    it.r.p.forEach(function (orig, j) {
      var o = document.createElement('div'); o.className = 'opt' + (j === it.right ? ' ok' : j === it.got ? ' no' : ''); o.setAttribute('aria-disabled', 'true');
      o.innerHTML = md(it.q.o[orig]) + (j === it.got ? ' <small>← your answer</small>' : ''); d.appendChild(o);
    });
    var w = document.createElement('div'); w.className = 'why on'; w.innerHTML = '💡 ' + md(it.q.w || ''); d.appendChild(w);
    return d;
  }

  /* ---------- boot ---------- */
  function init() {
    root = document.getElementById('exam'); if (!root) return;
    document.documentElement.classList.add('exam');
    var tb = document.querySelector('.topbar');
    function tbh() { if (tb) document.documentElement.style.setProperty('--tbh', tb.offsetHeight + 'px'); }
    tbh(); window.addEventListener('resize', tbh);
    document.addEventListener('visibilitychange', tick);
    S = load();
    if (!S) { showIntro(); return; }
    if (S.phase === 'run') { if (Date.now() >= S.end) submit(true); else showRun(false); return; }
    showResult(grade(), false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
