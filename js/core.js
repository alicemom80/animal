// 공통 도구: 소리, 저장, 화면 전환, 라운드 진행
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  A.$ = $;
  A.el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  A.shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  A.rand = (n) => Math.floor(Math.random() * n);
  A.img = (w, cls = '') => `<img class="pic ${cls}" src="images/${w.id}.webp" alt="${w.en}" draggable="false">`;

  /* ---------- 저장 (별) ---------- */
  const KEY = 'animal-english-stars-v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { saved = {}; }
  A.getStars = (k) => saved[k] || 0;
  A.saveStars = (k, n) => {
    if (n <= (saved[k] || 0)) return;
    saved = { ...saved, [k]: n };
    try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* 저장 불가 기기는 무시 */ }
  };
  A.sumStars = (prefix) => Object.keys(saved).filter(k => k.startsWith(prefix)).reduce((s, k) => s + saved[k], 0);

  /* ---------- 소리: 기기 내장 음성(speechSynthesis) ---------- */
  let voice = null;
  const pickVoice = () => {
    if (!('speechSynthesis' in window)) return;
    const vs = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
    voice = vs.find(v => /en-US/i.test(v.lang) && /(female|samantha|google us|zira|aria|jenny)/i.test(v.name))
      || vs.find(v => /en-US/i.test(v.lang)) || vs[0] || null;
  };
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  // 소리 재생은 이 함수 한 곳만 거친다 (나중에 mp3 파일로 바꾸기 쉽게)
  A.speak = (text) => {
    if (!('speechSynthesis' in window) || !text) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.8;
      u.pitch = 1.1;
      if (voice) u.voice = voice;
      speechSynthesis.speak(u);
    } catch (e) { /* 소리 실패해도 놀이는 계속 */ }
  };
  A.say = (w) => A.speak(w.say);
  A.target = null;   // 스피커 버튼이 다시 들려줄 소리
  A.targetText = null;

  /* ---------- 가만히 있으면 스피커가 반짝 ---------- */
  let idleTimer = null;
  const IDLE_MS = 6000;
  A.pokeIdle = () => {
    const sp = $('#speaker');
    if (sp) sp.classList.remove('pulse');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      const s = $('#speaker');
      if (s && !s.hidden) s.classList.add('pulse');
    }, IDLE_MS);
  };
  document.addEventListener('pointerdown', () => A.pokeIdle(), true);

  /* ---------- 화면 ---------- */
  A.app = $('#app');
  A.show = (node) => {
    A.app.replaceChildren(node);
    A.pokeIdle();
    window.scrollTo(0, 0);
  };
  // 위쪽 바: 뒤로가기, 제목, 스피커
  A.topbar = (title, onBack, withSpeaker) => {
    const bar = A.el('div', 'topbar');
    const back = A.el('button', 'btn round', onBack ? '⬅' : '🏠');
    back.setAttribute('aria-label', '뒤로');
    back.onclick = () => { speechSynthesis.cancel?.(); (onBack || A.home)(); };
    const t = A.el('div', 'title', title);
    bar.append(back, t);
    if (withSpeaker) {
      const sp = A.el('button', 'btn round speaker', '🔊');
      sp.id = 'speaker';
      sp.setAttribute('aria-label', '소리 듣기');
      sp.onclick = () => {
        if (A.target) A.say(A.target); else if (A.targetText) A.speak(A.targetText);
      };
      bar.append(sp);
    } else {
      bar.append(A.el('div', 'spacer'));
    }
    return bar;
  };

  /* ---------- 칭찬 이펙트 ---------- */
  A.burst = (first) => {
    const b = A.el('div', 'burst', first ? '⭐' : '👍');
    document.body.append(b);
    setTimeout(() => b.remove(), 650);
  };
  A.shake = (node) => {
    node.classList.remove('shake');
    void node.offsetWidth;
    node.classList.add('shake');
  };

  /* ---------- 문제 돌리기 ----------
     renderQ(word, api): 문제 화면을 stage에 그린다.
     api.ok(): 정답 → 바로 다음 문제.  api.bad(): 오답 → 소리 다시, 벌점 없음. */
  A.rounds = (ctx, renderQ, textFn) => {
    const order = A.shuffle(ctx.words);
    let i = 0, stars = 0;
    const next = () => {
      if (i >= order.length) return ctx.finish(stars, order.length);
      const w = order[i];
      A.target = textFn ? null : w;
      A.targetText = textFn ? textFn(w) : null;
      ctx.progress(i, order.length);
      ctx.stage.replaceChildren();
      let tried = false, locked = false;
      const api = {
        ok(delay = 550) {
          if (locked) return;
          locked = true;
          if (!tried) stars++;
          A.burst(!tried);
          i++;
          setTimeout(next, delay);
        },
        bad(node) {
          tried = true;
          if (node) A.shake(node);
          if (textFn) A.speak(textFn(w)); else A.say(w);
        },
      };
      renderQ(w, api);
      if (textFn) A.speak(textFn(w)); else A.say(w);   // 문제가 나오면 소리가 바로 나온다
    };
    next();
  };

  // 정답 + 오답 후보 만들기 (같은 주제 안에서 뽑는다)
  A.choices = (w, ctx, n) => {
    let others = ctx.pool.filter(x => x.id !== w.id);
    if (others.length < n - 1) others = others.concat(A.allWords().filter(x => x.id !== w.id && !others.includes(x)));
    return A.shuffle([w, ...A.shuffle(others).slice(0, n - 1)]);
  };
  A.allWords = () => A.THEMES.flatMap(t => t.words);
  A.games = {};
})();
