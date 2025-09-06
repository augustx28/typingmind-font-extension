// file: mobile-nav-shift.js
(() => {
  // 1) Your CSS, with special characters escaped for a JS string
  const CSS = `
@media (max-width: 499.995px) {
  /* var(--workspace-height) */
  #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
    /* Use translate with two arguments for clarity */
    transform: translate(0px, 794px) !important;
  }
}
  `.trim();

  // 2) Inject <style> once
  const STYLE_ID = 'tm-ext-mobile-nav-shift';
  const inject = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  };

  // 3) Run when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  // 4) Optional cleanup helper you can call from DevTools if needed
  window.__removeTmMobileNavShift = () => {
    const el = document.getElementById(STYLE_ID);
    if (el) el.remove();
  };
})();
