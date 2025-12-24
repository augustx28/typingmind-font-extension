/* TypingMind Extension: Remove Home Page Welcome Elements
   Targeting: 
   1. .md:pl-[--current-sidebar-width] .md:text-5xl span
   2. .md:pl-[--current-sidebar-width] .antialiased:nth-child(1) .text-base
*/

(function() {
    // Selectors with double-escaped characters for JS string compatibility
    const selectorsToRemove = [
        '.md\\:pl-\\[--current-sidebar-width\\] .md\\:text-5xl span',
        '.md\\:pl-\\[--current-sidebar-width\\] .antialiased:nth-child(1) .text-base'
    ];

    const removeElements = () => {
        // Logic to verify we are on the home page (New Chat)
        // Usually indicated by the presence of these specific large welcome headers
        selectorsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });
    };

    // Run once on load
    removeElements();

    // Watch for page changes (SPA navigation)
    const observer = new MutationObserver((mutations) => {
        removeElements();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
