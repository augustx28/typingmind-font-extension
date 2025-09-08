// TypingMind Extension: color overrides for specific elements
// Colors:
// - Folders: #DA9010
// - Other targets: #191919

(() => {
  const STYLE_ID = 'tm-ext-color-patch';
  const css = `
/* 1) Folders inside the max-width container */
.md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\] div .h-6 {
  color: #DA9010 !important;
  fill: #DA9010 !important;
  stroke: #DA9010 !important;
}

/* 2) Element with md:pl-[--workspace-width] inside .transition .flex-col */
.transition .flex-col .md\\:pl-\\[--workspace-width\\] {
  color: #191919 !important;
  fill: #191919 !important;
  stroke: #191919 !important;
}

/* 3) Inside #nav-handler, element with h-[var(--workspace-height)] */
#nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
  color: #191919 !important;
  fill: #191919 !important;
  stroke: #191919 !important;
}
  `.trim();

  function injectStyle() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = css;
      document.head.appendChild(style);
    } else {
      style.textContent = css; // keep in sync if you update css string
    }
  }

  // Inject once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyle);
  } else {
    injectStyle();
  }

  // Ensure the style remains present if the app re-renders or the head is replaced
  const observer = new MutationObserver(() => {
    if (!document.getElementById(STYLE_ID)) injectStyle();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
