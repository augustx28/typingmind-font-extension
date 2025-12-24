(function() {
    'use strict';

    function removeBranding() {
        // Only run this logic if we are on the main page (root or new chat)
        // Adjust this condition if your homepage URL is different
        const isHomePage = window.location.pathname === '/' || window.location.pathname.includes('/chat/new');
        
        if (!isHomePage) return;

        // 1. Target "Typing"
        const typingSpans = document.querySelectorAll('span.text-slate-900.font-bold.font-inter.leading-10.dark\\:text-white');
        typingSpans.forEach(span => {
            if (span.textContent.trim() === 'Typing') {
                span.remove();
            }
        });

        // 2. Target "Mind"
        const mindSpans = document.querySelectorAll('span.text-blue-600.dark\\:text-blue-400.font-bold.font-inter.leading-10');
        mindSpans.forEach(span => {
            if (span.textContent.trim() === 'Mind') {
                span.remove();
            }
        });

        // 3. Target "The best frontend for LLMs"
        const sloganDivs = document.querySelectorAll('div.text-base.text-gray-500');
        sloganDivs.forEach(div => {
            if (div.textContent.trim() === 'The best frontend for LLMs') {
                div.remove();
            }
        });
    }

    // Run immediately on load
    removeBranding();

    // Observe the document for changes (to handle SPA navigation/re-renders)
    const observer = new MutationObserver((mutations) => {
        removeBranding();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
