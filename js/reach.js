/* Reach (Sector 7): settings panel, language toggle, read-aloud, service worker.
   Reads HM_PREFS from js/prefs.js. (c) Wilfred Wanyoike */
(function () {
  'use strict';
  var prefs = window.HM_PREFS || { theme: 'light', scale: '100', spacing: 'normal', font: 'serif', lang: 'en', readaloud: true, offline: false };
  var root = document.body.getAttribute('data-root') || '';

  /* ---------- tiny chrome dictionary ---------- */
  var D = {
    en: {
      menu: 'Menu', study: 'Study', home: 'Course home', studyMode: 'Study: flashcards & quiz', weak: 'Weak spots',
      exam: 'Mock exam', settings: 'Settings', close: 'Close', reset: 'Reset to defaults', appearance: 'Appearance',
      theme: 'Theme', light: 'Light', dark: 'Dark', contrast: 'High contrast', size: 'Text size', spacing: 'Line spacing',
      normal: 'Normal', relaxed: 'Relaxed', loose: 'Loose', font: 'Font', serif: 'Serif', sans: 'Sans-serif',
      language: 'Language', english: 'English', swahili: 'Kiswahili', readaloud: 'Read aloud', on: 'On', off: 'Off',
      listening: 'Reading the page aloud', stop: 'Stop reading', practice: 'Practice: build it yourself',
      hint: 'Hint', solution: 'Show solution', runcheck: 'Run & check', complete: 'Session complete',
      offlineReady: 'Available offline', settingsSaved: 'Preferences saved',
      offlineReadyNow: 'Offline ready', updateAvailable: 'Update available', reload: 'Reload',
      offline: 'Offline', offlineSave: 'Save the course for offline', offlineClear: 'Remove offline copy',
      offlineOn: 'Saved: the whole course works without a connection.',
      offlineDone: 'Saved {n} pages for offline use.', offlineCleared: 'Offline copy removed.',
      offlineNoSw: 'This browser is not running the service worker yet; reload the page and try again.',
      flashcards: 'Flashcards', quiz: 'Quiz', plan: "Today's plan"
    },
    sw: {
      menu: 'Menyu', study: 'Soma', home: 'Mwanzo wa kozi', studyMode: 'Soma: kadi na jaribio', weak: 'Maeneo dhaifu',
      exam: 'Mtihani wa mazoezi', settings: 'Mipangilio', close: 'Funga', reset: 'Rejesha chaguo-msingi', appearance: 'Muonekano',
      theme: 'Mandhari', light: 'Nuru', dark: 'Giza', contrast: 'Utofautishaji mkubwa', size: 'Ukubwa wa maandishi',
      spacing: 'Nafasi kati ya mistari', normal: 'Kawaida', relaxed: 'Wasaa', loose: 'Mkubwa',
      font: 'Fonti', serif: 'Serif', sans: 'Bila serif', language: 'Lugha', english: 'Kiingereza', swahili: 'Kiswahili',
      readaloud: 'Sikiliza kwa sauti', on: 'Imewaka', off: 'Imezimwa', listening: 'Inasoma ukurasa kwa sauti',
      stop: 'Acha kusoma', practice: 'Mazoezi: jenga mwenyewe', hint: 'Kidokezo', solution: 'Onyesha suluhisho',
      runcheck: 'Endesha na uangalie', complete: 'Kikao kimekamilika', offlineReady: 'Inapatikana nje ya mtandao',
      offlineReadyNow: 'Tayari nje ya mtandao', updateAvailable: 'Sasisho linapatikana', reload: 'Pakia upya',
      settingsSaved: 'Mipangilio imehifadhiwa', flashcards: 'Kadi', quiz: 'Jaribio', plan: 'Mpango wa leo',
      offline: 'Nje ya mtandao', offlineSave: 'Hifadhi kozi kwa matumizi bila mtandao', offlineClear: 'Ondoa nakala ya nje ya mtandao',
      offlineOn: 'Imehifadhiwa: kozi yote inafanya kazi bila mtandao.',
      offlineDone: 'Kurasa {n} zimehifadhiwa kwa matumizi bila mtandao.', offlineCleared: 'Nakala ya nje ya mtandao imeondolewa.',
      offlineNoSw: 'Kivinjari hiki bado hakijawasha service worker; pakia upya ukurasa kisha ujaribu tena.'
    }
  };
  function T(k) { return (D[prefs.lang] && D[prefs.lang][k]) || D.en[k] || k; }
  window.HM_T = T;
  window.HM_LANG = prefs.lang;

  function savePrefs(p) {
    prefs = p; window.HM_PREFS = p;
    try { localStorage.setItem('hm_settings', JSON.stringify(p)); } catch (e) {}
    var h = document.documentElement;
    h.setAttribute('data-theme', p.theme);
    h.setAttribute('data-scale', p.scale);
    h.setAttribute('data-spacing', p.spacing);
    h.setAttribute('data-font', p.font);
    if (p.theme === 'contrast') h.setAttribute('data-contrast', 'more'); else h.removeAttribute('data-contrast');
  }

  /* ---------- translate static chrome ---------- */
  function translateStatic() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n'); if (D[prefs.lang] && D[prefs.lang][k]) el.textContent = T(k);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-aria'); if (D[prefs.lang] && D[prefs.lang][k]) el.setAttribute('aria-label', T(k));
    });
  }

  /* ---------- settings panel ---------- */
  var scrim = document.createElement('div');
  scrim.className = 'set-scrim'; scrim.hidden = true;
  document.body.appendChild(scrim);
  var panel = document.createElement('div');
  panel.className = 'settings';
  panel.id = 'settings';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'set-h');
  panel.hidden = true;
  document.body.appendChild(panel);
  function field(labelKey, name, options) {
    var h = '<fieldset><legend>' + T(labelKey) + '</legend>';
    options.forEach(function (o) {
      var id = 'set-' + name + '-' + o[0];
      h += '<label class="set-opt"><input type="radio" name="' + name + '" id="' + id + '" value="' + o[0] + '"' +
        (String(prefs[name]) === String(o[0]) ? ' checked' : '') + '><span>' + o[1] + '</span></label>';
    });
    return h + '</fieldset>';
  }
  function drawPanel() {
    panel.innerHTML = '<div class="set-head"><h2 id="set-h">' + T('settings') + '</h2>' +
      '<button class="btn alt" id="set-close" type="button">' + T('close') + '</button></div>' +
      '<h3>' + T('appearance') + '</h3>' +
      field('theme', 'theme', [['light', T('light')], ['dark', T('dark')], ['contrast', T('contrast')]]) +
      field('size', 'scale', [['90', 'A−'], ['100', 'A'], ['110', 'A+'], ['120', 'A++']]) +
      field('spacing', 'spacing', [['normal', T('normal')], ['relaxed', T('relaxed')], ['loose', T('loose')]]) +
      field('font', 'font', [['serif', T('serif')], ['sans', T('sans')]]) +
      field('language', 'lang', [['en', T('english')], ['sw', T('swahili')]]) +
      '<fieldset><legend>' + T('readaloud') + '</legend><label class="set-opt"><input type="radio" name="readaloud" value="true"' +
      (prefs.readaloud ? ' checked' : '') + '><span>' + T('on') + '</span></label>' +
      '<label class="set-opt"><input type="radio" name="readaloud" value="false"' + (!prefs.readaloud ? ' checked' : '') + '><span>' + T('off') + '</span></label></fieldset>' +
      '<fieldset class="set-off"><legend>' + T('offline') + '</legend>' +
      '<p class="small" id="off-state">' + (prefs.offline ? T('offlineOn') : T('offlineReady')) + '</p>' +
      '<p class="cta"><button class="btn" type="button" id="off-save">' + T('offlineSave') + '</button> ' +
      '<button class="btn alt" type="button" id="off-clear">' + T('offlineClear') + '</button></p></fieldset>' +
      '<p class="cta"><button class="btn alt" type="button" id="set-reset">' + T('reset') + '</button></p>' +
      '<p class="small" role="status" id="set-msg"></p>';
    var close = panel.querySelector('#set-close');
    if (close) close.onclick = closeSettings;
    panel.querySelectorAll('input[type=radio]').forEach(function (r) {
      r.onchange = function () {
        var p = { theme: prefs.theme, scale: prefs.scale, spacing: prefs.spacing, font: prefs.font, lang: prefs.lang, readaloud: prefs.readaloud };
        p[r.name] = r.name === 'readaloud' ? r.value === 'true' : r.value;
        var langChanged = p.lang !== prefs.lang;
        savePrefs(p);
        if (langChanged) { location.reload(); return; }
        drawPanel(); translateStatic();
        var m = document.getElementById('set-msg'); if (m) m.textContent = T('settingsSaved');
      };
    });
    function offlineUrls() {
      var base = (document.body.getAttribute('data-root') || '');
      var pages = ['index.html', 'study.html', 'weak.html', 'exam.html', 'changelog.html'];
      (window.MODULES || []).forEach(function (m) { if (m.status === 'ready') pages.push('modules/' + m.slug + '.html'); });
      return pages.map(function (p) { return base + p; });
    }
    function offline(on) {
      var msg = panel.querySelector('#set-msg'), st = panel.querySelector('#off-state');
      var sw = navigator.serviceWorker && navigator.serviceWorker.controller;
      prefs.offline = on; savePrefs(prefs);
      if (!sw) { if (msg) msg.textContent = T('offlineNoSw'); return; }
      var ch = new MessageChannel();
      ch.port1.onmessage = function (ev) {
        if (st) st.textContent = on ? T('offlineOn') : T('offlineReady');
        if (msg) msg.textContent = on ? T('offlineDone').replace('{n}', ev.data.n) : T('offlineCleared');
      };
      sw.postMessage({ type: 'hm-offline', urls: offlineUrls(), on: on }, [ch.port2]);
    }
    var offSave = panel.querySelector('#off-save'), offClear = panel.querySelector('#off-clear');
    if (offSave) offSave.onclick = function () { offline(true); };
    if (offClear) offClear.onclick = function () { offline(false); };
    var reset = panel.querySelector('#set-reset');
    if (reset) reset.onclick = function () {
      savePrefs({ theme: 'light', scale: '100', spacing: 'normal', font: 'serif', lang: 'en', readaloud: true });
      location.reload();
    };
  }
  drawPanel();

  var lastFocus = null;
  function openSettings() {
    lastFocus = document.activeElement;
    panel.hidden = false; scrim.hidden = false;
    var first = panel.querySelector('input');
    if (first) first.focus();
  }
  function closeSettings() {
    panel.hidden = true; scrim.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  scrim.onclick = closeSettings;
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) closeSettings();
  });

  /* ---------- read aloud ---------- */
  function mountReadAloud() {
    if (!window.speechSynthesis || !document.body.getAttribute('data-mod')) return;
    var main = document.querySelector('main'); if (!main) return;
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'read-aloud'; b.setAttribute('aria-pressed', 'false');
    b.textContent = '🔊 ' + T('readaloud');
    var u = null;
    b.onclick = function () {
      if (b.getAttribute('aria-pressed') === 'true') { window.speechSynthesis.cancel(); b.setAttribute('aria-pressed', 'false'); b.textContent = '🔊 ' + T('readaloud'); return; }
      var text = (main.innerText || main.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 6000);
      if (!text) return;
      u = new SpeechSynthesisUtterance(text);
      u.lang = prefs.lang === 'sw' ? 'sw-KE' : 'en-GB';
      u.rate = 0.98;
      u.onend = function () { b.setAttribute('aria-pressed', 'false'); b.textContent = '🔊 ' + T('readaloud'); };
      window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
      b.setAttribute('aria-pressed', 'true'); b.textContent = '⏹ ' + T('stop');
    };
    document.body.appendChild(b);
  }

  /* ---------- service worker: offline-ready chip + update prompt (Sector 7) ---------- */
  var updateBar = null;
  function mountChip() {
    if (!('serviceWorker' in navigator)) return;
    var chip = document.createElement('p');
    chip.className = 'sw-chip'; chip.id = 'sw-chip';
    chip.setAttribute('role', 'status');
    chip.textContent = T('offlineReadyNow');
    document.body.appendChild(chip);
    /* A controlled page has a controller at load; the first visit gets one when clients.claim()
       fires controllerchange. No separate ready() handler is needed. */
    function mark() { chip.hidden = !navigator.serviceWorker.controller; }
    mark();
    navigator.serviceWorker.addEventListener('controllerchange', mark);
  }
  function showUpdate(reg) {
    if (updateBar) return;
    updateBar = document.createElement('div');
    updateBar.className = 'sw-update'; updateBar.id = 'sw-update';
    var s = document.createElement('span');
    s.setAttribute('role', 'status'); s.textContent = T('updateAvailable');
    var b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = T('reload');
    b.onclick = function () {
      if (reg && reg.waiting) {
        navigator.serviceWorker.addEventListener('controllerchange', function () { location.reload(); }, { once: true });
        reg.waiting.postMessage({ type: 'hm-skip' });
        setTimeout(function () { location.reload(); }, 1500);
      } else location.reload();
    };
    updateBar.appendChild(s); updateBar.appendChild(b);
    document.body.appendChild(updateBar);
  }
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    if (!/^https?:$/.test(location.protocol)) return;
    navigator.serviceWorker.register(root + 'sw.js').then(function (reg) {
      if (reg.waiting && navigator.serviceWorker.controller) showUpdate(reg);
      reg.addEventListener('updatefound', function () {
        var nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', function () {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdate(reg);
        });
      });
    }).catch(function () {});
  }

  function init() {
    translateStatic();
    document.querySelectorAll('.topbar').forEach(function (tb) {
      if (tb.querySelector('[data-a=settings]')) return;
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('data-a', 'settings'); b.textContent = '⚙ ' + T('settings');
      tb.appendChild(b); b.onclick = openSettings;
    });
    mountReadAloud();
    registerSW();
    mountChip();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
