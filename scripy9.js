// ==UserScript==
// @name         TypingMind Font Changer
// @namespace    http://your.namespace.here/
// @version      1.0
// @description  Customize UI fonts on TypingMind.com with Google Fonts or local fonts.
// @author       Your Name
// @match        https://www.typingmind.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const SCRIPT_PREFIX = 'tmfc_'; // Prefix for CSS classes and localStorage keys
    const GOOGLE_FONTS = [
        "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Raleway",
        "Poppins", "Nunito", "Merriweather", "Inter", "Source Sans Pro",
        "PT Sans", "Ubuntu", "Noto Sans"
    ];
    const SHORTCUT_KEY = 'F';
    const SHORTCUT_MODIFIERS = { altKey: true, shiftKey: true, ctrlKey: false }; // Shift + Alt + F

    // --- DOM Element Selectors (ADJUST THESE IF NEEDED) ---
    // Try to find a known menu item like "Settings" or "Models" to insert the button next to.
    // This is the most likely part you'll need to adjust based on TypingMind's current HTML structure.
    // Option 1: Find a specific element and insert after its parent.
    const TARGET_MENU_ITEM_TEXT = "Settings"; // Text of an existing menu item
    // Option 2: A more general selector for the menu container.
    const MENU_CONTAINER_SELECTOR = "nav ul"; // Example: 'nav > div > ul' or similar

    // --- State & Storage Helper ---
    const storage = {
        getItem: (key, defaultValue) => {
            const val = localStorage.getItem(SCRIPT_PREFIX + key);
            if (val === null && defaultValue !== undefined) return defaultValue;
            try {
                return JSON.parse(val);
            } catch (e) {
                return val; // Return as string if not JSON
            }
        },
        setItem: (key, value) => {
            localStorage.setItem(SCRIPT_PREFIX + key, JSON.stringify(value));
        }
    };

    let fontPanelVisible = false;
    let showMenuButtonSetting = storage.getItem('showMenuButton', true);
    let currentFontSetting = storage.getItem('currentFont', { name: '', isGoogle: false, custom: false });

    // --- DOM Elements ---
    let menuButtonContainer = null; // This will be the <li> or <div> wrapping our button
    let menuButton = null;
    let fontPanel = null;
    let googleFontSelect = null;
    let localFontInput = null;
    let showButtonCheckbox = null;
    let activeGoogleFontLink = null;

    // --- Core Functions ---

    function injectStyles() {
        const css = `
            .${SCRIPT_PREFIX}menu-button {
                background: none;
                border: none;
                color: inherit; /* Inherit color from other menu items */
                cursor: pointer;
                padding: 8px 12px; /* Adjust padding to match other items */
                margin: 0 5px;   /* Adjust margin */
                font-family: inherit;
                font-size: inherit; /* Inherit font size */
                display: flex;
                align-items: center;
                border-radius: 6px;
            }
            .${SCRIPT_PREFIX}menu-button:hover {
                background-color: rgba(0,0,0,0.05); /* Subtle hover */
            }
            .${SCRIPT_PREFIX}panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #ffffff;
                color: #333333;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 10001; /* High z-index */
                width: 380px;
                max-width: 90vw;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                display: none; /* Hidden by default */
                border: 1px solid #e0e0e0;
            }
            .${SCRIPT_PREFIX}panel.visible {
                display: block;
            }
            .${SCRIPT_PREFIX}panel h3 {
                margin-top: 0;
                margin-bottom: 20px;
                font-size: 1.4em;
                color: #1a1a1a;
                text-align: center;
            }
            .${SCRIPT_PREFIX}panel .form-group {
                margin-bottom: 18px;
            }
            .${SCRIPT_PREFIX}panel label {
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                font-size: 0.95em;
                color: #555555;
            }
            .${SCRIPT_PREFIX}panel select, .${SCRIPT_PREFIX}panel input[type="text"] {
                width: 100%;
                padding: 10px;
                border: 1px solid #cccccc;
                border-radius: 6px;
                box-sizing: border-box;
                font-size: 1em;
            }
            .${SCRIPT_PREFIX}panel .button-group {
                display: flex;
                justify-content: space-between;
                margin-top: 25px;
                gap: 10px;
            }
            .${SCRIPT_PREFIX}panel button {
                padding: 10px 15px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.95em;
                transition: background-color 0.2s ease;
            }
            .${SCRIPT_PREFIX}panel .apply-button {
                background-color: #007bff; /* Primary button color */
                color: white;
                flex-grow: 1;
            }
            .${SCRIPT_PREFIX}panel .apply-button:hover {
                background-color: #0056b3;
            }
             .${SCRIPT_PREFIX}panel .reset-button {
                background-color: #6c757d; /* Secondary/Gray button */
                color: white;
            }
            .${SCRIPT_PREFIX}panel .reset-button:hover {
                background-color: #545b62;
            }
            .${SCRIPT_PREFIX}panel .close-button {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 1.8em;
                cursor: pointer;
                color: #888;
                padding: 5px;
                line-height: 1;
            }
            .${SCRIPT_PREFIX}panel .close-button:hover {
                color: #333;
            }
            .${SCRIPT_PREFIX}panel .settings-group {
                margin-top: 25px;
                padding-top: 15px;
                border-top: 1px solid #e0e0e0;
            }
            .${SCRIPT_PREFIX}panel .settings-group label {
                display: flex;
                align-items: center;
                font-weight: normal;
                font-size: 0.9em;
            }
            .${SCRIPT_PREFIX}panel .settings-group input[type="checkbox"] {
                margin-right: 8px;
                width: auto;
            }
        `;
        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }

    function createMenuButton() {
        menuButton = document.createElement('button');
        menuButton.textContent = 'Fonts'; // Or an icon like 'Aa'
        menuButton.className = `${SCRIPT_PREFIX}menu-button`;
        menuButton.title = 'Change UI Font (Shift+Alt+F)';
        menuButton.addEventListener('click', handleMenuButtonClick);

        // Attempt to insert the button
        // This is the most fragile part and likely needs adjustment
        let inserted = false;
        try {
            const targetMenuItem = Array.from(document.querySelectorAll('nav a, nav button, header a, header button')) // Common menu item tags
                                      .find(el => el.textContent.trim().toLowerCase() === TARGET_MENU_ITEM_TEXT.toLowerCase());

            if (targetMenuItem) {
                // Assuming menu items are typically in <li> or similar parent containers
                let parentToInsertAfter = targetMenuItem.closest('li') || targetMenuItem.parentElement;
                if (parentToInsertAfter && parentToInsertAfter.parentElement) {
                     // Create a new list item for our button if needed
                    menuButtonContainer = document.createElement(parentToInsertAfter.tagName);
                    menuButtonContainer.appendChild(menuButton);
                    parentToInsertAfter.insertAdjacentElement('afterend', menuButtonContainer);
                    inserted = true;
                }
            }

            if (!inserted) {
                const menuContainer = document.querySelector(MENU_CONTAINER_SELECTOR);
                if (menuContainer) {
                    // If menu items are directly in the container, or if we need a generic wrapper
                    const wrapperTag = menuContainer.querySelector('li') ? 'li' : 'div';
                    menuButtonContainer = document.createElement(wrapperTag);
                    menuButtonContainer.appendChild(menuButton);
                    menuContainer.appendChild(menuButtonContainer);
                    inserted = true;
                }
            }
        } catch (error) {
            console.error(`${SCRIPT_PREFIX}Error finding menu insertion point:`, error);
        }


        if (!inserted) {
            console.warn(`${SCRIPT_PREFIX}Could not find a suitable place to insert the menu button. It will be appended to the body as a fallback (less ideal).`);
            // Fallback: append to body if menu insertion fails (not ideal, but makes it accessible)
            menuButton.style.position = 'fixed';
            menuButton.style.top = '10px';
            menuButton.style.right = '100px'; // Adjust as needed
            menuButton.style.zIndex = '10000';
            menuButton.style.backgroundColor = '#f0f0f0';
            menuButton.style.border = '1px solid #ccc';
            document.body.appendChild(menuButton);
            menuButtonContainer = menuButton; // In this case, the button itself is the container
        }
        updateMenuButtonVisibility();
    }

    function createFontPanel() {
        fontPanel = document.createElement('div');
        fontPanel.className = `${SCRIPT_PREFIX}panel`;
        fontPanel.innerHTML = `
            <button class="${SCRIPT_PREFIX}close-button" title="Close">&times;</button>
            <h3>Customize Font</h3>

            <div class="${SCRIPT_PREFIX}form-group">
                <label for="${SCRIPT_PREFIX}google-font-select">Google Font:</label>
                <select id="${SCRIPT_PREFIX}google-font-select">
                    <option value="">-- Select Google Font --</option>
                    ${GOOGLE_FONTS.map(font => `<option value="${font}">${font}</option>`).join('')}
                </select>
            </div>

            <div class="${SCRIPT_PREFIX}form-group">
                <label for="${SCRIPT_PREFIX}local-font-input">Local Font (Type exact name):</label>
                <input type="text" id="${SCRIPT_PREFIX}local-font-input" placeholder="e.g., Arial, Verdana">
            </div>

            <div class="${SCRIPT_PREFIX}button-group">
                <button class="${SCRIPT_PREFIX}apply-button" id="${SCRIPT_PREFIX}apply-font-button">Apply Font</button>
                <button class="${SCRIPT_PREFIX}reset-button" id="${SCRIPT_PREFIX}reset-font-button">Reset to Default</button>
            </div>

            <div class="${SCRIPT_PREFIX}settings-group">
                <label>
                    <input type="checkbox" id="${SCRIPT_PREFIX}show-button-checkbox">
                    Show 'Fonts' button in menu
                </label>
            </div>
        `;
        document.body.appendChild(fontPanel);

        // Get references to panel elements
        googleFontSelect = fontPanel.querySelector(`#${SCRIPT_PREFIX}google-font-select`);
        localFontInput = fontPanel.querySelector(`#${SCRIPT_PREFIX}local-font-input`);
        showButtonCheckbox = fontPanel.querySelector(`#${SCRIPT_PREFIX}show-button-checkbox`);

        // Add event listeners
        fontPanel.querySelector(`.${SCRIPT_PREFIX}close-button`).addEventListener('click', () => toggleFontPanel(false));
        fontPanel.querySelector(`#${SCRIPT_PREFIX}apply-font-button`).addEventListener('click', handleApplyFont);
        fontPanel.querySelector(`#${SCRIPT_PREFIX}reset-font-button`).addEventListener('click', handleResetFont);
        showButtonCheckbox.addEventListener('change', handleShowButtonToggle);

        // Set initial state of checkbox
        showButtonCheckbox.checked = showMenuButtonSetting;
    }

    function toggleFontPanel(forceShow) {
        fontPanelVisible = (forceShow !== undefined) ? forceShow : !fontPanelVisible;
        fontPanel.classList.toggle('visible', fontPanelVisible);
        if (fontPanelVisible) {
            // Reflect current settings when panel opens
            if (currentFontSetting.name) {
                if (currentFontSetting.isGoogle) {
                    googleFontSelect.value = currentFontSetting.name;
                    localFontInput.value = '';
                } else if (currentFontSetting.custom) {
                    localFontInput.value = currentFontSetting.name;
                    googleFontSelect.value = '';
                }
            } else {
                googleFontSelect.value = '';
                localFontInput.value = '';
            }
        }
    }

    function loadGoogleFont(fontName) {
        if (activeGoogleFontLink) {
            activeGoogleFontLink.remove(); // Remove previous Google Font stylesheet
            activeGoogleFontLink = null;
        }
        if (!fontName) return;

        const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;500;700&display=swap`;
        const link = document.createElement('link');
        link.href = fontUrl;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        activeGoogleFontLink = link;
    }

    function applyFont(fontName, isGoogleFont = false, isCustom = false) {
        if (!fontName) { // Resetting
            document.body.style.fontFamily = ''; // Revert to website's default
            if (activeGoogleFontLink) {
                activeGoogleFontLink.remove();
                activeGoogleFontLink = null;
            }
            currentFontSetting = { name: '', isGoogle: false, custom: false };
        } else {
            if (isGoogleFont) {
                loadGoogleFont(fontName);
            } else if (activeGoogleFontLink) { // Using local font, remove any active Google Font
                activeGoogleFontLink.remove();
                activeGoogleFontLink = null;
            }
            // Apply the font. Use quotes for font names with spaces.
            document.body.style.fontFamily = `"${fontName}", sans-serif`; // Added sans-serif as a generic fallback
            currentFontSetting = { name: fontName, isGoogle: isGoogleFont, custom: isCustom };
        }
        storage.setItem('currentFont', currentFontSetting);
    }

    function updateMenuButtonVisibility() {
        if (menuButtonContainer) {
            menuButtonContainer.style.display = showMenuButtonSetting ? '' : 'none';
        } else if (menuButton) { // Fallback if container is the button itself
             menuButton.style.display = showMenuButtonSetting ? '' : 'none';
        }
    }

    // --- Event Handlers ---
    function handleMenuButtonClick() {
        toggleFontPanel();
    }

    function handleApplyFont() {
        const selectedGoogleFont = googleFontSelect.value;
        const enteredLocalFont = localFontInput.value.trim();

        if (selectedGoogleFont) {
            applyFont(selectedGoogleFont, true, false);
            localFontInput.value = ''; // Clear other input
        } else if (enteredLocalFont) {
            applyFont(enteredLocalFont, false, true);
            googleFontSelect.value = ''; // Clear other input
        } else {
            // If both are empty, could be interpreted as a reset or do nothing.
            // For clarity, user should use the reset button.
            // alert("Please select a Google Font or enter a local font name.");
            // Using a less intrusive way to provide feedback, or just do nothing.
            console.log(`${SCRIPT_PREFIX}No font selected or entered to apply.`);
        }
    }

    function handleResetFont() {
        applyFont(null); // Pass null to reset
        googleFontSelect.value = '';
        localFontInput.value = '';
    }

    function handleShowButtonToggle() {
        showMenuButtonSetting = showButtonCheckbox.checked;
        storage.setItem('showMenuButton', showMenuButtonSetting);
        updateMenuButtonVisibility();
    }

    function handleKeyboardShortcut(event) {
        if (event.key.toUpperCase() === SHORTCUT_KEY &&
            event.altKey === SHORTCUT_MODIFIERS.altKey &&
            event.shiftKey === SHORTCUT_MODIFIERS.shiftKey &&
            event.ctrlKey === SHORTCUT_MODIFIERS.ctrlKey) {
            event.preventDefault();
            toggleFontPanel();
        }
    }

    // --- Initialization ---
    function init() {
        injectStyles();
        createFontPanel(); // Create panel first
        createMenuButton(); // Then create button that might interact with panel state

        // Apply saved font on load
        if (currentFontSetting.name) {
            applyFont(currentFontSetting.name, currentFontSetting.isGoogle, currentFontSetting.custom);
        }

        document.addEventListener('keydown', handleKeyboardShortcut);

        console.log(`${SCRIPT_PREFIX}Font Changer initialized.`);
    }

    // Wait for the DOM to be ready before trying to manipulate it.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOMContentLoaded has already fired
        init();
    }

    // For very dynamic sites, you might need a MutationObserver to wait for the menu
    // This is a basic version that assumes the menu is available on DOMContentLoaded.
    // If the menu button doesn't appear, you might need to add a MutationObserver
    // to wait for the target menu elements to be added to the DOM.

})();
