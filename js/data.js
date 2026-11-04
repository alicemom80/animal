// 동물 데이터: id(그림 파일 이름), en(영어), ko(한글), say(읽을 소리, 없으면 en)
window.A = window.A || {};

A.THEMES = [
  { id: 'farm', ko: '농장·들판', en: 'Farm & Field', icon: '🐄', cover: 'cow', color: '#f7d9a8',
    words: [
      ['dog', 'dog', '강아지'], ['cat', 'cat', '고양이'], ['pig', 'pig', '돼지'], ['cow', 'cow', '젖소'], ['chick', 'chick', '병아리'],
      ['horse', 'horse', '말'], ['sheep', 'sheep', '양'], ['duck', 'duck', '오리'], ['goat', 'goat', '염소'], ['rooster', 'rooster', '수탉'],
      ['donkey', 'donkey', '당나귀'], ['turkey', 'turkey', '칠면조'], ['hen', 'hen', '암탉'], ['goose', 'goose', '거위'], ['llama', 'llama', '라마'],
      ['rabbit', 'rabbit', '토끼'], ['deer', 'deer', '사슴'], ['fox', 'fox', '여우'], ['squirrel', 'squirrel', '다람쥐'], ['hedgehog', 'hedgehog', '고슴도치'],
    ] },
  { id: 'wild', ko: '숲·초원', en: 'Forest & Grassland', icon: '🦁', cover: 'lion', color: '#c3e6b5',
    words: [
      ['lion', 'lion', '사자'], ['tiger', 'tiger', '호랑이'], ['elephant', 'elephant', '코끼리'], ['giraffe', 'giraffe', '기린'], ['zebra', 'zebra', '얼룩말'],
      ['hippo', 'hippo', '하마'], ['rhino', 'rhino', '코뿔소'],
      ['panda', 'panda', '판다'], ['koala', 'koala', '코알라'], ['sloth', 'sloth', '나무늘보'], ['capybara', 'capybara', '카피바라'],
      ['lemur', 'lemur', '여우원숭이'], ['bear', 'bear', '곰'], ['wolf', 'wolf', '늑대'], ['kangaroo', 'kangaroo', '캥거루'],
      ['gorilla', 'gorilla', '고릴라'], ['camel', 'camel', '낙타'], ['cheetah', 'cheetah', '치타'], ['leopard', 'leopard', '표범'], ['crocodile', 'crocodile', '악어'],
    ] },
  { id: 'sea', ko: '바다', en: 'Sea', icon: '🐳', cover: 'whale', color: '#b7dcf3',
    words: [
      ['whale', 'whale', '고래'], ['dolphin', 'dolphin', '돌고래'], ['octopus', 'octopus', '문어'], ['crab', 'crab', '게'], ['starfish', 'starfish', '불가사리'],
      ['seaotter', 'sea otter', '해달'], ['turtle', 'turtle', '거북이'], ['penguin', 'penguin', '펭귄'], ['polarbear', 'polar bear', '북극곰'], ['walrus', 'walrus', '바다코끼리'],
      ['shark', 'shark', '상어'], ['fish', 'fish', '물고기'], ['jellyfish', 'jellyfish', '해파리'], ['lobster', 'lobster', '바닷가재'], ['shrimp', 'shrimp', '새우'],
      ['orca', 'orca', '범고래'], ['pufferfish', 'pufferfish', '복어'], ['seahorse', 'seahorse', '해마'], ['angelfish', 'angelfish', '엔젤피시'], ['seal', 'seal', '물범'],
    ] },
  { id: 'bug', ko: '곤충', en: 'Bugs', icon: '🐞', cover: 'butterfly', color: '#f8c8d2',
    words: [
      ['bee', 'bee', '벌'], ['butterfly', 'butterfly', '나비'], ['ant', 'ant', '개미'], ['ladybug', 'ladybug', '무당벌레'], ['dragonfly', 'dragonfly', '잠자리'],
      ['spider', 'spider', '거미'], ['snail', 'snail', '달팽이'], ['caterpillar', 'caterpillar', '애벌레'], ['grasshopper', 'grasshopper', '메뚜기'], ['firefly', 'firefly', '반딧불이'],
      ['moth', 'moth', '나방'], ['mosquito', 'mosquito', '모기'], ['scorpion', 'scorpion', '전갈'], ['beetle', 'beetle', '딱정벌레'], ['worm', 'worm', '지렁이'],
    ] },
  { id: 'bird', ko: '새', en: 'Birds', icon: '🦜', cover: 'parrot', color: '#f9e9a8',
    words: [
      ['parrot', 'parrot', '앵무새'], ['eagle', 'eagle', '독수리'], ['swan', 'swan', '백조'], ['flamingo', 'flamingo', '플라밍고'], ['peacock', 'peacock', '공작새'],
      ['pigeon', 'pigeon', '비둘기'], ['woodpecker', 'woodpecker', '딱따구리'], ['seagull', 'seagull', '갈매기'], ['hummingbird', 'hummingbird', '벌새'], ['bird', 'bird', '새'],
      ['owl', 'owl', '부엉이'], ['toucan', 'toucan', '투칸'], ['pelican', 'pelican', '펠리컨'], ['ostrich', 'ostrich', '타조'], ['stork', 'stork', '황새'],
    ] },
  { id: 'dino', ko: '공룡·상상', en: 'Dinosaurs & Fantasy', icon: '🦖', cover: 'trex', color: '#d7c9f2',
    words: [
      ['trex', 'T-rex', '티라노사우루스', 'tie ranno saurus'], ['stego', 'stegosaurus', '스테고사우루스'], ['brachio', 'brachiosaurus', '브라키오사우루스'],
      ['ptera', 'pteranodon', '프테라노돈'], ['unicorn', 'unicorn', '유니콘'],
      ['dragon', 'dragon', '용'], ['triceratops', 'triceratops', '트리케라톱스'], ['velociraptor', 'velociraptor', '벨로시랩터'],
      ['ankylosaurus', 'ankylosaurus', '안킬로사우루스'], ['mammoth', 'mammoth', '매머드'],
      ['spinosaurus', 'spinosaurus', '스피노사우루스'], ['parasaurolophus', 'parasaurolophus', '파라사우롤로푸스'], ['pegasus', 'pegasus', '페가수스'],
      ['phoenix', 'phoenix', '불사조'], ['sabertooth', 'sabertooth', '검치호랑이', 'saber tooth'],
    ] },
];

// 5개씩 묶음으로 나누기 (맨 끝 묶음은 5개보다 적을 수 있음)
A.GROUP_SIZE = 5;
A.THEMES.forEach(t => {
  t.words = t.words.map(([id, en, ko, say]) => ({
    id, en, ko, say: say || en,
    art: /^[aeiou]/i.test(en) ? 'an' : 'a',
  }));
  t.groups = [];
  for (let i = 0; i < t.words.length; i += A.GROUP_SIZE) {
    t.groups.push(t.words.slice(i, i + A.GROUP_SIZE));
  }
});
