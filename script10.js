// ==UserScript==
// @name         TypingMind Font Customizer
// @namespace    https://your-namespace.example.com
// @version      1.0
// @description  Customize fonts on TypingMind with Google Fonts or local fonts.
// @author       Your Name
// @match        https://www.typingmind.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    // IMPORTANT: You MUST update this selector to target an element in TypingMind's sidebar
    // where the font changer button will be appended.
    // Example: If there's a div with id="sidebar-menu", you might use '#sidebar-menu'
    // Or if there's a list of items, you might target a specific 'div' or 'ul'.
    // Use your browser's developer tools (right-click -> Inspect) to find a suitable selector.
    const SIDEBAR_HOOK_SELECTOR = 'nav > div > div > div:nth-child(2)'; // Placeholder - UPDATE THIS!
    const FONT_PANEL_ID = 'tm-font-customizer-panel';
    const FONT_BUTTON_ID = 'tm-font-customizer-button';
    const GOOGLE_FONT_LINK_ID = 'tm-google-font-link';

    const STORAGE_KEYS = {
        currentFontType: 'tmFontCustomizer_fontType', // 'google', 'local', 'default'
        currentFontName: 'tmFontCustomizer_fontName',
        buttonVisible: 'tmFontCustomizer_buttonVisible' // 'true' or 'false'
    };

    // --- DOM Elements (will be initialized later) ---
    let fontPanel = null;
    let fontButton = null;
    let googleFontNameInput = null;
    let localFontNameInput = null;
    let showButtonCheckbox = null;

    // --- Helper Functions ---

    function getPref(key, defaultValue) {
        const value = localStorage.getItem(key);
        return value === null ? defaultValue : value;
    }

    function setPref(key, value) {
        localStorage.setItem(key, value);
    }

    function applyFont(fontType, fontName) {
        // Remove existing Google Font link if any
        const existingGoogleFontLink = document.getElementById(GOOGLE_FONT_LINK_ID);
        if (existingGoogleFontLink) {
            existingGoogleFontLink.remove();
        }

        if (fontType === 'google' && fontName) {
            const link = document.createElement('link');
            link.id = GOOGLE_FONT_LINK_ID;
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName.replace(/ /g, '+'))}:wght@300;400;500;600;700&display=swap`;
            document.head.appendChild(link);
            document.body.style.fontFamily = `"${fontName}", sans-serif`;
            setPref(STORAGE_KEYS.currentFontType, 'google');
            setPref(STORAGE_KEYS.currentFontName, fontName);
            console.log(`Applied Google Font: ${fontName}`);
        } else if (fontType === 'local' && fontName) {
            document.body.style.fontFamily = `"${fontName}", sans-serif`; // Add fallbacks as needed
            setPref(STORAGE_KEYS.currentFontType, 'local');
            setPref(STORAGE_KEYS.currentFontName, fontName);
            console.log(`Applied local font: ${fontName}`);
        } else { // Reset to default
            document.body.style.fontFamily = ''; // Let TypingMind's CSS take over
            setPref(STORAGE_KEYS.currentFontType, 'default');
            setPref(STORAGE_KEYS.currentFontName, '');
            console.log('Reset to default font');
        }
    }

    function loadSavedFont() {
        const fontType = getPref(STORAGE_KEYS.currentFontType, 'default');
        const fontName = getPref(STORAGE_KEYS.currentFontName, '');
        if (fontType !== 'default' && fontName) {
            applyFont(fontType, fontName);
        }
    }

    // --- UI Creation ---

    function createFontButton() {
        if (document.getElementById(FONT_BUTTON_ID)) return; // Already exists

        fontButton = document.createElement('button');
        fontButton.id = FONT_BUTTON_ID;
        fontButton.textContent = 'Change Font (F)';
        fontButton.style.cssText = `
            display: ${getPref(STORAGE_KEYS.buttonVisible, 'true') === 'true' ? 'block' : 'none'};
            width: 90%;
            padding: 8px;
            margin: 10px auto;
            background-color: #4A5568; /* Tailwind gray-700 */
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            text-align: center;
            font-size: 14px;
        `;
        fontButton.onclick = () => toggleFontPanel(true);

        const sidebarHook = document.querySelector(SIDEBAR_HOOK_SELECTOR);
        if (sidebarHook) {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.borderTop = "1px solid #718096"; // Tailwind gray-500
            buttonContainer.style.paddingTop = "10px";
            buttonContainer.appendChild(fontButton);
            sidebarHook.appendChild(buttonContainer);
        } else {
            console.warn(`TypingMind Font Customizer: Sidebar hook "${SIDEBAR_HOOK_SELECTOR}" not found. Button not added.`);
            // Fallback: append to body if sidebar not found, though less ideal
            // document.body.appendChild(fontButton);
            // fontButton.style.position = 'fixed';
            // fontButton.style.bottom = '20px';
            // fontButton.style.right = '20px';
            // fontButton.style.zIndex = '9999';
        }
    }

    function createFontPanel() {
        if (document.getElementById(FONT_PANEL_ID)) return; // Already exists

        fontPanel = document.createElement('div');
        fontPanel.id = FONT_PANEL_ID;
        fontPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #2D3748; /* Tailwind gray-800 */
            color: #E2E8F0; /* Tailwind gray-300 */
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            z-index: 10000;
            width: 380px;
            max-width: 90%;
            display: none; /* Initially hidden */
            font-family: sans-serif; /* Panel uses a generic font */
        `;

        fontPanel.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 20px; color: #A0AEC0; /* Tailwind gray-500 */ text-align: center; font-size: 18px; font-weight: 500;">Font Customizer</h3>

            <div style="margin-bottom: 20px;">
                <label for="tm-google-font" style="display: block; margin-bottom: 8px; font-size: 14px; color: #CBD5E0; /* Tailwind gray-400 */">Google Font Name:</label>
                <input type="text" id="tm-google-font" placeholder="e.g., Roboto, Open Sans" style="width: calc(100% - 22px); padding: 10px; border-radius: 4px; border: 1px solid #4A5568; background-color: #1A202C; /* Tailwind gray-900 */ color: #E2E8F0; margin-bottom: 10px;">
                <button id="tm-apply-google" style="padding: 10px 15px; background-color: #3182CE; /* Tailwind blue-600 */ color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">Apply Google Font</button>
            </div>

            <div style="margin-bottom: 20px;">
                <label for="tm-local-font" style="display: block; margin-bottom: 8px; font-size: 14px; color: #CBD5E0;">Local Font Name:</label>
                <input type="text" id="tm-local-font" placeholder="e.g., Arial, Verdana" style="width: calc(100% - 22px); padding: 10px; border-radius: 4px; border: 1px solid #4A5568; background-color: #1A202C; color: #E2E8F0; margin-bottom: 10px;">
                <button id="tm-apply-local" style="padding: 10px 15px; background-color: #3182CE; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">Apply Local Font</button>
            </div>

            <div style="margin-bottom: 20px; text-align: center;">
                <button id="tm-reset-font" style="padding: 10px 15px; background-color: #718096; /* Tailwind gray-600 */ color: white; border: none; border-radius: 4px; cursor: pointer; width: calc(50% - 5px); margin-right: 5px;">Reset to Default</button>
                <button id="tm-close-panel" style="padding: 10px 15px; background-color: #E53E3E; /* Tailwind red-600 */ color: white; border: none; border-radius: 4px; cursor: pointer; width: calc(50% - 5px);">Close Panel</button>
            </div>

            <div style="border-top: 1px solid #4A5568; padding-top: 15px; margin-top:15px;">
                <label style="display: flex; align-items: center; font-size: 14px; color: #CBD5E0; cursor: pointer;">
                    <input type="checkbox" id="tm-show-button-checkbox" style="margin-right: 8px; accent-color: #3182CE;">
                    Show Font Button in Sidebar
                </label>
            </div>
        `;

        document.body.appendChild(fontPanel);

        // Get references to panel elements
        googleFontNameInput = document.getElementById('tm-google-font');
        localFontNameInput = document.getElementById('tm-local-font');
        showButtonCheckbox = document.getElementById('tm-show-button-checkbox');

        // Set initial state of checkbox
        showButtonCheckbox.checked = getPref(STORAGE_KEYS.buttonVisible, 'true') === 'true';

        // Add event listeners for panel buttons
        document.getElementById('tm-apply-google').onclick = () => {
            applyFont('google', googleFontNameInput.value.trim());
        };
        document.getElementById('tm-apply-local').onclick = () => {
            applyFont('local', localFontNameInput.value.trim());
        };
        document.getElementById('tm-reset-font').onclick = () => {
            applyFont('default', '');
            if (googleFontNameInput) googleFontNameInput.value = '';
            if (localFontNameInput) localFontNameInput.value = '';
        };
        document.getElementById('tm-close-panel').onclick = () => toggleFontPanel(false);
        showButtonCheckbox.onchange = (e) => {
            const isVisible = e.target.checked;
            setPref(STORAGE_KEYS.buttonVisible, isVisible.toString());
            if (fontButton) {
                fontButton.style.display = isVisible ? 'block' : 'none';
            }
        };
    }

    function toggleFontPanel(show) {
        if (!fontPanel) createFontPanel(); // Create if it doesn't exist

        if (fontPanel) {
            fontPanel.style.display = show ? 'block' : 'none';
            if (show) {
                // Populate inputs with current font if panel is opened
                const currentType = getPref(STORAGE_KEYS.currentFontType, 'default');
                const currentName = getPref(STORAGE_KEYS.currentFontName, '');
                if (currentType === 'google' && googleFontNameInput) {
                    googleFontNameInput.value = currentName;
                    if(localFontNameInput) localFontNameInput.value = '';
                } else if (currentType === 'local' && localFontNameInput) {
                    localFontNameInput.value = currentName;
                    if(googleFontNameInput) googleFontNameInput.value = '';
                } else {
                     if(googleFontNameInput) googleFontNameInput.value = '';
                     if(localFontNameInput) localFontNameInput.value = '';
                }
            }
        }
    }

    // --- Event Handlers ---
    function handleKeydown(event) {
        // Shift + Alt + F
        if (event.shiftKey && event.altKey && event.key === 'F') {
            event.preventDefault();
            event.stopPropagation();
            toggleFontPanel(fontPanel ? fontPanel.style.display === 'none' : true);
        }
        // Escape key to close panel
        if (event.key === 'Escape' && fontPanel && fontPanel.style.display !== 'none') {
             toggleFontPanel(false);
        }
    }

    // --- Initialization ---
    function init() {
        console.log('TypingMind Font Customizer initializing...');

        // Create UI elements
        createFontButton(); // Creates the button in the sidebar
        createFontPanel();  // Creates the panel (initially hidden)

        // Load and apply saved font preference
        loadSavedFont();

        // Add global event listeners
        document.addEventListener('keydown', handleKeydown, true); // Use capture to potentially override site listeners

        console.log('TypingMind Font Customizer initialized.');
    }

    // --- Start the script ---
    // Wait for the full page to load, or at least interactive state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOMContentLoaded has already fired
        // Use a small timeout to ensure the target site's JS has had a chance to set up the DOM
        setTimeout(init, 500);
    }

})();
