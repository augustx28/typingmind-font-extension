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

    if (url) css += `@import url('${url}');\n`;

    if (fam || size) {
      css += `
html, body, * {
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
      "position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.5);z-index:10000;font-family:sans-serif;";

    /* inner card */
    overlay.innerHTML = `
      <div style="background:#1f1f1f;color:#f5f5f5;padding:24px 28px;border-radius:8px;min-width:320px;max-width:480px">
        <h2 style="margin:0 0 12px;text-align:center;font-size:1.4em">Custom Font</h2>

        <label style="display:block;font-size:.9em;margin-top:8px">Google-Fonts / CSS URL:
          <input id="tm-font-url" type="text" placeholder="https://fonts.googleapis.com/..." style="width:100%;margin-top:4px;padding:6px;border-radius:4px;border:1px solid #555;background:#333;color:#fff">
        </label>

        <label style="display:block;font-size:.9em;margin-top:12px">Font family name:
          <input id="tm-font-family" type="text" placeholder="Roboto" style="width:100%;margin-top:4px;padding:6px;border-radius:4px;border:1px solid #555;background:#333;color:#fff">
        </label>

        <label style="display:block;font-size:.9em;margin-top:12px">Base size (px, optional):
          <input id="tm-font-size" type="number" min="8" step="1" placeholder="16" style="width:100%;margin-top:4px;padding:6px;border-radius:4px;border:1px solid #555;background:#333;color:#fff">
        </label>

        <div style="margin-top:18px;display:flex;justify-content:flex-end;gap:8px">
          <button id="tm-font-clear" style="padding:6px 12px;background:#6c757d;border:none;border-radius:4px;color:#fff;cursor:pointer">Reset</button>
          <button id="tm-font-save"  style="padding:6px 12px;background:#2563eb;border:none;border-radius:4px;color:#fff;cursor:pointer">Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    /* preload stored values */
    overlay.querySelector("#tm-font-url").value = get(KEY.url);
    overlay.querySelector("#tm-font-family").value = get(KEY.family);
    overlay.querySelector("#tm-font-size").value = get(KEY.size);

    /* save button */
    overlay.querySelector("#tm-font-save").onclick = () => {
      save(KEY.url, overlay.querySelector("#tm-font-url").value);
      save(KEY.family, overlay.querySelector("#tm-font-family").value);
      save(KEY.size, overlay.querySelector("#tm-font-size").value);
      hide();
    };

    /* clear button */
    overlay.querySelector("#tm-font-clear").onclick = () => {
      ["url", "family", "size"].forEach((k) => save(KEY[k], ""));
      overlay.querySelector("#tm-font-url").value = "";
      overlay.querySelector("#tm-font-family").value = "";
      overlay.querySelector("#tm-font-size").value = "";
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

  /* ---------- hotkey ---------- */
  document.addEventListener("keydown", (e) => {
    const mac = /Mac/i.test(navigator.platform);
    const modOk = mac ? e.metaKey : e.altKey;
    if (modOk && e.shiftKey && e.key.toUpperCase() === "F") {
      e.preventDefault();
      window.TMFontModal.toggle();
    }
  });

  /* ---------- init ---------- */
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    buildModal();
    applyFont();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      buildModal();
      applyFont();
    });
  }

  console.log(
    "%cTypingMind Font Extension loaded – Shift+Alt+F / ⌘⇧F to open settings",
    "color:#42b983"
  );
})();
