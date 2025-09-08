(() => {
  // A clean, color-only override for dark mode
  const EXTENSION_STYLE_ID = 'tm-dark-color-override-v2';
  const DARK = '#161616';

  const css = `
/* Apply only when the app is in dark mode */
html.dark .md\\:flex .overflow-y-auto .resize-container {
  background-color: ${DARK} !important;
}
html.dark .resize-container .flex-col .dark\\:bg-\\[--main-dark-color\\] {
  background-color: ${DARK} !important;
}

/* Optional: support alternative dark indicator if TypingMind uses data-theme */
html[data-theme="dark"] .md\\:flex .overflow-y-auto .resize-container {
  background-color: ${DARK} !important;
}
html[data-theme="dark"] .resize-container .flex-col .dark\\:bg-\\[--main-dark-color\\] {
  background-color: ${DARK} !important;
}
`.trim();

  function inject() {
    let style = document.getElementById(EXTENSION_STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = EXTENSION_STYLE_ID;
      style.textContent = css;
      document.head.appendChild(style);
    } else {
      style.textContent = css;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
