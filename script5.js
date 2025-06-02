(function () {
  "use strict";

  /* ───────────────────────── SETTINGS KEYS ───────────────────────── */
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
    sidebarMenuColor: "tweak_sidebarMenuColor",               // ➊ NEW
    customPageTitle: "tweak_customPageTitle",
    showModalButton: "tweak_showModalButton",
    customFontUrl: "tweak_customFontUrl",
    customFontFamily: "tweak_customFontFamily",
    localFontFamily: "tweak_localFontFamily",
    customFontSize: "tweak_customFontSize",
    customFaviconData: "tweak_customFaviconData",
  };

  /* ───────────────────────── CONSTANTS ───────────────────────── */
  const consolePrefix = "TypingMind Tweaks:";
  const defaultNewChatButtonColor = "#2563eb";
  const defaultWorkspaceIconColorVisual = "#9ca3af";
  const defaultWorkspaceFontColorVisual = "#d1d5db";
  const defaultSidebarMenuColor = "#18181b";                  // ➋ NEW
  const DEFAULT_FALLBACK_FAVICON = "/favicon.ico";

  let originalPageTitle = null;
  let faviconObserver = null;

  /* ───────────────────────── HELPERS ───────────────────────── */
  const cleanValue = (value) => {
    if (value === null || typeof value === "undefined") return null;
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
    if (value === null || value === "null") return defaultValue;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  /* ───────────────────────── CORE STYLE APPLICATION ───────────────────────── */
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
    const sidebarMenuColor = getSetting(settingsKeys.sidebarMenuColor, null); // ➌ NEW
    const showModalButtonSetting = getSetting(settingsKeys.showModalButton, true);

    /* --- Teams button --- */
    const teamsButton = document.querySelector('button[data-element-id="workspace-tab-teams"]');
    if (teamsButton) teamsButton.style.display = hideTeams ? "none" : "";

    /* --- Workspace bar --- */
    const workspaceBar = document.querySelector('div[data-element-id="workspace-bar"]');
    if (workspaceBar) {
      /* KB button */
      workspaceBar.querySelectorAll("button").forEach((button) => {
        const textSpan = button.querySelector("span > span");
        if (textSpan && textSpan.textContent.trim() === "KB") {
          button.style.display = hideKB ? "none" : "";
        }
      });

      /* Sidebar background colour ➍ NEW */
      if (sidebarMenuColor) {
        workspaceBar.style.setProperty("--sidebar-menu-color", sidebarMenuColor);
      } else {
        workspaceBar.style.removeProperty("--sidebar-menu-color");
      }

      /* Icon colour */
      workspaceBar.querySelectorAll("svg").forEach((icon) => {
        if (icon.closest("#workspace-tab-tweaks")) return;
        icon.style.color = wsIconColor ? wsIconColor : "";
      });

      /* Font colour */
      workspaceBar.querySelectorAll("span").forEach((span) => {
        if (span.closest("#workspace-tab-tweaks")) return;
        if (span.textContent.trim()) span.style.color = wsFontColor ? wsFontColor : "";
      });

      /* Tweaks button visibility and icon colour */
      const tweaksButton = document.getElementById("workspace-tab-tweaks");
      if (tweaksButton) {
        const svgIcon = tweaksButton.querySelector("svg");
        if (svgIcon)
          svgIcon.style.color = getSetting(settingsKeys.workspaceIconColor, defaultWorkspaceIconColorVisual);
        tweaksButton.style.display = showModalButtonSetting ? "inline-flex" : "none";
      }
    }

    /* Logo */
    const logoImage = document.querySelector('img[alt="TypingMind"][src="/logo.png"]');
    if (logoImage && logoImage.parentElement?.parentElement) {
      logoImage.parentElement.parentElement.style.display = hideLogo ? "none" : "";
    }

    /* Profile */
    const profileButton = document.querySelector('button[data-element-id="workspace-profile-button"]');
    if (profileButton) profileButton.style.display = hideProfile ? "none" : "";

    /* Chat profiles */
    document.querySelectorAll("span").forEach((span) => {
      if (span.textContent.trim() === "Chat Profiles") {
        const button = span.closest("button");
        if (button) button.style.display = hideChatProfiles ? "none" : "";
      }
    });

    /* Pinned characters */
    const pinnedCharsContainer = document.querySelector('div[data-element-id="pinned-characters-container"]');
    if (pinnedCharsContainer) pinnedCharsContainer.style.display = hidePinnedChars ? "none" : "";

    /* New-chat button colour */
    const newChatButton = document.querySelector('button[data-element-id="new-chat-button-in-side-bar"]');
    if (newChatButton) newChatButton.style.backgroundColor = newChatColor ? newChatColor : "";

    /* Inject base rule for sidebar background ➎ NEW  (done once) */
    if (!document.getElementById("tweak-sidebar-menu-color-style")) {
      const styleEl = document.createElement("style");
      styleEl.id = "tweak-sidebar-menu-color-style";
      styleEl.textContent =
        'div[data-element-id="workspace-bar"] { background: var(--sidebar-menu-color, #18181b) !important; }';
      document.head.appendChild(styleEl);
    }
  }

  /* ───────────────────────── TITLE, MODAL, FONT, FAVICON (unchanged) ───────────────────────── */
  // ... entire existing logic stays the same up to createSettingsModal()

  /* --- Only the parts touched below are flagged --- */

  /* ───────────────────────── CREATE SETTINGS MODAL ───────────────────────── */
  let modalOverlay = null;
  let modalElement = null;
  let feedbackElement = null;

  function createSettingsModal() {
    if (document.getElementById("tweak-modal-overlay")) return;

    /*  (styles string unchanged, kept as-is) */
    const styles = `/* (same long CSS block as before) */`;
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

    /* Existing checkbox + colour picker creation helpers remain unchanged */

    /* … existing settingsSection, colour pickers etc. … */

    /* Existing helper functions */
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

    /* Existing colour pickers */
    const newChatColorPicker = createColorPicker(
      "tweak_newChatButtonColor_input",
      "New Chat Button Color:",
      settingsKeys.newChatButtonColor,
      defaultNewChatButtonColor
    );

    const wsIconColorPicker = createColorPicker(
      "tweak_workspaceIconColor_input",
      "Menu Icon Color:",
      settingsKeys.workspaceIconColor,
      defaultWorkspaceIconColorVisual
    );

    const wsFontColorPicker = createColorPicker(
      "tweak_workspaceFontColor_input",
      "Menu Font Color:",
      settingsKeys.workspaceFontColor,
      defaultWorkspaceFontColorVisual
    );

    /* ➏ NEW sidebar colour picker */
    const sidebarMenuColorPicker = createColorPicker(
      "tweak_sidebarMenuColor_input",
      "Sidebar Color:",
      settingsKeys.sidebarMenuColor,
      defaultSidebarMenuColor
    );

    /* Append pickers in desired order */
    scrollableContent.append(
      settingsSection,
      newChatColorPicker,
      wsIconColorPicker,
      wsFontColorPicker,
      sidebarMenuColorPicker, // ➐ NEW
      customTitleInput,
      fontSettingsContainer,
      faviconSettingsSection
    );

    /* footer & rest unchanged */
    /* … footer creation … */
    /* … append modalElement, overlay … */
  }

  /* ───────────────────────── LOAD SETTINGS INTO MODAL ───────────────────────── */
  function loadSettingsIntoModal() {
    if (!modalElement) return;

    /* Existing field loading unchanged, only sidebar picker added */
    document.getElementById("tweak_sidebarMenuColor_input").value =
      getSetting(settingsKeys.sidebarMenuColor, defaultSidebarMenuColor);
