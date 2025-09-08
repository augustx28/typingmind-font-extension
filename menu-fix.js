// File: mobile-layout-fix.js
// Purpose: Inject custom CSS for small screens in TypingMind

(function () {
  const STYLE_ID = 'tm-ext-mobile-layout-fix-style';

  // Use String.raw to preserve backslashes in escaped CSS selectors
  const css = String.raw`
@media (max-width:499.995px){
  /* var(  workspace height) */
  #nav-handler .transition .h-\[var\(--workspace-height\)\]{
    bottom: 0px !important;
    top: 730px !important;
    position: fixed !important;
    right: 0px !important;
  }
}
  `;

  function install() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
    console.info('[TypingMind Extension] Mobile layout CSS injected.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();
