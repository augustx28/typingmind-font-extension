(() => {
  const extensionId = 'mobile-nav-layout';
  
  // Your CSS styles
  const customStyles = `
    @media (max-width:499.995px) {
      /* var(workspace height) */
      #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
        bottom: 0px;
        top: 760px;
        position: fixed;
        right: 0px;
      }
    }
    
    @media (max-width:499px) {
      /* var(workspace height) */
      #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
        top: 760px;
      }
      
      /* Navigation */
      .transition .flex-col .md\\:pl-\\[--workspace-width\\] {
        padding-bottom: 4px;
      }
    }
  `;
  
  // Function to inject styles
  function injectStyles() {
    // Check if styles already exist to avoid duplication
    let styleElement = document.getElementById(extensionId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = extensionId;
      styleElement.textContent = customStyles;
      document.head.appendChild(styleElement);
      console.log('Mobile Navigation Layout styles injected successfully');
    }
  }
  
  // Inject styles immediately
  injectStyles();
  
  // Also inject on DOM ready in case the extension loads early
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyles);
  }
  
  // Watch for dynamic content changes (TypeingMind loads content dynamically)
  const observer = new MutationObserver(() => {
    if (!document.getElementById(extensionId)) {
      injectStyles();
    }
  });
  
  // Start observing
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  
  // Extension info
  console.log('Mobile Navigation Layout Extension loaded');
})();
