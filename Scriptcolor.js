/**
 * TypingMind Extension: Apply ChatGPT-like Dark Theme Colors
 *
 * This script targets the main sidebar/menu and dashboard/chat areas
 * of TypingMind and applies background colors similar to ChatGPT's dark mode.
 *
 * Version: 1.0
 * Date: Sat May 03 2025
 */
(function() {
    'use strict';

    // --- Configuration ---
    // Define the colors based on ChatGPT's dark theme
    // Sidebar/Menu Background Color (Typically a very dark gray)
    const sidebarBackgroundColor = '#202123';
    // Dashboard/Chat Area Background Color (Slightly lighter dark gray)
    const dashboardBackgroundColor = '#343541';

    // --- Helper Function to Apply Styles ---
    function applyStyles() {
        console.log('Applying ChatGPT dark theme colors...');

        // --- Selectors (IMPORTANT: These might need adjustment!) ---
        // These selectors are educated guesses based on common web app structures.
        // You **MUST** inspect TypingMind's elements using your browser's
        // developer tools (Right-click -> Inspect) to find the correct selectors
        // for the sidebar and the main content area.

        // **Potential Selector for the Sidebar/Menu**
        // Look for <nav>, or divs with classes suggesting sidebar, navigation, menu, often using flexbox.
        // Example Guess (Needs verification):
        const sidebarSelector = 'div.dark.bg-gray-900.text-white.flex.h-full.w-\[260px\].flex-col'; // Adjust this selector!
        const sidebarElement = document.querySelector(sidebarSelector);

        // **Potential Selector for the Dashboard/Main Chat Area**
        // Look for <main>, or divs representing the primary content area, often using flex-grow.
        // Example Guess (Needs verification):
        const dashboardSelector = 'main.relative.h-full.w-full.flex-1.overflow-auto.transition-width.bg-white.dark\\:bg-gray-800'; // Adjust this selector!
        const dashboardElement = document.querySelector(dashboardSelector);

        // --- Apply Background Colors ---
        if (sidebarElement) {
            sidebarElement.style.backgroundColor = sidebarBackgroundColor;
            console.log('Sidebar color applied to:', sidebarSelector);
        } else {
            console.warn('**TypingMind Theme:** Sidebar element not found using selector:', sidebarSelector, '. Please update the selector.');
        }

        if (dashboardElement) {
            dashboardElement.style.backgroundColor = dashboardBackgroundColor;
            console.log('Dashboard color applied to:', dashboardSelector);

            // Optional: You might need to adjust text colors for readability
            // if TypingMind doesn't handle it automatically with the dark background.
            // Example: dashboardElement.style.color = '#FFFFFF'; // Set text to white
        } else {
            console.warn('**TypingMind Theme:** Dashboard element not found using selector:', dashboardSelector, '. Please update the selector.');
        }
    }

    // --- Execution ---
    // We need to ensure the elements exist before applying styles.
    // Using requestAnimationFrame helps wait for the next repaint cycle,
    // which often gives the elements time to render. For more complex SPAs,
    // a MutationObserver might be needed for robustness.

    // Try applying styles shortly after the script loads
    // Use requestAnimationFrame for a slight delay, helping ensure elements might be ready.
    requestAnimationFrame(applyStyles);

    // Optionally, set up a MutationObserver to re-apply styles if the DOM changes significantly (advanced).
    // This is useful if TypingMind dynamically loads or replaces these elements.
    /*
    const observer = new MutationObserver((mutationsList, observer) => {
        // Look for changes that might affect the target elements
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                 // Basic check: Re-apply styles if elements might have changed
                 // More specific checks could be added for performance
                if (!document.querySelector(sidebarSelector) || !document.querySelector(dashboardSelector)) {
                   requestAnimationFrame(applyStyles);
                } else if (document.querySelector(sidebarSelector)?.style.backgroundColor !== sidebarBackgroundColor || document.querySelector(dashboardSelector)?.style.backgroundColor !== dashboardBackgroundColor) {
                   requestAnimationFrame(applyStyles);
                }
                break; // Only need to run once per batch of mutations
            }
        }
    });

    // Start observing the body for subtree modifications
     observer.observe(document.body, { childList: true, subtree: true, attributes: false });
    */


    console.log('TypingMind ChatGPT Dark Theme script loaded.');

})();
