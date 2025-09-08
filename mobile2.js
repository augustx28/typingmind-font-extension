(function() {
  'use strict';
  
  // Extension metadata
  const extensionInfo = {
    name: 'Mobile Navigation Fix',
    version: '1.0.0',
    description: 'Fixes navigation positioning on mobile devices'
  };
  
  console.log(`[${extensionInfo.name}] Loading extension v${extensionInfo.version}`);
  
  // CSS to inject
  const customCSS = `
    /* Mobile Navigation Positioning Extension */
    @media (max-width: 499.995px) {
      /* Workspace height adjustment */
      #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
        bottom: 0px;
        top: 794px;
        position: fixed;
        right: 0px;
      }
    }
    
    @media (max-width: 499px) {
      /* Workspace height adjustment for smaller screens */
      #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
        top: 775px;
      }
      
      /* Navigation padding adjustment */
      .transition .flex-col .md\\:pl-\\[--workspace-width\\] {
        padding-bottom: 4px;
      }
    }
  `;
  
  // Function to inject CSS
  function injectStyles() {
    try {
      // Check if styles already injected to prevent duplicates
      if (document.getElementById('tm-mobile-nav-fix')) {
        console.log(`[${extensionInfo.name}] Styles already injected`);
        return;
      }
      
      // Create style element
      const styleElement = document.createElement('style');
      styleElement.id = 'tm-mobile-nav-fix';
      styleElement.type = 'text/css';
      styleElement.innerHTML = customCSS;
      
      // Append to document head
      document.head.appendChild(styleElement);
      console.log(`[${extensionInfo.name}] Styles successfully injected`);
      
    } catch (error) {
      console.error(`[${extensionInfo.name}] Error injecting styles:`, error);
    }
  }
  
  // Initialize extension
  function init() {
    // Inject styles immediately
    injectStyles();
    
    // Also inject after DOM is fully loaded (fallback)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectStyles);
    }
    
    // Optional: Re-inject on route changes if needed
    // This helps if TypingMind dynamically changes the DOM
    const observer = new MutationObserver(function(mutations) {
      if (!document.getElementById('tm-mobile-nav-fix')) {
        injectStyles();
      }
    });
    
    // Start observing for DOM changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Run initialization
  init();
  
})();
