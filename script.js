(function () {
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
    customFontFamily: "tweak_customFontFamily", // For URL-based font
    localFontFamily: "tweak_localFontFamily", // New: For local font
    customFontSize: "tweak_customFontSize",
  };

  const consolePrefix = "TypingMind Tweaks:";
  const defaultNewChatButtonColor = "#2563eb";
  const defaultWorkspaceIconColorVisual = "#9ca3af";
  const defaultWorkspaceFontColorVisual = "#d1d5db";
  let originalPageTitle = null;

  const cleanValue = (value) => {
    if (value === null || typeof value === 'undefined') return null;
    let cleaned = String(value).trim(); // Ensure it's a string before trimming
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
    // Ensure that when parsing, if it's 'null' string from old saves, it becomes actual null
    if (value === "null" || value === null) {
        return defaultValue;
    }
    try {
        return JSON.parse(value);
    } catch (e) {
        // If parsing fails (e.g., it's a raw string not meant to be JSON), return the raw value
        // This is important for string settings like font names or URLs
        return value;
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
    } else {
      // console.log(`${consolePrefix} Teams button not found.`);
    }

    const workspaceBar = document.querySelector(
      'div[data-element-id="workspace-bar"]'
    );
    let kbButtonFound = false;
    if (workspaceBar) {
      const buttons = workspaceBar.querySelectorAll("button");
      buttons.forEach((button) => {
        const textSpan = button.querySelector("span > span");
        if (textSpan && textSpan.textContent.trim() === "KB") {
          kbButtonFound = true;
          const newDisplay = hideKB ? "none" : "";
          if (button.style.display !== newDisplay) {
            button.style.display = newDisplay;
          }
          return;
        }
      });
    }
    // if (!kbButtonFound) console.log(`${consolePrefix} KB button not found.`);

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
    } else {
      // console.log(`${consolePrefix} Logo container not found.`);
    }
    const profileButton = document.querySelector(
      'button[data-element-id="workspace-profile-button"]'
    );
    if (profileButton) {
      const newDisplay = hideProfile ? "none" : "";
      if (profileButton.style.display !== newDisplay) {
        profileButton.style.display = newDisplay;
      }
    } else {
      // console.log(`${consolePrefix} Profile button not found.`);
    }
    const chatProfileSpans = document.querySelectorAll("span");
    let chatProfileButtonFound = false;
    chatProfileSpans.forEach((span) => {
      if (span.textContent.trim() === "Chat Profiles") {
        const button = span.closest("button");
        if (button) {
          chatProfileButtonFound = true;
          const newDisplay = hideChatProfiles ? "none" : "";
          if (button.style.display !== newDisplay) {
            button.style.display = newDisplay;
          }
        }
      }
    });
    // if (!chatProfileButtonFound) console.log(`${consolePrefix} Chat Profiles button not found.`);

    const pinnedCharsContainer = document.querySelector(
      'div[data-element-id="pinned-characters-container"]'
    );
    if (pinnedCharsContainer) {
      const newDisplay = hidePinnedChars ? "none" : "";
      if (pinnedCharsContainer.style.display !== newDisplay) {
        pinnedCharsContainer.style.display = newDisplay;
      }
    } else {
      // console.log(`${consolePrefix} Pinned characters container not found.`);
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
          newChatButton.style.backgroundColor = ""; // Reset to default
        }
      }
    } else {
      // console.log(`${consolePrefix} New chat button not found.`);
    }
    if (workspaceBar) {
      const icons = workspaceBar.querySelectorAll("svg");
      icons.forEach((icon) => {
        // Exclude the tweaks button icon from this generic coloring
        if (icon.closest("#workspace-tab-tweaks")) return;
        if (wsIconColor) {
          if (icon.style.color !== wsIconColor) {
            icon.style.color = wsIconColor;
          }
        } else {
          if (icon.style.color !== "") {
            icon.style.color = ""; // Reset to default
          }
        }
      });
    } else {
      // console.log(`${consolePrefix} Workspace bar for icon coloring not found.`);
    }
    if (workspaceBar) {
      const textSpans = workspaceBar.querySelectorAll("span");
      textSpans.forEach((span) => {
        // Exclude the tweaks button text from this generic coloring
        if (span.closest("#workspace-tab-tweaks")) return;

        if (span.textContent.trim()) {
          // Check if it's a direct child span of a button in the workspace bar, common for menu item text
          const parentButton = span.closest('div[data-element-id="workspace-bar"] > div > button > span');
          if (parentButton === span.parentElement) { // Ensure it's the main text span
            if (wsFontColor) {
              if (span.style.color !== wsFontColor) {
                span.style.color = wsFontColor;
              }
            } else {
              if (span.style.color !== "") {
                span.style.color = ""; // Reset to default
              }
            }
          }
        }
      });
    } else {
      // console.log(`${consolePrefix} Workspace bar for font coloring not found.`);
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
    const customTitle = getSetting(settingsKeys.customPageTitle, null); // Use getSetting for consistency
    if (
      customTitle &&
      typeof customTitle === "string" &&
      customTitle.trim() !== ""
    ) {
      if (document.title !== customTitle) {
        document.title = customTitle;
      }
    } else {
      if (originalPageTitle && document.title !== originalPageTitle) {
        document.title = originalPageTitle;
      }
    }
  }
  applyCustomTitle();
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
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      #tweak-modal {
        background-color: #252525; 
        color: #f0f0f0;
        padding: 25px 35px;
        border-radius: 8px;
        min-width: 380px; /* Adjusted min-width */
        max-width: 550px; /* Adjusted max-width */
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
          margin-top: 15px; /* Consistent margin */
          display: flex;
          align-items: center;
          justify-content: space-between; /* Ensure label and input wrapper are spaced */
      }
      .tweak-text-item label {
          color: #e0e0e0;
          font-size: 1em;
          white-space: nowrap; 
          margin-right: 10px; /* Add margin to separate label from input wrapper */
          flex-shrink: 0; /* Prevent label from shrinking */
      }
      .tweak-text-input-wrapper {
           display: flex;
           align-items: center;
           flex-grow: 1; 
      }
      .tweak-text-item input[type='text'], 
      .tweak-text-item input[type='number'] {
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
         color: #aaa; /* Lighter placeholder */
         opacity: 1; 
       }

      #tweak-modal-scrollable-content {
        max-height: calc(80vh - 180px); /* Adjusted max height */
        overflow-y: auto; 
        overflow-x: hidden; 
        padding-right: 10px; /* Adjusted padding for scrollbar */
        margin-right: -10px; 
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
      { key: settingsKeys.hideLogo, label: "Hide Logo & Announcement" },
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
    
    // Color Pickers
    const colorPickerSection = document.createElement("div");
    colorPickerSection.className = "tweak-color-item";
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
      saveSetting(settingsKeys.newChatButtonColor, null); // Save null to reset
      colorInput.value = defaultNewChatButtonColor; // Visually reset input
    });
    colorInputWrapper.appendChild(colorInput);
    colorInputWrapper.appendChild(resetButton);
    colorPickerSection.appendChild(colorLabel);
    colorPickerSection.appendChild(colorInputWrapper);

    const wsIconColorPickerSection = document.createElement("div");
    wsIconColorPickerSection.className = "tweak-color-item";
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

    // Custom Page Title
    const customTitleOuterContainer = document.createElement("div"); // New wrapper for consistent spacing like color pickers
    customTitleOuterContainer.className = "tweak-text-item"; // Use same class for consistent top margin/border
    customTitleOuterContainer.style.borderTop = "1px solid #4a4a4a"; // Add separator line
    customTitleOuterContainer.style.paddingTop = "15px"; // Add padding top

    const titleLabel = document.createElement("label");
    titleLabel.htmlFor = "tweak_customPageTitle_input";
    titleLabel.textContent = "Page Title:";
    const titleInputWrapper = document.createElement("div");
    titleInputWrapper.className = "tweak-text-input-wrapper";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "tweak_customPageTitle_input";
    titleInput.placeholder = "Custom Page Title";
    titleInput.addEventListener("input", (event) => {
      saveSetting(settingsKeys.customPageTitle, event.target.value || null); // Save null if empty
    });
    const clearTitleButton = document.createElement("button");
    clearTitleButton.textContent = "Clear";
    clearTitleButton.className = "tweak-reset-button";
    clearTitleButton.type = "button";
    clearTitleButton.addEventListener("click", () => {
      saveSetting(settingsKeys.customPageTitle, null);
      titleInput.value = "";
    });
    titleInputWrapper.appendChild(titleInput);
    titleInputWrapper.appendChild(clearTitleButton);
    customTitleOuterContainer.appendChild(titleLabel); // Append label first
    customTitleOuterContainer.appendChild(titleInputWrapper); // Then input wrapper


    // Font Settings Section
    const fontSettingsContainer = document.createElement("div");
    fontSettingsContainer.className = "tweak-settings-section"; // Group all font settings
    fontSettingsContainer.style.marginTop = "20px"; // Space above this section

    const fontSectionTitle = document.createElement("h3");
    fontSectionTitle.textContent = "Font Customization";
    fontSectionTitle.style.color = "#e0e0e0";
    fontSectionTitle.style.fontSize = "1.1em";
    fontSectionTitle.style.marginBottom = "15px";
    fontSectionTitle.style.borderBottom = "1px solid #4a4a4a";
    fontSectionTitle.style.paddingBottom = "8px";
    fontSettingsContainer.appendChild(fontSectionTitle);

    // --- NEW: Local Font Family Setting ---
    const localFontDescription = document.createElement("p");
    localFontDescription.textContent = "Use a font installed on your computer. Type the exact font name. This will override the 'Font Family Name' from the URL section below if set.";
    localFontDescription.style.marginBottom = "10px";
    localFontDescription.style.fontSize = "0.9em";
    localFontDescription.style.color = "#ccc";
    fontSettingsContainer.appendChild(localFontDescription);

    const localFontFamilyItem = document.createElement("div");
    localFontFamilyItem.className = "tweak-text-item";
    localFontFamilyItem.style.marginTop = "0"; // No extra top margin as it's first in this sub-section

    const localFontFamilyLabel = document.createElement("label");
    localFontFamilyLabel.htmlFor = "tweak_localFontFamily_input";
    localFontFamilyLabel.textContent = "Local Font:";
    
    const localFontFamilyInputWrapper = document.createElement("div");
    localFontFamilyInputWrapper.className = "tweak-text-input-wrapper";
    const localFontFamilyInput = document.createElement("input");
    localFontFamilyInput.type = "text";
    localFontFamilyInput.id = "tweak_localFontFamily_input";
    localFontFamilyInput.placeholder = "e.g., Arial, Verdana";
    localFontFamilyInput.addEventListener("input", (event) => {
      saveSetting(settingsKeys.localFontFamily, event.target.value || null);
    });
    const clearLocalFontFamilyButton = document.createElement("button");
    clearLocalFontFamilyButton.textContent = "Clear";
    clearLocalFontFamilyButton.className = "tweak-reset-button";
    clearLocalFontFamilyButton.type = "button";
    clearLocalFontFamilyButton.addEventListener("click", () => {
      saveSetting(settingsKeys.localFontFamily, null);
      localFontFamilyInput.value = "";
    });
    localFontFamilyInputWrapper.appendChild(localFontFamilyInput);
    localFontFamilyInputWrapper.appendChild(clearLocalFontFamilyButton);
    localFontFamilyItem.appendChild(localFontFamilyLabel);
    localFontFamilyItem.appendChild(localFontFamilyInputWrapper);
    fontSettingsContainer.appendChild(localFontFamilyItem);
    // --- END NEW: Local Font Family Setting ---

    const fontUrlDescription = document.createElement("p"); // Renamed from fontDescription
    fontUrlDescription.textContent = "Import a font from a URL (e.g., Google Fonts). The URL should point to the CSS file that defines the font faces.";
    fontUrlDescription.style.marginTop = "20px"; // Space before URL section
    fontUrlDescription.style.marginBottom = "10px";
    fontUrlDescription.style.fontSize = "0.9em";
    fontUrlDescription.style.color = "#ccc";
    fontSettingsContainer.appendChild(fontUrlDescription);

    const customFontSection = document.createElement("div");
    customFontSection.className = "tweak-text-item";
    customFontSection.style.marginTop = "0";
    const fontLabel = document.createElement("label");
    fontLabel.htmlFor = "tweak_customFontUrl_input";
    fontLabel.textContent = "Font URL:";
    const fontInputWrapper = document.createElement("div");
    fontInputWrapper.className = "tweak-text-input-wrapper";
    const fontInput = document.createElement("input");
    fontInput.type = "text";
    fontInput.id = "tweak_customFontUrl_input";
    fontInput.placeholder = "Google Fonts URL";
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
    fontInputWrapper.appendChild(fontInput);
    fontInputWrapper.appendChild(clearFontButton);
    customFontSection.appendChild(fontLabel);
    customFontSection.appendChild(fontInputWrapper);
    fontSettingsContainer.appendChild(customFontSection);

    const fontFamilySection = document.createElement("div");
    fontFamilySection.className = "tweak-text-item";
    const fontFamilyLabel = document.createElement("label");
    fontFamilyLabel.htmlFor = "tweak_customFontFamily_input";
    fontFamilyLabel.textContent = "URL Font Family:";
    const fontFamilyInputWrapper = document.createElement("div");
    fontFamilyInputWrapper.className = "tweak-text-input-wrapper";
    const fontFamilyInput = document.createElement("input");
    fontFamilyInput.type = "text";
    fontFamilyInput.id = "tweak_customFontFamily_input";
    fontFamilyInput.placeholder = "Font Name from URL";
    fontFamilyInput.addEventListener("input", (event) => {
      saveSetting(settingsKeys.customFontFamily, event.target.value || null);
    });
    const clearFontFamilyButton = document.createElement("button");
    clearFontFamilyButton.textContent = "Clear";
    clearFontFamilyButton.className = "tweak-reset-button";
    clearFontFamilyButton.type = "button";
    clearFontFamilyButton.addEventListener("click", () => {
      saveSetting(settingsKeys.customFontFamily, null);
      fontFamilyInput.value = "";
    });
    fontFamilyInputWrapper.appendChild(fontFamilyInput);
    fontFamilyInputWrapper.appendChild(clearFontFamilyButton);
    fontFamilySection.appendChild(fontFamilyLabel);
    fontFamilySection.appendChild(fontFamilyInputWrapper);
    fontSettingsContainer.appendChild(fontFamilySection);

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
    fontSizeInput.placeholder = "e.g., 16";
    fontSizeInput.min = "8";
    fontSizeInput.step = "1";
    fontSizeInput.addEventListener("input", (event) => {
      const valueToSave = event.target.value ? parseInt(event.target.value, 10) : null;
      if (valueToSave !== null && valueToSave >= parseInt(fontSizeInput.min, 10)) {
        saveSetting(settingsKeys.customFontSize, valueToSave);
      } else if (valueToSave === null) {
        saveSetting(settingsKeys.customFontSize, null);
      }
    });
    const clearFontSizeButton = document.createElement("button");
    clearFontSizeButton.textContent = "Clear";
    clearFontSizeButton.className = "tweak-reset-button";
    clearFontSizeButton.type = "button";
    clearFontSizeButton.addEventListener("click", () => {
      saveSetting(settingsKeys.customFontSize, null);
      fontSizeInput.value = "";
    });
    fontSizeInputWrapper.appendChild(fontSizeInput);
    fontSizeInputWrapper.appendChild(clearFontSizeButton);
    fontSizeSection.appendChild(fontSizeLabel);
    fontSizeSection.appendChild(fontSizeInputWrapper);
    fontSettingsContainer.appendChild(fontSizeSection);
    
    // Append sections to scrollable content
    scrollableContent.appendChild(settingsSection); // General toggles
    scrollableContent.appendChild(colorPickerSection); // New Chat Button Color
    scrollableContent.appendChild(wsIconColorPickerSection); // Menu Icon Color
    scrollableContent.appendChild(wsFontColorPickerSection); // Menu Font Color
    scrollableContent.appendChild(customTitleOuterContainer); // Custom Page Title
    scrollableContent.appendChild(fontSettingsContainer); // All Font Settings (Local, URL, Size)

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
        // console.warn(`${consolePrefix} Checkbox element not found for ID: ${key}`);
      }
    });

    const newChatColorInput = document.getElementById("tweak_newChatButtonColor_input");
    if (newChatColorInput) {
      newChatColorInput.value = getSetting(settingsKeys.newChatButtonColor, defaultNewChatButtonColor);
    }
    const wsIconColorInput = document.getElementById("tweak_workspaceIconColor_input");
    if (wsIconColorInput) {
      wsIconColorInput.value = getSetting(settingsKeys.workspaceIconColor, defaultWorkspaceIconColorVisual);
    }
    const wsFontColorInput = document.getElementById("tweak_workspaceFontColor_input");
    if (wsFontColorInput) {
      wsFontColorInput.value = getSetting(settingsKeys.workspaceFontColor, defaultWorkspaceFontColorVisual);
    }
    const titleInput = document.getElementById("tweak_customPageTitle_input");
    if (titleInput) {
      titleInput.value = getSetting(settingsKeys.customPageTitle, "");
    }

    // Font settings
    const fontInput = document.getElementById("tweak_customFontUrl_input");
    if (fontInput) {
      fontInput.value = getSetting(settingsKeys.customFontUrl, "");
    }
    const fontFamilyInput = document.getElementById("tweak_customFontFamily_input");
    if (fontFamilyInput) {
      fontFamilyInput.value = getSetting(settingsKeys.customFontFamily, "");
    }
    // NEW: Load Local Font Family
    const localFontFamilyInput = document.getElementById("tweak_localFontFamily_input");
    if (localFontFamilyInput) {
        localFontFamilyInput.value = getSetting(settingsKeys.localFontFamily, "");
    }

    const fontSizeInput = document.getElementById("tweak_customFontSize_input");
    if (fontSizeInput) {
        const storedSize = getSetting(settingsKeys.customFontSize, null);
        fontSizeInput.value = storedSize !== null ? storedSize : "";
    }
    if (feedbackElement) feedbackElement.textContent = " ";
  }

  function saveSetting(key, value) {
    try {
      let valueToStore = value;
      // For text inputs that should be stored as null when empty, handle it here.
      if (key === settingsKeys.customFontUrl || 
          key === settingsKeys.customFontFamily ||
          key === settingsKeys.localFontFamily || // New local font
          key === settingsKeys.customPageTitle) {
        valueToStore = (value && String(value).trim() !== "") ? String(value).trim() : null;
      } else if (key === settingsKeys.customFontSize) {
        valueToStore = (value !== null && !isNaN(parseInt(value,10))) ? parseInt(value,10) : null;
      }


      if (valueToStore === null) {
        localStorage.removeItem(key);
      } else {
        // Store boolean/numbers directly as JSON, strings as is (localStorage stores everything as string anyway)
        if (typeof valueToStore === 'boolean' || typeof valueToStore === 'number') {
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } else {
            localStorage.setItem(key, valueToStore);
        }
      }

      if (feedbackElement) {
        feedbackElement.textContent = "Settings saved.";
        setTimeout(() => {
            if (feedbackElement.textContent === "Settings saved.") {
                 feedbackElement.textContent = " ";
            }
        }, 2000);
      }
      applyStylesBasedOnSettings(); // Apply general styles
      if (key === settingsKeys.customPageTitle) {
        applyCustomTitle(); // Apply title if changed
      }
      if (
        key === settingsKeys.customFontUrl ||
        key === settingsKeys.customFontFamily ||
        key === settingsKeys.localFontFamily || // New: trigger font apply
        key === settingsKeys.customFontSize
      ) {
        applyCustomFont(); // Apply font styles if any font setting changed
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
      // console.warn(`${consolePrefix} Modal overlay not found.`);
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
    const modifierPressed = isMac ? event.metaKey : event.altKey; // Cmd on Mac, Alt on Win/Linux
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
    createSettingsModal(); // Ensure modal is created before trying to apply styles that might depend on it
    applyStylesBasedOnSettings();
    applyCustomTitle();
    applyCustomFont();
  }

  const observer = new MutationObserver((mutationsList) => {
    // Re-apply styles and title on DOM changes.
    // This is kept from original for robustness but can be performance intensive.
    // Consider more targeted observations if performance issues arise.
    applyStylesBasedOnSettings();
    applyCustomTitle();
    applyCustomFont(); // Re-apply custom font as DOM changes might revert it

    const workspaceBar = document.querySelector(
      'div[data-element-id="workspace-bar"]'
    );
    if (workspaceBar) {
      let tweaksButton = document.getElementById("workspace-tab-tweaks");
      const settingsButton = workspaceBar.querySelector(
        'button[data-element-id="workspace-tab-settings"]'
      );
      // Determine reference button for styling (Settings, Sync, or Profile)
      const syncButton = workspaceBar.querySelector('button[data-element-id="workspace-tab-cloudsync"]');
      const profileButton = document.querySelector('button[data-element-id="workspace-profile-button"]'); // This is outside workspaceBar usually
      const referenceButtonForStyle = settingsButton || syncButton || (profileButton ? profileButton.parentElement : null) ;


      if (!tweaksButton && settingsButton && referenceButtonForStyle) {
        tweaksButton = document.createElement("button");
        tweaksButton.id = "workspace-tab-tweaks";
        tweaksButton.title = "Open UI Tweaks (Shift+Alt+T or Shift+Cmd+T)";
        tweaksButton.dataset.elementId = "workspace-tab-tweaks";
        
        // Attempt to copy class names from a suitable reference button
        tweaksButton.className = referenceButtonForStyle.className;

        const outerSpan = document.createElement("span");
        const styleReferenceOuterSpan = referenceButtonForStyle.querySelector(":scope > span");
        if (styleReferenceOuterSpan) {
          outerSpan.className = styleReferenceOuterSpan.className;
        } else {
            // Fallback classes if reference structure is different
            outerSpan.className = "flex flex-col items-center justify-center h-full";
        }


        const iconDiv = document.createElement("div");
        const styleReferenceIconDiv = referenceButtonForStyle.querySelector(":scope > span > div:first-child"); // Assuming icon is first div
        if (styleReferenceIconDiv) {
          iconDiv.className = styleReferenceIconDiv.className;
        } else {
            iconDiv.className = "relative flex items-center justify-center"; // Fallback
        }
        
        const svgIcon = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svgIcon.setAttribute("class", "w-5 h-5 flex-shrink-0"); // Standard icon size
        svgIcon.setAttribute("viewBox", "0 0 24 24");
        svgIcon.setAttribute("fill", "currentColor");
        const currentWsIconColor = getSetting(settingsKeys.workspaceIconColor, defaultWorkspaceIconColorVisual);
        svgIcon.style.color = currentWsIconColor;

        const svgPath = document.createElementNS("http://www.w3.org/2000/svg","path");
        svgPath.setAttribute("d","M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.25 C14.34,2.01,14.12,1.84,13.87,1.84h-3.73c-0.25,0-0.47,0.16-0.53,0.4L9.22,4.65c-0.59,0.24-1.13,0.57-1.62,0.94L5.21,4.63 C4.99,4.56,4.74,4.62,4.62,4.83L2.7,8.15c-0.11,0.2-0.06,0.47,0.12,0.61l2.03,1.58C4.82,10.66,4.8,10.97,4.8,11.3 c0,0.32,0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22 l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.39,2.39c0.05,0.24,0.27,0.41,0.53,0.41h3.73c0.25,0,0.47-0.16,0.53-0.4 l0.39-2.39c0.59-0.24,1.13-0.57,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0.02,0.59-0.22l1.92-3.32 C21.34,13.76,21.28,13.49,21.1,13.35L19.14,12.94z M12,15.3c-1.66,0-3-1.34-3-3s1.34-3,3-3s3,1.34,3,3S13.66,15.3,12,15.3z"); // Settings icon
        svgIcon.appendChild(svgPath);
        iconDiv.appendChild(svgIcon);

        const textSpan = document.createElement("span");
        const styleReferenceTextSpan = referenceButtonForStyle.querySelector(":scope > span > span:last-child"); // Assuming text is last span
        if(styleReferenceTextSpan) {
            textSpan.className = styleReferenceTextSpan.className;
        } else {
            textSpan.className = "font-normal self-stretch text-center text-xs leading-4 md:leading-none"; // Fallback
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
          const showModalButtonSetting = getSetting(settingsKeys.showModalButton, true);
          tweaksButton.style.display = showModalButtonSetting ? "inline-flex" : "none";
        } else {
          // console.warn(`${consolePrefix} Could not insert Tweaks button, settings button has no parent node.`);
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
    `${consolePrefix} Initialized. Shortcut: Shift+Alt+T (Win/Linux) or Shift+Cmd+T (Mac).`
  );

  function applyCustomFont() {
    const customFontUrl = getSetting(settingsKeys.customFontUrl, null);
    const customFontFamilyFromUrl = getSetting(settingsKeys.customFontFamily, null);
    const localFontFamilyUser = getSetting(settingsKeys.localFontFamily, null); // New
    const customFontSizeRaw = getSetting(settingsKeys.customFontSize, null);

    const styleId = "tweak-custom-font-style";
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    let cssRules = [];

    const cleanedUrl = cleanValue(customFontUrl);
    const cleanedFamilyFromUrl = cleanValue(customFontFamilyFromUrl);
    const cleanedLocalFamily = cleanValue(localFontFamilyUser); // New
    const cleanedSize = (customFontSizeRaw !== null && !isNaN(parseInt(customFontSizeRaw, 10)) && parseInt(customFontSizeRaw, 10) > 0) 
                        ? parseInt(customFontSizeRaw, 10) 
                        : null;

    // 1. Add @import rule if URL is provided
    if (cleanedUrl && (cleanedUrl.startsWith("http://") || cleanedUrl.startsWith("https://"))) {
      cssRules.push(`@import url('${cleanedUrl}');`);
    } else if (cleanedUrl) {
      // console.warn(`${consolePrefix} Invalid custom font URL: ${cleanedUrl}`);
    }

    // 2. Determine the effective font family
    let effectiveFontFamily = null;
    if (cleanedLocalFamily && cleanedLocalFamily.trim() !== "") {
      effectiveFontFamily = cleanedLocalFamily.trim();
    } else if (cleanedFamilyFromUrl && cleanedFamilyFromUrl.trim() !== "") {
      effectiveFontFamily = cleanedFamilyFromUrl.trim();
    }

    // Quote font family name if it contains spaces and isn't already quoted
    if (effectiveFontFamily && effectiveFontFamily.includes(" ") && !/^['"].*['"]$/.test(effectiveFontFamily)) {
      effectiveFontFamily = `'${effectiveFontFamily}'`;
    }
    
    const fallbackFontStack = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;
    const finalFontFamilyString = effectiveFontFamily ? `${effectiveFontFamily}, ${fallbackFontStack}` : fallbackFontStack;

    // 3. Build CSS style declarations
    let styleDeclarations = [];
    if (effectiveFontFamily) { // Only add font-family if one is effectively chosen
        styleDeclarations.push(`  font-family: ${finalFontFamilyString} !important;`);
    }
    if (cleanedSize) {
      styleDeclarations.push(`  font-size: ${cleanedSize}px !important;`);
    }

    // 4. Apply styles if any declarations are present
    if (styleDeclarations.length > 0) {
      const declarationsString = styleDeclarations.join("\n");
      // More targeted selectors for TypingMind UI elements
      cssRules.push(`
body { /* Apply font family to body, size might be too disruptive if not specifically set for body */
  ${effectiveFontFamily ? `font-family: ${finalFontFamilyString} !important;` : ""}
  ${cleanedSize && effectiveFontFamily ? `font-size: ${cleanedSize}px !important;` : ""} /* Apply size to body only if font family is also set */
}
input, textarea, button, select,
[contenteditable="true"],
[data-element-id="chat-input-textarea"],
[data-element-id="prompt-editor-textarea"],
[data-element-id="chat-space-middle-part"] .prose,
[data-element-id="chat-space-middle-part"] .prose-sm,
[data-element-id="chat-space-middle-part"] .text-sm,
div[data-radix-scroll-area-viewport] .whitespace-pre-wrap, /* Chat messages */
.cm-editorView, /* CodeMirror editor view if used */
[data-element-id="workspace-bar"] button span span /* Text in workspace bar buttons */
{
${declarationsString}
}
      `);
      // If font size is specified, ensure it also applies to the main chat container as a base
       if (cleanedSize) {
           cssRules.push(`
[data-element-id="chat-space-middle-part"] {
  font-size: ${cleanedSize}px !important;
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
