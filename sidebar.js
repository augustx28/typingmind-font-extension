// ==UserScript==
// @name         TypingMind Sleek Sidebar Styler
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Applies a custom sleek style to the TypingMind sidebar.
// @author       Your Name
// @match        https://www.typingmind.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    // User-provided selector with special characters escaped for JavaScript
    const sidebarSelector = '#nav-handler > div.z-\\[60\\].transition.duration-300.fixed.w-full.pb-\\[--workspace-height\\].md\\:pb-0.bottom-0.left-0.md\\:w-\\[--sidebar-width\\].bottom-0.top-0';


    // --- Choose your desired style ---

    // Style 1: Sophisticated Dark Theme
    const sophisticatedDark = {
        backgroundColor: '#2D3748', // A dark slate gray
        textColor: '#E2E8F0',       // A light, cool gray for text
        borderColor: '#4A5568'      // Optional: for a subtle border
    };

    // Style 2: Clean & Minimalist Light Accent
    const minimalistLightAccent = {
        backgroundColor: '#F7FAFC', // Very light gray, almost white
        textColor: '#2D3748',       // Dark slate for text contrast
        accentColor: '#4299E1',     // A calm blue accent (e.g., for a top border or icons)
        borderColor: '#E2E8F0'      // Light border
    };

    // Style 3: Modern Teal & Charcoal
    const modernTealCharcoal = {
        backgroundColor: '#36454F', // Charcoal
        textColor: '#E0FBFC',       // Very light teal/cyan
        accentColor: '#38B2AC',     // Teal accent
        borderColor: '#2C3A3A'
    };

    // --- Select the style to apply ---
    const chosenStyle = sophisticatedDark; // Change this to minimalistLightAccent, modernTealCharcoal, etc.

    // Function to apply styles
    function applySidebarStyles() {
        const sidebar = document.querySelector(sidebarSelector);

        if (sidebar) {
            console.log('TypingMind Sidebar Styler: Sidebar element found!', sidebar);
            sidebar.style.backgroundColor = chosenStyle.backgroundColor;
            sidebar.style.color = chosenStyle.textColor; // Affects default text color inside

            // If you want to change the color of all text elements within the sidebar more aggressively:
            // sidebar.querySelectorAll('*').forEach(el => {
            //     if (el.style && el.matches(':not(svg *)')) { // Check if element has style property and is not an SVG or its child
            //         el.style.color = chosenStyle.textColor;
            //     }
            // });


            // Optional: Add a border (e.g., to the right side if it's a left sidebar)
            // sidebar.style.borderRight = `1px solid ${chosenStyle.borderColor}`;
            // Or a top border with an accent color:
            // sidebar.style.borderTop = `3px solid ${chosenStyle.accentColor || chosenStyle.borderColor}`;

            console.log('TypingMind Sidebar Styler: Styles applied.');
        } else {
            console.warn('TypingMind Sidebar Styler: Sidebar element NOT found with selector:', sidebarSelector);
            // Retry after a short delay if the element isn't immediately available
            // This is common for single-page applications that load content dynamically.
            setTimeout(applySidebarStyles, 1500); // Increased timeout slightly
        }
    }

    // --- MutationObserver to re-apply styles if TypingMind redraws the sidebar ---
    function observeDOM() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            const sidebar = document.querySelector(sidebarSelector);
            if (sidebar && sidebar.style.backgroundColor !== chosenStyle.backgroundColor.toLowerCase() && sidebar.style.backgroundColor !== chosenStyle.backgroundColor) { // Check against potential format differences
                console.log('TypingMind Sidebar Styler: Re-applying styles due to DOM change or style mismatch.');
                applySidebarStyles();
            } else if (!sidebar) {
                // If the sidebar disappeared entirely, try to find it again
                applySidebarStyles();
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        console.log('TypingMind Sidebar Styler: MutationObserver is watching for DOM changes.');
    }


    // Initial attempt to apply styles
    // Wait for the page to be somewhat loaded, especially for single-page apps
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            applySidebarStyles();
            observeDOM();
        });
    } else {
        applySidebarStyles();
        observeDOM();
    }

})();
