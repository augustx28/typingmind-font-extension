/* TypingMind Extension: Mobile Workspace Height Fix
   Purpose: apply your CSS snippet as a style tag at load time.
   Scope: only affects mobile width (≤ 640px) via media query.
*/
(() => {
  const STYLE_ID = 'tm-ext-workspace-mobile-fix';

  function inject() {
    // Prevent duplicate injection
    if (document.getElementById(STYLE_ID)) return;

    // Your CSS, with an added 100vh fallback before 100svh
    const css = `
/* Mobile: make workspace height correct again */
@media (max-width: 640px) {
  /* Prefer modern dynamic viewport height, then fall back to vh */
  :root {
    --workspace-height: 100vh !important;
    --workspace-height: 100svh !important;
    --workspace-width: 100vw !important;
  }
}
`;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // Optional: mark document for debugging
    document.documentElement.setAttribute('data-tm-ext-workspace-mobile-fix', '1');
    console.info('[TypingMind Ext] Workspace mobile height fix injected.');
  }

  if (document.head) {
    inject();
  } else {
    document.addEventListener('DOMContentLoaded', inject, { once: true });
  }
})();
