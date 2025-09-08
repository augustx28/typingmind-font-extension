// content.js
(() => {
  // A function to add our custom styles to the page
  function addCustomStyles() {
    // Create a <style> HTML element
    const styleElement = document.createElement('style');

    // Give it a unique ID so we can find it later if needed
    styleElement.id = 'my-custom-ui-styles';

    // Define all your CSS rules in this string.
    // We use !important to make sure our styles override the default ones.
    const cssRules = `
      /* --- Style 1: Change background of main panels --- */
      .h-\\[var\\(--workspace-height\\)\\].sm\\:block.md\\:flex-col,
      .transition .flex-col .md\\:pl-\\[--workspace-width\\] {
          background-color: #191919 !important;
      }

      /* --- Style 2: Change the color of folder icons --- */
      /* This selector targets the container for folder icons. */
      /* Using 'color' is best for changing the icon color itself. */
      .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\] div .h-6 {
          color: #DA9010 !important;
      }
    `;

    // Add the CSS rules to the <style> element
    styleElement.textContent = cssRules;

    // Add the <style> element to the <head> of the document
    document.head.appendChild(styleElement);

    console.log('Custom Typingmind styles have been successfully applied.');
  }

  // Run the function to apply the styles
  addCustomStyles();
})();
