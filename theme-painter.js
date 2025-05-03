// ==UserScript==
// @name         TypingMind UI Color Customizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a menu to customize TypingMind UI colors.
// @match        https://*.typingmind.com/* // Adjust this if your TypingMind URL is different
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration: Define UI elements and their default colors ---
    // **IMPORTANT**: You MUST inspect TypingMind's elements and update the 'selector' values below.
    //                The current selectors are placeholders/guesses.
    const colorSettings = [
        { id: 'mainBg', label: 'Main Background', selector: 'body, .main-content', property: 'background-color', default: '#FFFFFF' },
        { id: 'sidebarBg', label: 'Sidebar Background', selector: '.sidebar-class', property: 'background-color', default: '#F0F0F0' },
        { id: 'textColor', label: 'Primary Text', selector: 'body, p, div', property: 'color', default: '#333333' },
        { id: 'accentColor', label: 'Accent / Links', selector: 'a, .accent-text', property: 'color', default: '#007BFF' },
        { id: 'buttonBg', label: 'Button Background', selector: 'button, .btn-primary', property: 'background-color', default: '#007BFF' },
        { id: 'buttonText', label: 'Button Text', selector: 'button, .btn-primary', property: 'color', default: '#FFFFFF' },
        { id: 'userBubbleBg', label: 'User Bubble BG', selector: '.user-message-bubble', property: 'background-color', default: '#E1F5FE' },
        { id: 'userBubbleText', label: 'User Bubble Text', selector: '.user-message-bubble', property: 'color', default: '#01579B' },
        { id: 'aiBubbleBg', label: 'AI Bubble BG', selector: '.ai-message-bubble', property: 'background-color', default: '#FCE4EC' },
        { id: 'aiBubbleText', label: 'AI Bubble Text', selector: '.ai-message-bubble', property: 'color', default: '#880E4F' },
        { id: 'headerBg', label: 'Header Background', selector: '.header-class', property: 'background-color', default: '#EEEEEE' },
        // Add more elements here as needed...
        // { id: 'someOtherElement', label: 'Describe It', selector: '.actual-selector', property: 'css-property', default: '#HEXCOLOR' },
    ];

    // --- Storage Keys ---
    const STORAGE_KEY = 'typingMindColorSettings_v1';
    const PANEL_VISIBLE_KEY = 'typingMindColorPanelVisible_v1';

    // --- Global Variables ---
    let currentColors = {};
    let styleElement = null;
    let panel = null;

    // --- Functions ---

    // Load colors from storage or use defaults
    function loadColors() {
        const savedColors = GM_getValue(STORAGE_KEY, {});
        colorSettings.forEach(setting => {
            currentColors[setting.id] = savedColors[setting.id] || setting.default;
        });
    }

    // Save colors to storage
    function saveColors() {
        GM_setValue(STORAGE_KEY, currentColors);
    }

    // Apply the current colors by generating and injecting CSS
    function applyStyles() {
        let cssString = ':root {\n'; // Use CSS variables for easier management

        // Define CSS variables
        colorSettings.forEach(setting => {
            cssString += `    --tm-color-${setting.id}: ${currentColors[setting.id]};\n`;
        });
        cssString += '}\n\n';

        // Apply variables to selectors
        colorSettings.forEach(setting => {
            if (setting.selector) {
                 // Handle multiple selectors separated by comma
                const selectors = setting.selector.split(',').map(s => s.trim()).filter(s => s);
                if (selectors.length > 0) {
                    cssString += `${selectors.join(',\n')} {\n`;
                    cssString += `    ${setting.property}: var(--tm-color-${setting.id}) !important;\n`; // Use !important to override existing styles
                    cssString += '}\n\n';
                }
            }
        });

        // Add some extra potential overrides if needed
         cssString += `
             /* Example Hover Effect for Buttons */
             button:hover, .btn-primary:hover {
                 filter: brightness(1.1); /* Slightly brighten */
             }

             /* Example for specific message parts if needed */
             .user-message-bubble p { /* Target text specifically inside user bubble */
                 color: var(--tm-color-userBubbleText) !important;
             }
             .ai-message-bubble p { /* Target text specifically inside AI bubble */
                color: var(--tm-color-aiBubbleText) !important;
             }
         `;


        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'typingmind-custom-colors';
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = cssString;
    }

    // Update a specific color, save, and re-apply styles
    function updateColor(id, value) {
        currentColors[id] = value;
        saveColors();
        applyStyles();
    }

    // Create the control panel
    function createControlPanel() {
        panel = document.createElement('div');
        panel.id = 'tm-color-panel';
        panel.style.position = 'fixed';
        panel.style.top = '80px';
        panel.style.right = '20px';
        panel.style.width = '280px';
        panel.style.maxHeight = 'calc(100vh - 120px)'; // Avoid overlapping header/footer
        panel.style.overflowY = 'auto';
        panel.style.backgroundColor = 'white';
        panel.style.border = '1px solid #ccc';
        panel.style.borderRadius = '8px';
        panel.style.padding = '15px';
        panel.style.zIndex = '9999'; // Ensure it's on top
        panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        panel.style.display = GM_getValue(PANEL_VISIBLE_KEY, false) ? 'block' : 'none'; // Load visibility state
        panel.style.fontFamily = 'sans-serif';
        panel.style.fontSize = '14px';


        // Title and Close Button
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '15px';
        header.style.borderBottom = '1px solid #eee';
        header.style.paddingBottom = '10px';


        const title = document.createElement('h3');
        title.textContent = 'Color Customizer';
        title.style.margin = '0';
        title.style.color = '#333';


        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.border = 'none';
        closeButton.style.background = 'transparent';
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '5px';
        closeButton.onclick = togglePanel;


        header.appendChild(title);
        header.appendChild(closeButton);
        panel.appendChild(header);


        // Add color pickers
        colorSettings.forEach(setting => {
            const controlDiv = document.createElement('div');
            controlDiv.style.marginBottom = '12px';
            controlDiv.style.display = 'flex';
            controlDiv.style.justifyContent = 'space-between';
            controlDiv.style.alignItems = 'center';


            const label = document.createElement('label');
            label.textContent = setting.label + ':';
            label.style.marginRight = '10px';
            label.style.color = '#555';


            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.id = `tm-color-${setting.id}`;
            colorInput.value = currentColors[setting.id];
            colorInput.style.border = '1px solid #ccc';
            colorInput.style.padding = '2px';
            colorInput.style.cursor = 'pointer';
            colorInput.style.width = '50px'; // Adjust width as needed


            // Update styles immediately on input change
            colorInput.addEventListener('input', (event) => {
                updateColor(setting.id, event.target.value);
            });


            controlDiv.appendChild(label);
            controlDiv.appendChild(colorInput);
            panel.appendChild(controlDiv);
        });

        // Reset Button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset to Defaults';
        resetButton.style.marginTop = '15px';
        resetButton.style.padding = '8px 12px';
        resetButton.style.border = '1px solid #ccc';
        resetButton.style.borderRadius = '4px';
        resetButton.style.cursor = 'pointer';
        resetButton.style.backgroundColor = '#f8f8f8';
        resetButton.onclick = () => {
            if (confirm('Are you sure you want to reset all colors to defaults?')) {
                colorSettings.forEach(setting => {
                    currentColors[setting.id] = setting.default;
                    const input = document.getElementById(`tm-color-${setting.id}`);
                    if (input) input.value = setting.default;
                });
                saveColors();
                applyStyles();
            }
        };
        panel.appendChild(resetButton);


        document.body.appendChild(panel);
    }

    // Create the button to toggle the panel
    function createPanelToggleButton() {
        const button = document.createElement('button');
        button.textContent = '🎨'; // Emoji for color palette
        button.id = 'tm-toggle-color-panel-btn';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9998'; // Just below the panel
        button.style.backgroundColor = '#007BFF';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '50%';
        button.style.width = '40px';
        button.style.height = '40px';
        button.style.fontSize = '20px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
        button.title = 'Toggle Color Customizer Panel';
        button.onclick = togglePanel;

        document.body.appendChild(button);
    }

    // Toggle panel visibility
    function togglePanel() {
        if (panel) {
            const isVisible = panel.style.display === 'block';
            panel.style.display = isVisible ? 'none' : 'block';
            GM_setValue(PANEL_VISIBLE_KEY, !isVisible); // Save visibility state
        }
    }

    // --- Initialization ---
    function init() {
        // Use a small delay to ensure the page elements are likely loaded
        setTimeout(() => {
            console.log('Initializing TypingMind Color Customizer...');
            loadColors();
            applyStyles(); // Apply initial styles
            createControlPanel(); // Create the panel (might be hidden initially)
            createPanelToggleButton(); // Create the button to show/hide panel
            console.log('TypingMind Color Customizer Initialized.');
        }, 1500); // Adjust delay if needed
    }

    // Run the initialization function
    init();

})();
