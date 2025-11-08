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

      /* Transition all - Remove forced background, allow hover states */
      #elements-in-action-buttons > .transition-all {
        background-color: transparent !important;
      }
      
      /* Light gray hover for both themes */
      #elements-in-action-buttons > .transition-all:hover {
        background-color: rgba(128, 128, 128, 0.15) !important;
      }
      
      /* Dark mode hover - slightly lighter gray */
      .dark #elements-in-action-buttons > .transition-all:hover {
        background-color: rgba(128, 128, 128, 0.25) !important;
      }
      
      /* Light mode - ensure buttons are visible */
      .light #elements-in-action-buttons > .transition-all,
      :root:not(.dark) #elements-in-action-buttons > .transition-all {
        opacity: 1 !important;
        color: inherit !important;
      }

      /* Overflow hidden - Rounded corners */
      .bg-\\[--workspace-color\\] .justify-center > .overflow-hidden {
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
      }
