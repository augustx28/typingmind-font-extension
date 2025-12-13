(function() {
  const style = document.createElement('style');
  style.innerHTML = `
    /* =========================================
       1. Folder Icon Color (#DA9010)
       ========================================= */
    svg.text-slate-400 {
      color: #DA9010 !important;
    }

    /* =========================================
       2. Background & Workspace Colors
       ========================================= */

    /* Overflow hidden area */
    .md\\:pl-\\[--workspace-width\\] .flex-shrink-0 .bg-\\[--workspace-color\\] .justify-center > .overflow-hidden {
      background-color: #38383c !important;
    }

    /* Nav handler sidebar height container */
    #nav-handler .md\\:w-\\[--sidebar-width\\] .h-\\[var\\(--workspace-height\\)\\] {
      background-color: #191919 !important;
    }

    /* Main workspace background */
    .md\\:w-auto .flex-col .bg-\\[--workspace-color\\] {
      background-color: #191919 !important;
    }

    /* Transition opacity layer */
    .md\\:w-auto .flex-col .flex-col .md\\:pl-\\[--workspace-width\\] > .transition-opacity {
      background-color: #191919 !important;
    }

    /* Navigation main container */
    .md\\:w-auto .flex-col .md\\:pl-\\[--workspace-width\\] {
      background-color: #191919 !important;
    }

    /* Secondary Nav Handler rule */
    #nav-handler .h-\\[--workspace-height\\] .h-\\[var\\(--workspace-height\\)\\] {
      background-color: #191919 !important;
    }
  `;
  document.head.appendChild(style);
})();
