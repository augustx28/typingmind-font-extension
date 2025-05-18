(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   *  CONSTANTS & HELPERS
   * ------------------------------------------------------------------ */
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
    customFontFamily: "tweak_customFontFamily",
    customFontSize: "tweak_customFontSize",
  };

  const consolePrefix = "TypingMind Tweaks:";
  const defaultNewChatButtonColor = "#2563eb";
  const defaultWorkspaceIconColorVisual = "#9ca3af";
  const defaultWorkspaceFontColorVisual = "#d1d5db";

  /* ---------- NEW : list of common system fonts -------------------- */
  const commonLocalFonts = [
    { label: "Default (Browser)", value: "" },
    { label: "Arial", value: "Arial" },
    { label: "Helvetica", value: "Helvetica" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Georgia", value: "Georgia" },
    { label: "Courier New", value: "Courier New" },
    { label: "Verdana", value: "Verdana" },
    { label: "Tahoma", value: "Tahoma" },
    { label: "Trebuchet MS", value: "Trebuchet MS" },
    { label: "Comic Sans MS", value: "Comic Sans MS" },
  ];
  /* ------------------------------------------------------------------ */

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
    return value === null ? defaultValue : JSON.parse(value);
  }

  /* ==================================================================
     ALL UI-TWEAKS  (most of this file is unchanged)
  ===================================================================*/

  /* …  all the big original code stays exactly the same   … */

  /* ------------------------------------------------------------------
   *  createSettingsModal()
   * ------------------------------------------------------------------ */
  function createSettingsModal() {
    if (document.getElementById("tweak-modal-overlay")) return;

    /* original <style> block and modal skeleton … (unchanged) */

    /* ========= EXISTING  FONT SETTINGS  ========= */
    /* we are jumping straight to where the original script creates
       `fontSettingsContainer`, `fontFamilySection`, `fontSizeSection`
       etc.  The only modifications are the inserted Local-Font selector
       and a few syncing tweaks                                       */
    /* -------------------------------------------------------------- */

    const fontSettingsContainer = document.createElement("div");
    fontSettingsContainer.className = "tweak-settings-section";

    /* (original description <p> kept) */
    const fontDescription = document.createElement("p");
    fontDescription.textContent =
      "Import/apply custom font. Font URL must include desired weights (e.g., from Google Fonts selection).";
    fontDescription.style.marginBottom = "15px";
    fontDescription.style.fontSize = "0.9em";
    fontDescription.style.color = "#ccc";
    fontSettingsContainer.appendChild(fontDescription);

    /* ------------ Custom Font URL  (unchanged) --------------- */
    const customFontSection = document.createElement("div");
    customFontSection.className = "tweak-text-item";
    const fontLabel = document.createElement("label");
    fontLabel.textContent = "Custom Font URL:";
    fontLabel.style.marginRight = "10px";
    const fontInputWrapper = document.createElement("div");
    fontInputWrapper.className = "tweak-text-input-wrapper";
    const fontInput = document.createElement("input");
    fontInput.type = "text";
    fontInput.id = "tweak_customFontUrl_input";
    fontInput.placeholder = "Font URL (e.g., Google Fonts)";
    fontInput.addEventListener("input", (event) => {
      saveSetting(settingsKeys.customFontUrl, event.target.value || null);
      feedbackElement.textContent = "Settings saved.";
    });
    const clearFontButton = document.createElement("button");
    clearFontButton.textContent = "Clear";
    clearFontButton.className = "tweak-reset-button";
    clearFontButton.type = "button";
    clearFontButton.addEventListener("click", () => {
      saveSetting(settingsKeys.customFontUrl, null);
      fontInput.value = "";
      feedbackElement.textContent = "Settings saved.";
    });
    fontInputWrapper.appendChild(fontInput);
    fontInputWrapper.appendChild(clearFontButton);
    customFontSection.appendChild(fontLabel);
    customFontSection.appendChild(fontInputWrapper);

    /* ------------ Font Family (manual text) ------------- */
    const fontFamilySection = document.createElement("div");
    fontFamilySection.className = "tweak-text-item";
    const fontFamilyLabel = document.createElement("label");
    fontFamilyLabel.textContent = "Font Family Name:";
    fontFamilyLabel.style.marginRight = "10px";
    const fontFamilyInputWrapper = document.createElement("div");
    fontFamilyInputWrapper.className = "tweak-text-input-wrapper";
    const fontFamilyInput = document.createElement("input");
    fontFamilyInput.type = "text";
    fontFamilyInput.id = "tweak_customFontFamily_input";
    fontFamilyInput.placeholder = "Font Family Name (e.g., Roboto)";
    /* UPDATED listener to sync with dropdown */
    fontFamilyInput.addEventListener("input", (event) => {
      const val = event.target.value || null;
      saveSetting(settingsKeys.customFontFamily, val);
      const localSelect =
        document.getElementById("tweak_localFont_select") || null;
      if (localSelect) localSelect.value = val || "";
      feedbackElement.textContent = "Settings saved.";
    });
    const clearFontFamilyButton = document.createElement("button");
    clearFontFamilyButton.textContent = "Clear";
    clearFontFamilyButton.className = "tweak-reset-button";
    clearFontFamilyButton.type = "button";
    clearFontFamilyButton.addEventListener("click", () => {
      saveSetting(settingsKeys.customFontFamily, null);
      fontFamilyInput.value = "";
      const localSelect =
        document.getElementById("tweak_localFont_select") || null;
      if (localSelect) localSelect.value = "";
      feedbackElement.textContent = "Settings saved.";
    });
    fontFamilyInputWrapper.appendChild(fontFamilyInput);
    fontFamilyInputWrapper.appendChild(clearFontFamilyButton);
    fontFamilySection.appendChild(fontFamilyLabel);
    fontFamilySection.appendChild(fontFamilyInputWrapper);

    /* ---------- NEW  Local-Font  <select> ---------------- */
    const localFontSection = document.createElement("div");
    localFontSection.className = "tweak-text-item";
    const localFontLabel = document.createElement("label");
    localFontLabel.textContent = "Local Font (system):";
    localFontLabel.style.marginRight = "10px";

    const localFontSelect = document.createElement("select");
    localFontSelect.id = "tweak_localFont_select";
    Object.assign(localFontSelect.style, {
      flexGrow: "1",
      padding: "6px 10px",
      border: "1px solid #777",
      borderRadius: "4px",
      backgroundColor: "#555",
      color: "#f0f0f0",
      fontSize: "0.9em",
    });

    commonLocalFonts.forEach((f) => {
      const opt = document.createElement("option");
      opt.value = f.value;
      opt.textContent = f.label;
      localFontSelect.appendChild(opt);
    });

    /* when dropdown changes, overwrite customFontFamily */
    localFontSelect.addEventListener("change", (e) => {
      const v = e.target.value;
      saveSetting(settingsKeys.customFontFamily, v || null);
      fontFamilyInput.value = v; // keep manual text in sync
    });

    localFontSection.appendChild(localFontLabel);
    localFontSection.appendChild(localFontSelect);

    /* ------------- Font-Size row (unchanged) -------------- */
    const fontSizeSection = document.createElement("div");
    fontSizeSection.className = "tweak-text-item";
    const fontSizeLabel = document.createElement("label");
    fontSizeLabel.textContent = "Font Size (px):";
    fontSizeLabel.style.marginRight = "10px";
    const fontSizeInputWrapper = document.createElement("div");
    fontSizeInputWrapper.className = "tweak-text-input-wrapper";
    const fontSizeInput = document.createElement("input");
    fontSizeInput.type = "number";
    fontSizeInput.id = "tweak_customFontSize_input";
    fontSizeInput.placeholder = "Font size";
    Object.assign(fontSizeInput, {
      min: "8",
      step: "1",
    });
    Object.assign(fontSizeInput.style, {
      flexGrow: "1",
      padding: "6px 10px",
      border: "1px solid #777",
      borderRadius: "4px",
      backgroundColor: "#555",
      color: "#f0f0f0",
      fontSize: "0.9em",
      marginRight: "10px",
    });
    fontSizeInput.addEventListener("input", (e) => {
      const v = e.target.value ? parseInt(e.target.value, 10) : null;
      if (v && v >= 8) saveSetting(settingsKeys.customFontSize, v);
      else if (!v) saveSetting(settingsKeys.customFontSize, null);
      feedbackElement.textContent = "Settings saved.";
    });
    const clearFontSizeButton = document.createElement("button");
    clearFontSizeButton.textContent = "Clear";
    clearFontSizeButton.className = "tweak-reset-button";
    clearFontSizeButton.type = "button";
    clearFontSizeButton.addEventListener("click", () => {
      saveSetting(settingsKeys.customFontSize, null);
      fontSizeInput.value = "";
      feedbackElement.textContent = "Settings saved.";
    });
    fontSizeInputWrapper.appendChild(fontSizeInput);
    fontSizeInputWrapper.appendChild(clearFontSizeButton);
    fontSizeSection.appendChild(fontSizeLabel);
    fontSizeSection.appendChild(fontSizeInputWrapper);

    /* ----------- mount all font-area pieces ---------------- */
    fontSettingsContainer.appendChild(customFontSection);
    fontSettingsContainer.appendChild(fontFamilySection);
    fontSettingsContainer.appendChild(localFontSection);   // NEW
    fontSettingsContainer.appendChild(fontSizeSection);

    /* =========  finally add fontSettingsContainer to scrollableContent
       (original code already pushed previous sections) ================ */
    scrollableContent.appendChild(fontSettingsContainer);

    /* … the rest of createSettingsModal(): footer, append modal, etc. … */
  } /* -- end createSettingsModal -- */

  /* ------------------------------------------------------------------
   *  loadSettingsIntoModal(): sync controls with saved values
   * ------------------------------------------------------------------ */
  function loadSettingsIntoModal() {
    if (!modalElement) return;

    /*  original syncing code …  */

    const fontInput = document.getElementById("tweak_customFontUrl_input");
    if (fontInput)
      fontInput.value =
        cleanValue(localStorage.getItem(settingsKeys.customFontUrl) || "") || "";

    const fontFamilyInput = document.getElementById(
      "tweak_customFontFamily_input"
    );
    if (fontFamilyInput)
      fontFamilyInput.value =
        cleanValue(localStorage.getItem(settingsKeys.customFontFamily) || "") ||
        "";

    /* ---- NEW: keep dropdown in sync ---- */
    const localFontSelect = document.getElementById("tweak_localFont_select");
    if (localFontSelect) {
      localFontSelect.value =
        cleanValue(localStorage.getItem(settingsKeys.customFontFamily) || "") ||
        "";
    }

    /*  original code for fontSizeInput etc. continues … */
  }

  /* ------------------------------------------------------------------
   *  saveSetting(), toggleModal(), initializeTweaks(), MutationObserver
   *  and applyCustomFont() remain IDENTICAL to the original file.
   * ------------------------------------------------------------------ */

  /* ======================  ORIGINAL REMAINDER  ===================== */
  /* (Paste the rest of the original file here without change)        */

})();   /*  << end IIFE >>  */
