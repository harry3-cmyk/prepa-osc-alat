/* Service worker : l'appli s'ouvre même sans réseau. Le fil veille.json passe toujours par le réseau d'abord. */
const V = 'prepa-alat-20261031231243';
const SHELL = ['./', 'index.html', 'data.js', 'core.js', 'gen.js', 'sim.js', 'views.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('prepa-alat-') && k !== V && k !== 'prepa-alat-fonts').map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin && url.pathname.endsWith('/veille.json')) {
    e.respondWith(fetch(req).then(r => { if (r.ok) { const cp = r.clone(); caches.open(V).then(c => c.put('veille.json', cp)); } return r; })
      .catch(() => caches.match('veille.json')));
    return;
  }
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(r => {
      if (r.ok) { const cp = r.clone(); caches.open(V).then(c => c.put(req, cp)); }
      return r;
    }).catch(() => caches.match('index.html'))));
    return;
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open('prepa-alat-fonts').then(c => c.match(req).then(hit => hit || fetch(req).then(r => { c.put(req, r.clone()); return r; }))));
  }
});
