// TypingMind Extension: inject mobile CSS for #nav-handler section
(function injectMobileNavCSS() {
  const STYLE_ID = 'tm-ext-mobile-nav-handler-fix';

  const css = `
@media (max-width: 499.995px) {
  /* var( workspace height ) */
  #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\]{
    bottom: 0px;
    top: 710px;
    position: fixed;
    right: 0px;
  }
}
`.trim();

  // Create or update a dedicated <style> tag
  const upsertStyle = () => {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent = css;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', upsertStyle);
  } else {
    upsertStyle();
  }
})();
