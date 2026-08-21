/* ============================================================
   app.js — tiling-WM behaviour, boot sequence, interactive shell
   ============================================================ */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===========================================================
     1. Boot sequence
     =========================================================== */
  const BOOT_LINES_A = [
    ['    ', 0],
    ['<b>archbox</b> BIOS v2.19 — Phosphor Systems, Inc.', 40],
    ['Memory test: 65536K OK', 40],
    ['Detecting IDE drives ... <span class="ok">done</span>', 60],
    ['', 20],
    ['Booting from /dev/sda1 ...', 90],
    ['[    0.000000] Linux version 6.9.4-arch1 (sai@archbox)', 30],
    ['[    0.184213] Command line: root=/dev/sda1 rw quiet loglevel=3', 20],
    ['[    0.362901] CPU0: Python 3.12 · FastAPI · PostgreSQL 16', 25],
    ['[    0.518774] Loading module <i>langchain</i> ................ <span class="ok">[  OK  ]</span>', 55],
    ['[    0.702330] Loading module <i>google-adk</i> .............. <span class="ok">[  OK  ]</span>', 45],
    ['[    0.884019] Loading module <i>aws-bedrock</i> ............. <span class="ok">[  OK  ]</span>', 45],
    ['[    1.043882] Loading module <i>docker</i> .................. <span class="ok">[  OK  ]</span>', 40],
    ['[    1.201455] Mounting /dev/github (14 repositories) ..... <span class="ok">[  OK  ]</span>', 60],
    ['[    1.398772] traceguard: requirements trace verified, 0 findings', 45],
    ['[    1.560214] qsim: engines cross-verified to 2.2e-16', 45],
    ['[    1.741903] Starting portfolio.service ................. <span class="ok">[  OK  ]</span>', 70],
    ['[    1.889447] Starting geo-locate.service .................. <span class="ok">[  OK  ]</span>', 50],
  ];

  const BOOT_LINES_B = [
    ['', 30],
    ['Arch Linux 6.9.4-arch1 (tty1)', 60],
    ['', 20],
    ['archbox login: <b>sai</b>', 260],
    ['Password: <span class="f">••••••••</span>', 300],
    ['', 40],
    ['<span class="ok">Last login: today. Welcome back.</span>', 240],
  ];

  const boot = $('#boot');
  const bootLog = $('#bootLog');
  const bootSkip = $('#bootSkip');
  const galaxyWrap = $('#bootGalaxy');
  const galaxyCanvas = $('#galaxyCanvas');
  const galaxyLabel = $('#galaxyLabel');
  const galaxySub = $('#galaxySub');
  const shell = $('#shell');
  let booted = false;
  let bootTimer = null;
  let skipped = false;
  let galaxyStop = null;

  function finishBoot(instant) {
    if (booted) return;
    booted = true;
    clearTimeout(bootTimer);
    document.removeEventListener('keydown', skipOnKey);
    if (galaxyStop) {
      galaxyStop();
      galaxyStop = null;
    }
    galaxyWrap.hidden = true;
    const reveal = () => {
      boot.hidden = true;
      shell.hidden = false;
      shell.classList.add('is-in');
    };
    if (instant || reduced) reveal();
    else {
      boot.classList.add('is-out');
      setTimeout(reveal, 480);
    }
  }

  function skipOnKey(e) {
    if (e.key === 'Tab') return;
    skipped = true;
    finishBoot(true);
  }

  function runLines(lines, onDone) {
    let i = 0;
    const step = () => {
      if (skipped) {
        onDone();
        return;
      }
      if (i >= lines.length) {
        bootTimer = setTimeout(onDone, 180);
        return;
      }
      const [html, delay] = lines[i++];
      bootLog.insertAdjacentHTML('beforeend', html + '\n');
      bootLog.scrollTop = bootLog.scrollHeight;
      bootTimer = setTimeout(step, delay);
    };
    step();
  }

  const GEO_LOCK_LINE =
    '[    2.061880] geo: satellite fix acquired — <span class="ok">Stafford, TX (29.62°N, 95.56°W)</span>';

  function runBoot() {
    runLines(BOOT_LINES_A, () => {
      if (skipped) {
        finishBoot(true);
        return;
      }
      runGalaxy(() => {
        if (skipped) {
          finishBoot(true);
          return;
        }
        bootLog.insertAdjacentHTML('beforeend', GEO_LOCK_LINE + '\n');
        bootLog.scrollTop = bootLog.scrollHeight;
        runLines(BOOT_LINES_B, () => finishBoot(false));
      });
    });
  }

  /* ---- galaxy → earth → Stafford zoom sequence ---- */
  function runGalaxy(done) {
    if (reduced) {
      done();
      return;
    }
    galaxyWrap.hidden = false;
    const ctx = galaxyCanvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const w = galaxyWrap.clientWidth,
        h = galaxyWrap.clientHeight;
      galaxyCanvas.width = Math.max(1, w * dpr);
      galaxyCanvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const PHOS_MID = '#4ab962',
      AMBER = '#fbb336';

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
      r: Math.random() * 1.1 + 0.3,
      p: Math.random() * Math.PI * 2,
    }));

    const SEGMENTS = [
      { dur: 380, label: 'EARTH', sub: '3rd planet · locking orbit' },
      { dur: 340, label: 'NORTH AMERICA', sub: 'continent resolved' },
      { dur: 300, label: 'TEXAS', sub: 'state resolved' },
      { dur: 360, label: 'STAFFORD, TX', sub: '29.62°N 95.56°W · lock acquired' },
    ];
    const totalDur = SEGMENTS.reduce((a, s) => a + s.dur, 0);

    let segIndex = -1;
    let start = null;
    let raf = null;
    let cancelled = false;

    function ease(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function setLabel(seg) {
      galaxyLabel.textContent = seg.label;
      galaxySub.textContent = seg.sub;
      galaxyLabel.classList.remove('is-in');
      galaxySub.classList.remove('is-in');
      requestAnimationFrame(() => {
        galaxyLabel.classList.add('is-in');
        galaxySub.classList.add('is-in');
      });
    }

    function draw(idx, local, globalT) {
      const w = galaxyWrap.clientWidth,
        h = galaxyWrap.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#020503';
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2,
        cy = h / 2;

      const warp = Math.min(1, globalT * 1.6);
      stars.forEach((s) => {
        const tw = 0.5 + 0.5 * Math.sin(globalT * 9 + s.p);
        const k = 1 + warp * 1.6;
        const sx = cx + s.x * w * k;
        const sy = cy + s.y * h * k;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(207,222,209,' + (0.12 + 0.35 * tw) + ')';
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      const stageProgress = (idx + local) / SEGMENTS.length;
      const radius = 34 + stageProgress * Math.min(w, h) * 0.62;

      ctx.beginPath();
      ctx.fillStyle = 'rgba(25,92,46,0.32)';
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PHOS_MID;
      ctx.lineWidth = 1.3;
      ctx.stroke();

      ctx.strokeStyle = 'rgba(108,240,124,0.32)';
      ctx.lineWidth = 1;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius, radius * Math.abs(Math.cos(i * 0.5)), 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI + globalT * 0.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius * Math.abs(Math.sin(a)), radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      const tx = cx + (1 - stageProgress) * w * 0.16;
      const ty = cy - (1 - stageProgress) * h * 0.12;
      const reticle = 13 + stageProgress * 9;

      ctx.strokeStyle = AMBER;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(tx - reticle, ty);
      ctx.lineTo(tx - reticle * 0.4, ty);
      ctx.moveTo(tx + reticle * 0.4, ty);
      ctx.lineTo(tx + reticle, ty);
      ctx.moveTo(tx, ty - reticle);
      ctx.lineTo(tx, ty - reticle * 0.4);
      ctx.moveTo(tx, ty + reticle * 0.4);
      ctx.lineTo(tx, ty + reticle);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(251,179,54,0.5)';
      ctx.arc(tx, ty, reticle * 0.62, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = AMBER;
      ctx.arc(tx, ty, 2, 0, Math.PI * 2);
      ctx.fill();

      if (idx === SEGMENTS.length - 1 && local > 0.55) {
        const flash = (local - 0.55) / 0.45;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(108,240,124,' + flash + ')';
        ctx.lineWidth = 2;
        ctx.arc(tx, ty, reticle * (1.5 + flash * 0.5), 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function frame(ts) {
      if (cancelled) return;
      if (!start) start = ts;
      const elapsed = ts - start;
      let acc = 0,
        idx = 0,
        local = 0,
        found = false;
      for (; idx < SEGMENTS.length; idx++) {
        if (elapsed < acc + SEGMENTS[idx].dur) {
          local = (elapsed - acc) / SEGMENTS[idx].dur;
          found = true;
          break;
        }
        acc += SEGMENTS[idx].dur;
      }
      if (!found) {
        stop();
        done();
        return;
      }
      if (idx !== segIndex) {
        segIndex = idx;
        setLabel(SEGMENTS[idx]);
      }
      draw(idx, Math.min(1, Math.max(0, local)), Math.min(1, elapsed / totalDur));
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      galaxyWrap.hidden = true;
      galaxyLabel.classList.remove('is-in');
      galaxySub.classList.remove('is-in');
    }

    galaxyStop = stop;
    raf = requestAnimationFrame(frame);
  }

  bootSkip.addEventListener('click', () => {
    skipped = true;
    finishBoot(true);
  });

  function startBootSequence() {
    boot.hidden = false;
    document.addEventListener('keydown', skipOnKey);
    if (reduced) finishBoot(true);
    else runBoot();
  }

  /* ===========================================================
     1b. Cinematic anime intro — piano room → desk → zoom into screen
     =========================================================== */
  const animeIntro = $('#animeIntro');
  const aiRope = $('#aiRope');
  const themeAudio = $('#themeAudio');
  const musicToggle = $('#musicToggle');
  const musicLabel = $('#musicLabel');
  const MUSIC_VOLUME = 0.55;
  let audioMuted = false;
  let audioArmed = false;

  function fadeVolume(el, to, duration, done) {
    const from = el.volume;
    const t0 = performance.now();
    function step(ts) {
      const t = Math.min(1, (ts - t0) / duration);
      el.volume = from + (to - from) * t;
      if (t < 1) requestAnimationFrame(step);
      else if (done) done();
    }
    requestAnimationFrame(step);
  }

  function armAudio() {
    if (audioArmed || audioMuted || !themeAudio) return;
    const playing = themeAudio.play();
    if (playing && playing.then) {
      playing
        .then(() => {
          audioArmed = true;
          fadeVolume(themeAudio, MUSIC_VOLUME, 1200);
        })
        .catch(() => {
          /* still blocked — wait for a real user gesture */
        });
    } else {
      audioArmed = true;
      fadeVolume(themeAudio, MUSIC_VOLUME, 1200);
    }
  }

  function armAudioOnGesture() {
    armAudio();
    if (audioArmed) {
      document.removeEventListener('pointerdown', armAudioOnGesture);
      document.removeEventListener('keydown', armAudioOnGesture);
    }
  }
  if (themeAudio) {
    themeAudio.volume = 0;
    document.addEventListener('pointerdown', armAudioOnGesture);
    document.addEventListener('keydown', armAudioOnGesture);
    armAudio();
  }

  if (musicToggle && themeAudio) {
    musicToggle.addEventListener('click', () => {
      audioMuted = !audioMuted;
      musicToggle.classList.toggle('is-muted', audioMuted);
      musicToggle.setAttribute('aria-pressed', String(!audioMuted));
      if (musicLabel) musicLabel.textContent = audioMuted ? 'Turn on music' : 'Turn off music';
      if (audioMuted) {
        fadeVolume(themeAudio, 0, 500, () => themeAudio.pause());
      } else {
        audioArmed = true;
        const playing = themeAudio.play();
        if (playing && playing.catch) playing.catch(() => {});
        fadeVolume(themeAudio, MUSIC_VOLUME, 1200);
      }
    });
  }

  const AI_PHASE_DURATIONS = {
    lighting: 1700,
    standing: 2200,
    walking: 2400,
    desk: 2500,
    zoomScreen: 1900,
  };
  let introDone = false;
  let aiPhaseTimer = null;

  function endIntro() {
    if (introDone) return;
    introDone = true;
    clearTimeout(aiPhaseTimer);
    if (!animeIntro) {
      startBootSequence();
      return;
    }
    animeIntro.classList.add('is-out');
    setTimeout(() => {
      animeIntro.hidden = true;
      startBootSequence();
    }, reduced ? 0 : 560);
  }

  function advanceAiPhase(queue) {
    if (introDone) return;
    if (!queue.length) {
      endIntro();
      return;
    }
    const phase = queue[0];
    const rest = queue.slice(1);
    animeIntro.dataset.phase = phase;
    const dur = AI_PHASE_DURATIONS[phase];
    if (!dur) return;
    aiPhaseTimer = setTimeout(() => advanceAiPhase(rest), dur);
  }

  if (!animeIntro || reduced) {
    if (animeIntro) animeIntro.hidden = true;
    startBootSequence();
  } else {
    if (aiRope) {
      aiRope.addEventListener('click', () => {
        if (animeIntro.dataset.phase !== 'dark') return;
        armAudio();
        advanceAiPhase(['lighting', 'standing', 'walking', 'desk', 'zoomScreen']);
      });
    }
    document.addEventListener('keydown', (e) => {
      if (animeIntro.hidden || e.key !== 'Escape') return;
      endIntro();
    });
  }

  /* ===========================================================
     2. Static content rendering
     =========================================================== */

  // hero ASCII
  const heroArt = $('#heroArt');
  heroArt.innerHTML =
    ASCII_SAI.split('\n')
      .map((l) => '<span>' + esc(l) + '</span>')
      .join('') +
    ASCII_PRASANTH.split('\n')
      .map((l) => '<span class="lo">' + esc(l) + '</span>')
      .join('');

  $('#heroTag').textContent = IDENTITY.tagline;
  $('#tux').textContent = TUX;

  $('#neoList').innerHTML = NEOFETCH.map(
    ([k, v]) =>
      '<div class="neo__row"><dt>' +
      esc(k) +
      '</dt><dd>' +
      esc(v) +
      '</dd></div>'
  ).join('');

  // git log
  $('#logList').innerHTML = ACTIVITY.map(
    (c) =>
      '<div class="log__row"><span class="log__h">' +
      esc(c.h) +
      '</span><span class="log__d">' +
      esc(c.d) +
      '</span><span class="log__m"><b>' +
      esc(c.r) +
      '</b> — ' +
      esc(c.m) +
      '</span></div>'
  ).join('');

  /* ---------- projects ---------- */
  const authored = PROJECTS.filter((p) => p.featured);
  const other = PROJECTS.filter((p) => !p.featured);
  const lsList = $('#lsList');
  $('#lsCount').textContent = PROJECTS.length + ' dirs';

  function lsRow(p, i) {
    return (
      '<button class="ls__item" type="button" role="option" data-slug="' +
      p.slug +
      '" data-i="' +
      i +
      '" aria-selected="false">' +
      '<span class="ls__name"><b>' +
      esc(p.file) +
      '/</b><span>' +
      esc(
        [p.lang]
          .concat(
            p.tags.filter((t) => t.toLowerCase() !== p.lang.toLowerCase()).slice(0, 2)
          )
          .join(' · ')
      ) +
      '</span></span>' +
      '<span class="ls__meta">' +
      esc(p.size) +
      '<br />' +
      esc(p.date) +
      '</span></button>'
    );
  }

  let idx = 0;
  const ordered = authored.concat(other);
  lsList.innerHTML =
    '<div class="ls__head"><span>drwxr-xr-x  sai  staff</span><span>' +
    PROJECTS.length +
    ' items</span></div>' +
    '<div class="ls__sep">featured — authored</div>' +
    authored.map((p, i) => lsRow(p, i)).join('') +
    '<div class="ls__sep">also in ~/projects</div>' +
    other.map((p, i) => lsRow(p, authored.length + i)).join('');

  const detailBody = $('#detailBody');
  const detailTitle = $('#detailTitle');

  function renderBlocks(body) {
    return body
      .map((b) => {
        if (b.t === 'p') return '<p>' + esc(b.v) + '</p>';
        if (b.t === 'h') return '<h3>' + esc(b.v.replace(/^#\s*/, '')) + '</h3>';
        if (b.t === 'code') return '<pre class="block">' + esc(b.v) + '</pre>';
        if (b.t === 'list')
          return '<ul>' + b.v.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>';
        if (b.t === 'kv')
          return (
            '<dl class="kv">' +
            b.v
              .map(([k, v]) => '<dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd>')
              .join('') +
            '</dl>'
          );
        return '';
      })
      .join('');
  }

  function selectProject(i, scroll) {
    idx = (i + ordered.length) % ordered.length;
    const p = ordered[idx];
    $$('.ls__item', lsList).forEach((el) =>
      el.setAttribute('aria-selected', String(Number(el.dataset.i) === idx))
    );
    detailTitle.innerHTML = '<b>less</b> ~/projects/' + esc(p.file) + '/README.md';
    detailBody.innerHTML =
      '<div class="detail">' +
      '<p class="cmd">cd ~/projects/<b>' +
      esc(p.file) +
      '</b> && less README.md</p>' +
      '<div class="detail__h"><h2>' +
      esc(p.title) +
      '</h2><p>' +
      esc(p.blurb) +
      '</p>' +
      '<div class="chips">' +
      p.tags.map((t) => '<span class="chip">' + esc(t) + '</span>').join('') +
      '</div></div>' +
      '<div class="detail__body prose">' +
      renderBlocks(p.body) +
      '</div>' +
      '<div class="cta-row">' +
      '<a class="btn btn--go" href="' +
      p.url +
      '" target="_blank" rel="noopener noreferrer">source ↗</a>' +
      (p.demo
        ? '<a class="btn" href="' +
          p.demo +
          '" target="_blank" rel="noopener noreferrer">live demo ↗</a>'
        : '') +
      '</div></div>';
    detailBody.scrollTop = 0;
    if (scroll) {
      const el = lsList.querySelector('[data-i="' + idx + '"]');
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }

  lsList.addEventListener('click', (e) => {
    const btn = e.target.closest('.ls__item');
    if (btn) selectProject(Number(btn.dataset.i), false);
  });
  selectProject(0, false);

  /* ---------- stack ---------- */
  const wsStack = $('#ws-stack');
  wsStack.innerHTML = STACK.map(
    (g) =>
      '<article class="pane"><div class="pane__bar">' +
      '<span class="pane__dots"><i></i><i></i><i></i></span>' +
      '<span class="pane__title"><b>pacman</b> -Qe ' +
      esc(g.group) +
      '</span>' +
      '<span class="pane__tag">' +
      g.items.length +
      ' pkgs</span></div>' +
      '<div class="pane__body"><div class="pkg">' +
      g.items
        .map(
          (it) =>
            '<div class="pkg__row"><div class="pkg__top">' +
            '<span class="pkg__n">' +
            esc(it.n) +
            '</span><span class="pkg__v">' +
            esc(it.v) +
            '</span></div>' +
            '<div class="pkg__bar" data-p="' +
            it.p +
            '" aria-hidden="true">' +
            Array.from({ length: 20 }, () => '<i></i>').join('') +
            '</div></div>'
        )
        .join('') +
      '</div></div></article>'
  ).join('');

  let barsFilled = false;
  function fillBars() {
    if (barsFilled) return;
    barsFilled = true;
    $$('.pkg__bar').forEach((bar, bi) => {
      const cells = $$('i', bar);
      const n = Math.round((Number(bar.dataset.p) / 100) * cells.length);
      cells.forEach((c, i) => {
        if (i >= n) return;
        const apply = () => c.classList.add(i >= n - 2 ? 'hi' : 'on');
        if (reduced) apply();
        else setTimeout(apply, bi * 45 + i * 22);
      });
    });
  }

  /* ---------- about ---------- */
  $('#aboutBody').innerHTML = renderBlocks(ABOUT);
  $('#tlList').innerHTML = TIMELINE.map(
    (t) =>
      '<div class="tl__row"><span class="tl__y">' +
      esc(t.y) +
      '</span><span class="tl__v">' +
      esc(t.v) +
      '</span></div>'
  ).join('');

  /* ---------- contact ---------- */
  $('#mailArt').textContent = [
    '+-------------------------------------------+',
    '|\\                                         /|',
    '| \\                                       / |',
    '|  \\                                     /  |',
    '|   \\___________________________________/   |',
    '|                                           |',
    '|   sai prasanth . backend & ai engineer    |',
    '|   prasanthgrandhisiri@gmail.com           |',
    '+-------------------------------------------+',
  ].join('\n');

  $('#fingerKv').innerHTML = [
    ['Login', IDENTITY.user],
    ['Name', IDENTITY.name],
    ['Role', IDENTITY.role],
    ['Location', IDENTITY.location],
    ['Shell', '/bin/zsh'],
    ['Plan', 'Building agents that survive contact with production.'],
  ]
    .map(([k, v]) => '<dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd>')
    .join('');

  $('#availability').innerHTML =
    '<h3>good fits</h3>' +
    '<ul>' +
    [
      'Agent systems that need to be reliable, observable and auditable — not demos.',
      'Python and FastAPI backends with PostgreSQL, plus the ETL feeding them.',
      'Taking a working prototype and giving it tests, types, CI and a Dockerfile.',
      'Traceability and evidence tooling for regulated or safety-critical programmes.',
    ]
      .map((x) => '<li>' + esc(x) + '</li>')
      .join('') +
    '</ul>';

  $('#signature').innerHTML =
    '<p class="cmd">cat ~/.signature</p>' +
    '<pre class="block">-- \n' +
    esc(IDENTITY.name) +
    '\n' +
    esc(IDENTITY.role) +
    '\n' +
    esc(IDENTITY.location) +
    '\n\nkey  1F3C 02A7 B9E4 15C4  D8A7 72E6 B930 9FA1\nttl  replies usually inside 24h\n</pre>';

  const LINKS = [
    ['github', IDENTITY.handle, IDENTITY.github],
    ['email', IDENTITY.email, 'mailto:' + IDENTITY.email],
    ['repos', '14 public repositories', IDENTITY.github + '?tab=repositories'],
    ['live', 'coffee-shop-ecru-gamma.vercel.app', 'https://coffee-shop-ecru-gamma.vercel.app'],
  ];
  $('#linkList').innerHTML = LINKS.map(
    ([k, v, href]) =>
      '<a class="link-row" href="' +
      href +
      '"' +
      (href.indexOf('mailto:') === 0
        ? ''
        : ' target="_blank" rel="noopener noreferrer"') +
      '><span class="link-row__k">' +
      esc(k) +
      '</span><span class="link-row__v">' +
      esc(v) +
      '</span><span class="link-row__go">open ↗</span></a>'
  ).join('');

  /* ===========================================================
     3. Workspace switching
     =========================================================== */
  const WS = ['home', 'projects', 'stack', 'about', 'contact'];
  const WS_LABEL = { home: '~', projects: 'projects', stack: 'stack', about: 'about', contact: 'contact' };
  let current = 'home';

  function go(name) {
    if (WS.indexOf(name) === -1 || name === current) {
      if (WS.indexOf(name) === -1) return false;
    }
    current = name;
    $$('.ws').forEach((s) => s.classList.toggle('is-active', s.id === 'ws-' + name));
    $$('.ws-btn').forEach((b) =>
      b.setAttribute('aria-current', String(b.dataset.ws === name))
    );
    $('#hintWs').textContent = 'ws: ' + WS_LABEL[name];
    if (name === 'stack') fillBars();
    return true;
  }

  $('#wsList').addEventListener('click', (e) => {
    const b = e.target.closest('.ws-btn');
    if (b) go(b.dataset.ws);
  });
  $$('[data-goto]').forEach((b) =>
    b.addEventListener('click', () => go(b.dataset.goto))
  );

  /* ===========================================================
     4. Keyboard navigation
     =========================================================== */
  const ttyIn = $('#ttyIn');
  document.addEventListener('keydown', (e) => {
    if (!booted) return;
    const typing = e.target === ttyIn;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === '/' && !typing) {
      e.preventDefault();
      go('home');
      ttyIn.focus();
      return;
    }
    if (e.key === 'Escape' && typing) {
      ttyIn.blur();
      return;
    }
    if (typing) return;

    if (e.key >= '1' && e.key <= '5') {
      e.preventDefault();
      go(WS[Number(e.key) - 1]);
      return;
    }
    if (current === 'projects' && (e.key === 'j' || e.key === 'ArrowDown')) {
      e.preventDefault();
      selectProject(idx + 1, true);
    }
    if (current === 'projects' && (e.key === 'k' || e.key === 'ArrowUp')) {
      e.preventDefault();
      selectProject(idx - 1, true);
    }
  });

  /* ===========================================================
     5. Interactive shell
     =========================================================== */
  const out = $('#ttyOut');
  const form = $('#ttyForm');
  const history = [];
  let hIdx = -1;

  function write(html) {
    out.insertAdjacentHTML('beforeend', html + '\n');
    out.scrollTop = out.scrollHeight;
  }
  function echo(cmd) {
    write('<span class="p">sai@archbox:~$</span> <span class="w">' + esc(cmd) + '</span>');
  }

  const COMMANDS = {
    help() {
      return (
        '<span class="a">available commands</span>\n' +
        [
          ['help', 'this list'],
          ['whoami', 'identity summary'],
          ['ls', 'list projects'],
          ['cat <project>', 'open a project readme'],
          ['stack', 'skills and tooling'],
          ['about', 'the long version'],
          ['contact', 'email and links'],
          ['neofetch', 'system card'],
          ['github', 'open github in a new tab'],
          ['date', 'current time'],
          ['clear', 'clear this terminal'],
          ['sudo', 'do not'],
        ]
          .map(([c, d]) => '  <span class="p">' + c.padEnd(16) + '</span><span class="f">' + d + '</span>')
          .join('\n') +
        '\n<span class="f">tip: press 1–5 to switch workspaces.</span>'
      );
    },
    whoami() {
      return (
        '<span class="w">' +
        IDENTITY.name +
        '</span> — ' +
        IDENTITY.role +
        '\n' +
        IDENTITY.tagline +
        '\n<span class="f">' +
        IDENTITY.location +
        ' · github/' +
        IDENTITY.handle +
        '</span>'
      );
    },
    ls() {
      go('projects');
      return (
        'total ' +
        PROJECTS.length +
        '\n' +
        ordered
          .map(
            (p) =>
              '<span class="f">' +
              p.perms +
              '</span>  <span class="p">' +
              p.file.padEnd(30) +
              '</span><span class="f">' +
              p.lang +
              '</span>'
          )
          .join('\n') +
        '\n<span class="a">→ opened workspace 2:projects</span>'
      );
    },
    cat(arg) {
      if (!arg) return '<span class="e">cat: missing operand</span>\n<span class="f">usage: cat &lt;project&gt; — try `ls` first</span>';
      const q = arg.toLowerCase().replace(/\/$/, '');
      const i = ordered.findIndex(
        (p) => p.slug === q || p.file.toLowerCase() === q || p.title.toLowerCase() === q
      );
      if (i === -1)
        return '<span class="e">cat: ' + esc(arg) + ': No such file or directory</span>';
      go('projects');
      selectProject(i, true);
      return (
        '<span class="a">→ ' +
        esc(ordered[i].title) +
        '</span> opened in the README pane.'
      );
    },
    stack() {
      go('stack');
      return (
        STACK.map(
          (g) =>
            '<span class="p">' +
            g.group +
            '</span>: <span class="f">' +
            g.items.map((i) => i.n).join(', ') +
            '</span>'
        ).join('\n') + '\n<span class="a">→ opened workspace 3:stack</span>'
      );
    },
    about() {
      go('about');
      return '<span class="a">→ opened workspace 4:about</span>\n<span class="f">' + esc(ABOUT[1].v.slice(0, 150)) + '…</span>';
    },
    contact() {
      go('contact');
      return (
        '<span class="p">email </span>' +
        IDENTITY.email +
        '\n<span class="p">github</span> ' +
        IDENTITY.github +
        '\n<span class="a">→ opened workspace 5:contact</span>'
      );
    },
    neofetch() {
      go('home');
      return NEOFETCH.map(
        ([k, v]) => '<span class="p">' + k.padEnd(10) + '</span><span class="f">' + esc(v) + '</span>'
      ).join('\n');
    },
    github() {
      window.open(IDENTITY.github, '_blank', 'noopener');
      return '<span class="a">opening ' + IDENTITY.github + ' …</span>';
    },
    date() {
      return new Date().toString();
    },
    clear() {
      out.innerHTML = '';
      return null;
    },
    sudo() {
      return '<span class="e">sai is not in the sudoers file. This incident has been reported.</span>';
    },
    exit() {
      return '<span class="f">there is no exit. try `help`.</span>';
    },
    pwd() {
      return '/home/sai';
    },
    uname() {
      return 'Linux archbox 6.9.4-arch1 x86_64 GNU/Linux';
    },
  };
  COMMANDS.projects = COMMANDS.ls;
  COMMANDS.skills = COMMANDS.stack;
  COMMANDS.man = COMMANDS.help;
  COMMANDS['?'] = COMMANDS.help;

  function run(raw) {
    const line = raw.trim();
    if (!line) return;
    echo(line);
    history.push(line);
    hIdx = history.length;
    const parts = line.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');
    if (COMMANDS[cmd]) {
      const res = COMMANDS[cmd](arg);
      if (res) write(res);
    } else {
      write(
        '<span class="e">zsh: command not found: ' +
          esc(cmd) +
          '</span>\n<span class="f">type `help` for what this shell knows.</span>'
      );
    }
    write('');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    run(ttyIn.value);
    ttyIn.value = '';
  });

  ttyIn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hIdx > 0) ttyIn.value = history[--hIdx];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIdx < history.length - 1) ttyIn.value = history[++hIdx];
      else {
        hIdx = history.length;
        ttyIn.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const v = ttyIn.value.trim().toLowerCase();
      if (!v) return;
      const m = Object.keys(COMMANDS).filter((k) => k.indexOf(v) === 0);
      if (m.length === 1) ttyIn.value = m[0] + ' ';
      else if (m.length > 1) {
        echo(ttyIn.value);
        write('<span class="f">' + m.join('  ') + '</span>\n');
      }
    }
  });

  $('#ttyPane').addEventListener('click', (e) => {
    if (!e.target.closest('a, button')) ttyIn.focus();
  });

  // quick command chips
  const QUICK = ['help', 'whoami', 'ls', 'stack', 'about', 'contact', 'neofetch', 'sudo'];
  const quick = $('#ttyQuick');
  quick.innerHTML = QUICK.map(
    (c) => '<button class="qbtn" type="button" data-cmd="' + c + '">' + c + '</button>'
  ).join('');
  quick.addEventListener('click', (e) => {
    const b = e.target.closest('.qbtn');
    if (!b) return;
    run(b.dataset.cmd);
    ttyIn.focus();
  });

  // shell greeting
  write(
    '<span class="f">zsh 5.9 — this shell actually works.</span>\n' +
      '<span class="p">sai@archbox</span> <span class="f">·</span> type <span class="a">help</span> to see what it knows, or <span class="a">ls</span> to list projects.\n'
  );

  /* ===========================================================
     6. Status bar widgets
     =========================================================== */
  const clock = $('#clock');
  function tick() {
    let t;
    try {
      t = new Date().toLocaleTimeString('en-GB', {
        timeZone: 'America/Chicago',
        hour12: false,
      });
    } catch (err) {
      t = new Date().toTimeString().slice(0, 8);
    }
    clock.textContent = t + ' CT';
  }
  tick();
  setInterval(tick, 1000);

  const meter = $('#meterCpu');
  meter.innerHTML = Array.from({ length: 8 }, () => '<i style="height:20%"></i>').join('');
  const cells = $$('i', meter);
  if (!reduced) {
    setInterval(() => {
      cells.forEach((c) => {
        const h = 20 + Math.random() * 80;
        c.style.height = h + '%';
        c.classList.toggle('hot', h > 72);
      });
    }, 1400);
  } else {
    cells.forEach((c, i) => (c.style.height = 25 + i * 8 + '%'));
  }
})();
