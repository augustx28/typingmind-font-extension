// File: tm-mobile-transform-fix.js
// Purpose: Inject a mobile-only CSS rule into TypingMind

(function injectMobileCss() {
  const STYLE_ID = 'tm-mobile-transform-fix';

  // Avoid duplicate injection
  if (document.getElementById(STYLE_ID)) return;

  // Use String.raw to keep your bracket-escaped Tailwind class intact
  const css = String.raw`
@media (max-width: 499.995px) {
  /* var(--workspace-height) */
  #nav-handler .transition .h-\[var\(--workspace-height\)\] {
    /* Your original intent: reset any transform on small screens */
    transform: translateX(0px) translateY(0px);
  }
}
`;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = css;
  document.head.appendChild(style);

  // Optional: small log so you can confirm it loaded
  console.log('[TypingMind Ext] Mobile CSS injected:', STYLE_ID);
})();
