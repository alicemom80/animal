// 한 번 열면 인터넷 없이도 열리도록 파일을 저장해 두는 서비스 워커
const CACHE = 'animal-english-v1';
const FILES = [
  './', 'index.html', 'manifest.json', 'css/style.css',
  'js/data.js', 'js/core.js', 'js/games1.js', 'js/games2.js', 'js/games3.js', 'js/app.js',
  'icons/icon-192.png', 'icons/icon-512.png',
  'images/brachio.webp', 'images/capybara.webp', 'images/cat.webp', 'images/chick.webp', 'images/cow.webp', 'images/crab.webp', 'images/dog.webp', 'images/dolphin.webp', 'images/dragon.webp', 'images/elephant.webp', 'images/fox.webp', 'images/giraffe.webp', 'images/hedgehog.webp', 'images/hippo.webp', 'images/koala.webp', 'images/lemur.webp', 'images/lion.webp', 'images/octopus.webp', 'images/owl.webp', 'images/panda.webp', 'images/penguin.webp', 'images/pig.webp', 'images/polarbear.webp', 'images/ptera.webp', 'images/rabbit.webp', 'images/rhino.webp', 'images/seaotter.webp', 'images/sloth.webp', 'images/squirrel.webp', 'images/starfish.webp', 'images/stego.webp', 'images/tiger.webp', 'images/trex.webp', 'images/turtle.webp', 'images/unicorn.webp', 'images/walrus.webp', 'images/whale.webp', 'images/zebra.webp',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // 인터넷이 되면 최신 파일, 안 되면 저장해 둔 파일을 쓴다
  e.respondWith(fetch(e.request).then(res => {
    if (res.ok && new URL(e.request.url).origin === location.origin) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
    }
    return res;
  }).catch(() => caches.match(e.request)));
});
