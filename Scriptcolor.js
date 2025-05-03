// ==UserScript==
// @name         TypingMind Dark-Gray (ChatGPT) Theme
// @description  Re-color TypingMind menu + dashboard to match ChatGPT dark mode
// @match        *://typingmind.*/*
// @grant        none
// ==/UserScript==

(() => {
  const css = `
  :root {
    --tm-bg-root:        #202123;
    --tm-bg-surface-1:   #343541;
    --tm-bg-surface-2:   #2E2F31;
    --tm-border:         #3E3F4B;
    --tm-text-primary:   #ECECF1;
    --tm-text-muted:     #B3B8C3;
    --tm-accent:         #10A37F;
  }

  /* Root backgrounds */
  body,
  .tm-dashboard,
  .tm-chat-area {
    background-color: var(--tm-bg-surface-1) !important;
    color: var(--tm-text-primary) !important;
  }

  /* Sidebar / menu */
  .tm-menu,
  .tm-sidebar {
    background-color: var(--tm-bg-root) !important;
    color: var(--tm-text-primary) !important;
  }

  /* Cards, list items, and hover states */
  .tm-dashboard-card,
  .tm-menu-item {
    background-color: transparent !important;
    transition: background-color 120ms ease;
  }
  .tm-dashboard-card:hover,
  .tm-menu-item:hover {
    background-color: var(--tm-bg-surface-2) !important;
  }

  /* Borders & dividers */
  .tm-divider,
  .tm-menu-item + .tm-menu-item,
  .tm-dashboard-card {
    border-color: var(--tm-border) !important;
  }

  /* Buttons & links */
  .tm-button,
  .tm-link,
  .tm-menu-item-active {
    color: var(--tm-accent) !important;
  }
  .tm-button--primary {
    background-color: var(--tm-accent) !important;
    color: #ffffff !important;
  }

  /* Scrollbars (optional, comment out if undesired) */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--tm-bg-root);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--tm-border);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--tm-accent);
  }
  `;
  const styleTag = document.createElement('style');
  styleTag.id = 'tm-chatgpt-dark';
  styleTag.textContent = css;
  document.head.appendChild(styleTag);
})();
