(() => {
  const extensionId = 'custom-dark-theme';

  // Custom CSS styles
  const customCSS = `
    /* --- NEW STYLES --- */

    /* Main dark color background */
    .\\@container .flex-col .dark\\:bg-\\[--main-dark-color\\] {
      background-color: #161616;
    }

    /* Relative */
    .\\@container .flex-col .overflow-y-auto > .relative {
      background-color: #161616;
    }

    /* Transition all */
    .\\@container .flex-col > .transition-all {
      background-color: #161616;
    }

    /* Overflow auto */
    .\\@container .flex-col .overflow-y-auto {
      background-color: #161616;
    }

    /* Custom theme */
    #__next .custom-theme {
      transform: translatex(0px) translatey(0px); /* This rule was in your new CSS */
      background-color: #161616;
    }

    /* Division - hidden */
    .overflow-auto div .lg\\:hidden {
      background-color: #161616;
    }
    
    /* --- ORIGINAL STYLES (Retained for functionality) --- */

    /* Items stretch - Kept from original in case it's needed for alignment */
    .message-id-7425aedf-3acf-43a1-baa9-8ecb4585122a div .items-stretch {
      transform: translatex(0px) translatey(0px);
    }
    
    /* Division - sticky - Kept from original to ensure transparency is maintained */
    .overflow-auto div .lg\\:sticky {
      background-color: transparent;
    }
  `;

  // Function to inject CSS
  function injectCSS() {
    // Check if styles already exist
    let styleElement = document.getElementById(extensionId);
    if (styleElement) {
        // If it exists, update its content
        styleElement.textContent = customCSS;
    } else {
        // Otherwise, create and append a new style element
        styleElement = document.createElement('style');
        styleElement.id = extensionId;
        styleElement.textContent = customCSS;
        document.head.appendChild(styleElement);
    }
  }

  // Initialize the extension
  function init() {
    // Inject CSS immediately
    injectCSS();

    // Re-inject or update CSS if DOM changes (for dynamic content)
    const observer = new MutationObserver(() => {
        // We can simply call injectCSS which now handles both creation and updating
        injectCSS();
    });

    // Observe body for changes
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
