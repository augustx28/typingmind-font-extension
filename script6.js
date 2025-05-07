/*  TypingMind Custom-Font Extension
    Douglas Crockford (impersonated 😉) – v1.2.1 | Shift+Alt+F opens the panel
    MIT-licensed, zero tracking, zero external code execution
*/
(function () {
  "use strict";

  /* ---------- localStorage keys ---------- */
  const KEY = { url: "tm_font_url", family: "tm_font_family", size: "tm_font_size" };
  const STYLE_ID = "tm-font-style";
  const MODAL_ID = "tm-font-modal";

  /* ---------- helpers ---------- */
  const clean = (v) => (typeof v === "string" ? v.trim().replace(/^['"]|['"]$/g, "") : "");
  const save = (k, v) => { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); applyFont(); };
  const get  = (k) => clean(localStorage.getItem(k) || "");

  /* ---------- font injector ---------- */
  function applyFont() {
    const url   = get(KEY.url);
    const fam   = get(KEY.family);
    const size  = get(KEY.size);
    let css = "";

    const urlMatch = url.match(/href=['"]([^'"]+)['"]/);
    const cleanUrl = urlMatch ? urlMatch[1] : url;
    if (cleanUrl) css += `@import url('${cleanUrl}');\n`;

    if (fam || size) {
      css += `
html, body, button, input, select, textarea, div, span, p, h1, h2, h3, h4, h5, h6, a,
[data-element-id="chat-space-middle-part"],
[data-element-id="chat-space-middle-part"] *,
.prose, .prose-sm, .text-sm,
#chat-container, #chat-container * {
  ${fam  ? `font-family:${fam.includes(" ") ? `'${fam}'` : fam}!important;` : ""}
  ${size ? `font-size:${parseInt(size,10)}px!important;` : ""}
}`;
    }

    let tag = document.getElementById(STYLE_ID);
    if (!tag) { tag = document.createElement("style"); tag.id = STYLE_ID; document.head.appendChild(tag); }
    if (tag.textContent !== css) tag.textContent = css;
  }

  /* ---------- modal UI ---------- */
  function buildModal() {
    if (document.getElementById(MODAL_ID)) return;

    const overlay = document.createElement("div");
    overlay.id = MODAL_ID;
    overlay.style.cssText =
      "position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.5);z-index:10000;font-family:system-ui,sans-serif;";

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

    overlay.querySelector("#tm-font-url").value = get(KEY.url);
    overlay.querySelector("#tm-font-family").value = get(KEY.family);
    overlay.querySelector("#tm-font-size").value = get(KEY.size);

    const feedback = overlay.querySelector("#tm-font-feedback");

    overlay.querySelector("#tm-font-save").onclick = () => {
      save(KEY.url,   overlay.querySelector("#tm-font-url").value);
      save(KEY.family,overlay.querySelector("#tm-font-family").value);
      save(KEY.size,  overlay.querySelector("#tm-font-size").value);
      feedback.textContent = "✓ Font applied successfully!";
      setTimeout(() => { feedback.textContent = ""; }, 3000);
    };

    overlay.querySelector("#tm-font-clear").onclick = () => {
      ["url","family","size"].forEach(k => save(KEY[k],""));
      overlay.querySelector("#tm-font-url").value = "";
      overlay.querySelector("#tm-font-family").value = "";
      overlay.querySelector("#tm-font-size").value = "";
      feedback.textContent = "✓ Reset to default typography";
      setTimeout(() => { feedback.textContent = ""; }, 3000);
    };

    overlay.onclick = (e) => { if (e.target === overlay) overlay.style.display = "none"; };

    window.TMFontModal = {
      toggle() { overlay.style.display = overlay.style.display === "flex" ? "none" : "flex"; }
    };
  }

  /* ---------- add menu button ---------- */
  function addMenuButton() {
    if (document.getElementById("tm-font-menu-button")) return;

    const workspaceBar   = document.querySelector('[data-element-id="workspace-bar"]');
    if (!workspaceBar) return;

    const settingsButton = workspaceBar.querySelector('[data-element-id="workspace-tab-settings"]');
    if (!settingsButton) return;

    const fontButton         = document.createElement("button");
    fontButton.id            = "tm-font-menu-button";
    fontButton.title         = "Custom Font Settings (Shift+Alt+F)";

    /* copy all classes except any icon mask utilities (i-*) */
    fontButton.className = [...settingsButton.classList]
      .filter(c => !c.startsWith("i-"))
      .join(" ");

    /* ------- our Typography SVG + label ------- */
    const iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
           viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 20h3"/>
        <path d="M14 20h7"/>
        <path d="M6.9 15h6.9"/>
        <path d="M10.2 6.3l5.8 13.7"/>
        <path d="M5 20l6-16h2l7 16"/>
      </svg>`;

    fontButton.innerHTML = `
        <span class="relative w-6 h-6 flex items-center justify-center">${iconSvg}</span>
        <span class="text-[11px] leading-none">Font</span>`; // Corrected: No extra span wrapper

    settingsButton.parentNode.insertBefore(fontButton, settingsButton);

    fontButton.addEventListener("click", () => window.TMFontModal.toggle());
  }

  /* ---------- hotkey ---------- */
  document.addEventListener("keydown", (e) => {
    const mac = /Mac/i.test(navigator.platform);
    const modOk = mac ? e.metaKey : e.altKey;
    if (modOk && e.shiftKey && e.key.toUpperCase() === "F") {
      e.preventDefault();
      window.TMFontModal.toggle();
    }
  });

  /* ---------- observe DOM to (re)inject button ---------- */
  new MutationObserver(addMenuButton).observe(document.body, { childList: true, subtree: true });

  /* ---------- boot ---------- */
  const boot = () => { buildModal(); addMenuButton(); applyFont(); };
  /complete|interactive/.test(document.readyState) ? boot() : document.addEventListener("DOMContentLoaded", boot);

  console.log("%cTypingMind Font Extension loaded (v1.2.1) – Shift+Alt+F / ⌘⇧F", "color:#42b983;font-weight:bold");
})();
