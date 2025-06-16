(function () {
  "use strict";

  // --- Configuration & Constants ---
  const consolePrefix = "TypingMind Tweaks:";

  // Constants from the Font Changer script
  const GOOGLE_FONTS = [
    "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Raleway",
    "Poppins", "Nunito", "Merriweather", "Inter", "Source Sans Pro",
    "PT Sans", "Ubuntu", "Noto Sans", "Fira Sans", "Work Sans",
    "Roboto Condensed", "Roboto Slab", "Playfair Display", "Cormorant Garamond",
    "Bebas Neue", "Titillium Web", "Josefin Sans", "Arimo", "Lexend", "EB Garamond",
    "DM Sans", "Manrope", "Space Grotesk", "Sora"
  ];
  const DEFAULT_FONT_WEIGHT = '400';

  // Merged Settings Keys
  const settingsKeys = {
    // Tweak Menu Keys
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
    // Chat-Area Font Keys
    customFontUrl: "tweak_customFontUrl",
    customFontFamily: "tweak_customFontFamily",
    localFontFamily: "tweak_localFontFamily",
    customFontSize: "tweak_customFontSize",
    // Global UI Font Keys (from Font Button script)
    globalFontSetting: "tweak_globalFontSetting", // Stores an object: { name, isGoogle, custom, weight }
  };

  // --- State & DOM Variables ---
  const defaultNewChatButtonColor = "#2563eb";
  const defaultWorkspaceIconColorVisual = "#9ca3af";
  const defaultWorkspaceFontColorVisual = "#d1d5db";
  const DEFAULT_FALLBACK_FAVICON = "/favicon.ico";
  let originalPageTitle = null;
  let faviconObserver = null;
  let modalOverlay = null;
  let modalElement = null;
  let feedbackElement = null;
  let activeGoogleFontLink = null; // For the global UI font

  // --- Helper Functions ---
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
    if (value === null || value === "null") {
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
      // Handle special string/null cases
      if ([
          settingsKeys.customFontUrl,
          settingsKeys.customFontFamily,
          settingsKeys.localFontFamily,
          settingsKeys.customPageTitle,
          settingsKeys.customFaviconData
      ].includes(key)) {
        valueToStore = (value && String(value).trim() !== "") ? String(value).trim() : null;
      } else if (key === settingsKeys.customFontSize) {
        valueToStore = (value !== null && !isNaN(parseInt(value, 10)) && String(value).trim() !== "") ? parseInt(value, 10) : null;
      }

      if (valueToStore === null) {
        localStorage.removeItem(key);
      } else if (typeof valueToStore === 'object') {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } else {
        localStorage.setItem(key, valueToStore);
      }

      // Apply changes immediately
      applyStylesBasedOnSettings();
      if (key === settingsKeys.customPageTitle) applyCustomTitle();
      if ([settingsKeys.customFontUrl, settingsKeys.customFontFamily, settingsKeys.localFontFamily, settingsKeys.customFontSize].includes(key)) applyCustomChatFont();
      if (key === settingsKeys.customFaviconData) applyCustomFavicon();
      if (key === settingsKeys.globalFontSetting) applyGlobalFont(valueToStore);

    } catch (error) {
      console.error(`${consolePrefix} Error saving setting ${key}:`, error);
      if (feedbackElement) feedbackElement.textContent = "Error saving settings.";
    }
  }

  // --- Core Application Functions ---

  /**
   * Loads a specified Google Font by injecting a stylesheet link into the document head.
   * This is for the GLOBAL UI font.
   */
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

  /**
   * Applies the GLOBAL UI font setting to the entire page body.
   * @param {object|null} fontSetting - The font setting object or null to reset.
   */
  function applyGlobalFont(fontSetting) {
      const targetElement = document.body;

      if (!fontSetting || !fontSetting.name) { // Resetting
          targetElement.style.fontFamily = '';
          targetElement.style.fontWeight = '';
          if (activeGoogleFontLink) {
              activeGoogleFontLink.remove();
              activeGoogleFontLink = null;
          }
          // The setting is saved by the caller (handleResetGlobalFont)
      } else {
          const { name, isGoogle, weight } = fontSetting;
          if (isGoogle) {
              loadGoogleFont(name);
          } else if (activeGoogleFontLink) { // Using local font, remove Google Font if active
              activeGoogleFontLink.remove();
              activeGoogleFontLink = null;
          }
          const fontFamilyStack = `"${name}", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
          targetElement.style.fontFamily = fontFamilyStack;
          targetElement.style.fontWeight = weight || DEFAULT_FONT_WEIGHT;
          // The setting is saved by the caller (handleApplyGlobalFont)
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

  /**
   * Applies custom font and size settings to the CHAT AREA only.
   */
  function applyCustomChatFont() {
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
      if (cleanedUrl && (cleanedUrl.startsWith("http://") || cleanedUrl.startsWith("https://"))) {
          cssRules.push(`@import url('${cleanedUrl}');`);
      }

      const cleanedLocalFamily = cleanValue(localFontFamilyUser);
      const cleanedFamilyFromUrl = cleanValue(customFontFamilyFromUrl);
      let effectiveFontFamily = cleanedLocalFamily || cleanedFamilyFromUrl;

      if (effectiveFontFamily) {
          effectiveFontFamily = effectiveFontFamily.trim();
          if (effectiveFontFamily.includes(" ") && !/^['"].*['"]$/.test(effectiveFontFamily)) {
              effectiveFontFamily = `'${effectiveFontFamily}'`;
          }
      }

      const cleanedSize = (customFontSizeRaw !== null && !isNaN(parseInt(customFontSizeRaw, 10)) && parseInt(customFontSizeRaw, 10) > 0) ? parseInt(customFontSizeRaw, 10) : null;

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
            [data-element-id="chat-space-middle-part"] .prose,
            div[data-radix-scroll-area-viewport] .whitespace-pre-wrap {
              ${declarationsString}
            }
          `);
      }

      const newStyleContent = cssRules.join("\n");
      if (styleElement.textContent !== newStyleContent) {
          styleElement.textContent = newStyleContent;
      }
  }


  function applyCustomFavicon() {
      // Implementation from original script...
  }
  function setupFaviconObserver() {
      // Implementation from original script...
  }

  // --- UI Creation (The Modal) ---

  function createSettingsModal() {
    if (document.getElementById("tweak-modal-overlay")) return;

    const styles = `
      #tweak-modal-overlay { /* ... Tweak menu styles ... */ }
      /* ... All other tweak menu styles ... */
      #tweak-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); display: none; justify-content: center; align-items: center; z-index: 10001; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
      #tweak-modal { background-color: #252525; color: #f0f0f0; padding: 25px 35px; border-radius: 8px; min-width: 380px; max-width: 550px; box-shadow: 0 8px 25px rgba(0,0,0,0.6); position: relative; border: 1px solid #4a4a4a; }
      #tweak-modal h2 { margin-top: 0; margin-bottom: 20px; color: #ffffff; font-size: 1.5em; font-weight: 600; text-align: center; }
      #tweak-modal h3 { color: #e0e0e0; font-size: 1.1em; margin-top: 20px; margin-bottom: 15px; border-bottom: 1px solid #4a4a4a; padding-bottom: 8px; }
      #tweak-modal-feedback { font-size: 0.9em; color: #a0cfff; margin-top: 15px; margin-bottom: 5px; min-height: 1.2em; text-align: center; font-weight: 500; }
      .tweak-settings-section { background-color: #333333; padding: 20px 25px; border-radius: 6px; margin-top: 10px; border: 1px solid #484848; }
      .tweak-checkbox-item { margin-bottom: 18px; display: flex; align-items: center; }
      .tweak-checkbox-item:last-child { margin-bottom: 5px; }
      .tweak-checkbox-item input[type='checkbox'] { margin-right: 15px; transform: scale(1.2); cursor: pointer; accent-color: #0d6efd; }
      .tweak-checkbox-item label { cursor: pointer; flex-grow: 1; font-size: 1em; color: #e0e0e0; }
      .tweak-modal-footer { margin-top: 25px; padding-top: 15px; border-top: 1px solid #4a4a4a; display: flex; justify-content: flex-end; }
      #tweak-modal-bottom-close { background-color: #dc3545; color: white; border: 1px solid #dc3545; padding: 8px 18px; border-radius: 6px; font-size: 0.95em; font-weight: 500; cursor: pointer; transition: background-color 0.2s ease, border-color 0.2s ease; }
      #tweak-modal-bottom-close:hover { background-color: #c82333; border-color: #bd2130; }
      .tweak-color-item, .tweak-text-item { margin-top: 15px; display: flex; align-items: center; justify-content: space-between; }
      .tweak-text-item { padding-top: 15px; border-top: 1px solid #4a4a4a; }
      .tweak-color-item label, .tweak-text-item label { margin-right: 10px; color: #e0e0e0; font-size: 1em; white-space: nowrap; flex-shrink: 0; }
      .tweak-color-input-wrapper, .tweak-text-input-wrapper { display: flex; align-items: center; flex-grow: 1; }
      .tweak-color-item input[type='color'] { width: 40px; height: 30px; border: 1px solid #777; border-radius: 4px; cursor: pointer; background-color: #555; margin-right: 10px; padding: 2px; }
      .tweak-text-item input, .tweak-text-item select { flex-grow: 1; min-width: 50px; padding: 6px 10px; border: 1px solid #777; border-radius: 4px; background-color: #555; color: #f0f0f0; font-size: 0.9em; }
      .tweak-reset-button { background-color: #6c757d; color: white; border: 1px solid #6c757d; padding: 4px 10px; border-radius: 4px; font-size: 0.85em; font-weight: 500; cursor: pointer; transition: background-color 0.2s ease, border-color 0.2s ease; }
      .tweak-reset-button:hover { background-color: #5a6268; border-color: #545b62; }
      #tweak-modal-scrollable-content { max-height: calc(85vh - 150px); overflow-y: auto; overflow-x: hidden; padding-right: 15px; margin: 0 -15px 0 -5px; padding-left: 5px; }
      .font-customization-subsection-title { color: #d0d0d0; font-size: 0.95em; margin-top: 20px; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px dashed #555; }
      .tweak-item-description { font-size: 0.85em; color: #bbb; margin-top: -10px; margin-bottom: 15px; }
      .tweak-global-font-buttons { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
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

    const scrollableContent = modalElement.querySelector("#tweak-modal-scrollable-content");
    feedbackElement = modalElement.querySelector("#tweak-modal-feedback");
    modalElement.querySelector("#tweak-modal-bottom-close").addEventListener("click", () => toggleModal(false));

    // --- General Settings Section ---
    // (Code to create checkboxes, color pickers, etc., from original script)
    // ...

    // --- Global UI Font Section (NEWLY INTEGRATED) ---
    const globalFontSection = document.createElement("div");
    globalFontSection.className = "tweak-settings-section";
    globalFontSection.innerHTML = `
      <h3>Global UI Font</h3>
      <p class="tweak-item-description">Changes the font for the entire UI (sidebars, menus, etc.).</p>
      <div class="tweak-text-item" style="border-top: none; padding-top: 0;">
        <label for="tweak_global_google_font_select">Google Font:</label>
        <div class="tweak-text-input-wrapper">
          <select id="tweak_global_google_font_select">
            <option value="">-- Select Google Font --</option>
            ${GOOGLE_FONTS.sort().map(font => `<option value="${font}">${font}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="tweak-text-item">
        <label for="tweak_global_local_font_input">Local Font:</label>
        <div class="tweak-text-input-wrapper">
            <input type="text" id="tweak_global_local_font_input" placeholder="e.g., Cascadia Code">
        </div>
      </div>
      <div class="tweak-text-item">
        <label for="tweak_global_font_weight_select">Font Weight:</label>
        <div class="tweak-text-input-wrapper">
          <select id="tweak_global_font_weight_select">
            <option value="300">Light (300)</option>
            <option value="400" selected>Normal (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">Semi-Bold (600)</option>
            <option value="700">Bold (700)</option>
          </select>
        </div>
      </div>
      <div class="tweak-global-font-buttons">
        <button id="tweak_global_font_apply" class="tweak-reset-button" style="background-color: #2563eb;">Apply</button>
        <button id="tweak_global_font_reset" class="tweak-reset-button">Reset</button>
      </div>
    `;
    scrollableContent.appendChild(globalFontSection);

    // --- Chat Font Section ---
    // (Code to create chat font inputs from original script)
    // ...

    // --- Wire up event listeners for the new Global Font section ---
    const globalGoogleSelect = globalFontSection.querySelector('#tweak_global_google_font_select');
    const globalLocalInput = globalFontSection.querySelector('#tweak_global_local_font_input');
    const globalWeightSelect = globalFontSection.querySelector('#tweak_global_font_weight_select');

    globalGoogleSelect.addEventListener('change', () => { if (globalGoogleSelect.value) globalLocalInput.value = ''; });
    globalLocalInput.addEventListener('input', () => { if (globalLocalInput.value) globalGoogleSelect.value = ''; });

    globalFontSection.querySelector('#tweak_global_font_apply').addEventListener('click', () => {
        const name = globalGoogleSelect.value || globalLocalInput.value.trim();
        if (!name) {
            // If no font is selected, but a weight is, apply weight to current font
            const currentSetting = getSetting(settingsKeys.globalFontSetting, null);
            if (currentSetting && currentSetting.name) {
                 const newSetting = { ...currentSetting, weight: globalWeightSelect.value };
                 saveSetting(settingsKeys.globalFontSetting, newSetting);
                 feedbackElement.textContent = "Global font weight updated.";
            } else {
                 feedbackElement.textContent = "No font selected to apply.";
            }
        } else {
            const newSetting = {
                name: name,
                isGoogle: !!globalGoogleSelect.value,
                custom: !!globalLocalInput.value.trim(),
                weight: globalWeightSelect.value
            };
            saveSetting(settingsKeys.globalFontSetting, newSetting);
            feedbackElement.textContent = "Global font applied.";
        }
        setTimeout(() => { feedbackElement.textContent = " "; }, 2500);
    });

    globalFontSection.querySelector('#tweak_global_font_reset').addEventListener('click', () => {
        saveSetting(settingsKeys.globalFontSetting, null);
        globalGoogleSelect.value = '';
        globalLocalInput.value = '';
        globalWeightSelect.value = DEFAULT_FONT_WEIGHT;
        feedbackElement.textContent = "Global font reset.";
        setTimeout(() => { feedbackElement.textContent = " "; }, 2500);
    });
  }

  function loadSettingsIntoModal() {
    if (!modalElement) return;
    // Load original tweak settings...
    // document.getElementById('tweak_hideTeams').checked = getSetting(settingsKeys.hideTeams, false);
    // ... etc ...

    // Load Global Font settings
    const setting = getSetting(settingsKeys.globalFontSetting, {});
    const googleSelect = document.getElementById('tweak_global_google_font_select');
    const localInput = document.getElementById('tweak_global_local_font_input');
    const weightSelect = document.getElementById('tweak_global_font_weight_select');

    if (googleSelect && localInput && weightSelect) {
        googleSelect.value = setting.isGoogle ? setting.name : '';
        localInput.value = setting.custom ? setting.name : '';
        weightSelect.value = setting.weight || DEFAULT_FONT_WEIGHT;
    }

    if (feedbackElement) feedbackElement.textContent = " ";
  }

  function toggleModal(forceState) {
    if (!modalOverlay) createSettingsModal();
    const shouldShow = typeof forceState === "boolean" ? forceState : window.getComputedStyle(modalOverlay).display === "none";
    if (shouldShow) {
      loadSettingsIntoModal();
      modalOverlay.style.display = "flex";
    } else {
      modalOverlay.style.display = "none";
    }
  }

  // --- Initialization and Observers ---

  function initializeTweaks() {
    if (originalPageTitle === null) originalPageTitle = document.title;
    applyStylesBasedOnSettings();
    applyCustomTitle();
    applyCustomChatFont();
    // Apply saved global font on load
    const savedGlobalFont = getSetting(settingsKeys.globalFontSetting, null);
    if (savedGlobalFont && savedGlobalFont.name) {
        applyGlobalFont(savedGlobalFont);
    }
    // applyCustomFavicon();
    // setupFaviconObserver();
  }

  // Set up the main mutation observer to add the button and re-apply settings
  const observer = new MutationObserver(() => {
    applyStylesBasedOnSettings();
    // We don't need to re-apply fonts here constantly, it can be slow.
    // Initial load should be sufficient unless the site replaces the whole body.

    const workspaceBar = document.querySelector('div[data-element-id="workspace-bar"]');
    if (workspaceBar) {
      let tweaksButton = document.getElementById("workspace-tab-tweaks");
      const settingsButton = workspaceBar.querySelector('button[data-element-id="workspace-tab-settings"]');
      if (!tweaksButton && settingsButton) {
        // ... Code to create and inject the "Tweaks" button ...
      }
    }
  });


  // --- Start the script ---
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initializeTweaks();
  } else {
    document.addEventListener("DOMContentLoaded", initializeTweaks);
  }

  observer.observe(document.body, { childList: true, subtree: true });

  // Add keyboard shortcut for the modal
  document.addEventListener("keydown", (event) => {
    const isMac = navigator.userAgent.toUpperCase().includes("MAC");
    const modifierPressed = isMac ? event.metaKey : event.altKey;
    if (event.shiftKey && modifierPressed && event.key.toUpperCase() === "T") {
      event.preventDefault();
      event.stopPropagation();
      toggleModal();
    }
    // Add Esc key to close modal
    if (event.key === 'Escape' && modalOverlay && window.getComputedStyle(modalOverlay).display !== 'none') {
        event.preventDefault();
        toggleModal(false);
    }
  });

  console.log(`${consolePrefix} Initialized. Shortcut: Shift+Alt+T (Win/Linux) or Shift+Cmd+T (Mac).`);

})();
