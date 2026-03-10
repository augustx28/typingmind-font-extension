// TypingMind Page Outline Extension v2
// Floating outline/TOC panel from headers in the active chat.
// Mobile-first: bottom-sheet on small screens, side panel on desktop.
// Ctrl+Shift+O keyboard shortcut. Auto-refreshes on new messages.

(function () {
  'use strict';

  const PANEL_ID = 'tm-page-outline-panel';
  const TOGGLE_ID = 'tm-page-outline-toggle';
  const STYLE_ID = 'tm-page-outline-styles';
  const BACKDROP_ID = 'tm-page-outline-backdrop';

  // ── Inject Styles ──────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `

      /* ── Toggle Button ──────────────────────────────────────────────── */
      #${TOGGLE_ID} {
        position: fixed;
        top: 50px;
        right: 12px;
        z-index: 99999;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 1px solid rgba(128, 128, 128, 0.15);
        background: rgba(180, 180, 180, 0.18);
        color: rgba(100, 100, 100, 0.7);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        box-shadow: none;
        transition: background 0.2s, color 0.2s;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        padding: 0;
      }
      #${TOGGLE_ID}:hover {
        background: rgba(180, 180, 180, 0.35);
        color: rgba(60, 60, 60, 0.9);
      }
      #${TOGGLE_ID}:active {
        background: rgba(180, 180, 180, 0.45);
      }
      #${TOGGLE_ID}.active {
        background: rgba(100, 130, 255, 0.2);
        color: rgba(80, 110, 230, 0.85);
        border-color: rgba(100, 130, 255, 0.25);
      }

      .dark #${TOGGLE_ID} {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(200, 200, 200, 0.5);
        border-color: rgba(255, 255, 255, 0.08);
      }
      .dark #${TOGGLE_ID}:hover {
        background: rgba(255, 255, 255, 0.15);
        color: rgba(220, 220, 220, 0.8);
      }
      .dark #${TOGGLE_ID}:active {
        background: rgba(255, 255, 255, 0.2);
      }
      .dark #${TOGGLE_ID}.active {
        background: rgba(130, 160, 255, 0.15);
        color: rgba(140, 170, 255, 0.85);
        border-color: rgba(130, 160, 255, 0.2);
      }

      /* ── Backdrop (mobile only) ─────────────────────────────────────── */
      #${BACKDROP_ID} {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 99997;
        background: rgba(0, 0, 0, 0.3);
        opacity: 0;
        transition: opacity 0.2s;
        -webkit-tap-highlight-color: transparent;
      }
      #${BACKDROP_ID}.visible {
        display: block;
        opacity: 1;
      }

      /* ── Panel: Desktop (default) ───────────────────────────────────── */
      #${PANEL_ID} {
        position: fixed;
        top: 84px;
        right: 12px;
        z-index: 99998;
        width: 230px;
        max-height: calc(100vh - 110px);
        overflow-y: auto;
        border-radius: 10px;
        border: 1px solid rgba(128, 128, 128, 0.15);
        background: rgba(255, 255, 255, 0.95);
        color: #222;
        box-shadow: 0 3px 14px rgba(0, 0, 0, 0.1);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        padding: 0;
        display: none;
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        transform-origin: top right;
        animation: tmOutlineFadeIn 0.15s ease-out;
      }
      @keyframes tmOutlineFadeIn {
        from { opacity: 0; transform: scale(0.95) translateY(-4px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      #${PANEL_ID}.visible {
        display: block;
      }
      .dark #${PANEL_ID} {
        background: rgba(28, 28, 32, 0.95);
        color: #ccc;
        border-color: rgba(255, 255, 255, 0.08);
        box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
      }

      /* ── Panel Header ───────────────────────────────────────────────── */
      #${PANEL_ID} .outline-header {
        padding: 8px 12px 6px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #999;
        border-bottom: 1px solid rgba(128, 128, 128, 0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .dark #${PANEL_ID} .outline-header {
        color: #666;
        border-bottom-color: rgba(255, 255, 255, 0.06);
      }

      #${PANEL_ID} .outline-header .outline-count {
        font-weight: 400;
        font-size: 9px;
        color: #bbb;
      }
      .dark #${PANEL_ID} .outline-header .outline-count {
        color: #555;
      }

      /* ── Outline List ───────────────────────────────────────────────── */
      #${PANEL_ID} .outline-list {
        list-style: none;
        margin: 0;
        padding: 4px 0;
      }

      #${PANEL_ID} .outline-item {
        padding: 4px 12px;
        cursor: pointer;
        transition: background 0.12s;
        line-height: 1.35;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-left: 2px solid transparent;
      }
      #${PANEL_ID} .outline-item:hover {
        background: rgba(0, 0, 0, 0.03);
        border-left-color: rgba(100, 100, 100, 0.4);
      }
      .dark #${PANEL_ID} .outline-item:hover {
        background: rgba(255, 255, 255, 0.04);
        border-left-color: rgba(200, 200, 200, 0.3);
      }

      #${PANEL_ID} .outline-item[data-level="1"] {
        font-weight: 600;
        font-size: 12px;
        padding-left: 12px;
      }
      #${PANEL_ID} .outline-item[data-level="2"] {
        font-weight: 500;
        font-size: 11.5px;
        padding-left: 22px;
      }
      #${PANEL_ID} .outline-item[data-level="3"] {
        font-weight: 400;
        font-size: 11px;
        padding-left: 32px;
        color: #666;
      }
      .dark #${PANEL_ID} .outline-item[data-level="3"] {
        color: #888;
      }
      #${PANEL_ID} .outline-item[data-level="4"] {
        font-weight: 400;
        font-size: 10.5px;
        padding-left: 42px;
        color: #888;
      }
      .dark #${PANEL_ID} .outline-item[data-level="4"] {
        color: #666;
      }

      #${PANEL_ID} .outline-empty {
        padding: 16px 12px;
        text-align: center;
        color: #aaa;
        font-size: 11px;
      }
      .dark #${PANEL_ID} .outline-empty {
        color: #555;
      }

      /* ── Scrollbar ──────────────────────────────────────────────────── */
      #${PANEL_ID}::-webkit-scrollbar { width: 3px; }
      #${PANEL_ID}::-webkit-scrollbar-track { background: transparent; }
      #${PANEL_ID}::-webkit-scrollbar-thumb {
        background: rgba(128, 128, 128, 0.2);
        border-radius: 3px;
      }

      /* ── Mobile: Bottom Sheet ───────────────────────────────────────── */
      @media (max-width: 768px) {
        #${PANEL_ID} {
          top: auto;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          max-height: 50vh;
          border-radius: 14px 14px 0 0;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
          transform-origin: bottom center;
          animation: tmOutlineSlideUp 0.2s ease-out;
        }
        @keyframes tmOutlineSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dark #${PANEL_ID} {
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
        }

        #${PANEL_ID} .outline-header {
          padding: 14px 16px 8px;
          font-size: 11px;
          position: relative;
        }
        #${PANEL_ID} .outline-header::before {
          content: '';
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 3px;
          border-radius: 3px;
          background: rgba(128, 128, 128, 0.25);
        }
        .dark #${PANEL_ID} .outline-header::before {
          background: rgba(255, 255, 255, 0.12);
        }

        #${PANEL_ID} .outline-item {
          padding: 8px 16px;
          font-size: 13px;
        }
        #${PANEL_ID} .outline-item[data-level="1"] {
          font-size: 13px;
          padding-left: 16px;
        }
        #${PANEL_ID} .outline-item[data-level="2"] {
          font-size: 12.5px;
          padding-left: 28px;
        }
        #${PANEL_ID} .outline-item[data-level="3"] {
          font-size: 12px;
          padding-left: 40px;
        }
        #${PANEL_ID} .outline-item[data-level="4"] {
          font-size: 11.5px;
          padding-left: 52px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ── Create UI Elements ─────────────────────────────────────────────────────
  function createToggleButton() {
    if (document.getElementById(TOGGLE_ID)) return;
    const btn = document.createElement('button');
    btn.id = TOGGLE_ID;
    btn.title = 'Toggle Page Outline (Ctrl+Shift+O)';
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="11" y2="18"/></svg>`;
    btn.addEventListener('click', togglePanel);
    document.body.appendChild(btn);
  }

  function createBackdrop() {
    if (document.getElementById(BACKDROP_ID)) return;
    const bd = document.createElement('div');
    bd.id = BACKDROP_ID;
    bd.addEventListener('click', () => {
      if (panelVisible) togglePanel();
    });
    document.body.appendChild(bd);
  }

  function createPanel() {
    if (document.getElementById(PANEL_ID)) return;
    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="outline-header">
        <span>Outline</span>
        <span class="outline-count"></span>
      </div>
      <ul class="outline-list"></ul>
    `;
    document.body.appendChild(panel);
  }

  // ── Toggle Logic ───────────────────────────────────────────────────────────
  let panelVisible = false;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function togglePanel() {
    const panel = document.getElementById(PANEL_ID);
    const btn = document.getElementById(TOGGLE_ID);
    const bd = document.getElementById(BACKDROP_ID);
    if (!panel) return;

    panelVisible = !panelVisible;
    panel.classList.toggle('visible', panelVisible);
    if (btn) btn.classList.toggle('active', panelVisible);

    if (bd) {
      if (panelVisible && isMobile()) {
        bd.classList.add('visible');
      } else {
        bd.classList.remove('visible');
      }
    }

    if (panelVisible) refreshOutline();
  }

  // ── Find the chat scroll container ─────────────────────────────────────────
  function getChatContainer() {
    const selectors = [
      '[data-element-id="chat-space-middle-part"]',
      '[data-element-id="chat-space"]',
      '.chat-messages',
      'main',
      '[role="main"]',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    const candidates = document.querySelectorAll('div[class]');
    let best = null;
    let bestArea = 0;
    for (const c of candidates) {
      if (c.scrollHeight > c.clientHeight + 100 && c.clientHeight > 200) {
        const rect = c.getBoundingClientRect();
        const area = rect.width * rect.height;
        if (area > bestArea) {
          bestArea = area;
          best = c;
        }
      }
    }
    return best || document.body;
  }

  // ── Scan headings ──────────────────────────────────────────────────────────
  function getHeadings() {
    const container = getChatContainer();
    const headings = container.querySelectorAll('h1, h2, h3, h4');
    const results = [];
    headings.forEach((h, i) => {
      const text = h.textContent.trim();
      if (!text) return;
      const level = parseInt(h.tagName.charAt(1), 10);
      if (!h.id) {
        h.id = `tm-outline-heading-${i}-${Date.now()}`;
      }
      results.push({ text, level, id: h.id, element: h });
    });
    return results;
  }

  // ── Refresh the outline list ───────────────────────────────────────────────
  function refreshOutline() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;

    const list = panel.querySelector('.outline-list');
    const countEl = panel.querySelector('.outline-count');
    const headings = getHeadings();

    list.innerHTML = '';
    countEl.textContent = headings.length ? `${headings.length}` : '';

    if (headings.length === 0) {
      list.innerHTML = '<li class="outline-empty">No headings in this chat.</li>';
      return;
    }

    const minLevel = Math.min(...headings.map((h) => h.level));

    headings.forEach((h) => {
      const li = document.createElement('li');
      li.className = 'outline-item';
      li.setAttribute('data-level', Math.min(h.level - minLevel + 1, 4));
      li.textContent = h.text;
      li.title = h.text;
      li.addEventListener('click', () => {
        if (isMobile() && panelVisible) togglePanel();
        h.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const prev = h.element.style.transition;
        const prevBg = h.element.style.backgroundColor;
        h.element.style.transition = 'background-color 0.3s';
        h.element.style.backgroundColor = 'rgba(255, 200, 0, 0.18)';
        setTimeout(() => {
          h.element.style.backgroundColor = prevBg || '';
          setTimeout(() => { h.element.style.transition = prev || ''; }, 300);
        }, 1000);
      });
      list.appendChild(li);
    });
  }

  // ── Auto-refresh on DOM changes ────────────────────────────────────────────
  let refreshTimer = null;
  function scheduleRefresh() {
    if (!panelVisible) return;
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(refreshOutline, 500);
  }

  function startObserver() {
    const observer = new MutationObserver(scheduleRefresh);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ── Keyboard shortcut ──────────────────────────────────────────────────────
  function handleKeydown(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'O') {
      e.preventDefault();
      togglePanel();
    }
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  function init() {
    injectStyles();
    createToggleButton();
    createBackdrop();
    createPanel();
    startObserver();
    document.addEventListener('keydown', handleKeydown);
    console.log('[Page Outline v2] Loaded. Toggle: button or Ctrl+Shift+O');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
