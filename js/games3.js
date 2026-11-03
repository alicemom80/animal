// 레벨 3 놀이: 미로, 숨은그림찾기, 묻고 답하기
(function () {
  const { el, img } = A;

  /* ---------- 미로 ---------- */
  // 칸마다 [위, 오른쪽, 아래, 왼쪽] 벽이 있는지(true=막힘)
  function makeMaze(N) {
    const cells = Array.from({ length: N * N }, () => [true, true, true, true]);
    const DIRS = [[0, -1, 0, 2], [1, 0, 1, 3], [0, 1, 2, 0], [-1, 0, 3, 1]];
    const seen = new Set([0]);
    const stack = [0];
    while (stack.length) {
      const cur = stack[stack.length - 1];
      const cx = cur % N, cy = Math.floor(cur / N);
      const nexts = A.shuffle(DIRS).filter(([dx, dy]) => {
        const nx = cx + dx, ny = cy + dy;
        return nx >= 0 && ny >= 0 && nx < N && ny < N && !seen.has(ny * N + nx);
      });
      if (!nexts.length) { stack.pop(); continue; }
      const [dx, dy, wall, opp] = nexts[0];
      const nxt = (cy + dy) * N + cx + dx;
      cells[cur][wall] = false;
      cells[nxt][opp] = false;
      seen.add(nxt);
      stack.push(nxt);
    }
    return cells;
  }
  function distances(cells, N) {
    const dist = Array(N * N).fill(-1);
    dist[0] = 0;
    const q = [0];
    const step = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    while (q.length) {
      const cur = q.shift();
      const cx = cur % N, cy = Math.floor(cur / N);
      step.forEach(([dx, dy], d) => {
        const nx = cx + dx, ny = cy + dy, ni = ny * N + nx;
        if (cells[cur][d] || nx < 0 || ny < 0 || nx >= N || ny >= N || dist[ni] >= 0) return;
        dist[ni] = dist[cur] + 1;
        q.push(ni);
      });
    }
    return dist;
  }

  A.games.maze = {
    name: '미로 찾기', icon: '🌀', level: 3, desc: '소리의 주인공에게 길을 찾아가요',
    start(ctx) {
      const N = ctx.diff === 0 ? 5 : 6;
      A.rounds(ctx, (w, api) => {
        const cells = makeMaze(N);
        const dist = distances(cells, N);
        const far = A.shuffle([...dist.keys()].filter(k => dist[k] >= N)).slice(0, 3);
        const picks = A.choices(w, ctx, 3);
        const items = new Map(far.map((cell, k) => [cell, picks[k]]));
        let me = 0;
        const board = el('div', 'maze');
        board.style.setProperty('--n', N);
        cells.forEach((wl, k) => {
          const c = el('div', 'mcell');
          c.style.borderTopWidth = wl[0] ? '4px' : '0';
          c.style.borderRightWidth = wl[1] ? '4px' : '0';
          c.style.borderBottomWidth = wl[2] ? '4px' : '0';
          c.style.borderLeftWidth = wl[3] ? '4px' : '0';
          if (items.has(k)) c.innerHTML = img(items.get(k));
          board.append(c);
        });
        const kids = board.children;
        const player = el('div', 'me', '🧒');
        kids[0].append(player);
        const arrive = () => {
          kids[me].append(player);
          const found = items.get(me);
          if (!found) return;
          if (found.id === w.id) api.ok(); else api.bad(kids[me]);
        };
        const go = (d) => {
          const dx = [0, 1, 0, -1][d], dy = [-1, 0, 1, 0][d];
          const x = me % N, y = Math.floor(me / N);
          if (cells[me][d] || x + dx < 0 || y + dy < 0 || x + dx >= N || y + dy >= N) return false;
          me = (y + dy) * N + x + dx;
          arrive();
          return true;
        };
        // 손가락으로 끌어서 움직이기
        board.addEventListener('pointermove', (e) => {
          if (e.buttons === 0 && e.pointerType === 'mouse') return;
          const r = board.getBoundingClientRect();
          const px = Math.floor(((e.clientX - r.left) / r.width) * N);
          const py = Math.floor(((e.clientY - r.top) / r.height) * N);
          const x = me % N, y = Math.floor(me / N);
          [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy], d) => {
            if (px === x + dx && py === y + dy) go(d);
          });
        });
        board.style.touchAction = 'none';
        // 큰 화살표 버튼
        const pad = el('div', 'dpad');
        [['⬆', 0], ['⬅', 3], ['➡', 1], ['⬇', 2]].forEach(([t, d]) => {
          const b = el('button', `btn big k${d}`, t);
          b.onclick = () => go(d);
          pad.append(b);
        });
        ctx.stage.append(board, pad);
      });
    },
  };

  /* ---------- 숨은그림찾기 ---------- */
  const DECOR = ['🌳', '🌿', '🌸', '🍄', '🪨', '🌼', '🌲', '🍃'];
  A.games.hidden = {
    name: '숨은그림찾기', icon: '🔍', level: 3, desc: '풀숲에 숨은 동물을 찾아요',
    start(ctx) {
      A.rounds(ctx, (w, api) => {
        const scene = el('div', 'scene');
        const spots = [];
        const place = (size) => {
          for (let t = 0; t < 40; t++) {
            const x = 4 + Math.random() * (92 - size), y = 4 + Math.random() * (90 - size);
            if (spots.every(s => Math.hypot(s.x - x, s.y - y) > size * 0.9)) { spots.push({ x, y }); return { x, y }; }
          }
          const p = { x: 4 + Math.random() * 80, y: 4 + Math.random() * 80 };
          spots.push(p);
          return p;
        };
        const cast = ctx.words.length >= 4 ? ctx.words : A.choices(w, ctx, 5);
        for (let k = 0; k < 14; k++) {          // 풀, 나무 같은 꾸밈
          const d = el('div', 'decor', DECOR[A.rand(DECOR.length)]);
          const p = place(14);
          d.style.left = `${p.x}%`; d.style.top = `${p.y}%`;
          d.style.fontSize = `${34 + A.rand(26)}px`;
          scene.append(d);
        }
        A.shuffle(cast).forEach(c => {
          const b = el('button', 'hider', img(c));
          const p = place(18);
          b.style.left = `${p.x}%`; b.style.top = `${p.y}%`;
          b.style.transform = `rotate(${A.rand(41) - 20}deg)`;
          b.onclick = () => {
            if (c.id === w.id) { b.classList.add('found'); api.ok(); } else api.bad(b);
          };
          scene.append(b);
          // 일부는 풀로 살짝 가린다
          if (Math.random() < 0.6) {
            const cover = el('div', 'decor over', DECOR[A.rand(DECOR.length)]);
            cover.style.left = `calc(${p.x}% + 14px)`; cover.style.top = `calc(${p.y}% + 18px)`;
            scene.append(cover);
          }
        });
        ctx.stage.append(scene);
      });
    },
  };

  /* ---------- 묻고 답하기 ---------- */
  A.games.qa = {
    name: '묻고 답하기', icon: '💬', level: 3, desc: '질문을 듣고 알맞게 대답해요',
    start(ctx) {
      // 단어마다 질문 종류를 미리 정한다 (What is this? / Is it a ...?)
      const kind = new Map(A.shuffle(ctx.words).map((w, i) => [w.id, i % 2 === 0]));
      const askText = (w) => (kind.get(w.id) ? 'What is this?' : `Is it ${w.art} ${w.say}?`);
      A.rounds(ctx, (w, api) => {
        const wh = kind.get(w.id);
        const shown = wh ? w : (Math.random() < 0.5 ? w : A.choices(w, ctx, 2).find(x => x.id !== w.id));
        const isYes = shown.id === w.id;
        const bubble = el('div', 'bubble', wh ? 'What is this?' : `Is it ${w.art} ${w.en}?`);
        const pic = el('div', 'oxpic', img(shown, 'hero'));
        const list = el('div', 'answers');
        if (wh) {
          A.choices(w, ctx, 3).forEach(c => {
            const b = el('button', 'btn answer', `It's ${c.art} ${c.en}.`);
            b.onclick = () => {
              A.speak(`It's ${c.art} ${c.say}.`);
              if (c.id === w.id) api.ok(1500); else { A.shake(b); api.bad(); }
            };
            list.append(b);
          });
        } else {
          [['Yes, it is.', true], ['No, it isn’t.', false]].forEach(([t, yes]) => {
            const b = el('button', 'btn answer', t);
            b.onclick = () => {
              A.speak(t);
              if (yes === isYes) api.ok(1500); else { A.shake(b); api.bad(); }
            };
            list.append(b);
          });
        }
        bubble.onclick = () => A.speak(askText(w));
        ctx.stage.append(bubble, pic, list);
      }, askText);
    },
  };
})();
