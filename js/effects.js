/* ==========================================================================
   EFFECTS — alle beweging op de site
   GSAP (+ ScrollTrigger, SplitText) en Lenis, plus nagebouwde React Bits-
   effecten: Aurora, SplitText, DecryptedText, ScrollReveal, ScrollVelocity,
   CircularText, Magnet, SpotlightCard, TiltedCard, CountUp, ClickSpark.
   ========================================================================== */
(function () {
  const html = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Achtergrond-shader draait altijd (bij reduced motion als stilstaand beeld)
  initAurora();

  if (!window.gsap || reduce) {
    html.classList.add('no-anim');
    window.__fx = false;
    initStaticFallbacks();
    return;
  }
  window.__fx = true;
  gsap.registerPlugin(ScrollTrigger, SplitText);

  /* ---------- Lenis: vloeiend scrollen ---------- */
  const lenis = new Lenis({ lerp: 0.085, anchors: { offset: -80 } });
  window.lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.addEventListener('lock', (e) => (e.detail ? lenis.stop() : lenis.start()));

  /* ---------- Paginaovergang (curtain) ---------- */
  const curtain = $('.curtain');
  const intro = gsap.timeline({ defaults: { ease: 'expo.inOut' } });
  intro.set(curtain, { yPercent: 0 })
    .to('.curtain span', { yPercent: -40, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.05)
    .to(curtain, { yPercent: -100, duration: 1 }, 0.15);

  window.navigateTo = (href) => {
    gsap.set('.curtain span', { yPercent: 40, opacity: 0 });
    gsap.timeline({ onComplete: () => { location.href = href; } })
      .fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut' })
      .to('.curtain span', { yPercent: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, 0.4);
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.protocol === 'mailto:') return;
    if (url.pathname === location.pathname) {
      if (url.hash) return; // anker op dezelfde pagina: Lenis regelt het
      e.preventDefault();
      lenis.scrollTo(0);
      return;
    }
    e.preventDefault();
    window.navigateTo(url.href);
  });
  window.addEventListener('pageshow', (e) => { if (e.persisted) gsap.set(curtain, { yPercent: -100 }); });

  /* ---------- Navigatie ---------- */
  const nav = $('#nav');
  const progress = $('.scroll-progress');
  let lastY = 0;
  lenis.on('scroll', ({ scroll, limit }) => {
    gsap.set(progress, { scaleX: limit ? scroll / limit : 0 });
    const down = scroll > lastY && scroll > 200;
    if (!document.body.classList.contains('menu-open')) nav.classList.toggle('hidden', down);
    lastY = scroll;
  });

  const pill = $('.nav-pill');
  const indicator = $('.nav-indicator');
  if (pill && indicator) {
    const moveTo = (a, instant) => {
      if (!a) { gsap.to(indicator, { opacity: 0, duration: 0.3 }); return; }
      const r = a.getBoundingClientRect();
      const p = pill.getBoundingClientRect();
      gsap.to(indicator, { x: r.left - p.left, width: r.width, opacity: 1, duration: instant ? 0 : 0.5, ease: 'expo.out' });
    };
    const active = $('a.active', pill);
    requestAnimationFrame(() => moveTo(active, true));
    $$('a', pill).forEach((a) => a.addEventListener('mouseenter', () => moveTo(a)));
    pill.addEventListener('mouseleave', () => moveTo(active));
    window.addEventListener('resize', () => moveTo(active, true));
  }

  /* ---------- Mobiel menu ---------- */
  const overlay = $('#menuOverlay');
  const menuTl = gsap.timeline({ paused: true })
    .set(overlay, { visibility: 'visible' })
    .fromTo(overlay, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.inOut' })
    .from('#menuOverlay nav a span, #menuOverlay nav a small', { yPercent: 110, duration: 0.8, stagger: 0.04, ease: 'expo.out' }, 0.35)
    .from('#menuOverlay .menu-foot', { opacity: 0, duration: 0.4 }, 0.6);
  document.addEventListener('menutoggle', (e) => {
    if (e.detail) { lenis.stop(); nav.classList.remove('hidden'); menuTl.timeScale(1).play(); }
    else { lenis.start(); menuTl.timeScale(1.6).reverse(); }
  });

  /* ---------- SplitText-koppen ---------- */
  function splitIn(el, delay = 0) {
    const split = new SplitText(el, { type: 'lines,words,chars', mask: 'lines', linesClass: 'split-line' });
    gsap.set(el, { visibility: 'visible' });
    return gsap.from(split.chars, {
      yPercent: 115, rotate: 6, duration: 1.1, ease: 'expo.out', stagger: 0.022, delay,
    });
  }
  document.fonts.ready.then(() => {
    $$('[data-split]').forEach((el) => {
      if (el.hasAttribute('data-split-intro')) {
        const tl = splitIn(el, 0.75 + (+el.dataset.splitDelay || 0));
        return tl;
      }
      const split = new SplitText(el, { type: 'lines,words,chars', mask: 'lines' });
      gsap.set(el, { visibility: 'visible' });
      gsap.from(split.chars, {
        yPercent: 115, duration: 1, ease: 'expo.out', stagger: 0.018,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
    ScrollTrigger.refresh();
  });

  /* ---------- Fade-up bij scrollen ---------- */
  function revealBatch(els) {
    gsap.set(els, { opacity: 0, y: 40 });
    ScrollTrigger.batch(els, {
      start: 'top 90%',
      once: true,
      onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, overwrite: true }),
    });
  }
  const introReveals = $$('[data-reveal-intro]');
  gsap.set(introReveals, { opacity: 0, y: 30 });
  gsap.to(introReveals, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1, delay: 1.05 });
  revealBatch($$('[data-reveal]:not([data-reveal-intro])'));

  /* ---------- ScrollReveal: woorden lichten op tijdens scrollen ---------- */
  $$('[data-scroll-reveal]').forEach((el) => {
    const split = new SplitText(el, { type: 'words', wordsClass: 'word' });
    gsap.set(el, { opacity: 1 });
    gsap.fromTo(split.words, { opacity: 0.12, filter: 'blur(6px)' }, {
      opacity: 1, filter: 'blur(0px)', ease: 'none', stagger: 0.05,
      scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 45%', scrub: true },
    });
  });

  /* ---------- DecryptedText ---------- */
  $$('[data-decrypt]').forEach((el) => {
    const words = JSON.parse(el.dataset.decrypt);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*<>/';
    let i = 0;
    function show(target) {
      const len = target.length;
      const state = { p: 0 };
      gsap.to(state, {
        p: 1, duration: 1.1, ease: 'power2.out',
        onUpdate() {
          const done = Math.floor(state.p * len);
          let out = '';
          for (let k = 0; k < len; k++) {
            if (k < done || target[k] === ' ') out += target[k];
            else out += `<span class="enc">${chars[(Math.random() * chars.length) | 0]}</span>`;
          }
          el.innerHTML = out;
        },
        onComplete() { el.textContent = target; gsap.delayedCall(2.4, next); },
      });
    }
    function next() { i = (i + 1) % words.length; show(words[i]); }
    gsap.delayedCall(1.6, () => show(words[0]));
  });

  /* ---------- CircularText ---------- */
  $$('[data-circular]').forEach((svg) => {
    const spin = gsap.to(svg, { rotation: 360, duration: 22, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
    const host = svg.closest('.portrait') || svg;
    host.addEventListener('mouseenter', () => gsap.to(spin, { timeScale: 5, duration: 0.6 }));
    host.addEventListener('mouseleave', () => gsap.to(spin, { timeScale: 1, duration: 1 }));
  });

  /* ---------- ScrollVelocity-marquee ---------- */
  $$('[data-velocity]').forEach((row) => {
    const dir = +row.dataset.velocity || 1;
    const inner = row.innerHTML;
    row.innerHTML = inner + inner + inner + inner;
    let x = 0;
    let w = row.scrollWidth / 4;
    window.addEventListener('resize', () => { w = row.scrollWidth / 4; });
    gsap.ticker.add((t, dt) => {
      const v = lenis.velocity || 0;
      const speed = (1.2 + Math.min(Math.abs(v), 60) * 0.35) * dir * (v < 0 ? -1 : 1);
      x -= speed * (dt / 16.67);
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      row.style.transform = `translate3d(${x}px,0,0)`;
    });
  });

  /* ---------- Parallax ---------- */
  $$('[data-parallax]').forEach((el) => {
    gsap.to(el, {
      yPercent: +el.dataset.parallax || -20, ease: 'none',
      scrollTrigger: { trigger: el.closest('section') || el, start: 'top top', end: 'bottom top', scrub: true },
    });
  });
  const heroContent = $('.hero-copy');
  if (heroContent) {
    gsap.to(heroContent, {
      yPercent: -18, opacity: 0.2, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  /* ---------- CountUp ---------- */
  $$('[data-count]').forEach((el) => {
    const to = +el.dataset.count;
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(obj, { v: to, duration: 2, ease: 'expo.out', onUpdate: () => { el.textContent = Math.round(obj.v); } }),
    });
  });

  /* ---------- Tijdlijn tekent zichzelf ---------- */
  const tl = $('#timeline');
  if (tl) {
    gsap.to('.timeline-fill', {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: tl, start: 'top 70%', end: 'bottom 60%', scrub: true },
    });
  }

  /* ---------- Minor: horizontale reis ---------- */
  const track = $('#journeyTrack');
  if (track) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', () => {
      const dist = () => track.scrollWidth - window.innerWidth;
      const steps = $$('#journeySteps span');
      const tween = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: '.journey-pin', pin: true, scrub: 0.8, start: 'top top',
          end: () => '+=' + dist(), invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set('.journey-bar-fill', { scaleX: self.progress });
            const idx = Math.min(steps.length - 1, Math.round(self.progress * (steps.length - 1)));
            steps.forEach((s, i) => s.classList.toggle('on', i <= idx));
          },
        },
      });
      $$('.phase').forEach((ph) => {
        gsap.from(ph.querySelectorAll('.phase-title, .phase-body'), {
          y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.1,
          scrollTrigger: { trigger: ph, containerAnimation: tween, start: 'left 75%', once: true },
        });
      });
      return () => gsap.set(track, { clearProps: 'transform' });
    });
    mm.add('(max-width: 900px)', () => { revealBatch($$('.phase')); });
  }

  /* ---------- Ideeën ---------- */
  const bar = $('#ideaProgress i');
  if (bar) {
    ScrollTrigger.create({
      trigger: bar, start: 'top 95%', once: true,
      onEnter: () => gsap.to(bar, { width: bar.dataset.to + '%', duration: 1.6, ease: 'expo.out' }),
    });
  }
  let firstDraw = true;
  function animateIdeas() {
    gsap.from('#board .idea', { y: 30, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05, delay: firstDraw ? 0.9 : 0 });
    firstDraw = false;
  }
  if ($('#board')) animateIdeas();
  document.addEventListener('ideasdrawn', animateIdeas);
  document.addEventListener('filtered', (e) => {
    gsap.fromTo(e.detail, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.06 });
    ScrollTrigger.refresh();
  });

  /* ---------- Modal ---------- */
  document.addEventListener('modal', (e) => {
    const m = e.detail.el;
    const sheet = $('.modal-frame', m);
    const back = $('.modal-backdrop', m);
    if (e.detail.open) {
      lenis.stop();
      gsap.timeline()
        .fromTo(back, { opacity: 0 }, { opacity: 1, duration: 0.5 })
        .fromTo(sheet, { yPercent: 100 }, { yPercent: 0, duration: 0.9, ease: 'expo.out' }, 0)
        .from(sheet.querySelectorAll('.eyebrow, .modal-title, .lead, .work-tags, .modal-media, .modal-section'), { y: 30, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05 }, 0.25);
    } else {
      gsap.timeline({ onComplete: () => { m.classList.remove('open'); lenis.start(); } })
        .to(sheet, { yPercent: 100, duration: 0.55, ease: 'expo.in' })
        .to(back, { opacity: 0, duration: 0.4 }, 0.15);
    }
  });

  /* ---------- Hover-effecten (alleen met muis) ---------- */
  if (finePointer) {
    // Magnet
    $$('[data-magnet]').forEach((el) => {
      const s = +el.dataset.magnet || 0.35;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * s);
        yTo((e.clientY - r.top - r.height / 2) * s);
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' });
      });
    });

    // Spotlight + Tilt (event delegation, werkt ook voor later getekende kaarten)
    let cur = null;
    let rx = null; let ry = null;
    document.addEventListener('pointermove', (e) => {
      const el = e.target.closest('[data-tilt], [data-spotlight]');
      if (el !== cur) {
        if (cur && cur.hasAttribute('data-tilt')) gsap.to(cur, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.8, ease: 'expo.out' });
        cur = el;
        if (el && el.hasAttribute('data-tilt')) {
          rx = gsap.quickTo(el, 'rotateX', { duration: 0.5, ease: 'power3.out' });
          ry = gsap.quickTo(el, 'rotateY', { duration: 0.5, ease: 'power3.out' });
          gsap.to(el, { scale: 1.015, duration: 0.5, ease: 'expo.out' });
        }
      }
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', px * 100 + '%');
      el.style.setProperty('--my', py * 100 + '%');
      if (el.hasAttribute('data-tilt')) {
        gsap.set(el, { transformPerspective: 900 });
        rx((0.5 - py) * 7);
        ry((px - 0.5) * 9);
      }
    }, { passive: true });

    // Custom cursor
    html.classList.add('has-cursor');
    const dot = $('.cursor-dot');
    const ring = $('.cursor-ring');
    const dx = gsap.quickTo(dot, 'x', { duration: 0.08 });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
    const rxq = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    const ryq = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    dot.style.transform = ring.style.transform = '';
    window.addEventListener('pointermove', (e) => { dx(e.clientX); dy(e.clientY); rxq(e.clientX); ryq(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', (e) => {
      const lbl = e.target.closest('[data-cursor]');
      const hov = e.target.closest('a, button, [role="button"], input, .filter');
      ring.classList.toggle('label', !!lbl);
      ring.textContent = lbl ? lbl.dataset.cursor : '';
      ring.classList.toggle('hover', !lbl && !!hov);
    });
    document.addEventListener('mouseleave', () => gsap.to([dot, ring], { opacity: 0, duration: 0.3 }));
    document.addEventListener('mouseenter', () => gsap.to([dot, ring], { opacity: 1, duration: 0.3 }));
  }

  /* ---------- ClickSpark ---------- */
  (function clickSpark() {
    const c = $('.spark-canvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    let sparks = [];
    let running = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => { c.width = innerWidth * dpr; c.height = innerHeight * dpr; };
    size();
    window.addEventListener('resize', size);
    const color = () => getComputedStyle(html).getPropertyValue('--accent').trim() || '#4ADE80';
    document.addEventListener('click', (e) => {
      if (e.target.closest('input, textarea')) return;
      const now = performance.now();
      for (let i = 0; i < 8; i++) sparks.push({ x: e.clientX, y: e.clientY, a: (Math.PI * 2 * i) / 8, t: now });
      if (!running) { running = true; requestAnimationFrame(draw); }
    });
    function draw(now) {
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.strokeStyle = color();
      ctx.lineWidth = 2 * dpr;
      ctx.lineCap = 'round';
      sparks = sparks.filter((s) => {
        const p = (now - s.t) / 450;
        if (p >= 1) return false;
        const e = 1 - Math.pow(1 - p, 3);
        const d = e * 26;
        const len = 10 * (1 - e);
        ctx.beginPath();
        ctx.moveTo((s.x + Math.cos(s.a) * d) * dpr, (s.y + Math.sin(s.a) * d) * dpr);
        ctx.lineTo((s.x + Math.cos(s.a) * (d + len)) * dpr, (s.y + Math.sin(s.a) * (d + len)) * dpr);
        ctx.stroke();
        return true;
      });
      if (sparks.length) requestAnimationFrame(draw);
      else { running = false; ctx.clearRect(0, 0, c.width, c.height); }
    }
  })();

  /* ---------- Footer-woordmerk ---------- */
  const fw = $('.footer-word');
  if (fw) {
    gsap.from(fw, { yPercent: 35, opacity: 0, ease: 'none', scrollTrigger: { trigger: fw, start: 'top 100%', end: 'top 60%', scrub: true } });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());

  /* ======================================================================
     Fallback zonder animaties: alles direct zichtbaar en bruikbaar
     ====================================================================== */
  function initStaticFallbacks() {
    document.querySelectorAll('[data-count]').forEach((el) => { el.textContent = el.dataset.count; });
    const bar = document.querySelector('#ideaProgress i');
    if (bar) bar.style.width = bar.dataset.to + '%';
    document.querySelectorAll('[data-decrypt]').forEach((el) => { el.textContent = JSON.parse(el.dataset.decrypt)[0]; });
    document.querySelectorAll('[data-velocity]').forEach((row) => { row.innerHTML += row.innerHTML; });
    const active = document.querySelector('.nav-pill a.active');
    const ind = document.querySelector('.nav-indicator');
    if (active && ind) {
      requestAnimationFrame(() => {
        const r = active.getBoundingClientRect();
        const p = active.parentElement.getBoundingClientRect();
        Object.assign(ind.style, { opacity: 1, width: r.width + 'px', transform: `translateX(${r.left - p.left}px)` });
      });
    }
    const progress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
      const lim = document.documentElement.scrollHeight - innerHeight;
      if (progress) progress.style.transform = `scaleX(${lim ? scrollY / lim : 0})`;
    }, { passive: true });
    document.addEventListener('menutoggle', (e) => {
      const o = document.getElementById('menuOverlay');
      o.style.visibility = e.detail ? 'visible' : 'hidden';
      o.style.clipPath = e.detail ? 'none' : '';
    });
    document.addEventListener('modal', (e) => { if (!e.detail.open) e.detail.el.classList.remove('open'); });
  }

  /* ======================================================================
     AURORA — WebGL-achtergrond in de hero (naar React Bits "Aurora")
     ====================================================================== */
  function initAurora() {
    const canvas = document.querySelector('[data-aurora]');
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return;
    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `
      precision mediump float;
      uniform float t; uniform vec2 r; uniform vec2 m;
      uniform vec3 c1; uniform vec3 c2; uniform vec3 c3; uniform float k;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
      void main(){
        vec2 uv=gl_FragCoord.xy/r;
        vec2 p=uv; p.x*=r.x/r.y;
        float tt=t*.05;
        vec2 q=vec2(fbm(p*1.3+vec2(tt,-tt*.6)),fbm(p*1.3+vec2(-tt*.8,tt)+4.7));
        vec2 w=vec2(fbm(p*1.1+q*2.2+vec2(tt*1.3,0.)+m*.25),fbm(p*1.1+q*2.2+vec2(0.,tt*1.1)+3.1));
        float f=fbm(p*1.2+w*1.8);
        float vert=smoothstep(.0,.6,uv.y+(w.x-.5)*.5)*smoothstep(1.2,.6,uv.y+(q.y-.5)*.4);
        float bands=.55+.45*sin(p.x*2.4+w.x*4.+tt*5.);
        float glow=smoothstep(.36,.6,f)*vert*bands;
        vec3 col=mix(c1,c2,smoothstep(.35,.65,w.y));
        col=mix(col,c3,smoothstep(.55,.7,f)*.5);
        float a=clamp(glow*2.4,0.,1.)*k;
        gl_FragColor=vec4(col*a,a);
      }`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n) => gl.getUniformLocation(prog, n);
    const u = { t: U('t'), r: U('r'), m: U('m'), c1: U('c1'), c2: U('c2'), c3: U('c3'), k: U('k') };

    const hex = (v) => { const x = v.trim().replace('#', ''); return [0, 2, 4].map((i) => parseInt(x.substr(i, 2), 16) / 255); };
    function colors() {
      const cs = getComputedStyle(document.documentElement);
      gl.uniform3fv(u.c1, hex(cs.getPropertyValue('--accent')));
      gl.uniform3fv(u.c2, hex(cs.getPropertyValue('--accent-2')));
      gl.uniform3fv(u.c3, hex(cs.getPropertyValue('--accent-3')));
      gl.uniform1f(u.k, document.documentElement.dataset.theme === 'light' ? 0.32 : 0.42);
    }
    colors();
    document.addEventListener('themechange', () => { colors(); if (reduce) frame(8000); });

    const scale = 0.5;
    function resize() {
      const w = canvas.clientWidth; const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * scale));
      canvas.height = Math.max(1, Math.round(h * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.r, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', () => { resize(); if (reduce) frame(8000); });

    let mx = 0; let my = 0; let tmx = 0; let tmy = 0;
    window.addEventListener('pointermove', (e) => { tmx = e.clientX / innerWidth - 0.5; tmy = 0.5 - e.clientY / innerHeight; }, { passive: true });
    function frame(ms) {
      mx += (tmx - mx) * 0.03; my += (tmy - my) * 0.03;
      gl.uniform1f(u.t, ms / 1000 + 20);
      gl.uniform2f(u.m, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    if (reduce) { frame(8000); return; }
    frame(performance.now());
    let visible = true;
    let running = false;
    const kick = () => { if (!running && visible && !document.hidden) { running = true; requestAnimationFrame(loop); } };
    function loop(ms) {
      if (!visible || document.hidden) { running = false; return; }
      frame(ms);
      requestAnimationFrame(loop);
    }
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }).observe(canvas);
    document.addEventListener('visibilitychange', kick);
    window.addEventListener('load', kick);
    window.addEventListener('pointermove', kick, { passive: true });
    window.addEventListener('scroll', kick, { passive: true });
    kick();
  }
})();
