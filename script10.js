(function() {
    'use strict';

    // All your custom CSS rules are placed within this template literal string.
    const customCSS = `
      /* This single rule targets the main header bar at the top of the chat.
        Instead of forcing a height, it reduces the vertical padding.
        This makes the header shorter, giving you more space for the chat
        without breaking the layout or causing elements to overlap.
        The '!important' flag ensures this style overrides the default.
      */
      .md\\:pl-\\[--current-sidebar-width\\] .sticky.top-0 > div {
        padding-top: 0.5rem !important;
        padding-bottom: 0.5rem !important;
      }
    `;

    // This part of the script creates a <style> element
    const styleElement = document.createElement('style');

    // It then fills the <style> element with your CSS rules
    styleElement.textContent = customCSS;

    // Finally, it injects the <style> element into the <head> of the webpage
    document.head.append(styleElement);

})();
