/*  TypingMind Custom-Font Extension
    v1.1.1  |  open with ⌘⇧F (Mac) or Shift+Alt+F (Win/Linux)
    MIT Licence  •  Douglas Crockford impersonation
*/
(function () {
  "use strict";

  /* ────────── constants ────────── */
  const KEY = {
    url: "tm_font_url",
    family: "tm_font_family",
    size: "tm_font_size",
  };

  const STYLE_ID = "tm-font-style";
  const MODAL_ID = "tm-font-modal";
  const BTN_ID   = "workspace-tab-font";

  /* ────────── helpers ────────── */
  const clean = (v) =>
    typeof v === "string" ? v.trim().replace(/^['"]|['"]$/g, "") : "";

  const save = (k, v) => {
    v ? localStorage.setItem(k, v) : localStorage.removeItem(k);
    applyFont();
  };

  const get = (k) => clean(localStorage.getItem(k) || "");

  /* ────────── font injector ────────── */
  function applyFont() {
    const url  = get(KEY.url);
    const fam  = get(KEY.family);
    const size = get(KEY.size);

    let css = url ? `@import url('${url}');\n` : "";

    if (fam || size) {
      css += `
html, body, * {
  ${fam  ? `font-family:${fam.includes(" ") ? "'" + fam + "'" : fam}!important;` : ""}
  ${size ? `font-size:${parseInt(size, 10)}px!important;` : ""}
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

  /* ────────── modal UI ────────── */
  function buildModal() {
    if (document.getElementById(MODAL_ID)) return;

    const overlay = document.createElement("div");
    overlay.id = MODAL_ID;
    overlay.style.cssText =
      "position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.55);z-index:10000;font-family:sans-serif;";

    overlay.innerHTML = `
      <div style="background:#1f1f1f;color:#f5f5f5;padding:24px 28px;border-radius:8px;min-width:320px;max-width:480px">
        <h2 style="margin:0 0 14px;text-align:center;font-size:1.45em">Custom Font</h2>

        <label style="display:block;font-size:.9em;margin-top:6px">
          Google-Fonts / CSS URL:
          <input id="tm-font-url" type="text" placeholder="https://fonts.googleapis.com/..." style="width:100%;margin-top:4px;padding:6px;border-radius:4px;border:1px solid #555;background:#333;color:#fff">
        </label>

        <label style="display:block;font-size:.9em;margin-top:12px">
          Font family name:
          <input id="tm-font-family" type="text" placeholder="Inter" style="width:100%;margin-top:4px;padding:6px;border-radius:4px;border:1px solid #555;background:#333;color:#fff">
        </label>

        <label style="display:block;font-size:.9em;margin-top:12px">
          Base size (px, optional):
          <input id="tm-font-size" type="number" min="8" step="1" placeholder="16" style="width:100%;margin-top:4px;padding:6px;border-radius:4px;border:1px solid #555;background:#333;color:#fff">
        </label>

        <div style="margin-top:18px;display:flex;justify-content:flex-end;gap:8px">
          <button id="tm-font-clear" style="padding:6px 12px;background:#6c757d;border:none;border-radius:4px;color:#fff;cursor:pointer">Reset</button>
          <button id="tm-font-save"  style="padding:6px 12px;background:#2563eb;border:none;border-radius:4px;color:#fff;cursor:pointer">Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    /* preload saved settings */
    overlay.querySelector("#tm-font-url").value    = get(KEY.url);
    overlay.querySelector("#tm-font-family").value = get(KEY.family);
    overlay.querySelector("#tm-font-size").value   = get(KEY.size);

    /* buttons */
    overlay.querySelector("#tm-font-save").onclick = () => {
      save(KEY.url,    overlay.querySelector("#tm-font-url").value);
      save(KEY.family, overlay.querySelector("#tm-font-family").value);
      save(KEY.size,   overlay.querySelector("#tm-font-size").value);
      hide();
    };

    overlay.querySelector("#tm-font-clear").onclick = () => {
      ["url","family","size"].forEach(k => save(KEY[k], ""));
      ["url","family","size"].forEach(id => overlay.querySelector(`#tm-font-${id}`).value = "");
    };

    overlay.onclick = (e) => { if (e.target === overlay) hide(); };
    function hide(){ overlay.style.display = "none"; }

    /* global toggle for hotkey & menu button */
    window.TMFontModal = {
      toggle(){ overlay.style.display = overlay.style.display === "flex" ? "none" : "flex"; }
    };
  }

  /* ────────── workspace button ────────── */
  function addMenuButton() {
    if (document.getElementById(BTN_ID)) return;

    const bar = document.querySelector('div[data-element-id="workspace-bar"]');
    if (!bar) return;

    const refBtn = bar.querySelector('button[data-element-id="workspace-tab-settings"]');
    if (!refBtn) return;

    /* clone classes for consistent look */
    const btn = document.createElement("button");
    btn.id = BTN_ID;
    btn.dataset.elementId = BTN_ID;
    btn.className = refBtn.className;
    btn.title = "Font settings";

    /* ---- updated icon here ---- */
    btn.innerHTML = `
      <span class="${refBtn.querySelector("span")?.className || ""}">
        <div class="${refBtn.querySelector("div")?.className || ""}">
          <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <!-- Material Icons 'format_size' glyph -->
            <path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3v-3H3v3z"/>
          </svg>
        </div>
        <span class="font-normal self-stretch text-center text-xs leading-4 md:leading-none">Font</span>
      </span>
    `;

    btn.onclick = (e) => { e.preventDefault(); window.TMFontModal.toggle(); };

    bar.insertBefore(btn, refBtn); // place just before TypingMind's Settings
  }

  /* ────────── hot-key ────────── */
  document.addEventListener("keydown", (e) => {
    const mac = /Mac/i.test(navigator.platform);
    const mod = mac ? e.metaKey : e.altKey;
    if (mod && e.shiftKey && e.key.toUpperCase() === "F") {
      e.preventDefault();
      window.TMFontModal.toggle();
    }
  });

  /* ────────── init ────────── */
  function init() {
    buildModal();
    applyFont();
    addMenuButton();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else
    init();

  /* keep trying if workspace bar loads later */
  const obs = new MutationObserver(addMenuButton);
  obs.observe(document.body, { childList: true, subtree: true });

  console.log("%cTypingMind Font Extension v1.1.1 – loaded", "color:#42b983");
})();
