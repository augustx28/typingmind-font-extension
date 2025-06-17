(() => {
  // Extension metadata
  const extensionId = 'custom-dark-theme';
  const extensionName = 'Custom Dark Theme';
  
  // Your custom CSS
  const customCSS = `
    /* Container backgrounds */
    .\\@container .flex-col .overflow-y-auto > .relative {
      background-color: #000000;
    }
    
    /* Dark mode backgrounds */
    .\\@container .flex-col .dark\\:bg-\\[--main-dark-color\\] {
      background-color: #000000;
    }
    
    /* Transition all */
    .\\@container .flex-col > .transition-all {
      background-color: #000000;
    }
    
    /* Workspace color */
    .transition div .bg-\\[--workspace-color\\] {
      transform: translateX(0px) translateY(0px);
    }
    
    /* Flex col */
    #nav-handler .transition > .flex-col {
      transform: translateX(0px) translateY(0px);
    }
    
    /* Flex */
    .bg-\\[--workspace-color\\] > .flex:nth-child(1) {
      transform: translateX(0px) translateY(0px);
    }
    
    /* Full */
    div .bg-\\[--workspace-color\\] .flex .w-full .w-full {
      transform: translateX(557px) translateY(117px);
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
      transform: translateX(557px) translateY(117px);
    }
    
    /* Overflow auto */
    .\\@container .flex-col .overflow-y-auto {
      background-color: #000000;
    }
  `;
  
  // Function to inject CSS
  function injectCustomCSS() {
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
    
    console.log(`${extensionName} loaded successfully`);
  }
  
  // Initialize extension
  function init() {
    // Inject CSS immediately
    injectCustomCSS();
    
    // Also inject after DOM is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectCustomCSS);
    }
    
    // Watch for dynamic content changes
    const observer = new MutationObserver(() => {
      injectCustomCSS();
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Run the extension
  init();
})();
