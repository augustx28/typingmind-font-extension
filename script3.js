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
    localFontFamily: "tweak_localFontFamily", // For local font
    customFontSize: "tweak_customFontSize",
  };

  const consolePrefix = "TypingMind Tweaks:";
  const defaultNewChatButtonColor = "#2563eb";
  const defaultWorkspaceIconColorVisual = "#9ca3af";
  const defaultWorkspaceFontColorVisual = "#d1d5db";
  let originalPageTitle = null;

  // Helper function to clean string values, especially those from localStorage
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

  // Helper function to get settings from localStorage
  function getSetting(key, defaultValue = false) {
    const value = localStorage.getItem(key);
    if (value === "null" || value === null) { // Handle 'null' string or actual null
        return defaultValue;
    }
    try {
        // Try to parse as JSON (for booleans, numbers)
        return JSON.parse(value);
    } catch (e) {
        // If parsing fails, it's likely a raw string (e.g., font name, URL, color hex)
        return value;
    }
  }

  // Applies various style tweaks based on saved settings
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
    const showModalButtonSetting = getSetting(settingsKeys.showModalButton, true);

    // Hide/show Teams button
    const teamsButton = document.querySelector('button[data-element-id="workspace-tab-teams"]');
    if (teamsButton) teamsButton.style.display = hideTeams ? "none" : "";

    const workspaceBar = document.querySelector('div[data-element-id="workspace-bar"]');
    if (workspaceBar) {
      // Hide/show KB button
      const buttons = workspaceBar.querySelectorAll("button");
      buttons.forEach((button) => {
        const textSpan = button.querySelector("span > span");
        if (textSpan && textSpan.textContent.trim() === "KB") {
          button.style.display = hideKB ? "none" : "";
          return;
        }
      });

      // Apply workspace icon color (excluding tweaks button icon)
      const icons = workspaceBar.querySelectorAll("svg");
      icons.forEach((icon) => {
        if (icon.closest("#workspace-tab-tweaks")) return;
        icon.style.color = wsIconColor ? wsIconColor : "";
      });

      // Apply workspace font color (excluding tweaks button text)
      const textSpans = workspaceBar.querySelectorAll("span");
      textSpans.forEach((span) => {
        if (span.closest("#workspace-tab-tweaks")) return;
        if (span.textContent.trim()) {
          const parentButtonSpan = span.closest('div[data-element-id="workspace-bar"] > div > button > span');
          if (parentButtonSpan === span.parentElement) {
            span.style.color = wsFontColor ? wsFontColor : "";
          }
        }
      });

      // Update Tweaks button visibility and icon color
      let tweaksButton = document.getElementById("workspace-tab-tweaks");
      if (tweaksButton) {
        const svgIcon = tweaksButton.querySelector("svg");
        if (svgIcon) {
          svgIcon.style.color = getSetting(settingsKeys.workspaceIconColor, defaultWorkspaceIconColorVisual);
        }
        tweaksButton.style.display = showModalButtonSetting ? "inline-flex" : "none";
      }
    }

    // Hide/show Logo
    const logoImage = document.querySelector('img[alt="TypingMind"][src="/logo.png"]');
    if (logoImage && logoImage.parentElement && logoImage.parentElement.parentElement) {
      logoImage.parentElement.parentElement.style.display = hideLogo ? "none" : "";
    }

    // Hide/show Profile button
    const profileButton = document.querySelector('button[data-element-id="workspace-profile-button"]');
    if (profileButton) profileButton.style.display = hideProfile ? "none" : "";

    // Hide/show Chat Profiles button
    document.querySelectorAll("span").forEach((span) => {
      if (span.textContent.trim() === "Chat Profiles") {
        const button = span.closest("button");
        if (button) button.style.display = hideChatProfiles ? "none" : "";
      }
    });

    // Hide/show Pinned Characters
    const pinnedCharsContainer = document.querySelector('div[data-element-id="pinned-characters-container"]');
    if (pinnedCharsContainer) pinnedCharsContainer.style.display = hidePinnedChars ? "none" : "";

    // Apply New Chat button color
    const newChatButton = document.querySelector('button[data-element-id="new-chat-button-in-side-bar"]');
    if (newChatButton) {
      newChatButton.style.backgroundColor = newChatColor ? newChatColor : "";
    }
  }

  // Applies custom page title
  function applyCustomTitle() {
    const customTitle = getSetting(settingsKeys.customPageTitle, null);
    if (customTitle && typeof customTitle === "string" && customTitle.trim() !== "") {
      document.title = customTitle;
    } else if (originalPageTitle) {
      document.title = originalPageTitle;
    }
  }

  let modalOverlay = null;
  let modalElement = null;
  let feedbackElement = null;

  // Creates the settings modal HTML structure and styles
  function createSettingsModal() {
    if (document.getElementById("tweak-modal-overlay")) return;

    // CSS styles for the modal
    const styles = `
      #tweak-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); display: none; justify-content: center; align-items: center; z-index: 10001; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
      #tweak-modal { background-color: #252525; color: #f0f0f0; padding: 25px 35px; border-radius: 8px; min-width: 380px; max-width: 550px; box-shadow: 0 8px 25px rgba(0,0,0,0.6); position: relative; border: 1px solid #4a4a4a; }
      #tweak-modal h2 { margin-top: 0; margin-bottom: 20px; color: #ffffff; font-size: 1.5em; font-weight: 600; text-align: center; }
      #tweak-modal-feedback { font-size: 0.9em; color: #a0cfff; margin-top: 15px; margin-bottom: 5px; min-height: 1.2em; text-align: center; font-weight: 500; }
      .tweak-settings-section { background-color: #333333; padding: 20px 25px; border-radius: 6px; margin-top: 10px; border: 1px solid #484848; }
      .tweak-checkbox-item { margin-bottom: 18px; display: flex; align-items: center; }
      .tweak-checkbox-item:last-child { margin-bottom: 5px; }
      .tweak-checkbox-item input[type='checkbox'] { margin-right: 15px; transform: scale(1.2); cursor: pointer; accent-color: #0d6efd; background-color: #555; border-radius: 3px; border: 1px solid #777; appearance: none; -webkit-appearance: none; width: 1.2em; height: 1.2em; position: relative; }
      .tweak-checkbox-item input[type='checkbox']::before { content: "✓"; display: block; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0); font-size: 1em; font-weight: bold; color: white; transition: transform 0.1s ease-in-out; line-height: 1; }
      .tweak-checkbox-item input[type='checkbox']:checked { background-color: #0d6efd; border-color: #0d6efd; }
      .tweak-checkbox-item input[type='checkbox']:checked::before { transform: translate(-50%, -50%) scale(1.2); }
      .tweak-checkbox-item label { cursor: pointer; flex-grow: 1; font-size: 1em; color: #e0e0e0; }
      .tweak-modal-footer { margin-top: 25px; padding-top: 15px; border-top: 1px solid #4a4a4a; display: flex; justify-content: flex-end; }
      #tweak-modal-bottom-close { background-color: #dc3545; color: white; border: 1px solid #dc3545; padding: 8px 18px; border-radius: 6px; font-size: 0.95em; font-weight: 500; cursor: pointer; transition: background-color 0.2s ease, border-color 0.2s ease; }
      #tweak-modal-bottom-close:hover { background-color: #c82333; border-color: #bd2130; }
      .tweak-color-item { margin-top: 20px; padding-top: 15px; border-top: 1px solid #4a4a4a; display: flex; align-items: center; justify-content: space-between; }
      .tweak-color-item label { margin-right: 10px; color: #e0e0e0; font-size: 1em; }
      .tweak-color-input-wrapper { display: flex; align-items: center; }
      .tweak-color-item input[type='color'] { width: 40px; height: 30px; border: 1px solid #777; border-radius: 4px; cursor: pointer; background-color: #555; margin-right: 10px; padding: 2px; }
      .tweak-reset-button { background-color: #6c757d; color: white; border: 1px solid #6c757d; padding: 4px 10px; border-radius: 4px; font-size: 0.85em; font-weight: 500; cursor: pointer; transition: background-color 0.2s ease, border-color 0.2s ease; }
      .tweak-reset-button:hover { background-color: #5a6268; border-color: #545b62; }
      .tweak-text-item { margin-top: 15px; display: flex; align-items: center; justify-content: space-between; }
      .tweak-text-item label { color: #e0e0e0; font-size: 1em; white-space: nowrap; margin-right: 10px; flex-shrink: 0; }
      .tweak-text-input-wrapper { display: flex; align-items: center; flex-grow: 1; }
      .tweak-text-item input[type='text'], .tweak-text-item input[type='number'] { flex-grow: 1; flex-shrink: 1; min-width: 50px; flex-basis: auto; padding: 6px 10px; border: 1px solid #777; margin-right: 10px; border-radius: 4px; background-color: #555; color: #f0f0f0; font-size: 0.9em; }
      .tweak-text-item input[type='text']::placeholder, .tweak-text-item input[type='number']::placeholder { color: #aaa; opacity: 1; }
      #tweak-modal-scrollable-content { max-height: calc(80vh - 180px); overflow-y: auto; overflow-x: hidden; padding-right: 10px; margin-right: -10px; }
      #tweak-modal-scrollable-content::-webkit-scrollbar { width: 8px; }
      #tweak-modal-scrollable-content::-webkit-scrollbar-track { background: #444; border-radius: 4px; }
      #tweak-modal-scrollable-content::-webkit-scrollbar-thumb { background-color: #888; border-radius: 4px; border: 2px solid #444; }
      #tweak-modal-scrollable-content::-webkit-scrollbar-thumb:hover { background-color: #aaa; }
      .font-customization-subsection-title { color: #d0d0d0; font-size: 0.95em; margin-top: 20px; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px dashed #555; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Modal overlay and main modal element
    modalOverlay = document.createElement("div");
    modalOverlay.id = "tweak-modal-overlay";
    modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) toggleModal(false); });
    modalElement = document.createElement("div");
    modalElement.id = "tweak-modal";

    const header = document.createElement("h2");
    header.textContent = "UI Tweaks";
    feedbackElement = document.createElement("p");
    feedbackElement.id = "tweak-modal-feedback";
    feedbackElement.textContent = " ";
    const scrollableContent = document.createElement("div");
    scrollableContent.id = "tweak-modal-scrollable-content";

    // --- General Settings Section (Checkboxes) ---
    const settingsSection = document.createElement("div");
    settingsSection.className = "tweak-settings-section";
    const checkboxSettings = [
      { key: settingsKeys.hideTeams, label: "Hide 'Teams' menu item" },
      { key: settingsKeys.hideKB, label: "Hide 'KB' menu item" },
      { key: settingsKeys.hideLogo, label: "Hide Logo & Announcement" },
      { key: settingsKeys.hideProfile, label: "Hide 'Profile' button" },
      { key: settingsKeys.hideChatProfiles, label: "Hide 'Chat Profiles' button" },
      { key: settingsKeys.hidePinnedChars, label: "Hide 'Characters' in New Chat" },
      { key: settingsKeys.showModalButton, label: "Show 'Tweaks' Button in Menu", defaultValue: true },
    ];
    checkboxSettings.forEach(setting => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "tweak-checkbox-item";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = setting.key;
      checkbox.checked = getSetting(setting.key, setting.defaultValue || false);
      checkbox.addEventListener("change", (e) => saveSetting(setting.key, e.target.checked));
      const label = document.createElement("label");
      label.htmlFor = setting.key;
      label.textContent = setting.label;
      itemDiv.append(checkbox, label);
      settingsSection.appendChild(itemDiv);
    });

    // --- Color Picker Function ---
    function createColorPicker(id, labelText, settingKey, defaultValue) {
        const item = document.createElement("div");
        item.className = "tweak-color-item";
        const label = document.createElement("label");
        label.htmlFor = id;
        label.textContent = labelText;
        const wrapper = document.createElement("div");
        wrapper.className = "tweak-color-input-wrapper";
        const input = document.createElement("input");
        input.type = "color";
        input.id = id;
        input.addEventListener("input", (e) => saveSetting(settingKey, e.target.value));
        const resetButton = document.createElement("button");
        resetButton.textContent = "Reset";
        resetButton.className = "tweak-reset-button";
        resetButton.type = "button";
        resetButton.addEventListener("click", () => {
            saveSetting(settingKey, null);
            input.value = defaultValue;
        });
        wrapper.append(input, resetButton);
        item.append(label, wrapper);
        return item;
    }
    const newChatColorPicker = createColorPicker("tweak_newChatButtonColor_input", "New Chat Button Color:", settingsKeys.newChatButtonColor, defaultNewChatButtonColor);
    const wsIconColorPicker = createColorPicker("tweak_workspaceIconColor_input", "Menu Icon Color:", settingsKeys.workspaceIconColor, defaultWorkspaceIconColorVisual);
    const wsFontColorPicker = createColorPicker("tweak_workspaceFontColor_input", "Menu Font Color:", settingsKeys.workspaceFontColor, defaultWorkspaceFontColorVisual);

    // --- Text Input Function ---
    function createTextInput(id, labelText, settingKey, placeholder, type = "text", attributes = {}) {
        const item = document.createElement("div");
        item.className = "tweak-text-item";
        if (type !== "number") { // Add top border for non-first text items for separation
            item.style.borderTop = "1px solid #4a4a4a";
            item.style.paddingTop = "15px";
        }
        const label = document.createElement("label");
        label.htmlFor = id;
        label.textContent = labelText;
        const wrapper = document.createElement("div");
        wrapper.className = "tweak-text-input-wrapper";
        const input = document.createElement("input");
        input.type = type;
        input.id = id;
        input.placeholder = placeholder;
        Object.keys(attributes).forEach(attr => input.setAttribute(attr, attributes[attr]));
        input.addEventListener("input", (e) => saveSetting(settingKey, e.target.value || null));
        const clearButton = document.createElement("button");
        clearButton.textContent = "Clear";
        clearButton.className = "tweak-reset-button";
        clearButton.type = "button";
        clearButton.addEventListener("click", () => {
            saveSetting(settingKey, null);
            input.value = "";
        });
        wrapper.append(input, clearButton);
        item.append(label, wrapper);
        return item;
    }
    const customTitleInput = createTextInput("tweak_customPageTitle_input", "Page Title:", settingsKeys.customPageTitle, "Custom Page Title");
    customTitleInput.style.borderTop = "1px solid #4a4a4a"; // Ensure first text input after colors also has a separator
    customTitleInput.style.paddingTop = "15px";


    // --- Font Settings Section ---
    const fontSettingsContainer = document.createElement("div");
    fontSettingsContainer.className = "tweak-settings-section";
    fontSettingsContainer.style.marginTop = "20px";

    const fontSectionTitle = document.createElement("h3");
    fontSectionTitle.textContent = "Chat Font Customization";
    fontSectionTitle.style.color = "#e0e0e0";
    fontSectionTitle.style.fontSize = "1.1em";
    fontSectionTitle.style.marginBottom = "15px";
    fontSectionTitle.style.borderBottom = "1px solid #4a4a4a";
    fontSectionTitle.style.paddingBottom = "8px";
    fontSettingsContainer.appendChild(fontSectionTitle);
    
    const fontScopeNotice = document.createElement("p");
    fontScopeNotice.textContent = "These settings only affect the chat message display area.";
    fontScopeNotice.style.fontSize = "0.85em";
    fontScopeNotice.style.color = "#bbb";
    fontScopeNotice.style.marginBottom = "15px";
    fontSettingsContainer.appendChild(fontScopeNotice);


    const localFontSubTitle = document.createElement("div");
    localFontSubTitle.className = "font-customization-subsection-title";
    localFontSubTitle.textContent = "Local Font (Overrides URL Font)";
    fontSettingsContainer.appendChild(localFontSubTitle);
    const localFontDescription = document.createElement("p");
    localFontDescription.textContent = "Use a font installed on your computer. Type the exact font name.";
    localFontDescription.style.marginBottom = "10px";
    localFontDescription.style.fontSize = "0.9em";
    localFontDescription.style.color = "#ccc";
    fontSettingsContainer.appendChild(localFontDescription);
    const localFontFamilyInput = createTextInput("tweak_localFontFamily_input", "Local Font:", settingsKeys.localFontFamily, "e.g., Arial, Verdana");
    localFontFamilyInput.style.borderTop = "none"; localFontFamilyInput.style.paddingTop = "0"; localFontFamilyInput.style.marginTop = "5px";
    fontSettingsContainer.appendChild(localFontFamilyInput);

    const urlFontSubTitle = document.createElement("div");
    urlFontSubTitle.className = "font-customization-subsection-title";
    urlFontSubTitle.textContent = "Web Font (via URL)";
    fontSettingsContainer.appendChild(urlFontSubTitle);
    const fontUrlDescription = document.createElement("p");
    fontUrlDescription.textContent = "Import from URL (e.g., Google Fonts CSS link).";
    fontUrlDescription.style.marginBottom = "10px";
    fontUrlDescription.style.fontSize = "0.9em";
    fontUrlDescription.style.color = "#ccc";
    fontSettingsContainer.appendChild(fontUrlDescription);
    const customFontUrlInput = createTextInput("tweak_customFontUrl_input", "Font URL:", settingsKeys.customFontUrl, "Google Fonts URL");
    customFontUrlInput.style.borderTop = "none"; customFontUrlInput.style.paddingTop = "0"; customFontUrlInput.style.marginTop = "5px";
    fontSettingsContainer.appendChild(customFontUrlInput);
    const customFontFamilyInput = createTextInput("tweak_customFontFamily_input", "URL Font Family:", settingsKeys.customFontFamily, "Font Name from URL");
    customFontFamilyInput.style.borderTop = "none"; customFontFamilyInput.style.paddingTop = "0"; customFontFamilyInput.style.marginTop = "5px";
    fontSettingsContainer.appendChild(customFontFamilyInput);
    
    const sizeSubTitle = document.createElement("div");
    sizeSubTitle.className = "font-customization-subsection-title";
    sizeSubTitle.textContent = "Font Size";
    fontSettingsContainer.appendChild(sizeSubTitle);
    const fontSizeInput = createTextInput("tweak_customFontSize_input", "Font Size (px):", settingsKeys.customFontSize, "e.g., 16", "number", { min: "8", step: "1" });
    fontSizeInput.style.borderTop = "none"; fontSizeInput.style.paddingTop = "0"; fontSizeInput.style.marginTop = "5px";
    fontSettingsContainer.appendChild(fontSizeInput);

    // Append all sections to scrollable content
    scrollableContent.append(settingsSection, newChatColorPicker, wsIconColorPicker, wsFontColorPicker, customTitleInput, fontSettingsContainer);

    // Modal footer with close button
    const footer = document.createElement("div");
    footer.className = "tweak-modal-footer";
    const closeButtonBottom = document.createElement("button");
    closeButtonBottom.id = "tweak-modal-bottom-close";
    closeButtonBottom.textContent = "Close";
    closeButtonBottom.addEventListener("click", () => toggleModal(false));
    footer.appendChild(closeButtonBottom);

    modalElement.append(header, feedbackElement, scrollableContent, footer);
    modalOverlay.appendChild(modalElement);
    document.body.appendChild(modalOverlay);
  }

  // Loads current settings into the modal inputs
  function loadSettingsIntoModal() {
    if (!modalElement) return;
    // Checkboxes
    document.querySelectorAll(".tweak-checkbox-item input[type='checkbox']").forEach(cb => {
      cb.checked = getSetting(cb.id, cb.id === settingsKeys.showModalButton); // Default true for showModalButton
    });
    // Color pickers
    document.getElementById("tweak_newChatButtonColor_input").value = getSetting(settingsKeys.newChatButtonColor, defaultNewChatButtonColor);
    document.getElementById("tweak_workspaceIconColor_input").value = getSetting(settingsKeys.workspaceIconColor, defaultWorkspaceIconColorVisual);
    document.getElementById("tweak_workspaceFontColor_input").value = getSetting(settingsKeys.workspaceFontColor, defaultWorkspaceFontColorVisual);
    // Text inputs
    document.getElementById("tweak_customPageTitle_input").value = getSetting(settingsKeys.customPageTitle, "");
    document.getElementById("tweak_localFontFamily_input").value = getSetting(settingsKeys.localFontFamily, "");
    document.getElementById("tweak_customFontUrl_input").value = getSetting(settingsKeys.customFontUrl, "");
    document.getElementById("tweak_customFontFamily_input").value = getSetting(settingsKeys.customFontFamily, "");
    const fontSize = getSetting(settingsKeys.customFontSize, null);
    document.getElementById("tweak_customFontSize_input").value = fontSize !== null ? fontSize : "";

    if (feedbackElement) feedbackElement.textContent = " "; // Clear feedback message
  }

  // Saves a setting to localStorage and applies relevant changes
  function saveSetting(key, value) {
    try {
      let valueToStore = value;
      // Normalize empty strings for text inputs to null for cleaner storage/logic
      if ([settingsKeys.customFontUrl, settingsKeys.customFontFamily, settingsKeys.localFontFamily, settingsKeys.customPageTitle].includes(key)) {
        valueToStore = (value && String(value).trim() !== "") ? String(value).trim() : null;
      } else if (key === settingsKeys.customFontSize) {
        valueToStore = (value !== null && !isNaN(parseInt(value,10)) && String(value).trim() !== "") ? parseInt(value,10) : null;
      }

      if (valueToStore === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, (typeof valueToStore === 'boolean' || typeof valueToStore === 'number') ? JSON.stringify(valueToStore) : valueToStore);
      }

      if (feedbackElement) { // Provide user feedback
        feedbackElement.textContent = "Settings saved.";
        setTimeout(() => { if (feedbackElement.textContent === "Settings saved.") feedbackElement.textContent = " "; }, 2000);
      }

      applyStylesBasedOnSettings(); // Apply general UI visibility/color tweaks
      if (key === settingsKeys.customPageTitle) applyCustomTitle();
      if ([settingsKeys.customFontUrl, settingsKeys.customFontFamily, settingsKeys.localFontFamily, settingsKeys.customFontSize].includes(key)) {
        applyCustomFont(); // Apply font changes
      }
    } catch (error) {
      console.error(`${consolePrefix} Error saving setting ${key}:`, error);
      if (feedbackElement) feedbackElement.textContent = "Error saving settings.";
    }
  }

  // Toggles the visibility of the settings modal
  function toggleModal(forceState) {
    if (!modalOverlay) return;
    const shouldShow = typeof forceState === "boolean" ? forceState : window.getComputedStyle(modalOverlay).display === "none";
    if (shouldShow) {
      loadSettingsIntoModal();
      modalOverlay.style.display = "flex";
    } else {
      modalOverlay.style.display = "none";
    }
  }

  // Adds keyboard shortcut for toggling the modal
  document.addEventListener("keydown", (event) => {
    const isMac = navigator.userAgent.toUpperCase().includes("MAC");
    const modifierPressed = isMac ? event.metaKey : event.altKey;
    if (event.shiftKey && modifierPressed && event.key.toUpperCase() === "T") {
      event.preventDefault();
      event.stopPropagation();
      toggleModal();
    }
  });

  // Main initialization function
  function initializeTweaks() {
    if (originalPageTitle === null) originalPageTitle = document.title;
    createSettingsModal();
    applyStylesBasedOnSettings();
    applyCustomTitle();
    applyCustomFont();
  }

  // Observes DOM changes to re-apply styles and add the Tweaks button if not present
  const observer = new MutationObserver(() => {
    applyStylesBasedOnSettings();
    applyCustomTitle();
    applyCustomFont();

    const workspaceBar = document.querySelector('div[data-element-id="workspace-bar"]');
    if (workspaceBar) {
      let tweaksButton = document.getElementById("workspace-tab-tweaks");
      const settingsButton = workspaceBar.querySelector('button[data-element-id="workspace-tab-settings"]');
      const referenceButtonForStyle = settingsButton || workspaceBar.querySelector('button[data-element-id="workspace-tab-cloudsync"]') || (document.querySelector('button[data-element-id="workspace-profile-button"]') ? document.querySelector('button[data-element-id="workspace-profile-button"]').parentElement : null);

      if (!tweaksButton && settingsButton && referenceButtonForStyle) {
        tweaksButton = document.createElement("button");
        tweaksButton.id = "workspace-tab-tweaks";
        tweaksButton.title = "Open UI Tweaks (Shift+Alt+T or Shift+Cmd+T)";
        tweaksButton.dataset.elementId = "workspace-tab-tweaks";
        tweaksButton.className = referenceButtonForStyle.className;

        const outerSpan = document.createElement("span");
        const refOuterSpan = referenceButtonForStyle.querySelector(":scope > span");
        outerSpan.className = refOuterSpan ? refOuterSpan.className : "flex flex-col items-center justify-center h-full";

        const iconDiv = document.createElement("div");
        const refIconDiv = referenceButtonForStyle.querySelector(":scope > span > div:first-child");
        iconDiv.className = refIconDiv ? refIconDiv.className : "relative flex items-center justify-center";
        
        const svgIcon = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svgIcon.setAttribute("class", "w-5 h-5 flex-shrink-0");
        svgIcon.setAttribute("viewBox", "0 0 24 24"); // Adjusted viewBox for typical palette icons
        svgIcon.setAttribute("fill", "currentColor");
        svgIcon.style.color = getSetting(settingsKeys.workspaceIconColor, defaultWorkspaceIconColorVisual);

        const svgPath = document.createElementNS("http://www.w3.org/2000/svg","path");
        // SVG path for a paint palette icon (similar to Material Design 'palette' or Font Awesome 'paint-brush')
        svgPath.setAttribute("d", "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4c-.83 0-1.5-.67-1.5-1.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z");
        svgIcon.appendChild(svgPath);
        iconDiv.appendChild(svgIcon);

        const textSpan = document.createElement("span");
        const refTextSpan = referenceButtonForStyle.querySelector(":scope > span > span:last-child");
        textSpan.className = refTextSpan ? refTextSpan.className : "font-normal self-stretch text-center text-xs leading-4 md:leading-none";
        textSpan.textContent = "Tweaks";

        outerSpan.append(iconDiv, textSpan);
        tweaksButton.appendChild(outerSpan);
        tweaksButton.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); toggleModal(true); });

        if (settingsButton.parentNode) {
          settingsButton.parentNode.insertBefore(tweaksButton, settingsButton);
          tweaksButton.style.display = getSetting(settingsKeys.showModalButton, true) ? "inline-flex" : "none";
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initialize when DOM is ready
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initializeTweaks();
  } else {
    document.addEventListener("DOMContentLoaded", initializeTweaks);
  }
  console.log(`${consolePrefix} Initialized. Shortcut: Shift+Alt+T (Win/Linux) or Shift+Cmd+T (Mac).`);

  // Applies custom font and size to the chat area
  function applyCustomFont() {
    const customFontUrl = getSetting(settingsKeys.customFontUrl, null);
    const customFontFamilyFromUrl = getSetting(settingsKeys.customFontFamily, null);
    const localFontFamilyUser = getSetting(settingsKeys.localFontFamily, null);
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
    const cleanedLocalFamily = cleanValue(localFontFamilyUser);
    const cleanedSize = (customFontSizeRaw !== null && !isNaN(parseInt(customFontSizeRaw, 10)) && parseInt(customFontSizeRaw, 10) > 0) 
                        ? parseInt(customFontSizeRaw, 10) 
                        : null;

    // 1. Add @import rule for URL-based font
    if (cleanedUrl && (cleanedUrl.startsWith("http://") || cleanedUrl.startsWith("https://"))) {
      cssRules.push(`@import url('${cleanedUrl}');`);
    }

    // 2. Determine effective font family (local takes precedence)
    let effectiveFontFamily = cleanedLocalFamily || cleanedFamilyFromUrl;
    if (effectiveFontFamily) {
      effectiveFontFamily = effectiveFontFamily.trim();
      // Quote if it contains spaces and isn't already quoted
      if (effectiveFontFamily.includes(" ") && !/^['"].*['"]$/.test(effectiveFontFamily)) {
        effectiveFontFamily = `'${effectiveFontFamily}'`;
      }
    }
    
    // 3. Build CSS style declarations for chat area
    let styleDeclarations = [];
    if (effectiveFontFamily) {
      // Use a comprehensive fallback stack
      const fallbackFontStack = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;
      styleDeclarations.push(`  font-family: ${effectiveFontFamily}, ${fallbackFontStack} !important;`);
    }
    if (cleanedSize) {
      styleDeclarations.push(`  font-size: ${cleanedSize}px !important;`);
    }

    // 4. Apply styles only if declarations are present, and scope to chat area
    if (styleDeclarations.length > 0) {
      const declarationsString = styleDeclarations.join("\n");
      // Selectors targeting chat message content and the overall chat container for base font size
      cssRules.push(`
[data-element-id="chat-space-middle-part"],
[data-element-id="chat-space-middle-part"] .prose,
[data-element-id="chat-space-middle-part"] .prose-sm,
[data-element-id="chat-space-middle-part"] .text-sm,
div[data-radix-scroll-area-viewport] .whitespace-pre-wrap, /* Specific selector for chat messages */
.group.flex.p-3.gap-3.items-start.text-sm.text-gray-700 /* A common selector for message blocks */
{
${declarationsString}
}
      `);
        // If only font size is set, but no custom font family, ensure it applies to the chat area.
        // This is somewhat covered by the above, but an explicit rule for the container is good.
        if (cleanedSize && !effectiveFontFamily) {
             cssRules.push(`
[data-element-id="chat-space-middle-part"],
div[data-radix-scroll-area-viewport] .whitespace-pre-wrap,
.group.flex.p-3.gap-3.items-start.text-sm.text-gray-700
{
  font-size: ${cleanedSize}px !important;
}
            `);
        }
    } else {
        // If no custom font settings are active, clear any existing custom font styles
        // This ensures that clearing all font settings reverts to the site's default.
        if (styleElement.textContent !== "") {
            styleElement.textContent = "";
        }
        return; // Exit early if no rules to apply
    }

    const newStyleContent = cssRules.join("\n");
    if (styleElement.textContent !== newStyleContent) {
      styleElement.textContent = newStyleContent;
    }
  }
})();
