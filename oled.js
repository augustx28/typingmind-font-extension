(() => {
  const extensionId = 'custom-dark-theme';
  
  // Your custom CSS
  const customCSS = `
    /* Main container backgrounds */
    .\\@container .flex-col .overflow-y-auto > .relative {
      background-color: #000000;
    }
    
    /* Dark mode background */
    .\\@container .flex-col .dark\\:bg-\\[--main-dark-color\\] {
      background-color: #000000;
    }
    
    /* Transition all */
    .\\@container .flex-col > .transition-all {
      background-color: #000000;
    }
    
    /* Workspace color */
    .transition div .bg-\\[--workspace-color\\] {
      transform: translatex(0px) translatey(0px);
      background-color: #0c0c0c;
    }
    
    /* Flex col */
    #nav-handler .transition > .flex-col {
      transform: translatex(0px) translatey(0px);
    }
    
    /* Flex */
    .bg-\\[--workspace-color\\] > .flex:nth-child(1) {
      transform: translatex(0px) translatey(0px);
    }
    
    /* Full */
    div .bg-\\[--workspace-color\\] .flex .w-full .w-full {
      transform: translatex(557px) translatey(117px);
    }
    
    /* Span Tag */
    .transition div .sm\\:leading-normal {
      font-size: 18px;
      font-weight: 700;
    }
    
    #__next .custom-theme {
      background-color: #000000;
    }
    
    /* Body */
    body {
      background-color: #000000 !important;
    }
    
    /* Items stretch */
    .message-id-24d6ca05-79fb-4605-99c0-c5fc94b56122 div .items-stretch {
      transform: translatex(557px) translatey(117px);
    }
    
    /* Overflow auto */
    .\\@container .flex-col .overflow-y-auto {
      background-color: #000000;
    }
    
    /* Division */
    .overflow-auto div .lg\\:sticky {
      background-color: #000000;
    }
    
    /* Focus */
    .sm\\:flex-row .mt-2 .focus\\:outline-none {
      background-color: #1f1f37;
    }
    
    /* Workspace height */
    #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
      background-color: #0c0c0c;
    }
    
    /* Division */
    .transition div .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\] {
      background-color: #0c0c0c;
    }
  `;
  
  function injectStyles() {
    // Check if styles already exist
    if (document.getElementById(extensionId)) {
      return;
    }
    
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.id = extensionId;
    styleElement.textContent = customCSS;
    
    // Inject into document head
    document.head.appendChild(styleElement);
  }
  
  // Register the extension
  if (typeof TM !== 'undefined' && TM.registerExtension) {
    TM.registerExtension({
      extensionId: extensionId,
      name: 'Custom Dark Theme',
      description: 'Applies custom dark theme styling to TypingMind interface',
      version: '1.0.0',
      init: function() {
        // Initial injection
        injectStyles();
        
        // Re-inject on DOM changes (for dynamic content)
        const observer = new MutationObserver(() => {
          injectStyles();
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        console.log('Custom Dark Theme extension loaded successfully');
      }
    });
  } else {
    // Fallback for immediate execution
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectStyles);
    } else {
      injectStyles();
    }
  }
})();
