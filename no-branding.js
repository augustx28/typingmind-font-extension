/* TypingMind Extension: Remove Homepage Branding & Welcome Text
   Targeting:
   1. Large Welcome Text
   2. Sub-text description
   3. Top branding/Justify-start element
*/

(function() {
    // Array of selectors to nuked. 
    // Double backslashes (\\) are needed to escape special characters in JS strings.
    const targets = [
        '.md\\:pl-\\[--current-sidebar-width\\] .md\\:text-5xl span',
        '.md\\:pl-\\[--current-sidebar-width\\] .antialiased:nth-child(1) .text-base',
        '.md\\:pl-\\[--current-sidebar-width\\] .antialiased:nth-child(1) > .justify-start:nth-child(1)'
    ];

    const cleanHomepage = () => {
        targets.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });
    };

    // Run immediately on load
    cleanHomepage();

    // Watch for navigation changes (SPA behavior) to re-clean if user goes back to New Chat
    const observer = new MutationObserver((mutations) => {
        // We throttle this slightly by checking if valid nodes were added, 
        // but for UI cleanup, simple re-execution is usually fine and fast.
        cleanHomepage();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
