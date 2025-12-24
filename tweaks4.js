(function () {
  "use strict";

  // --- Configuration ---
  const SCRIPT_PREFIX = 'tmfc_';
  const GOOGLE_FONTS = [
    "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Raleway",
    "Poppins", "Nunito", "Merriweather", "Inter", "Source Sans Pro",
    "PT Sans", "Ubuntu", "Noto Sans", "Fira Sans", "Work Sans",
    "Roboto Condensed", "Roboto Slab", "Playfair Display", "Cormorant Garamond",
    "Bebas Neue", "Titillium Web", "Josefin Sans", "Arimo", "Lexend", "EB Garamond",
    "DM Sans", "Manrope", "Space Grotesk", "Sora"
  ];
  const DEFAULT_FONT_WEIGHT = '400';

  const settingsKeys = {
    hideTeams: "tweak_hideTeams",
    hideKB: "tweak_hideKB",
    hideLogo: "tweak_hideLogo",
    hidePinnedChars: "tweak_hidePinnedChars",
    newChatButtonColor: "tweak_newChatButtonColor",
    workspaceIconColor: "tweak_workspaceIconColor",
    workspaceFontColor: "tweak_workspaceFontColor",
    customPageTitle: "tweak_customPageTitle",
    customFaviconData: "tweak_customFaviconData",
    customFontUrl: "tweak_customFontUrl",
    customFontFamily: "tweak_customFontFamily",
    localFontFamily: "tweak_localFontFamily",
    customFontSize: "tweak_customFontSize",
    globalUiFont: "tweak_globalUiFont",
  };

  const consolePrefix = "TypingMind Tweaks:";
  const defaultNewChatButtonColor = "#2563eb";
  const defaultWorkspaceIconColorVisual = "#9ca3af";
  const defaultWorkspaceFontColorVisual = "#d1d5db";
  const DEFAULT_FALLBACK_FAVICON = "/favicon.ico";
  let originalPageTitle = null;
  let faviconObserver = null;
  let activeGlobalUIFontLink = null;

  const cleanValue = (value) => {
    if (value === null || typeof value === 'undefined') return null;
    let cleaned = String(value).trim();
    if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
      cleaned = cleaned.slice(1, -1);
    }
    if (cleaned === "null") return null;
    return cleaned;
  };

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

  function applyGlobalUiFont() {
    const fontSetting = getSetting(settingsKeys.globalUiFont, null);
    const targetElement = document.body;
    if (!fontSetting || (!fontSetting.name && !fontSetting.isUrl)) {
      targetElement.style.fontFamily = '';
      targetElement.style.fontWeight = '';
      removeActiveGlobalUIFontLink();
      return;
    }
    if (fontSetting.isGoogle && fontSetting.name) {
      loadGlobalGoogleFont(fontSetting.name);
    } else if (fontSetting.isUrl && fontSetting.url) {
      loadGlobalUrlFont(fontSetting.url);
    } else {
      removeActiveGlobalUIFontLink();
    }
    const safeName = fontSetting.name && String(fontSetting.name).trim() !== "" ? `"${fontSetting.name}"` : null;
    const fallbackStack = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
    const fontFamilyStack = safeName ? `${safeName}, ${fallbackStack}` : fallbackStack;
    targetElement.style.fontFamily = fontFamilyStack;
    targetElement.style.fontWeight = fontSetting.weight || DEFAULT_FONT_WEIGHT;
  }

  function applyStylesBasedOnSettings() {
    const hideTeams = getSetting(settingsKeys.hideTeams);
    const hideKB = getSetting(settingsKeys.hideKB);
    const hideLogo = getSetting(settingsKeys.hideLogo);
    const hidePinnedChars = getSetting(settingsKeys.hidePinnedChars);
    const newChatColor = getSetting(settingsKeys.newChatButtonColor, null);
    const wsIconColor = getSetting(settingsKeys.workspaceIconColor, null);
    const wsFontColor = getSetting(settingsKeys.workspaceFontColor, null);

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
        tweaksButton.style.display = "inline-flex";
      }
    }
    const logoImage = document.querySelector('img[alt="TypingMind"][src="/logo.png"]');
    if (logoImage && logoImage.parentElement && logoImage.parentElement.parentElement) {
      logoImage.parentElement.parentElement.style.display = hideLogo ? "none" : "";
    }
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
      .tweak-text-input-wrapper { display: flex; align-items: center; }
      .tweak-text-item input[type='text'], .tweak-text-item input[type='number'] { width: 160px; padding: 6px 10px; border: 1px solid #777; margin-right: 10px; border-radius: 4px; background-color: #555; color: #f0f0f0; font-size: 0.9em; }
      .tweak-text-item input[type='text']::placeholder, .tweak-text-item input[type='number']::placeholder { color: #aaa; opacity: 1; }
      #tweak-modal-scrollable-content { max-height: calc(80vh - 180px); overflow-y: auto; overflow-x: hidden; padding-right: 10px; margin-right: -10px; }
      #tweak-modal-scrollable-content::-webkit-scrollbar { width: 8px; }
      #tweak-modal-scrollable-content::-webkit-scrollbar-track { background: #444; border-radius: 4px; }
      #tweak-modal-scrollable-content::-webkit-scrollbar-thumb { background-color: #888; border-radius: 4px; border: 2px solid #444; }
      #tweak-modal-scrollable-content::-webkit-scrollbar-thumb:hover { background-color: #aaa; }
      .font-customization-subsection-title { color: #d0d0d0; font-size: 0.95em; margin-top: 20px; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px dashed #555; }
      
      /* --- GLOBAL FONT SECTION --- */
      .${SCRIPT_PREFIX}form-group { margin-bottom: 18px; }
      .${SCRIPT_PREFIX}form-group label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 0.9em; color: #cccccc; }
      .${SCRIPT_PREFIX}form-group select, .${SCRIPT_PREFIX}form-group input[type="text"] { width: 100%; padding: 8px 10px; border: 1px solid #777; border-radius: 4px; box-sizing: border-box; font-size: 0.95em; background-color: #555; color: #f0f0f0; }
      .${SCRIPT_PREFIX}button-group { display: flex; justify-content: flex-end; margin-top: 15px; gap: 12px; }
      .${SCRIPT_PREFIX}button-group button { padding: 6px 14px; border: 1px solid transparent; border-radius: 4px; cursor: pointer; font-size: 0.9em; font-weight: 500; }
      .${SCRIPT_PREFIX}apply-button { background-color: #0d6efd; color: white; }
      .${SCRIPT_PREFIX}apply-button:hover { background-color: #0b5ed7; }
      .${SCRIPT_PREFIX}reset-button { background-color: #6c757d; color: white; }
      .${SCRIPT_PREFIX}reset-button:hover { background-color: #5a6268; }

      /* --- WORKSPACE TWEAKS BUTTON ALIGNMENT & VISIBILITY FIX --- */
      #workspace-tab-tweaks {
         justify-content: center !important;
         padding-left: 0 !important;
         padding-right: 0 !important;
         margin-left: 0 !important;
         width: 100% !important;
      }
      #workspace-tab-tweaks > span {
         justify-content: center !important;
         align-items: center !important;
         width: 100% !important;
      }
      /* Ensure the icon wrapper is visible and centered */
      #workspace-tab-tweaks > span > div:first-child {
         display: flex !important;
         justify-content: center !important;
         align-items: center !important;
         width: auto !important;
         height: auto !important;
      }
      /* FORCE SVG VISIBILITY: Prevents "invincible" (invisible) icon */
      #workspace-tab-tweaks svg {
         display: block !important;
         visibility: visible !important;
         opacity: 1 !important;
         min-width: 20px !important;
         min-height: 20px !important;
      }
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

    const settingsSection = document.createElement("div");
    settingsSection.className = "tweak-settings-section";
    const settingsHeader = document.createElement('h3');
    settingsHeader.textContent = 'General Settings';
    settingsSection.appendChild(settingsHeader);

    const checkboxSettings = [
      { key: settingsKeys.hideTeams, label: "Hide 'Teams' menu item" },
      { key: settingsKeys.hideKB, label: "Hide 'KB' menu item" },
      { key: settingsKeys.hideLogo, label: "Hide Logo & Announcement" },
      { key: settingsKeys.hidePinnedChars, label: "Hide 'Characters' in New Chat" },
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

    function createTextInput(id, labelText, settingKey, placeholder, type = "text", attributes = {}) {
      const item = document.createElement("div");
      item.className = "tweak-text-item";
      if (type !== "number") {
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

    // --- Global UI Font Section ---
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
    fontSettingsContainer.className = "tweak-settings-section";
    fontSettingsContainer.style.marginTop = "20px";
    fontSettingsContainer.innerHTML = `<h3>Chat Font Customization</h3>`;
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
    localFontFamilyInput.style.borderTop = "none";
    localFontFamilyInput.style.paddingTop = "0";
    localFontFamilyInput.style.marginTop = "5px";
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
    customFontUrlInput.style.borderTop = "none";
    customFontUrlInput.style.paddingTop = "0";
    customFontUrlInput.style.marginTop = "5px";
    fontSettingsContainer.appendChild(customFontUrlInput);
    const customFontFamilyInput = createTextInput("tweak_customFontFamily_input", "URL Font Family:", settingsKeys.customFontFamily, "Font Name from URL");
    customFontFamilyInput.style.borderTop = "none";
    customFontFamilyInput.style.paddingTop = "0";
    customFontFamilyInput.style.marginTop = "5px";
    customFontFamilyInput.querySelector('input').style.width = '120px';
    fontSettingsContainer.appendChild(customFontFamilyInput);
    const sizeSubTitle = document.createElement("div");
    sizeSubTitle.className = "font-customization-subsection-title";
    sizeSubTitle.textContent = "Font Size";
    fontSettingsContainer.appendChild(sizeSubTitle);
    const fontSizeInput = createTextInput("tweak_customFontSize_input", "Font Size (px):", settingsKeys.customFontSize, "e.g., 16", "number", {
      min: "8",
      step: "1"
    });
    fontSizeInput.style.borderTop = "none";
    fontSizeInput.style.paddingTop = "0";
    fontSizeInput.style.marginTop = "5px";
    fontSizeInput.querySelector('input').style.width = '80px';
    fontSettingsContainer.appendChild(fontSizeInput);

    const faviconSettingsSection = document.createElement("div");
    faviconSettingsSection.className = "tweak-settings-section";
    faviconSettingsSection.style.marginTop = "20px";
    faviconSettingsSection.innerHTML = `<h3>Favicon Customization</h3>`;
    const faviconItemContainer = document.createElement("div");
    faviconItemContainer.style.padding = "5px 0px";
    const faviconInputGroup = document.createElement("div");
    faviconInputGroup.style.display = "flex";
    faviconInputGroup.style.alignItems = "center";
    faviconInputGroup.style.marginBottom = "10px";
    const faviconLabelEl = document.createElement("label");
    faviconLabelEl.htmlFor = "tweak_customFaviconData_input";
    faviconLabelEl.textContent = "Upload Favicon:";
    faviconLabelEl.style.color = "#e0e0e0";
    faviconLabelEl.style.fontSize = "1em";
    faviconLabelEl.style.marginRight = "10px";
    faviconLabelEl.style.flexShrink = "0";
    const faviconFileInputEl = document.createElement("input");
    faviconFileInputEl.type = "file";
    faviconFileInputEl.id = "tweak_customFaviconData_input";
    faviconFileInputEl.accept = ".ico,.png,.jpg,.jpeg,.svg,.gif";
    faviconFileInputEl.style.color = "#f0f0f0";
    faviconFileInputEl.style.padding = "5px";
    faviconFileInputEl.style.border = "1px solid #777";
    faviconFileInputEl.style.borderRadius = "4px";
    faviconFileInputEl.style.backgroundColor = "#555";
    faviconFileInputEl.style.width = '140px';
    faviconInputGroup.appendChild(faviconLabelEl);
    faviconInputGroup.appendChild(faviconFileInputEl);
    faviconItemContainer.appendChild(faviconInputGroup);
    const faviconControlsGroup = document.createElement("div");
    faviconControlsGroup.style.display = "flex";
    faviconControlsGroup.style.alignItems = "center";
    faviconControlsGroup.style.minHeight = "30px";
    const faviconPreviewEl = document.createElement("img");
    faviconPreviewEl.id = "tweak_favicon_preview";
    faviconPreviewEl.alt = "Favicon Preview";
    faviconPreviewEl.style.width = "24px";
    faviconPreviewEl.style.height = "24px";
    faviconPreviewEl.style.marginRight = "10px";
    faviconPreviewEl.style.border = "1px solid #777";
    faviconPreviewEl.style.borderRadius = "3px";
    faviconPreviewEl.style.display = "none";
    const clearFaviconButtonEl = document.createElement("button");
    clearFaviconButtonEl.id = "tweak_clear_favicon_button";
    clearFaviconButtonEl.textContent = "Clear Favicon";
    clearFaviconButtonEl.className = "tweak-reset-button";
    clearFaviconButtonEl.type = "button";
    clearFaviconButtonEl.style.display = "none";
    faviconControlsGroup.appendChild(faviconPreviewEl);
    faviconControlsGroup.appendChild(clearFaviconButtonEl);
    faviconItemContainer.appendChild(faviconControlsGroup);
    faviconSettingsSection.appendChild(faviconItemContainer);
    faviconFileInputEl.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        saveSetting(settingsKeys.customFaviconData, e.target.result);
        if (faviconPreviewEl) {
          faviconPreviewEl.src = e.target.result;
          faviconPreviewEl.style.display = "inline-block";
        }
        if (clearFaviconButtonEl) clearFaviconButtonEl.style.display = "inline-block";
        if (feedbackElement) {
          feedbackElement.textContent = "Favicon updated.";
          setTimeout(() => {
            if (feedbackElement.textContent === "Favicon updated.") feedbackElement.textContent = " ";
          }, 2000);
        }
      };
      reader.onerror = function () {
        if (feedbackElement) feedbackElement.textContent = "Error reading favicon file.";
        console.error(`${consolePrefix} Error reading favicon file.`);
      };
      reader.readAsDataURL(file);
    });
    clearFaviconButtonEl.addEventListener("click", () => {
      saveSetting(settingsKeys.customFaviconData, null);
      if (faviconFileInputEl) faviconFileInputEl.value = "";
      if (faviconPreviewEl) {
        faviconPreviewEl.src = "";
        faviconPreviewEl.style.display = "none";
      }
      if (clearFaviconButtonEl) clearFaviconButtonEl.style.display = "none";
      if (feedbackElement) {
        feedbackElement.textContent = "Favicon cleared. Default will be applied.";
        setTimeout(() => {
          if (feedbackElement.textContent === "Favicon cleared. Default will be applied.") feedbackElement.textContent = " ";
        }, 2500);
      }
    });

    scrollableContent.append(settingsSection, newChatColorPicker, wsIconColorPicker, wsFontColorPicker, customTitleInput, globalFontSettingsSection, fontSettingsContainer, faviconSettingsSection);

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

    // --- Global Font Listeners ---
    const googleFontSelect = document.getElementById(`${SCRIPT_PREFIX}google-font-select`);
    const localFontInput = document.getElementById(`${SCRIPT_PREFIX}local-font-input`);
    const urlFontInput = document.getElementById(`${SCRIPT_PREFIX}global-font-url`);
    const urlFontFamilyInput = document.getElementById(`${SCRIPT_PREFIX}global-font-family`);
    const fontWeightSelect = document.getElementById(`${SCRIPT_PREFIX}font-weight-select`);
