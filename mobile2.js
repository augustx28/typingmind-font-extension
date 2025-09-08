(() => {
  const extensionId = 'mobile-workspace-adjuster';
  
  // Define the CSS to inject
  const customCSS = `
    @media (max-width:499.995px){
      /* var(workspace height) */
      #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\]{
        bottom: 0px;
        top: 794px;
        position: fixed;
        right: 0px;
      }
    }
    
    @media (max-width:499px){
      /* var(workspace height) */
      #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\]{
        top: 750px;
      }
      
      /* Navigation */
      .transition .flex-col .md\\:pl-\\[--workspace-width\\]{
        padding-bottom: 4px;
      }
    }
  `;
  
  // Function to inject CSS
  function injectCSS() {
    // Check if styles already exist to avoid duplicates
    let styleElement = document.getElementById(extensionId);
    
    if (!styleElement) {
      // Create new style element
      styleElement = document.createElement('style');
      styleElement.id = extensionId;
      styleElement.textContent = customCSS;
      
      // Append to document head
      document.head.appendChild(styleElement);
      
      console.log('Mobile Workspace Adjuster: CSS injected successfully');
    }
  }
  
  // Function to initialize the extension
  function init() {
    // Inject CSS immediately
    injectCSS();
    
    // Also inject on DOM content loaded (as backup)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectCSS);
    }
    
    // Monitor for any dynamic changes that might remove our styles
    const observer = new MutationObserver((mutations) => {
      // Check if our style element was removed
      if (!document.getElementById(extensionId)) {
        injectCSS();
      }
    });
    
    // Start observing the document head for changes
    observer.observe(document.head, {
      childList: true,
      subtree: false
    });
  }
  
  // Initialize the extension
  init();
  
  // Return extension info (optional but recommended)
  return {
    name: 'Mobile Workspace Adjuster',
    version: '1.0.0',
    description: 'Adjusts workspace height and navigation for mobile devices',
    author: 'Your Name'
  };
})();
