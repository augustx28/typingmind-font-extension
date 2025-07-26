(function() {
    'use strict';

    // This is the definitive "max space" script, updated with a highly
    // aggressive header-shrinking rule based on your screenshot.
    const customCSS = `
      /*
       * --- SECTION 1: AGGRESSIVE HEADER SHRINK (NEW & IMPROVED) ---
       * This rule is now extremely forceful. It directly targets the header bar,
       * removes all vertical padding, overrides any minimum height, and sets a
       * small, fixed height. This will produce the slim header you want.
       */
      div[class*="sticky top-0"] > div {
        height: 38px !important; /* Forces a small, fixed height */
        min-height: 38px !important; /* Overrides any default minimum height */
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }


      /*
       * --- SECTION 2: WIDER CHAT COLUMN ---
       * This rule remains to ensure the chat conversation uses more
       * of the screen's width, making it feel more spacious.
       */
      .overflow-y-auto .mx-auto {
        max-width: 95% !important;
      }


      /*
       * --- SECTION 3: LARGER CHAT TEXT ---
       * This rule remains to make the text itself more readable
       * by slightly increasing the font size and line spacing.
       */
      .prose p, .prose li {
        font-size: 1.05rem !important;
        line-height: 1.65 !important;
      }
    `;

    // This part of the script creates a <style> element
    const styleElement = document.createElement('style');

    // It then fills the <style> element with your CSS rules
    styleElement.textContent = customCSS;

    // Finally, it injects the <style> element into the <head> of the webpage
    document.head.append(styleElement);

})();
