/* M21 page helpers: acronym vault (filter, module filter, practice mode), print buttons, exam stats. (c) Wilfred Wanyoike */
(function () {
  'use strict';
  function shuffle(a) { for (var k = a.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = a[k]; a[k] = a[j]; a[j] = t; } return a; }

  function vault(v) {
    var q = v.querySelector('#vq'), sel = v.querySelector('#vm'), mode = v.querySelector('#vmode'), shuf = v.querySelector('#vshuf'), hide = v.querySelector('#vhide'), cnt = v.querySelector('#vcount');
    var list = v.querySelector('.vault-list'), orig = [].slice.call(list.children), items = orig.slice();
    orig.forEach(function (li) { li._t = (li.querySelector('.va-h').textContent + ' ' + li.querySelector('.va-b').textContent).toLowerCase(); });
    var none = document.createElement('p'); none.className = 'vault-empty'; none.hidden = true; none.textContent = 'No acronyms match. Clear the filter or choose all modules.';
    list.parentNode.insertBefore(none, list.nextSibling);

    function apply() {
      var t = q.value.trim().toLowerCase(), m = sel.value, n = 0;
      orig.forEach(function (li) { var ok = (!m || li.getAttribute('data-m') === m) && (!t || li._t.indexOf(t) > -1); li.hidden = !ok; if (ok) n++; });
      cnt.textContent = n + ' of ' + orig.length + ' acronyms'; none.hidden = n > 0;
    }
    function reset() { orig.forEach(function (li) { var b = li.querySelector('.va-rev'); li.classList.remove('shown'); b.setAttribute('aria-expanded', 'false'); b.textContent = 'Tap to reveal'; }); }
    function setMode(on) {
      v.classList.toggle('practice', on); mode.setAttribute('aria-pressed', on ? 'true' : 'false'); mode.textContent = 'Practice mode: ' + (on ? 'on' : 'off');
      shuf.hidden = hide.hidden = !on; orig.forEach(function (li) { li.querySelector('.va-rev').hidden = !on; }); reset();
      if (!on) orig.forEach(function (li) { list.appendChild(li); }); /* restore the original order */
    }
    orig.forEach(function (li) {
      var b = li.querySelector('.va-rev');
      b.onclick = function () { var on = li.classList.toggle('shown'); b.setAttribute('aria-expanded', on ? 'true' : 'false'); b.textContent = on ? 'Hide answer' : 'Tap to reveal'; };
    });
    q.addEventListener('input', apply); sel.addEventListener('change', apply);
    mode.onclick = function () { setMode(!v.classList.contains('practice')); };
    shuf.onclick = function () { items = shuffle(orig.slice()); items.forEach(function (li) { list.appendChild(li); }); reset(); };
    hide.onclick = reset;
    apply();
  }

  function printBtn(id, cls) {
    var b = document.getElementById(id); if (!b) return;
    b.onclick = function () { /* the class only matters inside @media print; afterprint removes it */
      document.body.classList.remove('print-cs', 'print-vault'); document.body.classList.add(cls);
      window.addEventListener('afterprint', function () { document.body.classList.remove(cls); }, { once: true });
      window.print();
    };
  }

  function init() {
    var v = document.getElementById('vault'); if (v) vault(v);
    printBtn('print-cs', 'print-cs'); printBtn('print-vault', 'print-vault');
    var s = document.getElementById('m21-stats'), c = ((window.HM && HM.store(true)) || {}).m21 || {};
    if (s) s.textContent = typeof c.best === 'number' && c.best >= 0 ? 'Your best mock score: ' + c.best + '% in ' + (c.attempts || 1) + (c.attempts === 1 ? ' attempt.' : ' attempts.') : '40 questions, 45 minutes, graded. No attempts yet.';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
