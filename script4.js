// TypingMind Left Sidebar Color Customizer Extension
(function() {
    'use strict';
    
    let colorPanel = null;
    let isColorPanelVisible = false;
    
    // Predefined color palette with emphasis on blacks, grays, and popular colors
    const colorPalette = {
        'Blacks & Dark Grays': [
            '#000000', '#0d1117', '#161b22', '#1c2128',
            '#21262d', '#2d333b', '#373e47', '#444c56',
            '#545d68', '#656c76', '#768390', '#8b949e'
        ],
        'Light Grays & Whites': [
            '#f6f8fa', '#f0f3f6', '#e1e4e8', '#d1d9e0',
            '#c9d1d9', '#b1bac4', '#959da5', '#6e7681',
            '#484f58', '#33394a', '#24292f', '#1a1e23'
        ],
        'Popular Dark Themes': [
            '#0d1117', '#161b22', '#1e293b', '#1f2937',
            '#111827', '#18181b', '#27272a', '#3f3f46',
            '#52525b', '#71717a', '#a1a1aa', '#d4d4d8'
        ],
        'Blues': [
            '#0969da', '#1f6feb', '#388bfd', '#58a6ff',
            '#79c0ff', '#a5d6ff', '#b6e3ff', '#cae8ff',
            '#001d3d', '#003566', '#0077b6', '#0096c7'
        ],
        'Purples': [
            '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe',
            '#6f42c1', '#8a63d2', '#b180d7', '#c8a2c8',
            '#4c1d95', '#6b21a8', '#7c3aed', '#8b5cf6'
        ],
        'Greens': [
            '#238636', '#2ea043', '#56d364', '#7ee787',
            '#a2f2a5', '#aff5b4', '#ccffd8', '#d3f9d8',
            '#0d5016', '#1a7f37', '#2da44e', '#3fb950'
        ],
        'Warm Colors': [
            '#da3633', '#f85149', '#ff7b72', '#ffa198',
            '#fd7e14', '#ff922b', '#ffb366', '#ffc994',
            '#7c2d12', '#9a3412', '#c2410c', '#ea580c'
        ]
    };
    
    // CSS styles for the color panel
    const panelStyles = `
        #tm-sidebar-color-panel {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 380px;
            max-height: calc(100vh - 120px);
            background: #ffffff;
            border: 1px solid #d0d7de;
            border-radius: 12px;
            box-shadow: 0 16px 32px rgba(1,4,9,0.85);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            overflow-y: auto;
            display: none;
            backdrop-filter: blur(16px);
        }
        
        #tm-sidebar-color-panel.visible {
            display: block;
            animation: slideInPanel 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes slideInPanel {
            from { 
                opacity: 0; 
                transform: translateY(-8px) scale(0.96); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
        }
        
        .tm-panel-header {
            padding: 20px 24px 16px;
            border-bottom: 1px solid #d0d7de;
            background: linear-gradient(135deg, #f6f8fa 0%, #ffffff 100%);
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .tm-panel-title {
            font-size: 16px;
            font-weight: 600;
            color: #24292f;
            margin: 0;
        }
        
        .tm-close-panel {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #656d76;
            padding: 8px;
            border-radius: 6px;
            transition: all 0.15s ease;
        }
        
        .tm-close-panel:hover {
            background: #f3f4f6;
            color: #24292f;
        }
        
        .tm-panel-content {
            padding: 20px 24px 24px;
        }
        
        .tm-current-color {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            padding: 12px 16px;
            background: #f6f8fa;
            border-radius: 8px;
            border: 1px solid #d0d7de;
        }
        
        .tm-current-swatch {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            border: 1px solid #d0d7de;
            flex-shrink: 0;
        }
        
        .tm-current-info {
            flex-grow: 1;
        }
        
        .tm-current-label {
            font-size: 12px;
            color: #656d76;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
        }
        
        .tm-current-value {
            font-size: 14px;
            color: #24292f;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            font-weight: 500;
        }
        
        .tm-color-section {
            margin-bottom: 24px;
        }
        
        .tm-section-title {
            font-size: 13px;
            font-weight: 600;
            color: #656d76;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }
        
        .tm-color-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 16px;
        }
        
        .tm-color-option {
            width: 100%;
            height: 44px;
            border: 2px solid transparent;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
        }
        
        .tm-color-option:hover {
            transform: scale(1.05);
            border-color: #0969da;
            box-shadow: 0 4px 12px rgba(9, 105, 218, 0.15);
        }
        
        .tm-color-option.selected {
            border-color: #0969da;
            transform: scale(1.05);
            box-shadow: 0 0 0 1px #0969da;
        }
        
        .tm-color-option.selected::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: bold;
            font-size: 16px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
        
        .tm-custom-section {
            border-top: 1px solid #d0d7de;
            padding-top: 20px;
        }
        
        .tm-custom-input {
            display: flex;
            gap: 12px;
            align-items: center;
            margin-bottom: 16px;
        }
        
        .tm-custom-input input[type="color"] {
            width: 52px;
            height: 44px;
            border: 1px solid #d0d7de;
            border-radius: 8px;
            cursor: pointer;
            background: none;
        }
        
        .tm-custom-input input[type="text"] {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #d0d7de;
            border-radius: 8px;
            font-size: 14px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            transition: border-color 0.15s ease;
        }
        
        .tm-custom-input input[type="text"]:focus {
            outline: none;
            border-color: #0969da;
            box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.12);
        }
        
        .tm-action-buttons {
            display: flex;
            gap: 12px;
            margin-top: 24px;
        }
        
        .tm-action-btn {
            flex: 1;
            padding: 12px 16px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        
        .tm-apply-btn {
            background: #238636;
            color: white;
        }
        
        .tm-apply-btn:hover {
            background: #2ea043;
            transform: translateY(-1px);
        }
        
        .tm-reset-btn {
            background: #6e7681;
            color: white;
        }
        
        .tm-reset-btn:hover {
            background: #8b949e;
            transform: translateY(-1px);
        }
        
        .tm-toggle-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #0969da 0%, #0550ae 100%);
            color: white;
            border: none;
            width: 52px;
            height: 52px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 22px;
            z-index: 9999;
            box-shadow: 0 8px 24px rgba(9, 105, 218, 0.35);
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .tm-toggle-btn:hover {
            background: linear-gradient(135deg, #0550ae 0%, #033d8b 100%);
            transform: scale(1.05);
            box-shadow: 0 12px 32px rgba(9, 105, 218, 0.45);
        }
        
        .tm-toggle-btn:active {
            transform: scale(0.95);
        }
    `;
    
    // Function to inject styles
    function injectStyles() {
        if (document.getElementById('tm-sidebar-styles')) return;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'tm-sidebar-styles';
        styleElement.textContent = panelStyles;
        document.head.appendChild(styleElement);
    }
    
    // Function to get the specific left sidebar element
    function getTargetSidebar() {
        // Target the specific left sidebar that contains the chat folders and conversations
        const sidebar = document.querySelector('div[class*="w-64"], div[class*="sidebar"], nav[class*="w-64"]');
        if (sidebar) {
            const rect = sidebar.getBoundingClientRect();
            // Ensure it's on the left side and has reasonable dimensions
            if (rect.left < 100 && rect.width > 200 && rect.width < 350) {
                return sidebar;
            }
        }
        
        // Fallback: look for elements that match the structure shown in the image
        const possibleSidebars = document.querySelectorAll('div');
        for (let element of possibleSidebars) {
            const rect = element.getBoundingClientRect();
            const style = window.getComputedStyle(element);
            
            // Check if it matches the sidebar characteristics
            if (rect.left < 50 && 
                rect.width > 200 && 
                rect.width < 400 && 
                rect.height > 500 &&
                (element.querySelector('[class*="chat"]') || 
                 element.querySelector('button') ||
                 element.textContent.includes('New chat'))) {
                return element;
            }
        }
        
        return null;
    }
    
    // Function to get current sidebar color
    function getCurrentSidebarColor() {
        const sidebar = getTargetSidebar();
        if (sidebar) {
            const computedStyle = window.getComputedStyle(sidebar);
            return rgbToHex(computedStyle.backgroundColor);
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
        const sidebar = getTargetSidebar();
        if (sidebar) {
            sidebar.style.setProperty('background-color', color, 'important');
            sidebar.style.setProperty('background', color, 'important');
            
            // Also apply to any direct children that might have background colors
            const children = sidebar.children;
            for (let child of children) {
                if (window.getComputedStyle(child).backgroundColor !== 'rgba(0, 0, 0, 0)') {
                    child.style.setProperty('background-color', color, 'important');
                }
            }
            
            // Store the selected color
            localStorage.setItem('tm-sidebar-color', color);
            updateCurrentColorDisplay(color);
            
            console.log('Applied color:', color, 'to sidebar:', sidebar);
            return true;
        } else {
            console.warn('Target sidebar not found');
            return false;
        }
    }
    
    // Function to create color grid
    function createColorGrid(colors) {
        const grid = document.createElement('div');
        grid.className = 'tm-color-grid';
        
        colors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.className = 'tm-color-option';
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
        document.querySelectorAll('.tm-color-option.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Add selection to current element
        if (element) {
            element.classList.add('selected');
        }
        
        // Update custom color inputs
        const colorInput = document.getElementById('tm-custom-color-picker');
        const hexInput = document.getElementById('tm-custom-hex-input');
        if (colorInput) colorInput.value = color;
        if (hexInput) hexInput.value = color;
        
        // Update current color display
        updateCurrentColorDisplay(color);
    }
    
    // Function to update current color display
    function updateCurrentColorDisplay(color) {
        const swatch = document.querySelector('.tm-current-swatch');
        const value = document.querySelector('.tm-current-value');
        if (swatch) swatch.style.backgroundColor = color;
        if (value) value.textContent = color;
    }
    
    // Function to create the color panel
    function createColorPanel() {
        if (colorPanel) return colorPanel;
        
        colorPanel = document.createElement('div');
        colorPanel.id = 'tm-sidebar-color-panel';
        
        const currentColor = getCurrentSidebarColor();
        
        colorPanel.innerHTML = `
            <div class="tm-panel-header">
                <h3 class="tm-panel-title">Sidebar Color Customizer</h3>
                <button class="tm-close-panel" onclick="window.tmToggleColorPanel()">&times;</button>
            </div>
            <div class="tm-panel-content">
                <div class="tm-current-color">
                    <div class="tm-current-swatch" style="background-color: ${currentColor}"></div>
                    <div class="tm-current-info">
                        <div class="tm-current-label">Current Color</div>
                        <div class="tm-current-value">${currentColor}</div>
                    </div>
                </div>
                
                <div id="tm-color-sections"></div>
                
                <div class="tm-custom-section">
                    <div class="tm-section-title">Custom Color</div>
                    <div class="tm-custom-input">
                        <input type="color" id="tm-custom-color-picker" value="${currentColor}">
                        <input type="text" id="tm-custom-hex-input" placeholder="#000000" value="${currentColor}">
                    </div>
                </div>
                
                <div class="tm-action-buttons">
                    <button class="tm-action-btn tm-apply-btn" onclick="window.tmApplySelectedColor()">Apply Color</button>
                    <button class="tm-action-btn tm-reset-btn" onclick="window.tmResetSidebarColor()">Reset Default</button>
                </div>
            </div>
        `;
        
        // Create color sections
        const colorSections = colorPanel.querySelector('#tm-color-sections');
        Object.entries(colorPalette).forEach(([sectionName, colors]) => {
            const section = document.createElement('div');
            section.className = 'tm-color-section';
            
            const title = document.createElement('div');
            title.className = 'tm-section-title';
            title.textContent = sectionName;
            section.appendChild(title);
            
            section.appendChild(createColorGrid(colors));
            colorSections.appendChild(section);
        });
        
        // Add event listeners for custom color inputs
        const colorPicker = colorPanel.querySelector('#tm-custom-color-picker');
        const hexInput = colorPanel.querySelector('#tm-custom-hex-input');
        
        colorPicker.addEventListener('change', (e) => {
            selectColor(e.target.value);
        });
        
        hexInput.addEventListener('input', (e) => {
            const color = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(color)) {
                selectColor(color);
                colorPicker.value = color;
            }
        });
        
        document.body.appendChild(colorPanel);
        updateCurrentColorDisplay(currentColor);
        
        return colorPanel;
    }
    
    // Function to create toggle button
    function createToggleButton() {
        if (document.getElementById('tm-color-toggle')) return;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'tm-color-toggle';
        toggleBtn.className = 'tm-toggle-btn';
        toggleBtn.innerHTML = '🎨';
        toggleBtn.title = 'Customize Sidebar Color';
        toggleBtn.onclick = window.tmToggleColorPanel;
        
        document.body.appendChild(toggleBtn);
    }
    
    // Global functions for button clicks
    window.tmToggleColorPanel = function() {
        if (!colorPanel) {
            createColorPanel();
        }
        
        isColorPanelVisible = !isColorPanelVisible;
        
        if (isColorPanelVisible) {
            colorPanel.classList.add('visible');
            const toggleBtn = document.getElementById('tm-color-toggle');
            if (toggleBtn) toggleBtn.style.display = 'none';
        } else {
            colorPanel.classList.remove('visible');
            const toggleBtn = document.getElementById('tm-color-toggle');
            if (toggleBtn) toggleBtn.style.display = 'flex';
        }
    };
    
    window.tmApplySelectedColor = function() {
        const hexInput = document.getElementById('tm-custom-hex-input');
        if (hexInput && hexInput.value) {
            const success = applySidebarColor(hexInput.value);
            if (success) {
                // Optional: show success feedback
                console.log('Color applied successfully!');
            }
        }
    };
    
    window.tmResetSidebarColor = function() {
        applySidebarColor('#ffffff');
        selectColor('#ffffff');
        localStorage.removeItem('tm-sidebar-color');
    };
    
    // Function to initialize the extension
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        injectStyles();
        createToggleButton();
        
        // Apply saved color if exists
        const savedColor = localStorage.getItem('tm-sidebar-color');
        if (savedColor) {
            setTimeout(() => {
                applySidebarColor(savedColor);
            }, 1500); // Give more time for TypingMind to load
        }
        
        // Monitor for changes and reapply color
        const observer = new MutationObserver(() => {
            const savedColor = localStorage.getItem('tm-sidebar-color');
            if (savedColor) {
                setTimeout(() => applySidebarColor(savedColor), 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('TypingMind Sidebar Color Customizer loaded successfully!');
    }
    
    // Initialize
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
        if (document.readyState !== 'loading') {
            init();
        }
    }
    
})();
