// ==UserScript==
// @name         TypingMind Font Changer
// @namespace    http://your.namespace.here
// @version      1.1
// @description  Adds a button to TypingMind to change UI fonts, with show/hide option and keyboard shortcut.
// @author       Your Name
// @match        https://*.typingmind.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const GOOGLE_FONT_LINK_ID = 'custom-google-font-stylesheet-tm';
    const FONT_BUTTON_ID = 'typingmind-font-changer-button';
    const MODAL_ID = 'typingmind-font-changer-modal';

    // --- localStorage Keys ---
    const STORAGE_KEYS = {
        fontName: 'tmFontChanger_fontName',
        fontType: 'tmFontChanger_fontType', // 'google' or 'local'
        buttonVisible: 'tmFontChanger_buttonVisible' // 'true' or 'false'
    };

    // --- Initial State (loaded from localStorage) ---
    let currentFontName = '';
    let currentFontType = 'local'; // 'google' or 'local'
    let isMainButtonVisible = true;

    // --- Helper: Add Styles ---
    function addGlobalStyle(css) {
        const head = document.head || document.getElementsByTagName('head')[0];
        if (!head) return;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
    }

    // --- Helper: Apply Font ---
    function applyFont(fontName, fontType) {
        if (!fontName) return;

        // Remove existing Google Font stylesheet if any
        const existingGoogleFontLink = document.getElementById(GOOGLE_FONT_LINK_ID);
        if (existingGoogleFontLink) {
            existingGoogleFontLink.remove();
        }

        if (fontType === 'google') {
            const link = document.createElement('link');
            link.id = GOOGLE_FONT_LINK_ID;
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`;
            document.head.appendChild(link);
        }

        // Apply to body and root element.
        // Using !important to increase specificity, as TypingMind might have strong base styles.
        // Escape the font name if it contains spaces or special characters for CSS.
        const safeFontName = fontName.includes(' ') || fontName.includes('-') ? `"${fontName}"` : fontName;
        const fontStack = `${safeFontName}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;

        document.documentElement.style.setProperty('font-family', fontStack, 'important');
        document.body.style.setProperty('font-family', fontStack, 'important');


        // Persist changes
        currentFontName = fontName;
        currentFontType = fontType;
        localStorage.setItem(STORAGE_KEYS.fontName, fontName);
        localStorage.setItem(STORAGE_KEYS.fontType, fontType);
    }

    // --- Helper: Load Settings ---
    function loadSettings() {
        const savedFontName = localStorage.getItem(STORAGE_KEYS.fontName);
        const savedFontType = localStorage.getItem(STORAGE_KEYS.fontType);
        const savedButtonVisible = localStorage.getItem(STORAGE_KEYS.buttonVisible);

        if (savedFontName) {
            currentFontName = savedFontName;
            currentFontType = savedFontType || 'local';
            // Apply on load
            applyFont(currentFontName, currentFontType);
        }

        if (savedButtonVisible !== null) {
            isMainButtonVisible = savedButtonVisible === 'true';
        }
    }

    // --- UI: Create Modal ---
    function createModal() {
        if (document.getElementById(MODAL_ID)) return; // Modal already exists

        const modal = document.createElement('div');
        modal.id = MODAL_ID;
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #2d3748; /* Dark background */
            color: #e2e8f0; /* Light text */
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            z-index: 10001; /* High z-index */
            width: 90%;
            max-width: 450px;
            display: none; /* Hidden by default */
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        `;

        modal.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 20px; color: #cbd5e0;">Change UI Font</h3>
            <div style="margin-bottom: 15px;">
                <label for="fontNameInputTM" style="display: block; margin-bottom: 8px; font-size: 14px; color: #a0aec0;">Font Name (e.g., Roboto, 'Courier New', Arial):</label>
                <input type="text" id="fontNameInputTM" placeholder="Enter font name" style="width: calc(100% - 20px); padding: 10px; border-radius: 6px; border: 1px solid #4a5568; background-color: #1a202c; color: #e2e8f0; font-size: 14px;">
            </div>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #a0aec0;">Font Type:</label>
                <label style="margin-right: 15px; font-size: 14px; color: #cbd5e0; cursor:pointer;">
                    <input type="radio" name="fontTypeTM" value="local" ${currentFontType === 'local' ? 'checked' : ''} style="margin-right: 5px; vertical-align: middle;"> Local
                </label>
                <label style="font-size: 14px; color: #cbd5e0; cursor:pointer;">
                    <input type="radio" name="fontTypeTM" value="google" ${currentFontType === 'google' ? 'checked' : ''} style="margin-right: 5px; vertical-align: middle;"> Google Font
                </label>
            </div>
            <div style="margin-bottom: 20px;">
                <label style="font-size: 14px; color: #cbd5e0; display: flex; align-items: center; cursor:pointer;">
                    <input type="checkbox" id="showFontButtonToggleTM" ${isMainButtonVisible ? 'checked' : ''} style="margin-right: 8px; height: 16px; width: 16px; vertical-align: middle;"> Show 'Change Font' Button in Menu
                </label>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="cancelFontChangeTM" style="padding: 10px 18px; border: none; border-radius: 6px; background-color: #4a5568; color: #e2e8f0; cursor: pointer; font-size: 14px;">Cancel</button>
                <button id="applyFontChangeTM" style="padding: 10px 18px; border: none; border-radius: 6px; background-color: #4299e1; color: white; cursor: pointer; font-size: 14px;">Apply</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Event Listeners for modal elements
        document.getElementById('applyFontChangeTM').addEventListener('click', () => {
            const name = document.getElementById('fontNameInputTM').value.trim();
            const type = document.querySelector('input[name="fontTypeTM"]:checked').value;
            if (name) {
                applyFont(name, type);
            }
            toggleModal(false);
        });

        document.getElementById('cancelFontChangeTM').addEventListener('click', () => {
            toggleModal(false);
        });

        document.getElementById('showFontButtonToggleTM').addEventListener('change', (e) => {
            isMainButtonVisible = e.target.checked;
            localStorage.setItem(STORAGE_KEYS.buttonVisible, isMainButtonVisible.toString());
            const mainButton = document.getElementById(FONT_BUTTON_ID);
            if (mainButton) {
                mainButton.style.display = isMainButtonVisible ? '' : 'none';
            }
        });

        // Pre-fill input with current font if available
        const fontNameInput = document.getElementById('fontNameInputTM');
        if (currentFontName) {
            fontNameInput.value = currentFontName;
        }
    }

    function toggleModal(show) {
        const modal = document.getElementById(MODAL_ID);
        if (modal) {
            modal.style.display = show ? 'block' : 'none';
            if (show) {
                // Refresh font name input and radio buttons with current state
                document.getElementById('fontNameInputTM').value = currentFontName || '';
                const fontTypeRadios = document.getElementsByName('fontTypeTM');
                fontTypeRadios.forEach(radio => {
                    radio.checked = radio.value === currentFontType;
                });
                document.getElementById('showFontButtonToggleTM').checked = isMainButtonVisible;
            }
        }
    }

    // --- UI: Create Font Change Button ---
    function createFontButton() {
        if (document.getElementById(FONT_BUTTON_ID)) return null; // Button already exists

        const button = document.createElement('button');
        button.id = FONT_BUTTON_ID;
        button.textContent = '🎨 Change Font'; // Or use an icon
        // Basic styling - try to match TypingMind's sidebar button style
        button.style.cssText = `
            display: flex;
            align-items: center;
            width: 100%;
            padding: 8px 12px; /* Adjust as needed */
            margin: 4px 0; /* Adjust as needed */
            border: none;
            background-color: transparent;
            color: inherit; /* Inherit text color from sidebar */
            text-align: left;
            cursor: pointer;
            font-size: 0.875rem; /* 14px, common for sidebar items */
            border-radius: 6px;
        `;
        // Hover effect
        button.onmouseover = () => button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // Light hover
        button.onmouseout = () => button.style.backgroundColor = 'transparent';

        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent any parent handlers
            toggleModal(true);
        });

        if (!isMainButtonVisible) {
            button.style.display = 'none';
        }
        return button;
    }

    // --- Logic: Inject Button into UI ---
    // This is the most fragile part, as TypingMind's DOM structure can change.
    function injectButtonWhenReady() {
        const fontButton = createFontButton();
        if (!fontButton) return; // Could not create button (e.g., already exists)

        // Try to find the "Settings" button or a suitable parent.
        // This uses a heuristic approach.
        const observer = new MutationObserver((mutations, obs) => {
            // Look for "Settings" link/button. Common in sidebars.
            // TypingMind's "Settings" is often a link (<a>) or button within a nav structure.
            // Let's try to find a known settings icon or text.
            // Example: <a ...> <svg ... icon ...> Settings </a>
            // Or: <button ...> Settings </button>
            let settingsButton = null;
            const candidates = Array.from(document.querySelectorAll('a, button'));

            for (let el of candidates) {
                // Check text content (case-insensitive)
                if (el.textContent && el.textContent.trim().toLowerCase() === 'settings') {
                    // Further check if it's in a likely sidebar/menu area
                    let parent = el.parentElement;
                    let depth = 0;
                    while(parent && depth < 5) { // Check up to 5 levels for common sidebar classes/tags
                        if (parent.tagName === 'NAV' || parent.classList.contains('sidebar') || parent.classList.contains('menu') || (parent.getAttribute('role') && parent.getAttribute('role').includes('menu'))) {
                            settingsButton = el;
                            break;
                        }
                        parent = parent.parentElement;
                        depth++;
                    }
                    if (settingsButton) break;
                }
            }


            if (settingsButton && settingsButton.parentElement) {
                // Found the "Settings" button, insert our button before it.
                settingsButton.parentElement.insertBefore(fontButton, settingsButton);
                console.log('TypingMind Font Changer: Button injected.');
                obs.disconnect(); // Stop observing once the button is injected
            } else if (document.querySelector('nav ul') || document.querySelector('.left-sidebar nav')) {
                // Fallback: if a generic nav list is found, try appending there.
                // This is less precise.
                const navList = document.querySelector('nav ul') || document.querySelector('.left-sidebar nav');
                if (navList && !document.getElementById(FONT_BUTTON_ID)) { // Check again if button exists
                     // Try to find a list item to append to, or just append to the nav.
                    const lastMenuItem = navList.querySelector('li:last-child') || navList.lastElementChild;
                    if (lastMenuItem && lastMenuItem.parentElement === navList) {
                        const newListItem = document.createElement('li');
                        newListItem.appendChild(fontButton);
                        navList.insertBefore(newListItem, lastMenuItem);
                    } else {
                         navList.appendChild(fontButton); // Simpler append
                    }
                    console.log('TypingMind Font Changer: Button injected (fallback).');
                    obs.disconnect();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Timeout to stop observing if nothing found after a while, to prevent performance issues.
        setTimeout(() => {
            observer.disconnect();
            if (!document.getElementById(FONT_BUTTON_ID)) {
                console.warn('TypingMind Font Changer: Could not find a suitable place to inject the button.');
            }
        }, 15000); // Wait 15 seconds
    }


    // --- Keyboard Shortcut ---
    function setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.altKey && (e.key === 'F' || e.code === 'KeyF')) {
                e.preventDefault();
                e.stopPropagation();
                toggleModal(true);
            }
        });
    }

    // --- Main Initialization ---
    function init() {
        console.log('TypingMind Font Changer: Initializing...');
        loadSettings(); // Load preferences and apply initial font
        createModal(); // Create modal (hidden by default)
        
        // Wait for the DOM to be ready enough for button injection
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', injectButtonWhenReady);
        } else {
            injectButtonWhenReady(); // DOM is already ready
        }
        
        setupKeyboardShortcut();

        // Add some basic styles for better element visibility if needed
        addGlobalStyle(`
            /* Ensure body/html take up full height for font changes if they weren't */
            /* html, body { min-height: 100% !important; } */ /* This might be too aggressive */
            
            /* Style for the custom font button if it's directly appended and needs list item styling */
            #${FONT_BUTTON_ID} { transition: background-color 0.2s ease-in-out; }
        `);
    }

    // --- Run the script ---
    // Small delay to ensure TypingMind's own scripts have a chance to run first
    // This can sometimes help with targeting elements in dynamic applications.
    setTimeout(init, 500);

})();
