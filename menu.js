/**
 * Typingmind Custom UI Extension
 *
 * Description: This extension applies custom CSS to change the appearance of
 * the navigation bar and folder colors in the Typingmind UI.
 *
 * Generated on: Mon Sep 08 2025
 */

// This function creates a <style> tag and adds your custom CSS rules to the page.
function addCustomStyles() {
  const styleElement = document.createElement('style');

  // Define the CSS rules as a single string.
  // We use '!important' to make sure our styles override the default ones.
  const cssRules = `
    /*
     * Rule 1 & 3: Change navigation bar background color to a dark grey.
     * These selectors target the main navigation and workspace containers.
    */
    .h-\\[var\\(--workspace-height\\)\\].sm\\:block.md\\:flex-col,
    .transition.flex-col.md\\:pl-\\[--workspace-width\\] {
      background-color: #191919 !important;
    }

    /*
     * Rule 2: Change the folder item color to orange.
     * This selector targets the container for folder list items and applies
     * the color to both the text and any icons (like SVGs) inside.
    */
    .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\))\\] div .h-6,
    .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\))\\] div .h-6 svg {
      color: #DA9010 !important;
    }
  `;

  styleElement.textContent = cssRules;
  document.head.appendChild(styleElement);
  console.log('Custom UI styles have been successfully applied.');
}


// This is the standard structure for a Typingmind extension.
export default {
  id: 'com.user.custom-ui-styler',
  name: 'Custom UI Styler',
  description: 'Applies custom colors to the navigation bar and folders.',
  onAppLoaded: () => {
    // This function runs as soon as the Typingmind app is ready.
    addCustomStyles();
  },
};
