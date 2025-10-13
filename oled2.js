(() => {
  const EXT_ID = 'oled';
  const COLOR = '#000000';

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

    /* 8) .md:pl-[--current-sidebar-width] .text-sm .dark:bg-[--main-dark-color] */
    html.dark .md\\:pl-\\[--current-sidebar-width\\] .text-sm .dark\\:bg-\\[--main-dark-color\\],
    body.dark .md\\:pl-\\[--current-sidebar-width\\] .text-sm .dark\\:bg-\\[--main-dark-color\\],
    .dark .md\\:pl-\\[--current-sidebar-width\\] .text-sm .dark\\:bg-\\[--main-dark-color\\] {
      background-color: rgba(27,29,33,0) !important;
    }

    /* 9) Chat input textbox */
    html.dark #chat-input-textbox,
    body.dark #chat-input-textbox,
    .dark #chat-input-textbox {
      background-color: rgba(40,40,40,0) !important;
    }

    /* 10) Justify between */
    html.dark .transition-all div .transition-colors .w-full .w-full .justify-between,
    body.dark .transition-all div .transition-colors .w-full .w-full .justify-between,
    .dark .transition-all div .transition-colors .w-full .w-full .justify-between {
      background-color: ${COLOR} !important;
    }

    /* 11) Workspace color */
    html.dark .transition .flex-col .bg-\\[--workspace-color\\],
    body.dark .transition .flex-col .bg-\\[--workspace-color\\],
    .dark .transition .flex-col .bg-\\[--workspace-color\\] {
      background-color: ${COLOR} !important;
    }

    /* 12) Navigation */
    html.dark #__next .custom-theme #nav-handler .transition .flex-col .flex-col nav,
    body.dark #__next .custom-theme #nav-handler .transition .flex-col .flex-col nav,
    .dark #__next .custom-theme #nav-handler .transition .flex-col .flex-col nav {
      background-color: ${COLOR} !important;
    }

    /* 13) var(--workspace-height) container */
    html.dark #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\],
    body.dark #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\],
    .dark #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
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
