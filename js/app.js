// 화면 흐름: 홈(주제) → 묶음(5개씩) → 놀이 고르기 → 놀이
(function () {
  const { el, img } = A;
  const GAME_ORDER = ['card', 'pick', 'balloon', 'match', 'ox', 'scratch', 'maze', 'qa'];   // 숨은그림찾기는 묶음이 아니라 주제 화면에 따로 있다
  const WIDE_GAMES = ['card', 'qa'];   // 맨 위·맨 아래에 가로로 한 줄
  const LEVEL_ICON = { 1: '🌱', 2: '🌿', 3: '🌳' };
  const MAX_STARS = 5;

  // 주제별 배경 그림 (images/bg/<이름>.webp)
  const THEME_BG = A.CONFIG.backgrounds;
  const setBg = (themeId) => {
    const name = THEME_BG[themeId];
    A.$('#bg').style.backgroundImage = name ? `url(images/bg/${name}.webp)` : 'none';
  };

  // 좁은 칸에서 긴 영어 단어가 어색하게 끊기지 않도록, 끊어도 되는 자리(소프트 하이픈)를 표시한다
  const BREAK_AT = /(fish|fly|pillar|hopper|pecker|bird|saurus|saurolophus|raptor|ceratops|nodon|tooth|dile)$/;
  const breakable = (en) => (en.length > 8 && !en.includes(' ') ? en.replace(BREAK_AT, '­$1') : en);

  A.setBg = setBg;

  const starRow =(n) => '⭐'.repeat(n) + '☆'.repeat(Math.max(0, MAX_STARS - n));

  A.home = function () {
    A.target = null; A.targetText = null;
    setBg('home');
    const page = el('div', 'page homepage');
    page.append(A.parent.button(), el('h1', 'logo', A.logoHtml()));
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
    const sb = el('button', 'btn bookbtn', `📒 <b>스티커북</b> <span>${A.stickers.total()} / ${A.stickers.all()}</span>`);
    sb.onclick = () => A.stickers.book(A.home);
    page.append(sb, el('div', 'credit small', '<i class="igicon"></i>instagram <b>@alicemom80</b>'));
    A.show(page);
  };

  A.themePage = function (t) {
    setBg(t.id);
    const page = el('div', 'page themepage');
    page.append(A.topbar(`${t.icon} ${t.ko}<small>${t.en}</small>`, A.home, false));
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
    if (A.SCENES && A.SCENES[t.id]) {
      const hg = A.games.hidden;
      const best = A.getStars(`${t.id}:scene:hidden`);
      const sb = el('button', 'btn scenebtn', `
        <span class="gicon">${hg.icon}</span>
        <b>${hg.name}</b>
        <span>${LEVEL_ICON[hg.level]}${best ? ' ⭐' + best : ''}</span>`);
      sb.onclick = () => A.play(t, 'scene', 'hidden');
      page.append(sb);
    }
    A.show(page);
  };

  A.menuPage = function (t, gi) {
    const g = t.groups[gi];
    setBg(t.id);
    const page = el('div', 'page');
    page.append(A.topbar(`${t.icon} ${t.ko} 친구들 ${gi + 1}<small>${t.en} Friends ${gi + 1}</small>`, () => A.themePage(t), false));
    const words = el('div', 'wordstrip', g.map(w => `<button class="chip">${img(w)}<span lang="en">${breakable(w.en)}</span></button>`).join(''));
    words.querySelectorAll('.chip').forEach((c, i) => { c.onclick = () => A.say(g[i]); });
    page.append(words);
    const list = el('div', 'games');
    GAME_ORDER.forEach(id => {
      const gm = A.games[id];
      const best = A.getStars(`${t.id}:${gi}:${id}`);
      const b = el('button', `btn game lv${gm.level}${WIDE_GAMES.includes(id) ? ' wide' : ''}`, `
        <div class="gicon">${gm.icon}</div>
        <b class="gname">${gm.name}</b>
        <div class="glv">${LEVEL_ICON[gm.level]}${best ? ' ⭐' + best : ''}</div>`);
      b.title = gm.desc;
      b.onclick = () => A.play(t, gi, id);
      list.append(b);
    });
    page.append(list);
    A.show(page);
  };

  A.play = function (t, gi, id) {
    const gm = A.games[id];
    setBg(t.id);
    const page = el('div', 'page playpage');
    const goBack = () => (gi === 'scene' ? A.themePage(t) : A.menuPage(t, gi));
    page.append(A.topbar(`${gm.icon} ${gm.name}`, goBack, true));
    const bar = el('div', 'progress', '<i></i>');
    const stage = el('div', 'stage');
    page.append(bar, stage);
    A.show(page);
    const ctx = {
      words: t.groups[gi] || [],
      theme: t,
      pool: t.words,
      diff: Math.min(gi, 2),          // 뒤쪽 묶음일수록 어려워진다
      stage,
      progress(i, n) { bar.firstChild.style.width = `${(i / n) * 100}%`; },
      finish(stars, total) {
        if (!stage.isConnected) return;   // 놀이 화면을 떠난 뒤에는 끝 화면·소리·별 저장을 하지 않는다
        A.saveStars(`${t.id}:${gi}:${id}`, stars);
        A.target = null; A.targetText = null;
        const done = el('div', 'done', `
          <div class="trophy">🏆</div>
          <div class="bigstars">${starRow(Math.round((stars / total) * MAX_STARS))}</div>
          <div class="dmsg">${stars === total ? '모두 한 번에! 최고예요!' : '잘했어요!'}</div>`);
        const reward = A.stickers.award(t, gi);   // 놀이를 끝내면 스티커 하나
        done.append(A.stickers.rewardNode(reward));
        const again = el('button', 'btn big primary', '🔁 다시');
        const menu = el('button', 'btn big', '🎮 다른 놀이');
        again.onclick = () => A.play(t, gi, id);
        menu.onclick = goBack;
        const row = el('div', 'nav'); row.append(again, menu);
        stage.replaceChildren(done, row);
        A.celebrateEnd(Boolean(reward));
        A.speak(A.stickers.rewardSpeech(reward));
      },
    };
    gm.start(ctx);
  };

  A.start();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
