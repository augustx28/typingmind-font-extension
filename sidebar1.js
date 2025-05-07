(function() {
    'use strict';

    // The target dark grey color
    const newDarkGreyColor = '#202020';

    // Function to apply the style
    function colorTypingMindSidebar() {
        let sidebarNavElement = null;
        let workspaceBarElement = null;
        let mainContainerElement = null; // For the overall background if needed

        // Selector for the main sidebar navigation area
        const sidebarNavSelector = 'nav[data-element-id="side-bar-background"]';
        sidebarNavElement = document.querySelector(sidebarNavSelector);

        // Selector for the workspace bar (the thin vertical/horizontal icon bar)
        const workspaceBarSelector = 'div[data-element-id="workspace-bar"]';
        workspaceBarElement = document.querySelector(workspaceBarSelector);

        // Selector for the outermost container that seems to hold both
        const mainContainerSelector = 'div[data-element-id="nav-container"]';
        mainContainerElement = document.querySelector(mainContainerSelector);


        let changed = false;

        if (mainContainerElement) {
            // It's often better to color the main container if the sidebar and workspace bar
            // are visually expected to be a single block.
            // Check its current computed background color before changing.
             if (getComputedStyle(mainContainerElement).backgroundColor !== 'rgb(32, 32, 32)') { // rgb(32, 32, 32) is #202020
                mainContainerElement.style.backgroundColor = newDarkGreyColor + ' !important';
                changed = true;
             }
        }

        if (sidebarNavElement) {
            // This element has `bg-[color:--sidebar-color]`. Overriding this directly.
            // Also, it has `md:pl-[--workspace-width]`, so if workspace-bar has a different color,
            // there might be a strip. Setting its background is key.
             if (getComputedStyle(sidebarNavElement).backgroundColor !== 'rgb(32, 32, 32)') {
                sidebarNavElement.style.backgroundColor = newDarkGreyColor + ' !important';
                changed = true;
             }
            // Remove default variable-based background if it interferes.
            sidebarNavElement.classList.remove('bg-[color:--sidebar-color]');
        } else {
            console.warn('TypingMind sidebar navigation element (nav[data-element-id="side-bar-background"]) not found.');
        }

        if (workspaceBarElement) {
            // This element has `bg-[var(--workspace-color)]`.
            // If the mainContainerElement styling didn't cover this (e.g. due to z-index or layout),
            // color it explicitly.
            if (getComputedStyle(workspaceBarElement).backgroundColor !== 'rgb(32, 32, 32)') {
                workspaceBarElement.style.backgroundColor = newDarkGreyColor + ' !important';
                changed = true;
            }
            // Remove default variable-based background if it interferes.
            workspaceBarElement.classList.remove('bg-[var(--workspace-color)]');
        } else {
            console.warn('TypingMind workspace bar element (div[data-element-id="workspace-bar"]) not found.');
        }

        if (changed) {
            console.log('TypingMind sidebar components color updated to ' + newDarkGreyColor);
        } else if (sidebarNavElement || workspaceBarElement || mainContainerElement) {
            // console.log('TypingMind sidebar components already have the target color or were not all found.');
        } else {
            console.warn('No TypingMind sidebar elements found with the current selectors. Color has not been applied.');
        }

        // Additionally, the input field for "Search chats" also has a background from a CSS variable.
        // `input[data-element-id="search-chats-bar"]` has `bg-[color:--sidebar-color]`
        const searchBarInput = document.querySelector('input[data-element-id="search-chats-bar"]');
        if (searchBarInput) {
            if (getComputedStyle(searchBarInput).backgroundColor !== 'rgb(32, 32, 32)') {
                searchBarInput.style.backgroundColor = newDarkGreyColor + ' !important';
                 // To maintain sleekness, we might want a slightly lighter shade for input fields
                 // on a dark background, or keep it the same for a monolithic look.
                 // For now, keeping it the same.
                 // searchBarInput.style.borderColor = '#4A4A4A !important'; // Optional: adjust border too
            }
            searchBarInput.classList.remove('bg-[color:--sidebar-color]');
        }

        // The `sidebar-beginning-part` also uses `bg-[--workspace-color]`
        const sidebarBeginningPart = document.querySelector('div[data-element-id="sidebar-beginning-part"]');
        if (sidebarBeginningPart) {
            if (getComputedStyle(sidebarBeginningPart).backgroundColor !== 'rgb(32, 32, 32)') {
                sidebarBeginningPart.style.backgroundColor = newDarkGreyColor + ' !important';
            }
            sidebarBeginningPart.classList.remove('bg-[--workspace-color]');
        }
    }

    // Function to ensure the styles are applied, especially for SPAs
    function applyStylesWhenReady() {
        colorTypingMindSidebar(); // Initial attempt

        // Use MutationObserver to watch for changes in the DOM,
        // as elements might be added/removed/changed after initial load in SPAs.
        const observer = new MutationObserver((mutationsList, observerInstance) => {
            // Check if the target elements are present and if their style needs update
            const sidebarNav = document.querySelector('nav[data-element-id="side-bar-background"]');
            const workspaceBar = document.querySelector('div[data-element-id="workspace-bar"]');
            const searchInput = document.querySelector('input[data-element-id="search-chats-bar"]');
            const beginningPart = document.querySelector('div[data-element-id="sidebar-beginning-part"]');

            let needsReapply = false;
            if (sidebarNav && getComputedStyle(sidebarNav).backgroundColor !== 'rgb(32, 32, 32)') needsReapply = true;
            if (workspaceBar && getComputedStyle(workspaceBar).backgroundColor !== 'rgb(32, 32, 32)') needsReapply = true;
            if (searchInput && getComputedStyle(searchInput).backgroundColor !== 'rgb(32, 32, 32)') needsReapply = true;
            if (beginningPart && getComputedStyle(beginningPart).backgroundColor !== 'rgb(32, 32, 32)') needsReapply = true;


            if (needsReapply) {
                // console.log('DOM change detected, re-applying sidebar color...');
                colorTypingMindSidebar();
            }
        });

        // Start observing the document body for configured mutations
        observer.observe(document.body, { childList: true, subtree: true });

        // Fallback interval, though MutationObserver is preferred
        let attempts = 0;
        const intervalId = setInterval(() => {
            const sidebarNav = document.querySelector('nav[data-element-id="side-bar-background"]');
            // Simple check: if an element exists but doesn't have the color, re-apply.
            if (sidebarNav && getComputedStyle(sidebarNav).backgroundColor !== 'rgb(32, 32, 32)') {
                // console.log('Interval check: Re-applying sidebar color...');
                colorTypingMindSidebar();
            }
            attempts++;
            if (attempts > 30) { // Stop after ~15 seconds if still not finding/applying
                clearInterval(intervalId);
                // observer.disconnect(); // Optionally disconnect observer too if giving up
            }
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyStylesWhenReady);
    } else {
        applyStylesWhenReady();
    }

})();
