(() => {
  const EXT_ID = 'custom-dark-theme-only-v2';
  const COLOR = '#161616';

  // Only color tweaks, only in dark mode, for exactly the selectors you listed
  const css = `
    /* Scope to dark mode on html, body, or any ancestor with .dark */
    /* 1) .md:flex .overflow-y-auto .resize-container */
    html.dark .md\\:flex .overflow-y-auto .resize-container,
    body.dark .md\\:flex .overflow-y-auto .resize-container,
    .dark .md\\:flex .overflow-y-auto .resize-container {
      background-color: ${COLOR} !important;
    }

    /* 2) .resize-container .flex-col .dark:bg-[--main-dark-color] */
    html.dark .resize-container .flex-col .dark\\:bg-\\[--main-dark-color\\],
    body.dark .resize-container .flex-col .dark\\:bg-\\[--main-dark-color\\],
    .dark .resize-container .flex-col .dark\\:bg-\\[--main-dark-color\\] {
      background-color: ${COLOR} !important;
    }

    /* 3) #nav-handler .transition-all .overflow-y-auto > .dark:bg-[--main-dark-color] */
    html.dark #nav-handler .transition-all .overflow-y-auto > .dark\\:bg-\\[--main-dark-color\\],
    body.dark #nav-handler .transition-all .overflow-y-auto > .dark\\:bg-\\[--main-dark-color\\],
    .dark #nav-handler .transition-all .overflow-y-auto > .dark\\:bg-\\[--main-dark-color\\] {
      background-color: ${COLOR} !important;
    }

    /* 4) #nav-handler .transition-all .@container */
    html.dark #nav-handler .transition-all .\\@container,
    body.dark #nav-handler .transition-all .\\@container,
    .dark #nav-handler .transition-all .\\@container {
      background-color: ${COLOR} !important;
    }
  `;

  function upsertStyle() {
    let style = document.getElementById(EXT_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = EXT_ID;
      document.head.appendChild(style);
    }
    style.textContent = css;
  }

  function init() {
    upsertStyle();

    // Optional: if your app toggles dark mode by changing classes or data-theme,
    // this keeps the CSS active without touching layout
    const watchTargets = [document.documentElement, document.body].filter(Boolean);
    const observer = new MutationObserver(upsertStyle);
    for (const t of watchTargets) {
      observer.observe(t, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
