// 스티커: 놀이를 끝내면 동물 스티커를 하나 받고, 스티커북에서 모은 동물을 볼 수 있어요
(function () {
  const { el, img } = A;
  const KEY = 'animal-english-stickers-v1';
  const COLUMNS_TOTAL = () => A.THEMES.reduce((s, t) => s + t.words.length, 0);

  let owned = {};   // { 동물id: 받은 횟수 }
  try { owned = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { owned = {}; }
  const persist = () => {
    try { localStorage.setItem(KEY, JSON.stringify(owned)); } catch (e) { /* 저장 불가 기기는 무시 */ }
  };

  const has = (id) => (owned[id] || 0) > 0;
  const countIn = (words) => words.filter(w => has(w.id)).length;
  const total = () => A.THEMES.reduce((s, t) => s + countIn(t.words), 0);

  // 그 묶음에서 아직 없는 동물부터, 다 모았으면 같은 주제의 없는 동물, 그것도 없으면 아무 동물이나 "하나 더"
  const award = (theme, gi) => {
    const group = typeof gi === 'number' ? theme.groups[gi] || [] : [];
    const pick = (list) => list.filter(w => !has(w.id));
    const fresh = pick(group).length ? pick(group) : pick(theme.words);
    const word = A.shuffle(fresh.length ? fresh : (group.length ? group : theme.words))[0];
    const isNew = !has(word.id);
    owned = { ...owned, [word.id]: (owned[word.id] || 0) + 1 };
    persist();
    return { word, isNew };
  };

  // 놀이 끝 화면에 붙는 "새 스티커" 카드
  const rewardNode = ({ word, isNew }) => {
    const card = el('div', 'reward', `
      <div class="rpic">${img(word)}${isNew ? '<span class="rnew">NEW!</span>' : ''}</div>
      <div class="rtext"><b>${word.en}</b><small>${isNew ? '스티커를 받았어요!' : '스티커 하나 더!'}</small></div>`);
    card.onclick = () => A.say(word);
    return card;
  };
  const rewardSpeech = ({ word }) => `Great job! You got ${word.art} ${word.say} sticker!`;

  // 스티커북: 주제마다 한 쪽, 모은 동물은 색깔로, 아직 없는 동물은 흐린 그림자로
  const book = (back, startId) => {
    const page = el('div', 'page bookpage');
    page.append(A.topbar(`📒 스티커북<small>Sticker Book ${total()} / ${COLUMNS_TOTAL()}</small>`, back, false));
    const tabs = el('div', 'btabs');
    const slots = el('div', 'stk-grid');
    const buttons = A.THEMES.map(t => {
      const done = countIn(t.words) === t.words.length;
      const b = el('button', 'btn btab', `<span>${t.icon}</span><small>${countIn(t.words)}/${t.words.length}</small>${done ? '<i class="bstar">⭐</i>' : ''}`);
      b.style.setProperty('--c', t.color);
      b.setAttribute('aria-label', `${t.ko} 스티커`);
      b.onclick = () => { A.sfx('flip'); show(t); };
      tabs.append(b);
      return b;
    });
    const show = (t) => {
      buttons.forEach((b, i) => b.classList.toggle('on', A.THEMES[i] === t));
      slots.replaceChildren(...t.words.map(w => {
        const got = has(w.id);
        const s = el('button', `stk ${got ? 'has' : 'miss'}`, `${img(w)}${got && owned[w.id] > 1 ? `<i class="scount">×${owned[w.id]}</i>` : ''}`);
        s.setAttribute('aria-label', got ? w.en : '아직 없어요');
        s.onclick = () => (got ? (A.sfx('ok'), A.say(w)) : A.sfx('bad'));
        return s;
      }));
    };
    page.append(tabs, slots);
    A.show(page);
    show(A.THEMES.find(t => t.id === startId) || A.THEMES[0]);
  };

  const reset = () => {
    owned = {};
    try { localStorage.removeItem(KEY); } catch (e) { /* 저장 불가 기기는 무시 */ }
  };

  A.stickers = { reset, has, total, all: COLUMNS_TOTAL, award, rewardNode, rewardSpeech, book };
})();
