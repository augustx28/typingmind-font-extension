// TypingMind Page Outline Extension
// Creates a floating outline/table of contents panel from headers in the current chat.
// Supports h1, h2, h3, h4 headings. Click to scroll. Auto-updates on new messages.
// Compatible with dark and light mode.

(function () {
  'use strict';

  const PANEL_ID = 'tm-page-outline-panel';
  const TOGGLE_ID = 'tm-page-outline-toggle';
  const STYLE_ID = 'tm-page-outline-styles';

  // ── Inject Styles ──────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${TOGGLE_ID} {
        position: fixed;
        top: 12px;
        right: 16px;
        z-index: 99999;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        border: 1px solid rgba(128, 128, 128, 0.3);
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        line-height: 1;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: background 0.2s, transform 0.15s;
        user-select: none;
      }
      #${TOGGLE_ID}:hover {
        background: rgba(255, 255, 255, 1);
        transform: scale(1.05);
      }
      .dark #${TOGGLE_ID} {
        background: rgba(45, 45, 50, 0.9);
        color: #ccc;
        border-color: rgba(128, 128, 128, 0.25);
      }
      .dark #${TOGGLE_ID}:hover {
        background: rgba(55, 55, 60, 1);
        color: #fff;
      }

      #${PANEL_ID} {
        position: fixed;
        top: 56px;
        right: 16px;
        z-index: 99998;
        width: 280px;
        max-height: calc(100vh - 80px);
        overflow-y: auto;
        border-radius: 10px;
        border: 1px solid rgba(128, 128, 128, 0.2);
        background: rgba(255, 255, 255, 0.97);
        color: #222;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 13px;
        padding: 0;
        display: none;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      #${PANEL_ID}.visible {
        display: block;
      }
      .dark #${PANEL_ID} {
        background: rgba(30, 30, 34, 0.97);
        color: #ddd;
        border-color: rgba(128, 128, 128, 0.15);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
      }

      #${PANEL_ID} .outline-header {
        padding: 10px 14px 8px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: #888;
        border-bottom: 1px solid rgba(128, 128, 128, 0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .dark #${PANEL_ID} .outline-header {
        color: #777;
        border-bottom-color: rgba(128, 128, 128, 0.12);
      }

      #${PANEL_ID} .outline-header .outline-count {
        font-weight: 400;
        font-size: 10px;
        color: #aaa;
      }
      .dark #${PANEL_ID} .outline-header .outline-count {
        color: #666;
      }

      #${PANEL_ID} .outline-list {
        list-style: none;
        margin: 0;
        padding: 6px 0;
      }

      #${PANEL_ID} .outline-item {
        padding: 5px 14px;
        cursor: pointer;
        transition: background 0.15s;
        line-height: 1.4;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-left: 2px solid transparent;
      }
      #${PANEL_ID} .outline-item:hover {
        background: rgba(0, 0, 0, 0.04);
        border-left-color: #666;
      }
      .dark #${PANEL_ID} .outline-item:hover {
        background: rgba(255, 255, 255, 0.05);
        border-left-color: #888;
      }

      #${PANEL_ID} .outline-item[data-level="1"] {
        font-weight: 600;
        font-size: 13px;
        padding-left: 14px;
      }
      #${PANEL_ID} .outline-item[data-level="2"] {
        font-weight: 500;
        font-size: 12.5px;
        padding-left: 26px;
      }
      #${PANEL_ID} .outline-item[data-level="3"] {
        font-weight: 400;
        font-size: 12px;
        padding-left: 38px;
        color: #555;
      }
      .dark #${PANEL_ID} .outline-item[data-level="3"] {
        color: #999;
      }
      #${PANEL_ID} .outline-item[data-level="4"] {
        font-weight: 400;
        font-size: 11.5px;
        padding-left: 50px;
        color: #777;
      }
      .dark #${PANEL_ID} .outline-item[data-level="4"] {
        color: #777;
      }

      #${PANEL_ID} .outline-empty {
        padding: 20px 14px;
        text-align: center;
        color: #999;
        font-size: 12px;
      }
      .dark #${PANEL_ID} .outline-empty {
        color: #666;
      }

      #${PANEL_ID}::-webkit-scrollbar {
        width: 4px;
      }
      #${PANEL_ID}::-webkit-scrollbar-track {
        background: transparent;
      }
      #${PANEL_ID}::-webkit-scrollbar-thumb {
        background: rgba(128, 128, 128, 0.25);
        border-radius: 4px;
      }
      #${PANEL_ID}::-webkit-scrollbar-thumb:hover {
        background: rgba(128, 128, 128, 0.4);
      }
    `;
    document.head.appendChild(style);
  }

  // ── Create UI Elements ─────────────────────────────────────────────────────
  function createToggleButton() {
    if (document.getElementById(TOGGLE_ID)) return;
    const btn = document.createElement('button');
    btn.id = TOGGLE_ID;
    btn.title = 'Toggle Page Outline';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="11" y2="18"/></svg>`;
    btn.addEventListener('click', togglePanel);
    document.body.appendChild(btn);
  }

  function createPanel() {
    if (document.getElementById(PANEL_ID)) return;
    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="outline-header">
        <span>Page Outline</span>
        <span class="outline-count"></span>
      </div>
      <ul class="outline-list"></ul>
    `;
    document.body.appendChild(panel);
  }

  // ── Toggle Logic ───────────────────────────────────────────────────────────
  let panelVisible = false;

  function togglePanel() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    panelVisible = !panelVisible;
    panel.classList.toggle('visible', panelVisible);
    if (panelVisible) refreshOutline();
  }

  // ── Find the chat scroll container ─────────────────────────────────────────
  function getChatContainer() {
    // Try common TypingMind chat area selectors
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
    // Fallback: find the largest scrollable container in the center of the page
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

      // Give each heading a unique ID for scroll targeting
      if (!h.id) {
        h.id = `tm-outline-heading-${i}-${Date.now()}`;
      }

      results.push({
        text: text,
        level: level,
        id: h.id,
        element: h,
      });
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
    countEl.textContent = headings.length ? `${headings.length} items` : '';

    if (headings.length === 0) {
      list.innerHTML = '<li class="outline-empty">No headings found in this chat.</li>';
      return;
    }

    // Normalize levels: find the minimum heading level used and treat it as level 1
    const minLevel = Math.min(...headings.map((h) => h.level));

    headings.forEach((h) => {
      const li = document.createElement('li');
      li.className = 'outline-item';
      li.setAttribute('data-level', Math.min(h.level - minLevel + 1, 4));
      li.textContent = h.text;
      li.title = h.text;
      li.addEventListener('click', () => {
        h.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Brief highlight flash
        const prev = h.element.style.transition;
        const prevBg = h.element.style.backgroundColor;
        h.element.style.transition = 'background-color 0.3s';
        h.element.style.backgroundColor = 'rgba(255, 200, 0, 0.2)';
        setTimeout(() => {
          h.element.style.backgroundColor = prevBg || '';
          setTimeout(() => {
            h.element.style.transition = prev || '';
          }, 300);
        }, 1200);
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
    const observer = new MutationObserver(() => {
      scheduleRefresh();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // ── Keyboard shortcut: Ctrl+Shift+O to toggle ─────────────────────────────
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
    createPanel();
    startObserver();
    document.addEventListener('keydown', handleKeydown);
    console.log('[Page Outline] Extension loaded. Toggle with button or Ctrl+Shift+O');
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
