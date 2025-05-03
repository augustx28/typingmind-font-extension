(function () {
  "use strict";

  /* ---------- localStorage keys ---------- */
  const KEY = {
    url: "tm_font_url_v1", // Use v1 to avoid conflicts if old script was used
    family: "tm_font_family_v1",
    size: "tm_font_size_v1",
  };

  const STYLE_ID = "tm-font-style";
  const MODAL_ID = "tm-font-modal";
  const BUTTON_ID = "tm-font-button";
  const CONSOLE_PREFIX = "TypingMind Font:";

  /* ---------- helpers ---------- */
  const clean = (v) =>
    typeof v === "string" ? v.trim().replace(/^['"]|['"]$/g, "") : "";

  const save = (k, v) => {
    const cleanedValue = clean(v);
    if (cleanedValue) localStorage.setItem(k, cleanedValue);
    else localStorage.removeItem(k);
    applyFont(); // re-apply instantly
  };

  const get = (k) => clean(localStorage.getItem(k) || "");

  /* ---------- font injector ---------- */
  function applyFont() {
    const url = get(KEY.url);
    const fam = get(KEY.family);
    const size = get(KEY.size);
    const sizePx = size ? parseInt(size, 10) : 0;

    let css = "";

    // 1. Add @import if URL is provided
    if (url && (url.startsWith("http:") || url.startsWith("https://"))) {
      css += `@import url('${url}');\n`;
    } else if (url) {
      console.warn(
        `${CONSOLE_PREFIX} Invalid font URL provided: ${url}. Must start with http:// or https://`
      );
    }

    // 2. Apply font-family and font-size globally if provided
    let globalRules = [];
    if (fam) {
      // Add quotes if family name contains spaces
      const familyValue = fam.includes(" ") ? `'${fam}'` : fam;
      globalRules.push(`  font-family: ${familyValue} !important;`);
    }
    if (sizePx > 0) {
      globalRules.push(`  font-size: ${sizePx}px !important;`);
    }

    if (globalRules.length > 0) {
      // Apply to html, body, and use '*' for broad coverage.
      // Specificity might still be an issue for some deeply nested elements,
      // but this covers the vast majority of the UI.
      css += `
html, body, *, button, input, textarea, select, .prose {
${globalRules.join("\n")}
}`;
    }

    // 3. Get or create the style tag
    let tag = document.getElementById(STYLE_ID);
    if (!tag) {
      tag = document.createElement("style");
      tag.id = STYLE_ID;
      document.head.appendChild(tag);
    }

    // 4. Update styles only if changed
    if (tag.textContent !== css) {
      tag.textContent = css;
      // console.log(`${CONSOLE_PREFIX} Styles applied.`);
    }
  }

  /* ---------- modal UI ---------- */
  function buildModal() {
    if (document.getElementById(MODAL_ID)) return; // Build only once

    const overlay = document.createElement("div");
    overlay.id = MODAL_ID;
    overlay.style.cssText =
      "position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.65);z-index:10000;font-family:sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;"; // Slightly darker overlay, smoother font

    /* inner card */
    overlay.innerHTML = `
      <div style="background:#252525;color:#f0f0f0;padding:25px 30px;border-radius:8px;min-width:340px;max-width:500px;box-shadow:0 5px 15px rgba(0,0,0,.4);border:1px solid #4a4a4a;">
        <h2 style="margin:0 0 18px;text-align:center;font-size:1.5em;font-weight:600;color:#ffffff;">Custom Font Settings</h2>

        <label style="display:block;font-size:.95em;margin-top:10px;color:#e0e0e0;">Google Fonts / CSS URL:
          <input id="tm-font-url" type="text" placeholder="https://fonts.googleapis.com/..." style="width:100%;margin-top:5px;padding:8px 10px;border-radius:4px;border:1px solid #777;background:#555;color:#f0f0f0;font-size:0.9em;">
        </label>

        <label style="display:block;font-size:.95em;margin-top:15px;color:#e0e0e0;">Font Family Name:
          <input id="tm-font-family" type="text" placeholder="Roboto" style="width:100%;margin-top:5px;padding:8px 10px;border-radius:4px;border:1px solid #777;background:#555;color:#f0f0f0;font-size:0.9em;">
        </label>

        <label style="display:block;font-size:.95em;margin-top:15px;color:#e0e0e0;">Base Size (px, optional):
          <input id="tm-font-size" type="number" min="8" step="1" placeholder="e.g., 15" style="width:100%;margin-top:5px;padding:8px 10px;border-radius:4px;border:1px solid #777;background:#555;color:#f0f0f0;font-size:0.9em;">
        </label>

        <div style="margin-top:25px;padding-top:15px;border-top:1px solid #4a4a4a;display:flex;justify-content:flex-end;gap:10px;">
          <button id="tm-font-clear" style="padding:7px 15px;background:#6c757d;border:none;border-radius:5px;color:#fff;cursor:pointer;font-size:0.9em;font-weight:500;transition:background-color 0.2s ease;">Reset</button>
          <button id="tm-font-save"  style="padding:7px 15px;background:#0d6efd;border:none;border-radius:5px;color:#fff;cursor:pointer;font-size:0.9em;font-weight:500;transition:background-color 0.2s ease;">Save & Close</button>
        </div>
        <p id="tm-font-feedback" style="font-size:0.85em;color:#a0cfff;margin-top:10px;min-height:1em;text-align:center;"> </p>
      </div>
    `;
    document.body.appendChild(overlay);

    const urlInput = overlay.querySelector("#tm-font-url");
    const familyInput = overlay.querySelector("#tm-font-family");
    const sizeInput = overlay.querySelector("#tm-font-size");
    const feedbackEl = overlay.querySelector("#tm-font-feedback");

    function showFeedback(message, isError = false) {
      feedbackEl.textContent = message;
      feedbackEl.style.color = isError ? "#ff8a8a" : "#a0cfff";
      setTimeout(() => { feedbackEl.textContent = " "; }, 3000);
    }

    /* save button */
    overlay.querySelector("#tm-font-save").onclick = () => {
      save(KEY.url, urlInput.value);
      save(KEY.family, familyInput.value);
      save(KEY.size, sizeInput.value);
      showFeedback("Settings saved.");
      setTimeout(hide, 300); // Give feedback time to show before closing
    };

    /* clear button */
    overlay.querySelector("#tm-font-clear").onclick = () => {
      urlInput.value = "";
      familyInput.value = "";
      sizeInput.value = "";
      save(KEY.url, "");
      save(KEY.family, "");
      save(KEY.size, "");
      showFeedback("Settings cleared.");
    };

    /* close by clicking outside card */
    overlay.onclick = (e) => {
      if (e.target === overlay) hide();
    };

    function loadValues() {
      urlInput.value = get(KEY.url);
      familyInput.value = get(KEY.family);
      sizeInput.value = get(KEY.size);
      feedbackEl.textContent = " "; // Clear feedback on open
    }

    function hide() {
      overlay.style.display = "none";
    }

    function show() {
      loadValues(); // Load fresh values from localStorage
      overlay.style.display = "flex";
    }

    /* expose open/hide globally */
    window.TMFontModal = {
      toggle() {
        if (overlay.style.display === "flex") {
          hide();
        } else {
          show();
        }
      },
      show: show,
      hide: hide,
    };

    // Add hover effects for buttons
    overlay.querySelectorAll("button").forEach(button => {
        const originalBg = button.style.backgroundColor;
        // Simple darken effect - works okay for these colors
        const hoverBg = originalBg === 'rgb(108, 117, 125)' /* #6c757d */ ? '#5a6268' :
                      originalBg === 'rgb(13, 110, 253)' /* #0d6efd */ ? '#0b5ed7' : originalBg;

        button.onmouseover = () => button.style.backgroundColor = hoverBg;
        button.onmouseout = () => button.style.backgroundColor = originalBg;
    });
  }

  /* ---------- hotkey ---------- */
  document.addEventListener("keydown", (e) => {
    if (!window.TMFontModal) return; // Modal not ready yet

    const mac = /Mac/i.test(navigator.platform);
    const modOk = mac ? e.metaKey : e.altKey;
    if (modOk && e.shiftKey && e.key.toUpperCase() === "F") {
      e.preventDefault();
      e.stopPropagation();
      window.TMFontModal.toggle();
    }
    // Also close modal on Escape key
    if (e.key === "Escape" && document.getElementById(MODAL_ID)?.style.display === 'flex') {
        window.TMFontModal.hide();
    }
  });

  /* ---------- Button Injector (using MutationObserver) ---------- */
  function addSidebarButton() {
    const observer = new MutationObserver((mutationsList, observer) => {
      const workspaceBar = document.querySelector(
        'div[data-element-id="workspace-bar"]'
      );
      const settingsButton = workspaceBar?.querySelector(
        'button[data-element-id="workspace-tab-settings"]'
      );

      // Check if workspace bar and settings button exist, and our button doesn't yet
      if (workspaceBar && settingsButton && !document.getElementById(BUTTON_ID)) {
        console.log(`${CONSOLE_PREFIX} Workspace bar found. Adding button.`);

        // Clone the settings button to inherit styles easily
        const fontButton = settingsButton.cloneNode(true);
        fontButton.id = BUTTON_ID;
        fontButton.title = "Open Custom Font Settings (Shift+Alt+F)";
        fontButton.dataset.elementId = BUTTON_ID; // Use our own ID

        // Find the SVG icon and text span within the cloned button
        const svgElement = fontButton.querySelector("svg");
        const textElement = fontButton.querySelector("span > span:last-child"); // Heuristic: find the text span

        if (svgElement) {
          // Replace SVG content with a simple 'T' icon
          svgElement.setAttribute("viewBox", "0 0 24 24"); // Standard viewbox
          svgElement.innerHTML = `
            <path fill="currentColor" d="M4.5 6.5h15v3h-6v10h-3V9.5h-6z"></path>
          `; // Simple 'T' path, slightly bolder
        } else {
           console.warn(`${CONSOLE_PREFIX} Could not find SVG element in cloned button.`);
        }

        if (textElement) {
          // Update the text label
          textElement.textContent = "Font";
        } else {
           console.warn(`${CONSOLE_PREFIX} Could not find text element in cloned button.`);
        }

        // Add click listener to toggle the modal
        fontButton.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (window.TMFontModal) {
            window.TMFontModal.toggle();
          } else {
            console.error(`${CONSOLE_PREFIX} Modal not initialized yet.`);
          }
        };

        // Insert the new button before the settings button
        settingsButton.parentNode.insertBefore(fontButton, settingsButton);

        // Optionally, disconnect observer if we only need to add the button once
        // observer.disconnect();
        // console.log(`${CONSOLE_PREFIX} Button added successfully.`);
      }
    });

    // Start observing the body for changes that might add the workspace bar
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    console.log(`${CONSOLE_PREFIX} Observer started, waiting for workspace bar...`);
  }


  /* ---------- init ---------- */
  function initialize() {
      console.log(`${CONSOLE_PREFIX} Initializing...`);
      buildModal(); // Create modal structure (hidden)
      applyFont();  // Apply stored font settings on load
      addSidebarButton(); // Start observer to add the button when UI is ready
      console.log(
        `%c${CONSOLE_PREFIX} Ready. Press Shift+Alt+F / ⌘⇧F or click the 'T' button.`,
        "color:#42b983; font-weight:bold;"
      );
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    initialize();
  } else {
    document.addEventListener("DOMContentLoaded", initialize);
  }

})();
