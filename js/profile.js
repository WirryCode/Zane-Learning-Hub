/* Profile (name + email + agreement to the policies). (c) Wilfred Wanyoike
   Loaded in <head> on every page so the course stays hidden until a valid profile exists.
   The profile lives only in this browser (localStorage key hm_profile). Nothing is sent anywhere.
   When the Terms, Privacy or Cookies text changes materially, bump VERSION below: every learner is then
   asked to agree again on their next visit. */
(function () {
  'use strict';

  var KEY = 'hm_profile';
  var VERSION = '2026-11-21';
  var VERSION_LABEL = '21 November 2026';
  var EXEMPT = { 'terms.html': 1, 'privacy.html': 1, 'cookies.html': 1 };

  var script = document.currentScript;
  var src = script ? (script.getAttribute('src') || '') : '';
  var ROOT = src.indexOf('../') === 0 ? '../' : '';
  var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var mem = null;

  /* ---------- storage (localStorage, falling back to sessionStorage, then memory) ---------- */
  function read() {
    if (mem) return mem;
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) {}
    if (raw === null) { try { raw = sessionStorage.getItem(KEY); } catch (e2) {} }
    if (!raw) return null;
    try {
      var p = JSON.parse(raw);
      return p && typeof p.name === 'string' && typeof p.email === 'string' ? p : null;
    } catch (e3) { return null; }
  }
  function write(p) {
    var s = JSON.stringify(p);
    try { localStorage.setItem(KEY, s); mem = null; return; } catch (e) {}
    try { sessionStorage.setItem(KEY, s); mem = null; return; } catch (e2) {}
    mem = p;
  }
  function remove() {
    mem = null;
    try { localStorage.removeItem(KEY); } catch (e) {}
    try { sessionStorage.removeItem(KEY); } catch (e2) {}
  }
  function valid(p) { return !!(p && p.agreed === true && p.version === VERSION); }

  /* ---------- styles (inline here so they work even when an old stylesheet is cached) ---------- */
  var css =
    'html.hm-locked body>*:not(.hm-gate){display:none!important}' +
    '.hm-gate{position:fixed;inset:0;z-index:1000;overflow:auto;background:var(--ink,#121212);display:flex;padding:1rem;-webkit-overflow-scrolling:touch}' +
    '.hm-card{background:var(--paper,#faf6ee);color:var(--text,#1b1b1b);border-top:6px solid var(--gold,#b8985a);border-radius:14px;max-width:480px;width:100%;margin:auto;padding:1.4rem 1.3rem 1.5rem;font:1rem/1.5 system-ui,sans-serif;box-shadow:0 10px 40px #0008}' +
    '.hm-card .hm-k{font:700 .75rem system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--crimson,#a51c30)}' +
    '.hm-card h1,.hm-card h2{font-family:"Playfair Display",Georgia,serif;margin:.25rem 0 .5rem;line-height:1.2;color:var(--text,#1b1b1b);border:0;padding:0}' +
    '.hm-card h1{font-size:1.7rem}' +
    '.hm-card .hm-slogan{font:italic 700 1.05rem "Playfair Display",Georgia,serif;color:var(--crimson,#a51c30);margin:-.2rem 0 .7rem}' +
    '.hm-card p{margin:.4rem 0 1rem;font-size:.95rem}' +
    '.hm-card label.hm-l{display:block;font-weight:700;font-size:.88rem;margin:.9rem 0 .3rem}' +
    '.hm-card input[type=text],.hm-card input[type=email]{width:100%;box-sizing:border-box;font:1rem system-ui,sans-serif;padding:.65rem .75rem;border:2px solid #8a7f84;border-radius:8px;background:#fff;color:#1b1b1b}' +
    '.hm-card input[type=text]:focus,.hm-card input[type=email]:focus{outline:3px solid var(--gold,#b8985a);outline-offset:1px;border-color:var(--crimson,#a51c30)}' +
    '.hm-card .hm-agree{display:flex;gap:.6rem;align-items:flex-start;margin:1.1rem 0 .4rem;font-size:.9rem;line-height:1.45}' +
    '.hm-card .hm-agree input{flex:0 0 auto;width:1.3rem;height:1.3rem;margin-top:.1rem;accent-color:var(--crimson,#a51c30)}' +
    '.hm-card a{color:var(--crimson,#a51c30);font-weight:700}' +
    '.hm-card .hm-err{color:#9b0f22;font:700 .85rem system-ui,sans-serif;min-height:1.3rem;margin:.5rem 0}' +
    '.hm-card .hm-ok{color:#1d6b3a;font:700 .85rem system-ui,sans-serif;min-height:1.3rem;margin:.5rem 0}' +
    '.hm-card .hm-fine{font-size:.8rem;color:var(--muted,#6d6166);margin:.9rem 0 0}' +
    '.hm-card button.btn{width:100%;margin-top:.4rem;font-size:1rem;padding:.8rem 1rem}' +
    '[data-theme=dark] .hm-card input[type=text],[data-theme=dark] .hm-card input[type=email]{background:#241f26;color:#ece5e2;border-color:#7d7279}' +
    '[data-theme=dark] .hm-card a{color:var(--gold-l,#eddcb4)}' +
    '[data-theme=dark] .hm-card .hm-err{color:#ff8fa3}[data-theme=dark] .hm-card .hm-ok{color:#8fe0ad}' +
    '.topbar a.tb.hm-me{max-width:9.5rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '@media(max-width:430px){.topbar a.tb.hm-me .hm-nm{display:none}}' +
    '.hm-legal{display:block;margin-top:.5rem}' +
    '.hm-box{background:#fff;color:#1b1b1b;border:1px solid #e2d6bb;border-left:6px solid var(--gold,#b8985a);border-radius:10px;padding:1rem 1.1rem;margin:1.2rem 0}' +
    '[data-theme=dark] .hm-box{background:#1d191f;color:#ece5e2;border-color:#3a3340}' +
    '.hm-box h2{margin-top:0}' +
    '.hm-box input[type=text],.hm-box input[type=email]{width:100%;box-sizing:border-box;font:1rem system-ui,sans-serif;padding:.6rem .7rem;border:2px solid #8a7f84;border-radius:8px;background:#fff;color:#1b1b1b}' +
    '.hm-box label.hm-l{display:block;font-weight:700;font-size:.88rem;margin:.8rem 0 .3rem}' +
    '.hm-box .hm-err{color:#9b0f22;font:700 .85rem system-ui,sans-serif;min-height:1.2rem;margin:.4rem 0}' +
    '.hm-box .hm-ok{color:#1d6b3a;font:700 .85rem system-ui,sans-serif;min-height:1.2rem;margin:.4rem 0}' +
    '[data-theme=dark] .hm-box .hm-err{color:#ff8fa3}[data-theme=dark] .hm-box .hm-ok{color:#8fe0ad}' +
    '.hm-row{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.6rem}';
  var st = document.createElement('style');
  st.id = 'hm-profile-css';
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  /* ---------- helpers ---------- */
  function href(p) { return ROOT + p; }
  function cleanName(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function checkName(n) {
    if (n.length < 2) return 'Please enter your name (at least 2 characters).';
    if (n.length > 60) return 'Please keep your name to 60 characters or fewer.';
    if (!/[A-Za-z\u00C0-\uFFFF]/.test(n)) return 'Your name should contain at least one letter.';
    return '';
  }
  function checkEmail(e) {
    if (!e) return 'Please enter your email address.';
    if (e.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return 'Please enter a valid email address, like name@example.com.';
    return '';
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return ''; }
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* ---------- gate ---------- */
  var existing = read();
  var locked = !EXEMPT[path] && !valid(existing);
  if (locked) document.documentElement.classList.add('hm-locked');

  var gate = null;

  function buildGate() {
    var update = !!(existing && existing.name && existing.email && !valid(existing));
    gate = el('div', 'hm-gate');
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-labelledby', 'hm-gh');
    var f = el('form', 'hm-card');
    f.setAttribute('novalidate', '');
    f.innerHTML =
      '<div class="hm-k">Zane Learning Hub</div>' +
      '<h1 id="hm-gh">' + (update ? 'We have updated our policies' : 'Create your profile') + '</h1>' +
      '<p class="hm-slogan">Read it, Try it, Know it</p>' +
      '<p>' + (update
        ? 'Please check your details and agree to the updated policies to keep learning.'
        : 'Add your name and email to start the course. They are saved only in this browser, on this device, and are not sent to us.') + '</p>' +
      '<label class="hm-l" for="hm-name">Your name</label>' +
      '<input type="text" id="hm-name" name="name" autocomplete="name" maxlength="60" required value="' + (update ? esc(existing.name) : '') + '">' +
      '<label class="hm-l" for="hm-email">Your email</label>' +
      '<input type="email" id="hm-email" name="email" autocomplete="email" inputmode="email" maxlength="254" required value="' + (update ? esc(existing.email) : '') + '">' +
      '<label class="hm-agree" for="hm-agree"><input type="checkbox" id="hm-agree" name="agree"><span>I agree to create a profile, and I have read and accept the ' +
      '<a href="' + href('terms.html') + '" target="_blank" rel="noopener">Terms of Use</a>, the ' +
      '<a href="' + href('privacy.html') + '" target="_blank" rel="noopener">Privacy Policy</a> and the ' +
      '<a href="' + href('cookies.html') + '" target="_blank" rel="noopener">Cookies Policy</a>.</span></label>' +
      '<div class="hm-err" id="hm-err" role="alert" aria-live="assertive"></div>' +
      '<button class="btn big" type="submit">' + (update ? 'Agree and continue' : 'Create profile and start learning') + '</button>' +
      '<p class="hm-fine">You must be 18 or older, or have a parent or guardian\u2019s permission, to create a profile.</p>';
    gate.appendChild(f);
    document.body.appendChild(gate);

    var nameI = f.querySelector('#hm-name'), mailI = f.querySelector('#hm-email'), box = f.querySelector('#hm-agree'), err = f.querySelector('#hm-err');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = cleanName(nameI.value), m = String(mailI.value || '').trim();
      var msg = checkName(n), focus = nameI;
      if (!msg) { msg = checkEmail(m); focus = mailI; }
      if (!msg && !box.checked) { msg = 'Please tick the box to agree before continuing.'; focus = box; }
      if (msg) { err.textContent = msg; focus.focus(); return; }
      err.textContent = '';
      var now = new Date().toISOString();
      var p = { name: n, email: m, agreed: true, agreedAt: now, version: VERSION, created: (existing && existing.created) || now };
      write(p);
      existing = p;
      unlock();
    });
    setTimeout(function () { try { (update ? box : nameI).focus(); } catch (e) {} }, 50);
  }

  function unlock() {
    document.documentElement.classList.remove('hm-locked');
    if (gate && gate.parentNode) gate.parentNode.removeChild(gate);
    gate = null;
    try { window.scrollTo(0, 0); } catch (e) {}
    decorate();
    renderProfilePage();
  }

  /* ---------- topbar name, drawer link, footer legal links ---------- */
  function decorate() {
    var p = read();
    var tb = document.querySelector('.topbar');
    if (tb && p && !tb.querySelector('.hm-me')) {
      var a = el('a', 'tb hm-me');
      a.href = href('profile.html');
      a.setAttribute('aria-label', 'Your profile: ' + p.name);
      a.appendChild(document.createTextNode('\uD83D\uDC64'));
      var s = el('span', 'hm-nm'); s.textContent = ' ' + p.name.split(' ')[0];
      a.appendChild(s);
      var study = tb.querySelector('a.tb');
      if (study) tb.insertBefore(a, study); else tb.appendChild(a);
    }
    var dr = document.querySelector('.drawer');
    if (dr && !dr.querySelector('.hm-pl')) {
      var l = el('a', 'hm-pl', '<span class="n">\uD83D\uDC64</span>Your profile');
      l.href = href('profile.html');
      var ex = dr.querySelector('a[href$="exam.html"]');
      if (ex && ex.parentNode) ex.parentNode.insertBefore(l, ex.nextSibling); else dr.insertBefore(l, dr.firstChild);
    }
    var foots = document.querySelectorAll('footer');
    for (var i = 0; i < foots.length; i++) {
      if (foots[i].querySelector('.hm-legal')) continue;
      var d = el('span', 'hm-legal',
        '<a href="' + href('terms.html') + '">Terms of Use</a> &middot; <a href="' + href('privacy.html') + '">Privacy Policy</a> &middot; <a href="' + href('cookies.html') + '">Cookies Policy</a>');
      foots[i].appendChild(d);
    }
  }

  /* ---------- profile page (profile.html) ---------- */
  function renderProfilePage() {
    var root = document.getElementById('hm-profile-root');
    var p = read();
    if (!root || !p || !valid(p)) return;
    root.innerHTML =
      '<div class="hm-box"><h2>Your details</h2>' +
      '<p>These are saved only in this browser, on this device. Change them any time.</p>' +
      '<form id="hm-pf" novalidate>' +
      '<label class="hm-l" for="hm-pn">Name</label><input type="text" id="hm-pn" autocomplete="name" maxlength="60" value="' + esc(p.name) + '">' +
      '<label class="hm-l" for="hm-pe">Email</label><input type="email" id="hm-pe" autocomplete="email" inputmode="email" maxlength="254" value="' + esc(p.email) + '">' +
      '<div class="hm-err" id="hm-pm" role="status" aria-live="polite"></div>' +
      '<button class="btn" type="submit">Save changes</button></form></div>' +
      '<div class="hm-box"><h2>Your agreement</h2>' +
      '<p>You agreed on <b>' + esc(fmtDate(p.agreedAt)) + '</b> to the policies dated <b>' + esc(VERSION_LABEL) + '</b>: ' +
      '<a href="terms.html">Terms of Use</a>, <a href="privacy.html">Privacy Policy</a> and <a href="cookies.html">Cookies Policy</a>.</p></div>' +
      '<div class="hm-box"><h2>Delete your data</h2>' +
      '<p><b>Delete my profile</b> removes your name, email and agreement from this device. Your progress and settings stay, and you will be asked to create a profile again.</p>' +
      '<p><b>Erase everything</b> also removes your quiz scores, flashcard progress, weak spots and settings from this device.</p>' +
      '<div class="hm-row"><button class="btn alt" type="button" id="hm-del">Delete my profile</button><button class="btn alt" type="button" id="hm-all">Erase everything</button></div>' +
      '<div id="hm-conf"></div></div>';

    var msg = root.querySelector('#hm-pm');
    root.querySelector('#hm-pf').addEventListener('submit', function (e) {
      e.preventDefault();
      var n = cleanName(root.querySelector('#hm-pn').value), m = String(root.querySelector('#hm-pe').value || '').trim();
      var bad = checkName(n) || checkEmail(m);
      if (bad) { msg.className = 'hm-err'; msg.textContent = bad; return; }
      var cur = read() || p;
      cur.name = n; cur.email = m;
      write(cur);
      msg.className = 'hm-ok'; msg.textContent = 'Saved.';
      var old = document.querySelector('.topbar .hm-me'); if (old) old.parentNode.removeChild(old);
      decorate();
    });

    var conf = root.querySelector('#hm-conf');
    function ask(everything) {
      conf.innerHTML = '<div class="hm-box" style="border-left-color:#a51c30;margin-bottom:0"><p><b>' +
        (everything ? 'Erase your profile, progress and settings from this device? This cannot be undone.' : 'Delete your profile from this device?') +
        '</b></p><div class="hm-row"><button class="btn" type="button" id="hm-yes">Yes, ' + (everything ? 'erase everything' : 'delete') + '</button><button class="btn alt" type="button" id="hm-no">Cancel</button></div></div>';
      conf.querySelector('#hm-no').onclick = function () { conf.innerHTML = ''; };
      conf.querySelector('#hm-yes').onclick = function () {
        if (everything) {
          try {
            var keys = [];
            for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf('hm_') === 0) keys.push(k); }
            keys.forEach(function (k) { localStorage.removeItem(k); });
          } catch (e) {}
        }
        remove();
        location.href = href('index.html');
      };
      conf.querySelector('#hm-no').focus();
    }
    root.querySelector('#hm-del').onclick = function () { ask(false); };
    root.querySelector('#hm-all').onclick = function () { ask(true); };
  }

  /* ---------- boot ---------- */
  function ready() {
    try {
      if (locked) buildGate();
      else { renderProfilePage(); }
    } catch (e) {
      document.documentElement.classList.remove('hm-locked');
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();

  function late() { try { decorate(); } catch (e) {} }
  if (document.readyState === 'complete') late(); else window.addEventListener('load', late);
})();
