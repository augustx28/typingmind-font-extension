// ==UserScript==
// @name         TypingMind Font Changer Pro
// @namespace    http://your.namespace.here/
// @version      2.0
// @description  Advanced font customization for TypingMind.com with extensive Google Fonts, weights, and modern UI
// @author       Enhanced Version
// @match        https://www.typingmind.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const SCRIPT_PREFIX = 'tmfc_';
    const GOOGLE_FONTS = [
        // Sans-serif fonts
        "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", "Nunito Sans",
        "Source Sans Pro", "PT Sans", "Ubuntu", "Noto Sans", "Raleway", "Work Sans",
        "Fira Sans", "DM Sans", "Plus Jakarta Sans", "Manrope", "Outfit", "Space Grotesk",
        "Lexend", "Satoshi", "General Sans", "Cabinet Grotesk", "Clash Display",
        
        // Serif fonts
        "Merriweather", "Playfair Display", "Lora", "Crimson Text", "Libre Baskerville",
        "Source Serif Pro", "PT Serif", "Cormorant Garamond", "EB Garamond", "Vollkorn",
        "Spectral", "Bitter", "Alegreya", "Neuton",
        
        // Monospace fonts
        "JetBrains Mono", "Fira Code", "Source Code Pro", "IBM Plex Mono", "Roboto Mono",
        "Space Mono", "Inconsolata", "Ubuntu Mono", "Cousine", "Anonymous Pro",
        
        // Display fonts
        "Oswald", "Bebas Neue", "Anton", "Righteous", "Fredoka One", "Lobster",
        "Pacifico", "Dancing Script", "Kaushan Script", "Great Vibes"
    ];
    
    const FONT_WEIGHTS = [
        { value: '300', label: 'Light' },
        { value: '400', label: 'Normal' },
        { value: '500', label: 'Medium' },
        { value: '600', label: 'Semi Bold' },
        { value: '700', label: 'Bold' },
        { value: '800', label: 'Extra Bold' }
    ];
    
    const SHORTCUT_KEY = 'F';
    const SHORTCUT_MODIFIERS = { altKey: true, shiftKey: true, ctrlKey: false };
    
    // --- State & Storage Helper ---
    const storage = {
        getItem: (key, defaultValue) => {
            const val = localStorage.getItem(SCRIPT_PREFIX + key);
            if (val === null && defaultValue !== undefined) return defaultValue;
            try {
                return JSON.parse(val);
            } catch (e) {
                return val;
            }
        },
        setItem: (key, value) => {
            localStorage.setItem(SCRIPT_PREFIX + key, JSON.stringify(value));
        }
    };

    let fontPanelVisible = false;
    let showMenuButtonSetting = storage.getItem('showMenuButton', true);
    let currentFontSetting = storage.getItem('currentFont', { 
        name: '', 
        weight: '400', 
        isGoogle: false, 
        custom: false 
    });

    // --- DOM Elements ---
    let menuButtonContainer = null;
    let menuButton = null;
    let fontPanel = null;
    let googleFontSelect = null;
    let localFontInput = null;
    let fontWeightSelect = null;
    let fontSizeSlider = null;
    let previewText = null;
    let showButtonCheckbox = null;
    let activeGoogleFontLink = null;

    // --- Enhanced Styles ---
    function injectStyles() {
        const css = `
            .${SCRIPT_PREFIX}menu-button {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                cursor: pointer;
                padding: 8px 16px;
                margin: 0 8px;
                font-family: inherit;
                font-size: 14px;
                font-weight: 500;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                border-radius: 20px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                position: relative;
                overflow: hidden;
            }
            
            .${SCRIPT_PREFIX}menu-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }
            
            .${SCRIPT_PREFIX}menu-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            }
            
            .${SCRIPT_PREFIX}menu-button:hover::before {
                left: 100%;
            }
            
            .${SCRIPT_PREFIX}menu-button .icon {
                font-size: 16px;
                font-weight: bold;
            }
            
            .${SCRIPT_PREFIX}panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
                color: #1e293b;
                padding: 0;
                border-radius: 16px;
                box-shadow: 0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.8);
                z-index: 10001;
                width: 480px;
                max-width: 95vw;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                display: none;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255,255,255,0.2);
                animation: ${SCRIPT_PREFIX}slideIn 0.3s ease-out;
            }
            
            @keyframes ${SCRIPT_PREFIX}slideIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            
            .${SCRIPT_PREFIX}panel.visible {
                display: block;
            }
            
            .${SCRIPT_PREFIX}panel-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px 25px;
                border-radius: 16px 16px 0 0;
                position: relative;
                text-align: center;
            }
            
            .${SCRIPT_PREFIX}panel-body {
                padding: 25px;
            }
            
            .${SCRIPT_PREFIX}panel h3 {
                margin: 0;
                font-size: 1.5em;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .${SCRIPT_PREFIX}panel h3::before {
                content: "🎨";
                font-size: 1.2em;
            }
            
            .${SCRIPT_PREFIX}form-group {
                margin-bottom: 20px;
            }
            
            .${SCRIPT_PREFIX}form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .${SCRIPT_PREFIX}panel label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                font-size: 0.9em;
                color: #374151;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .${SCRIPT_PREFIX}panel select, 
            .${SCRIPT_PREFIX}panel input[type="text"],
            .${SCRIPT_PREFIX}panel input[type="range"] {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                box-sizing: border-box;
                font-size: 1em;
                transition: all 0.3s ease;
                background: white;
            }
            
            .${SCRIPT_PREFIX}panel select:focus,
            .${SCRIPT_PREFIX}panel input[type="text"]:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                transform: translateY(-1px);
            }
            
            .${SCRIPT_PREFIX}preview-container {
                background: #f8fafc;
                border: 2px dashed #cbd5e1;
                border-radius: 12px;
                padding: 20px;
                text-align: center;
                margin-bottom: 20px;
                transition: all 0.3s ease;
            }
            
            .${SCRIPT_PREFIX}preview-text {
                font-size: 18px;
                line-height: 1.6;
                color: #1e293b;
                margin: 0;
                transition: all 0.3s ease;
            }
            
            .${SCRIPT_PREFIX}slider-container {
                position: relative;
                margin: 10px 0;
            }
            
            .${SCRIPT_PREFIX}slider-value {
                position: absolute;
                right: 0;
                top: -25px;
                background: #667eea;
                color: white;
                padding: 2px 8px;
                border-radius: 6px;
                font-size: 0.8em;
                font-weight: 500;
            }
            
            .${SCRIPT_PREFIX}panel input[type="range"] {
                height: 6px;
                background: #e5e7eb;
                outline: none;
                border: none;
                border-radius: 3px;
                padding: 0;
            }
            
            .${SCRIPT_PREFIX}panel input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                transition: transform 0.2s ease;
            }
            
            .${SCRIPT_PREFIX}panel input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.1);
            }
            
            .${SCRIPT_PREFIX}button-group {
                display: flex;
                gap: 12px;
                margin-top: 25px;
            }
            
            .${SCRIPT_PREFIX}panel button {
                padding: 12px 20px;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                font-size: 0.95em;
                font-weight: 600;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .${SCRIPT_PREFIX}apply-button {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                flex: 2;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            }
            
            .${SCRIPT_PREFIX}apply-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
            }
            
            .${SCRIPT_PREFIX}reset-button {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
                flex: 1;
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
            }
            
            .${SCRIPT_PREFIX}reset-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
            }
            
            .${SCRIPT_PREFIX}close-button {
                position: absolute;
                top: 15px;
                right: 15px;
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                font-size: 1.5em;
                cursor: pointer;
                padding: 8px;
                line-height: 1;
                border-radius: 8px;
                transition: all 0.3s ease;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .${SCRIPT_PREFIX}close-button:hover {
                background: rgba(255,255,255,0.3);
                transform: scale(1.1);
            }
            
            .${SCRIPT_PREFIX}settings-group {
                margin-top: 25px;
                padding: 20px;
                background: rgba(102, 126, 234, 0.05);
                border-radius: 12px;
                border: 1px solid rgba(102, 126, 234, 0.1);
            }
            
            .${SCRIPT_PREFIX}checkbox-container {
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
            }
            
            .${SCRIPT_PREFIX}checkbox-container input[type="checkbox"] {
                width: 18px;
                height: 18px;
                accent-color: #667eea;
                cursor: pointer;
            }
            
            .${SCRIPT_PREFIX}checkbox-container label {
                margin: 0;
                font-weight: 500;
                font-size: 0.95em;
                cursor: pointer;
                text-transform: none;
                letter-spacing: 0;
            }
            
            .${SCRIPT_PREFIX}overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.3);
                z-index: 10000;
                display: none;
                backdrop-filter: blur(4px);
            }
            
            .${SCRIPT_PREFIX}overlay.visible {
                display: block;
            }
            
            .${SCRIPT_PREFIX}font-category {
                font-size: 0.8em;
                color: #6b7280;
                font-style: italic;
                margin-left: 8px;
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }

    function createMenuButton() {
        menuButton = document.createElement('button');
        menuButton.innerHTML = '<span class="icon">Aa</span><span>Fonts</span>';
        menuButton.className = `${SCRIPT_PREFIX}menu-button`;
        menuButton.title = 'Customize Fonts (Shift+Alt+F)';
        menuButton.addEventListener('click', handleMenuButtonClick);

        // Enhanced insertion logic for TypingMind
        let inserted = false;
        
        // Try multiple selectors common in TypingMind
        const possibleContainers = [
            'nav ul', 'header nav', '.header-menu', '.top-menu', 
            '[role="navigation"] ul', '.navigation ul', '.menu-container'
        ];
        
        for (const selector of possibleContainers) {
            const container = document.querySelector(selector);
            if (container) {
                menuButtonContainer = document.createElement('li');
                menuButtonContainer.appendChild(menuButton);
                container.appendChild(menuButtonContainer);
                inserted = true;
                break;
            }
        }

        if (!inserted) {
            // Fallback with better positioning
            menuButton.style.position = 'fixed';
            menuButton.style.top = '20px';
            menuButton.style.right = '20px';
            menuButton.style.zIndex = '9999';
            document.body.appendChild(menuButton);
            menuButtonContainer = menuButton;
        }
        
        updateMenuButtonVisibility();
    }

    function createFontPanel() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = `${SCRIPT_PREFIX}overlay`;
        overlay.addEventListener('click', () => toggleFontPanel(false));
        document.body.appendChild(overlay);

        fontPanel = document.createElement('div');
        fontPanel.className = `${SCRIPT_PREFIX}panel`;
        
        const fontOptions = GOOGLE_FONTS.map(font => {
            let category = '';
            if (['JetBrains Mono', 'Fira Code', 'Source Code Pro', 'IBM Plex Mono', 'Roboto Mono'].includes(font)) {
                category = ' <span class="' + SCRIPT_PREFIX + 'font-category">(Mono)</span>';
            } else if (['Merriweather', 'Playfair Display', 'Lora', 'Crimson Text'].includes(font)) {
                category = ' <span class="' + SCRIPT_PREFIX + 'font-category">(Serif)</span>';
            } else if (['Oswald', 'Bebas Neue', 'Anton', 'Pacifico', 'Dancing Script'].includes(font)) {
                category = ' <span class="' + SCRIPT_PREFIX + 'font-category">(Display)</span>';
            }
            return `<option value="${font}">${font}${category}</option>`;
        }).join('');

        const weightOptions = FONT_WEIGHTS.map(weight => 
            `<option value="${weight.value}">${weight.label}</option>`
        ).join('');

        fontPanel.innerHTML = `
            <div class="${SCRIPT_PREFIX}panel-header">
                <button class="${SCRIPT_PREFIX}close-button" title="Close">&times;</button>
                <h3>Font Customizer</h3>
            </div>
            
            <div class="${SCRIPT_PREFIX}panel-body">
                <div class="${SCRIPT_PREFIX}form-group">
                    <label for="${SCRIPT_PREFIX}google-font-select">Choose Google Font</label>
                    <select id="${SCRIPT_PREFIX}google-font-select">
                        <option value="">-- Select Google Font --</option>
                        ${fontOptions}
                    </select>
                </div>

                <div class="${SCRIPT_PREFIX}form-row">
                    <div class="${SCRIPT_PREFIX}form-group">
                        <label for="${SCRIPT_PREFIX}font-weight-select">Font Weight</label>
                        <select id="${SCRIPT_PREFIX}font-weight-select">
                            ${weightOptions}
                        </select>
                    </div>
                    
                    <div class="${SCRIPT_PREFIX}form-group">
                        <label for="${SCRIPT_PREFIX}font-size-slider">Font Size</label>
                        <div class="${SCRIPT_PREFIX}slider-container">
                            <input type="range" id="${SCRIPT_PREFIX}font-size-slider" 
                                   min="12" max="24" value="16" step="1">
                            <div class="${SCRIPT_PREFIX}slider-value" id="${SCRIPT_PREFIX}size-value">16px</div>
                        </div>
                    </div>
                </div>

                <div class="${SCRIPT_PREFIX}form-group">
                    <label for="${SCRIPT_PREFIX}local-font-input">Or Enter Local Font Name</label>
                    <input type="text" id="${SCRIPT_PREFIX}local-font-input" 
                           placeholder="e.g., Arial, Verdana, Times New Roman">
                </div>

                <div class="${SCRIPT_PREFIX}preview-container">
                    <p class="${SCRIPT_PREFIX}preview-text" id="${SCRIPT_PREFIX}preview-text">
                        The quick brown fox jumps over the lazy dog. 1234567890
                    </p>
                </div>

                <div class="${SCRIPT_PREFIX}button-group">
                    <button class="${SCRIPT_PREFIX}apply-button" id="${SCRIPT_PREFIX}apply-font-button">
                        Apply Font
                    </button>
                    <button class="${SCRIPT_PREFIX}reset-button" id="${SCRIPT_PREFIX}reset-font-button">
                        Reset
                    </button>
                </div>

                <div class="${SCRIPT_PREFIX}settings-group">
                    <div class="${SCRIPT_PREFIX}checkbox-container">
                        <input type="checkbox" id="${SCRIPT_PREFIX}show-button-checkbox">
                        <label for="${SCRIPT_PREFIX}show-button-checkbox">Show Fonts button in menu</label>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(fontPanel);

        // Get references
        googleFontSelect = fontPanel.querySelector(`#${SCRIPT_PREFIX}google-font-select`);
        localFontInput = fontPanel.querySelector(`#${SCRIPT_PREFIX}local-font-input`);
        fontWeightSelect = fontPanel.querySelector(`#${SCRIPT_PREFIX}font-weight-select`);
        fontSizeSlider = fontPanel.querySelector(`#${SCRIPT_PREFIX}font-size-slider`);
        previewText = fontPanel.querySelector(`#${SCRIPT_PREFIX}preview-text`);
        showButtonCheckbox = fontPanel.querySelector(`#${SCRIPT_PREFIX}show-button-checkbox`);

        // Event listeners
        fontPanel.querySelector(`.${SCRIPT_PREFIX}close-button`).addEventListener('click', () => toggleFontPanel(false));
        fontPanel.querySelector(`#${SCRIPT_PREFIX}apply-font-button`).addEventListener('click', handleApplyFont);
        fontPanel.querySelector(`#${SCRIPT_PREFIX}reset-font-button`).addEventListener('click', handleResetFont);
        showButtonCheckbox.addEventListener('change', handleShowButtonToggle);
        
        // Live preview listeners
        googleFontSelect.addEventListener('change', updatePreview);
        localFontInput.addEventListener('input', updatePreview);
        fontWeightSelect.addEventListener('change', updatePreview);
        fontSizeSlider.addEventListener('input', handleFontSizeChange);

        // Initialize
        showButtonCheckbox.checked = showMenuButtonSetting;
        fontWeightSelect.value = currentFontSetting.weight || '400';
        updateFontSizeDisplay();
    }

    function updatePreview() {
        const googleFont = googleFontSelect.value;
        const localFont = localFontInput.value.trim();
        const weight = fontWeightSelect.value;
        const size = fontSizeSlider.value;

        let fontFamily = '';
        if (googleFont) {
            loadGoogleFont(googleFont);
            fontFamily = `"${googleFont}", sans-serif`;
            localFontInput.value = ''; // Clear other input
        } else if (localFont) {
            fontFamily = `"${localFont}", sans-serif`;
            googleFontSelect.value = ''; // Clear other input
        }

        if (fontFamily) {
            previewText.style.fontFamily = fontFamily;
            previewText.style.fontWeight = weight;
            previewText.style.fontSize = size + 'px';
        }
    }

    function handleFontSizeChange() {
        updateFontSizeDisplay();
        updatePreview();
    }

    function updateFontSizeDisplay() {
        const sizeValue = fontPanel.querySelector(`#${SCRIPT_PREFIX}size-value`);
        sizeValue.textContent = fontSizeSlider.value + 'px';
    }

    function toggleFontPanel(forceShow) {
        fontPanelVisible = (forceShow !== undefined) ? forceShow : !fontPanelVisible;
        const overlay = document.querySelector(`.${SCRIPT_PREFIX}overlay`);
        
        fontPanel.classList.toggle('visible', fontPanelVisible);
        overlay.classList.toggle('visible', fontPanelVisible);
        
        if (fontPanelVisible) {
            // Reflect current settings
            if (currentFontSetting.name) {
                if (currentFontSetting.isGoogle) {
                    googleFontSelect.value = currentFontSetting.name;
                    localFontInput.value = '';
                } else if (currentFontSetting.custom) {
                    localFontInput.value = currentFontSetting.name;
                    googleFontSelect.value = '';
                }
            }
            fontWeightSelect.value = currentFontSetting.weight || '400';
            updatePreview();
        }
    }

    function loadGoogleFont(fontName) {
        if (activeGoogleFontLink) {
            activeGoogleFontLink.remove();
            activeGoogleFontLink = null;
        }
        if (!fontName) return;

        const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;500;600;700;800&display=swap`;
        const link = document.createElement('link');
        link.href = fontUrl;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        activeGoogleFontLink = link;
    }

    function applyFont(fontName, weight = '400', isGoogleFont = false, isCustom = false) {
        const size = fontSizeSlider ? fontSizeSlider.value : '16';
        
        if (!fontName) {
            // Reset
            document.body.style.fontFamily = '';
            document.body.style.fontWeight = '';
            document.body.style.fontSize = '';
            if (activeGoogleFontLink) {
                activeGoogleFontLink.remove();
                activeGoogleFontLink = null;
            }
            currentFontSetting = { name: '', weight: '400', isGoogle: false, custom: false };
        } else {
            if (isGoogleFont) {
                loadGoogleFont(fontName);
            }
            
            // Apply font with enhanced CSS
            const fontFamily = `"${fontName}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
            document.body.style.fontFamily = fontFamily;
            document.body.style.fontWeight = weight;
            document.body.style.fontSize = size + 'px';
            
            // Also apply to common text elements for better coverage
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    font-family: ${fontFamily} !important;
                    font-weight: ${weight} !important;
                }
                input, textarea, select, button {
                    font-family: ${fontFamily} !important;
                }
            `;
            document.head.appendChild(style);
            
            currentFontSetting = { 
                name: fontName, 
                weight: weight, 
                size: size,
                isGoogle: isGoogleFont, 
                custom: isCustom 
            };
        }
        storage.setItem('currentFont', currentFontSetting);
    }

    function updateMenuButtonVisibility() {
        if (menuButtonContainer) {
            menuButtonContainer.style.display = showMenuButtonSetting ? '' : 'none';
        } else if (menuButton) {
            menuButton.style.display = showMenuButtonSetting ? '' : 'none';
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
            applyFont(selectedGoogleFont, selectedWeight, true, false);
        } else if (enteredLocalFont) {
            applyFont(enteredLocalFont, selectedWeight, false, true);
        } else {
            // Show brief feedback
            const button = document.querySelector(`#${SCRIPT_PREFIX}apply-font-button`);
            const originalText = button.textContent;
            button.textContent = 'Select a font first!';
            button.style.background = '#ef4444';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }
    }

    function handleResetFont() {
        applyFont(null);
        googleFontSelect.value = '';
        localFontInput.value = '';
        fontWeightSelect.value = '400';
        fontSizeSlider.value = '16';
        updateFontSizeDisplay();
        updatePreview();
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
    }

    // --- Initialization ---
    function init() {
        console.log(`${SCRIPT_PREFIX}Initializing Font Changer Pro...`);
        
        injectStyles();
        createFontPanel();
        
        // Delay button creation slightly for better integration
        setTimeout(() => {
            createMenuButton();
        }, 500);

        // Apply saved font
        if (currentFontSetting.name) {
            applyFont(
                currentFontSetting.name, 
                currentFontSetting.weight || '400',
                currentFontSetting.isGoogle, 
                currentFontSetting.custom
            );
        }

        document.addEventListener('keydown', handleKeyboardShortcut);
        console.log(`${SCRIPT_PREFIX}Font Changer Pro initialized successfully!`);
    }

    // Enhanced initialization with better timing
    function waitForTypingMind() {
        // Check if TypingMind interface is loaded
        const checkInterval = setInterval(() => {
            const typingMindElements = document.querySelector('nav, header, [role="navigation"], .sidebar, .menu');
            if (typingMindElements || document.readyState === 'complete') {
                clearInterval(checkInterval);
                init();
            }
        }, 100);
        
        // Fallback timeout
        setTimeout(() => {
            clearInterval(checkInterval);
            if (!menuButton) {
                console.log(`${SCRIPT_PREFIX}Fallback initialization...`);
                init();
            }
        }, 5000);
    }

    // Smart initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForTypingMind);
    } else {
        waitForTypingMind();
    }

    // Additional mutation observer for dynamic content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && !menuButton) {
                // If menu button hasn't been created yet and new elements are added
                const hasNavigation = document.querySelector('nav, header, [role="navigation"]');
                if (hasNavigation) {
                    setTimeout(createMenuButton, 100);
                }
            }
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Cleanup observer after successful initialization
    setTimeout(() => {
        if (menuButton) {
            observer.disconnect();
        }
    }, 10000);

})();
