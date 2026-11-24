/* ==========================================================================
   CHATWIDGET — praat alleen met het eigen /api/chat endpoint, nooit direct
   met Gemini. Gesprekken worden per bezoeker bewaard (Supabase).
   ========================================================================== */
(function () {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <button class="chat-toggle" id="chatToggle" aria-label="Open chat" aria-expanded="false" aria-controls="chatPanel" data-magnet="0.25">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>
      <span>Vraag het AI</span>
    </button>
    <div class="chat-panel" id="chatPanel" role="dialog" aria-label="Chat met AI-assistent">
      <div class="chat-head">
        <strong><span class="status-dot"></span><span>AI-assistent<small>Stel een vraag</small></span></strong>
        <button type="button" class="chat-clear" id="chatClear">Wis gesprek</button>
      </div>
      <div class="chat-messages" id="chatMessages" data-lenis-prevent aria-live="polite"></div>
      <form class="chat-form" id="chatForm">
        <input type="text" id="chatInput" placeholder="Typ je vraag..." autocomplete="off" required aria-label="Je vraag">
        <button type="submit" id="chatSend">Stuur</button>
      </form>
    </div>`;
  document.body.append(...wrap.children);

  const toggle = document.getElementById('chatToggle');
  const panel = document.getElementById('chatPanel');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const clearBtn = document.getElementById('chatClear');
  const messages = document.getElementById('chatMessages');

  function getVisitorId() {
    try {
      let id = localStorage.getItem('chatVisitorId');
      if (!id) { id = crypto.randomUUID(); localStorage.setItem('chatVisitorId', id); }
      return id;
    } catch (err) { return null; }
  }
  const visitorId = getVisitorId();

  function addMessage(role, text) {
    const empty = messages.querySelector('.chat-empty');
    if (empty) empty.remove();
    const el = document.createElement('div');
    el.className = 'chat-msg ' + (role === 'user' ? 'user' : 'bot');
    el.textContent = text;
    messages.appendChild(el);
    if (window.gsap && window.__fx) gsap.from(el, { y: 12, opacity: 0, duration: 0.4, ease: 'expo.out' });
    messages.scrollTop = messages.scrollHeight;
  }
  function showEmpty() {
    messages.innerHTML = `<div class="chat-empty"><p>Hoi! Waar ben je benieuwd naar?</p><div class="chat-suggest">
      <button type="button">Wie is Ruben?</button><button type="button">Wat heeft hij gebouwd?</button><button type="button">Waarom de minor AI?</button></div></div>`;
    messages.querySelectorAll('.chat-suggest button').forEach((b) => b.addEventListener('click', () => { input.value = b.textContent; form.requestSubmit(); }));
  }
  function showTyping() {
    const el = document.createElement('div');
    el.className = 'chat-msg bot typing';
    el.id = 'chatTyping';
    el.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }
  const hideTyping = () => { const el = document.getElementById('chatTyping'); if (el) el.remove(); };

  showEmpty();
  (async function loadHistory() {
    if (!visitorId) return;
    try {
      const r = await fetch('/api/chat?visitorId=' + encodeURIComponent(visitorId));
      const data = await r.json();
      (data.messages || []).forEach((m) => addMessage(m.role, m.content));
    } catch (err) { /* zonder historie blijft de widget bruikbaar */ }
  })();

  function setOpen(open) {
    panel.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    if (open) {
      if (window.gsap && window.__fx) gsap.fromTo(panel, { y: 20, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out', transformOrigin: '100% 100%' });
      input.focus();
    }
  }
  toggle.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
  document.addEventListener('openchat', () => {
    const pal = document.querySelector('.palette.open');
    if (pal) pal.querySelector('[data-close]').click();
    setOpen(true);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    addMessage('user', message);
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;
    showTyping();
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, visitorId }),
      });
      const data = await r.json();
      hideTyping();
      addMessage('bot', r.ok ? (data.reply || '...') : (data.error || 'Er ging iets mis, probeer het later opnieuw.'));
    } catch (err) {
      hideTyping();
      addMessage('bot', 'Kan geen verbinding maken met de chatservice.');
    } finally {
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }
  });

  clearBtn.addEventListener('click', async () => {
    if (!confirm('Weet je zeker dat je het gesprek wilt wissen?')) return;
    showEmpty();
    if (visitorId) {
      try { await fetch('/api/chat?visitorId=' + encodeURIComponent(visitorId), { method: 'DELETE' }); } catch (err) { /* lokaal al leeg */ }
    }
  });
})();
