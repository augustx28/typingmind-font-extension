// TypingMind Color Theming Extension
// Author: JavaScript & UI Expert
// Created: May 3, 2025
// Description: Adds a color customization panel to TypingMind

(function() {
    // Wait for the TypingMind interface to fully load
    const initInterval = setInterval(() => {
        if (document.querySelector('.dark\\:bg-gray-900')) {
            clearInterval(initInterval);
            initColorThemer();
        }
    }, 500);

    function initColorThemer() {
        const styleId = 'typingmind-color-themer-styles';
        
        // Create custom CSS style element if it doesn't exist
        if (!document.getElementById(styleId)) {
            const styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
        }
        
        // Default theme colors
        const defaultColors = {
            backgroundColor: '#ffffff',
            darkBackgroundColor: '#1a1a1a',
            textColor: '#000000',
            darkTextColor: '#ffffff',
            primaryColor: '#10a37f',
            secondaryColor: '#f0f0f0',
            chatBubbleUser: '#e6f7ff',
            chatBubbleAssistant: '#f6ffed',
            buttonColor: '#10a37f',
            buttonTextColor: '#ffffff',
            sidebarColor: '#f7f7f8',
            darkSidebarColor: '#202123',
            headerColor: '#ffffff',
            darkHeaderColor: '#343541'
        };
        
        // Load saved colors from localStorage or use defaults
        let currentColors = JSON.parse(localStorage.getItem('typingmind-theme-colors')) || {...defaultColors};
        
        // Create theme toggle button
        const toggleButton = document.createElement('button');
        toggleButton.id = 'color-theme-toggle';
        toggleButton.innerHTML = '🎨';
        toggleButton.title = 'Customize Colors';
        toggleButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: ${currentColors.primaryColor};
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        `;
        document.body.appendChild(toggleButton);
        
        // Create color customization panel
        const panel = document.createElement('div');
        panel.id = 'color-customization-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 300px;
            max-height: 70vh;
            overflow-y: auto;
            background: white;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 999;
            display: none;
            flex-direction: column;
            gap: 10px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        `;
        document.body.appendChild(panel);
        
        // Color configuration options
        const colorOptions = [
            { id: 'backgroundColor', label: 'Light Background', description: 'Main background in light mode' },
            { id: 'darkBackgroundColor', label: 'Dark Background', description: 'Main background in dark mode' },
            { id: 'textColor', label: 'Light Text', description: 'Main text color in light mode' },
            { id: 'darkTextColor', label: 'Dark Text', description: 'Main text color in dark mode' },
            { id: 'primaryColor', label: 'Primary Color', description: 'Main accent color' },
            { id: 'secondaryColor', label: 'Secondary Color', description: 'Secondary accent color' },
            { id: 'chatBubbleUser', label: 'User Chat Bubble', description: 'Background of user messages' },
            { id: 'chatBubbleAssistant', label: 'Assistant Chat Bubble', description: 'Background of assistant messages' },
            { id: 'buttonColor', label: 'Button Color', description: 'Background color of buttons' },
            { id: 'buttonTextColor', label: 'Button Text', description: 'Text color of buttons' },
            { id: 'sidebarColor', label: 'Light Sidebar', description: 'Sidebar color in light mode' },
            { id: 'darkSidebarColor', label: 'Dark Sidebar', description: 'Sidebar color in dark mode' },
            { id: 'headerColor', label: 'Light Header', description: 'Header color in light mode' },
            { id: 'darkHeaderColor', label: 'Dark Header', description: 'Header color in dark mode' }
        ];
        
        // Add title to the panel
        const title = document.createElement('h3');
        title.textContent = 'TypingMind Color Customizer';
        title.style.margin = '0 0 15px 0';
        panel.appendChild(title);
        
        // Add color pickers to the panel
        colorOptions.forEach(option => {
            const container = document.createElement('div');
            container.style.cssText = `
                display: flex;
                flex-direction: column;
                margin-bottom: 10px;
            `;
            
            const labelContainer = document.createElement('div');
            labelContainer.style.display = 'flex';
            labelContainer.style.justifyContent = 'space-between';
            labelContainer.style.marginBottom = '5px';
            
            const label = document.createElement('label');
            label.htmlFor = option.id;
            label.textContent = option.label;
            label.style.fontWeight = 'bold';
            
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.id = option.id;
            colorInput.value = currentColors[option.id];
            colorInput.style.width = '25px';
            colorInput.style.height = '25px';
            colorInput.style.border = 'none';
            colorInput.style.cursor = 'pointer';
            
            const description = document.createElement('small');
            description.textContent = option.description;
            description.style.color = '#666';
            description.style.fontSize = '0.8em';
            
            labelContainer.appendChild(label);
            labelContainer.appendChild(colorInput);
            container.appendChild(labelContainer);
            container.appendChild(description);
            panel.appendChild(container);
            
            // Add event listener to update theme when color is changed
            colorInput.addEventListener('input', (e) => {
                currentColors[option.id] = e.target.value;
                applyTheme(currentColors);
                localStorage.setItem('typingmind-theme-colors', JSON.stringify(currentColors));
            });
        });
        
        // Add reset button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset to Default';
        resetButton.style.cssText = `
            background: #f44336;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            font-weight: bold;
        `;
        panel.appendChild(resetButton);
        
        resetButton.addEventListener('click', () => {
            currentColors = {...defaultColors};
            applyTheme(currentColors);
            localStorage.setItem('typingmind-theme-colors', JSON.stringify(currentColors));
            
            // Update color input values
            colorOptions.forEach(option => {
                document.getElementById(option.id).value = currentColors[option.id];
            });
        });
        
        // Toggle panel visibility on button click
        toggleButton.addEventListener('click', () => {
            if (panel.style.display === 'none') {
                panel.style.display = 'flex';
            } else {
                panel.style.display = 'none';
            }
        });
        
        // Apply theme on init
        applyTheme(currentColors);
        
        // Function to apply theme colors
        function applyTheme(colors) {
            const styleEl = document.getElementById(styleId);
            
            styleEl.textContent = `
                /* Light mode styles */
                :root {
                    --background-color: ${colors.backgroundColor};
                    --text-color: ${colors.textColor};
                    --primary-color: ${colors.primaryColor};
                    --secondary-color: ${colors.secondaryColor};
                    --user-bubble: ${colors.chatBubbleUser};
                    --assistant-bubble: ${colors.chatBubbleAssistant};
                    --button-color: ${colors.buttonColor};
                    --button-text: ${colors.buttonTextColor};
                    --sidebar-color: ${colors.sidebarColor};
                    --header-color: ${colors.headerColor};
                }
                
                /* Dark mode styles */
                .dark {
                    --background-color: ${colors.darkBackgroundColor};
                    --text-color: ${colors.darkTextColor};
                    --sidebar-color: ${colors.darkSidebarColor};
                    --header-color: ${colors.darkHeaderColor};
                }
                
                /* Background colors */
                body, .bg-white, .dark\\:bg-gray-900 {
                    background-color: var(--background-color) !important;
                }
                
                /* Text colors */
                body, .text-gray-800, .dark\\:text-gray-100 {
                    color: var(--text-color) !important;
                }
                
                /* Sidebar */
                .bg-gray-50, .dark\\:bg-gray-800 {
                    background-color: var(--sidebar-color) !important;
                }
                
                /* Header */
                nav, header {
                    background-color: var(--header-color) !important;
                }
                
                /* Chat bubbles */
                .bg-blue-50, .dark\\:bg-blue-900\\/20 {
                    background-color: var(--user-bubble) !important;
                }
                
                .bg-gray-50, .dark\\:bg-gray-700\\/30 {
                    background-color: var(--assistant-bubble) !important;
                }
                
                /* Buttons */
                button.bg-green-600, button.bg-blue-600, .bg-green-600, .bg-blue-600 {
                    background-color: var(--button-color) !important;
                    color: var(--button-text) !important;
                }
                
                /* Primary color elements */
                .text-green-600, .text-blue-600, .border-green-600, .border-blue-600 {
                    color: var(--primary-color) !important;
                    border-color: var(--primary-color) !important;
                }
                
                /* Hover states */
                button:hover.bg-green-600, button:hover.bg-blue-600 {
                    background-color: color-mix(in srgb, var(--button-color) 90%, black) !important;
                }
                
                /* Input fields */
                input, textarea, select {
                    background-color: color-mix(in srgb, var(--background-color) 90%, var(--text-color)) !important;
                    color: var(--text-color) !important;
                    border-color: color-mix(in srgb, var(--background-color) 70%, var(--text-color)) !important;
                }
            `;
            
            // Update the theme toggle button color
            toggleButton.style.background = colors.primaryColor;
        }
    }
})();
