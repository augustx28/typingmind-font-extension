(function() {
    'use strict';

    const newDarkGreyColor = '#202020';
    const targetRgbColor = 'rgb(32, 32, 32)'; // RGB for #202020

    function log(message, isWarning = false) {
        const prefix = '[SidebarColorScript]';
        if (isWarning) {
            console.warn(`${prefix} ${message}`);
        } else {
            console.log(`${prefix} ${message}`);
        }
    }

    function applyStylesToElement(selector, isCritical = true) {
        const element = document.querySelector(selector);
        if (element) {
            // Remove potentially conflicting Tailwind background classes
            const classesToRemove = ['bg-[color:--sidebar-color]', 'bg-[var(--workspace-color)]', 'bg-gray-800'];
            classesToRemove.forEach(cls => {
                if (element.classList.contains(cls)) {
                    element.classList.remove(cls);
                }
            });

            // Check current computed style before applying
            if (getComputedStyle(element).backgroundColor !== targetRgbColor) {
                element.style.backgroundColor = newDarkGreyColor + ' !important';
                log(`Applied color to ${selector}`);
                return true; // Style was applied
            } else {
                // log(`Color already correct for ${selector}`);
                return false; // Style was already correct
            }
        } else {
            if (isCritical) {
                log(`Element ${selector} not found.`, true);
            }
        }
        return false; // Element not found or style not applied
    }

    function colorTypingMindSidebar() {
        let stylesAppliedThisRun = false;

        // Target the main sidebar navigation panel
        if (applyStylesToElement('nav[data-element-id="side-bar-background"]')) stylesAppliedThisRun = true;

        // Target the workspace bar (icon bar)
        // This selector was from your previous HTML. If it's part of the "entire sidebar", it's needed.
        if (applyStylesToElement('div[data-element-id="workspace-bar"]')) stylesAppliedThisRun = true;
        
        // Target the top part of the sidebar (New Chat button, Search bar area)
        if (applyStylesToElement('div[data-element-id="sidebar-beginning-part"]')) stylesAppliedThisRun = true;

        // Target the search input bar itself
        if (applyStylesToElement('input[data-element-id="search-chats-bar"]')) stylesAppliedThisRun = true;
        
        // The parent div you provided (bg-gray-800) should likely NOT be changed,
        // as it appears to be the main content background, not the sidebar itself.
        // We are focusing only on elements clearly part of the sidebar structure.

        // if (stylesAppliedThisRun) {
        //     log('Finished a cycle of style applications.');
        // }
    }

    function observeDOMChanges() {
        const observer = new MutationObserver((mutationsList, observerInstance) => {
            // We run colorTypingMindSidebar on any observed change.
            // It has internal checks to see if styling is needed.
            // This is broad but helps catch various dynamic updates.
            // log('DOM change detected, re-evaluating sidebar colors...');
            colorTypingMindSidebar();
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true, // Observe attribute changes too, like class or style
            attributeFilter: ['style', 'class'] // Focus on style and class attributes
        });
        log('MutationObserver started to watch for DOM changes.');
    }

    // Initial application
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            log('DOMContentLoaded event fired.');
            colorTypingMindSidebar(); // First attempt
            observeDOMChanges();       // Start observing after initial attempt
        });
    } else {
        log('DOM already loaded.');
        colorTypingMindSidebar(); // First attempt
        observeDOMChanges();       // Start observing
    }

    // Fallback: A simple interval to re-apply if elements are missed or styles are reverted aggressively.
    // The MutationObserver should ideally handle this, but some frameworks can be tricky.
    let fallbackAttempts = 0;
    const fallbackInterval = setInterval(() => {
        // log(`Fallback interval check #${fallbackAttempts + 1}`);
        colorTypingMindSidebar();
        fallbackAttempts++;
        if (fallbackAttempts > 20) { // Try for about 10 seconds
            clearInterval(fallbackInterval);
            log('Fallback interval stopped.');
        }
    }, 500);

})();
