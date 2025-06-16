(function () {
  "use strict";

  // --- Configuration & Settings Keys ---
  const settingsKeys = {
    // Original Tweak Menu Settings
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
    // Chat-specific font settings (from original Tweak script)
    customFontUrl: "tweak_customFontUrl",
    customFontFamily: "tweak_customFontFamily",
    localFontFamily: "tweak_localFontFamily",
    customFontSize: "tweak_customFontSize",

    // **NEW** Global UI Font Settings (from Font Button script)
    globalUiFont: "tweak_globalUiFont",
  };

  const consolePrefix = "TypingMind Tweaks:";
  const defaultNewChatButtonColor = "#2563eb";
  const defaultWorkspaceIconColorVisual = "#9ca3af";
  const defaultWorkspaceFontColorVisual = "#d1d5db";
  const DEFAULT_FALLBACK_FAVICON = "/favicon.ico";
  const DEFAULT_UI_FONT_WEIGHT = '400';

  // **NEW** - Google Fonts list from the Font Button script
  const GOOGLE_FONTS = [
    "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Raleway",
    "Poppins", "Nunito", "Merriweather", "Inter", "Source Sans Pro",
    "PT Sans", "Ubuntu", "Noto Sans", "Fira Sans", "Work Sans",
    "Roboto Condensed", "Roboto Slab", "Playfair Display", "Cormorant Garamond",
    "Bebas Neue", "Titillium Web", "Josefin Sans", "Arimo", "Lexend", "EB Garamond",
    "DM Sans", "Manrope", "Space Grotesk", "Sora"
  ];

  let originalPageTitle = null;
  let faviconObserver = null;
  let activeGoogleFontLink = null; // **NEW** - To manage the injected Google Font stylesheet

  // --- Helper Functions ---

  const cleanValue = (value) => {
    if (value === null || typeof value === 'undefined') return null;
    let cleaned = String(value).trim();
    if (
      (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("'") && cleaned.endsWith("'"))
    ) {
      cleaned = cleaned.slice(1, -1);
    }
    if (cleaned === "null") return null;
    return cleaned;
  };

  function getSetting(key, defaultValue = false) {
    const value = localStorage.getItem(key);
    if (value === null) {
      return defaultValue;
    }
    if (value === "null") {
      return defaultValue;
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  function saveSetting(key, value) {
    try {
      let valueToStore = value;

      // Type-specific cleaning and validation
      if ([settingsKeys.customFontUrl, settingsKeys.customFontFamily, settingsKeys.localFontFamily, settingsKeys.customPageTitle, settingsKeys.customFaviconData].includes(key)) {
        valueToStore = (value && String(value).trim() !== "") ? String(value).trim() : null;
      } else if (key === settingsKeys.customFontSize) {
        valueToStore = (value !== null && !isNaN(parseInt(value, 10)) && String(value).trim() !== "") ? parseInt(value, 10) : null;
      } else if (key === settingsKeys.globalUiFont) {
        // For the new global font object, we store it as is.
        valueToStore = value;
      }


      if (valueToStore === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, (typeof valueToStore === 'object' || typeof valueToStore === 'boolean' || typeof valueToStore === 'number') ? JSON.stringify(valueToStore) : valueToStore);
      }


      if (feedbackElement && key !== settingsKeys.customFaviconData) {
        feedbackElement.textContent = "Settings saved.";
        setTimeout(() => { if (feedbackElement.textContent === "Settings saved.") feedbackElement.textContent = " "; }, 2000);
      }

      // Apply relevant changes immediately
      applyStylesBasedOnSettings();
      if (key === settingsKeys.customPageTitle) applyCustomTitle();
      if ([settingsKeys.customFontUrl, settingsKeys.customFontFamily, settingsKeys.localFontFamily, settingsKeys.customFontSize].includes(key)) {
        applyChatAreaCustomFont();
      }
      if (key === settingsKeys.customFaviconData) applyCustomFavicon();
      if (key === settingsKeys.globalUiFont) applyGlobalUIFont(); // **NEW**

    } catch (error) {
      console.error(`${consolePrefix} Error saving setting ${key}:`, error);
      if (feedbackElement) feedbackElement.textContent = "Error saving settings.";
    }
  }


  // --- Style & DOM Application Functions ---

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

  // **NEW** - Function to load the Google Font stylesheet (from Font Button script)
  function loadGoogleFont(fontName) {
    if (activeGoogleFontLink) {
      activeGoogleFontLink.remove();
      activeGoogleFontLink = null;
    }
    if (!fontName) return;

    const weightsToLoad = "300;400;500;600;700";
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@${weightsToLoad}&display=swap`;
    const link = document.createElement('link');
    link.href = fontUrl;
    link.rel = 'stylesheet';
    link.onerror = () => console.error(`${consolePrefix} Error loading Google Font: ${fontName}.`);
    document.head.appendChild(link);
    activeGoogleFontLink = link;
  }

  // **NEW** - Merged function to apply the global UI font (from Font Button script)
  function applyGlobalUIFont() {
    const setting = getSetting(settingsKeys.globalUiFont, { name: '', isGoogle: false, custom: false, weight: DEFAULT_UI_FONT_WEIGHT });
    const targetElement = document.body;

    if (!setting || !setting.name) { // Resetting
      targetElement.style.fontFamily = '';
      targetElement.style.fontWeight = '';
      if (activeGoogleFontLink) {
        activeGoogleFontLink.remove();
        activeGoogleFontLink = null;
      }
    } else {
      if (setting.isGoogle) {
        loadGoogleFont(setting.name);
      } else if (activeGoogleFontLink) { // Using local font, remove Google Font
        activeGoogleFontLink.remove();
        activeGoogleFontLink = null;
      }
      const fontFamilyStack = `"${setting.name}", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`;
      targetElement.style.fontFamily = fontFamilyStack;
      targetElement.style.fontWeight = setting.weight || DEFAULT_UI_FONT_WEIGHT;
    }
  }

  function applyChatAreaCustomFont() {
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
    const cleanedSize = (customFontSizeRaw !== null && !isNaN(parseInt(customFontSizeRaw, 10)) && parseInt(customFontSizeRaw, 10) > 0) ? parseInt(customFontSizeRaw, 10) : null;
    if (cleanedUrl && (cleanedUrl.startsWith("http://") || cleanedUrl.startsWith("https://"))) {
      cssRules.push(`@import url('${cleanedUrl}');`);
    }
    let effectiveFontFamily = cleanedLocalFamily || cleanedFamilyFromUrl;
    if (effectiveFontFamily) {
      effectiveFontFamily = effectiveFontFamily.trim();
      if (effectiveFontFamily.includes(" ") && !/^['"].*['"]$/.test(effectiveFontFamily)) {
        effectiveFontFamily = `'${effectiveFontFamily}'`;
      }
    }
    let styleDeclarations = [];
    if (effectiveFontFamily) {
      const fallbackFontStack = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;
      styleDeclarations.push(`  font-family: ${effectiveFontFamily}, ${fallbackFontStack} !important;`);
    }
    if (cleanedSize) {
      styleDeclarations.push(`  font-size: ${cleanedSize}px !important;`);
    }
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
      styleElement.textContent = "";
      return;
    }
    const newStyleContent = cssRules.join("\n");
    if (styleElement.textContent !== newStyleContent) {
      styleElement.textContent = newStyleContent;
    }
  }


  // --- Modal & UI Creation ---

  let modalOverlay = null;
  let modalElement = null;
  let feedbackElement = null;

  function createSettingsModal() {
    if (document.getElementById("tweak-modal-overlay")) return;

    // **NEW** - Merged and adapted styles
    const styles = `
      #tweak-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); display: none; justify-content: center; align-items: center; z-index: 10001; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
      #tweak-modal { background-color: #252525; color: #f0f0f0; padding: 25px 35px; border-radius: 8px; min-width: 380px; max-width: 550px; box-shadow: 0 8px 25px rgba(0,0,0,0.6); position: relative; border: 1px solid #4a4a4a; }
      #tweak-modal h2 { margin-top: 0; margin-bottom: 20px; color: #ffffff; font-size: 1.5em; font-weight: 600; text-align: center; }
      #tweak-modal-feedback { font-size: 0.9em; color: #a0cfff; margin-top: 15px; margin-bottom: 5px; min-height: 1.2em; text-align: center; font-weight: 500; }
      .tweak-settings-section { background-color: #333333; padding: 20px 25px; border-radius: 6px; margin-top: 10px; border: 1px solid #484848; }
      .tweak-section-title { color: #e0e0e0; font-size: 1.1em; margin-bottom: 15px; border-bottom: 1px solid #4a4a4a; padding-bottom: 8px; }
      .tweak-checkbox-item { margin-bottom: 18px; display: flex; align-items: center; }
      .tweak-checkbox-item:last-child { margin-bottom: 5px; }
      .tweak-checkbox-item input[type='checkbox'] { margin-right: 15px; transform: scale(1.2); cursor: pointer; accent-color: #0d6efd; }
      .tweak-checkbox-item label { cursor: pointer; flex-grow: 1; font-size: 1em; color: #e0e0e0; }
      .tweak-modal-footer { margin-top: 25px; padding-top: 15px; border-top: 1px solid #4a4a4a; display: flex; justify-content: flex-end; }
      #tweak-modal-bottom-close { background-color: #dc3545; color: white; border: 1px solid #dc3545; padding: 8px 18px; border-radius: 6px; font-size: 0.95em; font-weight: 500; cursor: pointer; transition: background-color 0.2s ease, border-color 0.2s ease; }
      #tweak-modal-bottom-close:hover { background-color: #c82333; border-color: #bd2130; }
      .tweak-color-item, .tweak-text-item { margin-top: 20px; padding-top: 15px; border-top: 1px solid #4a4a4a; display: flex; align-items: center; justify-content: space-between; }
      .tweak-color-item label, .tweak-text-item label { margin-right: 10px; color: #e0e0e0; font-size: 1em; white-space: nowrap; flex-shrink: 0;}
      .tweak-color-input-wrapper, .tweak-text-input-wrapper { display: flex; align-items: center; flex-grow: 1; }
      .tweak-color-item input[type='color'] { width: 40px; height: 30px; border: 1px solid #777; border-radius: 4px; cursor: pointer; background-color: #555; margin-right: 10px; padding: 2px; }
      .tweak-text-item input[type='text'], .tweak-text-item input[type='number'] { flex-grow: 1; min-width: 50px; padding: 6px 10px; border: 1px solid #777; margin-right: 10px; border-radius: 4px; background-color: #555; color: #f0f0f0; font-size: 0.9em; }
      .tweak-reset-button { background-color: #6c757d; color: white; border: 1px solid #6c757d; padding: 4px 10px; border-radius: 4px; font-size: 0.85em; font-weight: 500; cursor: pointer; transition: background-color 0.2s ease; }
      .tweak-reset-button:hover { background-color: #5a6268; }
      #tweak-modal-scrollable-content { max-height: calc(80vh - 180px); overflow-y: auto; overflow-x: hidden; padding-right: 15px; margin-right: -15px; }
      #tweak-modal-scrollable-content::-webkit-scrollbar { width: 8px; }
      #tweak-modal-scrollable-content::-webkit-scrollbar-track { background: #444; }
      #tweak-modal-scrollable-content::-webkit-scrollbar-thumb { background-color: #888; border-radius: 4px; border: 2px solid #444; }
      .font-customization-subsection-title { color: #d0d0d0; font-size: 0.95em; margin-top: 20px; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px dashed #555; }
      .tweak-ui-font-group { margin-bottom: 18px; } /* New style for font section */
      .tweak-ui-font-group label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 0.9em; color: #cccccc; }
      .tweak-ui-font-group select, .tweak-ui-font-group input[type="text"] { width: 100%; padding: 8px 10px; border: 1px solid #777; border-radius: 4px; box-sizing: border-box; font-size: 0.95em; background-color: #555; color: #f0f0f0; }
      .tweak-ui-font-group select:focus, .tweak-ui-font-group input[type="text"]:focus { border-color: #0d6efd; outline: none; }
      .tweak-ui-font-button-group { display: flex; justify-content: space-between; margin-top: 20px; gap: 12px; }
      .tweak-ui-font-button-group button { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.95em; font-weight: 500; flex-grow: 1; transition: background-color 0.2s ease; }
      .tweak-ui-font-apply-button { background-color: #0d6efd; color: white; }
      .tweak-ui-font-apply-button:hover { background-color: #0b5ed7; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    modalOverlay = document.createElement("div");
    modalOverlay.id = "tweak-modal-overlay";
    modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) toggleModal(false); });
    modalElement = document.createElement("div");
    modalElement.id = "tweak-modal";

    modalElement.innerHTML = `
        <h2>UI Tweaks</h2>
        <p id="tweak-modal-feedback"> </p>
        <div id="tweak-modal-scrollable-content"></div>
        <div class="tweak-modal-footer">
            <button id="tweak-modal-bottom-close">Close</button>
        </div>
    `;

    document.body.appendChild(modalOverlay);
    modalOverlay.appendChild(modalElement);

    const scrollableContent = document.getElementById('tweak-modal-scrollable-content');
    feedbackElement = document.getElementById('tweak-modal-feedback');

    // --- 1. General Settings Section ---
    const generalSettingsSection = document.createElement("div");
    generalSettingsSection.className = "tweak-settings-section";
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
      itemDiv.innerHTML = `<input type="checkbox" id="${setting.key}"><label for="${setting.key}">${setting.label}</label>`;
      itemDiv.querySelector('input').checked = getSetting(setting.key, setting.defaultValue || false);
      itemDiv.querySelector('input').addEventListener("change", (e) => saveSetting(setting.key, e.target.checked));
      generalSettingsSection.appendChild(itemDiv);
    });
    scrollableContent.appendChild(generalSettingsSection);


    // --- 2. Color & Title Settings ---
    function createColorPicker(id, labelText, settingKey, defaultValue) {
      const item = document.createElement("div");
      item.className = "tweak-color-item";
      item.innerHTML = `<label for="${id}">${labelText}</label>
        <div class="tweak-color-input-wrapper">
          <input type="color" id="${id}">
          <button type="button" class="tweak-reset-button">Reset</button>
        </div>`;
      item.querySelector('input').addEventListener("input", (e) => saveSetting(settingKey, e.target.value));
      item.querySelector('button').addEventListener("click", () => {
        saveSetting(settingKey, null);
        item.querySelector('input').value = defaultValue;
      });
      return item;
    }
    scrollableContent.appendChild(createColorPicker("tweak_newChatButtonColor_input", "New Chat Button Color:", settingsKeys.newChatButtonColor, defaultNewChatButtonColor));
    scrollableContent.appendChild(createColorPicker("tweak_workspaceIconColor_input", "Menu Icon Color:", settingsKeys.workspaceIconColor, defaultWorkspaceIconColorVisual));
    scrollableContent.appendChild(createColorPicker("tweak_workspaceFontColor_input", "Menu Font Color:", settingsKeys.workspaceFontColor, defaultWorkspaceFontColorVisual));

    function createTextInput(id, labelText, settingKey, placeholder, type = "text", attributes = {}) {
        const item = document.createElement("div");
        item.className = "tweak-text-item";
        if (type !== 'number') item.style.borderTop = "1px solid #4a4a4a";

        item.innerHTML = `<label for="${id}">${labelText}</label>
            <div class="tweak-text-input-wrapper">
                <input type="${type}" id="${id}" placeholder="${placeholder}">
                <button type="button" class="tweak-reset-button">Clear</button>
            </div>`;
        const input = item.querySelector('input');
        Object.keys(attributes).forEach(attr => input.setAttribute(attr, attributes[attr]));
        input.addEventListener("input", (e) => saveSetting(settingKey, e.target.value || null));
        item.querySelector('button').addEventListener("click", () => {
            saveSetting(settingKey, null);
            input.value = "";
        });
        return item;
    }
    scrollableContent.appendChild(createTextInput("tweak_customPageTitle_input", "Page Title:", settingsKeys.customPageTitle, "Custom Page Title"));


    // **NEW** --- 3. Global UI Font Section (from Font Button script) ---
    const globalFontSection = document.createElement("div");
    globalFontSection.className = "tweak-settings-section";
    globalFontSection.style.marginTop = "20px";
    globalFontSection.innerHTML = `
        <h3 class="tweak-section-title">Global UI Font</h3>
        <p style="font-size: 0.85em; color: #bbb; margin-bottom: 15px;">Applies a font to the entire user interface (menus, buttons, etc.).</p>

        <div class="tweak-ui-font-group">
            <label for="tweak_global_google-font-select">Google Font:</label>
            <select id="tweak_global_google-font-select">
                <option value="">-- Select Google Font --</option>
                ${GOOGLE_FONTS.sort().map(font => `<option value="${font}">${font}</option>`).join('')}
            </select>
        </div>

        <div class="tweak-ui-font-group">
            <label for="tweak_global_local-font-input">Local Font (Type exact name):</label>
            <input type="text" id="tweak_global_local-font-input" placeholder="e.g., Arial, Cascadia Code">
        </div>

        <div class="tweak-ui-font-group">
            <label for="tweak_global_font-weight-select">Font Weight:</label>
            <select id="tweak_global_font-weight-select">
                <option value="300">Light (300)</option>
                <option value="400">Normal (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi-Bold (600)</option>
                <option value="700">Bold (700)</option>
            </select>
        </div>

        <div class="tweak-ui-font-button-group">
            <button class="tweak-ui-font-apply-button" id="tweak_global_apply-font-button">Apply UI Font</button>
            <button class="tweak-reset-button" id="tweak_global_reset-font-button">Reset UI Font</button>
        </div>
    `;
    scrollableContent.appendChild(globalFontSection);

    // Event listeners for the new section
    const googleFontSelect = globalFontSection.querySelector('#tweak_global_google-font-select');
    const localFontInput = globalFontSection.querySelector('#tweak_global_local-font-input');
    googleFontSelect.addEventListener('change', () => { if (googleFontSelect.value) localFontInput.value = ''; });
    localFontInput.addEventListener('input', () => { if (localFontInput.value) googleFontSelect.value = ''; });

    globalFontSection.querySelector('#tweak_global_apply-font-button').addEventListener('click', () => {
        const selectedGoogleFont = googleFontSelect.value;
        const enteredLocalFont = localFontInput.value.trim();
        const selectedWeight = globalFontSection.querySelector('#tweak_global_font-weight-select').value;
        let newFontSetting = { name: '', isGoogle: false, custom: false, weight: selectedWeight };

        if (selectedGoogleFont) {
            newFontSetting = { name: selectedGoogleFont, isGoogle: true, custom: false, weight: selectedWeight };
        } else if (enteredLocalFont) {
            newFontSetting = { name: enteredLocalFont, isGoogle: false, custom: true, weight: selectedWeight };
        }
        saveSetting(settingsKeys.globalUiFont, newFontSetting);
    });

    globalFontSection.querySelector('#tweak_global_reset-font-button').addEventListener('click', () => {
        saveSetting(settingsKeys.globalUiFont, null); // This will trigger applyGlobalUIFont to reset
        googleFontSelect.value = '';
        localFontInput.value = '';
        globalFontSection.querySelector('#tweak_global_font-weight-select').value = DEFAULT_UI_FONT_WEIGHT;
    });


    // --- 4. Chat Font Customization Section (Original) ---
    const fontSettingsContainer = document.createElement("div");
    fontSettingsContainer.className = "tweak-settings-section";
    fontSettingsContainer.style.marginTop = "20px";
    fontSettingsContainer.innerHTML = `
        <h3 class="tweak-section-title">Chat Area Font</h3>
        <p style="font-size: 0.85em; color: #bbb; margin-bottom: 15px;">These settings *only* affect the chat message display area.</p>
        <div class="font-customization-subsection-title">Local Font (Overrides URL Font)</div>
    `;
    const localFontFamilyInput = createTextInput("tweak_localFontFamily_input", "Local Font:", settingsKeys.localFontFamily, "e.g., Arial, Verdana");
    localFontFamilyInput.style.borderTop = "none"; localFontFamilyInput.style.paddingTop = "0"; localFontFamilyInput.style.marginTop = "5px";
    fontSettingsContainer.appendChild(localFontFamilyInput);
    fontSettingsContainer.innerHTML += `<div class="font-customization-subsection-title">Web Font (via URL)</div>`;
    const customFontUrlInput = createTextInput("tweak_customFontUrl_input", "Font URL:", settingsKeys.customFontUrl, "Google Fonts CSS URL");
    customFontUrlInput.style.borderTop = "none"; customFontUrlInput.style.paddingTop = "0"; customFontUrlInput.style.marginTop = "5px";
    fontSettingsContainer.appendChild(customFontUrlInput);
    const customFontFamilyInput = createTextInput("tweak_customFontFamily_input", "URL Font Family:", settingsKeys.customFontFamily, "Font Name from URL");
    customFontFamilyInput.style.borderTop = "none"; customFontFamilyInput.style.paddingTop = "0"; customFontFamilyInput.style.marginTop = "5px";
    fontSettingsContainer.appendChild(customFontFamilyInput);
    fontSettingsContainer.innerHTML += `<div class="font-customization-subsection-title">Font Size</div>`;
    const fontSizeInput = createTextInput("tweak_customFontSize_input", "Font Size (px):", settingsKeys.customFontSize, "e.g., 16", "number", { min: "8", step: "1" });
    fontSizeInput.style.borderTop = "none"; fontSizeInput.style.paddingTop = "0"; fontSizeInput.style.marginTop = "5px";
    fontSettingsContainer.appendChild(fontSizeInput);
    scrollableContent.appendChild(fontSettingsContainer);


    // --- 5. Favicon Settings Section ---
    const faviconSettingsSection = document.createElement("div");
    faviconSettingsSection.className = "tweak-settings-section";
    faviconSettingsSection.style.marginTop = "20px";
    faviconSettingsSection.innerHTML = `
        <h3 class="tweak-section-title">Favicon Customization</h3>
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <label for="tweak_customFaviconData_input" style="color: #e0e0e0; font-size: 1em; margin-right: 10px; flex-shrink: 0;">Upload Favicon:</label>
            <input type="file" id="tweak_customFaviconData_input" accept=".ico,.png,.jpg,.jpeg,.svg,.gif" style="color: #f0f0f0; border: 1px solid #777; border-radius: 4px; background-color: #555; flex-grow: 1; padding: 5px;">
        </div>
        <div style="display: flex; align-items: center; min-height: 30px;">
            <img id="tweak_favicon_preview" alt="Favicon Preview" style="width: 24px; height: 24px; margin-right: 10px; border: 1px solid #777; border-radius: 3px; display: none;">
            <button id="tweak_clear_favicon_button" type="button" class="tweak-reset-button" style="display: none;">Clear Favicon</button>
        </div>`;
    scrollableContent.appendChild(faviconSettingsSection);

    faviconSettingsSection.querySelector("#tweak_customFaviconData_input").addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        saveSetting(settingsKeys.customFaviconData, e.target.result);
        const preview = document.getElementById("tweak_favicon_preview");
        if(preview) { preview.src = e.target.result; preview.style.display = "inline-block"; }
        document.getElementById("tweak_clear_favicon_button").style.display = "inline-block";
        feedbackElement.textContent = "Favicon updated.";
        setTimeout(() => { if (feedbackElement.textContent === "Favicon updated.") feedbackElement.textContent = " "; }, 2000);
      };
      reader.readAsDataURL(file);
    });

    faviconSettingsSection.querySelector("#tweak_clear_favicon_button").addEventListener("click", () => {
      saveSetting(settingsKeys.customFaviconData, null);
      document.getElementById("tweak_customFaviconData_input").value = "";
      const preview = document.getElementById("tweak_favicon_preview");
      if(preview) { preview.src = ""; preview.style.display = "none"; }
      document.getElementById("tweak_clear_favicon_button").style.display = "none";
      feedbackElement.textContent = "Favicon cleared.";
      setTimeout(() => { if (feedbackElement.textContent === "Favicon cleared.") feedbackElement.textContent = " "; }, 2000);
    });

    // Final modal setup
    document.getElementById("tweak-modal-bottom-close").addEventListener("click", () => toggleModal(false));
  }


  // --- Modal Management & Initialization ---

  function loadSettingsIntoModal() {
    if (!modalElement) return;

    // Load original tweak settings
    document.querySelectorAll(".tweak-checkbox-item input[type='checkbox']").forEach(cb => {
      cb.checked = getSetting(cb.id, cb.id === settingsKeys.showModalButton);
    });
    document.getElementById("tweak_newChatButtonColor_input").value = getSetting(settingsKeys.newChatButtonColor, defaultNewChatButtonColor);
    document.getElementById("tweak_workspaceIconColor_input").value = getSetting(settingsKeys.workspaceIconColor, defaultWorkspaceIconColorVisual);
    document.getElementById("tweak_workspaceFontColor_input").value = getSetting(settingsKeys.workspaceFontColor, defaultWorkspaceFontColorVisual);
    document.getElementById("tweak_customPageTitle_input").value = getSetting(settingsKeys.customPageTitle, "");
    document.getElementById("tweak_localFontFamily_input").value = getSetting(settingsKeys.localFontFamily, "");
    document.getElementById("tweak_customFontUrl_input").value = getSetting(settingsKeys.customFontUrl, "");
    document.getElementById("tweak_customFontFamily_input").value = getSetting(settingsKeys.customFontFamily, "");
    const fontSize = getSetting(settingsKeys.customFontSize, null);
    document.getElementById("tweak_customFontSize_input").value = fontSize !== null ? fontSize : "";

    // **NEW** - Load Global UI Font settings
    const fontSetting = getSetting(settingsKeys.globalUiFont, { name: '', isGoogle: false, custom: false, weight: DEFAULT_UI_FONT_WEIGHT });
    const googleSelect = document.getElementById('tweak_global_google-font-select');
    const localInput = document.getElementById('tweak_global_local-font-input');
    const weightSelect = document.getElementById('tweak_global_font-weight-select');
    if (fontSetting && fontSetting.name) {
        if(fontSetting.isGoogle) {
            googleSelect.value = fontSetting.name;
            localInput.value = '';
        } else if (fontSetting.custom) {
            localInput.value = fontSetting.name;
            googleSelect.value = '';
        }
    } else {
        googleSelect.value = '';
        localInput.value = '';
    }
    weightSelect.value = fontSetting.weight || DEFAULT_UI_FONT_WEIGHT;

    // Load Favicon Setting
    const storedFaviconData = cleanValue(getSetting(settingsKeys.customFaviconData, null));
    const faviconPreview = document.getElementById("tweak_favicon_preview");
    const clearFaviconButton = document.getElementById("tweak_clear_favicon_button");
    document.getElementById("tweak_customFaviconData_input").value = "";
    if (storedFaviconData) {
      if(faviconPreview) { faviconPreview.src = storedFaviconData; faviconPreview.style.display = "inline-block"; }
      if(clearFaviconButton) clearFaviconButton.style.display = "inline-block";
    } else {
      if(faviconPreview) { faviconPreview.src = ""; faviconPreview.style.display = "none"; }
      if(clearFaviconButton) clearFaviconButton.style.display = "none";
    }

    if (feedbackElement) feedbackElement.textContent = " ";
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

  function initializeTweaks() {
    if (originalPageTitle === null) originalPageTitle = document.title;
    createSettingsModal();
    // Apply all settings on load
    applyStylesBasedOnSettings();
    applyCustomTitle();
    applyChatAreaCustomFont();
    applyGlobalUIFont(); // **NEW**
    applyCustomFavicon();
    setupFaviconObserver();
  }


  // --- Observers & Event Listeners ---

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

  const observer = new MutationObserver(() => {
    // Re-apply visual tweaks as the DOM changes
    applyStylesBasedOnSettings();
    applyCustomTitle();
    applyChatAreaCustomFont();
    // Global font is applied to body, less likely to need re-application here unless body is replaced.

    // Ensure the Tweaks button exists
    const workspaceBar = document.querySelector('div[data-element-id="workspace-bar"]');
    if (workspaceBar) {
      let tweaksButton = document.getElementById("workspace-tab-tweaks");
      const settingsButton = workspaceBar.querySelector('button[data-element-id="workspace-tab-settings"]');
      if (!tweaksButton && settingsButton) {
        const referenceButtonForStyle = settingsButton || workspaceBar.querySelector('button');
        tweaksButton = document.createElement("button");
        tweaksButton.id = "workspace-tab-tweaks";
        tweaksButton.title = "Open UI Tweaks (Shift+Alt+T or Shift+Cmd+T)";
        tweaksButton.dataset.elementId = "workspace-tab-tweaks";
        tweaksButton.className = referenceButtonForStyle.className;
        tweaksButton.innerHTML = `
            <span class="${referenceButtonForStyle.querySelector(':scope > span')?.className || 'flex flex-col items-center justify-center h-full'}">
                <div class="${referenceButtonForStyle.querySelector(':scope > span > div:first-child')?.className || 'relative flex items-center justify-center'}">
                    <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" style="color: ${getSetting(settingsKeys.workspaceIconColor, defaultWorkspaceIconColorVisual)};">
                        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4c-.83 0-1.5-.67-1.5-1.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path>
                    </svg>
                </div>
                <span class="${referenceButtonForStyle.querySelector(':scope > span > span:last-child')?.className || 'font-normal self-stretch text-center text-xs'}">Tweaks</span>
            </span>`;
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


  // --- Favicon-specific Functions ---
  function applyCustomFavicon() {
    if (faviconObserver) faviconObserver.disconnect();
    const faviconDataRaw = getSetting(settingsKeys.customFaviconData, null);
    const customFaviconHref = cleanValue(faviconDataRaw);
    document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach(link => link.remove());
    const newFaviconLink = document.createElement("link");
    newFaviconLink.rel = "icon";
    newFaviconLink.href = (customFaviconHref && customFaviconHref.trim() !== "") ? customFaviconHref : DEFAULT_FALLBACK_FAVICON;
    document.head.appendChild(newFaviconLink);
    if (faviconObserver && document.head) {
      faviconObserver.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ["href", "rel"] });
    }
  }

  function setupFaviconObserver() {
    if (faviconObserver) faviconObserver.disconnect();
    faviconObserver = new MutationObserver((mutationsList) => {
      let siteChangedFavicon = false;
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach(node => {
            if (node.nodeName === "LINK" && (node.getAttribute('rel') === 'icon' || node.getAttribute('rel') === 'shortcut icon')) {
              const currentCustomHref = cleanValue(getSetting(settingsKeys.customFaviconData, null)) || DEFAULT_FALLBACK_FAVICON;
              if (node.href !== currentCustomHref) siteChangedFavicon = true;
            }
          });
          mutation.removedNodes.forEach(node => {
            if (node.nodeName === "LINK" && (node.getAttribute('rel') === 'icon' || node.getAttribute('rel') === 'shortcut icon')) siteChangedFavicon = true;
          });
        }
      }
      if (siteChangedFavicon) {
        setTimeout(() => applyCustomFavicon(), 50);
      }
    });

    if (document.head) {
      faviconObserver.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ["href", "rel"] });
    } else {
      setTimeout(setupFaviconObserver, 200);
    }
  }

})();
