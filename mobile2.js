// TypingMind Extension: Mobile workspace CSS injector
// File: mobile-workspace-fix.js
(function () {
  const STYLE_ID = 'tm-mobile-workspace-fix-style';

  // Your CSS, unchanged, with proper escaping for special characters in the selector
  const css = `
@media (max-width:499.995px){
  /* var(  workspace height) */
  #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\]{
    bottom:-780px;
    top:793px;
    position:fixed;
  }
}
`;

  function injectCSS() {
    if (document.getElementById(STYLE_ID)) return; // avoid duplicates
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.type = 'text/css';
    style.textContent = css;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCSS);
  } else {
    injectCSS();
  }
})();
