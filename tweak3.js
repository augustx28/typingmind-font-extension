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
    hideProfile: "tweak_hideProfile",
    hideChatProfiles: "tweak_hideChatProfiles",
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
    document.head.appendChild(link);
    activeGlobalUIFontLink = link;
  }

  // --- REWRITTEN: Apply Global UI Font (Stronger Selectors) ---
  function applyGlobalUiFont() {
    const fontSetting = getSetting(settingsKeys.globalUiFont, null);
    const styleId = "tweak-global-font-css";
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Reset if disabled
    if (!fontSetting || (!fontSetting.name && !fontSetting.isUrl)) {
      styleElement.textContent = "";
      removeActiveGlobalUIFontLink();
      return;
    }

    // Load font source
    if (fontSetting.isGoogle && fontSetting.name) {
      loadGlobalGoogleFont(fontSetting.name);
    } else if (fontSetting.isUrl && fontSetting.url) {
      loadGlobalUrlFont(fontSetting.url);
    } else {
      removeActiveGlobalUIFontLink();
    }

    // Build font-family stack
    const safeName = fontSetting.name && String(fontSetting.name).trim() !== "" ? `"${fontSetting.name}"` : null;
    const fallbackStack = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    const fontFamilyStack = safeName ? `${safeName}, ${fallbackStack}` : fallbackStack;
    const weight = fontSetting.weight || DEFAULT_FONT_WEIGHT;

    // NUCLEAR OPTION: Target body, inputs, buttons, and Tailwind utilities directly
    const cssRules = `
      body, button, input, textarea, select, 
      .font-sans, .font-serif, .font-mono,
      [data-element-id="workspace-bar"], 
      [data-element-id="sidebar"] {
        font-family: ${fontFamilyStack} !important;
        font-weight: ${weight} !important;
      }
    `;

    styleElement.textContent = cssRules;
  }

  // --- REWRITTEN: Apply Custom Chat Font (Broader Selectors) ---
  function applyCustomFont() {
    const customFontUrl = getSetting(settingsKeys.customFontUrl, null);
    const customFontFamilyFromUrl = getSetting(settingsKeys.customFontFamily, null);
    const localFontFamilyUser = getSetting(settingsKeys.localFontFamily, null);
    const customFontSizeRaw = getSetting(settingsKeys.customFontSize, null);
    const styleId = "tweak-custom-chat-font-style";
    
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
      const fallbackFontStack = `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
      styleDeclarations.push(`  font-family: ${effectiveFontFamily}, ${fallbackFontStack} !important;`);
    }
    if (cleanedSize) {
      styleDeclarations.push(`  font-size: ${cleanedSize}px !important;`);
      styleDeclarations.push(`  line-height: 1.6 !important;`); // Improve readability with size change
    }

    if (styleDeclarations.length > 0) {
      const declarationsString = styleDeclarations.join("\n");
      // UPDATED SELECTORS: More robust to structural changes
      cssRules.push(`
        .prose,
        .prose p,
        .prose li,
        .prose code,
        [data-element-id*="message"] .whitespace-pre-wrap,
        [data-element-id="chat-space-middle-part"] .text-sm,
        [data-element-id="ai-message"],
        [data-element-id="user-message"]
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

  function applyCustomFavicon() {
    if (faviconObserver) faviconObserver.disconnect();
    const faviconDataRaw = getSetting(settingsKeys.customFaviconData, null);
    const customFaviconHref = cleanValue(faviconDataRaw);
    document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach(link => link.remove());
    const newFaviconLink = document.createElement("link");
    newFaviconLink.rel = "icon";
    if (customFaviconHref && customFaviconHref.trim() !== "") {
      newFaviconLink.href = customFaviconHref;
      // Basic type inference
      if (customFaviconHref.startsWith('data:image/svg')) newFaviconLink.type = 'image/svg+xml';
      else if (customFaviconHref.endsWith('.png')) newFaviconLink.type = 'image/png';
    } else {
      newFaviconLink.href = DEFAULT_FALLBACK_FAVICON;
    }
    document.head.appendChild(newFaviconLink);
    if (faviconObserver && document.head) {
        faviconObserver.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ["href", "rel"] });
    }
  }

  function setupFaviconObserver() {
    if (faviconObserver) faviconObserver.disconnect();
    faviconObserver = new MutationObserver((mutationsList) => {
      let changed = false;
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" || (mutation.type === "attributes" && mutation.target.nodeName === "LINK")) {
            changed = true;
        }
      }
      if (changed) {
        const currentCustomHref = cleanValue(getSetting(settingsKeys.customFaviconData, null));
        if (currentCustomHref) setTimeout(() => applyCustomFavicon(), 50);
      }
    });
    if (document.head) {
      faviconObserver.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ["href", "rel", "type"] });
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
      .tweak-checkbox-item input[type='checkbox'] { margin-right: 15px; transform: scale(1.2); cursor: pointer; accent-color: #0d6efd; background-color: #555; border-radius: 3px; border: 1px solid #777; width: 1.2em; height: 1.2em; }
      .tweak-modal-footer { margin-top: 25px; padding-top: 15px; border-top: 1px solid #4a4a4a; display: flex; justify-content: flex-end; }
      #tweak-modal-bottom-close { background-color: #dc3545; color: white; border: 1px solid #dc3545; padding: 8px 18px; border-radius: 6px; cursor: pointer; }
      .tweak-color-item { margin-top: 20px; padding-top: 15px; border-top: 1px solid #4a4a4a; display: flex; align-items: center; justify-content: space-between; }
      .tweak-text-item { margin-top: 15px; display: flex; align-items: center; justify-content: space-between; }
      .tweak-text-item input { width: 160px; padding: 6px 10px; border: 1px solid #777; border-radius: 4px; background-color: #555; color: #f0f0f0; }
      #tweak-modal-scrollable-content { max-height: calc(80vh - 180px); overflow-y: auto; overflow-x: hidden; padding-right: 10px; }
      /* GLOBAL FONT STYLES */
      .${SCRIPT_PREFIX}form-group { margin-bottom: 18px; }
      .${SCRIPT_PREFIX}form-group label { display: block; margin-bottom: 8px; font-weight: 500; color: #cccccc; }
      .${SCRIPT_PREFIX}form-group select, .${SCRIPT_PREFIX}form-group input { width: 100%; padding: 8px; background: #555; color: #fff; border: 1px solid #777; border-radius: 4px; }
      .${SCRIPT_PREFIX}button-group { display: flex; justify-content: flex-end; margin-top: 15px; gap: 12px; }
      .${SCRIPT_PREFIX}apply-button { background-color: #0d6efd; color: white; padding: 6px 14px; border-radius: 4px; border: none; cursor: pointer; }
      .${SCRIPT_PREFIX}reset-button { background-color: #6c757d; color: white; padding: 6px 14px; border-radius: 4px; border: none; cursor: pointer; }
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
    
    const scrollableContent = document.createElement("div");
    scrollableContent.id = "tweak-modal-scrollable-content";

    // --- General Settings ---
    const settingsSection = document.createElement("div");
    settingsSection.className = "tweak-settings-section";
    const settingsHeader = document.createElement('h3');
    settingsHeader.textContent = 'General Settings';
    settingsSection.appendChild(settingsHeader);

    const checkboxSettings = [
      { key: settingsKeys.hideTeams, label: "Hide 'Teams' menu item" },
      { key: settingsKeys.hideKB, label: "Hide 'KB' menu item" },
      { key: settingsKeys.hideLogo, label: "Hide Logo" },
      { key: settingsKeys.hideProfile, label: "Hide 'Profile' button" },
      { key: settingsKeys.hideChatProfiles, label: "Hide 'Chat Profiles' button" },
      { key: settingsKeys.hidePinnedChars, label: "Hide 'Characters' in New Chat" },
    ];
    checkboxSettings.forEach(setting => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "tweak-checkbox-item";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = setting.key;
      checkbox.checked = getSetting(setting.key, false);
      checkbox.addEventListener("change", (e) => saveSetting(setting.key, e.target.checked));
      const label = document.createElement("label");
      label.htmlFor = setting.key;
      label.textContent = setting.label;
      label.style.marginLeft = "10px";
      itemDiv.append(checkbox, label);
      settingsSection.appendChild(itemDiv);
    });

    // --- Global Font UI ---
    const globalFontSettingsSection = document.createElement("div");
    globalFontSettingsSection.className = "tweak-settings-section";
    globalFontSettingsSection.style.marginTop = "20px";
    globalFontSettingsSection.innerHTML = `
        <h3>Global UI Font (Entire App)</h3>
        <div class="${SCRIPT_PREFIX}form-group">
            <label>Google Font:</label>
            <select id="${SCRIPT_PREFIX}google-font-select">
                <option value="">-- Select --</option>
                ${GOOGLE_FONTS.sort().map(font => `<option value="${font}">${font}</option>`).join('')}
            </select>
        </div>
        <div class="${SCRIPT_PREFIX}form-group">
            <label>Or Web Font URL:</label>
            <input type="text" id="${SCRIPT_PREFIX}global-font-url" placeholder="https://...">
        </div>
        <div class="${SCRIPT_PREFIX}form-group">
            <label>Font Family Name:</label>
            <input type="text" id="${SCRIPT_PREFIX}global-font-family" placeholder="Exact name from CSS">
        </div>
        <div class="${SCRIPT_PREFIX}form-group">
            <label>Font Weight:</label>
            <select id="${SCRIPT_PREFIX}font-weight-select">
                <option value="300">Light</option>
                <option value="400" selected>Normal</option>
                <option value="600">Semi-Bold</option>
                <option value="700">Bold</option>
            </select>
        </div>
        <div class="${SCRIPT_PREFIX}button-group">
            <button class="${SCRIPT_PREFIX}reset-button" id="${SCRIPT_PREFIX}reset-font-button">Reset</button>
            <button class="${SCRIPT_PREFIX}apply-button" id="${SCRIPT_PREFIX}apply-font-button">Apply Global Font</button>
        </div>
    `;

    // --- Chat Font UI ---
    const fontSettingsContainer = document.createElement("div");
    fontSettingsContainer.className = "tweak-settings-section";
    fontSettingsContainer.style.marginTop = "20px";
    fontSettingsContainer.innerHTML = `
        <h3>Chat Area Font</h3>
        <p style="color:#aaa;font-size:0.9em;margin-bottom:10px;">Overrides global font for chat messages only.</p>
    `;
    
    function createTextInput(id, labelText, settingKey, placeholder) {
        const item = document.createElement("div");
        item.className = "tweak-text-item";
        item.innerHTML = `<label>${labelText}</label>`;
        const input = document.createElement("input");
        input.id = id;
        input.placeholder = placeholder;
        input.addEventListener("change", (e) => saveSetting(settingKey, e.target.value));
        item.appendChild(input);
        return item;
    }

    fontSettingsContainer.appendChild(createTextInput("tweak_localFontFamily_input", "Local Font:", settingsKeys.localFontFamily, "Arial, Verdana"));
    fontSettingsContainer.appendChild(createTextInput("tweak_customFontSize_input", "Font Size (px):", settingsKeys.customFontSize, "16"));

    scrollableContent.append(settingsSection, globalFontSettingsSection, fontSettingsContainer);

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

    // --- Global Font Event Listeners ---
    document.getElementById(`${SCRIPT_PREFIX}apply-font-button`).addEventListener('click', () => {
        const gFont = document.getElementById(`${SCRIPT_PREFIX}google-font-select`).value;
        const url = document.getElementById(`${SCRIPT_PREFIX}global-font-url`).value;
        const family = document.getElementById(`${SCRIPT_PREFIX}global-font-family`).value;
        const weight = document.getElementById(`${SCRIPT_PREFIX}font-weight-select`).value;
        
        let setting = null;
        if(gFont) setting = { name: gFont, isGoogle: true, weight };
        else if(url && family) setting = { name: family, isUrl: true, url, weight };
        
        saveSetting(settingsKeys.globalUiFont, setting);
        if(feedbackElement) feedbackElement.textContent = "Global font applied!";
    });

    document.getElementById(`${SCRIPT_PREFIX}reset-font-button`).addEventListener('click', () => {
        saveSetting(settingsKeys.globalUiFont, null);
        if(feedbackElement) feedbackElement.textContent = "Global font reset.";
    });
  }

  function loadSettingsIntoModal() {
    if (!modalElement) return;
    document.querySelectorAll(".tweak-checkbox-item input[type='checkbox']").forEach(cb => {
      cb.checked = getSetting(cb.id, false);
    });
    // Load Global Font inputs
    const gFont = getSetting(settingsKeys.globalUiFont);
    if(gFont) {
        if(gFont.isGoogle) document.getElementById(`${SCRIPT_PREFIX}google-font-select`).value = gFont.name;
        if(gFont.isUrl) {
            document.getElementById(`${SCRIPT_PREFIX}global-font-url`).value = gFont.url;
            document.getElementById(`${SCRIPT_PREFIX}global-font-family`).value = gFont.name;
        }
        document.getElementById(`${SCRIPT_PREFIX}font-weight-select`).value = gFont.weight || '400';
    }
    // Load Chat inputs
    document.getElementById("tweak_localFontFamily_input").value = getSetting(settingsKeys.localFontFamily, "");
    document.getElementById("tweak_customFontSize_input").value = getSetting(settingsKeys.customFontSize, "");
  }

  function saveSetting(key, value) {
    if (value === null || value === "") localStorage.removeItem(key);
    else localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    
    applyStylesBasedOnSettings();
    applyCustomTitle();
    applyCustomFont();
    applyGlobalUiFont();
    applyCustomFavicon();
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
    if ((event.metaKey || event.altKey) && event.shiftKey && event.key.toUpperCase() === "T") {
      event.preventDefault();
      toggleModal();
    }
  });

  function initializeTweaks() {
    if (originalPageTitle === null) originalPageTitle = document.title;
    createSettingsModal();
    applyStylesBasedOnSettings();
    applyCustomTitle();
    applyCustomFont();
    applyGlobalUiFont();
    applyCustomFavicon();
    setupFaviconObserver();
  }

  const observer = new MutationObserver(() => {
    applyStylesBasedOnSettings();
    const workspaceBar = document.querySelector('div[data-element-id="workspace-bar"]');
    if (workspaceBar && !document.getElementById("workspace-tab-tweaks")) {
        // Simple re-injection of the Tweaks button
        const settingsBtn = workspaceBar.querySelector('button[data-element-id="workspace-tab-settings"]');
        if (settingsBtn) {
            const btn = settingsBtn.cloneNode(true);
            btn.id = "workspace-tab-tweaks";
            btn.querySelector("span > span:last-child").textContent = "Tweaks";
            btn.onclick = (e) => { e.preventDefault(); toggleModal(true); };
            settingsBtn.before(btn);
        }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  if (document.readyState === "complete") initializeTweaks();
  else document.addEventListener("DOMContentLoaded", initializeTweaks);
  
  console.log(`${consolePrefix} Initialized (Updated v2).`);

})();
