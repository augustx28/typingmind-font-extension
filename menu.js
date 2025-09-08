// typingmind-custom-colors.js
// W, this injects CSS to recolor your specified elements.
// It targets text and SVG icons (color, fill, stroke).

(function injectTmCss() {
  const STYLE_ID = 'tm-ext-custom-colors-v1';

  if (document.getElementById(STYLE_ID)) return;

  const css = `
/* Centralize your colors here */
:root {
  --tm-primary-dark: #191919;   /* used for 1st and 3rd targets */
  --tm-folder-color: #DA9010;   /* used for folder items */
}

/* ---------------------------------------------------------
   1) Element: .h-[var(--workspace-height)].sm:block.md:flex-col
      Fallback also provided for the single-dash variant you typed.
   --------------------------------------------------------- */
.h-\\[var\\(--workspace-height\\)\\].sm\\:block.md\\:flex-col,
.h-\\[var\\(-workspace-height\\)\\].sm\\:block.md\\:flex-col {
  color: var(--tm-primary-dark) !important;
}
.h-\\[var\\(--workspace-height\\)\\].sm\\:block.md\\:flex-col svg,
.h-\\[var\\(-workspace-height\\)\\].sm\\:block.md\\:flex-col svg {
  color: var(--tm-primary-dark) !important;
  fill: currentColor !important;
  stroke: currentColor !important;
}

/* ---------------------------------------------------------
   2) Folders: .md:max-w-[calc(var(--sidebar-width)-var(--workspace-width))] div .h-6
      This should recolor folder rows or icons inside .h-6.
      Includes fallback for single-dash variables.
   --------------------------------------------------------- */
.md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)\\-var\\(--workspace-width\\)\\)\\] div .h-6,
.md\\:max-w-\\[calc\\(var\\(-sidebar-width\\)\\-var\\(-workspace-width\\)\\)\\] div .h-6 {
  color: var(--tm-folder-color) !important;
}
.md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)\\-var\\(--workspace-width\\)\\)\\] div .h-6 svg,
.md\\:max-w-\\[calc\\(var\\(-sidebar-width\\)\\-var\\(-workspace-width\\)\\)\\] div .h-6 svg {
  color: var(--tm-folder-color) !important;
  fill: currentColor !important;
  stroke: currentColor !important;
}

/* ---------------------------------------------------------
   3) Element chain: .transition .flex-col .md:pl-[--workspace-width]
      Added the more likely Tailwind form md:pl-[var(--workspace-width)]
      and kept your original as a fallback.
   --------------------------------------------------------- */
.transition .flex-col .md\\:pl-\\[var\\(--workspace-width\\)\\],
.transition .flex-col .md\\:pl-\\[\\-\\-workspace-width\\] {
  color: var(--tm-primary-dark) !important;
}
.transition .flex-col .md\\:pl-\\[var\\(--workspace-width\\)\\] svg,
.transition .flex-col .md\\:pl-\\[\\-\\-workspace-width\\] svg {
  color: var(--tm-primary-dark) !important;
  fill: currentColor !important;
  stroke: currentColor !important;
}
  `.trim();

  const styleEl = document.createElement('style');
  styleEl.id = STYLE_ID;
  styleEl.textContent = css;

  const append = () => document.head ? document.head.appendChild(styleEl) : document.addEventListener('DOMContentLoaded', () => document.head.appendChild(styleEl));
  append();

  // Optional safeguard so your CSS stays applied even if the node is removed.
  const mo = new MutationObserver(() => {
    if (!document.getElementById(STYLE_ID)) append();
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
