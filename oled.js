(() => {
  const extensionId = 'custom-dark-theme';
  
  // Your custom CSS
  const customCSS = `
    /* Container background */
    .\\@container .flex-col .overflow-y-auto > .relative {
      background-color: #000000;
    }

    /* Dark theme background */
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

  // Function to inject CSS
  function injectCustomCSS() {
    // Check if CSS is already injected
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
    injectCustomCSS();
    
    // Also inject after DOM is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectCustomCSS);
    }
    
    // Re-inject if navigation changes (for single-page app behavior)
    const observer = new MutationObserver(() => {
      injectCustomCSS();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Start the extension
  init();
})();
