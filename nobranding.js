(function() {
    'use strict';

    function removeBranding() {
        // Limit to Home Page / New Chat
        const isHomePage = window.location.pathname === '/' || window.location.pathname.includes('/chat/new');
        if (!isHomePage) return;

        // 1. Remove the Main Logo/Title Container (The new element you requested)
        // We find the image first to be precise, then remove its specific parent wrapper
        const logoImg = document.querySelector('img[alt="TypingMind"]');
        if (logoImg) {
            // Target the specific wrapper classes you provided
            const wrapper = logoImg.closest('.h-16.justify-start.items-center.gap-x-2.md\\:gap-x-4.inline-flex');
            if (wrapper) {
                wrapper.remove();
            }
        }

        // 2. Remove "Typing" text (Redundancy check)
        const typingSpans = document.querySelectorAll('span.text-slate-900.font-bold.font-inter.leading-10.dark\\:text-white');
        typingSpans.forEach(span => {
            if (span.textContent.trim() === 'Typing') span.remove();
        });

        // 3. Remove "Mind" text (Redundancy check)
        const mindSpans = document.querySelectorAll('span.text-blue-600.dark\\:text-blue-400.font-bold.font-inter.leading-10');
        mindSpans.forEach(span => {
            if (span.textContent.trim() === 'Mind') span.remove();
        });

        // 4. Remove the Slogan
        const sloganDivs = document.querySelectorAll('div.text-base.text-gray-500');
        sloganDivs.forEach(div => {
            if (div.textContent.trim() === 'The best frontend for LLMs') {
                div.remove();
            }
        });
    }

    // Execute immediately
    removeBranding();

    // Watch for re-renders (SPA navigation)
    const observer = new MutationObserver((mutations) => {
        removeBranding();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
