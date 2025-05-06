# TypingMind UI Tweaks Extension (Modified)

(function () {
  "use strict";

  // --- Settings Keys ---
  const settingsKeys = {
    // Visual Hiding Toggles
    hideTeams: "tweak_hideTeams",
    hideKB: "tweak_hideKB",
    hideLogo: "tweak_hideLogo",
    hideProfile: "tweak_hideProfile",
    hideChatProfiles: "tweak_hideChatProfiles",
    hidePinnedChars: "tweak_hidePinnedChars",
    // Color Customization
    newChatButtonColor: "tweak_newChatButtonColor",
    workspaceIconColor: "tweak_workspaceIconColor",
    workspaceFontColor: "tweak_workspaceFontColor",
    // General UI
    customPageTitle: "tweak_customPageTitle",
    showModalButton: "tweak_showModalButton",
    // **NEW/REPURPOSED:** Global Font Settings
    customFontUrl: "tweak_customFontUrl",       // URL for @import
    customFontFamily: "tweak_customFontFamily", // Font family name (e.g., 'Inter')
    customFontSize: "tweak_customFontSize",     // Base font size in px
  };

  // --- Constants and Variables ---
  const consolePrefix = "TypingMind Tweaks:";
  const defaultNewChatButtonColor = "#2563eb"; // Default blue
  const defaultWorkspaceIconColorVisual = "#9ca3af"; // Default gray-400
  const defaultWorkspaceFontColorVisual = "#d1d5db"; // Default gray-300
  let originalPageTitle = null;
  let modalOverlay = null;
  let modalElement = null;
  let feedbackElement = null;

  // --- Utility Functions ---
  const cleanValue = (value) => {
    if (value === null || typeof value === 'undefined') return null;
    let cleaned = String(value).trim(); // Ensure it's a string for trimming
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
    // Check for explicit "null" string which might happen with direct localStorage editing
    if (value === null || value === "null") {
        return defaultValue;
    }
    try {
        // Use JSON.parse for booleans, numbers, and properly stored strings/objects
        return JSON.parse(value);
    } catch (e) {
        // Fallback for potentially unquoted strings (legacy or direct edits)
        console.warn(`${consolePrefix} Could not JSON parse setting ${key}. Falling back to raw value. Error:`, e);
        return value; // Return raw string value if JSON parsing fails
    }
  }


  function saveSetting(key, value) {
    try {
      if (value === null || typeof value === 'undefined') {
        localStorage.removeItem(key);
        console.log(`${consolePrefix} Removed setting: ${key}`);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
         console.log(`${consolePrefix} Saved setting: ${key} = ${JSON.stringify(value)}`);
      }

      if (feedbackElement) {
        feedbackElement.textContent = "Settings saved.";
      }
      // Apply relevant style updates immediately
      applyStylesBasedOnSettings(); // Apply general visibility/color styles
      if (
        key === settingsKeys.customFontUrl ||
        key === settingsKeys.customFontFamily ||
        key === settingsKeys.customFontSize
      ) {
        applyCustomFont(); // Apply font styles
      }
       if (key === settingsKeys.customPageTitle) {
          applyCustomTitle(); // Apply title changes
       }

    } catch (error) {
      console.error(`${consolePrefix} Error saving setting ${key}:`, error);
      if (feedbackElement) {
        feedbackElement.textContent = "Error saving settings.";
      }
    }
  }


  // --- Core Styling Logic ---

  function applyStylesBasedOnSettings() {
    // Get current settings
    const hideTeams = getSetting(settingsKeys.hideTeams, false);
    const hideKB = getSetting(settingsKeys.hideKB, false);
    const hideLogo = getSetting(settingsKeys.hideLogo, false);
    const hideProfile = getSetting(settingsKeys.hideProfile, false);
    const hideChatProfiles = getSetting(settingsKeys.hideChatProfiles, false);
    const hidePinnedChars = getSetting(settingsKeys.hidePinnedChars, false);
    const newChatColor = getSetting(settingsKeys.newChatButtonColor, null);
    const wsIconColor = getSetting(settingsKeys.workspaceIconColor, null);
    const wsFontColor = getSetting(settingsKeys.workspaceFontColor, null);
    const showModalButtonSetting = getSetting(settingsKeys.showModalButton, true);

    // Apply Hide Teams
    const teamsButton = document.querySelector('button[data-element-id="workspace-tab-teams"]');
    if (teamsButton) teamsButton.style.display = hideTeams ? "none" : "";

    // Apply Hide KB
    const workspaceBar = document.querySelector('div[data-element-id="workspace-bar"]');
    if (workspaceBar) {
        workspaceBar.querySelectorAll("button").forEach(button => {
            const textSpan = button.querySelector("span > span");
            if (textSpan && textSpan.textContent.trim() === "KB") {
                button.style.display = hideKB ? "none" : "";
            }
        });
    }

    // Apply Hide Logo & Announcement
    const logoImage = document.querySelector('img[alt="TypingMind"][src="/logo.png"]');
    let logoContainerDiv = logoImage?.parentElement?.parentElement;
    if (logoContainerDiv && logoContainerDiv.tagName === "DIV") {
        logoContainerDiv.style.display = hideLogo ? "none" : "";
    }

    // Apply Hide Profile
    const profileButton = document.querySelector('button[data-element-id="workspace-profile-button"]');
    if (profileButton) profileButton.style.display = hideProfile ? "none" : "";

    // Apply Hide Chat Profiles
     document.querySelectorAll("span").forEach(span => {
        if (span.textContent.trim() === "Chat Profiles") {
            const button = span.closest("button");
            if (button) button.style.display = hideChatProfiles ? "none" : "";
        }
     });


    // Apply Hide Pinned Characters
    const pinnedCharsContainer = document.querySelector('div[data-element-id="pinned-characters-container"]');
    if (pinnedCharsContainer) pinnedCharsContainer.style.display = hidePinnedChars ? "none" : "";

    // Apply New Chat Button Color
    const newChatButton = document.querySelector('button[data-element-id="new-chat-button-in-side-bar"]');
    if (newChatButton) {
        newChatButton.style.backgroundColor = newChatColor || ""; // Reset if null
    }

    // Apply Workspace Icon Color
    if (workspaceBar) {
        const icons = workspaceBar.querySelectorAll("svg");
        icons.forEach(icon => {
            // Exclude the Tweaks icon itself if we are customizing it separately
             if (!icon.closest('#workspace-tab-tweaks')) {
                 icon.style.color = wsIconColor || ""; // Reset if null
             }
        });
    }

    // Apply Workspace Font Color
    if (workspaceBar) {
        const textSpans = workspaceBar.querySelectorAll("span");
        textSpans.forEach(span => {
            if (span.textContent.trim()) { // Apply only to spans with text content
                span.style.color = wsFontColor || ""; // Reset if null
            }
        });
    }

    // Handle Tweaks Button visibility and icon color
    const tweaksButton = document.getElementById("workspace-tab-tweaks");
    if (tweaksButton) {
         // Update visibility based on setting
        tweaksButton.style.display = showModalButtonSetting ? "inline-flex" : "none";

        // Update icon color (use custom if set, else default visual)
        const svgIcon = tweaksButton.querySelector("svg");
        if (svgIcon) {
            const currentWsIconColor = getSetting(settingsKeys.workspaceIconColor, null);
            svgIcon.style.color = currentWsIconColor || defaultWorkspaceIconColorVisual;
        }
    }
  }

  function applyCustomTitle() {
    const customTitleRaw = localStorage.getItem(settingsKeys.customPageTitle);
    const customTitle = cleanValue(customTitleRaw); // Clean potential quotes

    if (customTitle && customTitle !== "") {
        if (document.title !== customTitle) {
            document.title = customTitle;
        }
    } else {
      // Restore original title if custom title is cleared or empty
        if (originalPageTitle && document.title !== originalPageTitle) {
            document.title = originalPageTitle;
        }
    }
  }

  /**
   * **MODIFIED:** Applies custom font URL, family, and size globally.
   */
  function applyCustomFont() {
      // Read settings from localStorage
      let customFontUrl = localStorage.getItem(settingsKeys.customFontUrl);
      let customFontFamily = localStorage.getItem(settingsKeys.customFontFamily);
      let customFontSizeSetting = localStorage.getItem(settingsKeys.customFontSize);

      const styleId = "tweak-custom-font-style";
      let styleElement = document.getElementById(styleId);
      let cssRules = []; // Array to hold all CSS rules as strings

      // Ensure the style element exists
      if (!styleElement) {
          styleElement = document.createElement("style");
          styleElement.id = styleId;
          document.head.appendChild(styleElement);
      }

      // Clean the retrieved string values
      const cleanedUrl = cleanValue(customFontUrl);
      const cleanedFamily = cleanValue(customFontFamily);

      // Parse the font size (stored as JSON number or null)
      let cleanedSize = null;
      if (customFontSizeSetting && customFontSizeSetting !== "null") {
          try {
              const parsedSize = JSON.parse(customFontSizeSetting);
              if (typeof parsedSize === 'number' && parsedSize > 0) {
                  cleanedSize = parsedSize;
              }
          } catch(e) {
               console.error(`${consolePrefix} Error parsing stored font size:`, e);
          }
      }

      // 1. Add @import rule if a valid URL is provided
      if (cleanedUrl) {
          if (cleanedUrl.startsWith("http://") || cleanedUrl.startsWith("https://")) {
              // Ensure the URL is properly escaped within the CSS string
              const escapedUrl = cleanedUrl.replace(/'/g, "\\'"); // Basic escaping
              cssRules.push(`@import url('${escapedUrl}');`);
          } else {
              console.warn(`${consolePrefix} Invalid custom font URL provided: ${cleanedUrl}. Must start with http:// or https://`);
          }
      }

      // 2. Build the main CSS rule targeting key elements
      let globalCssProps = [];
      if (cleanedFamily && cleanedFamily.trim() !== "") {
          let fontFamilyValue = cleanedFamily.trim();
          // Add quotes if the family name contains spaces and isn't already quoted
          if (fontFamilyValue.includes(" ") && !fontFamilyValue.startsWith("'") && !fontFamilyValue.startsWith('"')) {
              fontFamilyValue = `'${fontFamilyValue}'`;
          }
          // Include common fallbacks
          globalCssProps.push(`  font-family: ${fontFamilyValue}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;`);
      }

      if (cleanedSize !== null && cleanedSize > 0) {
           globalCssProps.push(`  font-size: ${cleanedSize}px !important;`);
      }

      // Combine properties into the main rule string if any exist
      if (globalCssProps.length > 0) {
            // Apply to body and force inheritance for common elements
          cssRules.push(`
body {
${globalCssProps.join("\n")}
}

/* Attempt to force inheritance on potentially overridden elements */
button, input, select, textarea, div, span, p, li, h1, h2, h3, h4, h5, h6, label, a, code, pre {
    ${cleanedFamily ? `font-family: inherit !important;` : ''}
    ${cleanedSize !== null ? `font-size: inherit !important; line-height: inherit !important;` : ''}
}

/* Ensure code blocks use the font if specified, otherwise they might default to monospace */
${cleanedFamily ?
`code, pre, .prose code, kbd, samp {
    font-family: inherit !important; /* Use specified family if set */
}` :
`code, pre, .prose code, kbd, samp {
    /* Keep default monospace if no custom family, but allow size inherit */
    ${cleanedSize !== null ? 'font-size: inherit !important;' : ''}
}`
}

/* Inputs might need specific size setting if base body size isn't enough */
input, select, textarea, button {
     ${cleanedSize !== null ? `font-size: ${cleanedSize * 0.95}px !important;` : ''} /* Slightly smaller for inputs often works well */
}
          `);
      }


      // 3. Update the style element content
      const newStyleContent = cssRules.join("\n\n"); // Add newline between rules
      // Only update DOM if content changed or needs clearing
      if (styleElement.textContent !== newStyleContent) {
          styleElement.textContent = newStyleContent;
          console.log(`${consolePrefix} ${cssRules.length > 0 ? 'Applied' : 'Cleared'} custom font styles.`);
      }
  }


  // --- Modal UI Creation and Management ---

  function createSettingsModal() {
    // Avoid creating multiple modals
    if (document.getElementById("tweak-modal-overlay")) return;

    // Inject CSS for the modal
    const styles = `
      #tweak-modal-overlay { /* Modal Background */
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.8); display: none; /* Hidden by default */
        justify-content: center; align-items: center; z-index: 10001;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; /* Default UI font */
      }
      #tweak-modal { /* Modal Container */
        background-color: #252525; color: #f0f0f0; padding: 20px 30px; border-radius: 8px;
        min-width: 400px; max-width: 550px; box-shadow: 0 8px 25px rgba(0,0,0,0.6);
        border: 1px solid #4a4a4a; display: flex; flex-direction: column; max-height: 90vh; /* Limit height */
      }
      #tweak-modal h2 { /* Modal Title */
        margin-top: 0; margin-bottom: 15px; color: #ffffff; font-size: 1.4em; font-weight: 600; text-align: center;
        border-bottom: 1px solid #4a4a4a; padding-bottom: 15px;
      }
      #tweak-modal-feedback { /* Feedback Area */
        font-size: 0.9em; color: #a0cfff; margin-top: 0px; margin-bottom: 10px; min-height: 1.2em;
        text-align: center; font-weight: 500;
      }
      #tweak-modal-scrollable-content { /* Scrollable Area */
        overflow-y: auto; overflow-x: hidden; padding-right: 10px; margin-right: -10px;
        flex-grow: 1; /* Allow content to take available space */
      }
      /* Custom Scrollbar Styles (WebKit) */
      #tweak-modal-scrollable-content::-webkit-scrollbar { width: 8px; }
      #tweak-modal-scrollable-content::-webkit-scrollbar-track { background: #444; border-radius: 4px; }
      #tweak-modal-scrollable-content::-webkit-scrollbar-thumb { background-color: #888; border-radius: 4px; border: 2px solid #444; }
      #tweak-modal-scrollable-content::-webkit-scrollbar-thumb:hover { background-color: #aaa; }

      .tweak-settings-section { /* Section Container */
        background-color: #333333; padding: 15px 20px; border-radius: 6px; margin-bottom: 15px;
        border: 1px solid #484848;
      }
       .tweak-settings-section h3 { /* Section Title */
            margin-top: 0; margin-bottom: 15px; font-size: 1.1em; font-weight: 500; color: #e0e0e0;
            padding-bottom: 8px; border-bottom: 1px solid #555;
       }

      /* Checkbox Styles */
      .tweak-checkbox-item { margin-bottom: 15px; display: flex; align-items: center; }
      .tweak-checkbox-item:last-child { margin-bottom: 5px; }
      .tweak-checkbox-item input[type='checkbox'] { margin-right: 12px; transform: scale(1.1); cursor: pointer; accent-color: #0d6efd; }
      .tweak-checkbox-item label { cursor: pointer; flex-grow: 1; font-size: 0.95em; color: #e0e0e0; }

      /* Input Item base style (Text, Color, Number) */
       .tweak-input-item {
            margin-top: 15px; display: flex; align-items: center; justify-content: space-between;
            gap: 10px; /* Space between label and input wrapper */
       }
       .tweak-input-item label {
           flex-shrink: 0; /* Prevent label from shrinking */
           color: #e0e0e0; font-size: 0.95em; white-space: nowrap;
        }
        .tweak-input-wrapper {
             display: flex; align-items: center; flex-grow: 1; /* Allow input+button to fill space */
             gap: 8px; /* Space between input and reset button */
        }
       .tweak-input-item input[type='text'],
       .tweak-input-item input[type='number'],
       .tweak-input-item input[type='color'] {
           border: 1px solid #777; border-radius: 4px; background-color: #555; color: #f0f0f0;
           font-size: 0.9em; padding: 6px 10px;
       }
        .tweak-input-item input[type='text'],
        .tweak-input-item input[type='number'] {
            flex-grow: 1; /* Allow text/number input to take available space */
             min-width: 80px; /* Ensure minimum width */
        }
        .tweak-input-item input[type='color'] {
             width: 45px; height: 32px; cursor: pointer; padding: 2px; flex-shrink: 0;
        }
        .tweak-input-item input::placeholder { color: #aaa; opacity: 0.8; }

       /* Reset/Clear Button Style */
       .tweak-reset-button {
            background-color: #6c757d; color: white; border: 1px solid #6c757d;
            padding: 5px 10px; border-radius: 4px; font-size: 0.85em; font-weight: 500;
            cursor: pointer; transition: background-color 0.2s ease; flex-shrink: 0;
            line-height: 1; /* Ensure consistent height */
       }
       .tweak-reset-button:hover { background-color: #5a6268; border-color: #545b62; }

        /* Font section description */
        .tweak-font-description {
            font-size: 0.9em; color: #ccc; margin-bottom: 15px; line-height: 1.4;
            background-color: rgba(255, 255, 255, 0.05); padding: 8px 12px; border-radius: 4px;
        }


      /* Modal Footer & Close Button */
      .tweak-modal-footer {
        margin-top: 20px; padding-top: 15px; border-top: 1px solid #4a4a4a;
        display: flex; justify-content: flex-end;
      }
      #tweak-modal-bottom-close {
        background-color: #dc3545; color: white; border: 1px solid #dc3545;
        padding: 8px 18px; border-radius: 6px; font-size: 0.95em; font-weight: 500;
        cursor: pointer; transition: background-color 0.2s ease;
      }
      #tweak-modal-bottom-close:hover { background-color: #c82333; border-color: #bd2130; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Create Modal Structure
    modalOverlay = document.createElement("div");
    modalOverlay.id = "tweak-modal-overlay";
    modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) toggleModal(false); }); // Close on backdrop click

    modalElement = document.createElement("div");
    modalElement.id = "tweak-modal";

    const header = document.createElement("h2");
    header.textContent = "TypingMind UI Tweaks";

    feedbackElement = document.createElement("p");
    feedbackElement.id = "tweak-modal-feedback";
    feedbackElement.textContent = " "; // Placeholder for feedback

    const scrollableContent = document.createElement("div");
    scrollableContent.id = "tweak-modal-scrollable-content";

    // --- Section 1: Visibility Toggles ---
    const visibilitySection = document.createElement("div");
    visibilitySection.className = "tweak-settings-section";
    const visibilityHeader = document.createElement("h3");
    visibilityHeader.textContent = "Hide UI Elements";
    visibilitySection.appendChild(visibilityHeader);

    const visibilitySettings = [
      { key: settingsKeys.hideTeams, label: "Hide 'Teams' menu item" },
      { key: settingsKeys.hideKB, label: "Hide 'KB' menu item" },
      { key: settingsKeys.hideLogo, label: "Hide Logo & Announcement" },
      { key: settingsKeys.hideProfile, label: "Hide 'Profile' button" },
      { key: settingsKeys.hideChatProfiles, label: "Hide 'Chat Profiles' button" },
      { key: settingsKeys.hidePinnedChars, label: "Hide 'Characters' in New Chat" },
      { key: settingsKeys.showModalButton, label: "Show 'Tweaks' Button in Menu", defaultValue: true },
    ];

    visibilitySettings.forEach(setting => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "tweak-checkbox-item";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = setting.key;
      checkbox.checked = getSetting(setting.key, setting.defaultValue === true); // Use saved or default value
      checkbox.addEventListener("change", (event) => saveSetting(setting.key, event.target.checked));
      const label = document.createElement("label");
      label.htmlFor = setting.key;
      label.textContent = setting.label;
      itemDiv.appendChild(checkbox);
      itemDiv.appendChild(label);
      visibilitySection.appendChild(itemDiv);
    });
    scrollableContent.appendChild(visibilitySection);


    // --- Section 2: Color Customization ---
    const colorSection = document.createElement("div");
    colorSection.className = "tweak-settings-section";
     const colorHeader = document.createElement("h3");
     colorHeader.textContent = "Color Customization";
     colorSection.appendChild(colorHeader);

    // Helper to create a color input row
    const createColorInput = (id, labelText, settingKey, defaultValueVisual) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "tweak-input-item";

        const label = document.createElement("label");
        label.htmlFor = id;
        label.textContent = labelText;

        const inputWrapper = document.createElement("div");
        inputWrapper.className = "tweak-input-wrapper";

        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.id = id;
        colorInput.value = getSetting(settingKey, null) || defaultValueVisual; // Use saved or visual default
        colorInput.addEventListener("input", (event) => saveSetting(settingKey, event.target.value));

        const resetButton = document.createElement("button");
        resetButton.textContent = "Reset";
        resetButton.className = "tweak-reset-button";
        resetButton.type = "button";
        resetButton.addEventListener("click", () => {
            saveSetting(settingKey, null); // Save null to clear
            colorInput.value = defaultValueVisual; // Reset input visually
        });

        inputWrapper.appendChild(colorInput);
        inputWrapper.appendChild(resetButton);
        itemDiv.appendChild(label);
        itemDiv.appendChild(inputWrapper);
        return itemDiv;
    };

    colorSection.appendChild(createColorInput("tweak_newChatButtonColor_input", "New Chat Button:", settingsKeys.newChatButtonColor, defaultNewChatButtonColor));
    colorSection.appendChild(createColorInput("tweak_workspaceIconColor_input", "Menu Icons:", settingsKeys.workspaceIconColor, defaultWorkspaceIconColorVisual));
    colorSection.appendChild(createColorInput("tweak_workspaceFontColor_input", "Menu Font:", settingsKeys.workspaceFontColor, defaultWorkspaceFontColorVisual));
    scrollableContent.appendChild(colorSection);


    // --- Section 3: General UI ---
     const generalSection = document.createElement("div");
     generalSection.className = "tweak-settings-section";
     const generalHeader = document.createElement("h3");
     generalHeader.textContent = "General";
     generalSection.appendChild(generalHeader);

    // Custom Page Title Input
    const customTitleItem = document.createElement("div");
    customTitleItem.className = "tweak-input-item";
    const titleLabel = document.createElement("label");
    titleLabel.htmlFor = "tweak_customPageTitle_input";
    titleLabel.textContent = "Page Title:";
    const titleInputWrapper = document.createElement("div");
    titleInputWrapper.className = "tweak-input-wrapper";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "tweak_customPageTitle_input";
    titleInput.placeholder = "Enter custom page title";
    titleInput.value = cleanValue(localStorage.getItem(settingsKeys.customPageTitle)) || ""; // Load existing
    titleInput.addEventListener("input", (event) => {
        // Save raw value, applyCustomTitle will clean it
        localStorage.setItem(settingsKeys.customPageTitle, event.target.value);
        applyCustomTitle(); // Apply immediately
        if (feedbackElement) feedbackElement.textContent = "Settings saved.";
    });
    const clearTitleButton = document.createElement("button");
    clearTitleButton.textContent = "Clear";
    clearTitleButton.className = "tweak-reset-button";
    clearTitleButton.type = "button";
    clearTitleButton.addEventListener("click", () => {
        localStorage.removeItem(settingsKeys.customPageTitle); // Remove from storage
        titleInput.value = ""; // Clear input
        applyCustomTitle(); // Apply (will restore original)
        if (feedbackElement) feedbackElement.textContent = "Settings saved.";
    });
    titleInputWrapper.appendChild(titleInput);
    titleInputWrapper.appendChild(clearTitleButton);
    customTitleItem.appendChild(titleLabel);
    customTitleItem.appendChild(titleInputWrapper);
    generalSection.appendChild(customTitleItem);
    scrollableContent.appendChild(generalSection);


    // --- Section 4: Font Settings ---
    const fontSection = document.createElement("div");
    fontSection.className = "tweak-settings-section";
    const fontHeader = document.createElement("h3");
    fontHeader.textContent = "Global Font Settings";
    fontSection.appendChild(fontHeader);

    // **MODIFIED** Description
    const fontDescription = document.createElement("p");
    fontDescription.className = "tweak-font-description";
    fontDescription.innerHTML = "<b>Apply a custom font to the entire TypingMind interface.</b><br>Font URL (e.g., from Google Fonts) should include desired weights. Font Family Name must match the font.";
    fontSection.appendChild(fontDescription);

    // Helper to create a text/number input row
    const createTextInput = (id, labelText, settingKey, placeholder, inputType = "text", attributes = {}) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "tweak-input-item";
        const label = document.createElement("label");
        label.htmlFor = id;
        label.textContent = labelText;
        const inputWrapper = document.createElement("div");
        inputWrapper.className = "tweak-input-wrapper";
        const input = document.createElement("input");
        input.type = inputType;
        input.id = id;
        input.placeholder = placeholder;
        Object.entries(attributes).forEach(([key, value]) => input.setAttribute(key, value)); // Set min, step etc.

        // Load current value
        const storedValueRaw = localStorage.getItem(settingKey);
        let storedValue = cleanValue(storedValueRaw); // Clean strings
         if (inputType === 'number' && storedValue !== null && storedValue !== "null" && storedValue !== "") {
             try {
                storedValue = JSON.parse(storedValueRaw); // Get number back
             } catch { storedValue = "";} // Reset if parse fails
         }
        input.value = (storedValue !== null) ? String(storedValue) : ""; // Set input value as string


        // Input event listener
        input.addEventListener("input", (event) => {
            let valueToSave = event.target.value; // Start with raw value
             if (inputType === 'number') {
                 const rawValue = event.target.value.trim();
                 if (rawValue === "") {
                     valueToSave = null; // Treat empty as null
                 } else {
                     const potentialNum = parseInt(rawValue, 10);
                      const min = parseInt(input.min || "1", 10); // Use min attribute or default 1
                     if (!isNaN(potentialNum) && potentialNum >= min) {
                         valueToSave = potentialNum; // Save valid number
                     } else {
                         // Invalid number input - what to do? Maybe prevent saving?
                          console.warn(`${consolePrefix} Invalid ${labelText} input: ${rawValue}`);
                          // For now, we might let saveSetting handle it or just show feedback
                          if (feedbackElement) feedbackElement.textContent = `Invalid ${labelText}. Must be >= ${min}.`;
                          // Don't proceed with saving invalid number by returning early
                           // Note: This doesn't save, the invalid text remains in the input.
                           // A better UX might clear it or revert, but requires more complex state management.
                           // Let's just *not* save the invalid state. The *next* valid input will save.
                           return; // Stop processing this event
                     }
                 }
             } else { // For text inputs
                 valueToSave = valueToSave || null; // Treat empty string as null for consistency
             }

             // Check if value actually changed before saving
              const currentStored = localStorage.getItem(settingKey);
              const currentStoredJson = currentStored ? JSON.stringify(valueToSave) : null; // Prepare for comparison

             // Compare stored string with new stringified value, or check if both are effectively null/empty
             if ( (currentStored === null && valueToSave !== null) || // Was null, now has value
                  (currentStored !== null && valueToSave === null) || // Had value, now null
                  (currentStored !== null && valueToSave !== null && currentStored !== JSON.stringify(valueToSave)) // Both have value, but different
                ) {
                     saveSetting(settingKey, valueToSave); // Save the number, null, or string
                    // Clear specific feedback on successful save
                    if (feedbackElement && feedbackElement.textContent.startsWith('Invalid')) {
                       feedbackElement.textContent = "Settings saved.";
                    } else if (feedbackElement) {
                         feedbackElement.textContent = "Settings saved.";
                    }
             }

        });

        // Clear button
        const clearButton = document.createElement("button");
        clearButton.textContent = "Clear";
        clearButton.className = "tweak-reset-button";
        clearButton.type = "button";
        clearButton.addEventListener("click", () => {
             if (localStorage.getItem(settingKey) !== null) { // Only save if not already null
                saveSetting(settingKey, null); // Save null
                if (feedbackElement) feedbackElement.textContent = "Settings saved.";
             }
            input.value = ""; // Clear input visually
        });

        inputWrapper.appendChild(input);
        inputWrapper.appendChild(clearButton);
        itemDiv.appendChild(label);
        itemDiv.appendChild(inputWrapper);
        return itemDiv;
    };

    fontSection.appendChild(createTextInput("tweak_customFontUrl_input", "Font URL:", settingsKeys.customFontUrl, "https://... (e.g., Google Fonts)"));
    fontSection.appendChild(createTextInput("tweak_customFontFamily_input", "Font Family:", settingsKeys.customFontFamily, "e.g., 'Roboto', 'Inter'"));
    fontSection.appendChild(createTextInput("tweak_customFontSize_input", "Font Size (px):", settingsKeys.customFontSize, "e.g., 14", "number", { min: "8", step: "1" }));
    scrollableContent.appendChild(fontSection);


    // --- Modal Footer ---
    const footer = document.createElement("div");
    footer.className = "tweak-modal-footer";
    const closeButtonBottom = document.createElement("button");
    closeButtonBottom.id = "tweak-modal-bottom-close";
    closeButtonBottom.textContent = "Close";
    closeButtonBottom.addEventListener("click", () => toggleModal(false));
    footer.appendChild(closeButtonBottom);

    // Assemble Modal
    modalElement.appendChild(header);
    modalElement.appendChild(feedbackElement);
    modalElement.appendChild(scrollableContent); // Add scrollable content area
    modalElement.appendChild(footer);
    modalOverlay.appendChild(modalElement);
    document.body.appendChild(modalOverlay);

     console.log(`${consolePrefix} Settings modal created.`);
  }


  function loadSettingsIntoModal() {
    if (!modalElement) {
         console.warn(`${consolePrefix} Modal element not found during loadSettingsIntoModal.`);
         return;
    }

    // Load checkbox values
    const checkboxSettings = [
        settingsKeys.hideTeams, settingsKeys.hideKB, settingsKeys.hideLogo,
        settingsKeys.hideProfile, settingsKeys.hideChatProfiles, settingsKeys.hidePinnedChars,
        settingsKeys.showModalButton
    ];
     const defaultValues = { // Match defaults from creation
        [settingsKeys.showModalButton]: true
     };

    checkboxSettings.forEach(key => {
        const checkbox = document.getElementById(key);
        if (checkbox) {
            checkbox.checked = getSetting(key, defaultValues[key] || false);
        } else {
            console.warn(`${consolePrefix} Checkbox element not found for ID: ${key}`);
        }
    });

    // Load color picker values
    const colorInputs = [
        { id: "tweak_newChatButtonColor_input", key: settingsKeys.newChatButtonColor, default: defaultNewChatButtonColor },
        { id: "tweak_workspaceIconColor_input", key: settingsKeys.workspaceIconColor, default: defaultWorkspaceIconColorVisual },
        { id: "tweak_workspaceFontColor_input", key: settingsKeys.workspaceFontColor, default: defaultWorkspaceFontColorVisual },
    ];
    colorInputs.forEach(({ id, key, default: defaultValue }) => {
        const input = document.getElementById(id);
        if (input) {
            input.value = getSetting(key, null) || defaultValue;
        } else {
             console.warn(`${consolePrefix} Color input element not found for ID: ${id}`);
        }
    });

    // Load text/number input values
     const textInputs = [
         { id: "tweak_customPageTitle_input", key: settingsKeys.customPageTitle, isNumber: false },
         { id: "tweak_customFontUrl_input", key: settingsKeys.customFontUrl, isNumber: false },
         { id: "tweak_customFontFamily_input", key: settingsKeys.customFontFamily, isNumber: false },
         { id: "tweak_customFontSize_input", key: settingsKeys.customFontSize, isNumber: true },
     ];

     textInputs.forEach(({ id, key, isNumber }) => {
         const input = document.getElementById(id);
         if (input) {
             const storedValueRaw = localStorage.getItem(key);
             let valueToSet = ""; // Default to empty string for input field

             if (storedValueRaw !== null && storedValueRaw !== "null") {
                  if (isNumber) {
                      try {
                          const parsedNum = JSON.parse(storedValueRaw);
                          if (typeof parsedNum === 'number') {
                               valueToSet = String(parsedNum); // Convert number back to string for input
                          }
                      } catch (e) { console.error(`Error parsing number for ${key}`, e); }
                  } else {
                      valueToSet = cleanValue(storedValueRaw) || ""; // Use cleaned string value
                  }
             }
              input.value = valueToSet;
         } else {
              console.warn(`${consolePrefix} Text/Number input element not found for ID: ${id}`);
         }
     });


    // Clear feedback message when loading
    if (feedbackElement) feedbackElement.textContent = " ";
  }


  function toggleModal(forceState) {
    if (!modalOverlay) {
      console.warn(`${consolePrefix} Modal overlay not found. Cannot toggle.`);
      return;
    }
    const isCurrentlyVisible = modalOverlay.style.display === "flex";
    const shouldShow = typeof forceState === "boolean" ? forceState : !isCurrentlyVisible;

    if (shouldShow) {
      loadSettingsIntoModal(); // Load fresh data before showing
      modalOverlay.style.display = "flex";
       console.log(`${consolePrefix} Showing modal.`);
    } else {
      modalOverlay.style.display = "none";
       console.log(`${consolePrefix} Hiding modal.`);
       // Optional: Clear feedback when closing
       if (feedbackElement) feedbackElement.textContent = " ";
    }
  }


  // --- Initialization and Observation ---

  function initializeTweaks() {
    if (originalPageTitle === null) {
      originalPageTitle = document.title; // Store the initial page title
      console.log(`${consolePrefix} Stored original page title: ${originalPageTitle}`);
    }
    // Apply all initial settings
    applyStylesBasedOnSettings();
    applyCustomTitle();
    applyCustomFont();
     console.log(`${consolePrefix} Initial styles applied.`);
  }

  // Create the modal elements once on script load
  createSettingsModal();

  // Use MutationObserver to re-apply styles and ensure Tweaks button exists
  const observer = new MutationObserver((mutationsList) => {
    // Re-apply styles that might be overridden by TypingMind's dynamic updates
    applyStylesBasedOnSettings();
    applyCustomTitle(); // Title might get reset on navigation
    // applyCustomFont(); // Font styles are usually stable once injected, less need to re-apply constantly

    // Check for workspace bar and ensure Tweaks button is present
    const workspaceBar = document.querySelector('div[data-element-id="workspace-bar"]');
    if (workspaceBar) {
      let tweaksButton = document.getElementById("workspace-tab-tweaks");
      if (!tweaksButton) {
          // Find reference buttons for styling and position
           const settingsButton = workspaceBar.querySelector('button[data-element-id="workspace-tab-settings"]');
           const syncButton = workspaceBar.querySelector('button[data-element-id="workspace-tab-cloudsync"]');
           const profileButton = document.querySelector('button[data-element-id="workspace-profile-button"]'); // Might be outside workspace bar
           const referenceButton = settingsButton || syncButton || profileButton; // Find *any* button to copy styles

           if (referenceButton && referenceButton.parentNode) { // Ensure we found a reference and it's in the DOM
                 console.log(`${consolePrefix} Reference button found, creating Tweaks button.`);
                 tweaksButton = document.createElement("button");
                 tweaksButton.id = "workspace-tab-tweaks";
                 tweaksButton.title = "Open UI Tweaks (Shift+Cmd/Alt+T)";
                 tweaksButton.dataset.elementId = "workspace-tab-tweaks"; // Mimic TM's data attribute
                 tweaksButton.className = referenceButton.className; // Copy classes for basic style

                 // Create inner structure mirroring reference button (Span > Div > SVG, Span > Text)
                 const outerSpan = document.createElement("span");
                 const referenceOuterSpan = referenceButton.querySelector(":scope > span");
                 if (referenceOuterSpan) outerSpan.className = referenceOuterSpan.className;

                 const iconDiv = document.createElement("div");
                  const referenceIconDiv = referenceButton.querySelector(":scope > span > div"); // Icon container div
                  if (referenceIconDiv) iconDiv.className = referenceIconDiv.className;
                  iconDiv.style.position = "relative"; // Ensure icon positioning context if needed
                  iconDiv.style.display = "flex";
                  iconDiv.style.justifyContent = "center";
                  iconDiv.style.alignItems = "center";

                 // Create SVG Icon (Palette/Color Wheel style)
                 const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                 svgIcon.setAttribute("class", "w-5 h-5 flex-shrink-0"); // Common TM icon classes
                  svgIcon.setAttribute("width", "18px"); // Explicit size
                  svgIcon.setAttribute("height", "18px");
                 svgIcon.setAttribute("viewBox", "0 0 24 24");
                 svgIcon.setAttribute("fill", "none"); // Use stroke for this icon
                 svgIcon.setAttribute("stroke", "currentColor");
                  svgIcon.setAttribute("stroke-width", "2");
                  svgIcon.setAttribute("stroke-linecap", "round");
                  svgIcon.setAttribute("stroke-linejoin", "round");

                   // Icon Path (simple palette)
                   const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                   svgPath.setAttribute("d", "M12 2.69l.19.01c4.2 .23 7.46 3.81 7.46 8.3 0 4.69-3.81 8.5-8.5 8.5h-.31a8.47 8.47 0 01-8.19-7.19A8.5 8.5 0 0112 2.69zm0 1.81a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM9 12a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z");
                   svgPath.setAttribute("fill", "currentColor"); // Fill the holes/palette part
                    svgPath.removeAttribute("stroke"); // Remove stroke from this path


                 svgIcon.appendChild(svgPath);
                 iconDiv.appendChild(svgIcon);

                 // Text Label
                 const textSpan = document.createElement("span");
                 // Try to copy text style from reference button, default if not found
                 const referenceTextSpan = referenceButton.querySelector(":scope > span > span");
                  textSpan.className = referenceTextSpan ? referenceTextSpan.className : "font-normal text-xs";
                 textSpan.textContent = "Tweaks";

                 // Assemble Button Structure
                 outerSpan.appendChild(iconDiv);
                 outerSpan.appendChild(textSpan);
                 tweaksButton.appendChild(outerSpan);

                 // Add click listener
                 tweaksButton.addEventListener("click", (e) => {
                     e.preventDefault();
                     e.stopPropagation(); // Prevent potential parent handlers
                     toggleModal(true); // Force open
                 });

                 // Insert the button before the Settings button (or reference if settings not found)
                  const insertBeforeTarget = settingsButton || referenceButton;
                  if (insertBeforeTarget && insertBeforeTarget.parentNode) {
                        insertBeforeTarget.parentNode.insertBefore(tweaksButton, insertBeforeTarget);
                        console.log(`${consolePrefix} Tweaks button added to workspace bar.`);
                        // Apply initial visibility and color from settings AFTER inserting
                         applyStylesBasedOnSettings();
                   } else {
                        console.warn(`${consolePrefix} Could not find a suitable place to insert the Tweaks button.`);
                   }

           } else if (!referenceButton) {
                // This might happen transiently during loading
                // console.warn(`${consolePrefix} Could not find reference button to create Tweaks button yet.`);
           } else if (!referenceButton.parentNode) {
                 // This might happen if the reference button is detached temporarily
                 // console.warn(`${consolePrefix} Reference button found but has no parent node.`);
           }
      } else {
          // Tweaks button exists, ensure its visibility/color are correct (handled by applyStylesBasedOnSettings)
      }
    }
  });

  // Start observing the body for changes
  observer.observe(document.body, {
    childList: true, // Watch for additions/removals of nodes
    subtree: true,   // Watch descendants too
  });

  // Add Keyboard Shortcut Listener (Shift + Cmd/Alt + T)
   document.addEventListener("keydown", (event) => {
        const isMac = navigator.userAgent.toUpperCase().includes("MAC");
        const modifierPressed = isMac ? event.metaKey : event.altKey; // Cmd on Mac, Alt elsewhere

        if (event.shiftKey && modifierPressed && event.key.toUpperCase() === "T") {
            console.log(`${consolePrefix} Shortcut detected.`);
            event.preventDefault();
            event.stopPropagation();
            toggleModal(); // Toggle visibility
        }
   });


  // Run initial setup when DOM is ready
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initializeTweaks();
  } else {
    document.addEventListener("DOMContentLoaded", initializeTweaks);
  }

  console.log(`${consolePrefix} Initialized. Press Shift + ${navigator.userAgent.toUpperCase().includes("MAC") ? 'Cmd' : 'Alt'} + T to toggle settings.`);

})();
