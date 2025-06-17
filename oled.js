(() => {
  const extensionId = 'dark-theme-customizer';
  
  // Define the custom CSS
  const customCSS = `
    /* Container overflow area */
    .\\@container .flex-col .overflow-y-auto > .relative {
      background-color: #000000;
    }

    /* Dark mode background */
    .\\@container .flex-col .dark\\:bg-\\[--main-dark-color\\] {
      background-color: #000000;
    }

    /* Transition all elements */
    .\\@container .flex-col > .transition-all {
      background-color: #000000;
    }

    /* Workspace color */
    .transition div .bg-\\[--workspace-color\\] {
      transform: translateX(0px) translateY(0px);
      background-color: #0c0c0c;
    }

    /* Flex column navigation */
    #nav-handler .transition > .flex-col {
      transform: translateX(0px) translateY(0px);
    }

    /* Flex workspace first child */
    .bg-\\[--workspace-color\\] > .flex:nth-child(1) {
      transform: translateX(0px) translateY(0px);
    }

    /* Full width elements */
    div .bg-\\[--workspace-color\\] .flex .w-full .w-full {
      transform: translateX(557px) translateY(117px);
    }

    /* Span tag styling */
    .transition div .sm\\:leading-normal {
      font-size: 18px;
      font-weight: 700;
    }

    /* Next.js custom theme */
    #__next .custom-theme {
      background-color: #000000;
    }

    /* Body background */
    body {
      background-color: #000000 !important;
    }

    /* Message items */
    .message-id-24d6ca05-79fb-4605-99c0-c5fc94b56122 div .items-stretch {
      transform: translateX(557px) translateY(117px);
    }

    /* Container overflow */
    .\\@container .flex-col .overflow-y-auto {
      background-color: #000000;
    }

    /* Sticky sidebar */
    .overflow-auto div .lg\\:sticky {
      background-color: #000000;
    }

    /* Focus input */
    .sm\\:flex-row .mt-2 .focus\\:outline-none {
      background-color: #1f1f37;
    }

    /* Workspace height variable */
    #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
      background-color: #0c0c0c;
    }

    /* Sidebar width calculation */
    .transition div .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\] {
      background-color: #0c0c0c;
    }

    /* Hidden on large screens */
    .overflow-auto div .lg\\:hidden {
      background-color: #000000;
    }
  `;

  // Create and inject the style element
  function injectStyles() {
    // Check if styles already exist
    let styleEl = document.getElementById(`${extensionId}-styles`);
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = `${extensionId}-styles`;
      styleEl.textContent = customCSS;
      document.head.appendChild(styleEl);
    }
  }

  // Initialize the extension
  function init() {
    // Inject styles immediately
    injectStyles();
    
    // Re-inject styles if DOM changes (for dynamic content)
    const observer = new MutationObserver(() => {
      if (!document.getElementById(`${extensionId}-styles`)) {
        injectStyles();
      }
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
