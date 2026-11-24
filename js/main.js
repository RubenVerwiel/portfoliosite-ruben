/* ==========================================================================
   MAIN — opbouw van navigatie, footer, pagina-inhoud, thema, ⌘K
   Animaties staan in effects.js, de chat in chat.js.
   ========================================================================== */
(function () {
  const S = window.SITE;
  const page = document.body.dataset.page || 'home';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const ICON = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    moon: '<svg class="theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    sun: '<svg class="theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
  };
  window.ICON = ICON;

  const PAGES = [
    { id: 'home', href: 'index.html', label: 'Home', desc: 'Beginpagina' },
    { id: 'werk', href: 'werk.html', label: 'Werk', desc: 'Al mijn projecten en opdrachten' },
    { id: 'over', href: 'over.html', label: 'Over mij', desc: 'Wie ik ben en wat ik deed' },
    { id: 'minor', href: 'minor.html', label: 'Minor', desc: 'Begin, tussentijds en einde' },
    { id: 'toekomst', href: 'toekomst.html', label: 'Toekomst', desc: 'Waar ik naartoe wil' },
    { id: 'ideeen', href: 'ideeen.html', label: 'Ideeën', desc: 'Mijn to-do lijst met ideeën' },
  ];

  /* ---------- Layout: nav, menu, footer, globale lagen ---------- */
  function renderChrome() {
    const links = PAGES.map((p) => `<a href="${p.href}" class="${p.id === page ? 'active' : ''}" ${p.id === page ? 'aria-current="page"' : ''}>${p.label}</a>`).join('');
    const header = document.createElement('div');
    header.innerHTML = `
      <div class="scroll-progress" aria-hidden="true"></div>
      <header class="nav" id="nav">
        <div class="nav-inner">
          <a class="nav-logo" href="index.html" aria-label="Ruben Verwiel, home">Ruben<span>.</span></a>
          <nav class="nav-pill" aria-label="Hoofdmenu"><span class="nav-indicator" aria-hidden="true"></span>${links}</nav>
          <div class="nav-actions">
            <button class="icon-btn kbd-btn" id="paletteBtn" aria-label="Zoeken en navigeren">${ICON.search}<span class="kbd">⌘K</span></button>
            <button class="icon-btn" id="themeBtn" aria-label="Wissel thema">${ICON.moon}${ICON.sun}</button>
            <button class="icon-btn burger" id="burger" aria-label="Menu openen" aria-expanded="false" aria-controls="menuOverlay"><span></span><span></span></button>
          </div>
        </div>
      </header>
      <div class="menu-overlay" id="menuOverlay" aria-hidden="true">
        <nav aria-label="Mobiel menu">
          ${PAGES.map((p, i) => `<a href="${p.href}" class="${p.id === page ? 'active' : ''}"><small>0${i + 1}</small><span>${p.label}</span></a>`).join('')}
        </nav>
        <div class="menu-foot"><span>${esc(S.person.city)}, Nederland</span><a href="${S.person.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a></div>
      </div>`;
    document.body.prepend(...header.children);

    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
      <div class="container">
        <div class="footer-top">
          <div>
            <h4>Ruben Verwiel</h4>
            <p class="muted" style="max-width:36ch">Commerciële Economie en de minor AI. Ik bouw de tools die commerciële processen sneller maken.</p>
          </div>
          <div><h4>Pagina's</h4><ul>${PAGES.map((p) => `<li><a href="${p.href}">${p.label}</a></li>`).join('')}</ul></div>
          <div><h4>Contact</h4><ul><li><a href="#" data-mail>Mail mij</a></li><li><a href="${S.person.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a></li></ul></div>
        </div>
        <div class="footer-word" aria-hidden="true">Ruben<span>.</span></div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} Ruben Verwiel · ${esc(S.person.city)}</span>
          <span>Gebouwd met Claude Code, GSAP, Lenis &amp; effecten naar React Bits</span>
        </div>
      </div>`;
    document.body.appendChild(footer);

    const layers = document.createElement('div');
    layers.innerHTML = `
      <div class="grain" aria-hidden="true"></div>
      <div class="cursor" aria-hidden="true"><div class="cursor-ring"></div><div class="cursor-dot"></div></div>
      <canvas class="spark-canvas" aria-hidden="true"></canvas>
      <div class="curtain" aria-hidden="true"><span>Ruben.</span></div>`;
    document.body.append(...layers.children);
  }

  /* ---------- Thema ---------- */
  function initTheme() {
    const btn = $('#themeBtn');
    const label = () => btn.setAttribute('aria-label', document.documentElement.dataset.theme === 'light' ? 'Zet donker thema aan' : 'Zet licht thema aan');
    label();
    btn.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      label();
      document.dispatchEvent(new CustomEvent('themechange', { detail: next }));
    });
  }

  /* ---------- Mail (tegen spam-scrapers) ---------- */
  function initMail() {
    const addr = 'rubenverwiel2003' + '@' + 'gmail.com';
    $$('[data-mail]').forEach((a) => {
      a.href = 'mailto:' + addr;
      if (a.hasAttribute('data-mail-show')) a.textContent = addr;
    });
  }

  /* ---------- Mobiel menu ---------- */
  function initMenu() {
    const burger = $('#burger');
    const overlay = $('#menuOverlay');
    burger.addEventListener('click', () => {
      const open = !document.body.classList.contains('menu-open');
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open);
      overlay.setAttribute('aria-hidden', !open);
      document.dispatchEvent(new CustomEvent('menutoggle', { detail: open }));
    });
  }

  /* ---------- Werk: kaarten + detail ---------- */
  function workCard(p, i) {
    const media = p.image
      ? `<img src="${esc(p.image)}" alt="" loading="lazy">`
      : `<div class="placeholder">${String(i + 1).padStart(2, '0')}</div>`;
    const dot = p.status === 'In ontwikkeling' ? 'status-dot warn' : 'status-dot';
    const links = p.links && p.links.length
      ? `${ICON.link}<span>${p.links.length} link${p.links.length > 1 ? 's' : ''}</span>`
      : '<span>Links volgen</span>';
    return `
      <article class="work-card" data-reveal data-tilt data-spotlight data-cursor="Open" tabindex="0" role="button" data-slug="${esc(p.slug)}" data-type="${esc(p.type)}" aria-label="${esc(p.title)}, bekijk details">
        <div class="work-media">${media}<span class="chip work-status"><i class="${dot}"></i>${esc(p.status)}</span></div>
        <div class="work-body">
          <div class="work-top"><span>${String(i + 1).padStart(2, '0')} · ${esc(p.type)}</span><span>${esc(p.year)}</span></div>
          <h3 class="work-title">${esc(p.title)}</h3>
          <p class="work-summary">${esc(p.summary)}</p>
          <div class="work-tags">${p.tags.slice(0, 4).map((t) => `<span class="chip">${esc(t)}</span>`).join('')}${p.tags.length > 4 ? `<span class="chip">+${p.tags.length - 4}</span>` : ''}</div>
          <div class="work-links-hint">${links}</div>
        </div>
      </article>`;
  }

  function renderModal() {
    const m = document.createElement('div');
    m.className = 'modal';
    m.id = 'workModal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-labelledby', 'workModalTitle');
    m.innerHTML = `<div class="modal-backdrop" data-close></div><div class="modal-frame"><button class="modal-close" data-close aria-label="Sluiten">${ICON.close}</button><div class="modal-sheet" data-lenis-prevent><div class="modal-content"></div></div></div>`;
    document.body.appendChild(m);
    m.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeProject(); });
  }

  const MONTHS = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  const fmtDate = (d) => { const [y, m, day] = d.split('-').map(Number); return `${day} ${MONTHS[m - 1]} ${y}`; };

  let lastFocus = null;
  function openProject(slug, push = true) {
    const p = S.projects.find((x) => x.slug === slug);
    if (!p) return;
    const m = $('#workModal');
    $('.modal-sheet', m).scrollTop = 0;
    lastFocus = document.activeElement;
    const sections = p.sections.map((s) => `
      <div class="modal-section"><h3>${esc(s.title)}</h3><div>${s.list ? `<ul>${s.list.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>` : `<p>${esc(s.text)}</p>`}</div></div>`).join('');
    const links = p.links && p.links.length
      ? `<div class="modal-links">${p.links.map((l) => `<a class="btn btn-primary btn-sm" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ${ICON.arrow}</a>`).join('')}</div>`
      : `<span class="todo-badge">Links volgen binnenkort</span>`;
    $('.modal-content', m).innerHTML = `
      <span class="eyebrow">${esc(p.type)} · ${esc(p.year)}</span>
      <h2 class="modal-title" id="workModalTitle">${esc(p.title)}</h2>
      <p class="lead">${esc(p.summary)}</p>
      <div class="work-tags" style="margin-top:1.2rem">${p.tags.map((t) => `<span class="chip accent">${esc(t)}</span>`).join('')}</div>
      <div class="modal-media">${p.image ? `<img src="${esc(p.image)}" alt="Beeld van ${esc(p.title)}">` : `<div class="work-media" style="position:absolute;inset:0;border:0"><div class="placeholder">Beeld volgt</div></div>`}</div>
      ${sections}
      ${p.log && p.log.length ? `<div class="modal-section"><h3>Bouwlog</h3><ol class="buildlog">${p.log.map((l) => `<li><time datetime="${esc(l.date)}">${fmtDate(l.date)}</time><span>${esc(l.text)}</span></li>`).join('')}</ol></div>` : ''}
      <div class="modal-section"><h3>Links</h3><div>${links}</div></div>`;
    m.classList.add('open');
    document.dispatchEvent(new CustomEvent('modal', { detail: { open: true, el: m } }));
    if (push) history.replaceState(null, '', '#' + slug);
    $('.modal-close', m).focus();
  }
  function closeProject() {
    const m = $('#workModal');
    if (!m || !m.classList.contains('open')) return;
    document.dispatchEvent(new CustomEvent('modal', { detail: { open: false, el: m } }));
    history.replaceState(null, '', location.pathname);
    if (lastFocus) lastFocus.focus();
  }
  window.openProject = openProject;
  window.closeProject = closeProject;

  function bindWorkCards(root) {
    $$('.work-card', root).forEach((c) => {
      c.addEventListener('click', () => openProject(c.dataset.slug));
      c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(c.dataset.slug); } });
    });
  }

  function renderWork() {
    const grid = $('#workGrid');
    if (!grid) return;
    const types = ['Alle', ...new Set(S.projects.map((p) => p.type))];
    const filters = $('#workFilters');
    if (filters) {
      filters.innerHTML = types.map((t, i) => `<button class="filter ${i === 0 ? 'active' : ''}" data-filter="${esc(t)}">${esc(t)}<span class="count">${t === 'Alle' ? S.projects.length : S.projects.filter((p) => p.type === t).length}</span></button>`).join('');
      filters.addEventListener('click', (e) => {
        const b = e.target.closest('.filter');
        if (!b) return;
        $$('.filter', filters).forEach((x) => x.classList.toggle('active', x === b));
        const f = b.dataset.filter;
        const cards = $$('.work-card', grid);
        cards.forEach((c) => {
          const show = f === 'Alle' || c.dataset.type === f;
          c.style.display = show ? '' : 'none';
        });
        document.dispatchEvent(new CustomEvent('filtered', { detail: cards.filter((c) => c.style.display !== 'none') }));
      });
    }
    grid.innerHTML = S.projects.map(workCard).join('') + `
      <div class="add-card" data-reveal>
        <div class="plus">+</div>
        <strong>Volgende project</strong>
        <span>Hier komt mijn volgende werk te staan.</span>
      </div>`;
    bindWorkCards(grid);
  }

  function renderFeatured() {
    const grid = $('#featuredGrid');
    if (!grid) return;
    grid.innerHTML = S.projects.filter((p) => p.featured).slice(0, 2).map(workCard).join('');
    bindWorkCards(grid);
  }

  /* ---------- Over mij ---------- */
  function renderAbout() {
    const tl = $('#timeline');
    if (tl) {
      tl.innerHTML = `<div class="timeline-track"><div class="timeline-fill"></div></div>` + S.experience.map((x) => `
        <div class="t-item" data-reveal>
          <div class="t-period">${esc(x.period)}</div>
          <div><h3 class="t-role">${esc(x.role)}</h3><p class="t-place">${esc(x.place)}</p>${x.text ? `<p class="t-text">${esc(x.text)}</p>` : ''}</div>
        </div>`).join('');
    }
    $$('[data-loop]').forEach((el, i) => {
      const items = i % 2 ? [...S.skills].reverse() : S.skills;
      const html = items.map((s) => `<span class="loop-item"><i></i>${esc(s)}</span>`).join('');
      el.innerHTML = `<div class="loop-track">${html}${html.replace(/<span class="loop-item">/g, '<span class="loop-item" aria-hidden="true">')}</div>`;
    });
    $$('[data-cv]').forEach((a) => {
      if (S.person.cvAvailable) { a.href = S.person.cvPath; a.setAttribute('download', 'CV-Ruben-Verwiel.pdf'); }
      else a.remove();
    });
  }

  /* ---------- Minor ---------- */
  function textOrPrompts(item) {
    if (item.text && item.text.length) return item.text.map((t) => `<p>${esc(t)}</p>`).join('');
    return `<span class="todo-badge">Nog in te vullen</span><ul class="prompts">${item.prompts.map((q) => `<li>${esc(q)}</li>`).join('')}</ul>`;
  }
  function renderMinor() {
    const track = $('#journeyTrack');
    if (!track) return;
    $('#journeySteps').innerHTML = S.minor.map((m) => `<span>${esc(m.label)}</span>`).join('');
    track.innerHTML = S.minor.map((m, i) => `
      <article class="phase" data-phase>
        <div class="phase-head"><span class="eyebrow">${String(i + 1).padStart(2, '0')} · ${esc(m.when)}</span><span class="chip ${m.text.length ? 'accent' : ''}">${m.text.length ? 'Ingevuld' : 'Open'}</span></div>
        <h2 class="phase-title">${esc(m.label)}<br><span class="muted">${esc(m.title)}</span></h2>
        <div class="phase-body">${textOrPrompts(m)}</div>
        <div class="phase-num" aria-hidden="true">${i + 1}</div>
      </article>`).join('');
  }

  /* ---------- Toekomst ---------- */
  function renderFuture() {
    const h = $('#horizon');
    if (!h) return;
    h.innerHTML = S.future.horizons.map((x) => `
      <div class="h-row" data-reveal>
        <div class="h-when"><small>${esc(x.title)}</small>${esc(x.when)}</div>
        <div class="h-body">${textOrPrompts(x)}</div>
      </div>`).join('');
    const learn = $('#learnList');
    if (learn) {
      learn.innerHTML = S.future.learn.length
        ? S.future.learn.map((l) => `<span class="loop-item">${esc(l)}</span>`).join('')
        : `<span class="todo-badge">Nog in te vullen: wat wil ik nog leren?</span>`;
    }
  }

  /* ---------- Ideeën ---------- */
  function renderIdeas() {
    const board = $('#board');
    if (!board) return;
    const cols = [
      { key: 'idee', label: 'Idee' },
      { key: 'bezig', label: 'Mee bezig' },
      { key: 'klaar', label: 'Klaar' },
    ];
    const tags = ['Alle', ...new Set(S.ideas.map((i) => i.tag))];
    const f = $('#ideaFilters');
    const draw = (tag) => {
      board.innerHTML = cols.map((c) => {
        const items = S.ideas.filter((i) => i.status === c.key && (tag === 'Alle' || i.tag === tag));
        return `<section class="column col-${c.key}" aria-label="${c.label}">
          <div class="column-head"><h3><i></i>${c.label}</h3><span class="count">${items.length}</span></div>
          ${items.map((i) => `<article class="idea" data-idea><h4>${esc(i.title)}</h4>${i.note ? `<p>${esc(i.note)}</p>` : ''}<span class="chip">${esc(i.tag)}</span></article>`).join('') || '<p class="muted" style="padding:.4rem;font-size:.88rem">Nog niets hier.</p>'}
        </section>`;
      }).join('');
      document.dispatchEvent(new CustomEvent('ideasdrawn'));
    };
    if (f) {
      f.innerHTML = tags.map((t, i) => `<button class="filter ${i === 0 ? 'active' : ''}" data-filter="${esc(t)}">${esc(t)}</button>`).join('');
      f.addEventListener('click', (e) => {
        const b = e.target.closest('.filter');
        if (!b) return;
        $$('.filter', f).forEach((x) => x.classList.toggle('active', x === b));
        draw(b.dataset.filter);
      });
    }
    const done = S.ideas.filter((i) => i.status === 'klaar').length;
    const prog = $('#ideaProgress');
    if (prog) {
      prog.querySelector('span').textContent = `${done} van ${S.ideas.length} klaar`;
      prog.querySelector('i').dataset.to = Math.round((done / S.ideas.length) * 100);
    }
    draw('Alle');
  }

  /* ---------- Home stats ---------- */
  function renderStats() {
    $$('[data-stat]').forEach((el) => {
      const k = el.dataset.stat;
      const v = { projects: S.projects.length, ideas: S.ideas.length, skills: S.skills.length, done: S.ideas.filter((i) => i.status === 'klaar').length }[k];
      if (v != null) el.dataset.count = v;
    });
  }

  /* ---------- Command palette ---------- */
  function initPalette() {
    const el = document.createElement('div');
    el.className = 'palette';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Zoeken en navigeren');
    el.innerHTML = `
      <div class="palette-backdrop" data-close></div>
      <div class="palette-box">
        <div class="palette-input">${ICON.search}<input type="text" placeholder="Waar wil je naartoe?" aria-label="Zoek" autocomplete="off"></div>
        <ul class="palette-list" role="listbox" data-lenis-prevent></ul>
        <div class="palette-foot"><span>↑↓ kiezen</span><span>↵ openen</span><span>esc sluiten</span></div>
      </div>`;
    document.body.appendChild(el);
    const input = $('input', el);
    const list = $('.palette-list', el);
    const entries = [
      ...PAGES.map((p) => ({ group: 'Pagina\'s', label: p.label, hint: p.desc, go: () => go(p.href) })),
      ...S.projects.map((p) => ({ group: 'Werk', label: p.title, hint: p.status, go: () => go('werk.html#' + p.slug) })),
      { group: 'Acties', label: 'Wissel licht / donker thema', hint: 'Thema', go: () => $('#themeBtn').click() },
      { group: 'Acties', label: 'Stel een vraag aan de AI-assistent', hint: 'Chat', go: () => document.dispatchEvent(new CustomEvent('openchat')) },
      { group: 'Acties', label: 'Mail Ruben', hint: 'Contact', go: () => { location.href = $('[data-mail]').href; } },
    ];
    let shown = [];
    let sel = 0;
    function go(href) {
      const target = new URL(href, location.href);
      if (target.pathname === location.pathname && target.hash) {
        close();
        openProject(target.hash.slice(1));
        return;
      }
      if (window.navigateTo) window.navigateTo(href); else location.href = href;
    }
    function draw() {
      const q = input.value.trim().toLowerCase();
      shown = entries.filter((e) => !q || (e.label + ' ' + e.hint + ' ' + e.group).toLowerCase().includes(q));
      sel = Math.min(sel, Math.max(shown.length - 1, 0));
      if (!shown.length) { list.innerHTML = '<li class="palette-empty">Niets gevonden.</li>'; return; }
      let g = '';
      list.innerHTML = shown.map((e, i) => {
        const head = e.group !== g ? `<li class="palette-group" role="presentation">${esc(e.group)}</li>` : '';
        g = e.group;
        return `${head}<li class="palette-item ${i === sel ? 'sel' : ''}" role="option" aria-selected="${i === sel}" data-i="${i}"><span>${esc(e.label)}</span><small>${esc(e.hint)}</small></li>`;
      }).join('');
      const s = $('.palette-item.sel', list);
      if (s) s.scrollIntoView({ block: 'nearest' });
    }
    function open() { el.classList.add('open'); input.value = ''; sel = 0; draw(); input.focus(); document.dispatchEvent(new CustomEvent('lock', { detail: true })); }
    function close() { el.classList.remove('open'); document.dispatchEvent(new CustomEvent('lock', { detail: false })); }
    window.openPalette = open;
    $('#paletteBtn').addEventListener('click', open);
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) close();
      const it = e.target.closest('.palette-item');
      if (it) { shown[+it.dataset.i].go(); }
    });
    input.addEventListener('input', () => { sel = 0; draw(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % shown.length; draw(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + shown.length) % shown.length; draw(); }
      if (e.key === 'Enter' && shown[sel]) { e.preventDefault(); shown[sel].go(); }
    });
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); el.classList.contains('open') ? close() : open(); }
      if (e.key === 'Escape') {
        if (el.classList.contains('open')) close();
        else closeProject();
      }
    });
  }

  /* ---------- Start ---------- */
  renderChrome();
  renderModal();
  initTheme();
  initMenu();
  renderFeatured();
  renderWork();
  renderAbout();
  renderMinor();
  renderFuture();
  renderIdeas();
  renderStats();
  initMail();
  initPalette();

  if (page === 'werk' && location.hash) {
    const slug = location.hash.slice(1);
    window.addEventListener('load', () => setTimeout(() => openProject(slug, false), 700));
  }
})();
