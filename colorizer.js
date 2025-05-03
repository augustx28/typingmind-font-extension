// ==TypingMind Extension==
// @name UI Color Customizer
// @version 1.0.0
// @description Adds a menu button to customize TypingMind UI colors.
// @author Your Name/Gemini
// @apiKeyNeeded false
// ==/TypingMind Extension==

(function() {
    'use strict';

    // --- Configuration ---
    const STORAGE_KEY = 'typingmind_ui_custom_colors';
    const STYLE_ELEMENT_ID = 'typingmind-color-customizer-styles';

    // **IMPORTANT**: These CSS selectors are GUESSES based on common web structures.
    // You WILL likely need to adjust these by inspecting the TypingMind interface
    // using your browser's Developer Tools (Right-click -> Inspect Element).
    const SELECTORS = {
        // General
        dashboardBackground: 'body, .flex.h-full.w-full.overflow-hidden', // Try targeting the main background area
        dashboardText: 'body, .text-gray-700, .dark\\:text-gray-300', // General text color
        // Sidebar / Menu
        menuBackground: '.bg-gray-50, .dark\\:bg-gray-800', // Sidebar background
        menuText: '.text-gray-700, .dark\\:text-gray-300', // Sidebar text
        menuActiveItemBackground: '.bg-gray-200, .dark\\:bg-gray-700', // Selected item background
        // Chat Area
        chatBackground: '.flex-1.overflow-y-auto', // Chat area background
        // Message Bubbles
        userBubbleBackground: '.bg-blue-500, .dark\\:bg-blue-600', // User message background
        userBubbleText: '.text-white', // User message text
        aiBubbleBackground: '.bg-gray-100, .dark\\:bg-gray-700', // AI message background
        aiBubbleText: '.text-gray-900, .dark\\:text-gray-100', // AI message text
        // Buttons
        primaryButtonBackground: '.btn-primary, .bg-blue-600', // Primary buttons
        primaryButtonText: '.text-white', // Primary button text
        secondaryButtonBackground: '.btn-secondary, .bg-gray-200, .dark\\:bg-gray-600', // Secondary buttons
        secondaryButtonText: '.text-gray-800, .dark\\:text-gray-100', // Secondary button text
    };

    // Default colors (fallback)
    const DEFAULT_COLORS = {
        dashboardBackground: '#FFFFFF',
        dashboardText: '#333333',
        menuBackground: '#F9FAFB',
        menuText: '#374151',
        menuActiveItemBackground: '#E5E7EB',
        chatBackground: '#FFFFFF',
        userBubbleBackground: '#3B82F6',
        userBubbleText: '#FFFFFF',
        aiBubbleBackground: '#F3F4F6',
        aiBubbleText: '#111827',
        primaryButtonBackground: '#2563EB',
        primaryButtonText: '#FFFFFF',
        secondaryButtonBackground: '#E5E7EB',
        secondaryButtonText: '#1F2937',
    };

    // --- Helper Functions ---

    // Load colors from localStorage
    function loadColors() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to ensure all keys exist
                return { ...DEFAULT_COLORS, ...parsed };
            }
        } catch (e) {
            console.error("Error loading custom colors:", e);
        }
        return { ...DEFAULT_COLORS }; // Return a copy of defaults
    }

    // Save colors to localStorage
    function saveColors(colors) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
            console.log("Custom colors saved.");
        } catch (e) {
            console.error("Error saving custom colors:", e);
        }
    }

    // Apply colors by injecting CSS
    function applyColors(colors) {
        let css = '';
        for (const key in SELECTORS) {
            if (colors[key] && SELECTORS[key]) {
                const selectors = SELECTORS[key].split(',').map(s => s.trim()).join(',\n');
                let property = 'color'; // Default property
                if (key.toLowerCase().includes('background')) {
                    property = 'background-color';
                }
                 // Add !important to increase specificity, often needed
                css += `${selectors} {\n  ${property}: ${colors[key]} !important;\n}\n\n`;
            }
        }

        let styleElement = document.getElementById(STYLE_ELEMENT_ID);
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = STYLE_ELEMENT_ID;
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = css;
        console.log("Custom colors applied.");
    }

    // Remove custom styles
    function resetColors() {
        const styleElement = document.getElementById(STYLE_ELEMENT_ID);
        if (styleElement) {
            styleElement.remove();
        }
        localStorage.removeItem(STORAGE_KEY);
        // Optionally, re-apply defaults immediately if needed,
        // but removing the style tag usually reverts to original CSS
        console.log("Custom colors reset.");
         // Re-apply defaults visually (optional)
         // applyColors(DEFAULT_COLORS); // This would apply defaults, but might not be desired on reset.
         // Reload might be needed for full reset in some cases.
         alert("Colors reset. You might need to reload the page for all changes to revert fully.");
    }

    // --- UI Creation ---

    function showColorCustomizerUI() {
        const currentColors = loadColors();
        const modalId = 'color-customizer-modal';

        // Remove existing modal if present
        const existingModal = document.getElementById(modalId);
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal container
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.color = 'black'; // Ensure text is visible
        modal.style.padding = '25px';
        modal.style.border = '1px solid #ccc';
        modal.style.borderRadius = '8px';
        modal.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        modal.style.zIndex = '10000'; // High z-index
        modal.style.maxHeight = '80vh';
        modal.style.overflowY = 'auto';
        modal.style.fontFamily = 'sans-serif';

        // Title
        const title = document.createElement('h2');
        title.textContent = 'Customize UI Colors';
        title.style.marginTop = '0';
        title.style.marginBottom = '20px';
        title.style.textAlign = 'center';
        modal.appendChild(title);

        // Form container
        const form = document.createElement('div');
        form.style.display = 'grid';
        form.style.gridTemplateColumns = 'auto 1fr';
        form.style.gap = '10px 15px';
        form.style.alignItems = 'center';

        // Create color pickers for each item
        for (const key in SELECTORS) {
            const label = document.createElement('label');
            // Format label text (e.g., dashboardBackground -> Dashboard Background)
            label.textContent = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) + ':';
            label.style.justifySelf = 'end';
            label.htmlFor = `color-picker-${key}`;

            const input = document.createElement('input');
            input.type = 'color';
            input.id = `color-picker-${key}`;
            input.dataset.key = key; // Store the key for later retrieval
            input.value = currentColors[key] || DEFAULT_COLORS[key]; // Use current or default
            input.style.width = '60px'; // Make picker smaller
            input.style.height = '30px';
            input.style.border = '1px solid #ccc';
            input.style.padding = '2px';
            input.style.cursor = 'pointer';

            form.appendChild(label);
            form.appendChild(input);
        }
        modal.appendChild(form);

        // Button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '20px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-around';
        buttonContainer.style.gap = '10px';

        // Apply Button
        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply';
        applyButton.style.padding = '8px 15px';
        applyButton.onclick = () => {
            const newColors = { ...currentColors }; // Start with current colors
            modal.querySelectorAll('input[type="color"]').forEach(input => {
                newColors[input.dataset.key] = input.value;
            });
            applyColors(newColors);
        };
        buttonContainer.appendChild(applyButton);

        // Save Button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save & Apply';
        saveButton.style.padding = '8px 15px';
        saveButton.onclick = () => {
             const newColors = {};
             modal.querySelectorAll('input[type="color"]').forEach(input => {
                newColors[input.dataset.key] = input.value;
            });
            applyColors(newColors);
            saveColors(newColors); // Save the applied colors
        };
        buttonContainer.appendChild(saveButton);

        // Reset Button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset to Defaults';
        resetButton.style.padding = '8px 15px';
        resetButton.onclick = () => {
            if (confirm('Are you sure you want to reset all colors to default and remove saved settings?')) {
                resetColors();
                // Optionally update pickers to default values visually
                 modal.querySelectorAll('input[type="color"]').forEach(input => {
                    input.value = DEFAULT_COLORS[input.dataset.key];
                 });
                 // Note: This visual reset won't persist unless saved again.
                 // Reset primarily removes the injected styles.
            }
        };
        buttonContainer.appendChild(resetButton);


        // Close Button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.padding = '8px 15px';
        closeButton.onclick = () => {
            modal.remove();
        };
        buttonContainer.appendChild(closeButton);

        modal.appendChild(buttonContainer);

        // Append modal to body
        document.body.appendChild(modal);
    }

    // --- TypingMind Extension Definition ---

    typingmind.defineExtension({
        name: "UI Color Customizer",
        description: "Adds a menu button to customize TypingMind's UI colors.",
        api_version: "1.0.0", // Use the appropriate API version
        author: "Gemini", // Or your name

        // Define the menu item component
        components: [
            {
                type: "menu_item",
                id: "color_customizer_menu_item",
                label: "🎨 Customize UI Colors", // Added emoji for fun
                action: {
                    type: "invoke_function",
                    function_name: "showColorCustomizerUI", // Function to call when clicked
                },
                // Optional: Define where it appears (e.g., 'tools', 'settings')
                 zone: "settings",
            },
        ],

        // Define the functions used by the extension
        functions: [
            {
                name: "showColorCustomizerUI",
                description: "Opens the color customization panel.",
                handler: async () => { // Must be async for TypingMind
                    try {
                        showColorCustomizerUI();
                        return { success: true, message: "Color customizer opened." };
                    } catch (error) {
                        console.error("Error showing color customizer UI:", error);
                        return { success: false, message: `Error: ${error.message}` };
                    }
                },
            },
             // We don't need to expose apply/save/load/reset as separate functions
             // callable *by the user* via chat, only internally.
        ],

        // Function called when the extension is loaded
        on_load: async () => {
            console.log("UI Color Customizer Extension Loaded.");
            // Apply saved colors automatically on load
            const savedColors = loadColors();
            // Check if saved colors are different from defaults before applying
            if (JSON.stringify(savedColors) !== JSON.stringify(DEFAULT_COLORS)) {
                 applyColors(savedColors);
                 console.log("Applied saved custom colors on load.");
            }
        },

        // Optional: Function called when the extension is unloaded
        on_unload: async () => {
            console.log("UI Color Customizer Extension Unloaded.");
            // Maybe reset colors on unload? Or leave them? User choice.
            // For now, let's leave the styles applied unless reset manually.
            // resetColors(); // Uncomment this line if you want colors to reset on unload/disable.
        }
    });

})(); // End of IIFE wrapper
