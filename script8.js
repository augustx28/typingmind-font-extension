/* == TypingMind Extension: transition-all fix ===========================
   Paste this file’s public HTTPS URL into TypingMind “Extensions”.
   It adds your custom CSS at app start.
========================================================================= */

(function applyCustomCSS() {
  const css = `
  /* ---------- start of your CSS ---------- */
  /* Transition all */
  .transition-all:nth-child(3) > .transition-all:nth-child(1){
    position: relative;
    bottom: -30px;
    transform: translateX(0px) translateY(0px);
  }
  /* ----------- end of your CSS ----------- */
  `;

  // Avoid double-injection if the script runs more than once
  if (document.head.querySelector('#tm-transition-fix')) return;

  const styleTag = document.createElement('style');
  styleTag.id = 'tm-transition-fix';
  styleTag.textContent = css;
  document.head.appendChild(styleTag);
})();
