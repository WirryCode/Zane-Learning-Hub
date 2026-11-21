/* HTML Mastery service worker (Sector 7). (c) Wilfred Wanyoike
   Cache-first for the shell, network-first for pages with an offline fallback. */
var CACHE = 'hm-v8';
var CORE = [
  './', 'index.html', 'study.html', 'weak.html', 'exam.html', 'offline.html', 'manifest.webmanifest', 'changelog.html',
  'terms.html', 'privacy.html', 'cookies.html', 'profile.html',
  'css/style.css',
  'js/prefs.js', 'js/profile.js', 'js/reach.js', 'js/app.js', 'js/palette.js', 'js/study.js', 'js/weak.js', 'js/exam.js', 'js/m21.js', 'js/practice.js',
  'data/modules.js', 'data/quizzes.js', 'data/challenges.js',
  'img/logo-dark.png', 'img/logo-light.png', 'img/logo-bar.png', 'img/favicon.ico', 'img/favicon-32.png',
  'img/apple-touch-icon.png', 'img/icon-192.png', 'img/icon-512.png'
];

/* No skipWaiting here: a new worker waits until the page offers the update, so the reader is not
   swapped to a half-warmed cache mid-sentence. First installs activate immediately anyway. */
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(CORE.map(function (u) { return c.add(new Request(u, { cache: 'reload' })).catch(function () {}); }));
  }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

/* Enhancement C: the page asks for a chosen list of URLs to be stored (or dropped) so the whole course
   can be read offline. Only same-origin pages are accepted. */
self.addEventListener('message', function (e) {
  var d = e.data || {};
  /* Sector 7: the page's "Update available" prompt asks the waiting worker to take over. */
  if (d.type === 'hm-skip') { self.skipWaiting(); return; }
  if (d.type !== 'hm-offline' || !Array.isArray(d.urls)) return;
  var urls = d.urls.filter(function (u) { return typeof u === 'string' && u.indexOf('//') !== 0 && u.indexOf(':') < 0; });
  var job = caches.open(CACHE).then(function (c) {
    if (d.on === false) return Promise.all(urls.map(function (u) { return c.delete(u).catch(function () {}); }));
    return Promise.all(urls.map(function (u) { return c.add(new Request(u, { cache: 'reload' })).catch(function () {}); }));
  }).then(function () { return urls.length; });
  if (e.waitUntil) e.waitUntil(job);
  if (e.ports && e.ports[0]) job.then(function (n) { e.ports[0].postMessage({ ok: true, n: n }); });
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (res) {
      if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        return hit || caches.match('offline.html') || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      });
    }));
    return;
  }

  e.respondWith(caches.match(req).then(function (hit) {
    if (hit) return hit;
    return fetch(req).then(function (res) {
      if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    });
  }));
});
