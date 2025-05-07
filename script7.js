/* TypingMind Custom-Font Extension
    Douglas Crockford (impersonated 😉) – v1.2 (Icon Corrected) |  Shift+Alt+F / Shift+Cmd+F opens the panel
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
    if (!workspaceBar) {
        // console.log("TypingMind Font Extension: Workspace bar not found.");
        return;
    }
    
    const settingsButton = workspaceBar.querySelector('[data-element-id="workspace-tab-settings"]');
    if (!settingsButton) {
        // console.log("TypingMind Font Extension: Settings button not found.");
        return;
    }
    
    // Create our button
    const fontButton = document.createElement("button");
    fontButton.id = "tm-font-menu-button";
    fontButton.title = "Custom Font Settings (Shift+Alt+F / Shift+Cmd+F)";
    
    // Copy class from settings button for consistent styling if possible
    if (settingsButton.className) {
      fontButton.className = settingsButton.className;
    } else {
      // Basic styling if class copy fails (less likely for existing buttons)
      fontButton.style.padding = "0.5rem";
      fontButton.style.display = "flex";
      fontButton.style.alignItems = "center";
      fontButton.style.gap = "0.5rem";
    }
    
    // Create SVG icon for "Aa" (Font settings)
    // This SVG aims to represent a capital 'A' and a lowercase 'a'.
    const iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 20L9 6l5 14"/>
        <path d="M6.5 14h5"/>
        <path d="M15 20v-5c0-1.38.9-2.5 2.5-2.5s2.5 1.12 2.5 2.5v5"/>
        <path d="M15 16.5h5"/>
      </svg>
    `;
    
    // Try to clone the inner structure from the settings button for visual consistency
    const settingsInnerSpan = settingsButton.querySelector("span"); // Often, button content is wrapped in a span
    if (settingsInnerSpan && settingsInnerSpan.cloneNode) { // Check if it's a node and clonable
      const clone = settingsInnerSpan.cloneNode(true);
      
      // Find the icon container (usually a div or the first child if it's an SVG directly)
      let iconContainer = clone.querySelector("div"); // Common pattern: div wraps svg
      if (!iconContainer && clone.querySelector("svg")) { // If SVG is direct child
        iconContainer = clone.querySelector("svg").parentNode; 
      } else if (!iconContainer && clone.firstChild && clone.firstChild.nodeName.toLowerCase() === 'svg') {
        // If the first child is an SVG, replace it. This is a bit more robust.
        clone.firstChild.outerHTML = iconSvg; // Replace the SVG
         // Ensure iconContainer is not null for the next step, though not strictly needed if outerHTML worked
        iconContainer = clone.firstChild; // Point to the new SVG
      }


      if (iconContainer && iconContainer.innerHTML !== undefined) { // Check if innerHTML is assignable
         // If we found a container (like a div), set its innerHTML
         // If we replaced an SVG directly using outerHTML, this step might be redundant or need adjustment
         // For safety, only set innerHTML if it's not the SVG we just inserted
        if (iconContainer.innerHTML !== iconSvg) {
            iconContainer.innerHTML = iconSvg;
        }
      } else if (clone.firstChild && clone.firstChild.nodeName.toLowerCase() !== 'svg') {
        // Fallback: if no obvious icon container, prepend the icon
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = iconSvg;
        clone.insertBefore(tempDiv.firstChild, clone.firstChild);
      } else if (!clone.firstChild) {
        // If clone is empty for some reason
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = iconSvg;
        clone.appendChild(tempDiv.firstChild);
      }
      
      // Update the text label (usually a span after the icon container or icon)
      let textSpan = clone.querySelector("span"); // Assumes text is in a nested span
      if (textSpan) {
        // Make sure we are not re-selecting the outer span if it was the clone root
        if (textSpan === clone && clone.childNodes.length > 1) { 
            // Try to find a deeper span if the clone itself is a span
            for(let i=0; i < clone.childNodes.length; i++) {
                if(clone.childNodes[i].nodeName.toLowerCase() === 'span') {
                    textSpan = clone.childNodes[i];
                    break;
                }
            }
        }
        if (textSpan !== clone) { // Ensure it's an inner span
             textSpan.textContent = "Font";
        } else if (clone.lastChild && clone.lastChild.nodeType === Node.TEXT_NODE) {
            clone.lastChild.textContent = " Font"; // If text is a direct text node
        } else {
            const newTextSpan = document.createElement('span');
            newTextSpan.textContent = "Font";
            if (clone.querySelector("svg")) { // Append after SVG
                clone.querySelector("svg").insertAdjacentElement('afterend', newTextSpan);
            } else {
                 clone.appendChild(newTextSpan);
            }
        }
      } else if (clone.lastChild && clone.lastChild.nodeType === Node.TEXT_NODE) {
         // If the text is a direct child node of the cloned span
         clone.lastChild.textContent = " Font";
      } else {
        // If no text span found, create and append one
        const newTextSpan = document.createElement('span');
        newTextSpan.style.marginLeft = "0.5rem"; // Add some space if icon is present
        newTextSpan.textContent = "Font";
        clone.appendChild(newTextSpan);
      }
      
      fontButton.innerHTML = ''; // Clear button before appending modified clone
      fontButton.appendChild(clone);
    } else {
      // Fallback: Create simple content if cloning strategy fails
      const buttonContentSpan = document.createElement('span');
      buttonContentSpan.style.display = 'flex';
      buttonContentSpan.style.alignItems = 'center';
      buttonContentSpan.style.gap = '0.5rem'; // Adjust gap as needed

      const iconDiv = document.createElement('div');
      iconDiv.innerHTML = iconSvg;
      
      const textNode = document.createElement('span');
      textNode.textContent = 'Font';

      buttonContentSpan.appendChild(iconDiv);
      buttonContentSpan.appendChild(textNode);
      fontButton.appendChild(buttonContentSpan);
    }
    
    // Insert before settings button
    if (settingsButton.parentNode) {
      settingsButton.parentNode.insertBefore(fontButton, settingsButton);
    } else {
        // Fallback: if settingsButton has no parent, append to workspaceBar (less ideal)
        // workspaceBar.appendChild(fontButton); 
        // console.log("TypingMind Font Extension: Settings button parent not found for insertion.");
    }
    
    // Add click event
    fontButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent any parent handlers if necessary
      if (window.TMFontModal && typeof window.TMFontModal.toggle === 'function') {
        window.TMFontModal.toggle();
      }
    });
  }

  /* ---------- hotkey ---------- */
  document.addEventListener("keydown", (e) => {
    const mac = /Mac/i.test(navigator.platform);
    // Use Alt for non-Mac, Meta (Cmd) for Mac. Ensure no other modifiers like Ctrl are pressed with Meta on Mac.
    const modOk = mac ? (e.metaKey && !e.ctrlKey && !e.altKey) : (e.altKey && !e.metaKey && !e.ctrlKey); 
    if (modOk && e.shiftKey && e.key.toUpperCase() === "F") {
      e.preventDefault();
      e.stopPropagation();
      if (window.TMFontModal && typeof window.TMFontModal.toggle === 'function') {
        window.TMFontModal.toggle();
      }
    }
  });

  /* ---------- observe DOM changes to add menu button ---------- */
  const observer = new MutationObserver((mutationsList, observerInstance) => {
    // Check if the modal logic is available and the button isn't already there.
    if (window.TMFontModal && !document.getElementById("tm-font-menu-button")) {
        const workspaceBar = document.querySelector('[data-element-id="workspace-bar"]');
        const settingsButton = workspaceBar ? workspaceBar.querySelector('[data-element-id="workspace-tab-settings"]') : null;
        if (workspaceBar && settingsButton) { // Only add if essential elements are present
            addMenuButton();
            // observerInstance.disconnect(); // Optionally disconnect if button is added and won't be removed.
                                       // However, TypingMind might re-render, so keeping it might be safer.
        }
    }
  });
  
  /* ---------- init ---------- */
  function initializeExtension() {
    buildModal(); // Build modal first so TMFontModal object and its methods are defined
    
    // Initial attempt to add the button
    const workspaceBar = document.querySelector('[data-element-id="workspace-bar"]');
    const settingsButton = workspaceBar ? workspaceBar.querySelector('[data-element-id="workspace-tab-settings"]') : null;
    if (workspaceBar && settingsButton) {
        addMenuButton();
    }

    applyFont(); // Apply any saved font settings

    // Start observing after initial setup attempt
    observer.observe(document.body, {
      childList: true, // Observe direct children additions/removals
      subtree: true    // Observe all descendants
    });
  }

  // Wait for the DOM to be fully loaded or interactive
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initializeExtension();
  } else {
    document.addEventListener("DOMContentLoaded", initializeExtension);
  }

  console.log(
    "%cTypingMind Font Extension loaded (v1.2) – Shift+Alt+F (Win/Linux) or Shift+Cmd+F (Mac) to open settings",
    "color:#42b983;font-weight:bold"
  );
})();
