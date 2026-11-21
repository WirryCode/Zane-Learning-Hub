/* Weak spots (Sector 1): ranking by error rate + a per-module review set.
   Also the destination of the mock exam's "revise first" links. (c) Wilfred Wanyoike */
(function () {
  var rows = HM.weakRows(), box = document.getElementById('wrows'), sec = document.getElementById('review'), rv = document.getElementById('rv');
  function esc(s) { return HM.esc(s); }
  if (!rows.length) {
    box.innerHTML = '<p>No answers recorded yet. Take a <a href="study.html">mixed quiz</a> or the <a href="exam.html">mock exam</a>; every wrong answer lands here.</p>';
  } else {
    var h = '<table class="t ws-table"><tr><th>Module</th><th>Wrong / answered</th><th>Error rate</th><th></th></tr>';
    rows.forEach(function (r) {
      var pct = Math.round(r.rate * 100);
      h += '<tr><td><a href="weak.html?m=' + r.id + '">M' + r.num + ' ' + esc(r.title) + '</a></td><td>' + Number(r.wrong) + ' / ' + Number(r.total) + '</td>' +
        '<td><span class="meter"><i class="' + (pct === 0 ? 'full' : '') + '" style="width:' + pct + '%"></i></span> ' + pct + '%</td>' +
        '<td><a class="btn alt" href="weak.html?m=' + r.id + '">Review</a></td></tr>';
    });
    box.innerHTML = h + '</table><p class="small">Ranked by error rate. A correct answer raises the denominator, so the ranking falls as you improve.</p>';
  }

  var mid = new URLSearchParams(location.search).get('m');
  var mod = mid && MODULES.filter(function (m) { return m.id === mid; })[0];
  if (!mod) return;
  sec.hidden = false;
  document.getElementById('rv-h').textContent = 'Review set: M' + mod.num + ' ' + mod.title;
  function draw() {
    var due = HM.buildDueQueue([mid]), cards = (window.CARDS[mid] || []), w = (HM.store(true) || {}).weak || {}, s = w[mid] || { wrong: 0, total: 0 };
    var h = '<p>Error rate: <b>' + (s.total ? Math.round(s.wrong / s.total * 100) : 0) + '%</b> (' + s.wrong + ' wrong of ' + s.total + ' answered). ' +
      '<a href="modules/' + mod.slug + '.html">Re-read the module</a>.</p>';
    h += '<h3>Due flashcards (' + due.length + ')</h3>';
    if (!due.length) h += '<p class="small">No cards are due in this module right now. They return on the Leitner schedule.</p>';
    else {
      h += '<ul class="ws-cards">';
      due.forEach(function (d) {
        var c = cards[d.index];
        h += '<li class="ws-card" data-id="' + d.id + '"><p><b>' + HM.md(c.f) + '</b></p><p class="ws-back" hidden>' + HM.md(c.b) + '</p>' +
          '<div class="fcnav" style="justify-content:flex-start"><button class="btn alt" type="button" data-a="again">Again</button><button class="btn alt" type="button" data-a="hard">Hard</button><button class="btn" type="button" data-a="good">Good</button><button class="btn" type="button" data-a="easy">Easy</button></div></li>';
      });
      h += '</ul>';
    }
    h += '<h3>Weak questions (' + (window.QUIZ[mid] || []).length + ')</h3><div class="quiz" id="rvq"></div>';
    rv.innerHTML = h;
    rv.querySelectorAll('.ws-card').forEach(function (li) {
      var id = li.getAttribute('data-id'), back = li.querySelector('.ws-back');
      li.querySelector('b').onclick = function () { back.hidden = !back.hidden; };
      li.querySelectorAll('button[data-a]').forEach(function (b) {
        b.onclick = function () { HM.reviewCard(id, b.getAttribute('data-a')); HM.markSeen('cards', id); li.remove(); };
      });
    });
    var qbox = document.getElementById('rvq');
    if ((window.QUIZ[mid] || []).length) HM.renderQuiz(qbox, window.QUIZ[mid], { title: 'Module quiz', mid: mid, save: mid });
  }
  draw();
})();
