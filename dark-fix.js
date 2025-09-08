// TypingMind Extension: Dark Mode Color Patch (colors only)
// Install this as a TypingMind Extension via URL or paste into your extension host
(() => {
  const EXT_ID = 'tm-dark-only-color-patch';
  const COLOR = '#161616';

  // CSS rules: only dark mode, only your target selectors, only background color
  const css = `
/* Scope to dark mode only, support both class and data-theme */
:is(html.dark, body.dark, html[data-theme="dark"], body[data-theme="dark"]) .md\\:flex .overflow-y-auto .resize-container {
  background-color: ${COLOR} !important;
}

:is(html.dark, body.dark, html[data-theme="dark"], body[data-theme="dark"]) .resize-container .flex-col .dark\\:bg-\\[--main-dark-color\\] {
  /* Use the same Tailwind variable the element already relies on */
  --main-dark-color: ${COLOR};
  background-color: var(--main-dark-color) !important;
}

:is(html.dark, body.dark, html[data-theme="dark"], body[data-theme="dark"]) #nav-handler .transition-all .overflow-y-auto > .dark\\:bg-\\[--main-dark-color\\] {
  --main-dark-color: ${COLOR};
  background-color: var(--main-dark-color) !important;
}

/* No other properties are changed. No sizing, spacing, transforms, or overflow edits. */
`;

  function upsertStyle() {
    let styleEl = document.getElementById(EXT_ID);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = EXT_ID;
      styleEl.setAttribute('data-extension', 'TypingMind: Dark Mode Color Patch');
      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    } else {
      styleEl.textContent = css;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', upsertStyle);
  } else {
    upsertStyle();
  }
})();
