(() => {
  const extensionId = 'custom-dark-theme-only';

  // Custom CSS styles that will ONLY apply in dark mode
  const customCSS = `
  /* --- STYLES (DARK MODE ONLY) --- */

  /* Main dark color background */
  .dark .\\@container .flex-col .dark\\:bg-\\[--main-dark-color\\] {
    background-color: #262626;
  }

  /* Relative */
  .dark .\\@container .flex-col .overflow-y-auto > .relative {
    background-color: #262626;
  }

  /* Transition all */
  .dark .\\@container .flex-col > .transition-all {
    background-color: #262626;
  }

  /* Overflow auto */
  .dark .\\@container .flex-col .overflow-y-auto {
    background-color: #262626;
  }

  /* Custom theme */
  .dark #__next .custom-theme {
    transform: translatex(0px) translatey(0px);
    background-color: #262626;
  }

  /* Division - hidden */
  .dark .overflow-auto div .lg\\:hidden {
    background-color: #262626;
  }

  /* --- ORIGINAL STYLES (DARK MODE ONLY) --- */

  /* Items stretch - Kept for alignment */
  .dark .message-id-7425aedf-3acf-43a1-baa9-8ecb4585122a div .items-stretch {
    transform: translatex(0px) translatey(0px);
  }

  /* Division - sticky - Kept to ensure transparency */
  .dark .overflow-auto div .lg\\:sticky {
    background-color: transparent;
  }

  /* --- NEW: STOP HOVER COLOR CHANGES IN CHAT AREA --- */

  /* Keep message containers fixed even when hovered */
  .dark .\\@container .flex-col .overflow-y-auto > .relative,
  .dark .\\@container .flex-col .overflow-y-auto > .relative:hover {
    background-color: #262626 !important;
  }

  /* Neutralize Tailwind hover and group-hover backgrounds inside chat scroll area */
  .dark .\\@container .flex-col .overflow-y-auto [class*="hover:bg-"]:hover,
  .dark .\\@container .flex-col .overflow-y-auto .group:hover [class*="group-hover:bg-"] {
    background-color: inherit !important;
  }

  /* Also remove hover rings or borders that make the box look lighter */
  .dark .\\@container .flex-col .overflow-y-auto [class*="hover:ring-"]:hover,
  .dark .\\@container .flex-col .overflow-y-auto [class*="hover:border-"]:hover,
  .dark .\\@container .flex-col .overflow-y-auto .group:hover [class*="group-hover:ring-"],
  .dark .\\@container .flex-col .overflow-y-auto .group:hover [class*="group-hover:border-"] {
    box-shadow: none !important;
    border-color: inherit !important;
  }

  /* Remove hover transition on bg, border, ring to avoid flicker */
  .dark .\\@container .flex-col .overflow-y-auto * {
    transition: background-color 0s !important;
    transition-property: background-color, border-color, box-shadow !important;
  }

  /* OPTIONAL: if you also want to stop hover highlight in the left chat list, uncomment below
  .dark aside [class*="hover:bg-"]:hover,
  .dark aside .group:hover [class*="group-hover:bg-"] {
    background-color: inherit !important;
  }
  */
  `;

  // Function to inject CSS
  function injectCSS() {
    let styleElement = document.getElementById(extensionId);
    if (styleElement) {
      styleElement.textContent = customCSS;
    } else {
      styleElement = document.createElement('style');
      styleElement.id = extensionId;
      styleElement.textContent = customCSS;
      document.head.appendChild(styleElement);
    }
  }

  // Initialize the extension
  function init() {
    injectCSS();

    // Re-inject CSS if DOM changes to handle dynamic content
    const observer = new MutationObserver(() => {
      injectCSS();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
