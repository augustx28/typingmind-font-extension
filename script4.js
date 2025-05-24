// TypingMind Sidebar Color Customizer Extension
(function() {
    'use strict';
    
    let colorPanel = null;
    let isColorPanelVisible = false;
    
    // Predefined color palette with blacks, grays, and vibrant colors
    const colorPalette = {
        'Blacks & Grays': [
            '#000000', '#1a1a1a', '#2d2d2d', '#404040',
            '#555555', '#6b6b6b', '#808080', '#999999',
            '#b3b3b3', '#cccccc', '#e6e6e6', '#f5f5f5'
        ],
        'Dark Themes': [
            '#0f0f0f', '#1e1e1e', '#252526', '#2d2d30',
            '#3c3c3c', '#424242', '#4a4a4a', '#525252'
        ],
        'Blues': [
            '#001f3f', '#0074d9', '#2196f3', '#03a9f4',
            '#00bcd4', '#006064', '#1565c0', '#0d47a1'
        ],
        'Purples': [
            '#2d1b69', '#512da8', '#673ab7', '#9c27b0',
            '#e91e63', '#4a148c', '#6a1b9a', '#8e24aa'
        ],
        'Greens': [
            '#1b5e20', '#2e7d32', '#388e3c', '#43a047',
            '#4caf50', '#66bb6a', '#81c784', '#00695c'
        ],
        'Reds': [
            '#b71c1c', '#c62828', '#d32f2f', '#e53935',
            '#f44336', '#ef5350', '#e57373', '#8d1b1b'
        ],
        'Oranges': [
            '#bf360c', '#d84315', '#e64100', '#ff5722',
            '#ff6f00', '#ff8f00', '#ffa000', '#ffb300'
        ],
        'Teals': [
            '#004d40', '#00695c', '#00796b', '#00897b',
            '#009688', '#26a69a', '#4db6ac', '#80cbc4'
        ]
    };
    
    // CSS styles for the color panel
    const panelStyles = `
        #sidebar-color-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 360px;
            max-height: 80vh;
            background: #ffffff;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow-y: auto;
            display: none;
        }
        
        #sidebar-color-panel.visible {
            display: block;
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .color-panel-header {
            padding: 16px 20px;
            border-bottom: 1px solid #e0e0e0;
            background: #f8f9fa;
            border-radius: 10px 10px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .color-panel-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin: 0;
        }
        
        .close-panel {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
            padding: 4px;
            border-radius: 4px;
        }
        
        .close-panel:hover {
            background: #e0e0e0;
            color: #333;
        }
        
        .color-panel-content {
            padding: 20px;
        }
        
        .color-section {
            margin-bottom: 24px;
        }
        
        .color-section-title {
            font-size: 14px;
            font-weight: 600;
            color: #555;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .color-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 16px;
        }
        
        .color-option {
            width: 100%;
            height: 40px;
            border: 2px solid transparent;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }
        
        .color-option:hover {
            transform: scale(1.05);
            border-color: #333;
        }
        
        .color-option.selected {
            border-color: #007bff;
            transform: scale(1.05);
        }
        
        .custom-color-section {
            border-top: 1px solid #e0e0e0;
            padding-top: 20px;
        }
        
        .custom-color-input {
            display: flex;
            gap: 12px;
            align-items: center;
            margin-bottom: 16px;
        }
        
        .custom-color-input input[type="color"] {
            width: 50px;
            height: 40px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }
        
        .custom-color-input input[type="text"] {
            flex: 1;
            padding: 10px 12px;
            border: 1px solid #d0d0d0;
            border-radius: 6px;
            font-size: 14px;
            font-family: monospace;
        }
        
        .action-buttons {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }
        
        .action-btn {
            flex: 1;
            padding: 10px 16px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .apply-btn {
            background: #007bff;
            color: white;
        }
        
        .apply-btn:hover {
            background: #0056b3;
        }
        
        .reset-btn {
            background: #6c757d;
            color: white;
        }
        
        .reset-btn:hover {
            background: #545b62;
        }
        
        .toggle-color-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #007bff;
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,123,255,0.3);
            transition: all 0.2s ease;
        }
        
        .toggle-color-panel:hover {
            background: #0056b3;
            transform: scale(1.1);
        }
        
        .current-color-display {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .current-color-swatch {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            border: 1px solid #d0d0d0;
        }
        
        .current-color-text {
            font-size: 14px;
            color: #666;
            font-family: monospace;
        }
    `;
    
    // Function to inject styles
    function injectStyles() {
        if (document.getElementById('sidebar-color-styles')) return;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'sidebar-color-styles';
        styleElement.textContent = panelStyles;
        document.head.appendChild(styleElement);
    }
    
    // Function to get current sidebar color
    function getCurrentSidebarColor() {
        const sidebar = document.querySelector('[class*="sidebar"], .sidebar, nav, aside, [class*="menu"]');
        if (sidebar) {
            const computedStyle = window.getComputedStyle(sidebar);
            return computedStyle.backgroundColor;
        }
        return '#ffffff';
    }
    
    // Function to convert RGB to Hex
    function rgbToHex(rgb) {
        if (rgb.startsWith('#')) return rgb;
        const result = rgb.match(/\d+/g);
        if (!result || result.length < 3) return '#ffffff';
        const r = parseInt(result[0]);
        const g = parseInt(result[1]);
        const b = parseInt(result[2]);
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    // Function to apply color to sidebar
    function applySidebarColor(color) {
        // Try multiple sidebar selectors to ensure compatibility
        const sidebarSelectors = [
            '[class*="sidebar"]',
            '.sidebar',
            'nav',
            'aside',
            '[class*="menu"]',
            '[class*="navigation"]',
            '[class*="side-panel"]',
            '[role="navigation"]'
        ];
        
        let applied = false;
        
        sidebarSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Check if this looks like a sidebar/menu element
                const rect = element.getBoundingClientRect();
                if (rect.width > 50 && rect.height > 100) {
                    element.style.backgroundColor = color + ' !important';
                    element.style.setProperty('background-color', color, 'important');
                    applied = true;
                }
            });
        });
        
        // If no sidebar found with selectors, try to find it by position and size
        if (!applied) {
            const allElements = document.querySelectorAll('*');
            allElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(element);
                
                // Look for elements that could be sidebars (positioned on left/right, reasonable dimensions)
                if ((rect.left < 50 || rect.right > window.innerWidth - 50) && 
                    rect.width > 150 && rect.width < 400 && 
                    rect.height > 300) {
                    element.style.backgroundColor = color + ' !important';
                    element.style.setProperty('background-color', color, 'important');
                }
            });
        }
        
        // Store the selected color
        localStorage.setItem('typingmind-sidebar-color', color);
    }
    
    // Function to create color grid
    function createColorGrid(colors) {
        const grid = document.createElement('div');
        grid.className = 'color-grid';
        
        colors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = color;
            colorOption.title = color;
            colorOption.addEventListener('click', () => selectColor(color, colorOption));
            grid.appendChild(colorOption);
        });
        
        return grid;
    }
    
    // Function to select a color
    function selectColor(color, element) {
        // Remove previous selection
        document.querySelectorAll('.color-option.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Add selection to current element
        if (element) {
            element.classList.add('selected');
        }
        
        // Update custom color input
        const colorInput = document.getElementById('custom-color-picker');
        const hexInput = document.getElementById('custom-hex-input');
        if (colorInput) colorInput.value = color;
        if (hexInput) hexInput.value = color;
        
        // Update current color display
        updateCurrentColorDisplay(color);
    }
    
    // Function to update current color display
    function updateCurrentColorDisplay(color) {
        const swatch = document.querySelector('.current-color-swatch');
        const text = document.querySelector('.current-color-text');
        if (swatch) swatch.style.backgroundColor = color;
        if (text) text.textContent = color;
    }
    
    // Function to create the color panel
    function createColorPanel() {
        if (colorPanel) return colorPanel;
        
        colorPanel = document.createElement('div');
        colorPanel.id = 'sidebar-color-panel';
        
        const currentColor = getCurrentSidebarColor();
        const currentHex = rgbToHex(currentColor);
        
        colorPanel.innerHTML = `
            <div class="color-panel-header">
                <h3 class="color-panel-title">Sidebar Color Customizer</h3>
                <button class="close-panel" onclick="toggleColorPanel()">&times;</button>
            </div>
            <div class="color-panel-content">
                <div class="current-color-display">
                    <div class="current-color-swatch" style="background-color: ${currentHex}"></div>
                    <span class="current-color-text">${currentHex}</span>
                </div>
                
                <div id="color-sections"></div>
                
                <div class="custom-color-section">
                    <div class="color-section-title">Custom Color</div>
                    <div class="custom-color-input">
                        <input type="color" id="custom-color-picker" value="${currentHex}">
                        <input type="text" id="custom-hex-input" placeholder="#000000" value="${currentHex}">
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button class="action-btn apply-btn" onclick="applySelectedColor()">Apply Color</button>
                    <button class="action-btn reset-btn" onclick="resetSidebarColor()">Reset</button>
                </div>
            </div>
        `;
        
        // Create color sections
        const colorSections = colorPanel.querySelector('#color-sections');
        Object.entries(colorPalette).forEach(([sectionName, colors]) => {
            const section = document.createElement('div');
            section.className = 'color-section';
            
            const title = document.createElement('div');
            title.className = 'color-section-title';
            title.textContent = sectionName;
            section.appendChild(title);
            
            section.appendChild(createColorGrid(colors));
            colorSections.appendChild(section);
        });
        
        // Add event listeners for custom color inputs
        const colorPicker = colorPanel.querySelector('#custom-color-picker');
        const hexInput = colorPanel.querySelector('#custom-hex-input');
        
        colorPicker.addEventListener('change', (e) => {
            selectColor(e.target.value);
        });
        
        hexInput.addEventListener('input', (e) => {
            const color = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(color)) {
                selectColor(color);
            }
        });
        
        document.body.appendChild(colorPanel);
        updateCurrentColorDisplay(currentHex);
        
        return colorPanel;
    }
    
    // Function to create toggle button
    function createToggleButton() {
        if (document.getElementById('color-panel-toggle')) return;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'color-panel-toggle';
        toggleBtn.className = 'toggle-color-panel';
        toggleBtn.innerHTML = '🎨';
        toggleBtn.title = 'Customize Sidebar Colors';
        toggleBtn.onclick = toggleColorPanel;
        
        document.body.appendChild(toggleBtn);
    }
    
    // Global functions for button clicks
    window.toggleColorPanel = function() {
        if (!colorPanel) {
            createColorPanel();
        }
        
        isColorPanelVisible = !isColorPanelVisible;
        
        if (isColorPanelVisible) {
            colorPanel.classList.add('visible');
            // Hide toggle button when panel is open
            const toggleBtn = document.getElementById('color-panel-toggle');
            if (toggleBtn) toggleBtn.style.display = 'none';
        } else {
            colorPanel.classList.remove('visible');
            // Show toggle button when panel is closed
            const toggleBtn = document.getElementById('color-panel-toggle');
            if (toggleBtn) toggleBtn.style.display = 'block';
        }
    };
    
    window.applySelectedColor = function() {
        const hexInput = document.getElementById('custom-hex-input');
        if (hexInput && hexInput.value) {
            applySidebarColor(hexInput.value);
        }
    };
    
    window.resetSidebarColor = function() {
        applySidebarColor('#ffffff');
        selectColor('#ffffff');
        localStorage.removeItem('typingmind-sidebar-color');
    };
    
    // Function to initialize the extension
    function init() {
        // Wait for page to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        injectStyles();
        createToggleButton();
        
        // Apply saved color if exists
        const savedColor = localStorage.getItem('typingmind-sidebar-color');
        if (savedColor) {
            setTimeout(() => applySidebarColor(savedColor), 1000);
        }
        
        // Re-apply color when page changes (for SPAs)
        const observer = new MutationObserver(() => {
            const savedColor = localStorage.getItem('typingmind-sidebar-color');
            if (savedColor) {
                applySidebarColor(savedColor);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('TypingMind Sidebar Color Customizer loaded successfully!');
    }
    
    // Handle page reload/navigation
    window.addEventListener('load', init);
    
    // Initialize immediately if DOM is already ready
    if (document.readyState !== 'loading') {
        init();
    }
    
})();
