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
    sidebarMenuColor: "tweak_sidebarMenuColor", // Added from script1.js
    customPageTitle: "tweak_customPageTitle",
    showModalButton: "tweak_showModalButton",
    customFontUrl: "tweak_customFontUrl",
    customFontFamily: "tweak_customFontFamily", // For URL-based font
    localFontFamily: "tweak_localFontFamily", // For local font
    customFontSize: "tweak_customFontSize",
    customFaviconData: "tweak_customFaviconData", // <-- New key for favicon
  };

  const consolePrefix = "TypingMind Tweaks:";
  const defaultNewChatButtonColor = "#2563eb";
  const defaultWorkspaceIconColorVisual = "#9ca3af";
  const defaultWorkspaceFontColorVisual = "#d1d5db";
  const defaultSidebarMenuColor = "#18181b"; // Added from script1.js
  const DEFAULT_FALLBACK_FAVICON = "/favicon.ico"; // Fallback favicon if custom is cleared
  let originalPageTitle = null;
  let faviconObserver = null; // For monitoring favicon changes by the site

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
    // Handle "null" string which might come from older storage or incorrect manual entry
    if (cleaned === "null") return null;
    return cleaned;
  };

  // Helper function to get settings from localStorage
  function getSetting(key, defaultValue = false) {
    const value = localStorage.getItem(key);
    if (value === null) { // Handles actual null or key not found
        return defaultValue;
    }
    if (value === "null") { // Handles 'null' string explicitly
        return defaultValue; // Or specific handling if 'null' string means "cleared"
    }
    try {
      // Try to parse as JSON (for booleans, numbers)
      return JSON.parse(value);
    } catch (e) {
      // If parsing fails, it's likely a raw string (e.g., font name, URL, color hex, base64 data)
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
    const sidebarMenuColor = getSetting(settingsKeys.sidebarMenuColor, null); // Added from script1.js
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

      // Apply sidebar menu color - Added from script1.js
      if (sidebarMenuColor) {
        workspaceBar.style.setProperty("--sidebar-menu-color", sidebarMenuColor);
      } else {
        workspaceBar.style.removeProperty("--sidebar-menu-color");
      }

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

    // Add sidebar menu color style - Added from script1.js
    let sidebarStyle = document.getElementById("tweak-sidebar-menu-color-style");
    if (!sidebarStyle) {
      sidebarStyle = document.createElement("style");
      sidebarStyle.id = "tweak-sidebar-menu-color-style";
      document.head.appendChild(sidebarStyle);
    }
    sidebarStyle.textContent = 'div[data-element-id="workspace-bar"] {background: var(--sidebar-menu-color, #18181b) !important;}';
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
      .tweak-text-item input[type='text']::placeholder, .tweak-text-item input[type='number']::placeholder { color: #aaa; opacity: 1
