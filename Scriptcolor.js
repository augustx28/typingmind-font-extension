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

  /*
