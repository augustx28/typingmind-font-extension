// File: chatgpt-dark.js   (host it anywhere that serves JS with CORS)
(() => {
  /* ---------- Exact ChatGPT Dark Palette ---------- */
  const c = {
    bg1 : '#202123',  // main background
    bg2 : '#343541',  // sidebar
    bg3 : '#40414f',  // assistant bubble
    userBubble : '#2E2F35',
    text1 : '#ECECF1',
    text2 : '#A3A3B2',
    accent : '#10A37F',
    accentSoft : 'rgba(16,163,127,.15)',
    line : '#33353F'
  };

  /* ---------- CSS to inject ---------- */
  const css = `
    /* Root & base */
    body, .tm-body, #root, .tm-app {
      background-color:${c.bg1} !important;
      color:${c.text1} !important;
    }

    /* Sidebar */
    .tm-sidebar {
      background:${c.bg2} !important;
      border-right:1px solid ${c.line} !important;
    }

    /* Conversation bubbles */
    .tm-message--assistant  { background:${c.bg3} !important; }
    .tm-message--user       { background:${c.userBubble} !important; }

    /* Links / buttons accents */
    a, button, .tm-btn-primary {
      color:${c.accent} !important;
    }
    a:hover, button:hover, .tm-btn-primary:hover {
      background:${c.accentSoft} !important;
    }

    /* Scrollbar (WebKit) */
    ::-webkit-scrollbar       { width:8px; }
    ::-webkit-scrollbar-thumb { background:#5E5F6E; border-radius:4px; }
  `;

  /* ---------- Inject once TypingMind is ready ---------- */
  const inject = () => {
    if (document.getElementById('tm-chatgpt-dark-style')) return;          // avoid duplicates
    const style = document.createElement('style');
    style.id = 'tm-chatgpt-dark-style';
    style.textContent = css;
    document.head.appendChild(style);
    console.log('[ChatGPT-Dark] Theme injected');
  };

  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', inject)
    : inject();
})();
