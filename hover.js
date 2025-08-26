(() => {
  const extensionId = 'custom-dark-theme-only';

  // Custom CSS styles that will ONLY apply in dark mode
  const customCSS = `
  /* --- HOVER PREVENTION STYLES (DARK MODE ONLY) --- */
  
  /* Prevent hover color changes on chat messages */
  .dark [role="button"]:hover,
  .dark [role="button"]:hover > div,
  .dark .hover\\:bg-gray-100\\/50:hover,
  .dark .hover\\:bg-gray-200:hover,
  .dark .hover\\:bg-gray-50:hover,
  .dark .hover\\:bg-zinc-100\\/50:hover,
  .dark .hover\\:bg-zinc-200:hover,
  .dark .hover\\:bg-zinc-50:hover,
  .dark .hover\\:dark\\:bg-gray-700\\/50:hover,
  .dark .hover\\:dark\\:bg-gray-800:hover,
  .dark .hover\\:dark\\:bg-zinc-700\\/50:hover,
  .dark .hover\\:dark\\:bg-zinc-800:hover {
    background-color: transparent !important;
  }
  
  /* Prevent hover effects on conversation list items */
  .dark .conversation-item:hover,
  .dark .chat-item:hover,
  .dark [data-state="closed"]:hover,
  .dark [data-state="open"]:hover {
    background-color: transparent !important;
  }
  
  /* Keep consistent background on all hover states */
  .dark .group:hover .group-hover\\:bg-gray-100,
  .dark .group:hover .group-hover\\:bg-gray-200,
  .dark .group:hover .group-hover\\:bg-zinc-100,
  .dark .group:hover .group-hover\\:bg-zinc-200,
  .dark .group:hover .group-hover\\:dark\\:bg-gray-700,
  .dark .group:hover .group-hover\\:dark\\:bg-gray-800,
  .dark .group:hover .group-hover\\:dark\\:bg-zinc-700,
  .dark .group:hover .group-hover\\:dark\\:bg-zinc-800 {
    background-color: transparent !important;
  }

  /* --- ORIGINAL STYLES (DARK MODE ONLY) --- */

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

  /* Items stretch - Kept for alignment */
  .dark .message-id-7425aedf-3acf-43a1-baa9-8ecb4585122a div .items-stretch {
    transform: translatex(0px) translatey(0px);
  }

  /* Division - sticky - Kept to ensure transparency */
  .dark .overflow-auto div .lg\\:sticky {
    background-color: transparent;
  }
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
