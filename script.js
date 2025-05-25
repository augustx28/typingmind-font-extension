// ==UserScript==
// @name         TypingMind Font Changer Enhanced
// @namespace    http://your.namespace.here/
// @version      1.2
// @description  Customize UI fonts on TypingMind.com with Google Fonts, local fonts, and font weight.
// @author       Your Name (Enhanced by AI)
// @match        https://www.typingmind.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const SCRIPT_PREFIX = 'tmfc_'; // Prefix for CSS classes and localStorage keys
    const GOOGLE_FONTS = [ // Expanded list, will be sorted in dropdown
        "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Raleway",
        "Poppins", "Nunito", "Merriweather", "Inter", "Source Sans Pro",
        "PT Sans", "Ubuntu", "Noto Sans", "Fira Sans", "Work Sans",
        "Roboto Condensed", "Roboto Slab", "Playfair Display", "Cormorant Garamond",
        "Bebas Neue", "Titillium Web", "Josefin Sans", "Arimo", "Lexend", "EB Garamond",
        "DM Sans", "Manrope", "Space Grotesk", "Sora"
    ];
    const SHORTCUT_KEY = 'F';
    const SHORTCUT_MODIFIERS = { altKey: true, shiftKey: true, ctrlKey: false }; // Shift + Alt + F
    const DEFAULT_FONT_WEIGHT = '400'; // '400' for normal

    // --- DOM Element Selectors (ADJUST THESE IF TYPINGMIND'S STRUCTURE CHANGES) ---
    // Try these selectors in order to find an existing menu item to place the button next to.
    // Inspect TypingMind's HTML to find the best selectors.
    const TARGET_MENU_ITEM_SELECTORS = [
        'nav a[href*="/settings"]',          // Example: A link containing "/settings" in its href
        'nav button:has-text(/settings/i)',  // Example: A button with text "Settings" (case-insensitive)
        'nav li > button:has-text(/models/i)', // Example: A button with text "Models"
        'nav ul > li:nth-last-child(2)',      // Example: Second to last item in a navigation list
        'header nav ul > li:first-child'      // Example: First item in a header navigation list
    ];
    // Fallback selector for the general menu container if specific items aren't found.
    const MENU_CONTAINER_FALLBACK_SELECTOR = "nav ul, header nav > div > ul";

    // --- State & Storage Helper ---
    const storage = {
        getItem: (key, defaultValue) => {
            const val = (typeof GM_getValue === 'function') ? GM_getValue(SCRIPT_PREFIX + key) : localStorage.getItem(SCRIPT_PREFIX + key);
            if (val === undefined || val === null) { // Check for both undefined (GM) and null (localStorage)
                 return defaultValue;
            }
            try {
                return JSON.parse(val);
            } catch (e) {
                return val;
            }
        },
        setItem: (key, value) => {
            const valToStore = JSON.stringify(value);
            if (typeof GM_setValue === 'function') {
                GM_setValue(SCRIPT_PREFIX + key, valToStore);
            } else {
                localStorage.setItem(SCRIPT_PREFIX + key, valToStore);
            }
        }
    };

    let fontPanelVisible = false;
    let showMenuButtonSetting = storage.getItem('showMenuButton', true);
    let currentFontSetting = storage.getItem('currentFont', { name: '', isGoogle: false, custom: false, weight: DEFAULT_FONT_WEIGHT });

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
            .${SCRIPT_PREFIX}menu-button {
                background: none;
                border: 1px solid transparent;
                color: var(--text-color-secondary, inherit);
                cursor: pointer;
                padding: 6px 10px;
                margin: 0 4px;
                font-family: inherit;
                font-size: 0.875rem;
                display: flex;
                align-items: center;
                border-radius: 8px;
                transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
            }
            .${SCRIPT_PREFIX}menu-button:hover {
                background-color: var(--bg-hover-primary, rgba(0,0,0,0.08));
                border-color: var(--border-color-primary, rgba(0,0,0,0.1));
                color: var(--text-color-primary, inherit);
            }
            .${SCRIPT_PREFIX}menu-button svg {
                width: 1.1em; /* Slightly larger icon */
                height: 1.1em;
                margin-right: 6px;
                fill: currentColor;
            }
            .${SCRIPT_PREFIX}panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: var(--bg-primary, #ffffff);
                color: var(--text-color-primary, #333333);
                padding: 20px 25px 25px;
                border-radius: 12px;
                box-shadow: 0 12px 35px rgba(0,0,0,0.15), 0 0 0 1px var(--border-color-heavy, rgba(0,0,0,0.1));
                z-index: 10001;
                width: 420px; /* Slightly wider for better layout */
                max-width: 90vw;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                display: none;
            }
            .${SCRIPT_PREFIX}panel.visible {
                display: block;
            }
            .${SCRIPT_PREFIX}panel h3 {
                margin-top: 0;
                margin-bottom: 25px;
                font-size: 1.3em;
                font-weight: 600;
                color: var(--text-color-headings, #1a1a1a);
                text-align: center;
            }
            .${SCRIPT_PREFIX}panel .form-group {
                margin-bottom: 18px;
            }
            .${SCRIPT_PREFIX}panel label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                font-size: 0.9em;
                color: var(--text-color-secondary, #555555);
            }
            .${SCRIPT_PREFIX}panel select, .${SCRIPT_PREFIX}panel input[type="text"] {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid var(--border-color-input, #cccccc);
                border-radius: 6px;
                box-sizing: border-box;
                font-size: 0.95em;
                background-color: var(--bg-input, #fff);
                color: var(--text-color-input, #333);
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
            }
            .${SCRIPT_PREFIX}panel select:focus, .${SCRIPT_PREFIX}panel input[type="text"]:focus {
                border-color: var(--focus-ring-color, #007bff);
                box-shadow: 0 0 0 3px var(--focus-ring-color-alpha, rgba(0,123,255,0.25));
                outline: none;
            }
            .${SCRIPT_PREFIX}panel .button-group {
                display: flex;
                justify-content: space-between;
                margin-top: 30px;
                gap: 12px;
            }
            .${SCRIPT_PREFIX}panel button {
                padding: 10px 18px;
                border: 1px solid transparent;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.95em;
                font-weight: 500;
                transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
            }
            .${SCRIPT_PREFIX}panel .apply-button {
                background-color: var(--btn-primary-bg, #007bff);
                color: var(--btn-primary-text, white);
                flex-grow: 1;
            }
            .${SCRIPT_PREFIX}panel .apply-button:hover {
                background-color: var(--btn-primary-bg-hover, #0056b3);
            }
            .${SCRIPT_PREFIX}panel .reset-button {
                background-color: var(--btn-secondary-bg, #6c757d);
                color: var(--btn-secondary-text, white);
            }
            .${SCRIPT_PREFIX}panel .reset-button:hover {
                background-color: var(--btn-secondary-bg-hover, #545b62);
            }
            .${SCRIPT_PREFIX}panel .close-button {
                position: absolute;
                top: 12px;
                right: 12px;
                background: none;
                border: none;
                font-size: 1.6em;
                cursor: pointer;
                color: var(--text-color-muted, #aaa);
                padding: 5px;
                line-height: 1;
            }
            .${SCRIPT_PREFIX}panel .close-button:hover {
                color: var(--text-color-primary, #333);
            }
            .${SCRIPT_PREFIX}panel .settings-group {
                margin-top: 25px;
                padding-top: 15px;
                border-top: 1px solid var(--border-color-divider, #e0e0e0);
            }
            .${SCRIPT_PREFIX}panel .settings-group label {
                display: flex;
                align-items: center;
                font-weight: normal;
                font-size: 0.9em;
                color: var(--text-color-secondary, #666);
            }
            .${SCRIPT_PREFIX}panel .settings-group input[type="checkbox"] {
                margin-right: 8px;
                width: auto;
                height: auto;
                accent-color: var(--accent-color, #007bff); /* Modern checkbox color */
            }
        `;
        if (typeof GM_addStyle === 'function') {
            GM_addStyle(css);
        } else {
            const styleElement = document.createElement('style');
            styleElement.textContent = css;
            document.head.appendChild(styleElement);
        }
    }

    function createMenuButton() {
        menuButton = document.createElement('button');
        menuButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.984 17.016h4.031L12 9.422l-2.016 7.594zM21.984 21.984v-1.969h-19.97v1.969h19.97zM12.984 5.016q1.64 0 2.812 1.172t1.172 2.813q0 1.64-1.172 2.812t-2.812 1.172h-3.516V6.187q0-.938.657-1.594t1.594-.656V5.016zM12 2.016q-2.062 0-3.516 1.453T7.031 7.031V19.03h5.485q2.062 0 3.515-1.453t1.453-3.516-1.453-3.515-3.515-1.453H12V7.031q0-.797.586-1.383T14.016 5.062V3.516q0-1.453-1.031-2.484T10.5 0q-1.453 0-2.484 1.031T7.016 3.516V5.016h1.5V3.516q0-.609.422-1.031t1.031-.422h.047q.562 0 1 .422t.437 1.031v1.547H9.469l-2.437 9.187V19.97h10.922q1.219 0 2.062-.844t.844-2.062-.844-2.062-2.062-.844H12.98v-1.5h.047q.844 0 1.453-.609t.609-1.453-.609-1.453-1.453-.609h-2.016L12 7.031h.984z"/>
            </svg>Font`;
        menuButton.className = `${SCRIPT_PREFIX}menu-button`;
        menuButton.title = `Customize UI Font (Shift+Alt+${SHORTCUT_KEY})`;
        menuButton.addEventListener('click', handleMenuButtonClick);

        let inserted = false;
        for (const selector of TARGET_MENU_ITEM_SELECTORS) {
            try {
                const targetMenuItem = document.querySelector(selector);
                if (targetMenuItem) {
                    let parentContainer = targetMenuItem.closest('li') || targetMenuItem.parentElement;
                    if (parentContainer && parentContainer.parentElement) {
                        menuButtonContainer = document.createElement(parentContainer.tagName === 'LI' ? 'li' : 'div');
                        menuButtonContainer.appendChild(menuButton);
                        // Insert after the parent of the target, or as the next sibling of the target if no better parent
                        parentContainer.insertAdjacentElement('afterend', menuButtonContainer);
                        inserted = true;
                        console.log(`${SCRIPT_PREFIX}Button inserted after element matching: ${selector}`);
                        break;
                    }
                }
            } catch (e) {
                console.warn(`${SCRIPT_PREFIX}Error trying selector "${selector}":`, e);
            }
        }

        if (!inserted) {
            const menuContainerEl = document.querySelector(MENU_CONTAINER_FALLBACK_SELECTOR);
            if (menuContainerEl) {
                const wrapperTag = menuContainerEl.querySelector('li') ? 'li' : 'div';
                menuButtonContainer = document.createElement(wrapperTag);
                menuButtonContainer.appendChild(menuButton);
                menuContainerEl.appendChild(menuButtonContainer);
                inserted = true;
                console.log(`${SCRIPT_PREFIX}Button inserted into fallback container: ${MENU_CONTAINER_FALLBACK_SELECTOR}`);
            }
        }

        if (!inserted) {
            console.warn(`${SCRIPT_PREFIX}Could not find a suitable menu location. Appending button to body as a fallback.`);
            menuButton.style.position = 'fixed';
            menuButton.style.top = '15px';
            menuButton.style.right = '120px';
            menuButton.style.zIndex = '9999';
            menuButton.style.backgroundColor = 'var(--bg-secondary, #f0f0f0)';
            menuButton.style.border = '1px solid var(--border-color-primary, #ccc)';
            menuButton.style.padding = '8px 12px';
            document.body.appendChild(menuButton);
            menuButtonContainer = menuButton; // The button itself is the container
        }
        updateMenuButtonVisibility();
    }

    function createFontPanel() {
        fontPanel = document.createElement('div');
        fontPanel.className = `${SCRIPT_PREFIX}panel`;
        fontPanel.innerHTML = `
            <button class="${SCRIPT_PREFIX}close-button" title="Close (Esc)">&times;</button>
            <h3>Customize Font</h3>

            <div class="${SCRIPT_PREFIX}form-group">
                <label for="${SCRIPT_PREFIX}google-font-select">Google Font:</label>
                <select id="${SCRIPT_PREFIX}google-font-select">
                    <option value="">-- Select Google Font --</option>
                    ${GOOGLE_FONTS.sort().map(font => `<option value="${font}">${font}</option>`).join('')}
                </select>
            </div>

            <div class="${SCRIPT_PREFIX}form-group">
                <label for="${SCRIPT_PREFIX}local-font-input">Local Font (Type exact name):</label>
                <input type="text" id="${SCRIPT_PREFIX}local-font-input" placeholder="e.g., Arial, Cascadia Code">
            </div>

            <div class="${SCRIPT_PREFIX}form-group">
                <label for="${SCRIPT_PREFIX}font-weight-select">Font Weight:</label>
                <select id="${SCRIPT_PREFIX}font-weight-select">
                    <option value="300">Light (300)</option>
                    <option value="400">Normal (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semi-Bold (600)</option>
                    <option value="700">Bold (700)</option>
                </select>
            </div>

            <div class="${SCRIPT_PREFIX}button-group">
                <button class="${SCRIPT_PREFIX}apply-button" id="${SCRIPT_PREFIX}apply-font-button">Apply</button>
                <button class="${SCRIPT_PREFIX}reset-button" id="${SCRIPT_PREFIX}reset-font-button">Reset</button>
            </div>

            <div class="${SCRIPT_PREFIX}settings-group">
                <label>
                    <input type="checkbox" id="${SCRIPT_PREFIX}show-button-checkbox">
                    Show 'Font' button in menu
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

        googleFontSelect.addEventListener('change', () => { if(googleFontSelect.value) localFontInput.value = ''; });
        localFontInput.addEventListener('input', () => { if(localFontInput.value) googleFontSelect.value = ''; });

        showButtonCheckbox.checked = showMenuButtonSetting;
        fontWeightSelect.value = currentFontSetting.weight || DEFAULT_FONT_WEIGHT;
    }

    function toggleFontPanel(forceShow) {
        fontPanelVisible = (forceShow !== undefined) ? forceShow : !fontPanelVisible;
        fontPanel.classList.toggle('visible', fontPanelVisible);
        if (fontPanelVisible) {
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
            fontWeightSelect.value = currentFontSetting.weight || DEFAULT_FONT_WEIGHT;
            // Focus logic: prioritize Google Font, then Local, then Weight
            if (googleFontSelect.value) googleFontSelect.focus();
            else if (localFontInput.value) localFontInput.focus();
            else googleFontSelect.focus();

        }
    }

    function loadGoogleFont(fontName) {
        if (activeGoogleFontLink) {
            activeGoogleFontLink.remove();
            activeGoogleFontLink = null;
        }
        if (!fontName) return;

        const weightsToLoad = "300;400;500;600;700"; // Semicolon separated for URL
        const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@${weightsToLoad}&display=swap`;
        const link = document.createElement('link');
        link.href = fontUrl;
        link.rel = 'stylesheet';
        link.onerror = () => {
            console.error(`${SCRIPT_PREFIX}Error loading Google Font: ${fontName}. The font may not be available or network issue.`);
            // Optionally, alert the user or revert to a fallback font
            // alert(`Failed to load Google Font: ${fontName}`);
        };
        document.head.appendChild(link);
        activeGoogleFontLink = link;
    }

    function applyFont(fontName, isGoogleFont = false, isCustom = false, fontWeight = DEFAULT_FONT_WEIGHT) {
        const targetElement = document.body; // Apply to body, TypingMind CSS can override for specific elements

        if (!fontName) { // Resetting
            targetElement.style.fontFamily = '';
            targetElement.style.fontWeight = '';
            if (activeGoogleFontLink) {
                activeGoogleFontLink.remove();
                activeGoogleFontLink = null;
            }
            currentFontSetting = { name: '', isGoogle: false, custom: false, weight: DEFAULT_FONT_WEIGHT };
        } else {
            if (isGoogleFont) {
                loadGoogleFont(fontName); // Load all relevant weights for the family
            } else if (activeGoogleFontLink) { // Using local font, remove any active Google Font stylesheet
                activeGoogleFontLink.remove();
                activeGoogleFontLink = null;
            }
            // Generic fallback stack, user's font is prioritized
            const fontFamilyStack = `"${fontName}", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
            targetElement.style.fontFamily = fontFamilyStack;
            targetElement.style.fontWeight = fontWeight; // Set the base weight for the body
            currentFontSetting = { name: fontName, isGoogle: isGoogleFont, custom: isCustom, weight: fontWeight };
        }
        storage.setItem('currentFont', currentFontSetting);
    }


    function updateMenuButtonVisibility() {
        const displayValue = showMenuButtonSetting ? '' : 'none'; // Default is to show based on tag type
        if (menuButtonContainer) {
            if (menuButtonContainer === menuButton) { // Fallback scenario where button is its own container
                 menuButton.style.display = displayValue;
            } else { // Standard scenario where button is in a li or div container
                 menuButtonContainer.style.display = displayValue;
                 // Ensure the button itself is also visible if its container is
                 if(menuButton) menuButton.style.display = '';
            }
        } else if (menuButton) { // If only button exists but not container (should not happen with current logic)
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
            applyFont(enteredLocalFont, false, true, selectedWeight);
        } else {
            // If both are empty, but a font is already active, just apply the new weight
            if (currentFontSetting.name) {
                 applyFont(currentFontSetting.name, currentFontSetting.isGoogle, currentFontSetting.custom, selectedWeight);
            } else {
                console.log(`${SCRIPT_PREFIX}No font selected or entered. Please select a font to apply.`);
                // You could add a small notification here if desired
            }
        }
        // Optionally close panel after apply: toggleFontPanel(false);
    }

    function handleResetFont() {
        applyFont(null); // Pass null to reset
        googleFontSelect.value = '';
        localFontInput.value = '';
        fontWeightSelect.value = DEFAULT_FONT_WEIGHT;
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
        if (event.key === 'Escape' && fontPanelVisible) {
            event.preventDefault();
            toggleFontPanel(false);
        }
    }

    // --- Initialization ---
    function init() {
        injectStyles();
        createFontPanel(); // Create panel first so button can interact if needed on creation
        createMenuButton(); // Then create button

        if (currentFontSetting.name) {
            applyFont(currentFontSetting.name, currentFontSetting.isGoogle, currentFontSetting.custom, currentFontSetting.weight);
        }

        document.addEventListener('keydown', handleKeyboardShortcut);
        console.log(`${SCRIPT_PREFIX}Font Changer Enhanced initialized (v1.2). Press Shift+Alt+${SHORTCUT_KEY} to toggle panel.`);
    }

    // Wait for the DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init(); // DOMContentLoaded has already fired
    }

})();
