/* Study mode: Leitner flashcards, mixed quiz and the daily 10-minute plan.
   Reads window.CARDS / window.QUIZ. (c) Wilfred Wanyoike */
(function () {
  var sel = {}, queue = [], qi = 0, flipped = false, reviewed = 0, reviewAll = false;
  var mods = MODULES.filter(function (m) { return window.CARDS[m.id] || window.QUIZ[m.id]; });
  mods.forEach(function (m) { sel[m.id] = true; });
  var chips = document.getElementById('chips'), fcv = document.getElementById('fcv'), qzv = document.getElementById('qzv'), plv = document.getElementById('plv');
  var tabs = [document.getElementById('t1'), document.getElementById('t2'), document.getElementById('t3')];

  function selected() { return mods.filter(function (m) { return sel[m.id]; }).map(function (m) { return m.id; }); }
  function drawChips() {
    chips.innerHTML = '';
    mods.forEach(function (m) { var b = document.createElement('button'); b.type = 'button'; b.textContent = m.num + ' ' + m.title; b.className = sel[m.id] ? 'on' : ''; b.setAttribute('aria-pressed', sel[m.id] ? 'true' : 'false'); b.onclick = function () { sel[m.id] = !sel[m.id]; drawChips(); buildFlash(); if (!plv.hidden) planOpen(); }; chips.appendChild(b); });
  }
  function shuffle(a) { for (var k = a.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = a[k]; a[k] = a[j]; a[j] = t; } return a; }
  function allCards() {
    var out = [];
    mods.forEach(function (m) { if (sel[m.id]) (window.CARDS[m.id] || []).forEach(function (c, i) { out.push({ id: HM.cardId(m.id, i), mid: m.id, index: i }); }); });
    return out;
  }
  function countsLine() {
    var c = HM.boxCounts(selected());
    return '<p class="small fc-count" id="fccount">Due today: ' + c.due + ' &middot; Box 1: ' + c[1] + ' &middot; Box 2: ' + c[2] + ' &middot; Box 3: ' + c[3] + ' &middot; Box 4: ' + c[4] + ' &middot; Box 5: ' + c[5] + '</p>';
  }
  function buildFlash() {
    queue = reviewAll ? allCards() : HM.buildDueQueue(selected());
    shuffle(queue); qi = 0; flipped = false; reviewed = 0; renderCard();
  }
  function renderCard() {
    if (!selected().length) { fcv.innerHTML = countsLine() + '<p class="small">Select at least one module above.</p>'; return; }
    if (qi >= queue.length) {
      fcv.innerHTML = countsLine() + '<div class="fc"><div class="face f">Session complete — You reviewed ' + reviewed + ' card' + (reviewed === 1 ? '' : 's') + ' today</div></div>' +
        '<div class="fcnav"><button class="btn" id="more" type="button">Review more (all cards)</button><a class="btn alt" href="weak.html">Weak spots</a></div>';
      document.getElementById('more').onclick = function () { reviewAll = true; buildFlash(); };
      return;
    }
    var item = queue[qi], c = window.CARDS[item.mid][item.index], st = HM.getCardState(item.id);
    fcv.innerHTML = countsLine() +
      '<p class="small">Card ' + (qi + 1) + ' of ' + queue.length + ' &middot; Box ' + st.box + ' &middot; ' + (flipped ? 'answer' : 'tap card to flip') + '</p>' +
      '<div class="fc"><div class="face ' + (flipped ? 'b' : 'f') + '" id="face" role="button" tabindex="0" aria-label="' + (flipped ? 'Show question' : 'Show answer') + '">' + HM.md(flipped ? c.b : c.f) + '</div></div>' +
      '<div class="fcnav"><button class="btn alt" id="again" type="button">Again</button><button class="btn alt" id="hard" type="button">Hard</button><button class="btn" id="good" type="button">Good</button><button class="btn" id="easy" type="button">Easy</button></div>' +
      '<p class="small">Again: back to Box 1 &middot; Hard: one box down &middot; Good/Easy: on to the next box.</p>';
    var face = document.getElementById('face');
    function flip() { flipped = !flipped; renderCard(); }
    face.onclick = flip; face.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } };
    function answer(grade) { HM.reviewCard(item.id, grade); HM.markSeen('cards', item.id); reviewed++; qi++; flipped = false; renderCard(); }
    document.getElementById('again').onclick = function () { answer('again'); };
    document.getElementById('hard').onclick = function () { answer('hard'); };
    document.getElementById('good').onclick = function () { answer('good'); };
    document.getElementById('easy').onclick = function () { answer('easy'); };
  }
  function quiz() {
    var pool = [];
    mods.forEach(function (m) { if (sel[m.id]) (window.QUIZ[m.id] || []).forEach(function (q) { pool.push(q); }); });
    if (!pool.length) { qzv.innerHTML = '<p class="small">Select at least one module above.</p>'; return; }
    var qs = shuffle(pool.slice()).slice(0, 10), box = document.createElement('div'); box.className = 'quiz'; qzv.innerHTML = ''; qzv.appendChild(box);
    HM.renderQuiz(box, qs, { title: 'Mixed quiz (' + qs.length + ' questions)' });
  }

  /* ---------- Today's 10-minute plan ---------- */
  function planGet() { var p = HM.store(true) || {}; return p.plan || null; }
  function planSave(pl) { HM.store(false, 'plan', pl); }
  function newPlan() {
    var selIds = selected(), due = HM.buildDueQueue(selIds).slice(0, 20), seen = HM.seenAll();
    var weakRows = HM.weakRows().filter(function (r) { return sel[r.id]; });
    var weak = [], used = {};
    function pickQuestion(mid) {
      var bank = window.QUIZ[mid] || [];
      for (var pass = 0; pass < 2 && weak.length < 3; pass++) {
        for (var i = 0; i < bank.length && weak.length < 3; i++) {
          if (used[mid + ':' + i]) continue;
          if (pass === 0 && (seen.quiz || {})[mid + ':' + i]) continue;
          used[mid + ':' + i] = 1; weak.push({ m: mid, i: i });
        }
      }
    }
    weakRows.forEach(function (r) { if (weak.length < 3) pickQuestion(r.id); });
    mods.forEach(function (m) { if (weak.length < 3 && sel[m.id] && window.QUIZ[m.id]) pickQuestion(m.id); });
    var newItem = null;
    (function () {
      for (var k = 0; k < mods.length && !newItem; k++) {
        var m = mods[k];
        if (!sel[m.id]) continue;
        for (var i = 0; i < (window.CARDS[m.id] || []).length; i++) {
          var id = HM.cardId(m.id, i);
          if (!(seen.cards || {})[id]) { newItem = { type: 'card', id: id, mid: m.id, index: i }; break; }
        }
      }
      if (!newItem) {
        for (var j = 0; j < mods.length && !newItem; j++) {
          var mm = mods[j];
          if (!sel[mm.id]) continue;
          for (var n = 0; n < (window.QUIZ[mm.id] || []).length; n++) {
            if (!(seen.quiz || {})[mm.id + ':' + n]) { newItem = { type: 'quiz', m: mm.id, i: n }; break; }
          }
        }
      }
      if (!newItem) newItem = { type: 'card', id: HM.cardId(mods[0].id, 0), mid: mods[0].id, index: 0 };
    })();
    var pl = { active: true, started: HM.todayISO(), cards: due.map(function (d) { return d.id; }), weak: weak, newItem: newItem, stage: due.length ? 'cards' : 'weak', cardIndex: 0, weakIndex: 0, flipped: false, answered: false, counts: { cards: 0, weak: 0, newItem: 0 }, done: false };
    planSave(pl); return pl;
  }
  function planOpen() {
    var pl = planGet();
    if (!pl || !pl.active) pl = newPlan();
    planRender(pl);
  }
  function planStepText(pl) {
    var names = { cards: 'Due cards', weak: 'Weak-spot questions', done: 'New item' };
    return '<p class="small plan-step">Step ' + (pl.stage === 'cards' ? 1 : pl.stage === 'weak' ? 2 : 3) + ' of 3 — ' + (names[pl.stage] || '') + '</p>';
  }
  function planRender(pl) {
    planSave(pl);
    if (pl.stage === 'cards') {
      if (pl.cardIndex >= pl.cards.length) { pl.stage = 'weak'; pl.answered = false; return planRender(pl); }
      var id = pl.cards[pl.cardIndex], parts = id.split('-'), mid = parts[0], index = +parts[1], c = window.CARDS[mid][index], st = HM.getCardState(id);
      plv.innerHTML = '<h2>Today\'s 10-minute plan</h2>' + planStepText(pl) + '<p class="small">Card ' + (pl.cardIndex + 1) + ' of ' + pl.cards.length + ' &middot; Box ' + st.box + ' &middot; reviewed ' + pl.counts.cards + '</p>' +
        '<div class="fc"><div class="face ' + (pl.flipped ? 'b' : 'f') + '" id="pface" role="button" tabindex="0">' + HM.md(pl.flipped ? c.b : c.f) + '</div></div>' +
        '<div class="fcnav"><button class="btn alt" id="pagain" type="button">Again</button><button class="btn alt" id="phard" type="button">Hard</button><button class="btn" id="pgood" type="button">Good</button><button class="btn" id="peasy" type="button">Easy</button></div>';
      var face = document.getElementById('pface');
      face.onclick = function () { pl.flipped = !pl.flipped; planRender(pl); };
      face.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pl.flipped = !pl.flipped; planRender(pl); } };
      function ans(g) { HM.reviewCard(id, g); HM.markSeen('cards', id); pl.counts.cards++; pl.cardIndex++; pl.flipped = false; planRender(pl); }
      document.getElementById('pagain').onclick = function () { ans('again'); };
      document.getElementById('phard').onclick = function () { ans('hard'); };
      document.getElementById('pgood').onclick = function () { ans('good'); };
      document.getElementById('peasy').onclick = function () { ans('easy'); };
      return;
    }
    if (pl.stage === 'weak') {
      if (pl.weakIndex >= pl.weak.length) { pl.stage = 'new'; pl.answered = false; return planRender(pl); }
      var w = pl.weak[pl.weakIndex], q = window.QUIZ[w.m][w.i], m = mods.filter(function (x) { return x.id === w.m; })[0];
      plv.innerHTML = '<h2>Today\'s 10-minute plan</h2>' + planStepText(pl) + '<p class="small">Weak spot ' + (pl.weakIndex + 1) + ' of ' + pl.weak.length + ' &middot; M' + m.num + ' ' + HM.esc(m.title) + '</p>' +
        '<div class="quiz"><h3>Weak-spot question</h3><div class="q" id="pq"><p>' + HM.md(q.q) + '</p></div><div class="score" id="pqs"></div></div>';
      var box = document.getElementById('pq'), out = document.getElementById('pqs');
      q.o.forEach(function (o, oi) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.innerHTML = HM.md(o);
        b.onclick = function () {
          if (pl.answered) return; pl.answered = true;
          var ok = oi === q.a; if (ok) b.classList.add('ok'); else { b.classList.add('no'); box.querySelectorAll('.opt')[q.a].classList.add('ok'); }
          HM.recordWeak(w.m, ok); HM.markSeen('quiz', w.m + ':' + w.i);
          if (ok) pl.counts.weak++;
          out.innerHTML = '💡 ' + HM.md(q.w || '') + '<br><br>';
          var nx = document.createElement('button'); nx.type = 'button'; nx.className = 'btn'; nx.textContent = pl.weakIndex + 1 >= pl.weak.length ? 'Continue' : 'Next question';
          nx.onclick = function () { pl.weakIndex++; pl.answered = false; planRender(pl); };
          out.appendChild(nx); nx.focus(); planSave(pl);
        };
        box.appendChild(b);
      });
      var skip = document.createElement('button'); skip.type = 'button'; skip.className = 'btn alt'; skip.textContent = 'Skip this question';
      skip.onclick = function () { pl.weakIndex++; pl.answered = false; planRender(pl); };
      out.appendChild(skip);
      return;
    }
    if (pl.stage === 'new') {
      var n = pl.newItem;
      if (n.type === 'card') {
        var nc = window.CARDS[n.mid][n.index];
        plv.innerHTML = '<h2>Today\'s 10-minute plan</h2>' + planStepText(pl) + '<p class="small">One new card</p><div class="fc"><div class="face ' + (pl.flipped ? 'b' : 'f') + '" id="pface" role="button" tabindex="0">' + HM.md(pl.flipped ? nc.b : nc.f) + '</div></div>' +
          '<div class="fcnav"><button class="btn" id="pnew" type="button">' + (pl.flipped ? 'Finish the plan' : 'Show the answer') + '</button></div>';
        document.getElementById('pface').onclick = function () { pl.flipped = !pl.flipped; planRender(pl); };
        document.getElementById('pnew').onclick = function () { if (!pl.flipped) { pl.flipped = true; return planRender(pl); } HM.markSeen('cards', n.id); pl.counts.newItem = 1; pl.done = true; pl.stage = 'done'; planRender(pl); };
      } else {
        var nq = window.QUIZ[n.m][n.i];
        plv.innerHTML = '<h2>Today\'s 10-minute plan</h2>' + planStepText(pl) + '<p class="small">One new question</p><div class="quiz"><h3>New question</h3><div class="q" id="nq"><p>' + HM.md(nq.q) + '</p></div><div class="score" id="nqs"></div></div>';
        var nbox = document.getElementById('nq'), nout = document.getElementById('nqs');
        nq.o.forEach(function (o, oi) {
          var b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.innerHTML = HM.md(o);
          b.onclick = function () {
            if (pl.answered) return; pl.answered = true;
            var ok = oi === nq.a; if (ok) b.classList.add('ok'); else { b.classList.add('no'); nbox.querySelectorAll('.opt')[nq.a].classList.add('ok'); }
            HM.recordWeak(n.m, ok); HM.markSeen('quiz', n.m + ':' + n.i);
            nout.innerHTML = '💡 ' + HM.md(nq.w || '') + '<br><br>';
            var f = document.createElement('button'); f.type = 'button'; f.className = 'btn'; f.textContent = 'Finish the plan';
            f.onclick = function () { pl.counts.newItem = 1; pl.done = true; pl.stage = 'done'; planRender(pl); };
            nout.appendChild(f); f.focus();
          };
          nbox.appendChild(b);
        });
      }
      return;
    }
    plv.innerHTML = '<h2>Today\'s 10-minute plan</h2><div class="ex-res" style="background:var(--ink)"><h2 style="margin-top:0">Plan complete ✅</h2>' +
      '<p>' + pl.counts.cards + ' card' + (pl.counts.cards === 1 ? '' : 's') + ' reviewed &middot; ' + pl.counts.weak + ' of ' + pl.weak.length + ' weak-spot questions right &middot; ' + pl.counts.newItem + ' new item learned.</p>' +
      '<p>Come back tomorrow: due cards and weak spots are already scheduled.</p>' +
      '<div class="fcnav" style="justify-content:flex-start"><button class="btn" id="pnewplan" type="button">Start a new plan</button><a class="btn alt" href="weak.html">Weak spots</a></div></div>';
    document.getElementById('pnewplan').onclick = function () { planSave({ active: false, done: true }); planRender(newPlan()); };
  }

  function tab(i) {
    tabs.forEach(function (t, k) { t.className = k === i ? 'on' : ''; t.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
    fcv.hidden = i !== 0; qzv.hidden = i !== 1; plv.hidden = i !== 2;
    chips.hidden = i === 2;
    if (i === 0) buildFlash(); if (i === 1) quiz(); if (i === 2) planOpen();
  }
  tabs[0].onclick = function () { tab(0); };
  tabs[1].onclick = function () { tab(1); };
  tabs[2].onclick = function () { tab(2); };
  drawChips(); buildFlash();
})();
