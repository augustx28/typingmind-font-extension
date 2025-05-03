(function () {
  "use strict";

  // --- Settings Configuration ---
  const settingsKeys = {
    customFontUrl: "typingmind_font_url_v1",
    customFontFamily: "typingmind_font_family_v1",
    customFontSize: "typingmind_font_size_v1",
    showModalButton: "typingmind_font_showButton_v1", // To toggle the settings button visibility
  };

  const consolePrefix = "TypingMind Font Tweak:";
  const defaultFontSize = 14; // Example default size if needed, though null is better
  const defaultModalButtonVisibility = true;

  // --- Helper Functions ---

  // Safely gets a setting from localStorage
  function getSetting(key, defaultValue = null) {
    const value = localStorage.getItem(key);
    // Check for null or "null" string explicitly before parsing
    if (value === null || value === "null") {
      return defaultValue;
    }
    try {
      // Attempt to parse, return default if it fails or result is null
      const parsedValue = JSON.parse(value);
      return parsedValue === null ? defaultValue : parsedValue;
    } catch (e) {
      console.warn(`${consolePrefix} Could not parse setting ${key}. Using default. Error:`, e);
      // If parsing fails but value wasn't explicitly null, maybe it was a simple string?
      // For font family/URL, this might be okay. Let's return the raw value if it's not 'null'.
      // This handles cases where non-JSON strings might have been saved previously.
      return (value !== "null") ? value : defaultValue;
    }
  }

  // Saves a setting to localStorage
  function saveSetting(key, value) {
    try {
      // If value is explicitly null or undefined, remove the item
      if (value === null || typeof value === 'undefined') {
        localStorage.removeItem(key);
        console.log(`${consolePrefix} Removed setting: ${key}`);
      } else {
        // Otherwise, stringify and save
        localStorage.setItem(key, JSON.stringify(value));
        console.log(`${consolePrefix} Saved setting: ${key} =`, value);
      }

      // Update feedback in modal if it exists
      const feedbackElement = document.getElementById("font-tweak-modal-feedback");
      if (feedbackElement) {
        feedbackElement.textContent = "Settings saved.";
        // Optionally clear feedback after a delay
        setTimeout(() => {
            if (feedbackElement.textContent === "Settings saved.") {
              feedbackElement.textContent = " ";
            }
        }, 2000);
      }

      // Apply the changes immediately
      if (key === settingsKeys.customFontUrl || key === settingsKeys.customFontFamily || key === settingsKeys.customFontSize) {
        applyCustomFont();
      }
      if (key === settingsKeys.showModalButton) {
         updateModalButtonVisibility(); // Update button visibility if that setting changed
      }

    } catch (error) {
      console.error(`${consolePrefix} Error saving setting ${key}:`, error);
      const feedbackElement = document.getElementById("font-tweak-modal-feedback");
      if (feedbackElement) {
        feedbackElement.textContent = "Error saving settings.";
      }
    }
  }

  // Removes potential quotes and trims whitespace
  const cleanValue = (value) => {
    if (typeof value !== 'string') return value; // Return non-strings as is
    let cleaned = value.trim();
    if (
      (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("'") && cleaned.endsWith("'"))
    ) {
      cleaned = cleaned.slice(1, -1);
    }
    return cleaned;
  };


  // --- Core Font Application Logic ---

  // Applies the custom font styles to the document
  function applyCustomFont() {
    const customFontUrl = getSetting(settingsKeys.customFontUrl);
    const customFontFamily = getSetting(settingsKeys.customFontFamily);
    const customFontSize = getSetting(settingsKeys.customFontSize); // This should be a number or null
    const styleId = "typingmind-custom-font-style";
    let styleElement = document.getElementById(styleId);
    let cssRules = [];

    // Ensure the style element exists
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    const cleanedUrl = cleanValue(customFontUrl);
    const cleanedFamily = cleanValue(customFontFamily);
    const size = customFontSize; // Already a number or null from getSetting

    // Add @import rule if URL is provided and valid
    if (cleanedUrl && (cleanedUrl.startsWith("http://") || cleanedUrl.startsWith("https://"))) {
      cssRules.push(`@import url('${cleanedUrl}');`);
      console.log(`${consolePrefix} Importing font URL: ${cleanedUrl}`);
    } else if (cleanedUrl) {
      console.warn(`${consolePrefix} Invalid or missing custom font URL: ${cleanedUrl}`);
    }

    // Prepare CSS rules for body element
    let bodyRules = [];
    if (cleanedFamily && cleanedFamily.trim() !== "") {
      // Quote font family name if it contains spaces
      let fontFamilyValue = cleanedFamily.trim();
      if (fontFamilyValue.includes(" ") && !fontFamilyValue.startsWith("'") && !fontFamilyValue.startsWith('"')) {
        fontFamilyValue = `'${fontFamilyValue}'`;
      }
      // Add fallback fonts
      bodyRules.push(`  font-family: ${fontFamilyValue}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;`);
      console.log(`${consolePrefix} Applying font family: ${fontFamilyValue}`);
    }

    if (typeof size === 'number' && size > 0) {
      bodyRules.push(`  font-size: ${size}px !important;`);
      console.log(`${consolePrefix} Applying font size: ${size}px`);
    } else if (size !== null) {
        console.warn(`${consolePrefix} Invalid font size value: ${size}`);
    }

    // Apply rules to the body or a high-level container if needed
    if (bodyRules.length > 0) {
      // Applying to 'body' affects the whole UI generally.
      // You might need more specific selectors if 'body' doesn't cover everything
      // or if it overrides things unintentionally. Start with 'body'.
      cssRules.push(`
body, body .text-sm, body .text-base, body button, body input, body textarea, body select {
${bodyRules.join("\n")}
}
      `);
      // Target chat messages specifically too, if needed
      // cssRules.push(`
      // [data-element-id="chat-space-middle-part"] .prose {
      // ${bodyRules.join("\n")}
      // }`);
    }

    // Update the style element content
    const newStyleContent = cssRules.join("\n");
    if (styleElement.textContent !== newStyleContent) {
      styleElement.textContent = newStyleContent;
      console.log(`${consolePrefix} Custom font styles applied.`);
    } else {
      console.log(`${consolePrefix} Custom font styles already up to date.`);
    }
  }

  // --- Settings Modal ---

  let modalOverlay = null; // Keep track of the modal elements

  // Creates the HTML and CSS for the settings modal
  function createSettingsModal() {
    // Avoid creating multiple modals
    if (document.getElementById("font-tweak-modal-overlay")) return;

    const styles = `
      #font-tweak-modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.7); /* Dark overlay */
        display: none; /* Hidden by default */
        justify-content: center; align-items: center; z-index: 10500; /* High z-index */
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      #font-tweak-modal {
        background-color: #2d2d2d; /* Dark grey background */
        color: #e0e0e0; /* Light text color */
        padding: 25px 30px;
        border-radius: 8px;
        width: 90%;
        max-width: 550px; /* Max width */
        box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        border: 1px solid #4a4a4a;
        position: relative;
      }
      #font-tweak-modal h2 {
          margin-top: 0; margin-bottom: 20px;
          color: #ffffff; /* White title */
          font-size: 1.4em;
          font-weight: 600;
          text-align: center;
      }
      #font-tweak-modal-feedback {
          font-size: 0.9em;
          color: #7fccff; /* Light blue feedback color */
          margin-top: 15px;
          margin-bottom: 5px;
          min-height: 1.2em;
          text-align: center;
          font-weight: 500;
      }
       .font-tweak-input-group {
          margin-bottom: 20px;
       }
      .font-tweak-input-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #c0c0c0; /* Slightly dimmer label color */
       }
       .font-tweak-input-wrapper {
            display: flex;
            align-items: center;
            gap: 10px; /* Space between input and button */
       }
      .font-tweak-input-group input[type='text'],
      .font-tweak-input-group input[type='number'] {
          flex-grow: 1; /* Input takes available space */
          padding: 8px 12px;
          border: 1px solid #555;
          border-radius: 4px;
          background-color: #3a3a3a; /* Darker input background */
          color: #e0e0e0;
          font-size: 0.95em;
          box-sizing: border-box; /* Include padding and border in the element's total width and height */
      }
      .font-tweak-input-group input[type='text']::placeholder,
      .font-tweak-input-group input[type='number']::placeholder {
          color: #888; /* Placeholder text color */
          opacity: 1;
      }
       /* Clear Button Styling */
       .font-tweak-clear-button {
            background-color: #6c757d; /* Grey background */
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            font-size: 0.85em;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s ease;
            white-space: nowrap; /* Prevent wrapping */
       }
        .font-tweak-clear-button:hover {
            background-color: #5a6268; /* Darker grey on hover */
       }

        /* Checkbox styling */
       .font-tweak-checkbox-item { margin-top: 25px; display: flex; align-items: center; gap: 10px; }
       .font-tweak-checkbox-item input[type='checkbox'] {
            transform: scale(1.1);
            cursor: pointer;
            accent-color: #0d6efd; /* A standard blue */
       }
       .font-tweak-checkbox-item label { margin-bottom: 0; /* Override default label margin */ cursor: pointer; }


       /* Footer & Close Button */
      .font-tweak-modal-footer {
        margin-top: 25px;
        padding-top: 15px;
        border-top: 1px solid #4a4a4a;
        display: flex;
        justify-content: flex-end; /* Align button to the right */
      }
      #font-tweak-modal-close {
        background-color: #555; /* Darker grey close button */
        color: white;
        border: 1px solid #666;
        padding: 8px 20px;
        border-radius: 6px;
        font-size: 0.95em;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }
      #font-tweak-modal-close:hover {
        background-color: #666;
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Create Modal Structure
    modalOverlay = document.createElement("div");
    modalOverlay.id = "font-tweak-modal-overlay";
    modalOverlay.addEventListener("click", (e) => {
      // Close if backdrop is clicked
      if (e.target === modalOverlay) {
        toggleModal(false);
      }
    });

    const modalElement = document.createElement("div");
    modalElement.id = "font-tweak-modal";

    const header = document.createElement("h2");
    header.textContent = "Font Settings";
    modalElement.appendChild(header);

    const feedbackElement = document.createElement("p");
    feedbackElement.id = "font-tweak-modal-feedback";
    feedbackElement.textContent = " "; // Placeholder for feedback
    modalElement.appendChild(feedbackElement);

    // --- Font URL Input ---
    const urlGroup = document.createElement("div");
    urlGroup.className = "font-tweak-input-group";
    const urlLabel = document.createElement("label");
    urlLabel.htmlFor = "font-tweak-url-input";
    urlLabel.textContent = "Custom Font URL:";
    const urlInputWrapper = document.createElement("div");
    urlInputWrapper.className = "font-tweak-input-wrapper";
    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.id = "font-tweak-url-input";
    urlInput.placeholder = "e.g., https://fonts.googleapis.com/css2?family=Roboto&display=swap";
    urlInput.addEventListener("input", (event) => saveSetting(settingsKeys.customFontUrl, event.target.value || null));
    const urlClearButton = document.createElement("button");
    urlClearButton.textContent = "Clear";
    urlClearButton.className = "font-tweak-clear-button";
    urlClearButton.type = "button";
    urlClearButton.addEventListener("click", () => {
      urlInput.value = "";
      saveSetting(settingsKeys.customFontUrl, null);
    });
    urlInputWrapper.appendChild(urlInput);
    urlInputWrapper.appendChild(urlClearButton);
    urlGroup.appendChild(urlLabel);
    urlGroup.appendChild(urlInputWrapper);
    modalElement.appendChild(urlGroup);

    // --- Font Family Input ---
    const familyGroup = document.createElement("div");
    familyGroup.className = "font-tweak-input-group";
    const familyLabel = document.createElement("label");
    familyLabel.htmlFor = "font-tweak-family-input";
    familyLabel.textContent = "Font Family Name:";
    const familyInputWrapper = document.createElement("div");
    familyInputWrapper.className = "font-tweak-input-wrapper";
    const familyInput = document.createElement("input");
    familyInput.type = "text";
    familyInput.id = "font-tweak-family-input";
    familyInput.placeholder = "e.g., 'Roboto' or 'Source Code Pro'";
    familyInput.addEventListener("input", (event) => saveSetting(settingsKeys.customFontFamily, event.target.value || null));
    const familyClearButton = document.createElement("button");
    familyClearButton.textContent = "Clear";
    familyClearButton.className = "font-tweak-clear-button";
    familyClearButton.type = "button";
    familyClearButton.addEventListener("click", () => {
      familyInput.value = "";
      saveSetting(settingsKeys.customFontFamily, null);
    });
    familyInputWrapper.appendChild(familyInput);
    familyInputWrapper.appendChild(familyClearButton);
    familyGroup.appendChild(familyLabel);
    familyGroup.appendChild(familyInputWrapper);
    modalElement.appendChild(familyGroup);

    // --- Font Size Input ---
    const sizeGroup = document.createElement("div");
    sizeGroup.className = "font-tweak-input-group";
    const sizeLabel = document.createElement("label");
    sizeLabel.htmlFor = "font-tweak-size-input";
    sizeLabel.textContent = "Font Size (px):";
    const sizeInputWrapper = document.createElement("div");
    sizeInputWrapper.className = "font-tweak-input-wrapper";
    const sizeInput = document.createElement("input");
    sizeInput.type = "number";
    sizeInput.id = "font-tweak-size-input";
    sizeInput.placeholder = `Default: ${defaultFontSize}px`;
    sizeInput.min = "8"; // Minimum practical font size
    sizeInput.step = "1";
    sizeInput.addEventListener("input", (event) => {
        const value = event.target.value;
        // Save as number if valid and positive, otherwise save null
        const numValue = parseInt(value, 10);
        saveSetting(settingsKeys.customFontSize, (value && numValue > 0) ? numValue : null);
    });
    const sizeClearButton = document.createElement("button");
    sizeClearButton.textContent = "Clear";
    sizeClearButton.className = "font-tweak-clear-button";
    sizeClearButton.type = "button";
    sizeClearButton.addEventListener("click", () => {
      sizeInput.value = "";
      saveSetting(settingsKeys.customFontSize, null);
    });
    sizeInputWrapper.appendChild(sizeInput);
    sizeInputWrapper.appendChild(sizeClearButton);
    sizeGroup.appendChild(sizeLabel);
    sizeGroup.appendChild(sizeInputWrapper);
    modalElement.appendChild(sizeGroup);

    // --- Show Button Toggle ---
    const showButtonGroup = document.createElement("div");
    showButtonGroup.className = "font-tweak-checkbox-item";
    const showButtonInput = document.createElement("input");
    showButtonInput.type = "checkbox";
    showButtonInput.id = "font-tweak-showbutton-input";
    showButtonInput.checked = getSetting(settingsKeys.showModalButton, defaultModalButtonVisibility);
    showButtonInput.addEventListener("change", (event) => saveSetting(settingsKeys.showModalButton, event.target.checked));
    const showButtonLabel = document.createElement("label");
    showButtonLabel.htmlFor = "font-tweak-showbutton-input";
    showButtonLabel.textContent = "Show 'Font Settings' Button in Menu";
    showButtonGroup.appendChild(showButtonInput);
    showButtonGroup.appendChild(showButtonLabel);
    modalElement.appendChild(showButtonGroup);


    // --- Modal Footer ---
    const footer = document.createElement("div");
    footer.className = "font-tweak-modal-footer";
    const closeButton = document.createElement("button");
    closeButton.id = "font-tweak-modal-close";
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => toggleModal(false));
    footer.appendChild(closeButton);
    modalElement.appendChild(footer);

    // Add modal to overlay, and overlay to body
    modalOverlay.appendChild(modalElement);
    document.body.appendChild(modalOverlay);

    console.log(`${consolePrefix} Settings modal created.`);
  }

  // Loads current settings into the modal fields
  function loadSettingsIntoModal() {
    if (!modalOverlay) return;

    // Load Font URL
    const urlInput = document.getElementById("font-tweak-url-input");
    if (urlInput) {
      urlInput.value = cleanValue(getSetting(settingsKeys.customFontUrl)) || "";
    }

    // Load Font Family
    const familyInput = document.getElementById("font-tweak-family-input");
    if (familyInput) {
      familyInput.value = cleanValue(getSetting(settingsKeys.customFontFamily)) || "";
    }

    // Load Font Size
    const sizeInput = document.getElementById("font-tweak-size-input");
    if (sizeInput) {
      sizeInput.value = getSetting(settingsKeys.customFontSize, "") || ""; // Use empty string if null
    }

     // Load Show Button setting
    const showButtonInput = document.getElementById("font-tweak-showbutton-input");
    if (showButtonInput) {
        showButtonInput.checked = getSetting(settingsKeys.showModalButton, defaultModalButtonVisibility);
    }


    // Clear feedback message
    const feedbackElement = document.getElementById("font-tweak-modal-feedback");
    if (feedbackElement) {
      feedbackElement.textContent = " ";
    }
    console.log(`${consolePrefix} Settings loaded into modal.`);
  }

  // Shows or hides the modal
  function toggleModal(forceState) {
    if (!modalOverlay) {
      console.warn(`${consolePrefix} Modal overlay not found. Cannot toggle.`);
      return;
    }
    const currentComputedDisplay = window.getComputedStyle(modalOverlay).display;
    const shouldShow = typeof forceState === "boolean" ? forceState : currentComputedDisplay === "none";

    if (shouldShow) {
      loadSettingsIntoModal(); // Load fresh settings each time it opens
      modalOverlay.style.display = "flex";
      console.log(`${consolePrefix} Modal opened.`);
    } else {
      modalOverlay.style.display = "none";
      console.log(`${consolePrefix} Modal closed.`);
    }
  }

  // Updates the visibility of the settings button in the UI
  function updateModalButtonVisibility() {
      const tweaksButton = document.getElementById("font-tweak-settings-button");
      if (!tweaksButton) return; // Button doesn't exist yet

      const showButton = getSetting(settingsKeys.showModalButton, defaultModalButtonVisibility);
      tweaksButton.style.display = showButton ? "inline-flex" : "none";
      console.log(`${consolePrefix} Settings button visibility updated: ${showButton ? 'shown' : 'hidden'}`);
  }


  // --- Settings Button & Integration ---

  // Creates and inserts the 'Font Settings' button into the TypingMind UI
  function addTweaksButton() {
      const buttonId = "font-tweak-settings-button";
      // Check if button already exists
      if (document.getElementById(buttonId)) {
          updateModalButtonVisibility(); // Ensure visibility is correct even if button exists
          return;
      }

      // Find a reference point (e.g., the 'Settings' button) to insert adjacent to
      const workspaceBar = document.querySelector('div[data-element-id="workspace-bar"]');
      if (!workspaceBar) return; // Workspace bar not found

      const settingsButton = workspaceBar.querySelector('button[data-element-id="workspace-tab-settings"]');
      if (!settingsButton) {
          console.warn(`${consolePrefix} Reference 'Settings' button not found. Cannot add Font Settings button.`);
          return; // Reference button not found
      }

      // Clone the style of the reference button
      const tweaksButton = document.createElement("button");
      tweaksButton.id = buttonId;
      tweaksButton.title = "Open Font Settings";
      tweaksButton.dataset.elementId = buttonId; // Use unique ID for data attribute too
      tweaksButton.className = settingsButton.className; // Copy classes for style consistency

      // Create button content (Icon + Text) - Adapt structure from observed elements
      const outerSpan = document.createElement("span");
      const styleReferenceOuterSpan = settingsButton.querySelector(":scope > span");
      if (styleReferenceOuterSpan) {
          outerSpan.className = styleReferenceOuterSpan.className; // Copy classes
      }

      const iconDiv = document.createElement("div");
      const styleReferenceIconDiv = settingsButton.querySelector(":scope > span > div");
      if (styleReferenceIconDiv) {
          iconDiv.className = styleReferenceIconDiv.className; // Copy classes
      }
      iconDiv.style.position = "relative"; // Ensure positioning context if needed
      iconDiv.style.display = "flex";
      iconDiv.style.justifyContent = "center";
      iconDiv.style.alignItems = "center";


      // Simple 'Aa' Icon SVG - Replace with a better font icon if available
      const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svgIcon.setAttribute("class", "w-5 h-5 flex-shrink-0"); // Common classes for icons
      svgIcon.setAttribute("viewBox", "0 0 20 20"); // Simple viewBox
      svgIcon.setAttribute("fill", "currentColor"); // Use current text color
      svgIcon.setAttribute("width", "18px");
      svgIcon.setAttribute("height", "18px");
      // SVG Path for a simple 'Aa' like icon
      svgIcon.innerHTML = `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.732 14.25L6.068 10.16H2.932L1.268 14.25H0L4 3h2l4 11.25H7.732zM5 8.84L4.14 6.56h-.08L3.18 8.84H5zm10.28-5.09h-2.96v10.5h1.8v-4.21h1.16c1.6 0 2.53-.82 2.53-2.14 0-1.32-.93-2.15-2.53-2.15zm-.11 2.88h-.95V5.08h.95c.77 0 1.16.35 1.16.9 0 .55-.39.9-1.16.9z"/>
      `;
      iconDiv.appendChild(svgIcon);

      const textSpan = document.createElement("span");
      // Try to copy text styling from reference button
      const refTextSpan = settingsButton.querySelector(":scope > span > span");
      if (refTextSpan) {
          textSpan.className = refTextSpan.className;
      } else {
          // Fallback basic styling if reference text span not found
          textSpan.className = "font-normal self-stretch text-center text-xs leading-4 md:leading-none";
      }
      textSpan.textContent = "Font"; // Short Label

      // Assemble the button structure
      outerSpan.appendChild(iconDiv);
      outerSpan.appendChild(textSpan);
      tweaksButton.appendChild(outerSpan);

      // Add click listener to open the modal
      tweaksButton.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleModal(true);
      });

      // Insert the button before the reference Settings button
      if (settingsButton.parentNode) {
          settingsButton.parentNode.insertBefore(tweaksButton, settingsButton);
          console.log(`${consolePrefix} Font Settings button added to UI.`);
          updateModalButtonVisibility(); // Set initial visibility
      } else {
          console.warn(`${consolePrefix} Could not insert Font Settings button, reference button parent not found.`);
      }
  }


  // --- Initialization and Observation ---

  // Initial setup function
  function initializeFontTweaks() {
    console.log(`${consolePrefix} Initializing...`);
    createSettingsModal(); // Create the modal elements (hidden initially)
    applyCustomFont();     // Apply any saved font settings on load
    addTweaksButton();     // Try to add the button to the UI
  }

  // Use MutationObserver to re-apply settings and add button if UI changes
  const observer = new MutationObserver((mutationsList, observer) => {
    // We run this check periodically when DOM changes occur.
    // Check if our button is still there or needs to be added.
    addTweaksButton();
    // Re-apply font styles might be needed if TypingMind replaces large parts of the DOM
    // Be cautious with performance here; maybe only re-apply if specific elements change.
    // For simplicity, let's re-apply font on mutation for now.
    applyCustomFont();
  });

  // Start observing the body for changes
  observer.observe(document.body, {
    childList: true, // Watch for addition/removal of nodes
    subtree: true    // Watch descendants too
  });

  // Add keyboard shortcut listener (Shift + Alt/Option + T)
  document.addEventListener("keydown", (event) => {
    const isMac = navigator.userAgent.toUpperCase().includes("MAC");
    const modifierPressed = isMac ? event.metaKey : event.altKey; // Cmd on Mac, Alt elsewhere
    // Using 'F' for Font might be more intuitive than 'T'
    if (event.shiftKey && modifierPressed && event.key.toUpperCase() === "F") {
      event.preventDefault();
      event.stopPropagation();
      toggleModal(); // Toggle the modal visibility
      console.log(`${consolePrefix} Keyboard shortcut activated.`);
    }
  });

  // Run initialization when the DOM is ready
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initializeFontTweaks();
  } else {
    document.addEventListener("DOMContentLoaded", initializeFontTweaks);
  }

  console.log(`${consolePrefix} Font Customizer loaded. Press Shift+${navigator.userAgent.toUpperCase().includes("MAC") ? 'Cmd' : 'Alt'}+F for settings.`);

})();
