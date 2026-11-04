// 한 번 열면 인터넷 없이도 열리도록 파일을 저장해 두는 서비스 워커
const CACHE = 'animal-english-v17';
const FILES = [
  './', 'index.html', 'manifest.json', 'css/style.css', 'fonts/Jua.woff2', 'js/data.js',
  'js/scenes.js', 'js/core.js', 'js/games1.js', 'js/games2.js', 'js/games3.js', 'js/stickers.js',
  'js/parent.js', 'js/start.js', 'js/app.js', 'icons/icon-192.png', 'icons/icon-512.png', 'images/bg/beach.webp',
  'images/bg/farm.webp', 'images/bg/forest.webp', 'images/bg/night.webp', 'images/bg/savanna.webp', 'images/angelfish.webp', 'images/ankylosaurus.webp',
  'images/ant.webp', 'images/bear.webp', 'images/bee.webp', 'images/beetle.webp', 'images/bird.webp', 'images/brachio.webp',
  'images/butterfly.webp', 'images/camel.webp', 'images/capybara.webp', 'images/cat.webp', 'images/caterpillar.webp', 'images/cheetah.webp',
  'images/chick.webp', 'images/cow.webp', 'images/crab.webp', 'images/crocodile.webp', 'images/deer.webp', 'images/dog.webp',
  'images/dolphin.webp', 'images/donkey.webp', 'images/dragon.webp', 'images/dragonfly.webp', 'images/duck.webp', 'images/eagle.webp',
  'images/elephant.webp', 'images/firefly.webp', 'images/fish.webp', 'images/flamingo.webp', 'images/fox.webp', 'images/giraffe.webp',
  'images/girl.webp', 'images/goat.webp', 'images/goose.webp', 'images/gorilla.webp', 'images/grasshopper.webp', 'images/hedgehog.webp',
  'images/hen.webp', 'images/hippo.webp', 'images/horse.webp', 'images/hummingbird.webp', 'images/jellyfish.webp', 'images/kangaroo.webp',
  'images/koala.webp', 'images/ladybug.webp', 'images/lemur.webp', 'images/leopard.webp', 'images/lion.webp', 'images/llama.webp',
  'images/lobster.webp', 'images/mammoth.webp', 'images/mosquito.webp', 'images/moth.webp', 'images/octopus.webp', 'images/orca.webp',
  'images/ostrich.webp', 'images/owl.webp', 'images/panda.webp', 'images/parasaurolophus.webp', 'images/parrot.webp', 'images/peacock.webp',
  'images/pegasus.webp', 'images/pelican.webp', 'images/penguin.webp', 'images/phoenix.webp', 'images/pig.webp', 'images/pigeon.webp',
  'images/polarbear.webp', 'images/ptera.webp', 'images/pufferfish.webp', 'images/rabbit.webp', 'images/rhino.webp', 'images/rooster.webp',
  'images/sabertooth.webp', 'images/scorpion.webp', 'images/seagull.webp', 'images/seahorse.webp', 'images/seal.webp', 'images/seaotter.webp',
  'images/shark.webp', 'images/sheep.webp', 'images/shrimp.webp', 'images/sloth.webp', 'images/snail.webp', 'images/spider.webp',
  'images/spinosaurus.webp', 'images/squirrel.webp', 'images/starfish.webp', 'images/stego.webp', 'images/stork.webp', 'images/swan.webp',
  'images/tiger.webp', 'images/toucan.webp', 'images/trex.webp', 'images/triceratops.webp', 'images/turkey.webp', 'images/turtle.webp',
  'images/unicorn.webp', 'images/velociraptor.webp', 'images/walrus.webp', 'images/whale.webp', 'images/wolf.webp', 'images/woodpecker.webp',
  'images/worm.webp', 'images/zebra.webp', 'images/scenes/bird.webp', 'images/scenes/bug.webp', 'images/scenes/dino.webp', 'images/scenes/farm.webp',
  'images/scenes/sea.webp', 'images/scenes/wild.webp',
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
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(res => {   // 브라우저가 저장해 둔 옛 파일 대신 늘 새 파일을 확인한다
    if (res.ok && new URL(e.request.url).origin === location.origin) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
    }
    return res;
  }).catch(() => caches.match(e.request)));
});
