// ==UserScript==
// @name         TypingMind Sidebar Styler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to change TypingMind sidebar colors and darkness.
// @author       Your Name Here
// @match        *://*.typingmind.com/* // ** IMPORTANT: Adjust this if TypingMind uses a different URL **
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    // ** CONFIGURATION: YOU MUST EDIT THESE SELECTORS **
    // Use your browser's developer tools (Inspect Element) on TypingMind
    // to find the correct CSS selectors for these elements.
    // --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    const SIDEBAR_SELECTOR = '.your-sidebar-selector-here'; // e.g., '#sidebar', 'div[data-testid="sidebar"]'
    const SIDEBAR_TEXT_SELECTOR = '.your-sidebar-text-selector-here'; // e.g., '.sidebar-link-text', '.nav-item span'
    const SIDEBAR_ICON_SELECTOR = '.your-sidebar-icon-selector-here'; // e.g., '.sidebar-icon svg', '.nav-item i'
    const BUTTON_CONTAINER_SELECTOR = 'body'; // Where to add the button? 'body' is fallback. Find a better spot like a header/menu bar. e.g., '.main-header .actions'
    // --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

    // --- Predefined Themes ---
    const themes = [
        { name: 'Default Light', css: `` }, // Empty CSS to effectively reset to default (or define explicit light theme)
        { name: 'Dark', css: `
            ${SIDEBAR_SELECTOR} { background-color: #2d3748 !important; color: #e2e8f0 !important; border-right: 1px solid #4a5568 !important; }
            ${SIDEBAR_TEXT_SELECTOR} { color: #e2e8f0 !important; }
            ${SIDEBAR_ICON_SELECTOR} { color: #a0aec0 !important; }
            /* Add more specific rules if needed */
            ${SIDEBAR_SELECTOR} a:hover { background-color: #4a5568 !important; }
        `},
        { name: 'Midnight Blue', css: `
            ${SIDEBAR_SELECTOR} { background-color: #1a202c !important; color: #edf2f7 !important; border-right: 1px solid #2d3748 !important; }
            ${SIDEBAR_TEXT_SELECTOR} { color: #edf2f7 !important; }
            ${SIDEBAR_ICON_SELECTOR} { color: #718096 !important; }
            /* Add more specific rules if needed */
            ${SIDEBAR_SELECTOR} a:hover { background-color: #2d3748 !important; }
        `},
        { name: 'Slate', css: `
            ${SIDEBAR_SELECTOR} { background-color: #4a5568 !important; color: #f7fafc !important; border-right: 1px solid #718096 !important; }
            ${SIDEBAR_TEXT_SELECTOR} { color: #f7fafc !important; }
            ${SIDEBAR_ICON_SELECTOR} { color: #cbd5e0 !important; }
            /* Add more specific rules if needed */
            ${SIDEBAR_SELECTOR} a:hover { background-color: #718096 !important; }
        `}
        // Add more themes here if you like
    ];

    const STYLE_ID = 'custom-typingmind-sidebar-style';
    const STORAGE_KEY = 'typingmindSidebarThemeIndex';
    let currentThemeIndex = 0;

    // --- Function to Apply Theme ---
    function applyTheme(index) {
        // Remove existing custom style element if it exists
        const existingStyle = document.getElementById(STYLE_ID);
        if (existingStyle) {
            existingStyle.remove();
        }

        // Get the CSS for the selected theme
        const theme = themes[index];
        if (!theme || !theme.css) {
            console.log('TypingMind Styler: Resetting to default or invalid theme index.');
            GM_setValue(STORAGE_KEY, 0); // Save default index
            return; // Do nothing if it's the "Default" or invalid
        }

        // Apply the new styles using GM_addStyle or manual injection
        if (typeof GM_addStyle !== "undefined") {
            GM_addStyle(theme.css); // GM_addStyle is generally good but harder to remove/update specifically.
            // Let's stick to manual injection for easier removal by ID. Re-commenting GM_addStyle.
        }
        // else {
            const styleElement = document.createElement('style');
            styleElement.id = STYLE_ID;
            styleElement.textContent = theme.css;
            document.head.appendChild(styleElement);
        // }

        console.log(`TypingMind Styler: Applied theme "${theme.name}"`);
        GM_setValue(STORAGE_KEY, index); // Save the selected theme index
        currentThemeIndex = index;

        // Update button text if needed (optional)
        const button = document.getElementById('sidebar-styler-button');
        if (button) {
             button.textContent = `Sidebar: ${themes[currentThemeIndex].name}`;
        }
    }

    // --- Function to Cycle Themes ---
    function cycleTheme() {
        const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
        applyTheme(nextThemeIndex);
    }

    // --- Function to Create and Add Button ---
    function addButton() {
        const container = document.querySelector(BUTTON_CONTAINER_SELECTOR);
        if (!container) {
            // Fallback if the specific container isn't found
            console.warn(`TypingMind Styler: Button container "${BUTTON_CONTAINER_SELECTOR}" not found. Appending to body.`);
            // Re-check container logic if needed or use a more reliable insertion point
             // Check again after a delay might be needed for SPAs
             setTimeout(addButton, 1000); // Try again in 1 second
             return; // Stop this attempt
        }

         // Check if button already exists
        if (document.getElementById('sidebar-styler-button')) {
            return;
        }


        const button = document.createElement('button');
        button.id = 'sidebar-styler-button';
        button.textContent = `Sidebar: ${themes[currentThemeIndex].name}`; // Initial text
        button.onclick = cycleTheme;

        // Basic button styling (customize as needed)
        button.style.position = (BUTTON_CONTAINER_SELECTOR === 'body') ? 'fixed' : 'relative'; // Fixed if appended to body
        button.style.top = (BUTTON_CONTAINER_SELECTOR === 'body') ? '10px' : 'auto';
        button.style.right = (BUTTON_CONTAINER_SELECTOR === 'body') ? '10px' : 'auto';
        button.style.zIndex = '9999'; // Ensure it's visible
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.marginLeft = '10px'; // Add some spacing if inserting into an existing container


        container.appendChild(button);
        console.log('TypingMind Styler: Button added.');
    }

    // --- Initialization ---
    async function init() {
        // Load saved theme index, default to 0
        currentThemeIndex = await GM_getValue(STORAGE_KEY, 0);
        if (currentThemeIndex >= themes.length || currentThemeIndex < 0) {
            currentThemeIndex = 0; // Reset if saved index is invalid
        }

        // Apply the loaded theme immediately
        applyTheme(currentThemeIndex);

        // Add the button (wait for the container element to be ready)
        const checkInterval = setInterval(() => {
            const container = document.querySelector(BUTTON_CONTAINER_SELECTOR);
             const sidebar = document.querySelector(SIDEBAR_SELECTOR);
            // Wait for both sidebar and button container (or just body)
            if (sidebar && container) {
                clearInterval(checkInterval);
                addButton();
            } else if (sidebar && BUTTON_CONTAINER_SELECTOR === 'body') {
                 clearInterval(checkInterval);
                 addButton(); // Add to body if that's the target
            }
        }, 500); // Check every 500ms

         // Set a timeout to prevent infinite loops if elements never appear
        setTimeout(() => {
            clearInterval(checkInterval);
             if (!document.getElementById('sidebar-styler-button')) {
                console.error('TypingMind Styler: Could not find target elements to add button after timeout.');
             }
        }, 15000); // Stop trying after 15 seconds
    }

    // --- Run the script ---
    // Use window.onload or DOMContentLoaded if GM_addStyle or other GM functions might interfere early.
    // document.idle (via @run-at) or a simple timeout might be safer for SPAs.
    // setTimeout(init, 1000); // Delay initialization slightly
    init(); // Try running immediately after idle

})();
