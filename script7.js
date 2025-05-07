// ==UserScript==
// @name         TypingMind Font Changer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Change TypingMind UI font, add button to menu, with show/hide and shortcut.
// @author       Your Name
// @match        https://*.typingmind.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & Constants ---
    const SCRIPT_PREFIX = 'tmFontChanger_';
    const FONT_BUTTON_ID = SCRIPT_PREFIX + 'fontButton';
    const FONT_MODAL_ID = SCRIPT_PREFIX + 'fontModal';
    const DEFAULT_FONT_STACK = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

    let originalBodyFontFamily = '';
    let settingsButtonParent = null;
    let settingsButtonSibling = null; // The element our button should be inserted before

    // --- Helper Functions ---

    function getSetting(key, defaultValue) {
        return GM_getValue(SCRIPT_PREFIX + key, defaultValue);
    }

    function setSetting(key, value) {
        GM_setValue(SCRIPT_PREFIX + key, value);
    }

    function applyFont(fontName, isGoogleFont) {
        if (!fontName) {
            // Revert to original or default
            document.body.style.fontFamily = originalBodyFontFamily || DEFAULT_FONT_STACK;
            // Remove any added Google Font stylesheets
            const existingLink = document.getElementById(SCRIPT_PREFIX + 'googleFontLink');
            if (existingLink) {
                existingLink.remove();
            }
            return;
        }

        let effectiveFontName = fontName;
        if (isGoogleFont) {
            // Add quotes if the font name has spaces, for CSS
            effectiveFontName = fontName.includes(' ') ? `"${fontName}"` : fontName;

            // Remove previous Google Font stylesheet if any
            const existingLink = document.getElementById(SCRIPT_PREFIX + 'googleFontLink');
            if (existingLink) {
                existingLink.remove();
            }

            // Add Google Font stylesheet
            const fontUrl = `https://fonts.googleapis.com/css?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700&display=swap`;
            const link = document.createElement('link');
            link.id = SCRIPT_PREFIX + 'googleFontLink';
            link.rel = 'stylesheet';
            link.href = fontUrl;
            document.head.appendChild(link);
            document.body.style.fontFamily = `${effectiveFontName}, ${DEFAULT_FONT_STACK}`;
        } else {
            // For local fonts, also ensure quotes if spaces are present
             effectiveFontName = fontName.includes(' ') ? `"${fontName}"` : fontName;
            document.body.style.fontFamily = `${effectiveFontName}, ${DEFAULT_FONT_STACK}`;
        }
    }

    function createModal() {
        if (document.getElementById(FONT_MODAL_ID)) return; // Modal already exists

        const modal = document.createElement('div');
        modal.id = FONT_MODAL_ID;
        modal.innerHTML = `
            <div class="${SCRIPT_PREFIX}modal-content">
                <span class="${SCRIPT_PREFIX}close-button">&times;</span>
                <h2>Change UI Font</h2>
                <div class="${SCRIPT_PREFIX}form-group">
                    <label>
                        <input type="radio" name="fontType" value="google" checked> Google Font
                    </label>
                    <label>
                        <input type="radio" name="fontType" value="local"> Local Font
                    </label>
                </div>
                <div class="${SCRIPT_PREFIX}form-group">
                    <input type="text" id="${SCRIPT_PREFIX}fontNameInput" placeholder="Enter Google Font name (e.g., Lato)">
                </div>
                <div class="${SCRIPT_PREFIX}form-group">
                    <button id="${SCRIPT_PREFIX}applyFontButton">Apply Font</button>
                    <button id="${SCRIPT_PREFIX}revertFontButton">Revert to Default</button>
                </div>
                <hr>
                <div class="${SCRIPT_PREFIX}form-group">
                    <label>
                        <input type="checkbox" id="${SCRIPT_PREFIX}showFontButtonToggle"> Show Font Changer Button in Menu
                    </label>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Event Listeners for modal elements
        modal.querySelector(`.${SCRIPT_PREFIX}close-button`).addEventListener('click', toggleModal);

        document.getElementById(`${SCRIPT_PREFIX}applyFontButton`).addEventListener('click', () => {
            const fontName = document.getElementById(`${SCRIPT_PREFIX}fontNameInput`).value.trim();
            const isGoogleFont = modal.querySelector('input[name="fontType"]:checked').value === 'google';
            if (fontName) {
                applyFont(fontName, isGoogleFont);
                setSetting('savedFontName', fontName);
                setSetting('isGoogleFont', isGoogleFont);
            }
        });

        document.getElementById(`${SCRIPT_PREFIX}revertFontButton`).addEventListener('click', () => {
            applyFont(null, false); // Revert
            document.getElementById(`${SCRIPT_PREFIX}fontNameInput`).value = '';
            setSetting('savedFontName', '');
            setSetting('isGoogleFont', false);
        });

        const showButtonToggle = document.getElementById(`${SCRIPT_PREFIX}showFontButtonToggle`);
        showButtonToggle.checked = getSetting('showFontButton', true);
        showButtonToggle.addEventListener('change', (e) => {
            setSetting('showFontButton', e.target.checked);
            const mainButton = document.getElementById(FONT_BUTTON_ID);
            if (mainButton) {
                mainButton.style.display = e.target.checked ? '' : 'none';
            }
        });

        // Update placeholder based on font type
        modal.querySelectorAll('input[name="fontType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const inputField = document.getElementById(`${SCRIPT_PREFIX}fontNameInput`);
                if (e.target.value === 'google') {
                    inputField.placeholder = "Enter Google Font name (e.g., Lato)";
                } else {
                    inputField.placeholder = "Enter Local Font name (e.g., Arial)";
                }
            });
        });

        // Load saved font name into input
        const savedFontName = getSetting('savedFontName', '');
        const isGoogle = getSetting('isGoogleFont', true);
        document.getElementById(`${SCRIPT_PREFIX}fontNameInput`).value = savedFontName;
        if (isGoogle) {
            modal.querySelector('input[name="fontType"][value="google"]').checked = true;
        } else {
            modal.querySelector('input[name="fontType"][value="local"]').checked = true;
        }
         // Trigger change to set placeholder correctly
        const event = new Event('change');
        modal.querySelector('input[name="fontType"]:checked').dispatchEvent(event);


        return modal;
    }

    function toggleModal() {
        let modal = document.getElementById(FONT_MODAL_ID);
        if (!modal) {
            modal = createModal();
        }
        modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
        if (modal.style.display === 'block') {
            // Populate modal with current settings when opened
            const savedFontName = getSetting('savedFontName', '');
            const isGoogleFont = getSetting('isGoogleFont', true);
            document.getElementById(`${SCRIPT_PREFIX}fontNameInput`).value = savedFontName;
            const fontTypeRadios = modal.querySelectorAll('input[name="fontType"]');
            fontTypeRadios.forEach(radio => {
                radio.checked = (radio.value === 'google' && isGoogleFont) || (radio.value === 'local' && !isGoogleFont);
            });
             // Trigger change to set placeholder correctly
            const event = new Event('change');
            modal.querySelector('input[name="fontType"]:checked').dispatchEvent(event);

            document.getElementById(`${SCRIPT_PREFIX}showFontButtonToggle`).checked = getSetting('showFontButton', true);
        }
    }

    function addStyles() {
        GM_addStyle(`
            #${FONT_MODAL_ID} {
                display: none;
                position: fixed;
                z-index: 9999;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0,0,0,0.5);
                font-family: ${DEFAULT_FONT_STACK}; /* Modal uses default font */
            }
            .${SCRIPT_PREFIX}modal-content {
                background-color: #2d3748; /* Dark background similar to TypingMind */
                color: #e2e8f0; /* Light text */
                margin: 10% auto;
                padding: 25px;
                border: 1px solid #4a5568; /* Slightly lighter border */
                border-radius: 8px;
                width: 90%;
                max-width: 450px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }
            .${SCRIPT_PREFIX}close-button {
                color: #a0aec0; /* Lighter gray for close button */
                float: right;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
            }
            .${SCRIPT_PREFIX}close-button:hover,
            .${SCRIPT_PREFIX}close-button:focus {
                color: #cbd5e0; /* Even lighter on hover */
                text-decoration: none;
            }
            #${FONT_MODAL_ID} h2 {
                margin-top: 0;
                color: #f7fafc; /* White heading */
                border-bottom: 1px solid #4a5568;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .${SCRIPT_PREFIX}form-group {
                margin-bottom: 20px;
            }
            .${SCRIPT_PREFIX}form-group label {
                display: block;
                margin-bottom: 8px;
                color: #a0aec0; /* Lighter gray for labels */
            }
            #${FONT_MODAL_ID} input[type="text"], #${FONT_MODAL_ID} input[type="radio"] {
                accent-color: #4299e1; /* Blue accent for radio */
            }
            #${FONT_MODAL_ID} input[type="text"] {
                width: calc(100% - 22px);
                padding: 10px;
                border: 1px solid #4a5568;
                border-radius: 4px;
                background-color: #1a202c; /* Very dark input background */
                color: #e2e8f0; /* Light text in input */
            }
            #${FONT_MODAL_ID} button {
                background-color: #3182ce; /* Blue button */
                color: white;
                padding: 10px 15px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin-right: 10px;
                transition: background-color 0.2s;
            }
            #${FONT_MODAL_ID} button:hover {
                background-color: #2b6cb0; /* Darker blue on hover */
            }
            #${SCRIPT_PREFIX}revertFontButton {
                background-color: #718096; /* Gray for revert button */
            }
            #${SCRIPT_PREFIX}revertFontButton:hover {
                background-color: #4a5568; /* Darker gray on hover */
            }
            #${FONT_BUTTON_ID} {
                /* Style the main button to look like other menu items */
                padding: 8px 12px;
                margin: 0 5px;
                background-color: #4A5567; /* Example: dark gray */
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.875rem; /* Match typical menu font size */
            }
            #${FONT_BUTTON_ID}:hover {
                background-color: #2D3748; /* Example: slightly darker gray */
            }
            /* Ensure the button aligns well if it's in a flex container */
            #${FONT_BUTTON_ID} {
                display: inline-flex; /* Or flex, depending on parent */
                align-items: center;
            }
        `);
    }

    function findSettingsButtonContainer() {
        // This is the most fragile part and might need adjustment based on TypingMind's HTML structure.
        // Try to find a "Settings" link or button.
        // Common selectors for settings:
        // - An `a` tag with href containing "settings"
        // - A button/link with text "Settings"
        // - A button/link with an SVG icon often used for settings (e.g., cog)

        const potentialSelectors = [
            'a[href*="/settings"]',
            'button[aria-label*="Settings"]',
            'button[title*="Settings"]',
            // Add more specific selectors if you inspect TypingMind's DOM
            // e.g., '.sidebar nav a', '.menu-item-settings-class'
        ];

        let settingsEl = null;
        for (const selector of potentialSelectors) {
            settingsEl = document.querySelector(selector);
            if (settingsEl) break;
        }

        // Fallback: try to find by text content (less reliable if text changes or is in a sub-element)
        if (!settingsEl) {
            const allLinksAndButtons = document.querySelectorAll('a, button');
            for (const el of allLinksAndButtons) {
                if (el.textContent.trim().toLowerCase() === 'settings') {
                    settingsEl = el;
                    break;
                }
                 // Check for settings icon (very generic, might need specific path data for cog icon)
                const svgIcon = el.querySelector('svg');
                if (svgIcon) {
                    // This is a placeholder check. A real check would look for specific SVG path data for a cog icon.
                    // For example: if (svgIcon.innerHTML.includes('M19.14')) { settingsEl = el; break; }
                }
            }
        }


        if (settingsEl) {
            console.log("TM Font Changer: Found potential settings element:", settingsEl);
            settingsButtonParent = settingsEl.parentNode;
            settingsButtonSibling = settingsEl; // Insert before this element
            return true;
        } else {
            // Fallback: Try to find a common sidebar/nav container
            const navContainers = ['nav', '.sidebar', '#sidebar', 'aside[class*="sidebar"]', 'div[class*="Navigation"]', 'div[role="navigation"]'];
            for (const selector of navContainers) {
                const container = document.querySelector(selector);
                if (container) {
                    console.log("TM Font Changer: Found potential nav container:", container);
                    settingsButtonParent = container;
                    settingsButtonSibling = container.firstChild; // Insert at the beginning of the container
                    return true;
                }
            }
        }

        console.warn("TM Font Changer: Could not find 'Settings' button or a suitable menu container. The Font Changer button will be appended to the body or a fallback element if possible.");
        // As a last resort, append to a known main area or body
        settingsButtonParent = document.querySelector('body'); // Fallback, less ideal
        settingsButtonSibling = null; // Append as last child
        return false;
    }


    function createAndInsertButton() {
        if (document.getElementById(FONT_BUTTON_ID)) return; // Button already exists

        if (!settingsButtonParent) {
            console.error("TM Font Changer: Parent for button not found. Cannot add button.");
            return;
        }

        const button = document.createElement('button');
        button.id = FONT_BUTTON_ID;
        button.textContent = '🎨 Change Font'; // Or use an icon
        button.title = "Change UI Font (Shift+Alt+F)";
        button.addEventListener('click', toggleModal);

        if (getSetting('showFontButton', true)) {
            button.style.display = '';
        } else {
            button.style.display = 'none';
        }

        // Insert the button
        if (settingsButtonSibling) {
            settingsButtonParent.insertBefore(button, settingsButtonSibling);
        } else {
            settingsButtonParent.appendChild(button); // Fallback if no sibling found (e.g. append to nav container)
        }
        console.log("TM Font Changer: Font change button added to page.");
    }

    function init() {
        console.log("TM Font Changer: Initializing...");
        originalBodyFontFamily = document.body.style.fontFamily || window.getComputedStyle(document.body).fontFamily;

        addStyles();

        // Try to find the settings button container
        // It's better to wait for elements to be loaded, especially on dynamic sites
        const observer = new MutationObserver((mutations, obs) => {
            if (findSettingsButtonContainer()) {
                 // Check if our button is already there to prevent multiple insertions
                if (!document.getElementById(FONT_BUTTON_ID)) {
                    createAndInsertButton();
                }
                // Once found and button is potentially inserted, we might not need to observe anymore,
                // unless the UI drastically re-renders and removes our button.
                // For simplicity, we'll keep observing, but for performance, one might disconnect.
                // obs.disconnect(); // Optional: disconnect if button placement is stable
            }
             // Also ensure modal is created, can be done here or on first toggle
            if (!document.getElementById(FONT_MODAL_ID)) {
                createModal(); // Create modal hidden, ready for shortcut
            }
        });

        // Start observing the document body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });


        // Initial attempt to find (in case elements are already there)
        if (findSettingsButtonContainer()) {
            createAndInsertButton();
        }
        createModal(); // Create modal hidden, ready for shortcut

        // Apply saved font
        const savedFontName = getSetting('savedFontName', '');
        if (savedFontName) {
            const isGoogleFont = getSetting('isGoogleFont', true);
            applyFont(savedFontName, isGoogleFont);
        }

        // Keyboard shortcut listener
        document.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.altKey && e.key === 'F') { // Or e.code === 'KeyF'
                e.preventDefault();
                toggleModal();
            }
        });
        console.log("TM Font Changer: Initialized. Shortcut Shift+Alt+F to open font panel.");
    }

    // Run init when the document is idle or fully loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('load', init);
    }

})();
