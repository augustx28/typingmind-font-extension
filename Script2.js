/* ------------------------------------------------------------------
   🆕  GLOBAL-FONT ADD-ON
   ------------------------------------------------------------------ */
  /* 1. Extend the setting keys ****************************************/
  const settingsKeys = {
    ...settingsKeys,                   // keep previous keys
    applyFontToUI: "tweak_applyFontToUI"
  };

  /* 2. Append a new checkbox to the existing font settings section *** */
  // run this after fontSettingsContainer has been created
  (function addGlobalFontToggle() {
    if (!window.__tweakFontTogglePatched) {   // prevent duplicates
      window.__tweakFontTogglePatched = true;

      const globalToggleItem = document.createElement("div");
      globalToggleItem.className = "tweak-checkbox-item";

      const globalToggle = document.createElement("input");
      globalToggle.type = "checkbox";
      globalToggle.id   = settingsKeys.applyFontToUI;
      globalToggle.checked = JSON.parse(
        localStorage.getItem(settingsKeys.applyFontToUI) ?? "true"
      );
      globalToggle.addEventListener("change", e => {
        localStorage.setItem(
          settingsKeys.applyFontToUI,
          JSON.stringify(e.target.checked)
        );
        applyCustomFont();                         // refresh styles
        if (feedbackElement) feedbackElement.textContent = "Settings saved.";
      });

      const globalToggleLabel = document.createElement("label");
      globalToggleLabel.htmlFor = settingsKeys.applyFontToUI;
      globalToggleLabel.textContent = "Apply font to entire UI";

      globalToggleItem.append(globalToggle, globalToggleLabel);
      fontSettingsContainer.appendChild(globalToggleItem);
    }
  })();

  /* 3. Monkey-patch loadSettingsIntoModal so the checkbox state syncs */
  const _loadSettingsIntoModalOriginal = loadSettingsIntoModal;
  loadSettingsIntoModal = function patchedLoadSettingsIntoModal() {
    _loadSettingsIntoModalOriginal();                    // original work
    const cb = document.getElementById(settingsKeys.applyFontToUI);
    if (cb) cb.checked = JSON.parse(
      localStorage.getItem(settingsKeys.applyFontToUI) ?? "true"
    );
  };

  /* 4. Enhance applyCustomFont so it can act globally *****************/
  const _applyCustomFontOriginal = applyCustomFont;
  applyCustomFont = function patchedApplyCustomFont() {
    _applyCustomFontOriginal(); // keep chat-area styling intact

    /* -------- add / update global <style> rule -------- */
    const styleId = "tweak-custom-font-global-style";
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    const cleanedFamily = cleanValue(
      localStorage.getItem(settingsKeys.customFontFamily)
    );
    const cleanedSize = cleanValue(
      localStorage.getItem(settingsKeys.customFontSize)
    );
    const applyGlobally = JSON.parse(
      localStorage.getItem(settingsKeys.applyFontToUI) ?? "true"
    );

    if (!applyGlobally || (!cleanedFamily && !cleanedSize)) {
      /* nothing to enforce – wipe previous global rules if any */
      styleEl.textContent = "";
      return;
    }

    let css = "";
    if (cleanedFamily) {
      let fam = cleanedFamily.trim();
      if (fam.includes(" ")) fam = `'${fam}'`;
      css += `font-family:${fam} !important;`;
    }
    if (
      cleanedSize &&
      !Number.isNaN(Number.parseInt(cleanedSize, 10)) &&
      Number.parseInt(cleanedSize, 10) > 0
    ) {
      css += `font-size:${Number.parseInt(cleanedSize, 10)}px !important;`;
    }
    styleEl.textContent = `
/* GLOBAL FONT injected by TypingMind Tweaks */
html, body, * { ${css} }
`;
  };

  /* 5. Call once during bootstrap ************************************/
  applyCustomFont();
/* ------------------------------------------------------------------ */
