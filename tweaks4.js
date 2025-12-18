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

  // --- REWRITTEN: Apply Global UI Font using Style Tag (More Robust) ---
  function applyGlobalUiFont() {
    const fontSetting = getSetting(settingsKeys.globalUiFont, null);
    const styleId = "tweak-global-font-style";
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
    }

    // Reset logic
    if (!fontSetting || (!fontSetting.name && !fontSetting.isUrl)) {
      styleElement.textContent = "";
      removeActiveGlobalUIFontLink();
      return;
    }

    // Load Source
    if (fontSetting.isGoogle && fontSetting.name) {
      loadGlobalGoogleFont(fontSetting.name);
    } else if (fontSetting.isUrl && fontSetting.url) {
      loadGlobalUrlFont(fontSetting.url);
    } else {
      removeActiveGlobalUIFontLink();
    }

    const safeName = fontSetting.name && String(fontSetting.name).trim() !== "" ? `"${fontSetting.name}"` : null;
    const fallbackStack = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';
    const fontFamilyStack = safeName ? `${safeName}, ${fallbackStack}` : fallbackStack;
    const fontWeight = fontSetting.weight || DEFAULT_FONT_WEIGHT;

    // Use !important and target :root variables to force the app to listen
    styleElement.textContent = `
      :root {
        --font-sans: ${fontFamilyStack} !important;
        --font-serif: ${fontFamilyStack} !important;
      }
      body, button, input, textarea, select {
        font-family: ${fontFamilyStack} !important;
        font-weight: ${fontWeight} !important;
      }
    `;
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

    // Sidebar Toggles
    const teamsButton = document.querySelector('button[data-element-id="workspace-tab-teams"]');
    if (teamsButton) teamsButton.style.display = hideTeams ? "none" : "";

    const workspaceBar = document.querySelector('div[data-element-id="workspace-bar"]');
    if (workspaceBar) {
      const buttons = workspaceBar.querySelectorAll("button");
      buttons.forEach((button) => {
        const textSpan = button.querySelector("span > span");
        if (textSpan && textSpan.textContent.trim() === "KB") {
          button.style.display = hideKB ? "none" : "";
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
        // Basic check to ensure we only color sidebar text labels
        if (span.parentElement && span.parentElement.parentElement && span.parentElement.parentElement.tagName === 'BUTTON') {
             span.style.color = wsFontColor ? wsFontColor : "";
        }
      });
      let tweaksButton = document.getElementById("workspace-tab-tweaks");
      if (tweaksButton) {
        const svgIcon = tweaksButton.querySelector("svg");
        if (svgIcon) svgIcon.style.color = getSetting(settingsKeys.workspaceIconColor, defaultWorkspaceIconColorVisual);
        tweaksButton.style.display = "inline-flex";
      }
    }

    const logoImage = document.querySelector('img[alt="TypingMind"][src="/logo.png"]');
    if (logoImage && logoImage.closest('div')) {
      // Traverse up to find the container
      const container = logoImage.closest('div').parentElement;
      if (container) container.style.display = hideLogo ? "none" : "";
    }
    
    const profileButton = document.querySelector('button[data-element-id="workspace-profile-button"]');
    if (profileButton) profileButton.style.display = hideProfile ? "none" : "";

    // Chat Profiles Button
    const allButtons = document.querySelectorAll("button");
    allButtons.forEach(btn => {
        if(btn.textContent.includes("Chat Profiles")) {
             btn.style.display = hideChatProfiles ? "none" : "";
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

  // --- Modal Logic (Kept largely the same, optimized for stability) ---
  let modalOverlay = null;
  let modalElement = null;
  let feedbackElement = null;

  function createSettingsModal() {
    if (document.getElementById("tweak-modal-overlay")) return;
    // ... (Styles same as original, omitted for brevity, logic below matches original functionality) ...
    const styles = `
      #tweak-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); display: none; justify-content: center; align-items: center; z-index: 10001; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
      #tweak-modal { background-color: #252525; color: #f0f0f0; padding: 25px 35px; border-radius: 8px; min-width: 380px; max-width: 550px; box-shadow: 0 8px 25px rgba(0,0,0,0.6); position: relative; border: 1px solid #4a4a4a; max-height: 90vh; display: flex; flex-direction: column; }
      #tweak-modal h2 { margin-top: 0; margin-bottom: 20px; color: #ffffff; font-size: 1.5em; font-weight: 600; text-align: center; }
      #tweak-modal-feedback { font-size: 0.9em; color: #a0cfff; margin-top: 15px; margin-bottom: 5px; min-height: 1.2em; text-align: center; font-weight: 500; }
      .tweak-settings-section { background-color: #333333; padding: 20px 25px; border-radius: 6px; margin-top: 10px; border: 1px solid #484848; }
      .tweak-settings-section h3 { color: #e0e0e0; font-size: 1.1em; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #4a4a4a; padding-bottom: 8px; }
      .tweak-checkbox-item { margin-bottom: 18px; display: flex; align-items: center; }
      .tweak-checkbox-item label { margin-left: 10px; cursor: pointer; flex-grow: 1; font-size: 1em; color: #e0e0e0; }
      .tweak-modal-footer { margin-top: 25px; padding-top: 15px; border-top: 1px solid #4a4a4a; display: flex; justify-content: flex-end; }
      #tweak-modal-bottom-close { background-color: #dc3545; color: white; border: 1px solid #dc3545; padding: 8px 18px; border-radius: 6px; cursor: pointer; }
      .tweak-color-item { margin-top: 20px; padding-top: 15px; border-top: 1px solid #4a4a4a; display: flex; align-items: center; justify-content: space-between; }
      .tweak-text-item { margin-top: 15px; display: flex; align-items: center; justify-content: space-between; }
      .tweak-text-item input { background: #555; color: white; border: 1px solid #777; padding: 5px; border-radius: 4px; }
      #tweak-modal-scrollable-content { overflow-y: auto; padding-right: 10px; flex: 1; }
      .${SCRIPT_PREFIX}form-group { margin-bottom: 15px; }
      .${SCRIPT_PREFIX}form-group label { display: block; margin-bottom: 5px; color: #ccc; }
      .${SCRIPT_PREFIX}form-group select, .${SCRIPT_PREFIX}form-group input { width: 100%; padding: 8px; background: #555; color: white; border: 1px solid #777; border-radius: 4px; }
      .${SCRIPT_PREFIX}button-group { display: flex; gap: 10px; justify-content: flex-end; margin-top: 15px; }
      .${SCRIPT_PREFIX}button-group button { padding: 5px 15px; cursor: pointer; border-radius: 4px; border: none; }
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

    // --- Build Sections ---
    const settingsSection = document.createElement("div");
    settingsSection.className = "tweak-settings-section";
    settingsSection.innerHTML = "<h3>General Settings</h3>";
    
    const checkboxSettings = [
      { key: settingsKeys.hideTeams, label: "Hide 'Teams' menu item" },
      { key: settingsKeys.hideKB, label: "Hide 'KB' menu item" },
      { key: settingsKeys.hideLogo, label: "Hide Logo & Announcement" },
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
      checkbox.addEventListener("change", (e) => saveSetting(setting.key, e.target.checked));
      const label = document.createElement("label");
      label.htmlFor = setting.key;
      label.textContent = setting.label;
      itemDiv.append(checkbox, label);
      settingsSection.appendChild(itemDiv);
    });

    // Inputs helper
    function createInputRow(label, id, key, type="text", placeholder="") {
        const div = document.createElement("div");
        div.className = "tweak-text-item";
        div.innerHTML = `<label for="${id}">${label}</label>`;
        const input = document.createElement("input");
        input.type = type;
        input.id = id;
        input.placeholder = placeholder;
        if(type === "color") {
            div.className = "tweak-color-item";
            input.style.width = "50px";
        }
        input.addEventListener("input", (e) => saveSetting(key, e.target.value));
        const wrapper = document.createElement("div");
        wrapper.appendChild(input);
        div.appendChild(wrapper);
        return div;
    }

    settingsSection.appendChild(createInputRow("New Chat Color:", "tweak_newChatButtonColor_input", settingsKeys.newChatButtonColor, "color"));
    settingsSection.appendChild(createInputRow("Menu Icon Color:", "tweak_workspaceIconColor_input", settingsKeys.workspaceIconColor, "color"));
    settingsSection.appendChild(createInputRow("Menu Font Color:", "tweak_workspaceFontColor_input", settingsKeys.workspaceFontColor, "color"));
    settingsSection.appendChild(createInputRow("Page Title:", "tweak_customPageTitle_input", settingsKeys.customPageTitle, "text", "Custom Page Title"));

    // Global Font Section
    const globalFontSection = document.createElement("div");
    globalFontSection.className = "tweak-settings-section";
    globalFontSection.innerHTML = `
        <h3>Global UI Font</h3>
        <div class="${SCRIPT_PREFIX}form-group">
            <label>Google Font:</label>
            <select id="${SCRIPT_PREFIX}google-font-select">
                <option value="">-- Select --</option>
                ${GOOGLE_FONTS.sort().map(f => `<option value="${f}">${f}</option>`).join('')}
            </select>
        </div>
        <div class="${SCRIPT_PREFIX}form-group">
            <label>Local Font Name:</label>
            <input type="text" id="${SCRIPT_PREFIX}local-font-input" placeholder="Arial, Segoe UI">
        </div>
        <div class="${SCRIPT_PREFIX}form-group">
            <label>Web Font URL:</label>
            <input type="text" id="${SCRIPT_PREFIX}global-font-url" placeholder="https://...">
        </div>
        <div class="${SCRIPT_PREFIX}form-group">
            <label>URL Font Family Name:</label>
            <input type="text" id="${SCRIPT_PREFIX}global-font-family" placeholder="Exact name from CSS">
        </div>
        <div class="${SCRIPT_PREFIX}form-group">
            <label>Weight:</label>
            <select id="${SCRIPT_PREFIX}font-weight-select">
                <option value="300">Light</option>
                <option value="400" selected>Normal</option>
                <option value="600">Semi-Bold</option>
                <option value="700">Bold</option>
            </select>
        </div>
        <div class="${SCRIPT_PREFIX}button-group">
            <button id="${SCRIPT_PREFIX}reset-font-button" style="background:#6c757d;color:white;">Reset</button>
            <button id="${SCRIPT_PREFIX}apply-font-button" style="background:#0d6efd;color:white;">Apply</button>
        </div>
    `;

    // Chat Font Section
    const chatFontSection = document.createElement("div");
    chatFontSection.className = "tweak-settings-section";
    chatFontSection.innerHTML = `<h3>Chat Message Font</h3><p style="font-size:0.8em;color:#aaa">Specific to conversation text.</p>`;
    chatFontSection.appendChild(createInputRow("Local Font:", "tweak_localFontFamily_input", settingsKeys.localFontFamily, "text", "Arial"));
    chatFontSection.appendChild(createInputRow("Web Font URL:", "tweak_customFontUrl_input", settingsKeys.customFontUrl, "text", "Google Fonts URL"));
    chatFontSection.appendChild(createInputRow("Web Font Family:", "tweak_customFontFamily_input", settingsKeys.customFontFamily, "text", "Name"));
    chatFontSection.appendChild(createInputRow("Size (px):", "tweak_customFontSize_input", settingsKeys.customFontSize, "number", "16"));

    // Favicon Section
    const faviconSection = document.createElement("div");
    faviconSection.className = "tweak-settings-section";
    faviconSection.innerHTML = `<h3>Favicon</h3>`;
    const favInput = document.createElement("input");
    favInput.type = "file";
    favInput.accept = "image/*";
    favInput.style.color = "white";
    favInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            saveSetting(settingsKeys.customFaviconData, evt.target.result);
            feedbackElement.textContent = "Favicon Updated";
        };
        reader.readAsDataURL(file);
    });
    faviconSection.appendChild(favInput);
    const clearFavBtn = document.createElement("button");
    clearFavBtn.textContent = "Reset Favicon";
    clearFavBtn.style.marginLeft = "10px";
    clearFavBtn.addEventListener("click", () => saveSetting(settingsKeys.customFaviconData, null));
    faviconSection.appendChild(clearFavBtn);

    scrollableContent.append(settingsSection, globalFontSection, chatFontSection, faviconSection);

    const footer = document.createElement("div");
    footer.className = "tweak-modal-footer";
    const closeBtn = document.createElement("button");
    closeBtn.id = "tweak-modal-bottom-close";
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", () => toggleModal(false));
    footer.appendChild(closeBtn);

    modalElement.append(header, feedbackElement, scrollableContent, footer);
    modalOverlay.appendChild(modalElement);
    document.body.appendChild(modalOverlay);

    // Event Listeners for Global Font logic
    document.getElementById(`${SCRIPT_PREFIX}apply-font-button`).addEventListener('click', () => {
        const gFont = document.getElementById(`${SCRIPT_PREFIX}google-font-select`).value;
        const lFont = document.getElementById(`${SCRIPT_PREFIX}local-font-input`).value;
        const uFont = document.getElementById(`${SCRIPT_PREFIX}global-font-url`).value;
        const uName = document.getElementById(`${SCRIPT_PREFIX}global-font-family`).value;
        const weight = document.getElementById(`${SCRIPT_PREFIX}font-weight-select`).value;
        
        let setting = null;
        if(gFont) setting = { name: gFont, isGoogle: true, weight };
        else if(uFont && uName) setting = { name: uName, isUrl: true, url: uFont, weight };
        else if(lFont) setting = { name: lFont, custom: true, weight };
        
        saveSetting(settingsKeys.globalUiFont, setting);
    });
    
    document.getElementById(`${SCRIPT_PREFIX}reset-font-button`).addEventListener('click', () => {
        saveSetting(settingsKeys.globalUiFont, null);
    });
  }

  function loadSettingsIntoModal() {
     // Checkboxes
     document.querySelectorAll(".tweak-checkbox-item input").forEach(cb => cb.checked = getSetting(cb.id, false));
     // Inputs
     ["tweak_newChatButtonColor_input", "tweak_workspaceIconColor_input", "tweak_workspaceFontColor_input", 
      "tweak_customPageTitle_input", "tweak_localFontFamily_input", "tweak_customFontUrl_input",
      "tweak_customFontFamily_input", "tweak_customFontSize_input"].forEach(id => {
          const el = document.getElementById(id);
          if(el) {
             // Extract key from ID (remove _input)
             const key = Object.values(settingsKeys).find(k => k === id.replace("_input", ""));
             if(key) el.value = getSetting(key, "") || ""; 
          }
      });
      // Global Font Logic (simplified load)
      const gSetting = getSetting(settingsKeys.globalUiFont);
      if(gSetting) {
          document.getElementById(`${SCRIPT_PREFIX}font-weight-select`).value = gSetting.weight || "400";
          if(gSetting.isGoogle) document.getElementById(`${SCRIPT_PREFIX}google-font-select`).value = gSetting.name;
          else if(gSetting.isUrl) {
              document.getElementById(`${SCRIPT_PREFIX}global-font-url`).value = gSetting.url;
              document.getElementById(`${SCRIPT_PREFIX}global-font-family`).value = gSetting.name;
          } else {
              document.getElementById(`${SCRIPT_PREFIX}local-font-input`).value = gSetting.name;
          }
      }
  }

  function saveSetting(key, value) {
      try {
          if (value === null) localStorage.removeItem(key);
          else localStorage.setItem(key, JSON.stringify(value));
          
          if(feedbackElement) feedbackElement.textContent = "Saved.";
          
          applyStylesBasedOnSettings();
          applyCustomTitle();
          applyCustomFont();
          applyGlobalUiFont();
          applyCustomFavicon();
      } catch (e) { console.error(e); }
  }

  function toggleModal(show) {
      if(!modalOverlay) return;
      if(show === undefined) show = modalOverlay.style.display === "none";
      if(show) {
          loadSettingsIntoModal();
          modalOverlay.style.display = "flex";
      } else {
          modalOverlay.style.display = "none";
      }
  }

  // --- REWRITTEN: Chat Font Logic (Scorched Earth Selectors) ---
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

    const cleanedUrl = cleanValue(customFontUrl);
    const family = cleanValue(localFontFamilyUser) || cleanValue(customFontFamilyFromUrl);
    const size = parseInt(customFontSizeRaw);
    
    let css = "";
    if (cleanedUrl && cleanedUrl.startsWith("http")) css += `@import url('${cleanedUrl}');\n`;
    
    if (family || size) {
        let rules = "";
        if(family) rules += `font-family: "${family}", sans-serif !important;`;
        if(size) rules += `font-size: ${size}px !important;`;
        
        // TARGETING EVERY POSSIBLE CHAT CONTAINER
        // 1. Generic .prose (Tailwind standard)
        // 2. Main content areas
        // 3. Message blocks specifically
        css += `
           main .prose,
           .prose,
           [data-element-id="chat-space-middle-part"] .prose,
           div[class*="message-content"],
           .markdown-body,
           article,
           div[data-radix-scroll-area-viewport] > div
           {
               ${rules}
           }
        `;
    }
    styleElement.textContent = css;
  }

  function applyCustomFavicon() {
      // (Favicon logic remains valid as it uses standard DOM APIs)
      const data = cleanValue(getSetting(settingsKeys.customFaviconData));
      if(!data) return;
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = data;
      const old = document.querySelector("link[rel*='icon']");
      if(old) old.remove();
      document.head.appendChild(link);
  }

  // --- Initialization ---
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.altKey) && e.shiftKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        toggleModal();
    }
    if (e.key === "Escape") toggleModal(false);
  });

  const observer = new MutationObserver(() => {
      // Tweaks Button Injection - Made more robust
      const bar = document.querySelector('div[data-element-id="workspace-bar"]');
      if (bar && !document.getElementById("workspace-tab-tweaks")) {
          // Clone an existing button to match style exactly
          const refBtn = bar.querySelector('button');
          if(refBtn) {
              const btn = refBtn.cloneNode(true);
              btn.id = "workspace-tab-tweaks";
              btn.onclick = (e) => { e.preventDefault(); toggleModal(true); };
              // Try to find the icon and replace it, or just leave it (user will see duplicate icon but distinct button)
              const span = btn.querySelector("span > span");
              if(span) span.textContent = "Tweaks";
              // Insert at bottom of list
              refBtn.parentElement.appendChild(btn);
          }
      }
      applyStylesBasedOnSettings();
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Initial Run
  setTimeout(() => {
      createSettingsModal();
      applyGlobalUiFont();
      applyCustomFont();
      applyStylesBasedOnSettings();
  }, 1000);

  console.log(`${consolePrefix} Reloaded & Fixed.`);
})();
