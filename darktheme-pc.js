(() => {
  const EXT_ID = 'custom-dark-theme-only-v2';
  const COLOR = '#262626';

  // ─── OS-level theme detection ───────────────────────────────────────────────
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  // ─── Dark Mode CSS ───────────────────────────────────────────────────────────
  const darkCSS = `
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
    /* 5) #__next .custom-theme */
    html.dark #__next .custom-theme,
    body.dark #__next .custom-theme,
    .dark #__next .custom-theme {
      background-color: ${COLOR} !important;
    }
    /* 6) .overflow-auto div .lg:sticky */
    html.dark .overflow-auto div .lg\\:sticky,
    body.dark .overflow-auto div .lg\\:sticky,
    .dark .overflow-auto div .lg\\:sticky {
      background-color: ${COLOR} !important;
    }
    /* 7) .overflow-auto div .sticky */
    html.dark .overflow-auto div .sticky,
    body.dark .overflow-auto div .sticky,
    .dark .overflow-auto div .sticky {
      background-color: ${COLOR} !important;
    }
    /* 8) .md:pl-[--current-sidebar-width] .text-sm .dark:bg-[--main-dark-color] (Transparent) */
    html.dark .md\\:pl-\\[--current-sidebar-width\\] .text-sm .dark\\:bg-\\[--main-dark-color\\],
    body.dark .md\\:pl-\\[--current-sidebar-width\\] .text-sm .dark\\:bg-\\[--main-dark-color\\],
    .dark .md\\:pl-\\[--current-sidebar-width\\] .text-sm .dark\\:bg-\\[--main-dark-color\\] {
      background-color: rgba(27,29,33,0) !important;
    }
    /* 9) .md:pl-[--current-sidebar-width] .overflow-y-auto .@container */
    html.dark .md\\:pl-\\[--current-sidebar-width\\] .overflow-y-auto .\\@container,
    body.dark .md\\:pl-\\[--current-sidebar-width\\] .overflow-y-auto .\\@container,
    .dark .md\\:pl-\\[--current-sidebar-width\\] .overflow-y-auto .\\@container {
      background-color: ${COLOR} !important;
    }
    /* 10) NEW: .@container .w-full .overflow-auto — dark mode only */
    html.dark .\\@container .w-full .overflow-auto,
    body.dark .\\@container .w-full .overflow-auto,
    .dark .\\@container .w-full .overflow-auto {
      background-color: #141414 !important;
    }
  `;

  // ─── Light Mode CSS ──────────────────────────────────────────────────────────
  const lightCSS = `
    /* NEW: .@container .items-start .overflow-auto — light mode only */
    .\\@container .items-start .overflow-auto {
      background-color: #e8e8e8 !important;
      color: #000000 !important;
    }
  `;

  // ─── Inject / update the style tag ──────────────────────────────────────────
  function upsertStyle() {
    const isDark = mq.matches;
    let style = document.getElementById(EXT_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = EXT_ID;
      document.head.appendChild(style);
    }
    style.textContent = isDark ? darkCSS : lightCSS;
  }

  // ─── Init + observers ────────────────────────────────────────────────────────
  function init() {
    upsertStyle();

    // Re-apply if TypingMind toggles .dark class on html/body
    const watchTargets = [document.documentElement, document.body].filter(Boolean);
    const observer = new MutationObserver(upsertStyle);
    for (const t of watchTargets) {
      observer.observe(t, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    }

    // Re-apply if OS theme changes
    mq.addEventListener('change', upsertStyle);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
