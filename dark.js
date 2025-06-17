(() => {
  const extensionId = 'custom-dark-theme';
  
  // Custom CSS styles
  const customCSS = `
    /* Main dark color background */
    .\\@container .flex-col .dark\\:bg-\\[--main-dark-color\\] {
      background-color: #0c0c0c;
    }
    
    /* Items stretch */
    .message-id-7425aedf-3acf-43a1-baa9-8ecb4585122a div .items-stretch {
      transform: translatex(0px) translatey(0px);
    }
    
    /* Transition all */
    .\\@container .flex-col > .transition-all {
      background-color: #0c0c0c;
    }
    
    /* Relative */
    .\\@container .flex-col .overflow-y-auto > .relative {
      background-color: #0c0c0c;
      transform: translatex(0px) translatey(0px);
    }
    
    /* Overflow auto */
    .\\@container .flex-col .overflow-y-auto {
      background-color: #0c0c0c;
    }
    
    /* Custom theme */
    #__next .custom-theme {
      background-color: #0c0c0c;
    }
    
    /* Division - sticky */
    .overflow-auto div .lg\\:sticky {
      background-color: transparent;
    }
    
    /* Division - hidden */
    .overflow-auto div .lg\\:hidden {
      background-color: #0c0c0c;
    }
  `;
  
  // Function to inject CSS
  function injectCSS() {
    // Check if styles already exist
    if (document.getElementById(extensionId)) {
      return;
    }
    
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.id = extensionId;
    styleElement.textContent = customCSS;
    
    // Append to head
    document.head.appendChild(styleElement);
  }
  
  // Initialize the extension
  function init() {
    // Inject CSS immediately
    injectCSS();
    
    // Re-inject CSS if DOM changes (for dynamic content)
    const observer = new MutationObserver(() => {
      if (!document.getElementById(extensionId)) {
        injectCSS();
      }
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
