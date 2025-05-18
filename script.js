function () {
  "use strict";

  const settingsKeys = {
    hideTeams: "tweak_hideTeams",
    hideKB: "tweak_hideKB",
    hideLogo: "tweak_hideLogo",
    hideProfile: "tweak_hideProfile",
    hideChatProfiles: "tweak_hideChatProfiles",
    hidePinnedChars: "tweak_hidePinnedChars",
    newChatButtonColor: "tweak_newChatButtonColor",
    workspaceIconColor: "tweak_workspaceIconColor",
    workspaceFontColor: "tweak_workspaceFontColor",
    customPageTitle: "tweak_customPageTitle",
    showModalButton: "tweak_showModalButton",
    customFontUrl: "tweak_customFontUrl",
    customFontFamily: "tweak_customFontFamily", // Used by both manual input and local font dropdown
    customFontSize: "tweak_customFontSize",
  };

  const consolePrefix = "TypingMind Tweaks:";
  const defaultNewChatButtonColor = "#2563eb";
  const defaultWorkspaceIconColorVisual = "#9ca3af";
  const defaultWorkspaceFontColorVisual = "#d1d5db";
  
  /* -----  LOCAL-FONT helper: List of common system fonts  ----- */
  const commonLocalFonts = [
    { label: "Default (Browser)", value: "" },
    { label: "Arial", value: "Arial" },
    { label: "Helvetica", value: "Helvetica" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Georgia", value: "Georgia" },
    { label: "Courier New", value: "Courier New" },
    { label: "Verdana", value: "Verdana" },
    { label: "Tahoma", value: "Tahoma" },
    { label: "Trebuchet MS", value: "Trebuchet MS" },
    { label: "Comic Sans MS", value: "Comic Sans MS" },
  ];

  let originalPageTitle = null;
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
    try {
        return value === null ? defaultValue : JSON.parse(value);
    } catch (e) {
        console.warn(`${consolePrefix} Error parsing setting ${key}:`, e, "using default value.");
        return defaultValue;
    }
  }

  function applyStylesBasedOnSettings() {
    const hideTeams = getSetting(settingsKeys.hideTeams);
    const hideKB = getSetting(settingsKeys.hideKB);
    const hideLogo = getSetting(settingsKeys.hideLogo);
    const hideProfile = getSetting(settingsKeys.hideProfile);
    const hideChatProfiles = getSetting(settingsKeys.hideChatProfiles);
    const hidePinnedChars = getSetting(settingsKeys.hidePinnedChars);
    const newChatColor = getSetting(settingsKeys.newChatButtonColor, null);
    const wsIconColor = getSetting(settingsKeys.workspaceIconColor, null);
    const wsFontColor = getSetting(settingsKeys.workspaceFontColor, null);
    const showModalButtonSetting = getSetting(
      settingsKeys.showModalButton,
      true
    );
    const teamsButton = document.querySelector(
      'button[data-element-id="workspace-tab-teams"]'
    );
    if (teamsButton) {
      const newDisplay = hideTeams ? "none" : "";
      if (teamsButton.style.display !== newDisplay) {
        teamsButton.style.display = newDisplay;
      }
    }

    const workspaceBar = document.querySelector(
      'div[data-element-id="workspace-bar"]'
    );
    if (workspaceBar) {
      const buttons = workspaceBar.querySelectorAll("button");
      buttons.forEach((button) => {
        const textSpan = button.querySelector("span > span");
        if (textSpan && textSpan.textContent.trim() === "KB") {
          const newDisplay = hideKB ? "none" : "";
          if (button.style.display !== newDisplay) {
            button.style.display = newDisplay;
          }
          return;
        }
      });
    }
    const logoImage = document.querySelector(
      'img[alt="TypingMind"][src="/logo.png"]'
    );
    let logoContainerDiv = null;
    if (
      logoImage &&
      logoImage.parentElement &&
      logoImage.parentElement.parentElement &&
      logoImage.parentElement.parentElement.tagName === "DIV"
    ) {
      logoContainerDiv = logoImage.parentElement.parentElement;
    }
    if (logoContainerDiv) {
      const newDisplay = hideLogo ? "none" : "";
      if (logoContainerDiv.style.display !== newDisplay) {
        logoContainerDiv.style.display = newDisplay;
      }
    }
    const profileButton = document.querySelector(
      'button[data-element-id="workspace-profile-button"]'
    );
    if (profileButton) {
      const newDisplay = hideProfile ? "none" : "";
      if (profileButton.style.display !== newDisplay) {
        profileButton.style.display = newDisplay;
      }
    }
    const chatProfileSpans = document.querySelectorAll("span");
    chatProfileSpans.forEach((span) => {
      if (span.textContent.trim() === "Chat Profiles") {
        const button = span.closest("button");
        if (button) {
          const newDisplay = hideChatProfiles ? "none" : "";
          if (button.style.display !== newDisplay) {
            button.style.display = newDisplay;
          }
        }
      }
    });
    const pinnedCharsContainer = document.querySelector(
      'div[data-element-id="pinned-characters-container"]'
    );
    if (pinnedCharsContainer) {
      const newDisplay = hidePinnedChars ? "none" : "";
      if (pinnedCharsContainer.style.display !== newDisplay) {
        pinnedCharsContainer.style.display = newDisplay;
      }
    }
    const newChatButton = document.querySelector(
      'button[data-element-id="new-chat-button-in-side-bar"]'
    );
    if (newChatButton) {
      if (newChatColor) {
        if (newChatButton.style.backgroundColor !== newChatColor) {
          newChatButton.style.backgroundColor = newChatColor;
        }
      } else {
        if (newChatButton.style.backgroundColor !== "") {
          newChatButton.style.backgroundColor = "";
        }
      }
    }
    if (workspaceBar) {
      const icons = workspaceBar.querySelectorAll("svg");
      icons.forEach((icon) => {
        if (wsIconColor) {
          if (icon.style.color !== wsIconColor) {
            icon.style.color = wsIconColor;
          }
        } else {
          if (icon.style.color !== "") {
            icon.style.color = "";
          }
        }
      });
    }
    if (workspaceBar) {
      const textSpans = workspaceBar.querySelectorAll("span");
      textSpans.forEach((span) => {
        if (span.textContent.trim()) {
          if (wsFontColor) {
            if (span.style.color !== wsFontColor) {
              span.style.color = wsFontColor;
            }
          } else {
            if (span.style.color !== "") {
              span.style.color = "";
            }
          }
        }
      });
    }
    if (workspaceBar) {
      let tweaksButton = document.getElementById("workspace-tab-tweaks");
      if (tweaksButton) {
        const svgIcon = tweaksButton.querySelector("svg");
        if (svgIcon) {
          const currentWsIconColor = getSetting(
            settingsKeys.workspaceIconColor,
            null
          );
          const newColor =
            currentWsIconColor || defaultWorkspaceIconColorVisual;
          if (svgIcon.style.color !== newColor) {
            svgIcon.style.color = newColor;
          }
        }
        const newDisplay = showModalButtonSetting ? "inline-flex" : "none";
        if (tweaksButton.style.display !== newDisplay) {
          tweaksButton.style.display = newDisplay;
        }
      }
    }
  }

  function applyCustomTitle() {
    const customTitleSetting = getSetting(settingsKeys.customPageTitle, null); // Use getSetting for consistency
    const customTitle = (typeof customTitleSetting === 'string') ? customTitleSetting.trim() : "";

    if (customTitle !== "") {
      if (document.title !== customTitle) {
        document.title = customTitle;
      }
    } else {
      if (originalPageTitle && document.title !== originalPageTitle) {
        document.title = originalPageTitle;
      }
    }
  }
  
  let modalOverlay = null;
  let modalElement = null;
  let feedbackElement = null;

  function createSettingsModal() {
    if (document.getElementById("tweak-modal-overlay")) return;
    const styles = `
      #tweak-modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: none; 
        justify-content: center; align-items: center; z-index: 10001;
        font-family: sans-serif;
      }
      #tweak-modal {
        background-color: #252525; 
        color: #f0f0f0;
        padding: 25px 35px;
        border-radius: 8px;
        min-width: 350px;
        max-width: 550px; /* Increased max-width for new dropdown */
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
      .tweak-color-item {
          margin-top: 20px; 
          padding-top: 15px;
          border-top: 1px solid #4a4a4a; 
          display: flex;
          align-items: center;
          justify-content: space-between; 
       }
      .tweak-color-item label {
          margin-right: 10px;
          color: #e0e0e0;
          font-size: 1em;
       }
       .tweak-color-input-wrapper {
            display: flex;
            align-items: center;
       }
      .tweak-color-item input[type='color'] {
          width: 40px;
          height: 30px;
          border: 1px solid #777;
          border-radius: 4px;
          cursor: pointer;
          background-color: #555; 
          margin-right: 10px;
          padding: 2px; 
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
      .tweak-text-item {
          margin-top: 15px; /* Adjusted margin for tighter packing */
          display: flex;
          align-items: center;
      }
      .tweak-text-item label {
          color: #e0e0e0;
          font-size: 1em;
          white-space: nowrap; 
          margin-right: 10px; /* Ensure spacing for all labels */
      }
      .tweak-text-input-wrapper {
           display: flex;
           align-items: center;
           flex-grow: 1; 
      }
      .tweak-text-item input[type='text'], .tweak-text-item input[type='number'], .tweak-text-item select { /* Added select */
          flex-grow: 1; 
          flex-shrink: 1; 
          min-width: 50px; 
          flex-basis: auto; 
          padding: 6px 10px;
          border: 1px solid #777;
          margin-right: 10px;
          border-radius: 4px;
          background-color: #555;
          color: #f0f0f0;
          font-size: 0.9em;
      }
       .tweak-text-item input[type='text']::placeholder,
       .tweak-text-item input[type='number']::placeholder {
         color: #a0a0a0; /* Slightly lighter placeholder */
         opacity: 0.7; 
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
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    modalOverlay = document.createElement("div");
    modalOverlay.id = "tweak-modal-overlay";
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        toggleModal(false);
      }
    });
    modalElement = document.createElement("div");
    modalElement.id = "tweak-modal";
    const header = document.createElement("h2");
    header.textContent = "UI Tweaks";
    feedbackElement = document.createElement("p");
    feedbackElement.id = "tweak-modal-feedback";
    feedbackElement.textContent = " ";
    const scrollableContent = document.createElement("div");
    scrollableContent.id = "tweak-modal-scrollable-content";

    const settingsSection = document.createElement("div");
    settingsSection.className = "tweak-settings-section";
    const checkboxContainer = document.createElement("div");
    const settings = [
      { key: settingsKeys.hideTeams, label: "Hide 'Teams' menu item" },
      { key: settingsKeys.hideKB, label: "Hide 'KB' menu item" },
      { key: settingsKeys.hideLogo, label: "Hide Logo & Announcement section" },
      { key: settingsKeys.hideProfile, label: "Hide 'Profile' button" },
      {
        key: settingsKeys.hideChatProfiles,
        label: "Hide 'Chat Profiles' button",
      },
      {
        key: settingsKeys.hidePinnedChars,
        label: "Hide 'Characters' in New Chat",
      },
      {
        key: settingsKeys.showModalButton,
        label: "Show 'Tweaks' Button in Menu",
        defaultValue: true,
      },
    ];
    settings.forEach((setting) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "tweak-checkbox-item";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = setting.key;
      checkbox.name = setting.key;
      checkbox.checked = getSetting(setting.key, setting.defaultValue === true);
      checkbox.addEventListener("change", (event) =>
        saveSetting(setting.key, event.target.checked)
      );
      const label = document.createElement("label");
      label.htmlFor = setting.key;
      label.textContent = setting.label;
      itemDiv.appendChild(checkbox);
      itemDiv.appendChild(label);
      checkboxContainer.appendChild(itemDiv);
    });
    settingsSection.appendChild(checkboxContainer);

    const colorPickerSection = document.createElement("div");
    colorPickerSection.className = "tweak-color-item";
    // ... (color picker for newChatButtonColor - no changes)
    const colorLabel = document.createElement("label");
    colorLabel.htmlFor = "tweak_newChatButtonColor_input";
    colorLabel.textContent = "New Chat Button Color:";
    const colorInputWrapper = document.createElement("div");
    colorInputWrapper.className = "tweak-color-input-wrapper";
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.id = "tweak_newChatButtonColor_input";
    colorInput.addEventListener("input", (event) => {
      saveSetting(settingsKeys.newChatButtonColor, event.target.value);
    });
    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset";
    resetButton.className = "tweak-reset-button";
    resetButton.type = "button";
    resetButton.addEventListener("click", () => {
      saveSetting(settingsKeys.newChatButtonColor, null); // Pass null to remove
      colorInput.value = defaultNewChatButtonColor; // Reset UI to default visual
    });
    colorInputWrapper.appendChild(colorInput);
    colorInputWrapper.appendChild(resetButton);
    colorPickerSection.appendChild(colorLabel);
    colorPickerSection.appendChild(colorInputWrapper);


    const wsIconColorPickerSection = document.createElement("div");
    wsIconColorPickerSection.className = "tweak-color-item";
    // ... (color picker for workspaceIconColor - no changes)
    const wsIconColorLabel = document.createElement("label");
    wsIconColorLabel.htmlFor = "tweak_workspaceIconColor_input";
    wsIconColorLabel.textContent = "Menu Icon Color:";
    const wsIconColorInputWrapper = document.createElement("div");
    wsIconColorInputWrapper.className = "tweak-color-input-wrapper";
    const wsIconColorInput = document.createElement("input");
    wsIconColorInput.type = "color";
    wsIconColorInput.id = "tweak_workspaceIconColor_input";
    wsIconColorInput.addEventListener("input", (event) => {
      saveSetting(settingsKeys.workspaceIconColor, event.target.value);
    });
    const wsIconResetButton = document.createElement("button");
    wsIconResetButton.textContent = "Reset";
    wsIconResetButton.className = "tweak-reset-button";
    wsIconResetButton.type = "button";
    wsIconResetButton.addEventListener("click", () => {
      saveSetting(settingsKeys.workspaceIconColor, null);
      wsIconColorInput.value = defaultWorkspaceIconColorVisual;
    });
    wsIconColorInputWrapper.appendChild(wsIconColorInput);
    wsIconColorInputWrapper.appendChild(wsIconResetButton);
    wsIconColorPickerSection.appendChild(wsIconColorLabel);
    wsIconColorPickerSection.appendChild(wsIconColorInputWrapper);

    const wsFontColorPickerSection = document.createElement("div");
    wsFontColorPickerSection.className = "tweak-color-item";
    // ... (color picker for workspaceFontColor - no changes)
    const wsFontColorLabel = document.createElement("label");
    wsFontColorLabel.htmlFor = "tweak_workspaceFontColor_input";
    wsFontColorLabel.textContent = "Menu Font Color:";
    const wsFontColorInputWrapper = document.createElement("div");
    wsFontColorInputWrapper.className = "tweak-color-input-wrapper";
    const wsFontColorInput = document.createElement("input");
    wsFontColorInput.type = "color";
    wsFontColorInput.id = "tweak_workspaceFontColor_input";
    wsFontColorInput.addEventListener("input", (event) => {
      saveSetting(settingsKeys.workspaceFontColor, event.target.value);
    });
    const wsFontResetButton = document.createElement("button");
    wsFontResetButton.textContent = "Reset";
    wsFontResetButton.className = "tweak-reset-button";
    wsFontResetButton.type = "button";
    wsFontResetButton.addEventListener("click", () => {
      saveSetting(settingsKeys.workspaceFontColor, null);
      wsFontColorInput.value = defaultWorkspaceFontColorVisual;
    });
    wsFontColorInputWrapper.appendChild(wsFontColorInput);
    wsFontColorInputWrapper.appendChild(wsFontResetButton);
    wsFontColorPickerSection.appendChild(wsFontColorLabel);
    wsFontColorPickerSection.appendChild(wsFontColorInputWrapper);


    const customTitleSection = document.createElement("div");
    customTitleSection.className = "tweak-text-item";
    // ... (custom title input - no changes, but fixed label association)
    const titleLabel = document.createElement("label");
    titleLabel.htmlFor = "tweak_customPageTitle_input"; // Corrected: Added htmlFor
    titleLabel.textContent = "Custom Page Title:";
    const titleInputWrapper = document.createElement("div");
    titleInputWrapper.className = "tweak-text-input-wrapper";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "tweak_customPageTitle_input";
    titleInput.placeholder = "My Awesome Page Title";
    titleInput.addEventListener("input", (event) => {
      // Save directly without JSON.stringify for simple strings
      localStorage.setItem(settingsKeys.customPageTitle, event.target.value || "");
      applyCustomTitle();
      if (feedbackElement) feedbackElement.textContent = "Settings saved.";
    });
    const clearTitleButton = document.createElement("button");
    clearTitleButton.textContent = "Clear";
    clearTitleButton.className = "tweak-reset-button";
    clearTitleButton.type = "button";
    clearTitleButton.addEventListener("click", () => {
      localStorage.removeItem(settingsKeys.customPageTitle);
      titleInput.value = "";
      applyCustomTitle();
      if (feedbackElement) feedbackElement.textContent = "Settings saved.";
    });
    customTitleSection.appendChild(titleLabel); // Added label to section
    titleInputWrapper.appendChild(titleInput);
    titleInputWrapper.appendChild(clearTitleButton);
    customTitleSection.appendChild(titleInputWrapper);


    const fontSettingsContainer = document.createElement("div");
    fontSettingsContainer.className = "tweak-settings-section";
    const fontDescription = document.createElement("p");
    fontDescription.textContent =
      "Import remote font OR select a local system font. URL is for services like Google Fonts.";
    fontDescription.style.marginBottom = "15px";
    fontDescription.style.fontSize = "0.9em";
    fontDescription.style.color = "#ccc";
    fontSettingsContainer.appendChild(fontDescription);

    const customFontSection = document.createElement("div"); // Font URL
    customFontSection.className = "tweak-text-item";
    // ... (custom font URL input - no changes)
    const fontLabel = document.createElement("label");
    fontLabel.htmlFor = "tweak_customFontUrl_input";
    fontLabel.textContent = "Custom Font URL:";
    const fontInputWrapper = document.createElement("div");
    fontInputWrapper.className = "tweak-text-input-wrapper";
    const fontInput = document.createElement("input");
    fontInput.type = "text";
    fontInput.id = "tweak_customFontUrl_input";
    fontInput.placeholder = "e.g., https://fonts.googleapis.com/...";
    fontInput.addEventListener("input", (event) => {
      saveSetting(settingsKeys.customFontUrl, event.target.value || null);
    });
    const clearFontButton = document.createElement("button");
    clearFontButton.textContent = "Clear";
    clearFontButton.className = "tweak-reset-button";
    clearFontButton.type = "button";
    clearFontButton.addEventListener("click", () => {
      saveSetting(settingsKeys.customFontUrl, null);
      fontInput.value = "";
    });
    customFontSection.appendChild(fontLabel); // Added label
    fontInputWrapper.appendChild(fontInput);
    fontInputWrapper.appendChild(clearFontButton);
    customFontSection.appendChild(fontInputWrapper);


    const fontFamilySection = document.createElement("div"); // Manual Font Family Name
    fontFamilySection.className = "tweak-text-item";
    // ... (custom font family input - event listener will be updated)
    const fontFamilyLabel = document.createElement("label");
    fontFamilyLabel.htmlFor = "tweak_customFontFamily_input";
    fontFamilyLabel.textContent = "Font Family Name:";
    const fontFamilyInputWrapper = document.createElement("div");
    fontFamilyInputWrapper.className = "tweak-text-input-wrapper";
    const fontFamilyInput = document.createElement("input");
    fontFamilyInput.type = "text";
    fontFamilyInput.id = "tweak_customFontFamily_input";
    fontFamilyInput.placeholder = "e.g., 'Roboto', 'Arial'";
    fontFamilyInput.addEventListener("input", (event) => {
      const typedValue = event.target.value;
      saveSetting(settingsKeys.customFontFamily, typedValue || null);
      // Sync the local font dropdown
      const localFontDropdown = document.getElementById("tweak_localFont_select");
      if (localFontDropdown) {
        localFontDropdown.value = typedValue || ""; // If typed matches a local font, it will select it
      }
      if (feedbackElement) feedbackElement.textContent = "Settings saved.";
    });
    const clearFontFamilyButton = document.createElement("button");
    clearFontFamilyButton.textContent = "Clear";
    clearFontFamilyButton.className = "tweak-reset-button";
    clearFontFamilyButton.type = "button";
    clearFontFamilyButton.addEventListener("click", () => {
      saveSetting(settingsKeys.customFontFamily, null);
      fontFamilyInput.value = "";
      const localFontDropdown = document.getElementById("tweak_localFont_select");
      if (localFontDropdown) {
        localFontDropdown.value = ""; // Reset dropdown to default
      }
    });
    fontFamilySection.appendChild(fontFamilyLabel); // Added label
    fontFamilyInputWrapper.appendChild(fontFamilyInput);
    fontFamilyInputWrapper.appendChild(clearFontFamilyButton);
    fontFamilySection.appendChild(fontFamilyInputWrapper);

    /* === NEW: Local Font Selection Dropdown === */
    const localFontDropdownSection = document.createElement("div");
    localFontDropdownSection.className = "tweak-text-item";

    const localFontLabel = document.createElement("label");
    localFontLabel.htmlFor = "tweak_localFont_select";
    localFontLabel.textContent = "Local Font (System):";

    const localFontSelect = document.createElement("select");
    localFontSelect.id = "tweak_localFont_select";
    // Styling will be inherited from .tweak-text-item select CSS

    commonLocalFonts.forEach(font => {
        const option = document.createElement("option");
        option.value = font.value;
        option.textContent = font.label;
        localFontSelect.appendChild(option);
    });

    localFontSelect.addEventListener("change", (event) => {
        const selectedFont = event.target.value;
        saveSetting(settingsKeys.customFontFamily, selectedFont || null);
        // Sync the manual font family input field
        if (fontFamilyInput) {
            fontFamilyInput.value = selectedFont;
        }
        if (feedbackElement) feedbackElement.textContent = "Settings saved.";
    });
    localFontDropdownSection.appendChild(localFontLabel);
    localFontDropdownSection.appendChild(localFontSelect);
    // No clear button for dropdown, as "Default" serves that purpose.

    const fontSizeSection = document.createElement("div"); // Font Size
    fontSizeSection.className = "tweak-text-item";
    // ... (font size input - no changes other than label association and minor style adj)
    const fontSizeLabel = document.createElement("label");
    fontSizeLabel.htmlFor = "tweak_customFontSize_input";
    fontSizeLabel.textContent = "Font Size (px):";
    // fontSizeLabel.style.marginRight = "10px"; // Covered by general .tweak-text-item label style
    const fontSizeInputWrapper = document.createElement("div");
    fontSizeInputWrapper.className = "tweak-text-input-wrapper";
    const fontSizeInput = document.createElement("input");
    fontSizeInput.type = "number";
    fontSizeInput.id = "tweak_customFontSize_input";
    fontSizeInput.placeholder = "e.g., 16";
    fontSizeInput.min = "8";
    fontSizeInput.step = "1";
    // fontSizeInput.style.flexGrow = "1"; // Covered by general .tweak-text-item input style
    // fontSizeInput.style.padding = "6px 10px"; // Covered
    // fontSizeInput.style.border = "1px solid #777"; // Covered
    // fontSizeInput.style.borderRadius = "4px"; // Covered
    // fontSizeInput.style.backgroundColor = "#555"; // Covered
    // fontSizeInput.style.color = "#f0f0f0"; // Covered
    // fontSizeInput.style.fontSize = "0.9em"; // Covered
    // fontSizeInput.style.marginRight = "10px"; // Covered
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
      // No specific error message if value is below min, browser handles it.
      if (feedbackElement) feedbackElement.textContent = "Settings saved.";
    });
    const clearFontSizeButton = document.createElement("button");
    clearFontSizeButton.textContent = "Clear";
    clearFontSizeButton.className = "tweak-reset-button";
    clearFontSizeButton.type = "button";
    clearFontSizeButton.addEventListener("click", () => {
      saveSetting(settingsKeys.customFontSize, null);
      fontSizeInput.value = "";
    });
    fontSizeSection.appendChild(fontSizeLabel); // Added label
    fontSizeInputWrapper.appendChild(fontSizeInput);
    fontSizeInputWrapper.appendChild(clearFontSizeButton);
    fontSizeSection.appendChild(fontSizeInputWrapper);


    // Append Font Setting Elements in Order
    fontSettingsContainer.appendChild(customFontSection);    // URL
    fontSettingsContainer.appendChild(fontFamilySection);   // Manual Family Name
    fontSettingsContainer.appendChild(localFontDropdownSection); // NEW: Local Font Dropdown
    fontSettingsContainer.appendChild(fontSizeSection);     // Size


    scrollableContent.appendChild(settingsSection);
    scrollableContent.appendChild(colorPickerSection);
    scrollableContent.appendChild(wsIconColorPickerSection);
    scrollableContent.appendChild(wsFontColorPickerSection);
    scrollableContent.appendChild(customTitleSection);

    const divider = document.createElement("hr");
    divider.style.borderColor = "#4a4a4a";
    divider.style.borderTopWidth = "1px";
    divider.style.marginTop = "20px";
    divider.style.marginBottom = "20px";
    scrollableContent.appendChild(divider);
    scrollableContent.appendChild(fontSettingsContainer);

    const footer = document.createElement("div");
    footer.className = "tweak-modal-footer";
    const closeButtonBottom = document.createElement("button");
    closeButtonBottom.id = "tweak-modal-bottom-close";
    closeButtonBottom.textContent = "Close";
    closeButtonBottom.addEventListener("click", () => toggleModal(false));
    footer.appendChild(closeButtonBottom);

    modalElement.appendChild(header);
    modalElement.appendChild(feedbackElement);
    modalElement.appendChild(scrollableContent);
    modalElement.appendChild(footer);
    modalOverlay.appendChild(modalElement);
    document.body.appendChild(modalOverlay);
  }

  function loadSettingsIntoModal() {
    if (!modalElement) return;
    const settingsMetadata = [
      { key: settingsKeys.hideTeams, defaultValue: false },
      { key: settingsKeys.hideKB, defaultValue: false },
      { key: settingsKeys.hideLogo, defaultValue: false },
      { key: settingsKeys.hideProfile, defaultValue: false },
      { key: settingsKeys.hideChatProfiles, defaultValue: false },
      { key: settingsKeys.hidePinnedChars, defaultValue: false },
      { key: settingsKeys.showModalButton, defaultValue: true },
    ];
    settingsMetadata.forEach(({ key, defaultValue }) => {
        const checkbox = document.getElementById(key);
        if (checkbox) {
          checkbox.checked = getSetting(key, defaultValue);
        } else {
          console.warn(
            `${consolePrefix} Checkbox element not found for ID: ${key}`
          );
        }
    });

    const newChatColorInput = document.getElementById(
      "tweak_newChatButtonColor_input"
    );
    if (newChatColorInput) {
      newChatColorInput.value = getSetting(
        settingsKeys.newChatButtonColor,
        defaultNewChatButtonColor // Use default if null
      );
    }

    const wsIconColorInput = document.getElementById(
      "tweak_workspaceIconColor_input"
    );
    if (wsIconColorInput) {
      wsIconColorInput.value = getSetting(
        settingsKeys.workspaceIconColor,
        defaultWorkspaceIconColorVisual
      );
    }

    const wsFontColorInput = document.getElementById(
      "tweak_workspaceFontColor_input"
    );
    if (wsFontColorInput) {
      wsFontColorInput.value = getSetting(
        settingsKeys.workspaceFontColor,
        defaultWorkspaceFontColorVisual
      );
    }

    const titleInput = document.getElementById("tweak_customPageTitle_input");
    if (titleInput) {
      // Retrieve as simple string, not JSON parsed
      titleInput.value = localStorage.getItem(settingsKeys.customPageTitle) || "";
    }

    const fontInput = document.getElementById("tweak_customFontUrl_input");
    if (fontInput) {
      fontInput.value = cleanValue(getSetting(settingsKeys.customFontUrl, "")) || "";
    }

    const fontFamilyManualInput = document.getElementById(
      "tweak_customFontFamily_input"
    );
    const storedFontFamily = getSetting(settingsKeys.customFontFamily, "");
    if (fontFamilyManualInput) {
      fontFamilyManualInput.value = cleanValue(storedFontFamily) || "";
    }
    
    /* === NEW: Load setting into Local Font Dropdown === */
    const localFontSelect = document.getElementById("tweak_localFont_select");
    if (localFontSelect) {
        localFontSelect.value = cleanValue(storedFontFamily) || ""; // Set dropdown to stored family name
    }


    const fontSizeInput = document.getElementById("tweak_customFontSize_input");
    if (fontSizeInput) {
      const storedSize = getSetting(settingsKeys.customFontSize, null);
      fontSizeInput.value = (typeof storedSize === 'number' && storedSize > 0) ? storedSize : "";
    }

    if (feedbackElement) feedbackElement.textContent = " ";
  }

  function saveSetting(key, value) {
    try {
      if (value === null || value === undefined || (typeof value === 'string' && value.trim() === "")) { // More robust check for empty/null
        localStorage.removeItem(key);
      } else {
        // For all settings except customPageTitle (which is stored raw), stringify.
        // customPageTitle is handled directly in its event listener.
        if (key !== settingsKeys.customPageTitle) {
            localStorage.setItem(key, JSON.stringify(value));
        }
      }

      if (feedbackElement) {
        feedbackElement.textContent = "Settings saved.";
      }
      applyStylesBasedOnSettings(); // General styles
      if (
        key === settingsKeys.customFontUrl ||
        key === settingsKeys.customFontFamily || // This now covers local fonts too
        key === settingsKeys.customFontSize
      ) {
        applyCustomFont(); // Apply font changes
      }
    } catch (error) {
      console.error(`${consolePrefix} Error saving setting ${key}:`, error);
      if (feedbackElement) {
        feedbackElement.textContent = "Error saving settings.";
      }
    }
  }

  function toggleModal(forceState) {
    if (!modalOverlay) {
      console.warn(`${consolePrefix} Modal overlay not found.`);
      return;
    }
    const currentComputedDisplay =
      window.getComputedStyle(modalOverlay).display;
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

  document.addEventListener("keydown", (event) => {
    const isMac = navigator.userAgent.toUpperCase().includes("MAC");
    const modifierPressed = isMac ? event.metaKey : event.altKey;
    if (event.shiftKey && modifierPressed && event.key.toUpperCase() === "T") {
      event.preventDefault();
      event.stopPropagation();
      toggleModal();
    }
  });

  function initializeTweaks() {
    if (originalPageTitle === null) {
      originalPageTitle = document.title;
    }
    applyStylesBasedOnSettings();
    applyCustomTitle();
    applyCustomFont();
  }

  createSettingsModal(); // Create modal structure once

  const observer = new MutationObserver((mutationsList) => {
    // Re-apply styles and check for button, but less frequently or more targeted if perf issues arise
    applyStylesBasedOnSettings();
    applyCustomTitle(); // Potentially less needed on every mutation
    // applyCustomFont(); // Usually only changes on settings save

    const workspaceBar = document.querySelector(
      'div[data-element-id="workspace-bar"]'
    );
    if (workspaceBar) {
      let tweaksButton = document.getElementById("workspace-tab-tweaks");
      const settingsButton = workspaceBar.querySelector(
        'button[data-element-id="workspace-tab-settings"]'
      );
      
      if (!tweaksButton && settingsButton) { // Simplified check: if no tweaks button but settings button exists
        const syncButton = workspaceBar.querySelector( // For style reference
            'button[data-element-id="workspace-tab-cloudsync"]'
        );
        const profileButton = document.querySelector( // Fallback style reference
            'button[data-element-id="workspace-profile-button"]'
        );
        const styleReferenceButton = syncButton || profileButton || settingsButton; // Best effort for style

        tweaksButton = document.createElement("button");
        tweaksButton.id = "workspace-tab-tweaks";
        tweaksButton.title = "Open UI Tweaks (Shift+Alt/Cmd+T)";
        tweaksButton.dataset.elementId = "workspace-tab-tweaks";
        
        if (styleReferenceButton) { // Copy class from reference if found
             tweaksButton.className = styleReferenceButton.className;
        } else {
            // Basic fallback class if needed, though should not happen if settingsButton exists
            // tweaksButton.className = "some-default-button-class"; 
        }

        const outerSpan = document.createElement("span");
        const styleReferenceOuterSpan = styleReferenceButton ? styleReferenceButton.querySelector(":scope > span") : null;
        if (styleReferenceOuterSpan) {
          outerSpan.className = styleReferenceOuterSpan.className;
        }

        const iconDiv = document.createElement("div");
        const styleReferenceIconDiv = styleReferenceOuterSpan ? styleReferenceOuterSpan.querySelector(":scope > div") : null;
        if (styleReferenceIconDiv) {
          iconDiv.className = styleReferenceIconDiv.className;
        }
        iconDiv.style.position = "relative"; 
        iconDiv.style.display = "flex";
        iconDiv.style.justifyContent = "center";
        iconDiv.style.alignItems = "center";

        const svgIcon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svgIcon.setAttribute("class", "w-5 h-5 flex-shrink-0"); // Common class
        svgIcon.setAttribute("width", "18px");
        svgIcon.setAttribute("height", "18px");
        svgIcon.setAttribute("viewBox", "0 0 24 24");
        svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        const currentWsIconColor = getSetting(
          settingsKeys.workspaceIconColor,
          defaultWorkspaceIconColorVisual // Use default if null
        );
        svgIcon.style.color = currentWsIconColor;
        svgIcon.setAttribute("fill", "currentColor");

        const svgPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        svgPath.setAttribute(
          "d",
          "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4c-.83 0-1.5-.67-1.5-1.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
        );
        svgIcon.appendChild(svgPath);
        iconDiv.appendChild(svgIcon);

        const textSpan = document.createElement("span");
         if (styleReferenceOuterSpan) { // Try to get class for text span too
            const refTextSpan = styleReferenceOuterSpan.querySelector("span:not([class*='sr-only'])"); // Avoid screen reader only spans
            if (refTextSpan) textSpan.className = refTextSpan.className;
         }
        if (!textSpan.className) { // Fallback if no class found
             textSpan.className = "font-normal self-stretch text-center text-xs leading-4 md:leading-none";
        }
        textSpan.textContent = "Tweaks";

        outerSpan.appendChild(iconDiv);
        outerSpan.appendChild(textSpan);
        tweaksButton.appendChild(outerSpan);

        tweaksButton.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleModal(true);
        });
        if (settingsButton.parentNode) {
          settingsButton.parentNode.insertBefore(tweaksButton, settingsButton);
          const showModalButtonSetting = getSetting(
            settingsKeys.showModalButton,
            true
          );
          tweaksButton.style.display = showModalButtonSetting ? (styleReferenceButton?.style.display || "inline-flex") : "none";
        } else {
          console.warn(
            `${consolePrefix} Could not insert Tweaks button, settings button has no parent node.`
          );
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    initializeTweaks();
  } else {
    document.addEventListener("DOMContentLoaded", initializeTweaks);
  }
  console.log(
    `${consolePrefix} Initialized. Press Shift+Alt+T (Win/Linux) or Shift+Cmd+T (Mac) for settings.`
  );

  function applyCustomFont() {
    // Get settings using the getSetting helper for consistency and parsing
    const customFontUrl = getSetting(settingsKeys.customFontUrl, null);
    const customFontFamily = getSetting(settingsKeys.customFontFamily, null);
    const customFontSize = getSetting(settingsKeys.customFontSize, null);

    const styleId = "tweak-custom-font-style";
    let styleElement = document.getElementById(styleId);
    let cssRules = [];

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    const cleanedUrl = cleanValue(customFontUrl); // cleanValue is fine for URL string
    const cleanedFamily = cleanValue(customFontFamily); // cleanValue for font family string
    // FontSize is a number or null from getSetting, no need for cleanValue
    
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

    let commonFontStyles = [];
    if (cleanedFamily && cleanedFamily.trim() !== "") {
      let fontFamilyValue = cleanedFamily.trim();
      // Add quotes if font family name contains spaces and isn't already quoted (robustly)
      if (fontFamilyValue.includes(" ") && !(/^['"].*['"]$/.test(fontFamilyValue))) {
        fontFamilyValue = `'${fontFamilyValue}'`;
      }
      commonFontStyles.push(`  font-family: ${fontFamilyValue} !important;`);
    }

    if (typeof customFontSize === 'number' && customFontSize > 0) {
      commonFontStyles.push(`  font-size: ${customFontSize}px !important;`);
    }

    // Apply to chat content and overall UI elements for broader font application
    if (commonFontStyles.length > 0) {
      const rulesString = commonFontStyles.join("\n");
      // More general selectors for wider font application
      cssRules.push(`
body, button, input, select, textarea,
[data-element-id="chat-space-middle-part"] .prose,
[data-element-id="chat-space-middle-part"] .prose-sm,
[data-element-id="chat-space-middle-part"] .text-sm,
[data-element-id="chat-input-textarea"] {
${rulesString}
}
      `);
      // If only font size is set, ensure it applies broadly too
      if (typeof customFontSize === 'number' && customFontSize > 0 && !cleanedFamily) {
           cssRules.push(`
body, button, input, select, textarea, [data-element-id="chat-input-textarea"] {
    font-size: ${customFontSize}px !important;
}
           `);
      }
    }
    
    const newStyleContent = cssRules.join("\n");
    if (styleElement.textContent !== newStyleContent) {
      styleElement.textContent = newStyleContent;
    }
  }
})();
