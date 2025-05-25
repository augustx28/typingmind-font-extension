// ==UserScript==
// @name         TypingMind Advanced Font Changer
// @namespace    http://your.namespace.here/
// @version      1.5
// @description  Customize UI fonts on TypingMind.com with Google Fonts (including bold/normal), local fonts, and improved UI.
// @author       Your Name (Updated by AI)
// @match        https://www.typingmind.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const SCRIPT_PREFIX = 'tm_adv_fc_'; // Prefix for CSS classes and localStorage keys
    const SCRIPT_NAME = 'TypingMind Advanced Font Changer';
    const GOOGLE_FONTS = [
        "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Raleway", "Poppins",
        "Nunito", "Merriweather", "Inter", "Source Sans Pro", "PT Sans", "Ubuntu",
        "Noto Sans", "Work Sans", "Space Grotesk", "DM Sans", "Rubik", "Karla",
        "Fira Sans", "Recursive", "Manrope", "IBM Plex Sans", "Lexend"
    ].sort(); // Keep them sorted for the dropdown

    const FONT_WEIGHTS = {
        "Normal": "400",
        "Bold": "700"
    };
    const DEFAULT_FONT_WEIGHT = "Normal";

    const SHORTCUT_KEY = 'F';
    const SHORTCUT_MODIFIERS = { altKey: true, shiftKey: true, ctrlKey: false }; // Shift + Alt + F

    // --- DOM Element Selectors (ADJUST THESE IF TYPINGMIND.COM CHANGES) ---
    const TARGET_MENU_ITEM_TEXT = "Settings"; // Text of an existing menu item (e.g., "Settings", "Models")
    const MENU_CONTAINER_SELECTOR = "nav ul"; // A more general selector for the menu container (e.g., 'nav > div > ul', 'aside nav ul')

    // --- State & Storage Helper (using GM_setValue/GM_getValue for better cross-browser/userscript manager compatibility if available) ---
    const storage = {
        getItem: (key, defaultValue) => {
            let val = typeof GM_getValue !== 'undefined' ? GM_getValue(SCRIPT_PREFIX + key) : localStorage.getItem(SCRIPT_PREFIX + key);
            if (val === undefined || val === null) return defaultValue;
            try {
                // Check if it's a GM_getValue string that might need parsing
                if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
                     return JSON.parse(val);
                }
                 // If GM_getValue already parsed it (or it's a simple string from localStorage not needing JSON parsing)
                if (typeof val !== 'string' || (!val.startsWith('{') && !val.startsWith('['))) {
                    const parsed = JSON.parse(val); // Attempt parse for values stored by older localStorage version
                    return parsed;
                }
            } catch (e) {
                // If JSON.parse fails, it might be a simple string value or an old format
                // For GM_getValue, if it wasn't JSON, it might be a plain string/number/boolean already
            }
            return val; // Return as is if not JSON or already parsed
        },
        setItem: (key, value) => {
            const valToStore = JSON.stringify(value);
            if (typeof GM_setValue !== 'undefined') {
                GM_setValue(SCRIPT_PREFIX + key, valToStore);
            } else {
                localStorage.setItem(SCRIPT_PREFIX + key, valToStore);
            }
        }
    };

    let fontPanelVisible = false;
    let showMenuButtonSetting = storage.getItem('showMenuButton', true);
    let currentFontSetting = storage.getItem('currentFont', {
        name: '',
        isGoogle: false,
        custom: false,
        weight: FONT_WEIGHTS[DEFAULT_FONT_WEIGHT]
    });

    // --- DOM Elements ---
    let menuButtonContainer = null;
    let menuButton = null;
    let fontPanel = null;
    let googleFontSelect = null;
    let localFontInput = null;
    let fontWeightSelect = null;
    let showButtonCheckbox = null;
    let activeGoogleFontLink = null;

    // --- Core Functions ---

    function injectStyles() {
        const css = `
            :root {
                --${SCRIPT_PREFIX}panel-bg: #ffffff;
                --${SCRIPT_PREFIX}panel-text: #333333;
                --${SCRIPT_PREFIX}panel-border: #dee2e6;
                --${SCRIPT_PREFIX}primary-color: #007bff;
                --${SCRIPT_PREFIX}primary-hover-color: #0056b3;
                --${SCRIPT_PREFIX}secondary-color: #6c757d;
                --${SCRIPT_PREFIX}secondary-hover-color: #545b62;
                --${SCRIPT_PREFIX}input-border-color: #ced4da;
                --${SCRIPT_PREFIX}input-focus-border-color: #86b7fe;
                --${SCRIPT_PREFIX}input-focus-box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                --${SCRIPT_PREFIX}panel-font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }
            body.dark-mode { /* Example for dark mode compatibility if TypingMind has one */
                --${SCRIPT_PREFIX}panel-bg: #2d3748; /* Dark background */
                --${SCRIPT_PREFIX}panel-text: #e2e8f0; /* Light text */
                --${SCRIPT_PREFIX}panel-border: #4a5568;
                --${SCRIPT_PREFIX}input-border-color: #4a5568;
            }
            .${SCRIPT_PREFIX}menu-button {
                background: none;
                border: 1px solid transparent; /* For consistent sizing with icon buttons */
                color: inherit;
                cursor: pointer;
                padding: 6px 8px;
                margin: 0 4px;
                font-family: inherit;
                font-size: inherit;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                transition: background-color 0.2s ease, border-color 0.2s ease;
                min-width: 38px; /* Ensure space for icon or text */
                min-height: 38px;
            }
            .${SCRIPT_PREFIX}menu-button:hover {
                background-color: rgba(0,0,0,0.07);
            }
            .${SCRIPT_PREFIX}menu-button svg {
                width: 20px;
                height: 20px;
                fill: currentColor;
            }

            .${SCRIPT_PREFIX}panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: var(--${SCRIPT_PREFIX}panel-bg);
                color: var(--${SCRIPT_PREFIX}panel-text);
                padding: 28px;
                border-radius: 12px;
                box-shadow: 0 12px 35px rgba(0,0,0,0.15), 0 0 0 1px var(--${SCRIPT_PREFIX}panel-border);
                z-index: 10001;
                width: 420px;
                max-width: 95vw;
                font-family: var(--${SCRIPT_PREFIX}panel-font-family);
                display: none;
            }
            .${SCRIPT_PREFIX}panel.visible {
                display: block;
            }
            .${SCRIPT_PREFIX}panel h3 {
                margin-top: 0;
                margin-bottom: 25px;
                font-size: 1.5em;
                font-weight: 600;
                color: var(--${SCRIPT_PREFIX}panel-text);
                text-align: center;
            }
            .${SCRIPT_PREFIX}panel .form-section {
                margin-bottom: 20px;
                padding-bottom: 20px;
                border-bottom: 1px solid var(--${SCRIPT_PREFIX}panel-border);
            }
            .${SCRIPT_PREFIX}panel .form-section:last-of-type {
                border-bottom: none;
                padding-bottom: 0;
            }
            .${SCRIPT_PREFIX}panel .form-group {
                margin-bottom: 15px;
            }
            .${SCRIPT_PREFIX}panel label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                font-size: 0.9em;
                color: var(--${SCRIPT_PREFIX}panel-text);
            }
            .${SCRIPT_PREFIX}panel select,
            .${SCRIPT_PREFIX}panel input[type="text"] {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid var(--${SCRIPT_PREFIX}input-border-color);
                border-radius: 6px;
                box-sizing: border-box;
                font-size: 1em;
                background-color: var(--${SCRIPT_PREFIX}panel-bg);
                color: var(--${SCRIPT_PREFIX}panel-text);
                transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            }
            .${SCRIPT_PREFIX}panel select:focus,
            .${SCRIPT_PREFIX}panel input[type="text"]:focus {
                border-color: var(--${SCRIPT_PREFIX}input-focus-border-color);
                outline: 0;
                box-shadow: var(--${SCRIPT_PREFIX}input-focus-box-shadow);
            }
            .${SCRIPT_PREFIX}panel .button-group {
                display: flex;
                justify-content: space-between;
                margin-top: 30px;
                gap: 12px;
            }
            .${SCRIPT_PREFIX}panel button {
                padding: 12px 18px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.95em;
                font-weight: 500;
                transition: background-color 0.2s ease, opacity 0.2s ease;
            }
            .${SCRIPT_PREFIX}panel .apply-button {
                background-color: var(--${SCRIPT_PREFIX}primary-color);
                color: white;
                flex-grow: 1;
            }
            .${SCRIPT_PREFIX}panel .apply-button:hover {
                background-color: var(--${SCRIPT_PREFIX}primary-hover-color);
            }
            .${SCRIPT_PREFIX}panel .reset-button {
                background-color: var(--${SCRIPT_PREFIX}secondary-color);
                color: white;
            }
            .${SCRIPT_PREFIX}panel .reset-button:hover {
                background-color: var(--${SCRIPT_PREFIX}secondary-hover-color);
            }
            .${SCRIPT_PREFIX}panel .close-button {
                position: absolute;
                top: 12px;
                right: 12px;
                background: none;
                border: none;
                font-size: 2em;
                cursor: pointer;
                color: #aaa;
                padding: 5px;
                line-height: 1;
            }
            .${SCRIPT_PREFIX}panel .close-button:hover {
                color: var(--${SCRIPT_PREFIX}panel-text);
            }
            .${SCRIPT_PREFIX}panel .settings-group {
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px solid var(--${SCRIPT_PREFIX}panel-border);
            }
            .${SCRIPT_PREFIX}panel .settings-group label {
                display: flex;
                align-items: center;
                font-weight: normal;
                font-size: 0.9em;
                cursor: pointer;
            }
            .${SCRIPT_PREFIX}panel .settings-group input[type="checkbox"] {
                margin-right: 10px;
                width: auto;
                height: 1em; /* Align better with text */
                accent-color: var(--${SCRIPT_PREFIX}primary-color);
            }
        `;
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            const styleElement = document.createElement('style');
            styleElement.textContent = css;
            document.head.appendChild(styleElement);
        }
    }

    function createMenuButton() {
        menuButton = document.createElement('button');
        // SVG Icon for "Aa" (Font selection)
        menuButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M9.93 13.5h4.14L12 7.98zM20 5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-4.05 11.5h-1.9l-1.95-4.5H7.5v4.5H5.55V7.5h5.2c2.03 0 3.25.77 3.25 2.55 0 1.06-.52 1.82-1.3 2.22l2.2 4.23z"></path></svg>`;
        // menuButton.textContent = 'Fonts'; // Alternative: Text button
        menuButton.className = `${SCRIPT_PREFIX}menu-button`;
        menuButton.title = `Change UI Font (${SHORTCUT_MODIFIERS.shiftKey ? 'Shift+' : ''}${SHORTCUT_MODIFIERS.altKey ? 'Alt+' : ''}${SHORTCUT_MODIFIERS.ctrlKey ? 'Ctrl+' : ''}${SHORTCUT_KEY})`;
        menuButton.addEventListener('click', handleMenuButtonClick);

        let inserted = false;
        try {
            // Try to find the target menu item to insert after its parent <li> or equivalent
            const targetMenuItem = Array.from(document.querySelectorAll('nav a, nav button, header a, header button'))
                                      .find(el => el.textContent.trim().toLowerCase() === TARGET_MENU_ITEM_TEXT.toLowerCase());

            if (targetMenuItem) {
                let parentToInsertAfter = targetMenuItem.closest('li') || targetMenuItem.parentElement;
                if (parentToInsertAfter && parentToInsertAfter.parentElement) {
                    menuButtonContainer = document.createElement(parentToInsertAfter.tagName); // e.g., <li>
                    menuButtonContainer.appendChild(menuButton);
                    parentToInsertAfter.insertAdjacentElement('afterend', menuButtonContainer);
                    inserted = true;
                }
            }

            // Fallback: Try a general menu container selector
            if (!inserted) {
                const menuContainer = document.querySelector(MENU_CONTAINER_SELECTOR);
                if (menuContainer) {
                    const wrapperTag = menuContainer.querySelector('li') ? 'li' : 'div'; // Use <li> if other items are <li>
                    menuButtonContainer = document.createElement(wrapperTag);
                    menuButtonContainer.appendChild(menuButton);
                    menuContainer.appendChild(menuButtonContainer);
                    inserted = true;
                }
            }
        } catch (error) {
            console.error(`${SCRIPT_NAME}: Error finding menu insertion point:`, error);
        }

        if (!inserted) {
            console.warn(`${SCRIPT_NAME}: Could not find a suitable place to insert the menu button. Appending to body as a fallback.`);
            menuButton.style.position = 'fixed';
            menuButton.style.top = '15px';
            menuButton.style.right = '120px';
            menuButton.style.zIndex = '10000';
            menuButton.style.backgroundColor = 'var(--${SCRIPT_PREFIX}panel-bg, #f0f0f0)';
            menuButton.style.border = '1px solid var(--${SCRIPT_PREFIX}panel-border, #ccc)';
            menuButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            document.body.appendChild(menuButton);
            menuButtonContainer = menuButton; // Button itself is the container in this fallback
        }
        updateMenuButtonVisibility();
    }

    function createFontPanel() {
        fontPanel = document.createElement('div');
        fontPanel.className = `${SCRIPT_PREFIX}panel`;
        fontPanel.innerHTML = `
            <button class="${SCRIPT_PREFIX}close-button" title="Close (Esc)">&times;</button>
            <h3>Customize Interface Font</h3>

            <div class="${SCRIPT_PREFIX}form-section">
                <div class="${SCRIPT_PREFIX}form-group">
                    <label for="${SCRIPT_PREFIX}google-font-select">Select Google Font:</label>
                    <select id="${SCRIPT_PREFIX}google-font-select">
                        <option value="">-- None (Use Default or Local) --</option>
                        ${GOOGLE_FONTS.map(font => `<option value="${font}">${font}</option>`).join('')}
                    </select>
                </div>
                <div class="${SCRIPT_PREFIX}form-group">
                    <label for="${SCRIPT_PREFIX}font-weight-select">Font Weight (for Google Font):</label>
                    <select id="${SCRIPT_PREFIX}font-weight-select">
                        ${Object.entries(FONT_WEIGHTS).map(([name, value]) => `<option value="${value}">${name} (${value})</option>`).join('')}
                    </select>
                </div>
            </div>

            <div class="${SCRIPT_PREFIX}form-section">
                <div class="${SCRIPT_PREFIX}form-group">
                    <label for="${SCRIPT_PREFIX}local-font-input">Or, Type Local Font Name:</label>
                    <input type="text" id="${SCRIPT_PREFIX}local-font-input" placeholder="e.g., Arial, Helvetica Neue">
                    <small style="font-size: 0.8em; color: #6c757d; display: block; margin-top: 4px;">Ensure the font is installed on your system. Weight selection above primarily affects Google Fonts.</small>
                </div>
            </div>

            <div class="${SCRIPT_PREFIX}button-group">
                <button class="${SCRIPT_PREFIX}apply-button" id="${SCRIPT_PREFIX}apply-font-button">Apply Font</button>
                <button class="${SCRIPT_PREFIX}reset-button" id="${SCRIPT_PREFIX}reset-font-button">Reset to TypingMind Default</button>
            </div>

            <div class="${SCRIPT_PREFIX}settings-group">
                <label>
                    <input type="checkbox" id="${SCRIPT_PREFIX}show-button-checkbox">
                    Show 'Fonts' button in menu
                </label>
            </div>
        `;
        document.body.appendChild(fontPanel);

        googleFontSelect = fontPanel.querySelector(`#${SCRIPT_PREFIX}google-font-select`);
        localFontInput = fontPanel.querySelector(`#${SCRIPT_PREFIX}local-font-input`);
        fontWeightSelect = fontPanel.querySelector(`#${SCRIPT_PREFIX}font-weight-select`);
        showButtonCheckbox = fontPanel.querySelector(`#${SCRIPT_PREFIX}show-button-checkbox`);

        fontPanel.querySelector(`.${SCRIPT_PREFIX}close-button`).addEventListener('click', () => toggleFontPanel(false));
        fontPanel.querySelector(`#${SCRIPT_PREFIX}apply-font-button`).addEventListener('click', handleApplyFont);
        fontPanel.querySelector(`#${SCRIPT_PREFIX}reset-font-button`).addEventListener('click', handleResetFont);
        showButtonCheckbox.addEventListener('change', handleShowButtonToggle);

        googleFontSelect.addEventListener('change', () => {
            if (googleFontSelect.value) {
                localFontInput.value = ''; // Clear local if Google font is chosen
                fontWeightSelect.disabled = false;
            } else {
                 fontWeightSelect.disabled = true;
            }
        });
        localFontInput.addEventListener('input', () => {
            if (localFontInput.value.trim()) {
                googleFontSelect.value = ''; // Clear Google if local font is typed
                fontWeightSelect.disabled = true; // Weight selector primarily for Google Fonts
            } else {
                fontWeightSelect.disabled = !googleFontSelect.value;
            }
        });


        showButtonCheckbox.checked = showMenuButtonSetting;
        fontWeightSelect.value = currentFontSetting.weight || FONT_WEIGHTS[DEFAULT_FONT_WEIGHT];
        fontWeightSelect.disabled = !currentFontSetting.isGoogle && !currentFontSetting.name; // Disable if no google font selected initially
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
                    fontWeightSelect.value = currentFontSetting.weight || FONT_WEIGHTS[DEFAULT_FONT_WEIGHT];
                    fontWeightSelect.disabled = false;
                } else if (currentFontSetting.custom) {
                    localFontInput.value = currentFontSetting.name;
                    googleFontSelect.value = '';
                    fontWeightSelect.value = FONT_WEIGHTS[DEFAULT_FONT_WEIGHT]; // Reset weight or keep last? For local, it's less direct.
                    fontWeightSelect.disabled = true;
                }
            } else {
                googleFontSelect.value = '';
                localFontInput.value = '';
                fontWeightSelect.value = FONT_WEIGHTS[DEFAULT_FONT_WEIGHT];
                fontWeightSelect.disabled = true;
            }
            // Set the panel's own font for immediate preview of Inter (or chosen default)
            fontPanel.style.fontFamily = `var(--${SCRIPT_PREFIX}panel-font-family)`;
        }
    }

    function loadGoogleFont(fontName, fontWeight) {
        if (activeGoogleFontLink) {
            activeGoogleFontLink.remove();
            activeGoogleFontLink = null;
        }
        if (!fontName) return;

        // Request specific weights: normal (400) and bold (700)
        // The fontWeight parameter is now for the CSS property, Google Font URL will include common weights.
        const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;700&display=swap`;
        const link = document.createElement('link');
        link.href = fontUrl;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        activeGoogleFontLink = link;
        console.log(`${SCRIPT_NAME}: Loading Google Font - ${fontName} with weights 400,700. Applying ${fontWeight}.`);
    }

    function applyFont(fontName, isGoogleFont = false, isCustom = false, fontWeight = FONT_WEIGHTS[DEFAULT_FONT_WEIGHT]) {
        const bodyStyle = document.body.style;

        if (!fontName) { // Resetting to website's default
            bodyStyle.fontFamily = '';
            bodyStyle.fontWeight = '';
            if (activeGoogleFontLink) {
                activeGoogleFontLink.remove();
                activeGoogleFontLink = null;
            }
            currentFontSetting = { name: '', isGoogle: false, custom: false, weight: FONT_WEIGHTS[DEFAULT_FONT_WEIGHT] };
            console.log(`${SCRIPT_NAME}: Font reset to TypingMind default.`);
        } else {
            if (isGoogleFont) {
                loadGoogleFont(fontName, fontWeight); // Load 400 & 700
            } else if (activeGoogleFontLink) { // Using local font, remove any active Google Font stylesheet
                activeGoogleFontLink.remove();
                activeGoogleFontLink = null;
            }
            // Apply the font. Use quotes for font names with spaces.
            bodyStyle.fontFamily = `"${fontName}", var(--${SCRIPT_PREFIX}panel-font-family, sans-serif)`; // Fallback to panel's base or sans-serif
            bodyStyle.fontWeight = fontWeight;
            currentFontSetting = { name: fontName, isGoogle: isGoogleFont, custom: isCustom, weight: fontWeight };
            console.log(`${SCRIPT_NAME}: Applied font: ${fontName}, Weight: ${fontWeight}. Google: ${isGoogleFont}, Custom: ${isCustom}`);
        }
        storage.setItem('currentFont', currentFontSetting);

        // Optionally, make the panel itself reflect the chosen font for demonstration
        // if (fontPanel && fontPanelVisible) {
        //     fontPanel.style.fontFamily = `"${fontName}", var(--${SCRIPT_PREFIX}panel-font-family, sans-serif)`;
        //     fontPanel.style.fontWeight = fontWeight;
        // }
    }

    function updateMenuButtonVisibility() {
        const displayValue = showMenuButtonSetting ? '' : 'none';
        if (menuButtonContainer) {
            menuButtonContainer.style.display = displayValue;
        } else if (menuButton) { // Fallback if container is the button itself (e.g., appended to body)
             menuButton.style.display = displayValue;
        }
    }

    // --- Event Handlers ---
    function handleMenuButtonClick() {
        toggleFontPanel();
    }

    function handleApplyFont() {
        const selectedGoogleFont = googleFontSelect.value;
        const enteredLocalFont = localFontInput.value.trim();
        const selectedWeight = fontWeightSelect.value;

        if (selectedGoogleFont) {
            applyFont(selectedGoogleFont, true, false, selectedWeight);
        } else if (enteredLocalFont) {
            // For local fonts, the weight dropdown is a suggestion.
            // The font itself must have the weight available.
            applyFont(enteredLocalFont, false, true, selectedWeight);
        } else {
            console.log(`${SCRIPT_NAME}: No font selected or entered to apply. Use reset button to clear font.`);
            // Optionally, provide user feedback here (e.g., a small message in the panel)
        }
    }

    function handleResetFont() {
        applyFont(null); // Pass null to reset
        googleFontSelect.value = '';
        localFontInput.value = '';
        fontWeightSelect.value = FONT_WEIGHTS[DEFAULT_FONT_WEIGHT];
        fontWeightSelect.disabled = true;
        if (fontPanel) { // Reset panel's own font if it was changed
             fontPanel.style.fontFamily = `var(--${SCRIPT_PREFIX}panel-font-family)`;
             fontPanel.style.fontWeight = ''; // Reset to its own default weight
        }
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
        // Add Esc key to close panel
        if (event.key === 'Escape' && fontPanelVisible) {
            event.preventDefault();
            toggleFontPanel(false);
        }
    }

    // --- Initialization ---
    function init() {
        injectStyles();
        createFontPanel();
        // Create button after panel, so panel elements are available for initial state
        // Delay button creation slightly to give TypingMind more time to load its UI
        // This can sometimes help with finding insertion points in dynamic UIs
        setTimeout(() => {
            createMenuButton();
            // Apply saved font on load only after button (and its potential container) exists
            if (currentFontSetting.name) {
                applyFont(currentFontSetting.name, currentFontSetting.isGoogle, currentFontSetting.custom, currentFontSetting.weight);
            }
            updateMenuButtonVisibility(); // Ensure visibility is correct based on saved setting
        }, 500);


        document.addEventListener('keydown', handleKeyboardShortcut);

        console.log(`${SCRIPT_NAME} initialized. Version ${GM_info?.script?.version || '1.5'}. Press Shift+Alt+F to toggle font panel.`);
    }

    // Wait for the DOM to be fully loaded before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init(); // DOMContentLoaded has already fired
    }

    // For extremely dynamic sites, a MutationObserver might be needed to reliably find the menu.
    // This script assumes the menu structure is present reasonably early.
    // If createMenuButton fails to insert, check the console for warnings/errors and adjust selectors.

})();
