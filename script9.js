// ==UserScript==
// @name         TypingMind Font Changer
// @namespace    http://your.namespace.here/
// @version      0.2
// @description  Adds a button to change UI fonts on a webpage.
// @author       Your Name
// @match        https://*.typingmind.com/* // Adjust if TypingMind's URL pattern is different
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_PREFIX = 'tmFontChanger_'; // Prefix for IDs to avoid collisions

    /**
     * Adds a Google Font stylesheet to the document's head.
     * @param {string} fontName - The name of the Google Font (e.g., "Roboto", "Open Sans").
     */
    function addGoogleFont(fontName) {
        const fontId = `${SCRIPT_PREFIX}googleFontStylesheet`;
        let existingLink = document.getElementById(fontId);
        if (existingLink) {
            existingLink.remove(); // Remove old font link if any
        }

        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        // Request common weights (400 regular, 700 bold) and use display=swap for better loading
        link.href = `https://fonts.googleapis.com/css?family=${fontName.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
        document.head.appendChild(link);
        console.log(`[Font Changer] Added Google Font: ${fontName}`);
    }

    /**
     * Applies the chosen font to the entire page by injecting a style tag.
     * @param {string} fontName - The name of the font to apply.
     */
    function applyFont(fontName) {
        const styleId = `${SCRIPT_PREFIX}fontOverrideStyle`;
        let existingStyle = document.getElementById(styleId);
        if (existingStyle) {
            existingStyle.remove(); // Remove old style tag if any
        }

        const style = document.createElement('style');
        style.id = styleId;
        // Using a comprehensive selector and !important to maximize override potential.
        // Includes common fallback fonts.
        style.innerHTML = `
            body, body *, p, span, div, h1, h2, h3, h4, h5, h6, button, input, textarea, select, option, label, a, li, code, pre, table, th, td {
                font-family: "${fontName}", BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
            }
        `;
        document.head.appendChild(style);
        console.log(`[Font Changer] Attempted to apply font: ${fontName}`);
    }

    /**
     * Creates and injects the font change button onto the page.
     */
    function createFontChangeButton() {
        if (document.getElementById(`${SCRIPT_PREFIX}fontChangeButton`)) {
            console.log('[Font Changer] Button already exists.');
            return; // Avoid adding multiple buttons
        }

        const button = document.createElement('button');
        button.id = `${SCRIPT_PREFIX}fontChangeButton`;
        button.textContent = '🎨 Change Font'; // Added an emoji for fun

        // Styling the button
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '10000'; // High z-index to stay on top
        button.style.padding = '12px 18px';
        button.style.backgroundColor = '#1e88e5'; // A nice blue
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '8px'; // Slightly more rounded
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        button.style.fontSize = '14px';
        button.style.fontFamily = 'Arial, sans-serif'; // Ensure button text is readable
        button.style.transition = 'background-color 0.3s ease'; // Smooth hover effect

        button.onmouseover = () => button.style.backgroundColor = '#1565c0'; // Darker blue on hover
        button.onmouseout = () => button.style.backgroundColor = '#1e88e5';

        button.addEventListener('click', () => {
            const fontNameInput = prompt("Enter font name (e.g., 'Roboto', 'Arial', 'Open Sans', 'Courier New'):");
            if (!fontNameInput || fontNameInput.trim() === '') {
                // Using a custom-like alert for better UX than native alert
                showNotification("Font name cannot be empty.", "error");
                return;
            }
            const fontName = fontNameInput.trim();

            const isGoogleFont = confirm(`Is "${fontName}" a Google Font?\n\n(OK = Yes, it's a Google Font | Cancel = No, it's a local font)`);

            if (isGoogleFont) {
                addGoogleFont(fontName);
            }
            // Apply the font. If it's a local font, the browser will try to use it.
            // If it's a Google Font, the addGoogleFont function will have prepared it.
            applyFont(fontName);
            showNotification(`Font changed to "${fontName}". Some elements might require a page refresh to update fully if the font was just downloaded.`, "success");
        });

        document.body.appendChild(button);
        console.log('[Font Changer] Font change button added to the page.');
    }

    /**
     * Shows a temporary notification message on the screen.
     * @param {string} message - The message to display.
     * @param {'success'|'error'} type - The type of message.
     */
    function showNotification(message, type = 'success') {
        const notificationId = `${SCRIPT_PREFIX}notification`;
        let notification = document.getElementById(notificationId);
        if (notification) {
            notification.remove();
        }

        notification = document.createElement('div');
        notification.id = notificationId;
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.color = 'white';
        notification.style.zIndex = '10001'; // Above the button
        notification.style.fontSize = '14px';
        notification.style.fontFamily = 'Arial, sans-serif';
        notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        notification.style.opacity = '0'; // Start transparent for fade-in
        notification.style.transition = 'opacity 0.5s ease-in-out';

        if (type === 'error') {
            notification.style.backgroundColor = '#e53935'; // Red for error
        } else {
            notification.style.backgroundColor = '#43a047'; // Green for success
        }

        document.body.appendChild(notification);

        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10); // Small delay to ensure transition triggers

        // Automatically remove after a few seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 500); // Wait for fade-out transition
        }, 4000);
    }


    // --- Initialization ---
    // Websites like TypingMind are often Single Page Applications (SPAs).
    // `window.onload` or `DOMContentLoaded` might fire too early, or only once.
    // A MutationObserver is more robust for SPAs to ensure the button is re-added if the DOM changes significantly.
    // However, for simplicity, we'll start with window.onload and a check.

    if (document.readyState === 'complete') {
        createFontChangeButton();
    } else {
        window.addEventListener('load', createFontChangeButton);
    }

    // Fallback/Robustness: If the site is highly dynamic and removes the body's children
    // a MutationObserver could be used. This is a more advanced setup.
    // For now, the 'load' event should cover many cases.
    // Example of a simple check to re-add if button is gone (not a full MutationObserver):
    setInterval(() => {
        if (!document.getElementById(`${SCRIPT_PREFIX}fontChangeButton`)) {
            console.log('[Font Changer] Button not found, attempting to re-add.');
            createFontChangeButton();
        }
    }, 5000); // Check every 5 seconds

})();
