/* TypingMind – Dark OLED (no-Matrix) */
(function () {
  /* 1. Remove any previously injected Matrix (or other) blocks */
  [
    '#typingmindSidebarFixMerged',
    '#matrix-global-fix',
    '#matrix-main-style',
    '#matrix-input-style'
  ].forEach(id => {
    const el = document.querySelector(id);
    if (el) el.remove();
  });

  /* 2. Add a fresh OLED-only stylesheet */
  const style = document.createElement('style');
  style.id = 'typingmind-dark-oled';
  style.textContent = `
    /* Global surfaces */
    html, body,
    [data-element-id="workspace-bar"],
    [data-element-id="side-bar-background"],
    [data-element-id="sidebar-beginning-part"],
    [data-element-id="sidebar-middle-part"],
    [data-element-id="chat-space-beginning-part"],
    [data-element-id="chat-space-middle-part"],
    [data-element-id="chat-space-end-part"] {
      background-color:#000 !important;
    }

    /* Panels, modals, pop-ups */
    [role="dialog"], [role="menu"] {
      background-color:#000 !important;
      color:inherit !important;
    }

    /* Whites / light-grays inside TypingMind (cards, code blocks, etc.)  */
    .bg-white, .bg-gray-50, .bg-gray-100,
    [class*="bg-gray-"] {
      background-color:#000 !important;
    }

    /* System prose retains original colours */
    .prose :where(p,li,span,code,strong,em) {
      color:inherit !important;
    }

    /* Code blocks get a subtle dark-gray so they stand out */
    pre, code, kbd, samp {
      background-color:#111 !important;
    }

    /* Optional: thin OLED-friendly scrollbars */
    * {
      scrollbar-width:thin;
      scrollbar-color:#444 #000;
    }
    ::-webkit-scrollbar{height:8px;width:8px;}
    ::-webkit-scrollbar-track{background:#000;}
    ::-webkit-scrollbar-thumb{background:#444;border-radius:4px;}
    ::-webkit-scrollbar-thumb:hover{background:#666;}
  `;
  document.head.appendChild(style);

  console.log('✅ TypingMind Dark-OLED theme applied');
})();
