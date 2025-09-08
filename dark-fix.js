(() => {
  const EXT_ID = 'tm-dark-targets-v1';
  const DARK_BG = '#161616';

  // Only apply when TypingMind is in dark mode
  const css = `
    /* Dark mode only, set background color for the exact targets you provided */
    .dark :is(
      .md\\:flex .overflow-y-auto .resize-container,
      .resize-container .flex-col .dark\\:bg-\\[--main-dark-color\\],
      #nav-handler .transition-all .overflow-y-auto > .dark\\:bg-\\[--main-dark-color\\],
      #nav-handler .transition-all .\\@container,
      #__next .custom-theme
    ) {
      background-color: ${DARK_BG} !important;
    }
  `;

  function install() {
    let style = document.getElementById(EXT_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = EXT_ID;
      style.textContent = css;
      document.head.appendChild(style);
    } else {
      style.textContent = css;
    }
  }

  if (document.readyState === 'loading')) {
    document.addEventListener('DOMContentLoaded', install);
  } else {
    install();
  }
})();
