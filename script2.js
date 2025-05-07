/*  TypingMind Custom-Font Extension
    Douglas Crockford (impersonated 😉) – v1.2 (Icon Updated) |  Shift+Alt+F opens the panel
    MIT-licensed, zero tracking, zero external code execution
*/
(function () {
  "use strict";

  /* ---------- localStorage keys ---------- */
  const KEY = {
    url: "tm_font_url",
    family: "tm_font_family",
    size: "tm_font_size",
  };

  const STYLE_ID = "tm-font-style";
  const MODAL_ID = "tm-font-modal";

  /* ---------- helpers ---------- */
  const clean = (v) =>
    typeof v === "string" ? v.trim().replace(/^['"]|['"]$/g, "") : "";

  const save = (k, v) => {
    if (v) localStorage.setItem(k, v);
    else localStorage.removeItem(k);
    applyFont(); // re-apply instantly
  };

  const get = (k) => clean(localStorage.getItem(k) || "");

  /* ---------- font injector ---------- */
  function applyFont() {
    const url = get(KEY.url);
    const fam = get(KEY.family);
    const size = get(KEY.size);

    let css = "";

    // Extract URL from Google Fonts link tag if necessary
    const urlMatch = url.match(/href=['"]([^'"]+)['"]/);
    const cleanUrl = urlMatch ? urlMatch[1] : url;

    if (cleanUrl) css += `@import url('${cleanUrl}');\n`;

    if (fam || size) {
      // More comprehensive selectors to ensure we target everything
      css += `
html, body, button, input, select, textarea, div, span, p, h1, h2, h3, h4, h5, h6, a,
[data-element-id="chat-space-middle-part"],
[data-element-id="chat-space-middle-part"] *,
.prose, .prose-sm, .text-sm,
#chat-container, #chat-container * {
  ${fam ? `font-family: ${fam.includes(" ") ? "'" + fam + "'" : fam} !important;` : ""}
  ${size ? `font-size: ${parseInt(size, 10)}px !important;` : ""}
}`;
    }

    let tag = document.getElementById(STYLE_ID);
    if (!tag) {
      tag = document.createElement("style");
      tag.id = STYLE_ID;
      document.head.appendChild(tag);
    }
    if (tag.textContent !== css) tag.textContent = css;
  }

  /* ---------- modal UI ---------- */
  function buildModal() {
    if (document.getElementById(MODAL_ID)) return; // created once

    const overlay = document.createElement("div");
    overlay.id = MODAL_ID;
    overlay.style.cssText =
      "position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.5);z-index:10000;font-family:system-ui,sans-serif;";

    /* inner card */
    overlay.innerHTML = `
      <div style="background:#1f1f1f;color:#f5f5f5;padding:24px 28px;border-radius:8px;min-width:320px;max-width:480px;box-shadow:0 8px 32px rgba(0,0,0,0.3)">
        <h2 style="margin:0 0 16px;text-align:center;font-size:1.4em;font-weight:600">Custom Font</h2>
        <p style="margin:0 0 16px;font-size:0.9em;color:#aaa;line-height:1.4">Change the typography of the entire TypingMind interface.</p>

        <label style="display:block;font-size:.9em;margin-top:14px">Google-Fonts / CSS URL:
          <input id="tm-font-url" type="text" placeholder="https://fonts.googleapis.com/..." style="width:100%;margin-top:4px;padding:8px;border-radius:4px;border:1px solid #555;background:#333;color:#fff">
        </label>

        <label style="display:block;font-size:.9em;margin-top:14px">Font family name:
          <input id="tm-font-family" type="text" placeholder="Roboto" style="width:100%;margin-top:4px;padding:8px;border-radius:4px;border:1px solid #555;background:#333;color:#fff">
        </label>

        <label style="display:block;font-size:.9em;margin-top:14px">Base size (px, optional):
          <input id="tm-font-size" type="number" min="8" step="1" placeholder="16" style="width:100%;margin-top:4px;padding:8px;border-radius:4px;border:1px solid #555;background:#333;color:#fff">
        </label>

        <div style="margin-top:22px;display:flex;justify-content:space-between;gap:8px">
          <button id="tm-font-clear" style="padding:8px 16px;background:#6c757d;border:none;border-radius:4px;color:#fff;cursor:pointer;font-weight:500">Reset All</button>
          <button id="tm-font-save"  style="padding:8px 20px;background:#2563eb;border:none;border-radius:4px;color:#fff;cursor:pointer;font-weight:500">Apply Font</button>
        </div>

        <p id="tm-font-feedback" style="margin:16px 0 0;font-size:0.85em;color:#4ade80;text-align:center;min-height:1em;font-weight:500"></p>
      </div>
    `;
    document.body.appendChild(overlay);

    /* preload stored values */
    overlay.querySelector("#tm-font-url").value = get(KEY.url);
    overlay.querySelector("#tm-font-family").value = get(KEY.family);
    overlay.querySelector("#tm-font-size").value = get(KEY.size);

    const feedback = overlay.querySelector("#tm-font-feedback");

    /* save button */
    overlay.querySelector("#tm-font-save").onclick = () => {
      save(KEY.url, overlay.querySelector("#tm-font-url").value);
      save(KEY.family, overlay.querySelector("#tm-font-family").value);
      save(KEY.size, overlay.querySelector("#tm-font-size").value);
      feedback.textContent = "✓ Font applied successfully!";
      setTimeout(() => { feedback.textContent = ""; }, 3000);
    };

    /* clear button */
    overlay.querySelector("#tm-font-clear").onclick = () => {
      ["url", "family", "size"].forEach((k) => save(KEY[k], ""));
      overlay.querySelector("#tm-font-url").value = "";
      overlay.querySelector("#tm-font-family").value = "";
      overlay.querySelector("#tm-font-size").value = "";
      feedback.textContent = "✓ Reset to default typography";
      setTimeout(() => { feedback.textContent = ""; }, 3000);
    };

    /* close by clicking outside card */
    overlay.onclick = (e) => {
      if (e.target === overlay) hide();
    };

    function hide() {
      overlay.style.display = "none";
    }

    /* expose open/hide globally for hotkey */
    window.TMFontModal = {
      toggle() {
        overlay.style.display =
          overlay.style.display === "flex" ? "none" : "flex";
      },
    };
  }

  /* ---------- add menu button ---------- */
  function addMenuButton() {
    // Don't add if already exists
    if (document.getElementById("tm-font-menu-button")) return;

    const workspaceBar = document.querySelector('[data-element-id="workspace-bar"]');
    if (!workspaceBar) return;

    const settingsButton = workspaceBar.querySelector('[data-element-id="workspace-tab-settings"]');
    if (!settingsButton) return;

    // Create our button with same styling as other workspace buttons
    const fontButton = document.createElement("button");
    fontButton.id = "tm-font-menu-button";
    fontButton.title = "Custom Font Settings (Shift+Alt+F)";

    // Copy class from settings button for consistent styling
    if (settingsButton.className) {
      fontButton.className = settingsButton.className;
    }

    // ** NEW ICON SVG HERE **
    const iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 11l-1.26-3.14A4.41 4.41 0 0012.08 5H5.5a2 2 0 00-2 2v11a2 2 0 002 2h13a2 2 0 002-2v-4.5"/>
        <path d="m5 12 3-7 3 7"/>
        <path d="M5.5 12h5"/>
        <path d="m18 20 3-3-3-3"/>
        <path d="M15 17h6"/>
      </svg>
    `;

    // Clone the inner structure from the settings button
    const settingsInnerSpan = settingsButton.querySelector("span");
    if (settingsInnerSpan) {
      const clone = settingsInnerSpan.cloneNode(true);

      // Find the icon container and replace it
      const iconContainer = clone.querySelector("div");
      if (iconContainer) {
        iconContainer.innerHTML = iconSvg;
      }

      // Update the text label
      const textSpan = clone.querySelector("span");
      if (textSpan) {
        textSpan.textContent = "Font";
      }

      fontButton.appendChild(clone);
    } else {
      // Fallback simple content if we can't clone
      fontButton.innerHTML = `<span>${iconSvg}<span>Font</span></span>`;
    }

    // Insert before settings button
    if (settingsButton.parentNode) {
      settingsButton.parentNode.insertBefore(fontButton, settingsButton);
    }

    // Add click event
    fontButton.addEventListener("click", () => {
      window.TMFontModal.toggle();
    });
  }

  /* ---------- hotkey ---------- */
  document.addEventListener("keydown", (e) => {
    const mac = /Mac/i.test(navigator.platform);
    const modOk = mac ? e.metaKey : e.altKey; // Alt on Win/Linux, Cmd on Mac
    if (modOk && e.shiftKey && e.key.toUpperCase() === "F") {
      e.preventDefault();
      window.TMFontModal.toggle();
    }
  });

  /* ---------- observe DOM changes to add menu button ---------- */
  const observer = new MutationObserver(() => {
    addMenuButton(); // Attempt to add button on DOM changes
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  /* ---------- init ---------- */
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    buildModal();
    addMenuButton();
    applyFont();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      buildModal();
      addMenuButton();
      applyFont();
    });
  }

  console.log(
    "%cTypingMind Font Extension loaded – Shift+Alt+F to open settings",
    "color:#42b983;font-weight:bold"
  );
})();

