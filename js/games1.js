// 레벨 1 놀이 (글자를 몰라도 소리로 할 수 있어요): 단어카드, 듣고 고르기, 풍선, 짝 맞추기
(function () {
  const { el, img } = A;

  A.games.card = {
    name: '단어 카드', icon: '🃏', level: 1, desc: '그림을 눌러 소리를 들어요',
    start(ctx) {
      let i = 0;
      const seen = new Set();
      const draw = () => {
        const w = ctx.words[i];
        seen.add(i);
        A.target = w;
        ctx.progress(i, ctx.words.length);
        const card = el('div', 'bigcard');
        card.innerHTML = `${img(w, 'hero')}
          <div class="word-en">${w.en}</div>
          <div class="word-ko">${w.ko}</div>
          <button class="btn sentence">🔊 This is ${w.art} ${w.en}.</button>`;
        card.querySelector('.hero').onclick = () => A.say(w);
        card.querySelector('.sentence').onclick = () => A.speak(`This is ${w.art} ${w.say}.`);
        card.querySelector('.word-en').onclick = () => A.say(w);
        const nav = el('div', 'nav');
        const prev = el('button', 'btn big', '◀');
        const next = el('button', 'btn big primary', i === ctx.words.length - 1 ? '끝! ⭐' : '▶');
        prev.disabled = i === 0;
        prev.onclick = () => { i--; draw(); };
        next.onclick = () => {
          if (i === ctx.words.length - 1) return ctx.finish(ctx.words.length, ctx.words.length);
          i++; draw();
        };
        nav.append(prev, next);
        ctx.stage.replaceChildren(card, nav);
        A.say(w);   // 카드가 나오면 소리가 바로 나온다
      };
      draw();
    },
  };

  A.games.pick = {
    name: '듣고 고르기', icon: '👂', level: 1, desc: '소리를 듣고 그림을 골라요',
    start(ctx) {
      const n = ctx.diff === 0 ? 3 : 4;
      A.rounds(ctx, (w, api) => {
        const grid = el('div', `choices n${n}`);
        A.choices(w, ctx, n).forEach(c => {
          const b = el('button', 'btn choice', img(c) + (ctx.diff >= 1 ? `<span class="lbl">${c.en}</span>` : ''));
          b.onclick = () => (c.id === w.id ? api.ok() : api.bad(b));
          grid.append(b);
        });
        ctx.stage.append(grid);
      });
    },
  };

  A.games.balloon = {
    name: '풍선 터뜨리기', icon: '🎈', level: 1, desc: '들리는 동물의 풍선을 눌러요',
    start(ctx) {
      const n = Math.min(5, 3 + ctx.diff);
      const colors = ['#ff6b81', '#ffb84d', '#5ad07a', '#4db8ff', '#b58cff'];
      A.rounds(ctx, (w, api) => {
        const sky = el('div', 'sky');
        A.choices(w, ctx, n).forEach((c, k) => {
          const b = el('button', 'balloon', img(c) + (ctx.diff >= 1 ? `<span class="lbl">${c.en}</span>` : ''));
          b.style.setProperty('--c', colors[k % colors.length]);
          b.style.setProperty('--d', `${(k * 0.45).toFixed(2)}s`);
          b.style.left = `${4 + k * (88 / n)}%`;
          b.style.top = `${8 + (k % 2) * 30}%`;
          b.onclick = () => {
            if (c.id !== w.id) return api.bad(b);
            b.classList.add('pop');
            api.ok();
          };
          sky.append(b);
        });
        ctx.stage.append(sky);
      });
    },
  };

  A.games.match = {
    name: '짝 맞추기', icon: '🧩', level: 1, desc: '같은 그림 두 장을 찾아요',
    start(ctx) {
      const pairs = Math.min(ctx.diff === 0 ? 3 : 4, Math.max(3, ctx.words.length));
      let base = ctx.words.slice(0, pairs);
      if (base.length < pairs) base = base.concat(A.shuffle(ctx.pool.filter(p => !base.includes(p))).slice(0, pairs - base.length));
      const deck = A.shuffle([...base, ...base].map((w, k) => ({ w, k })));
      const grid = el('div', 'memory');
      let open = [], matched = 0, mistakes = 0, busy = false;
      ctx.progress(0, pairs);
      A.target = null;
      deck.forEach(d => {
        const c = el('button', 'btn mcard', `<div class="face back">❓</div><div class="face front">${img(d.w)}</div>`);
        c.onclick = () => {
          if (busy || c.classList.contains('flip') || c.classList.contains('done')) return;
          c.classList.add('flip');
          A.say(d.w);   // 뒤집을 때마다 소리가 난다
          open.push({ c, d });
          if (open.length < 2) return;
          const [a, b] = open;
          open = [];
          if (a.d.w.id === b.d.w.id) {
            matched++;
            a.c.classList.add('done'); b.c.classList.add('done');
            A.burst(true);
            ctx.progress(matched, pairs);
            if (matched === pairs) {
              setTimeout(() => ctx.finish(Math.max(1, pairs - Math.min(pairs - 1, mistakes)), pairs), 900);
            }
          } else {
            mistakes++;
            busy = true;
            setTimeout(() => { a.c.classList.remove('flip'); b.c.classList.remove('flip'); busy = false; }, 900);
          }
        };
        grid.append(c);
      });
      ctx.stage.replaceChildren(grid);
    },
  };
})();
