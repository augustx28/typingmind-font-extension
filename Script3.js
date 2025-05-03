(function() {
  "use strict";

  const settingsKeys = {
    customFontUrl: "tweak_customFontUrl",
    customFontFamily: "tweak_customFontFamily",
    customFontSize: "tweak_customFontSize",
    showModalButton: "tweak_showModalButton"
  };

  const consolePrefix = "TypingMind Font Customizer:";
  let originalPageTitle = document.title;

  // Helper to clean stored values
  const cleanValue = (value) => {
    if (!value) return null;
    let cleaned = value.trim();
    if (
      (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("'") && cleaned.endsWith("'"))
    ) {
      cleaned = cleaned.slice(1, -1);
    }
    return cleaned;
  };

  function getSetting(key, defaultValue = false) {
    const value = localStorage.getItem(key);
    return value === null ? defaultValue : JSON.parse(value);
  }

  // Apply the custom font based on user settings
  function applyCustomFont() {
    let customFontUrl = localStorage.getItem(settingsKeys.customFontUrl);
    let customFontFamily = localStorage.getItem(settingsKeys.customFontFamily);
    let customFontSize = localStorage.getItem(settingsKeys.customFontSize);
    const styleId = "tweak-custom-font-style";
    let styleElement = document.getElementById(styleId);
    let cssRules = [];

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    const cleanedUrl = cleanValue(customFontUrl);
    const cleanedFamily = cleanValue(customFontFamily);
    const cleanedSize = cleanValue(customFontSize);

    // Import Google Font if URL is provided
    if (cleanedUrl) {
      if (
        cleanedUrl.startsWith("http://") ||
        cleanedUrl.startsWith("https://")
      ) {
        cssRules.push(`@import url('${cleanedUrl}');`);
      } else {
        console.warn(
          `${consolePrefix} Invalid custom font URL provided: ${cleanedUrl}`
        );
      }
    }

    // Apply font family to chat space
    let chatSpaceRules = [];
    if (cleanedFamily && cleanedFamily.trim() !== "") {
      let fontFamilyValue = cleanedFamily.trim();
      if (fontFamilyValue.includes(" ")) {
        fontFamilyValue = `'${fontFamilyValue}'`;
      }
      chatSpaceRules.push(`  font-family: ${fontFamilyValue} !important;`);
    }

    // Apply font size to chat space
    if (
      cleanedSize &&
      !isNaN(parseInt(cleanedSize, 10)) &&
      parseInt(cleanedSize, 10) > 0
    ) {
      chatSpaceRules.push(`  font-size: ${cleanedSize}px !important;`);
    }

    // Build CSS for chat space
    if (chatSpaceRules.length > 0) {
      const rulesString = chatSpaceRules.join("\n");
      cssRules.push(`
        /* Apply font to main chat area */
        [data-element-id="chat-space-middle-part"] .prose,
        [data-element-id="chat-space-middle-part"] .prose-sm,
        [data-element-id="chat-space-middle-part"] .text-sm {
        ${rulesString}
        }
      `);
    }

    // Set base font size on container
    if (
      cleanedSize &&
      !isNaN(parseInt(cleanedSize, 10)) &&
      parseInt(cleanedSize, 10) > 0
    ) {
      cssRules.push(`
        [data-element-id="chat-space-middle-part"] {
          font-size: ${cleanedSize}px !important; 
        }
      `);
    }

    // Apply font to text elements
    let textElementRules = [];
    if (cleanedFamily && cleanedFamily.trim() !== "") {
      let fontFamilyValue = cleanedFamily.trim();
      if (fontFamilyValue.includes(" ")) {
        fontFamilyValue = `'${fontFamilyValue}'`;
      }
      textElementRules.push(`  font-family: ${fontFamilyValue} !important;`);
    }

    if (
      cleanedSize &&
      !isNaN(parseInt(cleanedSize, 10)) &&
      parseInt(cleanedSize, 10) > 0
    ) {
      textElementRules.push(`  font-size: ${cleanedSize}px !important;`);
    }

    // Build CSS for text elements
    if (textElementRules.length > 0) {
      const rulesString = textElementRules.join("\n");
      cssRules.push(`
        /* Apply font to all text elements in the chat */
        [data-element-id="chat-space-middle-part"] .prose *,
        [data-element-id="chat-space-middle-part"] .prose-sm *,
        [data-element-id="chat-space-middle-part"] .text-sm * {
        ${rulesString}
        }
      `);
    }

    // Apply the updated styles
    const newStyleContent = cssRules.join("\n");
    if (styleElement.textContent !== newStyleContent) {
      styleElement.textContent = newStyleContent;
    }
  }

  let modalOverlay = null;
  let modalElement = null;
  let feedbackElement = null;

  // Create the settings modal
  function createSettingsModal() {
    if (document.getElementById("tweak-modal-overlay")) return;
    
    // CSS for the modal
    const styles = `
      #tweak-modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: none; /* Hidden by default */
        justify-content: center; align-items: center; z-index: 10001;
        font-family: sans-serif;
      }
      #tweak-modal {
        background-color: #252525;
        color: #f0f0f0;
        padding: 25px 35px;
        border-radius: 8px;
        min-width: 350px;
        max-width: 500px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.6);
        position: relative;
        border: 1px solid #4a4a4a;
      }
      #tweak-modal h2 {
          margin-top: 0; margin-bottom: 20px;
          color: #ffffff;
          font-size: 1.5em;
          font-weight: 600;
          text-align: center;
       }
      #tweak-modal-feedback {
          font-size: 0.9em;
          color: #a0cfff;
          margin-top: 15px;
          margin-bottom: 5px;
          min-height: 1.2em;
          text-align: center;
          font-weight: 500;
       }

      .tweak-settings-section {
        background-color: #333333;
        padding: 20px 25px;
        border-radius: 6px;
        margin-top: 10px;
        border: 1px solid #484848;
      }

      .tweak-checkbox-item { margin-bottom: 18px; display: flex; align-items: center; }
      .tweak-checkbox-item:last-child { margin-bottom: 5px; }

      .tweak-checkbox-item input[type='checkbox'] {
          margin-right: 15px;
          transform: scale(1.2);
          cursor: pointer;
          accent-color: #0d6efd;
          background-color: #555;
          border-radius: 3px;
          border: 1px solid #777;
          appearance: none;
          -webkit-appearance: none;
          width: 1.2em;
          height: 1.2em;
          position: relative;
       }
       .tweak-checkbox-item input[type='checkbox']::before {
            content: "✓";
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 1em;
            font-weight: bold;
            color: white;
            transition: transform 0.1s ease-in-out;
            line-height: 1;
       }
       .tweak-checkbox-item input[type='checkbox']:checked {
            background-color: #0d6efd;
            border-color: #0d6efd;
       }
       .tweak-checkbox-item input[type='checkbox']:checked::before {
            transform: translate(-50%, -50%) scale(1.2);
       }

      .tweak-checkbox-item label {
          cursor: pointer;
          flex-grow: 1;
          font-size: 1em;
          color: #e0e0e0;
      }

      .tweak-modal-footer {
        margin-top: 25px;
        padding-top: 15px;
        border-top: 1px solid #4a4a4a;
        display: flex;
        justify-content: flex-end;
      }

      #tweak-modal-bottom-close {
        background-color: #dc3545;
        color: white;
        border: 1px solid #dc3545;
        padding: 8px 18px;
        border-radius: 6px;
        font-size: 0.95em;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s ease, border-color 0.2s ease;
      }
      #tweak-modal-bottom-close:hover {
        background-color: #c82333;
        border-color: #bd2130;
      }

      .tweak-text-item {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
      }
      .tweak-text-item label {
          color: #e0e0e0;
          font-size: 1em;
          white-space: nowrap;
      }
      .tweak-text-input-wrapper {
           display: flex;
           align-items: center;
           width: 100%;
      }
      .tweak-text-item input[type='text'], .tweak-text-item input[type='number'] {
          flex-grow: 1;
          padding: 8px 10px;
          border: 1px solid #777;
          margin-right: 10px;
          border-radius: 4px;
          background-color: #555;
          color: #f0f0f0;
          font-size: 0.9em;
      }
      .tweak-text-item input[type='text']::placeholder,
      .tweak-text-item input[type='number']::placeholder {
         color: #f0f0f0;
         opacity: 0.7;
      }
      
      .tweak-reset-button {
         background-color: #6c757d;
         color: white;
         border: 1px solid #6c757d;
         padding: 4px 10px;
         border-radius: 4px;
         font-size: 0.85em;
         font-weight: 500;
         cursor: pointer;
         transition: background-color 0.2s ease, border-color 0.2s ease;
      }
      .tweak-reset-button:hover {
         background-color: #5a6268;
         border-color: #545b62;
      }

      #tweak-modal-scrollable-content {
        max-height: calc(80vh - 200px);
        overflow-y: auto;
        overflow-x: hidden;
        padding-right: 15px;
        margin-right: -15px;
      }

      #tweak-modal-scrollable-content::-webkit-scrollbar {
        width: 8px;
      }
      #tweak-modal-scrollable-content::-webkit-scrollbar-track {
        background: #444;
        border-radius: 4px;
      }
      #tweak-modal-scrollable-content::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 4px;
        border: 2px solid #444;
      }
      #tweak-modal-scrollable-content::-webkit-scrollbar-thumb:hover {
        background-color: #aaa;
      }
      
      .font-info {
        color: #adb5bd;
        font-size: 0.85em;
        margin-top: 5px;
        margin-bottom: 15px;
      }
    `;
    
    // Create and add stylesheet
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    
    // Create modal overlay
    modalOverlay = document.createElement("div");
    modalOverlay.id = "tweak-modal-overlay";
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        toggleModal(false);
      }
    });
    
    // Create modal
    modalElement = document.createElement("div");
    modalElement.id = "tweak-modal";
    
    // Create modal header
    const header = document.createElement("h2");
    header.textContent = "Font Customizer";
    
    // Create feedback element
    feedbackElement = document.createElement("p");
    feedbackElement.id = "tweak-modal-feedback";
    feedbackElement.textContent = " ";
    
    // Create scrollable content area
    const scrollableContent = document.createElement("div");
    scrollableContent.id = "tweak-modal-scrollable-content";

    // Create font settings container
    const fontSettingsContainer = document.createElement("div");
    fontSettingsContainer.className = "tweak-settings-section";
    
    // Create font description
    const fontDescription = document.createElement("p");
    fontDescription.innerHTML = `
      <strong>Customize fonts across TypingMind.</strong> You can use Google Fonts 
      or any custom web font. Make sure to include the full URL with weights.
    `;
    fontDescription.className = "font-info";
    fontSettingsContainer.appendChild(fontDescription);
    
    // Google Fonts helper info
    const googleFontInfo = document.createElement("p");
    googleFontInfo.innerHTML = `
      <strong>Google Fonts Example:</strong> 
      <code>https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap</code>
    `;
    googleFontInfo.className = "font-info";
    fontSettingsContainer.appendChild(googleFontInfo);
    
    // Custom Font URL input
    const customFontSection = document.createElement("div");
    customFontSection.className = "tweak-text-item";
    
    const fontLabel = document.createElement("label");
    fontLabel.htmlFor = "tweak_customFontUrl_input";
    fontLabel.textContent = "Font URL (Google Fonts or other web font):";
    
    const fontInputWrapper = document.createElement("div");
    fontInputWrapper.className = "tweak-text-input-wrapper";
    
    const fontInput = document.createElement("input");
    fontInput.type = "text";
    fontInput.id = "tweak_customFontUrl_input";
    fontInput.placeholder = "https://fonts.googleapis.com/css2?family=...";
    
    fontInput.addEventListener("input", (event) => {
      saveSetting(settingsKeys.customFontUrl, event.target.value || null);
      if (feedbackElement) feedbackElement.textContent = "Settings saved.";
    });
    
    const clearFontButton = document.createElement("button");
    clearFontButton.textContent = "Clear";
    clearFontButton.className = "tweak-reset-button";
    clearFontButton.type = "button";
    clearFontButton.addEventListener("click", () => {
      saveSetting(settingsKeys.customFontUrl, null);
      fontInput.value = "";
      if (feedbackElement) feedbackElement.textContent = "Settings saved.";
    });
    
    fontInputWrapper.appendChild(fontInput);
    fontInputWrapper.appendChild(clearFontButton);
    customFontSection.appendChild(fontLabel);
    customFontSection.appendChild(fontInputWrapper);
    
    // Font Family input
    const fontFamilySection = document.createElement("div");
    fontFamilySection.className = "tweak-text-item";
    
    const fontFamilyLabel = document.createElement("label");
    fontFamilyLabel.htmlFor = "tweak_customFontFamily_input";
    fontFamilyLabel.textContent = "Font Family Name:";
    
    const fontFamilyInputWrapper = document.createElement("div");
    fontFamilyInputWrapper.className = "tweak-text-input-wrapper";
    
    const fontFamilyInput = document.createElement("input");
    fontFamilyInput.type = "text";
    fontFamilyInput.id = "tweak_customFontFamily_input";
    fontFamilyInput.placeholder = "Roboto, Inter, etc.";
    
    fontFamilyInput.addEventListener("input", (event) => {
      saveSetting(settingsKeys.customFontFamily, event.target.value || null);
      if (feedbackElement) feedbackElement.textContent = "Settings saved.";
    });
    
    const clearFontFamilyButton = document.createElement("button");
    clearFontFamilyButton.textContent = "Clear";
    clearFontFamilyButton.className = "tweak-reset-button";
    clearFontFamilyButton.type = "button";
    clearFontFamilyButton.addEventListener("click", () => {
      saveSetting(settingsKeys.customFontFamily, null);
      fontFamilyInput.value = "";
      if (feedbackElement) feedbackElement.textContent = "Settings saved.";
    });
    
    fontFamilyInputWrapper.appendChild(fontFamilyInput);
    fontFamilyInputWrapper.appendChild(clearFontFamilyButton);
    fontFamilySection.appendChild(fontFamilyLabel);
    fontFamilySection.appendChild(fontFamilyInputWrapper);
    
    // Font Size input
    const fontSizeSection = document.createElement("div");
    fontSizeSection.className = "tweak-text-item";
    
    const fontSizeLabel = document.createElement("label");
    fontSizeLabel.htmlFor = "tweak_customFontSize_input";
    fontSizeLabel.textContent = "Font Size (px):";
    
    const fontSizeInputWrapper = document.createElement("div");
    fontSizeInputWrapper.className = "tweak-text-input-wrapper";
    
    const fontSizeInput = document.createElement("input");
    fontSizeInput.type = "number";
    fontSizeInput.id = "tweak_customFontSize_input";
    fontSizeInput.placeholder = "16";
    fontSizeInput.min = "8";
    fontSizeInput.step = "1";
    
    fontSizeInput.addEventListener("input", (event) => {
      const valueToSave = event.target.value
        ? parseInt(event.target.value, 10)
        : null;
      if (
        valueToSave !== null &&
        valueToSave >= parseInt(fontSizeInput.min, 10)
      ) {
        saveSetting(settingsKeys.customFontSize, valueToSave);
      } else if (valueToSave === null) {
        saveSetting(settingsKeys.customFontSize, null);
      }
      if (feedbackElement) feedbackElement.textContent = "Settings saved.";
    });
    
    const clearFontSizeButton = document.createElement("button");
    clearFontSizeButton.textContent = "Clear";
    clearFontSizeButton.className = "tweak-reset-button";
    clearFontSizeButton.type = "button";
    clearFontSizeButton.addEventListener("click", () => {
      saveSetting(settingsKeys.customFontSize, null);
      fontSizeInput.value = "";
      if (feedbackElement) feedbackElement.textContent = "Settings saved.";
    });
    
    fontSizeInputWrapper.appendChild(fontSizeInput);
    fontSizeInputWrapper.appendChild(clearFontSizeButton);
    fontSizeSection.appendChild(fontSizeLabel);
    fontSizeSection.appendChild(fontSizeInputWrapper);
    
    // Show Modal Button option
    const showButtonSection = document.createElement("div");
    showButtonSection.className = "tweak-checkbox-item";
    
    const showButtonCheckbox = document.createElement("input");
    showButtonCheckbox.type = "checkbox";
    showButtonCheckbox.id = settingsKeys.showModalButton;
    showButtonCheckbox.name = settingsKeys.showModalButton;
    showButtonCheckbox.checked = getSetting(settingsKeys.showModalButton, true);
    
    showButtonCheckbox.addEventListener("change", (event) =>
      saveSetting(settingsKeys.showModalButton, event.target.checked)
    );
    
    const showButtonLabel = document.createElement("label");
    showButtonLabel.htmlFor = settingsKeys.showModalButton;
    showButtonLabel.textContent = "Show Font Customizer button in menu";
    
    showButtonSection.appendChild(showButtonCheckbox);
    showButtonSection.appendChild(showButtonLabel);
    
    // Add all font settings elements
    fontSettingsContainer.appendChild(customFontSection);
    fontSettingsContainer.appendChild(fontFamilySection);
    fontSettingsContainer.appendChild(fontSizeSection);
    fontSettingsContainer.appendChild(document.createElement("hr"));
    fontSettingsContainer.appendChild(showButtonSection);
    
    // Add font settings to scrollable content
    scrollableContent.appendChild(fontSettingsContainer);
    
    // Create modal footer
    const footer = document.createElement("div");
    footer.className = "tweak-modal-footer";
    
    const closeButtonBottom = document.createElement("button");
    closeButtonBottom.id = "tweak-modal-bottom-close";
    closeButtonBottom.textContent = "Close";
    closeButtonBottom.addEventListener("click", () => toggleModal(false));
    
    footer.appendChild(closeButtonBottom);
    
    // Assemble modal
    modalElement.appendChild(header);
    modalElement.appendChild(feedbackElement);
    modalElement.appendChild(scrollableContent);
    modalElement.appendChild(footer);
    
    modalOverlay.appendChild(modalElement);
    document.body.appendChild(modalOverlay);
  }

  // Load saved settings into the modal
  function loadSettingsIntoModal() {
    if (!modalElement) return;
    
    // Load checkbox setting
    const showButtonCheckbox = document.getElementById(settingsKeys.showModalButton);
    if (showButtonCheckbox) {
      showButtonCheckbox.checked = getSetting(settingsKeys.showModalButton, true);
    }
    
    // Load font URL
    const fontInput = document.getElementById("tweak_customFontUrl_input");
    if (fontInput) {
      const storedFontUrl = localStorage.getItem(settingsKeys.customFontUrl) || "";
      fontInput.value = cleanValue(storedFontUrl) || "";
    }
    
    // Load font family
    const fontFamilyInput = document.getElementById("tweak_customFontFamily_input");
    if (fontFamilyInput) {
      const storedFontFamily = localStorage.getItem(settingsKeys.customFontFamily) || "";
      fontFamilyInput.value = cleanValue(storedFontFamily) || "";
    }
    
    // Load font size
    const fontSizeInput = document.getElementById("tweak_customFontSize_input");
    if (fontSizeInput) {
      const storedSizeString = localStorage.getItem(settingsKeys.customFontSize);
      let sizeToSet = "";
      if (storedSizeString && storedSizeString !== "null") {
        try {
          const parsedSize = JSON.parse(storedSizeString);
          if (typeof parsedSize === "number" && parsedSize > 0) {
            sizeToSet = parsedSize;
          }
        } catch (e) {
          console.error(`${consolePrefix} Error parsing stored font size:`, e);
        }
      }
      fontSizeInput.value = sizeToSet;
    }
    
    if (feedbackElement) feedbackElement.textContent = " ";
  }

  // Save setting to localStorage
  function saveSetting(key, value) {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }

      if (feedbackElement) {
        feedbackElement.textContent = "Settings saved.";
      }
      
      if (
        key === settingsKeys.customFontUrl ||
        key === settingsKeys.customFontFamily ||
        key === settingsKeys.customFontSize
      ) {
        applyCustomFont();
      }
    } catch (error) {
      console.error(`${consolePrefix} Error saving setting ${key}:`, error);
      if (feedbackElement) {
        feedbackElement.textContent = "Error saving settings.";
      }
    }
  }

  // Toggle modal visibility
  function toggleModal(forceState) {
    if (!modalOverlay) {
      console.warn(`${consolePrefix} Modal overlay not found.`);
      return;
    }
    
    const currentComputedDisplay = window.getComputedStyle(modalOverlay).display;
    const shouldShow = 
      typeof forceState === "boolean" 
        ? forceState 
        : currentComputedDisplay === "none";

    if (shouldShow) {
      loadSettingsIntoModal();
      modalOverlay.style.display = "flex";
    } else {
      modalOverlay.style.display = "none";
    }
  }

  // Add keyboard shortcut (Shift+Alt+F) to open modal
  document.addEventListener("keydown", (event) => {
    // macOS: Command+Shift+F, Windows/Linux: Alt+Shift+F
    const isMac = navigator.userAgent.toUpperCase().includes("MAC");
    const modifierPressed = isMac ? event.metaKey : event.altKey;
    
    if (event.shiftKey && modifierPressed && event.key.toUpperCase() === "F") {
      event.preventDefault();
      event.stopPropagation();
      toggleModal();
    }
  });

  // Initialize the extension
  function initializeFontCustomizer() {
    applyCustomFont();
  }

  // Create the settings modal
  createSettingsModal();

  // Set up a mutation observer to add our button to the workspace bar
  const observer = new MutationObserver((mutationsList) => {
    applyCustomFont();
    
    const workspaceBar = document.querySelector(
      'div[data-element-id="workspace-bar"]'
    );
    
    if (workspaceBar) {
      let fontCustomizerButton = document.getElementById("workspace-tab-font-customizer");
      const settingsButton = workspaceBar.querySelector(
        'button[data-element-id="workspace-tab-settings"]'
      );
      
      if (!fontCustomizerButton && settingsButton) {
        // Create a new button using the settings button as a style reference
        fontCustomizerButton = document.createElement("button");
        fontCustomizerButton.id = "workspace-tab-font-customizer";
        fontCustomizerButton.title = "Font Customizer";
        fontCustomizerButton.dataset.elementId = "workspace-tab-font-customizer";
        fontCustomizerButton.className = settingsButton.className;
        
        // Create the button's inner structure
        const outerSpan = document.createElement("span");
        const styleReferenceOuterSpan = settingsButton.querySelector(":scope > span");
        if (styleReferenceOuterSpan) {
          outerSpan.className = styleReferenceOuterSpan.className;
        }

        const iconDiv = document.createElement("div");
        const styleReferenceIconDiv = settingsButton.querySelector(
          ":scope > span > div"
        );
        if (styleReferenceIconDiv) {
          iconDiv.className = styleReferenceIconDiv.className;
        }
        iconDiv.style.position = "relative";
        iconDiv.style.display = "flex";
        iconDiv.style.justifyContent = "center";
        iconDiv.style.alignItems = "center";

        // Create SVG icon for the font
        const svgIcon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svgIcon.setAttribute("class", "w-5 h-5 flex-shrink-0");
        svgIcon.setAttribute("width", "18px");
        svgIcon.setAttribute("height", "18px");
        svgIcon.setAttribute("viewBox", "0 0 24 24");
        svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgIcon.style.color = "#9ca3af";
        svgIcon.setAttribute("fill", "currentColor");

        // Font icon path
        const svgPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        svgPath.setAttribute(
          "d",
          "M9.62 12L12 5.67L14.37 12M11 3L5.5 17H7.75L8.87 14H15.12L16.25 17H18.5L13 3H11Z"
        );
        svgIcon.appendChild(svgPath);
        iconDiv.appendChild(svgIcon);

        // Text label
        const textSpan = document.createElement("span");
        textSpan.className = "font-normal self-stretch text-center text-xs leading-4 md:leading-none";
        textSpan.textContent = "Fonts";

        outerSpan.appendChild(iconDiv);
        outerSpan.appendChild(textSpan);
        fontCustomizerButton.appendChild(outerSpan);

        // Add click handler
        fontCustomizerButton.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleModal(true);
        });
        
        // Insert button before settings
        if (settingsButton.parentNode) {
          settingsButton.parentNode.insertBefore(fontCustomizerButton, settingsButton);
          const showModalButtonSetting = getSetting(
            settingsKeys.showModalButton,
            true
          );
          const newDisplay = showModalButtonSetting ? "inline-flex" : "none";
          fontCustomizerButton.style.display = newDisplay;
        } else {
          console.warn(
            `${consolePrefix} Could not insert Font Customizer button, settings button has no parent node.`
          );
        }
      }
    }
  });

  // Start observing the document
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initialize when the page is ready
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initializeFontCustomizer();
  } else {
    document.addEventListener("DOMContentLoaded", initializeFontCustomizer);
  }
  
  console.log(
    `${consolePrefix} Initialized. Press Shift+Alt+F (or Shift+Cmd+F on Mac) to open settings.`
  );
})();
