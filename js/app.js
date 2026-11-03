// 화면 흐름: 홈(주제) → 묶음(5개씩) → 놀이 고르기 → 놀이
(function () {
  const { el, img } = A;
  const GAME_ORDER = ['card', 'pick', 'balloon', 'match', 'ox', 'shadow', 'scratch', 'maze', 'hidden', 'qa'];
  const LEVEL_ICON = { 1: '🌱', 2: '🌿', 3: '🌳' };
  const MAX_STARS = 5;

  const starRow = (n) => '⭐'.repeat(n) + '☆'.repeat(Math.max(0, MAX_STARS - n));

  A.home = function () {
    A.target = null; A.targetText = null;
    const page = el('div', 'page');
    page.append(el('h1', 'logo', '🐾 동물 영어 놀이 <small>Animal Play</small>'));
    const grid = el('div', 'themes');
    A.THEMES.forEach(t => {
      const b = el('button', 'btn theme', `
        <div class="cover">${t.cover ? img({ id: t.cover, en: t.en }) : `<span class="emoji">${t.icon}</span>`}</div>
        <div class="tname">${t.ko}</div><div class="ten">${t.en}</div>
        <div class="tstars">${t.soon ? '곧 만나요!' : '⭐ ' + A.sumStars(t.id + ':')}</div>`);
      b.style.setProperty('--c', t.color);
      if (t.soon) b.classList.add('soon'); else b.onclick = () => A.themePage(t);
      grid.append(b);
    });
    page.append(grid);
    A.show(page);
  };

  A.themePage = function (t) {
    const page = el('div', 'page');
    page.append(A.topbar(`${t.icon} ${t.ko}`, A.home, false));
    page.append(el('div', 'sub', '5개씩 묶어서 배워요'));
    const list = el('div', 'groups');
    t.groups.forEach((g, gi) => {
      const b = el('button', 'btn group', `
        <div class="gnum">${gi + 1}</div>
        <div class="gpics">${g.map(w => img(w)).join('')}</div>
        <div class="gstar">⭐ ${A.sumStars(`${t.id}:${gi}:`)}</div>`);
      b.style.setProperty('--c', t.color);
      b.onclick = () => A.menuPage(t, gi);
      list.append(b);
    });
    page.append(list);
    A.show(page);
  };

  A.menuPage = function (t, gi) {
    const g = t.groups[gi];
    const page = el('div', 'page');
    page.append(A.topbar(`${t.icon} ${gi + 1}번 묶음`, () => A.themePage(t), false));
    const words = el('div', 'wordstrip', g.map(w => `<button class="chip">${img(w)}<span>${w.en}</span></button>`).join(''));
    words.querySelectorAll('.chip').forEach((c, i) => { c.onclick = () => A.say(g[i]); });
    page.append(words);
    const list = el('div', 'games');
    GAME_ORDER.forEach(id => {
      const gm = A.games[id];
      const best = A.getStars(`${t.id}:${gi}:${id}`);
      const b = el('button', `btn game lv${gm.level}`, `
        <div class="gicon">${gm.icon}</div>
        <div class="gtext"><b>${gm.name}</b><small>${gm.desc}</small></div>
        <div class="glv">${LEVEL_ICON[gm.level]}<span>${best ? '⭐' + best : ''}</span></div>`);
      b.onclick = () => A.play(t, gi, id);
      list.append(b);
    });
    page.append(list);
    A.show(page);
  };

  A.play = function (t, gi, id) {
    const gm = A.games[id];
    const page = el('div', 'page playpage');
    page.append(A.topbar(`${gm.icon} ${gm.name}`, () => A.menuPage(t, gi), true));
    const bar = el('div', 'progress', '<i></i>');
    const stage = el('div', 'stage');
    page.append(bar, stage);
    A.show(page);
    const ctx = {
      words: t.groups[gi],
      pool: t.words,
      diff: Math.min(gi, 2),          // 뒤쪽 묶음일수록 어려워진다
      stage,
      progress(i, n) { bar.firstChild.style.width = `${(i / n) * 100}%`; },
      finish(stars, total) {
        A.saveStars(`${t.id}:${gi}:${id}`, stars);
        A.target = null; A.targetText = null;
        const done = el('div', 'done', `
          <div class="trophy">🏆</div>
          <div class="bigstars">${starRow(Math.round((stars / total) * MAX_STARS))}</div>
          <div class="dmsg">${stars === total ? '모두 한 번에! 최고예요!' : '잘했어요!'}</div>`);
        const again = el('button', 'btn big primary', '🔁 다시');
        const menu = el('button', 'btn big', '🎮 다른 놀이');
        again.onclick = () => A.play(t, gi, id);
        menu.onclick = () => A.menuPage(t, gi);
        const row = el('div', 'nav'); row.append(again, menu);
        stage.replaceChildren(done, row);
        A.speak('Great job!');
      },
    };
    gm.start(ctx);
  };

  A.home();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
