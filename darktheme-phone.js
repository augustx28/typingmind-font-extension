(() => {
  const EXT_ID = 'custom-dark-theme-only-v3';
  const COLOR = '#161616';

  const DARK_USER_BG = '#262525';
  const DARK_USER_TEXT = '#dfdedb';
  const LIGHT_USER_BG = '#2563eb'; // Tailwind bg-blue-600
  const LIGHT_USER_TEXT = '#ffffff';

  const css = `
    /* Scope to dark mode on html, body, or any ancestor with .dark */

    /* 1) .md:flex .overflow-y-auto .resize-container */
    html.dark .md\\:flex .overflow-y-auto .resize-container,
    body.dark .md\\:flex .overflow-y-auto .resize-container,
    .dark .md\\:flex .overflow-y-auto .resize-container,
    html[data-theme="dark"] .md\\:flex .overflow-y-auto .resize-container,
    body[data-theme="dark"] .md\\:flex .overflow-y-auto .resize-container,
    [data-theme="dark"] .md\\:flex .overflow-y-auto .resize-container {
      background-color: ${COLOR} !important;
    }

    /* 2) .resize-container .flex-col .dark:bg-[--main-dark-color] */
    html.dark .resize-container .flex-col .dark\\:bg-\\[--main-dark-color\\],
    body.dark .resize-container .flex-col .dark\\:bg-\\[--main-dark-color\\],
    .dark .resize-container .flex-col .dark\\:bg-\\[--main-dark-color\\],
    html[data-theme="dark"] .resize-container .flex-col .dark\\:bg-\\[--main-dark-color\\],
    body[data-theme="dark"] .resize-container .flex-col .dark\\:bg-\\[--main-dark-color\\],
    [data-theme="dark"] .resize-container .flex-col .dark\\:bg-\\[--main-dark-color\\] {
      background-color: ${COLOR} !important;
    }

    /* 3) #nav-handler .transition-all .overflow-y-auto > .dark:bg-[--main-dark-color] */
    html.dark #nav-handler .transition-all .overflow-y-auto > .dark\\:bg-\\[--main-dark-color\\],
    body.dark #nav-handler .transition-all .overflow-y-auto > .dark\\:bg-\\[--main-dark-color\\],
    .dark #nav-handler .transition-all .overflow-y-auto > .dark\\:bg-\\[--main-dark-color\\],
    html[data-theme="dark"] #nav-handler .transition-all .overflow-y-auto > .dark\\:bg-\\[--main-dark-color\\],
    body[data-theme="dark"] #nav-handler .transition-all .overflow-y-auto > .dark\\:bg-\\[--main-dark-color\\],
    [data-theme="dark"] #nav-handler .transition-all .overflow-y-auto > .dark\\:bg-\\[--main-dark-color\\] {
      background-color: ${COLOR} !important;
    }

    /* 4) #nav-handler .transition-all .@container */
    html.dark #nav-handler .transition-all .\\@container,
    body.dark #nav-handler .transition-all .\\@container,
    .dark #nav-handler .transition-all .\\@container,
    html[data-theme="dark"] #nav-handler .transition-all .\\@container,
    body[data-theme="dark"] #nav-handler .transition-all .\\@container,
    [data-theme="dark"] #nav-handler .transition-all .\\@container {
      background-color: ${COLOR} !important;
    }

    /* 5) #__next .custom-theme */
    html.dark #__next .custom-theme,
    body.dark #__next .custom-theme,
    .dark #__next .custom-theme,
    html[data-theme="dark"] #__next .custom-theme,
    body[data-theme="dark"] #__next .custom-theme,
    [data-theme="dark"] #__next .custom-theme {
      background-color: ${COLOR} !important;
    }

    /* 6) .overflow-auto div .lg:sticky */
    html.dark .overflow-auto div .lg\\:sticky,
    body.dark .overflow-auto div .lg\\:sticky,
    .dark .overflow-auto div .lg\\:sticky,
    html[data-theme="dark"] .overflow-auto div .lg\\:sticky,
    body[data-theme="dark"] .overflow-auto div .lg\\:sticky,
    [data-theme="dark"] .overflow-auto div .lg\\:sticky {
      background-color: ${COLOR} !important;
    }

    /* 7) .overflow-auto div .sticky */
    html.dark .overflow-auto div .sticky,
    body.dark .overflow-auto div .sticky,
    .dark .overflow-auto div .sticky,
    html[data-theme="dark"] .overflow-auto div .sticky,
    body[data-theme="dark"] .overflow-auto div .sticky,
    [data-theme="dark"] .overflow-auto div .sticky {
      background-color: ${COLOR} !important;
    }

    /* 8) .md:pl-[--current-sidebar-width] .text-sm .dark:bg-[--main-dark-color] */
    html.dark .md\\:pl-\\[--current-sidebar-width\\] .text-sm .dark\\:bg-\\[--main-dark-color\\],
    body.dark .md\\:pl-\\[--current-sidebar-width\\] .text-sm .dark\\:bg-\\[--main-dark-color\\],
    .dark .md\\:pl-\\[--current-sidebar-width\\] .text-sm .dark\\:bg-\\[--main-dark-color\\],
    html[data-theme="dark"] .md\\:pl-\\[--current-sidebar-width\\] .text-sm .dark\\:bg-\\[--main-dark-color\\],
    body[data-theme="dark"] .md\\:pl-\\[--current-sidebar-width\\] .text-sm .dark\\:bg-\\[--main-dark-color\\],
    [data-theme="dark"] .md\\:pl-\\[--current-sidebar-width\\] .text-sm .dark\\:bg-\\[--main-dark-color\\] {
      background-color: rgba(27,29,33,0) !important;
    }

    /* 9) .md:pl-[--current-sidebar-width] .overflow-y-auto .@container */
    html.dark .md\\:pl-\\[--current-sidebar-width\\] .overflow-y-auto .\\@container,
    body.dark .md\\:pl-\\[--current-sidebar-width\\] .overflow-y-auto .\\@container,
    .dark .md\\:pl-\\[--current-sidebar-width\\] .overflow-y-auto .\\@container,
    html[data-theme="dark"] .md\\:pl-\\[--current-sidebar-width\\] .overflow-y-auto .\\@container,
    body[data-theme="dark"] .md\\:pl-\\[--current-sidebar-width\\] .overflow-y-auto .\\@container,
    [data-theme="dark"] .md\\:pl-\\[--current-sidebar-width\\] .overflow-y-auto .\\@container {
      background-color: ${COLOR} !important;
    }

    /* 10) USER MESSAGE - DARK MODE ONLY */
    html.dark [data-element-id="user-message"],
    body.dark [data-element-id="user-message"],
    .dark [data-element-id="user-message"],
    html[data-theme="dark"] [data-element-id="user-message"],
    body[data-theme="dark"] [data-element-id="user-message"],
    [data-theme="dark"] [data-element-id="user-message"] {
      background-color: ${DARK_USER_BG} !important;
      color: ${DARK_USER_TEXT} !important;
    }

    html.dark [data-element-id="user-message"] *,
    body.dark [data-element-id="user-message"] *,
    .dark [data-element-id="user-message"] *,
    html[data-theme="dark"] [data-element-id="user-message"] *,
    body[data-theme="dark"] [data-element-id="user-message"] *,
    [data-theme="dark"] [data-element-id="user-message"] * {
      color: inherit !important;
    }

    /* 11) USER MESSAGE - LIGHT MODE ONLY */
    html:not(.dark)[data-theme="light"] [data-element-id="user-message"],
    body:not(.dark)[data-theme="light"] [data-element-id="user-message"],
    [data-theme="light"] [data-element-id="user-message"],
    html:not(.dark) [data-element-id="user-message"],
    body:not(.dark) [data-element-id="user-message"] {
      background-color: ${LIGHT_USER_BG} !important;
      color: ${LIGHT_USER_TEXT} !important;
    }

    html:not(.dark)[data-theme="light"] [data-element-id="user-message"] *,
    body:not(.dark)[data-theme="light"] [data-element-id="user-message"] *,
    [data-theme="light"] [data-element-id="user-message"] *,
    html:not(.dark) [data-element-id="user-message"] *,
    body:not(.dark) [data-element-id="user-message"] * {
      color: inherit !important;
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

    const watchTargets = [document.documentElement, document.body].filter(Boolean);
    const observer = new MutationObserver(upsertStyle);

    for (const t of watchTargets) {
      observer.observe(t, {
        attributes: true,
        attributeFilter: ['class', 'data-theme']
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
