// TypingMind Sidebar Customizer
// Version: 1.0.0
// Author: Expert JS Developer
// GitHub: Add your GitHub URL here
// Description: Adds a customization button to TypingMind for changing sidebar colors and darkness

(function() {
  'use strict';
  
  // Configuration
  const config = {
    buttonPosition: 'bottom', // 'top' or 'bottom' of the sidebar
    defaultColor: '#202123',  // Default sidebar color
    darkModeOpacity: 0.9,     // Opacity for dark mode
    lightModeOpacity: 0.3,    // Opacity for light mode
    transitionSpeed: '0.3s',  // Transition speed for color changes
    buttonText: 'Customize Sidebar', // Button text
    colorPresets: [
      { name: 'Midnight Blue', color: '#0f2027' },
      { name: 'Forest Green', color: '#134e5e' },
      { name: 'Deep Purple', color: '#321a47' },
      { name: 'Dark Red', color: '#3c1518' },
      { name: 'Charcoal', color: '#2c3e50' }
    ]
  };
  
  // Style for the customizer
  const styles = `
    .sidebar-customizer {
      position: absolute;
      ${config.buttonPosition === 'top' ? 'top: 10px;' : 'bottom: 10px;'}
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
    }
    
    .customizer-button {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }
    
    .customizer-button:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    .customizer-panel {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 10px;
      background-color: #2d2d2d;
      border-radius: 8px;
      padding: 15px;
      width: 250px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
      display: none;
      color: white;
      font-size: 14px;
    }
    
    .customizer-panel.visible {
      display: block;
    }
    
    .customizer-section {
      margin-bottom: 15px;
    }
    
    .customizer-section:last-child {
      margin-bottom: 0;
    }
    
    .customizer-section-title {
      font-weight: bold;
      margin-bottom: 8px;
      color: #eeeeee;
      font-size: 15px;
    }
    
    .color-picker-container {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .color-picker-label {
      margin-right: 10px;
      min-width: 70px;
    }
    
    input[type="color"] {
      -webkit-appearance: none;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    input[type="color"]::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    
    input[type="color"]::-webkit-color-swatch {
      border: none;
      border-radius: 4px;
    }
    
    .color-presets {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }
    
    .color-preset {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color 0.2s;
    }
    
    .color-preset:hover {
      border-color: white;
    }
    
    .color-preset-tooltip {
      position: relative;
    }
    
    .color-preset-tooltip:hover::after {
      content: attr(data-name);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: black;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      margin-bottom: 5px;
    }
    
    .slider-container {
      display: flex;
      flex-direction: column;
    }
    
    .slider-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    
    .slider-value {
      font-weight: bold;
    }
    
    input[type="range"] {
      width: 100%;
      margin: 8px 0;
    }
    
    .reset-button {
      background-color: #555;
      color: white;
      border: none;
      padding: 6px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      margin-top: 10px;
      transition: background-color 0.2s;
    }
    
    .reset-button:hover {
      background-color: #666;
    }
  `;
  
  // Initialize current settings
  let currentSettings = {
    color: config.defaultColor,
    darkness: 0.5 // Middle value by default
  };
  
  // Function to inject CSS
  function injectStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }
  
  // Function to create the customizer UI
  function createCustomizerUI() {
    // Create the customizer container
    const customizer = document.createElement('div');
    customizer.className = 'sidebar-customizer';
    
    // Create the button
    const button = document.createElement('button');
    button.className = 'customizer-button';
    button.textContent = config.buttonText;
    
    // Create the panel
    const panel = document.createElement('div');
    panel.className = 'customizer-panel';
    
    // Color picker section
    const colorSection = document.createElement('div');
    colorSection.className = 'customizer-section';
    
    const colorTitle = document.createElement('div');
    colorTitle.className = 'customizer-section-title';
    colorTitle.textContent = 'Sidebar Color';
    
    const colorPickerContainer = document.createElement('div');
    colorPickerContainer.className = 'color-picker-container';
    
    const colorPickerLabel = document.createElement('div');
    colorPickerLabel.className = 'color-picker-label';
    colorPickerLabel.textContent = 'Pick a color:';
    
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = currentSettings.color;
    
    colorPickerContainer.appendChild(colorPickerLabel);
    colorPickerContainer.appendChild(colorPicker);
    
    // Color presets
    const colorPresetsContainer = document.createElement('div');
    colorPresetsContainer.className = 'customizer-section';
    
    const colorPresetsTitle = document.createElement('div');
    colorPresetsTitle.className = 'customizer-section-title';
    colorPresetsTitle.textContent = 'Color Presets';
    
    const colorPresets = document.createElement('div');
    colorPresets.className = 'color-presets';
    
    config.colorPresets.forEach(preset => {
      const presetElement = document.createElement('div');
      presetElement.className = 'color-preset color-preset-tooltip';
      presetElement.style.backgroundColor = preset.color;
      presetElement.setAttribute('data-name', preset.name);
      presetElement.setAttribute('data-color', preset.color);
      
      presetElement.addEventListener('click', () => {
        colorPicker.value = preset.color;
        currentSettings.color = preset.color;
        applySettings();
      });
      
      colorPresets.appendChild(presetElement);
    });
    
    // Darkness slider section
    const darknessSection = document.createElement('div');
    darknessSection.className = 'customizer-section';
    
    const darknessTitle = document.createElement('div');
    darknessTitle.className = 'customizer-section-title';
    darknessTitle.textContent = 'Sidebar Darkness';
    
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-container';
    
    const sliderLabel = document.createElement('div');
    sliderLabel.className = 'slider-label';
    
    const sliderLabelText = document.createElement('span');
    sliderLabelText.textContent = 'Darkness level:';
    
    const sliderValue = document.createElement('span');
    sliderValue.className = 'slider-value';
    sliderValue.textContent = `${Math.round(currentSettings.darkness * 100)}%`;
    
    sliderLabel.appendChild(sliderLabelText);
    sliderLabel.appendChild(sliderValue);
    
    const darknessSlider = document.createElement('input');
    darknessSlider.type = 'range';
    darknessSlider.min = '0';
    darknessSlider.max = '1';
    darknessSlider.step = '0.01';
    darknessSlider.value = currentSettings.darkness;
    
    // Reset button
    const resetButton = document.createElement('button');
    resetButton.className = 'reset-button';
    resetButton.textContent = 'Reset to Default';
    
    // Add elements to their respective containers
    sliderContainer.appendChild(sliderLabel);
    sliderContainer.appendChild(darknessSlider);
    
    colorSection.appendChild(colorTitle);
    colorSection.appendChild(colorPickerContainer);
    
    colorPresetsContainer.appendChild(colorPresetsTitle);
    colorPresetsContainer.appendChild(colorPresets);
    
    darknessSection.appendChild(darknessTitle);
    darknessSection.appendChild(sliderContainer);
    
    panel.appendChild(colorSection);
    panel.appendChild(colorPresetsContainer);
    panel.appendChild(darknessSection);
    panel.appendChild(resetButton);
    
    customizer.appendChild(button);
    customizer.appendChild(panel);
    
    // Add event listeners
    button.addEventListener('click', () => {
      panel.classList.toggle('visible');
    });
    
    // Close panel when clicking outside
    document.addEventListener('click', (event) => {
      if (!customizer.contains(event.target)) {
        panel.classList.remove('visible');
      }
    });
    
    colorPicker.addEventListener('input', (event) => {
      currentSettings.color = event.target.value;
      applySettings();
    });
    
    darknessSlider.addEventListener('input', (event) => {
      currentSettings.darkness = parseFloat(event.target.value);
      sliderValue.textContent = `${Math.round(currentSettings.darkness * 100)}%`;
      applySettings();
    });
    
    resetButton.addEventListener('click', () => {
      currentSettings = {
        color: config.defaultColor,
        darkness: 0.5
      };
      
      colorPicker.value = currentSettings.color;
      darknessSlider.value = currentSettings.darkness;
      sliderValue.textContent = `${Math.round(currentSettings.darkness * 100)}%`;
      
      applySettings();
    });
    
    return customizer;
  }
  
  // Function to apply settings to the sidebar
  function applySettings() {
    // Find the sidebar element
    const sidebar = document.querySelector('.sidebar, #sidebar, [role="navigation"], .navigation-sidebar');
    
    if (sidebar) {
      // Calculate opacity based on darkness level
      const opacity = 1 - (currentSettings.darkness * (config.darkModeOpacity - config.lightModeOpacity) + config.lightModeOpacity);
      
      // Apply color and opacity
      sidebar.style.backgroundColor = currentSettings.color;
      sidebar.style.color = `rgba(255, 255, 255, ${opacity})`;
      
      // Set transition for smooth color changes
      sidebar.style.transition = `background-color ${config.transitionSpeed}, color ${config.transitionSpeed}`;
      
      // Save settings to localStorage
      saveSettings();
    }
  }
  
  // Function to save settings to localStorage
  function saveSettings() {
    try {
      localStorage.setItem('typingmind-sidebar-customizer', JSON.stringify(currentSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }
  
  // Function to load settings from localStorage
  function loadSettings() {
    try {
      const savedSettings = localStorage.getItem('typingmind-sidebar-customizer');
      if (savedSettings) {
        currentSettings = JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }
  
  // Function to initialize the extension
  function initializeExtension() {
    // Load saved settings if available
    loadSettings();
    
    // Inject styles
    injectStyles();
    
    // Wait for the sidebar to be loaded
    const checkForSidebar = setInterval(() => {
      const sidebar = document.querySelector('.sidebar, #sidebar, [role="navigation"], .navigation-sidebar');
      
      if (sidebar) {
        clearInterval(checkForSidebar);
        
        // Create and inject the customizer UI
        const customizer = createCustomizerUI();
        sidebar.appendChild(customizer);
        
        // Apply the current settings
        applySettings();
      }
    }, 500);
    
    // Stop checking after 10 seconds to prevent infinite loop
    setTimeout(() => {
      clearInterval(checkForSidebar);
    }, 10000);
  }
  
  // Initialize the extension
  initializeExtension();
})();
