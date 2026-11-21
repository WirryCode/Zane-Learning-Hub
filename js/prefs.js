/* Preferences boot script (Sector 7). Runs in <head> so theme, text size,
   spacing, font and language apply before the first paint. (c) Wilfred Wanyoike */
(function () {
  var d = { theme: 'light', scale: '100', spacing: 'normal', font: 'serif', lang: 'en', readaloud: true };
  try {
    var raw = localStorage.getItem('hm_settings');
    if (raw) { var s = JSON.parse(raw); for (var k in d) if (s && s[k] != null) d[k] = s[k]; }
  } catch (e) {}
  var h = document.documentElement;
  h.setAttribute('data-theme', d.theme);
  if (d.theme === 'contrast') h.setAttribute('data-contrast', 'more');
  h.setAttribute('data-scale', d.scale);
  h.setAttribute('data-spacing', d.spacing);
  h.setAttribute('data-font', d.font);
  h.setAttribute('lang', d.lang === 'sw' ? 'sw' : 'en');
  window.HM_PREFS = d;
})();
