/* Practice engine (Sector 3): challenges, hint ladder, auto-checks, break-it labs.
   Challenge data lives in window.CHALLENGES, keyed by module id. (c) Wilfred Wanyoike */
(function () {
  'use strict';
  var root = document.querySelector('.practice[data-id]');
  if (!root || !window.HM) return;
  var MID = root.getAttribute('data-id'), list = (window.CHALLENGES || {})[MID] || [];
  if (!list.length) { root.remove(); return; }

  function esc(s) { return HM.esc(s); }
  function T(k, f) { return (window.HM_T && window.HM_T(k)) || f; }
  function progAll() { var p = HM.store(true) || {}; return p.practice && p.practice.version === 1 ? p.practice : { version: 1 }; }
  function state(cid) { var p = progAll(); return (p[MID] && p[MID][cid]) || { passed: false, attempts: 0, hints: 0, breakit: false }; }
  function save(cid, st) { var p = progAll(); p[MID] = p[MID] || {}; p[MID][cid] = st; p.version = 1; HM.store(false, 'practice', p); }

  var head = document.createElement('div');
  head.className = 'ch-head';
  root.parentNode.insertBefore(head, root);
  function summary() {
    var passed = list.filter(function (c) { return state(c.id).passed; }).length;
    head.innerHTML = '<h2>' + T('practice', 'Practice: build it yourself') + '</h2><p class="small" id="chcount" role="status">' + passed + ' of ' + list.length +
      ' challenges passed. Type HTML, press <b>' + T('runcheck', 'Run &amp; check') + '</b>, and the checker inspects the rendered page.</p>';
  }
  summary();

  function harness(cid, checks) {
    return '\n<script id="hm-checks" type="application/json">' + JSON.stringify(checks).replace(/</g, '\\u003c') + '<\/script>\n' +
      '<script>(function(){function report(){var out=[];var defs;try{defs=JSON.parse(document.getElementById("hm-checks").textContent)}catch(e){defs=[]}' +
      'defs.forEach(function(d){var ok=false,err=null;try{ok=!!(new Function("doc",d.js))(document)}catch(e){err=e.message}out.push({ok:ok,msg:d.msg,err:err})});' +
      'parent.postMessage({hm:"checks",cid:' + JSON.stringify(cid) + ',results:out},"*")}' +
      'if(document.readyState==="complete")report();else window.addEventListener("load",report)})()<\/script>';
  }

  function card(c, n) {
    var st = state(c.id), el = document.createElement('article');
    el.className = 'ch' + (st.passed ? ' done' : '');
    el.setAttribute('data-cid', c.id);
    el.innerHTML =
      '<header><h3><span class="ch-n">Challenge ' + n + '</span> ' + esc(c.title) + '</h3><span class="ch-state">' + (st.passed ? '✓ Passed' : 'Not passed yet') + '</span></header>' +
      '<p class="ch-goal">' + HM.md(c.goal) + '</p>' +
      '<div class="cols"><textarea spellcheck="false" aria-label="Challenge ' + n + ' code editor"></textarea>' +
      '<div class="ch-prev small">Press <b>Run &amp; check</b> to render your page here.</div></div>' +
      '<div class="ch-bar"><button type="button" class="btn" data-a="run">Run &amp; check</button>' +
      '<button type="button" class="btn alt" data-a="hint">Hint 1 of ' + (c.hints || []).length + '</button>' +
      '<button type="button" class="btn alt" data-a="sol">Show solution</button></div>' +
      '<div class="ch-log small" role="status" aria-live="polite">Press Run &amp; check when you are ready.</div>' +
      '<div class="ch-hints"></div><div class="ch-sol" hidden></div>' +
      (c.breakit ? '<div class="ch-break"><h4>Break it: predict first</h4><p>' + HM.md(c.breakit.prompt) + '</p><div class="ch-opts"></div><div class="ch-blog small"></div></div>' : '');
    var ta = el.querySelector('textarea'), fr = null, log = el.querySelector('.ch-log');
    var hints = el.querySelector('.ch-hints'), hintBtn = el.querySelector('[data-a=hint]'), sol = el.querySelector('.ch-sol');
    ta.value = c.starter || '';
    var revealed = 0, lastResults = null;

    function run() {
      lastResults = null;
      log.textContent = 'Checking…';
      if (!fr) {
        fr = document.createElement('iframe');
        fr.setAttribute('sandbox', 'allow-scripts allow-modals');
        fr.setAttribute('title', 'Challenge ' + n + ' preview');
        el.querySelector('.ch-prev').replaceWith(fr);
        window.addEventListener('message', function (e) {
          if (!fr || e.source !== fr.contentWindow || !e.data || e.data.hm !== 'checks' || e.data.cid !== c.id) return;
          lastResults = e.data.results; showResults(lastResults);
        });
      }
      fr.srcdoc = ta.value + harness(c.id, c.checks || []);
      var stamp = Date.now(); el.setAttribute('data-run', stamp);
      setTimeout(function () {
        if (el.getAttribute('data-run') === String(stamp) && !lastResults) {
          log.innerHTML = '⚠ No result. A syntax error can stop the page running — check tags are closed.';
        }
      }, 3500);
    }
    function showResults(results) {
      var all = results.length && results.every(function (r) { return r.ok; });
      log.innerHTML = results.map(function (r, i) {
        return '<span class="' + (r.ok ? 'ok' : 'no') + '">' + (r.ok ? '✓' : '✗') + ' ' + esc(r.msg) + (r.err ? ' <i>(' + esc(r.err) + ')</i>' : '') + '</span>';
      }).join('<br>');
      var st = state(c.id); st.attempts++;
      if (all) { st.passed = true; el.classList.add('done'); el.querySelector('.ch-state').textContent = '✓ Passed'; log.insertAdjacentHTML('afterbegin', '<b class="ok">Challenge passed.</b><br>'); }
      save(c.id, st); summary();
      if (window.HM.recordWeak) window.HM.recordWeak(MID, all);
    }
    el.querySelector('[data-a=run]').onclick = run;
    hintBtn.textContent = T('hint', 'Hint') + ' 1 of ' + (c.hints || []).length;
    hintBtn.onclick = function () {
      var hs = c.hints || [];
      if (revealed >= hs.length) return;
      var p = document.createElement('p'); p.className = 'ch-hint'; p.innerHTML = '<b>Hint ' + (revealed + 1) + ':</b> ' + HM.md(hs[revealed]);
      hints.appendChild(p); revealed++;
      var st = state(c.id); st.hints = Math.max(st.hints || 0, revealed); save(c.id, st);
      hintBtn.textContent = revealed >= hs.length ? 'All hints shown' : 'Hint ' + (revealed + 1) + ' of ' + hs.length;
      hintBtn.disabled = revealed >= hs.length;
    };
    el.querySelector('[data-a=sol]').onclick = function () {
      var open = sol.hasAttribute('hidden');
      if (open) {
        sol.innerHTML = '<p class="small">Compare with your version, then press <b>Use this code</b> to load it into the editor.</p><pre><code>' + esc(c.solution || '') + '</code></pre>' +
          '<button type="button" class="btn alt" data-a="use">Use this code</button>';
        sol.querySelector('[data-a=use]').onclick = function () { ta.value = c.solution || ''; run(); };
      }
      sol.hidden = !open;
      el.querySelector('[data-a=sol]').textContent = open ? 'Hide solution' : 'Show solution';
    };
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') { e.preventDefault(); var s = ta.selectionStart; ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = s + 2; }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') run();
    });
    if (c.breakit) {
      var opts = el.querySelector('.ch-opts'), blog = el.querySelector('.ch-blog');
      c.breakit.options.forEach(function (o, i) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'btn alt ch-opt'; b.textContent = o;
        b.onclick = function () {
          var ok = i === c.breakit.answer;
          if (ok) b.classList.add('ok'); else { b.classList.add('no'); opts.children[c.breakit.answer].classList.add('ok'); }
          blog.innerHTML = (ok ? '✓ Correct. ' : '✗ Not quite. ') + HM.md(c.breakit.why);
          if (ok) { var st2 = state(c.id); st2.breakit = true; save(c.id, st2); }
          Array.prototype.forEach.call(opts.children, function (x) { x.disabled = true; });
        };
        opts.appendChild(b);
      });
    }
    return el;
  }

  var shown = 0;
  function render() {
    list.forEach(function (c) { if (!root.querySelector('[data-cid="' + c.id + '"]')) root.appendChild(card(c, ++shown)); });
  }
  render();
})();
