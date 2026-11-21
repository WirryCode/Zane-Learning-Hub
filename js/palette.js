/* Enhancement B: command palette. Ctrl/Cmd+K (or the ⌘K topbar button) opens a filterable list of
   modules, pages and actions; ↑↓ moves, Enter opens, Esc closes. No dependencies. (c) Wilfred Wanyoike */
(function () {
  var ROOT = (document.body && document.body.getAttribute('data-root')) || '';
  var open = false, list = [], idx = 0, lastFocus = null;

  var wrap = document.createElement('div');
  wrap.className = 'pal';
  wrap.hidden = true;
  wrap.innerHTML = '<div class="pal-scrim" data-x></div>' +
    '<div class="pal-box" role="dialog" aria-modal="true" aria-label="Command palette">' +
    '<input id="pal-q" type="search" autocomplete="off" placeholder="Jump to a module, page or action…" aria-controls="pal-list" aria-autocomplete="list">' +
    '<ul id="pal-list" role="listbox" aria-label="Results"></ul>' +
    '<p class="pal-hint">↑↓ to move · Enter to open · Esc to close</p></div>';
  document.body.appendChild(wrap);
  var q = wrap.querySelector('#pal-q'), ul = wrap.querySelector('#pal-list');

  var PAGES = [
    { t: 'Course home', s: 'index.html', k: 'home modules index' },
    { t: 'Study mode: flashcards & quiz', s: 'study.html', k: 'study flashcards revision' },
    { t: 'Weak spots', s: 'weak.html', k: 'weak review mistakes' },
    { t: 'Mock exam', s: 'exam.html', k: 'exam test timed' },
    { t: 'Changelog', s: 'changelog.html', k: 'changelog corrections notes' }
  ];

  function source() {
    var out = PAGES.slice();
    (window.MODULES || []).forEach(function (m) {
      if (m.status !== 'ready') return;
      out.push({ t: 'M' + m.num + ' · ' + m.title, s: 'modules/' + m.slug + '.html', k: m.num + ' ' + m.title + ' ' + m.blurb });
    });
    out.push({ t: 'Settings', s: '#settings', k: 'settings theme language offline' });
    return out;
  }

  function render() {
    var term = q.value.trim().toLowerCase();
    var all = source().filter(function (it) {
      return !term || (it.t + ' ' + it.k).toLowerCase().indexOf(term) > -1;
    });
    list = all.slice(0, 12);
    idx = Math.max(0, Math.min(idx, list.length - 1));
    ul.innerHTML = list.map(function (it, i) {
      return '<li role="option" id="pal-o' + i + '" aria-selected="' + (i === idx) + '" class="' + (i === idx ? 'on' : '') + '">' +
        '<span>' + it.t.replace(/[<>&]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]; }) + '</span></li>';
    }).join('') || '<li class="none" role="option" aria-selected="false">No match</li>';
    q.setAttribute('aria-activedescendant', list.length ? 'pal-o' + idx : '');
  }

  function pick(i) {
    var it = list[i];
    if (!it) return;
    close();
    if (it.s === '#settings') {
      var b = document.querySelector('[data-a=settings]');
      if (b) b.click();
      return;
    }
    location.href = ROOT + it.s;
  }

  function openPal() {
    if (open) return;
    lastFocus = document.activeElement;
    open = true; idx = 0; q.value = ''; wrap.hidden = false;
    render(); q.focus();
  }
  function close() {
    if (!open) return;
    open = false; wrap.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  wrap.querySelector('[data-x]').onclick = close;
  q.addEventListener('input', function () { idx = 0; render(); });
  q.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!list.length) return;
      idx = (idx + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length;
      render();
      var on = ul.querySelector('li.on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault(); pick(idx);
    } else if (e.key === 'Escape') {
      e.preventDefault(); close();
    }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      open ? close() : openPal();
    } else if (e.key === 'Escape' && open) {
      close();
    }
  });

  var tb = document.querySelector('.topbar');
  if (tb) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'pal-btn'; b.id = 'pal-open';
    b.setAttribute('aria-keyshortcuts', 'Control+K Meta+K');
    b.innerHTML = '⌘K <span class="pal-btn-t">Search</span>';
    b.onclick = openPal;
    tb.appendChild(b);
  }
  window.HM_PALETTE = { open: openPal, close: close };
})();
