(function () {
  "use strict";

  // --- Configuration ---
  const SCRIPT_PREFIX = 'tmfc_'; // Prefix for the new UI Font section elements
  const GOOGLE_FONTS = [ // List of Google Fonts for the new dropdown
      "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Raleway",
      "Poppins", "Nunito", "Merriweather", "Inter", "Source Sans Pro",
      "PT Sans", "Ubuntu", "Noto Sans", "Fira Sans", "Work Sans",
      "Roboto Condensed", "Roboto Slab", "Playfair Display", "Cormorant Garamond",
      "Bebas Neue", "Titillium Web", "Josefin Sans", "Arimo", "Lexend", "EB Garamond",
      "DM Sans", "Manrope", "Space Grotesk", "Sora"
  ];
  const DEFAULT_FONT_WEIGHT = '400'; // '400' for normal

  const settingsKeys = {
    // --- Existing Tweak Keys ---
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
    customFaviconData: "tweak_customFaviconData",
    // --- Chat-specific font keys ---
    customFontUrl: "tweak_customFontUrl",
    customFontFamily: "tweak_customFontFamily",
    localFontFamily: "tweak_localFontFamily",
    customFontSize: "tweak_customFontSize",
    // --- Global UI Font Key ---
    // Stores an object:
    // { name: string, weight: '300'|'400'|'500'|'600'|'700', isGoogle?: boolean, isUrl?: boolean, custom?: boolean, url?: string }
    globalUiFont: "tweak_globalUiFont",
  };

  const consolePrefix = "TypingMind Tweaks:";
  const defaultNewChatButtonColor = "#2563eb";
  const defaultWorkspaceIconColorVisual = "#9ca3af";
  const defaultWorkspaceFontColorVisual = "#d1d5db";
  const DEFAULT_FALLBACK_FAVICON = "/favicon.ico";
  let originalPageTitle = null;
  let faviconObserver = null;
  // Tracks the currently injected Global UI font stylesheet (Google or URL)
  let activeGlobalUIFontLink = null;

  // Helper function to clean string values
  const cleanValue = (value) => {
    if (value === null || typeof value === 'undefined') return null;
    let cleaned = String(value).trim();
    if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
      cleaned = cleaned.slice(1, -1);
    }
    if (cleaned === "null") return null;
    return cleaned;
  };

  // Helper function to get settings from localStorage
  function getSetting(key, defaultValue = false) {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    if (value === "null") return defaultValue;
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  // --- Global UI Font helpers ---
  function removeActiveGlobalUIFontLink() {
    if (activeGlobalUIFontLink) {
      activeGlobalUIFontLink.remove();
      activeGlobalUIFontLink = null;
    }
  }

  function loadGlobalGoogleFont(fontName) {
      removeActiveGlobalUIFontLink();
      if (!fontName) return;

      const weightsToLoad = "300;400;500;600;700";
      const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@${weightsToLoad}&display=swap`;
      const link = document.createElement('link');
      link.href = fontUrl;
      link.rel = 'stylesheet';
      link.onerror = () => {
          console.error(`${consolePrefix} Error loading Global UI Google Font: ${fontName}.`);
      };
      document.head.appendChild(link);
      activeGlobalUIFontLink = link;
  }

  function loadGlobalUrlFont(fontUrl) {
      removeActiveGlobalUIFontLink();
      const cleaned = cleanValue(fontUrl);
      if (!cleaned || !(cleaned.startsWith("http://") || cleaned.startsWith("https://"))) return;

      const link = document.createElement('link');
      link.href = cleaned;
      link.rel = 'stylesheet';
      link.onerror = () => {
          console.error(`${consolePrefix} Error loading Global UI Web Font URL: ${cleaned}.`);
      };
      document.head.appendChild(link);
      activeGlobalUIFontLink = link;
  }

  // --- Apply the Global UI Font across the app ---
  function applyGlobalUiFont() {
      const fontSetting = getSetting(settingsKeys.globalUiFont, null);
      const targetElement = document.body;

      // Reset case
      if (!fontSetting || (!fontSetting.name && !fontSetting.isUrl)) {
          targetElement.style.fontFamily = '';
          targetElement.style.fontWeight = '';
          removeActiveGlobalUIFontLink();
          return;
      }

      // Load font source
      if (fontSetting.isGoogle && fontSetting.name) {
          loadGlobalGoogleFont(fontSetting.name);
      } else if (fontSetting.isUrl && fontSetting.url) {
          loadGlobalUrlFont(fontSetting.url);
      } else {
          // Local font case: no external stylesheet needed
          removeActiveGlobalUIFontLink();
      }

      // Build font-family stack
      const safeName = fontSetting.name && String(fontSetting.name).trim() !== "" ? `"${fontSetting.name}"` : null;
      const fallbackStack = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
      const fontFamilyStack = safeName ? `${safeName}, ${fallbackStack}` : fallbackStack;

      targetElement.style.fontFamily = fontFamilyStack;
      targetElement.style.fontWeight = fontSetting.weight || DEFAULT_FONT_WEIGHT;
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

    const teamsButton = document.querySelector('button[data-element-id="workspace-tab-teams"]');
    if (teamsButton) teamsButton.style.display = hideTeams ? "none" : "";

    const workspaceBar = document.querySelector('div[data-element-id="workspace-bar"]');
    if (workspaceBar) {
      const buttons = workspaceBar.querySelectorAll("button");
      buttons.forEach((button) => {
        const textSpan = button.querySelector("span > span");
        if (textSpan && textSpan.textContent.trim() === "KB") {
          button.style.display = hideKB ? "none" : "";
          return;
        }
      });
      const icons = workspaceBar.querySelectorAll("svg");
      icons.forEach((icon) => {
        if (icon.closest("#workspace-tab-tweaks")) return;
        icon.style.color = wsIconColor ? wsIconColor : "";
      });
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
      let tweaksButton = document.getElementById("workspace-tab-tweaks");
      if (tweaksButton) {
        const svgIcon = tweaksButton.querySelector("svg");
        if (svgIcon) {
          svgIcon.style.color = getSetting(settingsKeys.workspaceIconColor, defaultWorkspaceIconColorVisual);
        }
        tweaksButton.style.display = showModalButtonSetting ? "inline-flex" : "none";
      }
    }
    const logoImage = document.querySelector('img[alt="TypingMind"][src="/logo.png"]');
    if (logoImage && logoImage.parentElement && logoImage.parentElement.parentElement) {
      logoImage.parentElement.parentElement.style.display = hideLogo ? "none" : "";
    }
    const profileButton = document.querySelector('button[data-element-id="workspace-profile-button"]');
    if (profileButton) profileButton.style.display = hideProfile ? "none" : "";
    document.querySelectorAll("span").forEach((span) => {
      if (span.textContent.trim() === "Chat Profiles") {
        const button = span.closest("button");
        if (button) button.style.display = hideChatProfiles ? "none" : "";
      }
    });
    const pinnedCharsContainer = document.querySelector('div[data-element-id="pinned-characters-container"]');
    if (pinnedCharsContainer) pinnedCharsContainer.style.display = hidePinnedChars ? "none" : "";
    const newChatButton = document.querySelector('button[data-element-id="new-chat-button-in-side-bar"]');
    if (newChatButton) {
      newChatButton.style.backgroundColor = newChatColor ? newChatColor : "";
    }
  }

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

  function createSettingsModal() {
    if (document.getElementById("tweak-modal-overlay")) return;

    const styles = `
      #tweak-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); display: none; justify-content: center; align-items: center; z-index: 10001; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
      #tweak-modal { background-color: #252525; color: #f0f0f0; padding: 25px 35px; border-radius: 8px; min-width: 380px; max-width: 550px; box-shadow: 0 8px 25px rgba(0,0,0,0.6); position: relative; border: 1px solid #4a4a4a; }
      #tweak-modal h2 { margin-top: 0; margin-bottom: 20px; color: #ffffff; font-size: 1.5em; font-weight: 600; text-align: center; }
      #tweak-modal-feedback { font-size: 0.9em; color: #a0cfff; margin-top: 15px; margin-bottom: 5px; min-height: 1.2em; text-align: center; font-weight: 500; }
      .tweak-settings-section { background-color: #333333; padding: 20px 25px; border-radius: 6px; margin-top: 10px; border: 1px solid #484848; }
      .tweak-settings-section h3 { color: #e0e0e0; font-size: 1.1em; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #4a4a4a; padding-bottom: 8px; }
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
      /* --- NEW STYLES FOR GLOBAL FONT SECTION --- */
      .${SCRIPT_PREFIX}form-group { margin-bottom: 18px; }
      .${SCRIPT_PREFIX}form-group label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 0.9em; color: #cccccc; }
      .${SCRIPT_PREFIX}form-group select, .${SCRIPT_PREFIX}form-group input[type="text"] { width: 100%; padding: 8px 10px; border: 1px solid #777; border-radius: 4px; box-sizing: border-box; font-size: 0.95em; background-color: #555; color: #f0f0f0; }
      .${SCRIPT_PREFIX}button-group { display: flex; justify-content: flex-end; margin-top: 15px; gap: 12px; }
      .${SCRIPT_PREFIX}button-group button { padding: 6px 14px; border: 1px solid transparent; border-radius: 4px; cursor: pointer; font-size: 0.9em; font-weight: 500; }
      .${SCRIPT_PREFIX}apply-button { background-color: #0d6efd; color: white; }
      .${SCRIPT_PREFIX}apply-button:hover { background-color: #0b5ed7; }
      .${SCRIPT_PREFIX}reset-button { background-color: #6c757d; color: white; }
      .${SCRIPT_PREFIX}reset-button:hover { background-color: #5a6268; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

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

    const settingsSection = document.createElement("div");
    settingsSection.className = "tweak-settings-section";
    const settingsHeader = document.createElement('h3');
    settingsHeader.textContent = 'General Settings';
    settingsSection.appendChild(settingsHeader);

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
      checkbox.type = "checkbox"; checkbox.id = setting.key;
      checkbox.checked = getSetting(setting.key, setting.defaultValue || false);
      checkbox.addEventListener("change", (e) => saveSetting(setting.key, e.target.checked));
      const label = document.createElement("label");
      label.htmlFor = setting.key; label.textContent = setting.label;
      itemDiv.append(checkbox, label);
      settingsSection.appendChild(itemDiv);
    });

    function createColorPicker(id, labelText, settingKey, defaultValue) {
      const item = document.createElement("div"); item.className = "tweak-color-item";
      const label = document.createElement("label"); label.htmlFor = id; label.textContent = labelText;
      const wrapper = document.createElement("div"); wrapper.className = "tweak-color-input-wrapper";
      const input = document.createElement("input"); input.type = "color"; input.id = id;
      input.addEventListener("input", (e) => saveSetting(settingKey, e.target.value));
      const resetButton = document.createElement("button"); resetButton.textContent = "Reset"; resetButton.className = "tweak-reset-button"; resetButton.type = "button";
      resetButton.addEventListener("click", () => { saveSetting(settingKey, null); input.value = defaultValue; });
      wrapper.append(input, resetButton); item.append(label, wrapper);
      return item;
    }
    const newChatColorPicker = createColorPicker("tweak_newChatButtonColor_input", "New Chat Button Color:", settingsKeys.newChatButtonColor, defaultNewChatButtonColor);
    const wsIconColorPicker = createColorPicker("tweak_workspaceIconColor_input", "Menu Icon Color:", settingsKeys.workspaceIconColor, defaultWorkspaceIconColorVisual);
    const wsFontColorPicker = createColorPicker("tweak_workspaceFontColor_input", "Menu Font Color:", settingsKeys.workspaceFontColor, defaultWorkspaceFontColorVisual);

    function createTextInput(id, labelText, settingKey, placeholder, type = "text", attributes = {}) {
        const item = document.createElement("div"); item.className = "tweak-text-item";
        if (type !== "number") { item.style.borderTop = "1px solid #4a4a4a"; item.style.paddingTop = "15px"; }
        const label = document.createElement("label"); label.htmlFor = id; label.textContent = labelText;
        const wrapper = document.createElement("div"); wrapper.className = "tweak-text-input-wrapper";
        const input = document.createElement("input"); input.type = type; input.id = id; input.placeholder = placeholder;
        Object.keys(attributes).forEach(attr => input.setAttribute(attr, attributes[attr]));
        input.addEventListener("input", (e) => saveSetting(settingKey, e.target.value || null));
        const clearButton = document.createElement("button"); clearButton.textContent = "Clear"; clearButton.className = "tweak-reset-button"; clearButton.type = "button";
        clearButton.addEventListener("click", () => { saveSetting(settingKey, null); input.value = ""; });
        wrapper.append(input, clearButton); item.append(label, wrapper);
        return item;
    }
    const customTitleInput = createTextInput("tweak_customPageTitle_input", "Page Title:", settingsKeys.customPageTitle, "Custom Page Title");

    // --- NEW: Global UI Font Section with URL support ---
    const globalFontSettingsSection = document.createElement("div");
    globalFontSettingsSection.className = "tweak-settings-section";
    globalFontSettingsSection.style.marginTop = "20px";
    globalFontSettingsSection.innerHTML = `
        <h3>Global UI Font</h3>
        <div class="${SCRIPT_PREFIX}form-group">
            <label for="${SCRIPT_PREFIX}google-font-select">Google Font:</label>
            <select id="${SCRIPT_PREFIX}google-font-select">
                <option value="">-- Select Google Font --</option>
                ${GOOGLE_FONTS.sort().map(font => `<option value="${font}">${font}</option>`).join('')}
            </select>
        </div>
        <div class="${SCRIPT_PREFIX}form-group">
            <label for="${SCRIPT_PREFIX}local-font-input">Local Font (Type exact name):</label>
            <input type="text" id="${SCRIPT_PREFIX}local-font-input" placeholder="e.g., Arial, Cascadia Code">
        </div>
        <div class="${SCRIPT_PREFIX}form-group">
            <label for="${SCRIPT_PREFIX}global-font-url">Web Font URL:</label>
            <input type="text" id="${SCRIPT_PREFIX}global-font-url" placeholder="https://fonts.googleapis.com/css2?family=... or any CSS with @font-face">
            <small style="display:block;margin-top:6px;color:#bbbbbb;">Paste a CSS URL. Then provide the exact font-family name defined in that CSS below.</small>
        </div>
        <div class="${SCRIPT_PREFIX}form-group">
            <label for="${SCRIPT_PREFIX}global-font-family">URL Font Family:</label>
            <input type="text" id="${SCRIPT_PREFIX}global-font-family" placeholder="Exact font-family name from the CSS">
        </div>
        <div class="${SCRIPT_PREFIX}form-group">
            <label for="${SCRIPT_PREFIX}font-weight-select">Font Weight:</label>
            <select id="${SCRIPT_PREFIX}font-weight-select">
                <option value="300">Light (300)</option>
                <option value="400" selected>Normal (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi-Bold (600)</option>
                <option value="700">Bold (700)</option>
            </select>
        </div>
        <div class="${SCRIPT_PREFIX}button-group">
            <button class="${SCRIPT_PREFIX}reset-button" id="${SCRIPT_PREFIX}reset-font-button">Reset</button>
            <button class="${SCRIPT_PREFIX}apply-button" id="${SCRIPT_PREFIX}apply-font-button">Apply</button>
        </div>
    `;

    const fontSettingsContainer = document.createElement("div");
    fontSettingsContainer.className = "tweak-settings-section"; fontSettingsContainer.style.marginTop = "20px";
    fontSettingsContainer.innerHTML = `<h3>Chat Font Customization</h3>`;
    const fontScopeNotice = document.createElement("p"); fontScopeNotice.textContent = "These settings only affect the chat message display area.";
    fontScopeNotice.style.fontSize = "0.85em"; fontScopeNotice.style.color = "#bbb"; fontScopeNotice.style.marginBottom = "15px";
    fontSettingsContainer.appendChild(fontScopeNotice);
    const localFontSubTitle = document.createElement("div"); localFontSubTitle.className = "font-customization-subsection-title"; localFontSubTitle.textContent = "Local Font (Overrides URL Font)"; fontSettingsContainer.appendChild(localFontSubTitle);
    const localFontDescription = document.createElement("p"); localFontDescription.textContent = "Use a font installed on your computer. Type the exact font name."; localFontDescription.style.marginBottom = "10px"; localFontDescription.style.fontSize = "0.9em"; localFontDescription.style.color = "#ccc"; fontSettingsContainer.appendChild(localFontDescription);
    const localFontFamilyInput = createTextInput("tweak_localFontFamily_input", "Local Font:", settingsKeys.localFontFamily, "e.g., Arial, Verdana"); localFontFamilyInput.style.borderTop = "none"; localFontFamilyInput.style.paddingTop = "0"; localFontFamilyInput.style.marginTop = "5px"; fontSettingsContainer.appendChild(localFontFamilyInput);
    const urlFontSubTitle = document.createElement("div"); urlFontSubTitle.className = "font-customization-subsection-title"; urlFontSubTitle.textContent = "Web Font (via URL)"; fontSettingsContainer.appendChild(urlFontSubTitle);
    const fontUrlDescription = document.createElement("p"); fontUrlDescription.textContent = "Import from URL (e.g., Google Fonts CSS link)."; fontUrlDescription.style.marginBottom = "10px"; fontUrlDescription.style.fontSize = "0.9em"; fontUrlDescription.style.color = "#ccc"; fontSettingsContainer.appendChild(fontUrlDescription);
    const customFontUrlInput = createTextInput("tweak_customFontUrl_input", "Font URL:", settingsKeys.customFontUrl, "Google Fonts URL"); customFontUrlInput.style.borderTop = "none"; customFontUrlInput.style.paddingTop = "0"; customFontUrlInput.style.marginTop = "5px"; fontSettingsContainer.appendChild(customFontUrlInput);
    const customFontFamilyInput = createTextInput("tweak_customFontFamily_input", "URL Font Family:", settingsKeys.customFontFamily, "Font Name from URL"); customFontFamilyInput.style.borderTop = "none"; customFontFamilyInput.style.paddingTop = "0"; customFontFamilyInput.style.marginTop = "5px"; fontSettingsContainer.appendChild(customFontFamilyInput);
    const sizeSubTitle = document.createElement("div"); sizeSubTitle.className = "font-customization-subsection-title"; sizeSubTitle.textContent = "Font Size"; fontSettingsContainer.appendChild(sizeSubTitle);
    const fontSizeInput = createTextInput("tweak_customFontSize_input", "Font Size (px):", settingsKeys.customFontSize, "e.g., 16", "number", { min: "8", step: "1" }); fontSizeInput.style.borderTop = "none"; fontSizeInput.style.paddingTop = "0"; fontSizeInput.style.marginTop = "5px"; fontSettingsContainer.appendChild(fontSizeInput);

    const faviconSettingsSection = document.createElement("div"); faviconSettingsSection.className = "tweak-settings-section"; faviconSettingsSection.style.marginTop = "20px";
    faviconSettingsSection.innerHTML = `<h3>Favicon Customization</h3>`;
    const faviconItemContainer = document.createElement("div"); faviconItemContainer.style.padding = "5px 0px";
    const faviconInputGroup = document.createElement("div"); faviconInputGroup.style.display = "flex"; faviconInputGroup.style.alignItems = "center"; faviconInputGroup.style.marginBottom = "10px";
    const faviconLabelEl = document.createElement("label"); faviconLabelEl.htmlFor = "tweak_customFaviconData_input"; faviconLabelEl.textContent = "Upload Favicon:"; faviconLabelEl.style.color = "#e0e0e0"; faviconLabelEl.style.fontSize = "1em"; faviconLabelEl.style.marginRight = "10px"; faviconLabelEl.style.flexShrink = "0";
    const faviconFileInputEl = document.createElement("input"); faviconFileInputEl.type = "file"; faviconFileInputEl.id = "tweak_customFaviconData_input"; faviconFileInputEl.accept = ".ico,.png,.jpg,.jpeg,.svg,.gif"; faviconFileInputEl.style.color = "#f0f0f0"; faviconFileInputEl.style.padding = "5px"; faviconFileInputEl.style.border = "1px solid #777"; faviconFileInputEl.style.borderRadius = "4px"; faviconFileInputEl.style.backgroundColor = "#555"; faviconFileInputEl.style.flexGrow = "1";
    faviconInputGroup.appendChild(faviconLabelEl); faviconInputGroup.appendChild(faviconFileInputEl); faviconItemContainer.appendChild(faviconInputGroup);
    const faviconControlsGroup = document.createElement("div"); faviconControlsGroup.style.display = "flex"; faviconControlsGroup.style.alignItems = "center"; faviconControlsGroup.style.minHeight = "30px";
    const faviconPreviewEl = document.createElement("img"); faviconPreviewEl.id = "tweak_favicon_preview"; faviconPreviewEl.alt = "Favicon Preview"; faviconPreviewEl.style.width = "24px"; faviconPreviewEl.style.height = "24px"; faviconPreviewEl.style.marginRight = "10px"; faviconPreviewEl.style.border = "1px solid #777"; faviconPreviewEl.style.borderRadius = "3px"; faviconPreviewEl.style.display = "none";
    const clearFaviconButtonEl = document.createElement("button"); clearFaviconButtonEl.id = "tweak_clear_favicon_button"; clearFaviconButtonEl.textContent = "Clear Favicon"; clearFaviconButtonEl.className = "tweak-reset-button"; clearFaviconButtonEl.type = "button"; clearFaviconButtonEl.style.display = "none";
    faviconControlsGroup.appendChild(faviconPreviewEl); faviconControlsGroup.appendChild(clearFaviconButtonEl); faviconItemContainer.appendChild(faviconControlsGroup); faviconSettingsSection.appendChild(faviconItemContainer);
    faviconFileInputEl.addEventListener("change", (event) => {
        const file = event.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            saveSetting(settingsKeys.customFaviconData, e.target.result);
            if (faviconPreviewEl) { faviconPreviewEl.src = e.target.result; faviconPreviewEl.style.display = "inline-block"; }
            if (clearFaviconButtonEl) clearFaviconButtonEl.style.display = "inline-block";
            if (feedbackElement) { feedbackElement.textContent = "Favicon updated."; setTimeout(() => { if (feedbackElement.textContent === "Favicon updated.") feedbackElement.textContent = " "; }, 2000); }
        };
        reader.onerror = function () { if (feedbackElement) feedbackElement.textContent = "Error reading favicon file."; console.error(`${consolePrefix} Error reading favicon file.`); };
        reader.readAsDataURL(file);
    });
    clearFaviconButtonEl.addEventListener("click", () => {
        saveSetting(settingsKeys.customFaviconData, null);
        if (faviconFileInputEl) faviconFileInputEl.value = "";
        if (faviconPreviewEl) { faviconPreviewEl.src = ""; faviconPreviewEl.style.display = "none"; }
        if (clearFaviconButtonEl) clearFaviconButtonEl.style.display = "none";
        if (feedbackElement) { feedbackElement.textContent = "Favicon cleared. Default will be applied."; setTimeout(() => { if (feedbackElement.textContent === "Favicon cleared. Default will be applied.") feedbackElement.textContent = " "; }, 2500); }
    });

    scrollableContent.append(settingsSection, newChatColorPicker, wsIconColorPicker, wsFontColorPicker, customTitleInput, globalFontSettingsSection, fontSettingsContainer, faviconSettingsSection);

    const footer = document.createElement("div"); footer.className = "tweak-modal-footer";
    const closeButtonBottom = document.createElement("button"); closeButtonBottom.id = "tweak-modal-bottom-close"; closeButtonBottom.textContent = "Close";
    closeButtonBottom.addEventListener("click", () => toggleModal(false));
    footer.appendChild(closeButtonBottom);

    modalElement.append(header, feedbackElement, scrollableContent, footer);
    modalOverlay.appendChild(modalElement);
    document.body.appendChild(modalOverlay);

    // --- NEW: Event Listeners for Global Font Controls ---
    const googleFontSelect = document.getElementById(`${SCRIPT_PREFIX}google-font-select`);
    const localFontInput = document.getElementById(`${SCRIPT_PREFIX}local-font-input`);
    const urlFontInput = document.getElementById(`${SCRIPT_PREFIX}global-font-url`);
    const urlFontFamilyInput = document.getElementById(`${SCRIPT_PREFIX}global-font-family`);
    const fontWeightSelect = document.getElementById(`${SCRIPT_PREFIX}font-weight-select`);

    const handleApplyGlobalFont = () => {
        const selectedGoogleFont = googleFontSelect.value;
        const enteredLocalFont = localFontInput.value.trim();
        const enteredUrl = urlFontInput.value.trim();
        const enteredUrlFamily = urlFontFamilyInput.value.trim();
        const selectedWeight = fontWeightSelect.value;
        let settingToSave = null;

        if (selectedGoogleFont) {
            settingToSave = { name: selectedGoogleFont, isGoogle: true, isUrl: false, custom: false, weight: selectedWeight };
        } else if (enteredUrl) {
            // Validate URL and require a family name
            if (!(enteredUrl.startsWith("http://") || enteredUrl.startsWith("https://"))) {
                if (feedbackElement) { feedbackElement.textContent = "Invalid Web Font URL. It must start with http:// or https://"; setTimeout(() => { if (feedbackElement.textContent.startsWith("Invalid Web Font URL")) feedbackElement.textContent = " "; }, 2500); }
                return;
            }
            if (!enteredUrlFamily) {
                if (feedbackElement) { feedbackElement.textContent = "Please provide the URL Font Family name."; setTimeout(() => { if (feedbackElement.textContent.startsWith("Please provide the URL Font Family")) feedbackElement.textContent = " "; }, 2500); }
                return;
            }
            settingToSave = { name: enteredUrlFamily, isGoogle: false, isUrl: true, custom: false, url: enteredUrl, weight: selectedWeight };
        } else if (enteredLocalFont) {
            settingToSave = { name: enteredLocalFont, isGoogle: false, isUrl: false, custom: true, weight: selectedWeight };
        } else {
            // If no inputs are provided, only update weight when an existing font is set
            const currentSetting = getSetting(settingsKeys.globalUiFont, null);
            if (currentSetting && (currentSetting.name || currentSetting.isUrl)) {
                settingToSave = { ...currentSetting, weight: selectedWeight };
            } else {
                // Nothing to apply
                if (feedbackElement) { feedbackElement.textContent = "No Global UI Font selected."; setTimeout(() => { if (feedbackElement.textContent === "No Global UI Font selected.") feedbackElement.textContent = " "; }, 2000); }
                return;
            }
        }
        saveSetting(settingsKeys.globalUiFont, settingToSave);
    };

    const handleResetGlobalFont = () => {
        saveSetting(settingsKeys.globalUiFont, null); // This triggers applyGlobalUiFont to reset
        googleFontSelect.value = '';
        localFontInput.value = '';
        urlFontInput.value = '';
        urlFontFamilyInput.value = '';
        fontWeightSelect.value = DEFAULT_FONT_WEIGHT;
    };

    document.getElementById(`${SCRIPT_PREFIX}apply-font-button`).addEventListener('click', handleApplyGlobalFont);
    document.getElementById(`${SCRIPT_PREFIX}reset-font-button`).addEventListener('click', handleResetGlobalFont);

    // Ensure only one source is active at a time, keep weight selection
    googleFontSelect.addEventListener('change', () => {
      if (googleFontSelect.value) {
        localFontInput.value = '';
        urlFontInput.value = '';
        urlFontFamilyInput.value = '';
      }
    });
    localFontInput.addEventListener('input', () => {
      if (localFontInput.value.trim()) {
        googleFontSelect.value = '';
        urlFontInput.value = '';
        urlFontFamilyInput.value = '';
      }
    });
    urlFontInput.addEventListener('input', () => {
      if (urlFontInput.value.trim()) {
        googleFontSelect.value = '';
        localFontInput.value = '';
      }
    });
    urlFontFamilyInput.addEventListener('input', () => {
      if (urlFontFamilyInput.value.trim()) {
        googleFontSelect.value = '';
        localFontInput.value = '';
      }
    });
  }

  function loadSettingsIntoModal() {
    if (!modalElement) return;
    document.querySelectorAll(".tweak-checkbox-item input[type='checkbox']").forEach(cb => { cb.checked = getSetting(cb.id, cb.id === settingsKeys.showModalButton); });
    document.getElementById("tweak_newChatButtonColor_input").value = getSetting(settingsKeys.newChatButtonColor, defaultNewChatButtonColor);
    document.getElementById("tweak_workspaceIconColor_input").value = getSetting(settingsKeys.workspaceIconColor, defaultWorkspaceIconColorVisual);
    document.getElementById("tweak_workspaceFontColor_input").value = getSetting(settingsKeys.workspaceFontColor, defaultWorkspaceFontColorVisual);
    document.getElementById("tweak_customPageTitle_input").value = getSetting(settingsKeys.customPageTitle, "");
    document.getElementById("tweak_localFontFamily_input").value = getSetting(settingsKeys.localFontFamily, "");
    document.getElementById("tweak_customFontUrl_input").value = getSetting(settingsKeys.customFontUrl, "");
    document.getElementById("tweak_customFontFamily_input").value = getSetting(settingsKeys.customFontFamily, "");
    const fontSize = getSetting(settingsKeys.customFontSize, null);
    document.getElementById("tweak_customFontSize_input").value = fontSize !== null ? fontSize : "";

    // --- Load Global Font Settings into Modal, including URL ---
    const fontSetting = getSetting(settingsKeys.globalUiFont, null);
    const googleFontSelect = document.getElementById(`${SCRIPT_PREFIX}google-font-select`);
    const localFontInput = document.getElementById(`${SCRIPT_PREFIX}local-font-input`);
    const urlFontInput = document.getElementById(`${SCRIPT_PREFIX}global-font-url`);
    const urlFontFamilyInput = document.getElementById(`${SCRIPT_PREFIX}global-font-family`);
    const fontWeightSelect = document.getElementById(`${SCRIPT_PREFIX}font-weight-select`);

    if (fontSetting && (fontSetting.name || fontSetting.isUrl)) {
        if (fontSetting.isGoogle) {
            googleFontSelect.value = fontSetting.name || '';
            localFontInput.value = '';
            urlFontInput.value = '';
            urlFontFamilyInput.value = '';
        } else if (fontSetting.isUrl) {
            googleFontSelect.value = '';
            localFontInput.value = '';
            urlFontInput.value = fontSetting.url || '';
            urlFontFamilyInput.value = fontSetting.name || '';
        } else {
            // Local font
            localFontInput.value = fontSetting.name || '';
            googleFontSelect.value = '';
            urlFontInput.value = '';
            urlFontFamilyInput.value = '';
        }
        fontWeightSelect.value = fontSetting.weight || DEFAULT_FONT_WEIGHT;
    } else {
        googleFontSelect.value = '';
        localFontInput.value = '';
        urlFontInput.value = '';
        urlFontFamilyInput.value = '';
        fontWeightSelect.value = DEFAULT_FONT_WEIGHT;
    }

    const storedFaviconDataRaw = getSetting(settingsKeys.customFaviconData, null);
    const faviconFileInputElModal = document.getElementById("tweak_customFaviconData_input");
    const faviconPreviewElModal = document.getElementById("tweak_favicon_preview");
    const clearFaviconButtonElModal = document.getElementById("tweak_clear_favicon_button");
    const cleanedFaviconDataModal = cleanValue(storedFaviconDataRaw);
    if (faviconFileInputElModal) faviconFileInputElModal.value = "";
    if (cleanedFaviconDataModal && cleanedFaviconDataModal.trim() !== "") {
        if (faviconPreviewElModal) { faviconPreviewElModal.src = cleanedFaviconDataModal; faviconPreviewElModal.style.display = "inline-block"; }
        if (clearFaviconButtonElModal) clearFaviconButtonElModal.style.display = "inline-block";
    } else {
        if (faviconPreviewElModal) { faviconPreviewElModal.src = ""; faviconPreviewElModal.style.display = "none"; }
        if (clearFaviconButtonElModal) clearFaviconButtonElModal.style.display = "none";
    }
    if (feedbackElement) feedbackElement.textContent = " ";
  }

  function saveSetting(key, value) {
    try {
        let valueToStore = value;
        if ([settingsKeys.customFontUrl, settingsKeys.customFontFamily, settingsKeys.localFontFamily, settingsKeys.customPageTitle, settingsKeys.customFaviconData].includes(key)) {
            valueToStore = (value && String(value).trim() !== "") ? String(value).trim() : null;
        } else if (key === settingsKeys.customFontSize) {
            valueToStore = (value !== null && !isNaN(parseInt(value, 10)) && String(value).trim() !== "") ? parseInt(value, 10) : null;
        } else if (key === settingsKeys.globalUiFont && value) {
             valueToStore = value; // It's an object, store as is
        }

        if (valueToStore === null) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(
              key,
              (typeof valueToStore === 'object' || typeof valueToStore === 'boolean' || typeof valueToStore === 'number')
                ? JSON.stringify(valueToStore)
                : valueToStore
            );
        }

        if (feedbackElement && key !== settingsKeys.customFaviconData) {
            feedbackElement.textContent = "Settings saved.";
            setTimeout(() => { if (feedbackElement.textContent === "Settings saved.") feedbackElement.textContent = " "; }, 2000);
        }

        // Apply relevant changes immediately
        applyStylesBasedOnSettings();
        if (key === settingsKeys.customPageTitle) applyCustomTitle();
        if ([settingsKeys.customFontUrl, settingsKeys.customFontFamily, settingsKeys.localFontFamily, settingsKeys.customFontSize].includes(key)) {
            applyCustomFont();
        }
        if (key === settingsKeys.customFaviconData) {
            applyCustomFavicon();
        }
        if (key === settingsKeys.globalUiFont) {
            applyGlobalUiFont();
        }

    } catch (error) {
        console.error(`${consolePrefix} Error saving setting ${key}:`, error);
        if (feedbackElement) feedbackElement.textContent = "Error saving settings.";
    }
  }

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

  document.addEventListener("keydown", (event) => {
    const isMac = navigator.userAgent.toUpperCase().includes("MAC");
    const modifierPressed = isMac ? event.metaKey : event.altKey;
    if (event.shiftKey && modifierPressed && event.key.toUpperCase() === "T") {
      event.preventDefault();
      event.stopPropagation();
      toggleModal();
    }
    if (event.key === 'Escape' && modalOverlay && window.getComputedStyle(modalOverlay).display !== 'none') {
        event.preventDefault();
        toggleModal(false);
    }
  });

  function initializeTweaks() {
    if (originalPageTitle === null) originalPageTitle = document.title;
    createSettingsModal();
    applyStylesBasedOnSettings();
    applyCustomTitle();
    applyCustomFont(); // Chat-specific font
    applyGlobalUiFont(); // Global UI font
    applyCustomFavicon();
    setupFaviconObserver();
  }

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
        svgIcon.setAttribute("class", "w-5 h-5 flex-shrink-0"); svgIcon.setAttribute("viewBox", "0 0 24 24"); svgIcon.setAttribute("fill", "currentColor");
        svgIcon.style.color = getSetting(settingsKeys.workspaceIconColor, defaultWorkspaceIconColorVisual);
        const svgPath = document.createElementNS("http://www.w3.org/2000/svg","path");
        svgPath.setAttribute("d", "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4c-.83 0-1.5-.67-1.5-1.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z");
        svgIcon.appendChild(svgPath); iconDiv.appendChild(svgIcon);
        const textSpan = document.createElement("span");
        const refTextSpan = referenceButtonForStyle.querySelector(":scope > span > span:last-child");
        textSpan.className = refTextSpan ? refTextSpan.className : "font-normal self-stretch text-center text-xs leading-4 md:leading-none";
        textSpan.textContent = "Tweaks";
        outerSpan.append(iconDiv, textSpan); tweaksButton.appendChild(outerSpan);
        tweaksButton.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); toggleModal(true); });
        if (settingsButton.parentNode) {
          settingsButton.parentNode.insertBefore(tweaksButton, settingsButton);
          tweaksButton.style.display = getSetting(settingsKeys.showModalButton, true) ? "inline-flex" : "none";
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
  console.log(`${consolePrefix} Initialized. Shortcut: Shift+Alt+T (Win/Linux) or Shift+Cmd+T (Mac).`);

  function applyCustomFont() {
    const customFontUrl = getSetting(settingsKeys.customFontUrl, null);
    const customFontFamilyFromUrl = getSetting(settingsKeys.customFontFamily, null);
    const localFontFamilyUser = getSetting(settingsKeys.localFontFamily, null);
    const customFontSizeRaw = getSetting(settingsKeys.customFontSize, null);
    const styleId = "tweak-custom-font-style";
    let styleElement = document.getElementById(styleId);
    if (!styleElement) { styleElement = document.createElement("style"); styleElement.id = styleId; document.head.appendChild(styleElement); }
    let cssRules = [];
    const cleanedUrl = cleanValue(customFontUrl);
    const cleanedFamilyFromUrl = cleanValue(customFontFamilyFromUrl);
    const cleanedLocalFamily = cleanValue(localFontFamilyUser);
    const cleanedSize = (customFontSizeRaw !== null && !isNaN(parseInt(customFontSizeRaw, 10)) && parseInt(customFontSizeRaw, 10) > 0) ? parseInt(customFontSizeRaw, 10) : null;
    if (cleanedUrl && (cleanedUrl.startsWith("http://") || cleanedUrl.startsWith("https://"))) { cssRules.push(`@import url('${cleanedUrl}');`); }
    let effectiveFontFamily = cleanedLocalFamily || cleanedFamilyFromUrl;
    if (effectiveFontFamily) { effectiveFontFamily = effectiveFontFamily.trim(); if (effectiveFontFamily.includes(" ") && !/^['"].*['"]$/.test(effectiveFontFamily)) { effectiveFontFamily = `'${effectiveFontFamily}'`; } }
    let styleDeclarations = [];
    if (effectiveFontFamily) {
        const fallbackFontStack = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;
        styleDeclarations.push(`  font-family: ${effectiveFontFamily}, ${fallbackFontStack} !important;`);
    }
    if (cleanedSize) { styleDeclarations.push(`  font-size: ${cleanedSize}px !important;`); }
    if (styleDeclarations.length > 0) {
        const declarationsString = styleDeclarations.join("\n");
        cssRules.push(`
            [data-element-id="chat-space-middle-part"],
            [data-element-id="chat-space-middle-part"] .prose,
            [data-element-id="chat-space-middle-part"] .prose-sm,
            [data-element-id="chat-space-middle-part"] .text-sm,
            div[data-radix-scroll-area-viewport] .whitespace-pre-wrap,
            .group.flex.p-3.gap-3.items-start.text-sm.text-gray-700
            {
              ${declarationsString}
            }`);
    } else {
        if (styleElement.textContent !== "") { styleElement.textContent = ""; }
        return;
    }
    const newStyleContent = cssRules.join("\n");
    if (styleElement.textContent !== newStyleContent) { styleElement.textContent = newStyleContent; }
  }

  function applyCustomFavicon() {
    if (faviconObserver) faviconObserver.disconnect();
    const faviconDataRaw = getSetting(settingsKeys.customFaviconData, null);
    const customFaviconHref = cleanValue(faviconDataRaw);
    document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach(link => link.remove());
    const newFaviconLink = document.createElement("link");
    newFaviconLink.rel = "icon";
    if (customFaviconHref && customFaviconHref.trim() !== "") {
        newFaviconLink.href = customFaviconHref;
        if (customFaviconHref.startsWith('data:image/svg+xml')) newFaviconLink.type = 'image/svg+xml';
        else if (customFaviconHref.startsWith('data:image/png')) newFaviconLink.type = 'image/png';
        else if (customFaviconHref.startsWith('data:image/jpeg')) newFaviconLink.type = 'image/jpeg';
        else if (customFaviconHref.startsWith('data:image/gif')) newFaviconLink.type = 'image/gif';
        else if (customFaviconHref.startsWith('data:image/x-icon')) newFaviconLink.type = 'image/x-icon';
    } else {
        newFaviconLink.href = DEFAULT_FALLBACK_FAVICON;
        if (DEFAULT_FALLBACK_FAVICON.endsWith('.ico')) newFaviconLink.type = 'image/x-icon';
    }
    document.head.appendChild(newFaviconLink);
    if (faviconObserver && document.head) {
        faviconObserver.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ["href", "rel", "type"], });
    }
  }

  function setupFaviconObserver() {
    if (faviconObserver) faviconObserver.disconnect();
    faviconObserver = new MutationObserver((mutationsList) => {
        let sitePotentiallyChangedFavicon = false;
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === "LINK" && (node.getAttribute('rel') === 'icon' || node.getAttribute('rel') === 'shortcut icon')) {
                        const currentCustomHref = cleanValue(getSetting(settingsKeys.customFaviconData, null)) || DEFAULT_FALLBACK_FAVICON;
                        if (node.href !== currentCustomHref) { sitePotentiallyChangedFavicon = true; }
                    }
                });
                mutation.removedNodes.forEach(node => { if (node.nodeName === "LINK" && (node.getAttribute('rel') === 'icon' || node.getAttribute('rel') === 'shortcut icon')) { sitePotentiallyChangedFavicon = true; } });
            } else if (mutation.type === "attributes" && mutation.target.nodeName === "LINK" && (mutation.target.getAttribute('rel') === 'icon' || mutation.target.getAttribute('rel') === 'shortcut icon')) {
                const currentCustomHref = cleanValue(getSetting(settingsKeys.customFaviconData, null)) || DEFAULT_FALLBACK_FAVICON;
                if (mutation.target.href !== currentCustomHref) { sitePotentiallyChangedFavicon = true; }
            }
        }
        if (sitePotentiallyChangedFavicon) { setTimeout(() => applyCustomFavicon(), 50); }
    });
    if (document.head) {
        faviconObserver.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ["href", "rel", "type"], });
    } else {
        console.warn(`${consolePrefix} document.head not available for faviconObserver. Retrying.`);
        setTimeout(setupFaviconObserver, 200);
    }
  }

})();
