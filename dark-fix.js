(() => {
  const extensionId = 'custom-dark-theme-only';

  // Dark mode colors only, no layout changes
  const customCSS = `
    /* ===============================
       Dark mode color palette
       =============================== */
    :is(html.dark, [data-theme="dark"]) {
      --tmc-bg: #161616;        /* page background */
      --tmc-surface: #161616;   /* panels, scroll areas */
      --tmc-surface-2: #161616; /* optional secondary surface */
    }

    /* ===============================
       Scope to TypingMind app only
       =============================== */
    :is(html.dark, [data-theme="dark"]) #__next .custom-theme,
    :is(html.dark, [data-theme="dark"]) .custom-theme {
      background-color: var(--tmc-bg) !important;
    }

    /* Key UI surfaces: keep to background only */
    :is(html.dark, [data-theme="dark"]) #__next .custom-theme :is(
      header,
      nav,
      aside,
      main,
      footer,
      .overflow-y-auto,
      .relative
    ) {
      background-color: var(--tmc-surface) !important;
    }

    /* Optional: code blocks and preformatted areas for readability */
    :is(html.dark, [data-theme="dark"]) #__next .custom-theme :is(pre, code) {
      background-color: #0f0f0f !important;
    }

    /* Safety: never set transform, position, display, or sizing here */
  `;

  function upsertStyle() {
    let styleEl = document.getElementById(extensionId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = extensionId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = customCSS;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', upsertStyle);
  } else {
    upsertStyle();
  }
})();
