(function() {
    'use strict';

    // This is an "all-in-one" script for maximizing the chat area space.
    const customCSS = `
      /*
       * --- SECTION 1: MAKE THE CHAT COLUMN WIDER ---
       * This is the most important part. It finds the container that holds the
       * chat messages and removes its maximum width, forcing it to be much wider.
       */
      .overflow-y-auto .mx-auto {
        max-width: 95% !important; /* Use 95% of the screen width */
      }


      /*
       * --- SECTION 2: MAKE THE HEADER AREA SHORTER ---
       * This reduces the padding in the header to make it less tall,
       * giving more vertical space to the chat history.
       */
      .md\\:pl-\\[--current-sidebar-width\\] .sticky.top-0 > div {
        padding-top: 0.4rem !important;
        padding-bottom: 0.4rem !important;
        min-height: auto !important;
      }


      /*
       * --- SECTION 3: MAKE THE CHAT TEXT BIGGER ---
       * This increases the font size for paragraphs and lists within the
       * chat bubbles, making the content itself easier to read.
       */
      .prose p, .prose li {
        font-size: 1.05rem !important; /* Increase font size slightly */
        line-height: 1.65 !important; /* Increase space between lines */
      }
    `;

    // This part of the script creates a <style> element
    const styleElement = document.createElement('style');

    // It then fills the <style> element with your CSS rules
    styleElement.textContent = customCSS;

    // Finally, it injects the <style> element into the <head> of the webpage
    document.head.append(styleElement);

})();
