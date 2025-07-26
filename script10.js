(function() {
    'use strict';

    // This CSS makes the chat area wider for better readability on large screens.
    const customCSS = `
      /* This targets the primary container that holds all the chat messages.
        By default, it has a 'max-width' to keep text lines from getting too long.
        This rule removes that maximum width limit, allowing the chat area to
        expand and fill more of the available horizontal space.
      */
      .overflow-y-auto .mx-auto.max-w-3xl,
      .overflow-y-auto .mx-auto.max-w-4xl {
        max-width: none !important;
        padding-left: 2rem !important;
        padding-right: 2rem !important;
      }
    `;

    // This part of the script creates a <style> element
    const styleElement = document.createElement('style');

    // It then fills the <style> element with your CSS rules
    styleElement.textContent = customCSS;

    // Finally, it injects the <style> element into the <head> of the webpage
    document.head.append(styleElement);

})();
