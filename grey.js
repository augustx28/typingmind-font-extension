// TypingMind Extension: UI Visual Tweaks
// Description: Applies custom styling to various UI elements

(function() {
  'use strict';
  
  // Create and inject the CSS styles
  function injectStyles() {
    // Check if styles already exist
    if (document.getElementById('custom-ui-tweaks')) {
      return;
    }
    
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.id = 'custom-ui-tweaks';
    styleElement.textContent = `
      /* Justify center - Black background */
      #headlessui-menu-button-\\:raa\\: .justify-center {
        background-color: #000000;
      }

      /* Transition all - Transparent blue background */
      #elements-in-action-buttons > .transition-all {
        background-color: rgba(37, 99, 235, 0);
      }

      /* Overflow hidden - Rounded corners */
      .bg-\\[--workspace-color\\] .justify-center > .overflow-hidden {
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
      }

      /* Focus outline - Dark gray background */
      .md\\:flex .w-full .focus\\:outline {
        background-color: #3f3f3f;
      }
    `;
    
    // Append to head
    document.head.appendChild(styleElement);
    console.log('UI Tweaks Extension: Styles injected successfully');
  }
  
  // Initialize the extension
  function init() {
    // Inject styles immediately
    injectStyles();
    
    // Also inject after DOM is fully loaded (in case of timing issues)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectStyles);
    }
  }
  
  // Run initialization
  init();
  
  // Return extension info (optional, for TypingMind)
  return {
    name: 'UI Visual Tweaks',
    version: '1.0.0',
    description: 'Applies custom styling to TypingMind interface elements'
  };
})();
