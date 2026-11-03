// 동물 데이터: id(그림 파일 이름), en(영어), ko(한글), say(읽을 소리, 없으면 en)
window.A = window.A || {};

A.THEMES = [
  { id: 'farm', ko: '농장', en: 'Farm', icon: '🐄', cover: 'cow', color: '#ffb84d',
    words: [
      ['dog', 'dog', '강아지'], ['cat', 'cat', '고양이'], ['pig', 'pig', '돼지'],
      ['cow', 'cow', '젖소'], ['chick', 'chick', '병아리'],
    ] },
  { id: 'wild', ko: '숲·정글·초원', en: 'Forest & Jungle', icon: '🦁', cover: 'lion', color: '#6fcf6f',
    words: [
      ['lion', 'lion', '사자'], ['tiger', 'tiger', '호랑이'], ['elephant', 'elephant', '코끼리'],
      ['giraffe', 'giraffe', '기린'], ['zebra', 'zebra', '얼룩말'],
      ['hippo', 'hippo', '하마'], ['rhino', 'rhino', '코뿔소'], ['rabbit', 'rabbit', '토끼'],
      ['fox', 'fox', '여우'], ['squirrel', 'squirrel', '다람쥐'],
      ['hedgehog', 'hedgehog', '고슴도치'], ['owl', 'owl', '부엉이'], ['panda', 'panda', '판다'],
      ['koala', 'koala', '코알라'], ['sloth', 'sloth', '나무늘보'],
      ['capybara', 'capybara', '카피바라'], ['lemur', 'lemur', '여우원숭이'],
    ] },
  { id: 'sea', ko: '바다', en: 'Sea', icon: '🐳', cover: 'whale', color: '#4db8ff',
    words: [
      ['whale', 'whale', '고래'], ['dolphin', 'dolphin', '돌고래'], ['octopus', 'octopus', '문어'],
      ['crab', 'crab', '게'], ['starfish', 'starfish', '불가사리'],
      ['seaotter', 'sea otter', '해달'], ['turtle', 'turtle', '거북이'],
    ] },
  { id: 'cold', ko: '추운 곳', en: 'Cold Places', icon: '🐧', cover: 'penguin', color: '#8fd3f4',
    words: [
      ['penguin', 'penguin', '펭귄'], ['polarbear', 'polar bear', '북극곰'], ['walrus', 'walrus', '바다코끼리'],
    ] },
  { id: 'dino', ko: '공룡·상상', en: 'Dinosaurs & Fantasy', icon: '🦖', cover: 'trex', color: '#b58cff',
    words: [
      ['trex', 'T-rex', '티라노사우루스', 'tie ranno saurus'], ['stego', 'stegosaurus', '스테고사우루스'],
      ['brachio', 'brachiosaurus', '브라키오사우루스'], ['ptera', 'pteranodon', '프테라노돈'],
      ['unicorn', 'unicorn', '유니콘'], ['dragon', 'dragon', '아기용'],
    ] },
  { id: 'bug', ko: '곤충', en: 'Bugs', icon: '🐞', soon: true, color: '#ff8fa3', words: [] },
  { id: 'bird', ko: '새', en: 'Birds', icon: '🦜', soon: true, color: '#ffd84d', words: [] },
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
