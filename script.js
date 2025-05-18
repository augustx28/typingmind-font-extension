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
    customFontFamily: "tweak_customFontFamily", // For web font
    customFontSize: "tweak_customFontSize",
    localFontFamily: "tweak_localFontFamily", // NEW: Key for local font family
  };

  const consolePrefix = "TypingMind Tweaks:";
  const defaultNewChatButtonColor = "#2563eb";
  const defaultWorkspaceIconColorVisual = "#9ca3af";
  const defaultWorkspaceFontColorVisual = "#d1d5db";
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
    // Ensure that for boolean settings, we correctly parse "false"
    if (typeof defaultValue === 'boolean' && value !== null) {
        try {
            const parsed = JSON.parse(value);
            return typeof parsed === 'boolean' ? parsed : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }
    return value === null ? defaultValue : JSON.parse(value);
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
    const customTitle = localStorage.getItem(settingsKeys.customPageTitle);
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
        font-family: sans-serif;
      }
      #tweak-modal {
        background-color: #252525;
        color: #f0f0f0;
        padding: 25px 35px;
        border-radius: 8px;
        min-width: 350px;
        max-width: 550px; /* MODIFIED: Slightly wider for new font options */
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
      /* NEW: Subsection titles for font settings */
      .tweak-font-subsection-title {
        margin-top: 20px;
        margin-bottom: 10px;
        color: #e0e0e0;
        font-size: 1.1em;
        font-weight: 500;
        border-bottom: 1px solid #4a4a4a;
        padding-bottom: 5px;
      }
      .tweak-font-subsection-description {
        font-size: 0.85em;
        color: #b0b0b0;
        margin-bottom: 15px;
        margin-top: -5px;
      }
      .tweak-checkbox-item { margin-bottom: 18px; display: flex; align-items: center; }
      .tweak-checkbox-item:last-child { margin-bottom: 5px; }
      .tweak-checkbox-item input[type='checkbox'] {
          margin-right: 15px; transform: scale(1.2); cursor: pointer;
          accent-color: #0d6efd; background-color: #555;
          border-radius: 3px; border: 1px solid #777;
          appearance: none; -webkit-appearance: none;
          width: 1.2em; height: 1.2em; position: relative;
       }
       .tweak-checkbox-item input[type='checkbox']::before {
            content: "✓"; display: block; position: absolute;
            top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0);
            font-size: 1em; font-weight: bold; color: white;
            transition: transform 0.1s ease-in-out; line-height: 1;
       }
       .tweak-checkbox-item input[type='checkbox']:checked {
            background-color: #0d6efd; border-color: #0d6efd;
       }
       .tweak-checkbox-item input[type='checkbox']:checked::before {
            transform: translate(-50%, -50%) scale(1.2);
       }
      .tweak-checkbox-item label {
          cursor: pointer; flex-grow: 1; font-size: 1em; color: #e0e0e0;
      }
      .tweak-modal-footer {
        margin-top: 25px; padding-top: 15px;
        border-top: 1px solid #4a4a4a;
        display: flex; justify-content: flex-end;
      }
      #tweak-modal-bottom-close {
        background-color: #dc3545; color: white; border: 1px solid #dc3545;
        padding: 8px 18px; border-radius: 6px; font-size: 0.95em;
        font-weight: 500; cursor: pointer;
        transition: background-color 0.2s ease, border-color 0.2s ease;
      }
      #tweak-modal-bottom-close:hover {
        background-color: #c82333; border-color: #bd2130;
      }
      .tweak-color-item {
          margin-top: 20px; padding-top: 15px;
          border-top: 1px solid #4a4a4a;
          display: flex; align-items: center; justify-content: space-between;
       }
      .tweak-color-item label { margin-right: 10px; color: #e0e0e0; font-size: 1em; }
      .tweak-color-input-wrapper { display: flex; align-items: center; }
      .tweak-color-item input[type='color'] {
          width: 40px; height: 30px; border: 1px solid #777;
          border-radius: 4px; cursor: pointer; background-color: #555;
          margin-right: 10px; padding: 2px;
       }
       .tweak-reset-button {
            background-color: #6c757d; color: white; border: 1px solid #6c757d;
            padding: 4px 10px; border-radius: 4px; font-size: 0.85em;
            font-weight: 500; cursor: pointer;
            transition: background-color 0.2s ease, border-color 0.2s ease;
       }
        .tweak-reset-button:hover { background-color: #5a6268; border-color: #545b62; }
      .tweak-text-item { margin-top: 20px; display: flex; align-items: center; }
      .tweak-text-item label { color: #e0e0e0; font-size: 1em; white-space: nowrap; margin-right: 10px;} /* MODIFIED: added margin-right */
      .tweak-text-input-wrapper { display: flex; align-items: center; flex-grow: 1; }
      .tweak-text-item input[type='text'], .tweak-text-item input[type='number'] { /* MODIFIED: grouped number */
          flex-grow: 1; flex-shrink: 1; min-width: 50px; flex-basis: auto;
          padding: 6px 10px; border: 1px solid #777; margin-right: 10px;
          border-radius: 4px; background-color: #555; color: #f0f0f0; font-size: 0.9em;
      }
       .tweak-text-item input[type='text']::placeholder,
       .tweak-text-item input[type='number']::placeholder {
         color: #aaa; /* MODIFIED: Lighter placeholder */
         opacity: 1;
       }
      #tweak-modal-scrollable-content {
        max-height: calc(80vh - 200px); overflow-y: auto; overflow-x: hidden;
        padding-right: 15px; margin-right: -15px;
      }
      #tweak-modal-scrollable-content::-webkit-scrollbar { width: 8px; }
      #tweak-modal-scrollable-content::-webkit-scrollbar-track { background: #444; border-radius: 4px; }
      #tweak-modal-scrollable-content::-webkit-scrollbar-thumb {
        background-color: #888; border-radius: 4px; border: 2px solid #444;
      }
      #tweak-modal-scrollable-content::-webkit-scrollbar-thumb:hover { background-color: #aaa; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    modalOverlay = document.createElement("div");
    modalOverlay.id = "tweak-modal-overlay";
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) toggleModal(false);
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

    // --- General Settings Section ---
    const settingsSection = document.createElement("div");
    settingsSection.className = "tweak-settings-section";
    const checkboxContainer = document.createElement("div");
    const settings = [
      { key: settingsKeys.hideTeams, label: "Hide 'Teams' menu item" },
      { key: settingsKeys.hideKB, label: "Hide 'KB' menu item" },
      { key: settingsKeys.hideLogo, label: "Hide Logo & Announcement section" },
      { key: settingsKeys.hideProfile, label: "Hide 'Profile' button" },
      { key: settingsKeys.hideChatProfiles, label: "Hide 'Chat Profiles' button" },
      { key: settingsKeys.hidePinnedChars, label: "Hide 'Characters' in New Chat" },
      { key: settingsKeys.showModalButton, label: "Show 'Tweaks' Button in Menu", defaultValue: true },
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
    scrollableContent.appendChild(settingsSection);

    // --- Color Pickers ---
    const colorPickerSection = document.createElement("div"); // Main container for colors
    colorPickerSection.className = "tweak-settings-section"; // Style as a section

    const newChatColorItem = document.createElement("div");
    newChatColorItem.className = "tweak-color-item"; // Use existing class for layout
    newChatColorItem.style.borderTop = "none"; // Remove top border for the first item in section
    newChatColorItem.style.paddingTop = "0";
    newChatColorItem.style.marginTop = "0";

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
      saveSetting(settingsKeys.newChatButtonColor, null);
      colorInput.value = defaultNewChatButtonColor;
    });
    colorInputWrapper.appendChild(colorInput);
    colorInputWrapper.appendChild(resetButton);
    newChatColorItem.appendChild(colorLabel);
    newChatColorItem.appendChild(colorInputWrapper);
    colorPickerSection.appendChild(newChatColorItem);

    const wsIconColorItem = document.createElement("div");
    wsIconColorItem.className = "tweak-color-item";
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
    wsIconColorItem.appendChild(wsIconColorLabel);
    wsIconColorItem.appendChild(wsIconColorInputWrapper);
    colorPickerSection.appendChild(wsIconColorItem);

    const wsFontColorItem = document.createElement("div");
    wsFontColorItem.className = "tweak-color-item";
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
    wsFontColorItem.appendChild(wsFontColorLabel);
    wsFontColorItem.appendChild(wsFontColorInputWrapper);
    colorPickerSection.appendChild(wsFontColorItem);
    scrollableContent.appendChild(colorPickerSection);

    // --- Custom Page Title ---
    const customTitleSectionContainer = document.createElement("div");
    customTitleSectionContainer.className = "tweak-settings-section";
    const customTitleSection = document.createElement("div");
    customTitleSection.className = "tweak-text-item";
    customTitleSection.style.marginTop = "0"; // No extra top margin
    const titleLabel = document.createElement("label");
    titleLabel.htmlFor = "tweak_customPageTitle_input";
    titleLabel.textContent = "Custom Page Title:";
    const titleInputWrapper = document.createElement("div");
    titleInputWrapper.className = "tweak-text-input-wrapper";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "tweak_customPageTitle_input";
    titleInput.placeholder = "Enter custom title";
    titleInput.addEventListener("input", (event) => {
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
    titleInputWrapper.appendChild(titleInput);
    titleInputWrapper.appendChild(clearTitleButton);
    customTitleSection.appendChild(titleLabel); // MODIFIED: Label added before wrapper
    customTitleSection.appendChild(titleInputWrapper);
    customTitleSectionContainer.appendChild(customTitleSection);
    scrollableContent.appendChild(customTitleSectionContainer);


    // --- Font Settings Section ---
    const fontSettingsContainer = document.createElement("div");
    fontSettingsContainer.className = "tweak-settings-section";

    // NEW: Local Font Subsection
    const localFontTitle = document.createElement("div");
    localFontTitle.className = "tweak-font-subsection-title";
    localFontTitle.textContent = "Use a Font From Your Computer";
    fontSettingsContainer.appendChild(localFontTitle);

    const localFontFamilyDescription = document.createElement("p");
    localFontFamilyDescription.className = "tweak-font-subsection-description";
    localFontFamilyDescription.textContent = "Specify a font family installed on your system (e.g., Arial, Verdana). This overrides Web Font settings below.";
    fontSettingsContainer.appendChild(localFontFamilyDescription);

    const localFontFamilySection = document.createElement("div");
    localFontFamilySection.className = "tweak-text-item";
    localFontFamilySection.style.marginTop = "5px"; // Less margin after description
    const localFontFamilyLabel = document.createElement("label");
    localFontFamilyLabel.htmlFor = "tweak_localFontFamily_input";
    localFontFamilyLabel.textContent = "Local Font Name:";
    const localFontFamilyInputWrapper = document.createElement("div");
    localFontFamilyInputWrapper.className = "tweak-text-input-wrapper";
    const localFontFamilyInput = document.createElement("input");
    localFontFamilyInput.type = "text";
    localFontFamilyInput.id = "tweak_localFontFamily_input";
    localFontFamilyInput.placeholder = "e.g., Arial, Times New Roman";
    localFontFamilyInput.addEventListener("input", (event) => {
      saveSetting(settingsKeys.localFontFamily, event.target.value || null);
      if (feedbackElement) feedbackElement.textContent = "Settings saved.";
    });
    const clearLocalFontFamilyButton = document.createElement("button");
    clearLocalFontFamilyButton.textContent = "Clear";
    clearLocalFontFamilyButton.className = "tweak-reset-button";
    clearLocalFontFamilyButton.type = "button";
    clearLocalFontFamilyButton.addEventListener("click", () => {
      saveSetting(settingsKeys.localFontFamily, null);
      localFontFamilyInput.value = "";
      if (feedbackElement) feedbackElement.textContent = "Settings saved.";
    });
    localFontFamilyInputWrapper.appendChild(localFontFamilyInput);
    localFontFamilyInputWrapper.appendChild(clearLocalFontFamilyButton);
    localFontFamilySection.appendChild(localFontFamilyLabel);
    localFontFamilySection.appendChild(localFontFamilyInputWrapper);
    fontSettingsContainer.appendChild(localFontFamilySection);

    // NEW: Web Font Subsection Title
    const webFontTitle = document.createElement("div");
    webFontTitle.className = "tweak-font-subsection-title";
    webFontTitle.textContent = "Use a Web Font (from URL)";
    fontSettingsContainer.appendChild(webFontTitle);
    
    const fontDescription = document.createElement("p");
    fontDescription.className = "tweak-font-subsection-description";
    fontDescription.textContent = "Import a font from a URL (e.g., Google Fonts). This is used if no Local Font is specified above.";
    fontSettingsContainer.appendChild(fontDescription);

    const customFontSection = document.createElement("div");
    customFontSection.className = "tweak-text-item";
    customFontSection.style.marginTop = "5px";
    const fontLabel = document.createElement("label");
    fontLabel.htmlFor = "tweak_customFontUrl_input";
    fontLabel.textContent = "Web Font URL:"; // MODIFIED: Label text
    const fontInputWrapper = document.createElement("div");
    fontInputWrapper.className = "tweak-text-input-wrapper";
    const fontInput = document.createElement("input");
    fontInput.type = "text";
    fontInput.id = "tweak_customFontUrl_input";
    fontInput.placeholder = "e.g., Google Fonts URL";
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
    customFontSection.appendChild(fontLabel); // MODIFIED: Label added before wrapper
    customFontSection.appendChild(fontInputWrapper);
    fontSettingsContainer.appendChild(customFontSection);

    const fontFamilySection = document.createElement("div");
    fontFamilySection.className = "tweak-text-item";
    const fontFamilyLabel = document.createElement("label");
    fontFamilyLabel.htmlFor = "tweak_customFontFamily_input";
    fontFamilyLabel.textContent = "Web Font Name:"; // MODIFIED: Label text
    const fontFamilyInputWrapper = document.createElement("div");
    fontFamilyInputWrapper.className = "tweak-text-input-wrapper";
    const fontFamilyInput = document.createElement("input");
    fontFamilyInput.type = "text";
    fontFamilyInput.id = "tweak_customFontFamily_input";
    fontFamilyInput.placeholder = "e.g., 'Roboto', 'Open Sans'"; // MODIFIED: Placeholder
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
    fontFamilySection.appendChild(fontFamilyLabel); // MODIFIED: Label added before wrapper
    fontFamilySection.appendChild(fontFamilyInputWrapper);
    fontSettingsContainer.appendChild(fontFamilySection);

    // Font Size (applies to local or web font)
    const fontSizeTitle = document.createElement("div");
    fontSizeTitle.className = "tweak-font-subsection-title";
    fontSizeTitle.textContent = "General Font Size";
    fontSizeTitle.style.borderTop = "1px solid #4a4a4a"; // Add separator if preferred
    fontSizeTitle.style.marginTop = "20px";
    fontSettingsContainer.appendChild(fontSizeTitle);

    const fontSizeSection = document.createElement("div");
    fontSizeSection.className = "tweak-text-item";
    fontSizeSection.style.marginTop = "10px";
    const fontSizeLabel = document.createElement("label");
    fontSizeLabel.htmlFor = "tweak_customFontSize_input";
    fontSizeLabel.textContent = "Font Size (px):";
    const fontSizeInputWrapper = document.createElement("div");
    fontSizeInputWrapper.className = "tweak-text-input-wrapper";
    const fontSizeInput = document.createElement("input");
    fontSizeInput.type = "number";
    fontSizeInput.id = "tweak_customFontSize_input";
    fontSizeInput.placeholder = "e.g., 16"; // MODIFIED: Placeholder
    fontSizeInput.min = "8";
    fontSizeInput.step = "1";
    fontSizeInput.addEventListener("input", (event) => {
      const valueToSave = event.target.value ? parseInt(event.target.value, 10) : null;
      if (valueToSave !== null && valueToSave >= parseInt(fontSizeInput.min, 10)) {
        saveSetting(settingsKeys.customFontSize, valueToSave);
      } else if (valueToSave === null) {
        saveSetting(settingsKeys.customFontSize, null); // Allow clearing
      } else {
        // Optionally handle invalid input, e.g., by not saving or showing an error
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
    fontSizeSection.appendChild(fontSizeLabel); // MODIFIED: Label added before wrapper
    fontSizeSection.appendChild(fontSizeInputWrapper);
    fontSettingsContainer.appendChild(fontSizeSection);

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

    // General visibility settings
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
      if (checkbox) checkbox.checked = getSetting(key, defaultValue);
    });

    // Color settings
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
    
    // Page Title
    const titleInput = document.getElementById("tweak_customPageTitle_input");
    if (titleInput) {
      titleInput.value = localStorage.getItem(settingsKeys.customPageTitle) || "";
    }

    // Font settings
    // NEW: Load Local Font Family
    const localFontFamilyInput = document.getElementById("tweak_localFontFamily_input");
    if (localFontFamilyInput) {
      localFontFamilyInput.value = cleanValue(localStorage.getItem(settingsKeys.localFontFamily)) || "";
    }

    const fontInput = document.getElementById("tweak_customFontUrl_input");
    if (fontInput) {
      fontInput.value = cleanValue(localStorage.getItem(settingsKeys.customFontUrl)) || "";
    }
    const fontFamilyInput = document.getElementById("tweak_customFontFamily_input");
    if (fontFamilyInput) {
      fontFamilyInput.value = cleanValue(localStorage.getItem(settingsKeys.customFontFamily)) || "";
    }
    const fontSizeInput = document.getElementById("tweak_customFontSize_input");
    if (fontSizeInput) {
      const storedSize = localStorage.getItem(settingsKeys.customFontSize);
      // storedSize is already a number (or null) due to JSON.stringify in saveSetting
      fontSizeInput.value = storedSize !== null ? JSON.parse(storedSize) : "";
    }

    if (feedbackElement) feedbackElement.textContent = " ";
  }

  function saveSetting(key, value) {
    try {
      if (value === null || value === "") { // Treat empty string as null for clearing
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }

      if (feedbackElement) feedbackElement.textContent = "Settings saved.";
      
      applyStylesBasedOnSettings(); // Apply general style changes
      
      // If a font-related setting changed, re-apply all font styles
      if (
        key === settingsKeys.customFontUrl ||
        key === settingsKeys.customFontFamily ||
        key === settingsKeys.customFontSize ||
        key === settingsKeys.localFontFamily // NEW: Trigger on local font change
      ) {
        applyCustomFont();
      }
    } catch (error) {
      console.error(`${consolePrefix} Error saving setting ${key}:`, error);
      if (feedbackElement) feedbackElement.textContent = "Error saving settings.";
    }
  }

  function toggleModal(forceState) {
    if (!modalOverlay) {
      console.warn(`${consolePrefix} Modal overlay not found.`);
      return;
    }
    const currentComputedDisplay = window.getComputedStyle(modalOverlay).display;
    const shouldShow = typeof forceState === "boolean" ? forceState : currentComputedDisplay === "none";

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
    if (originalPageTitle === null) originalPageTitle = document.title;
    applyStylesBasedOnSettings();
    applyCustomTitle();
    applyCustomFont(); // Apply custom font on initialization
  }

  createSettingsModal(); // Create modal elements once

  // MODIFIED: applyCustomFont function to handle local and web fonts
  function applyCustomFont() {
    const localFontFamilySetting = cleanValue(localStorage.getItem(settingsKeys.localFontFamily));
    const customFontUrlSetting = cleanValue(localStorage.getItem(settingsKeys.customFontUrl));
    const webFontFamilySetting = cleanValue(localStorage.getItem(settingsKeys.customFontFamily)); // Font family for the web font
    const fontSizeSettingRaw = localStorage.getItem(settingsKeys.customFontSize); // Will be string like "16" or null

    const styleId = "tweak-custom-font-style";
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    let newCssRules = "";
    let effectiveFontFamily = null;

    // 1. Determine Font Family and add @import if necessary
    if (localFontFamilySetting && localFontFamilySetting.trim() !== "") {
      effectiveFontFamily = localFontFamilySetting.trim();
      // console.log(`${consolePrefix} Using local font: ${effectiveFontFamily}`);
    } else if (customFontUrlSetting && customFontUrlSetting.trim() !== "") {
      if (customFontUrlSetting.startsWith("http://") || customFontUrlSetting.startsWith("https://")) {
        newCssRules += `@import url('${customFontUrlSetting}');\n`;
      } else {
        console.warn(`${consolePrefix} Invalid custom font URL: ${customFontUrlSetting}`);
      }
      if (webFontFamilySetting && webFontFamilySetting.trim() !== "") {
        effectiveFontFamily = webFontFamilySetting.trim();
      }
      // console.log(`${consolePrefix} Using web font: ${effectiveFontFamily || 'from URL'}`);
    } else if (webFontFamilySetting && webFontFamilySetting.trim() !== "") {
      // No local font, no URL, but webFontFamilySetting is set. Treat as local.
      effectiveFontFamily = webFontFamilySetting.trim();
      // console.log(`${consolePrefix} Using web font family as local: ${effectiveFontFamily}`);
    }

    // 2. Prepare CSS rules for font family and font size
    let elementSpecificStyles = [];
    if (effectiveFontFamily) {
      let fontFamilyCssValue = effectiveFontFamily;
      if (fontFamilyCssValue.includes(" ") && !/^['"].*['"]$/.test(fontFamilyCssValue)) {
        fontFamilyCssValue = `'${fontFamilyCssValue}'`; // Add quotes if needed
      }
      elementSpecificStyles.push(`  font-family: ${fontFamilyCssValue} !important;`);
    }

    let fontSizeForContainerStyle = "";
    if (fontSizeSettingRaw !== null) {
        try {
            const parsedSize = JSON.parse(fontSizeSettingRaw); // Should be a number
            if (typeof parsedSize === 'number' && parsedSize > 0) {
                elementSpecificStyles.push(`  font-size: ${parsedSize}px !important;`);
                fontSizeForContainerStyle = `\n[data-element-id="chat-space-middle-part"] {\n  font-size: ${parsedSize}px !important;\n}\n`;
            }
        } catch(e) {
            console.warn(`${consolePrefix} Could not parse font size: ${fontSizeSettingRaw}`);
        }
    }
    
    if (elementSpecificStyles.length > 0) {
      const rulesString = elementSpecificStyles.join("\n");
      newCssRules += `
[data-element-id="chat-space-middle-part"] .prose,
[data-element-id="chat-space-middle-part"] .prose-sm,
[data-element-id="chat-space-middle-part"] .text-sm,
textarea[data-element-id="prompt-textarea"],
div.ProseMirror, /* Common class for some rich text editors */
/* You might want to target the main chat input more broadly if IDs change */
textarea[placeholder*="Message"], 
textarea[placeholder*="Send a message"]
{
${rulesString}
}
`;
    }
    newCssRules += fontSizeForContainerStyle; // Add container font size rule

    if (styleElement.textContent !== newCssRules) {
      styleElement.textContent = newCssRules;
    }
  }

  const observer = new MutationObserver(() => {
    applyStylesBasedOnSettings();
    applyCustomTitle();
    // applyCustomFont(); // Font is usually applied once or on setting change, not every mutation
                         // However, if elements are dynamically loaded and need font, this might be needed.
                         // For now, keep it out of high-frequency observer to avoid perf issues.

    const workspaceBar = document.querySelector('div[data-element-id="workspace-bar"]');
    if (workspaceBar) {
      let tweaksButton = document.getElementById("workspace-tab-tweaks");
      const settingsButton = workspaceBar.querySelector('button[data-element-id="workspace-tab-settings"]');
      const syncButton = workspaceBar.querySelector('button[data-element-id="workspace-tab-cloudsync"]');
      const profileButton = document.querySelector('button[data-element-id="workspace-profile-button"]');
      const styleReferenceButton = syncButton || profileButton || settingsButton; // Broader reference

      if (!tweaksButton && settingsButton && styleReferenceButton) {
        tweaksButton = document.createElement("button");
        tweaksButton.id = "workspace-tab-tweaks";
        tweaksButton.title = "Open UI Tweaks (Shift+Alt/Cmd+T)";
        tweaksButton.dataset.elementId = "workspace-tab-tweaks";
        tweaksButton.className = styleReferenceButton.className; // Copy class from a similar button

        const outerSpan = document.createElement("span");
        const styleReferenceOuterSpan = styleReferenceButton.querySelector(":scope > span");
        if (styleReferenceOuterSpan) outerSpan.className = styleReferenceOuterSpan.className;

        const iconDiv = document.createElement("div");
        const styleReferenceIconDiv = styleReferenceButton.querySelector(":scope > span > div");
        if (styleReferenceIconDiv) iconDiv.className = styleReferenceIconDiv.className;
        iconDiv.style.cssText = "position: relative; display: flex; justify-content: center; align-items: center;";
        
        const svgIcon = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svgIcon.setAttribute("class", "w-5 h-5 flex-shrink-0"); // Standard classes
        svgIcon.setAttribute("width", "18px"); svgIcon.setAttribute("height", "18px");
        svgIcon.setAttribute("viewBox", "0 0 24 24");
        svgIcon.setAttribute("fill", "currentColor");
        const currentWsIconColor = getSetting(settingsKeys.workspaceIconColor, null);
        svgIcon.style.color = currentWsIconColor || defaultWorkspaceIconColorVisual;

        const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        svgPath.setAttribute("d", "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4c-.83 0-1.5-.67-1.5-1.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z");
        svgIcon.appendChild(svgPath);
        iconDiv.appendChild(svgIcon);

        const textSpan = document.createElement("span");
        const styleReferenceTextSpan = styleReferenceButton.querySelector('span > span:not([class*="flex"])'); // Try to get text span style
        if(styleReferenceTextSpan) textSpan.className = styleReferenceTextSpan.className;
        else textSpan.className = "font-normal self-stretch text-center text-xs leading-4 md:leading-none"; // Fallback
        textSpan.textContent = "Tweaks";

        outerSpan.appendChild(iconDiv);
        outerSpan.appendChild(textSpan);
        tweaksButton.appendChild(outerSpan);

        tweaksButton.addEventListener("click", (e) => {
          e.preventDefault(); e.stopPropagation();
          toggleModal(true);
        });

        if (settingsButton.parentNode) {
          settingsButton.parentNode.insertBefore(tweaksButton, settingsButton);
          const showModalButtonSetting = getSetting(settingsKeys.showModalButton, true);
          tweaksButton.style.display = showModalButtonSetting ? "inline-flex" : "none";
        } else {
          console.warn(`${consolePrefix} Could not insert Tweaks button.`);
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  if (document.readyState === "complete" || document.readyState === "interactive") {
    initializeTweaks();
  } else {
    document.addEventListener("DOMContentLoaded", initializeTweaks);
  }
  console.log(`${consolePrefix} Initialized. Press Shift+Alt+T (Win) or Shift+Cmd+T (Mac) for settings.`);
})();
