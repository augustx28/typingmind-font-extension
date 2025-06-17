(() => {
  // Extension metadata
  const extensionId = 'custom-dark-theme';
  const extensionName = 'Custom Dark Theme';
  const version = '1.0.0';

  // Your custom CSS
  const customCSS = `
    /* Container and main backgrounds */
    .\\@container .flex-col .overflow-y-auto > .relative {
      background-color: #000000;
    }

    /* Division */
    .transition div .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\] {
      background-color: #000000;
    }

    /* Dark mode backgrounds */
    .\\@container .flex-col .dark\\:bg-\\[--main-dark-color\\] {
      background-color: #0c0c0c;
      background-color: #000000;
    }

    /* Transition all */
    .\\@container .flex-col > .transition-all {
      background-color: #000000;
    }

    /* Workspace color */
    .transition div .bg-\\[--workspace-color\\] {
      transform: translateX(0px) translateY(0px);
      background-color: #000000;
    }

    /* Flex col */
    #nav-handler .transition > .flex-col {
      transform: translateX(0px) translateY(0px);
    }

    /* Flex first child */
    .bg-\\[--workspace-color\\] > .flex:nth-child(1) {
      transform: translateX(0px) translateY(0px);
    }

    /* Full width elements */
    div .bg-\\[--workspace-color\\] .flex .w-full .w-full {
      transform: translateX(557px) translateY(117px);
    }

    /* Span Tag styling */
    .transition div .sm\\:leading-normal {
      font-size: 18px;
      font-weight: 700;
    }

    /* Custom theme */
    #__next .custom-theme {
      background-color: #000000;
    }

    /* Body - highest priority */
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

    /* Sticky division */
    .overflow-auto div .lg\\:sticky {
      background-color: #000000;
    }

    /* Focus state */
    .sm\\:flex-row .mt-2 .focus\\:outline-none {
      background-color: #1f1f37;
    }

    /* Workspace height */
    #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
      background-color: #000000;
    }

    /* Hidden on large screens */
    .overflow-auto div .lg\\:hidden {
      background-color: #000000;
    }
  `;

  // Function to inject CSS
  function injectCSS() {
    // Check if style element already exists
    let styleElement = document.getElementById(`${extensionId}-styles`);
    
    if (!styleElement) {
      // Create new style element
      styleElement = document.createElement('style');
      styleElement.id = `${extensionId}-styles`;
      styleElement.textContent = customCSS;
      
      // Append to head
      document.head.appendChild(styleElement);
      
      console.log(`[${extensionName}] CSS injected successfully`);
    }
  }

  // Function to observe DOM changes and reapply CSS if needed
  function observeChanges() {
    const observer = new MutationObserver((mutations) => {
      // Check if our style element was removed
      if (!document.getElementById(`${extensionId}-styles`)) {
        injectCSS();
      }
    });

    // Start observing
    observer.observe(document.head, {
      childList: true,
      subtree: true
    });
  }

  // Initialize extension
  function init() {
    // Inject CSS immediately
    injectCSS();
    
    // Set up observer for dynamic changes
    observeChanges();
    
    // Also inject when DOM is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectCSS);
    }
    
    console.log(`[${extensionName}] Extension initialized`);
  }

  // Start the extension
  init();
})();
