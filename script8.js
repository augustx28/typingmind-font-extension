// ==UserScript==
// @name         TypingMind Font Changer
// @namespace    http://your.namespace.here/
// @version      0.3
// @description  Adds a button/shortcut to change UI fonts on TypingMind, with visibility toggle.
// @author       Your Name
// @match        https://*.typingmind.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    // You may need to adjust these selectors based on TypingMind's current HTML structure.
    // To find these: right-click on the menu bar or settings button in TypingMind -> Inspect Element.
    const TYPINGMIND_MENU_BAR_SELECTOR = 'nav, header, [role="menubar"], .flex.items-center.justify-between.h-16.px-4'; // Try to find a nav, header, or a common top bar class
    const TYPINGMIND_SETTINGS_ITEM_SELECTOR = 'button[aria-label*="settings"], a[href*="settings"], button span:contains("Settings")'; // Tries to find a settings button/link

    const SCRIPT_PREFIX = 'tmFontChanger_';
    const FONT_BUTTON_ID = `${SCRIPT_PREFIX}fontChangeButton`;
    const GOOGLE_FONT_STYLESHEET_ID = `${SCRIPT_PREFIX}googleFontStylesheet`;
    const FONT_OVERRIDE_STYLE_ID = `${SCRIPT_PREFIX}fontOverrideStyle`;
    const NOTIFICATION_ID = `${SCRIPT_PREFIX}notification`;

    const LS_KEYS = {
        buttonVisible: `${SCRIPT_PREFIX}buttonVisible`,
        lastFont: `${SCRIPT_PREFIX}lastFont`,
        lastFontIsGoogle: `${SCRIPT_PREFIX}lastFontIsGoogle`
    };

    // Helper for GM_getValue and GM_setValue for broader compatibility if not using a userscript manager that provides them
    // For simple GitHub script loading without Tampermonkey/Greasemonkey, localStorage is the fallback.
    const storage = {
        getValue: typeof GM_getValue !== 'undefined' ? GM_getValue : (key, def) => localStorage.getItem(key) || def,
        setValue: typeof GM_setValue !== 'undefined' ? GM_setValue : (key, value) => localStorage.setItem(key, value)
    };


    /**
     * Adds a Google Font stylesheet to the document's head.
     * @param {string} fontName - The name of the Google Font.
     */
    function addGoogleFont(fontName) {
        let existingLink = document.getElementById(GOOGLE_FONT_STYLESHEET_ID);
        if (existingLink) {
            existingLink.remove();
        }
        const link = document.createElement('link');
        link.id = GOOGLE_FONT_STYLESHEET_ID;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css?family=${fontName.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
        document.head.appendChild(link);
        console.log(`[Font Changer] Added Google Font: ${fontName}`);
    }

    /**
     * Applies the chosen font to the entire page.
     * @param {string} fontName - The name of the font to apply.
     */
    function applyFont(fontName) {
        let existingStyle = document.getElementById(FONT_OVERRIDE_STYLE_ID);
        if (existingStyle) {
            existingStyle.remove();
        }
        const style = document.createElement('style');
        style.id = FONT_OVERRIDE_STYLE_ID;
        style.innerHTML = `
            body, body *, p, span, div, h1, h2, h3, h4, h5, h6, button, input, textarea, select, option, label, a, li, code, pre, table, th, td, [class*="text-"] {
                font-family: "${fontName}", BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
            }
        `;
        document.head.appendChild(style);
        console.log(`[Font Changer] Attempted to apply font: ${fontName}`);
    }

    /**
     * Prompts the user for a font and applies it.
     */
    function promptAndApplyFont() {
        const fontNameInput = prompt("Enter font name (e.g., 'Roboto', 'Arial', 'Open Sans', 'Courier New'):\nOr type 'reset' to clear custom font.", storage.getValue(LS_KEYS.lastFont, ''));

        if (fontNameInput === null) return; // User cancelled

        const fontName = fontNameInput.trim();

        if (fontName.toLowerCase() === 'reset') {
            let existingStyle = document.getElementById(FONT_OVERRIDE_STYLE_ID);
            if (existingStyle) existingStyle.remove();
            let existingLink = document.getElementById(GOOGLE_FONT_STYLESHEET_ID);
            if (existingLink) existingLink.remove();
            storage.setValue(LS_KEYS.lastFont, '');
            storage.setValue(LS_KEYS.lastFontIsGoogle, 'false');
            showNotification("Custom font reset.", "success");
            return;
        }

        if (fontName === '') {
            showNotification("Font name cannot be empty.", "error");
            return;
        }

        const isGoogleFont = confirm(`Is "${fontName}" a Google Font?\n\n(OK = Yes, it's a Google Font | Cancel = No, it's a local font)`);

        if (isGoogleFont) {
            addGoogleFont(fontName);
        }
        applyFont(fontName);

        storage.setValue(LS_KEYS.lastFont, fontName);
        storage.setValue(LS_KEYS.lastFontIsGoogle, isGoogleFont ? 'true' : 'false');
        showNotification(`Font changed to "${fontName}". Refresh may be needed for all elements.`, "success");
    }

    /**
     * Creates and injects the font change button and related controls.
     */
    function createFontInterfaceControls() {
        let button = document.getElementById(FONT_BUTTON_ID);
        if (button) return; // Already created

        button = document.createElement('button');
        button.id = FONT_BUTTON_ID;
        button.textContent = '🎨 Fonts';
        button.title = 'Change UI Font (Shift+Alt+F)';

        // Basic styling for a menu button
        button.style.padding = '8px 12px';
        button.style.marginLeft = '10px'; // Space from previous item
        button.style.backgroundColor = 'transparent'; // Or a theme-appropriate color
        button.style.color = 'inherit'; // Inherit color from parent menu
        button.style.border = '1px solid #ccc'; // Subtle border
        button.style.borderRadius = '6px';
        button.style.cursor = 'pointer';
        button.style.fontSize = 'inherit'; // Inherit font size
        button.style.fontFamily = 'inherit';

        button.addEventListener('click', promptAndApplyFont);

        // Attempt to place the button in the menu bar
        let placedInMenu = false;
        const settingsItem = document.querySelector(TYPINGMIND_SETTINGS_ITEM_SELECTOR);
        if (settingsItem && settingsItem.parentNode) {
            settingsItem.parentNode.insertBefore(button, settingsItem);
            placedInMenu = true;
            console.log('[Font Changer] Button placed before settings item.');
        } else {
            const menuBar = document.querySelector(TYPINGMIND_MENU_BAR_SELECTOR);
            if (menuBar) {
                menuBar.appendChild(button);
                placedInMenu = true;
                console.log('[Font Changer] Button appended to menu bar.');
            }
        }

        if (!placedInMenu) {
            console.warn('[Font Changer] Could not find target menu bar or settings item. Falling back to fixed position.');
            // Fallback styling if not placed in menu
            button.style.position = 'fixed';
            button.style.bottom = '20px';
            button.style.right = '20px';
            button.style.zIndex = '10000';
            button.style.backgroundColor = '#1e88e5';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            button.style.fontSize = '14px'; // Reset if fixed
            button.style.fontFamily = 'Arial, sans-serif'; // Reset if fixed
            document.body.appendChild(button);
        }

        updateButtonVisibility(); // Set initial visibility
    }

    /**
     * Toggles the visibility of the font button and saves the preference.
     */
    function toggleButtonVisibilityAndSave() {
        const currentVisibility = storage.getValue(LS_KEYS.buttonVisible, 'true') === 'true';
        const newVisibility = !currentVisibility;
        storage.setValue(LS_KEYS.buttonVisible, newVisibility ? 'true' : 'false');
        updateButtonVisibility();
        showNotification(`Font button is now ${newVisibility ? 'visible' : 'hidden'}. (Use Shift+Alt+H to toggle)`, "success");
    }

    /**
     * Updates the button's display style based on stored preference.
     */
    function updateButtonVisibility() {
        const button = document.getElementById(FONT_BUTTON_ID);
        if (button) {
            const isVisible = storage.getValue(LS_KEYS.buttonVisible, 'true') === 'true';
            button.style.display = isVisible ? '' : 'none'; // Use '' to revert to default display
        }
    }


    /**
     * Shows a temporary notification message on the screen.
     */
    function showNotification(message, type = 'success') {
        let notification = document.getElementById(NOTIFICATION_ID);
        if (notification) notification.remove();

        notification = document.createElement('div');
        notification.id = NOTIFICATION_ID;
        notification.textContent = message;
        // Basic styling, can be improved
        Object.assign(notification.style, {
            position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
            padding: '12px 20px', borderRadius: '6px', color: 'white', zIndex: '10001',
            fontSize: '14px', fontFamily: 'Arial, sans-serif', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            opacity: '0', transition: 'opacity 0.5s ease-in-out',
            backgroundColor: type === 'error' ? '#e53935' : '#43a047'
        });

        document.body.appendChild(notification);
        setTimeout(() => notification.style.opacity = '1', 10);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    /**
     * Keyboard shortcut handler.
     */
    function handleKeyPress(event) {
        if (event.shiftKey && event.altKey) {
            if (event.key === 'F' || event.key === 'f') {
                event.preventDefault();
                promptAndApplyFont();
            } else if (event.key === 'H' || event.key === 'h') {
                event.preventDefault();
                toggleButtonVisibilityAndSave();
            }
        }
    }

    /**
     * Applies the last used font on script load.
     */
    function applyLastUsedFont() {
        const lastFont = storage.getValue(LS_KEYS.lastFont);
        if (lastFont && lastFont.trim() !== '') {
            const isGoogle = storage.getValue(LS_KEYS.lastFontIsGoogle) === 'true';
            if (isGoogle) {
                addGoogleFont(lastFont);
            }
            applyFont(lastFont);
            console.log(`[Font Changer] Re-applied last used font: ${lastFont}`);
        }
    }

    // --- Initialization ---
    function init() {
        applyLastUsedFont(); // Apply last font first
        createFontInterfaceControls(); // Then create UI
        document.addEventListener('keydown', handleKeyPress);

        // Robustness: Re-check for button if it's supposed to be visible and got removed by SPA updates.
        setInterval(() => {
            const buttonShouldBeVisible = storage.getValue(LS_KEYS.buttonVisible, 'true') === 'true';
            if (buttonShouldBeVisible && !document.getElementById(FONT_BUTTON_ID)) {
                console.log('[Font Changer] Button not found but should be visible, attempting to re-add.');
                createFontInterfaceControls(); // This will also re-apply visibility
            }
        }, 7000); // Check periodically
    }

    // Wait for the page to be somewhat loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init);
    }

})();
