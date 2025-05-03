/* ========================================================
   TypingMind – Color-Everything Extension
   github.com/your-repo/colorizer.js
   Author: <you>, 2025
   ======================================================== */

/* -----------------------------------------------------------------
   1) Boilerplate wrapper that TypingMind looks for.
      Works in “custom extension” slot OR as a plain userscript.
-------------------------------------------------------------------*/
(function factory() {
  /* TypingMind injects a global “typingmindExtension” when this file
     is loaded.  We attach an onLoad handler so the UI appears after
     the app is ready (≈ after navigation + DOM mount).               */
  const EXT_NAME = "tm-colorizer";
  const STORE_KEY = "tm_colorizer_cfg_v1";

  /* ------------- 2) All UI labels + CSS targets ------------------ */
  /* Each entry:  label shown in the palette
                  selector (can be comma-separated)
                  cssProperty to overwrite                         */
  const COLOR_TARGETS = {
    appBg:          { label: "App background",      selector: "body",                                   prop: "background-color" },
    sidebarBg:      { label: "Sidebar",             selector: ".tm-sidebar",                            prop: "background-color" },
    headerBg:       { label: "Top bar",             selector: ".tm-header",                             prop: "background-color" },
    buttonBg:       { label: "Buttons",             selector: "button, .tm-btn",                        prop: "background-color" },
    buttonText:     { label: "Button text",         selector: "button, .tm-btn",                        prop: "color"            },
    userBubble:     { label: "Your messages",       selector: ".tm-chat-message.user",                  prop: "background-color" },
    assistantBubble:{ label: "Assistant messages",  selector: ".tm-chat-message.assistant",             prop: "background-color" },
    mainText:       { label: "Primary text",        selector: "body",                                   prop: "color"            }
  };

  /* ------------- 3) Minimal helper util -------------------------- */
  const $ = (sel, ctx=document) => ctx.querySelector(sel);

  /* ------------- 4) Style element that we keep updating ---------- */
  const styleEl = document.createElement("style");
  styleEl.id = EXT_NAME + "-style";
  document.head.appendChild(styleEl);

  /* ------------- 5) Build floating palette ---------------------- */
  function buildPalette(cfg) {
    // root wrapper
    const box = document.createElement("div");
    box.id = EXT_NAME;
    Object.assign(box.style, {
      position: "fixed",
      top: "1rem",
      right: "1rem",
      zIndex: 9999,
      background: "#1e1e1e",
      color: "#ffffff",
      fontFamily: "system-ui, sans-serif",
      borderRadius: "8px",
      padding: "1rem",
      width: "220px",
      boxShadow: "0 4px 10px rgba(0,0,0,.4)"
    });

    // title
    box.innerHTML = `<strong style="display:block;margin-bottom:.5rem;">Theme Editor</strong>`;

    // create one color input per target
    for (const [key, t] of Object.entries(COLOR_TARGETS)) {
      const row = document.createElement("div");
      row.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:.3rem 0;";
      row.innerHTML = `
        <label style="font-size:.8rem;">${t.label}</label>
        <input type="color" id="${EXT_NAME}-${key}" value="${cfg[key] || '#ffffff'}" style="width:42px;height:24px;border:none;background:none;cursor:pointer;">
      `;
      box.appendChild(row);

      // live update handler
      row.querySelector("input").addEventListener("input", (e)=>{
        cfg[key] = e.target.value;
        applyTheme(cfg);
        saveCfg(cfg);
      });
    }

    // action buttons
    const btnRow = document.createElement("div");
    btnRow.style.cssText = "display:flex;justify-content:space-between;margin-top:.6rem;";
    btnRow.innerHTML = `
       <button id="${EXT_NAME}-reset" style="flex:1;margin-right:.3rem;">Reset</button>
       <button id="${EXT_NAME}-close" style="flex:1;">Close</button>`;
    box.appendChild(btnRow);

    // button styles (reuse same class)
    box.querySelectorAll("button").forEach(btn=>{
      btn.style.cssText += `
        background:#444;color:#fff;border:none;border-radius:4px;padding:.3rem;cursor:pointer;font-size:.75rem;
      `;
      btn.addEventListener("mouseenter",()=>btn.style.background="#666");
      btn.addEventListener("mouseleave",()=>btn.style.background="#444");
    });

    $("#"+EXT_NAME+"-reset", box).addEventListener("click", ()=>{
      Object.keys(COLOR_TARGETS).forEach(k=>{ cfg[k]=null; $("#"+EXT_NAME+"-"+k).value="#ffffff"; });
      applyTheme(cfg);
      saveCfg(cfg);
    });
    $("#"+EXT_NAME+"-close", box).addEventListener("click", ()=> box.remove());

    document.body.appendChild(box);
  }

  /* ------------- 6) Apply theme (writes into <style>) ------------ */
  function applyTheme(cfg) {
    const cssParts = [];
    for (const [key, val] of Object.entries(cfg)) {
      if (!val) continue;            // skip empty / reset
      const {selector, prop} = COLOR_TARGETS[key];
      cssParts.push(`${selector}{${prop}:${val} !important;}`);
    }
    styleEl.textContent = cssParts.join("\n");
  }

  /* ------------- 7) Local-storage persistence -------------------- */
  const saveCfg = (cfg)=> localStorage.setItem(STORE_KEY, JSON.stringify(cfg));
  const loadCfg = ()=> {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); }
    catch(_){ return {}; }
  };

  /* ------------- 8) Kick things off ------------------------------ */
  function init() {
    const cfg = loadCfg();
    applyTheme(cfg);
    buildPalette(cfg);
  }

  /* Wait for TypingMind app root to exist, then init */
  function onLoad() {
    // In case it fires too early, poll a little
    const int = setInterval(()=>{
      if (document.body && $(".tm-chat-root, .tm-root, #root")) {
        clearInterval(int);
        init();
      }
    }, 300);
  }

  /* Expose hook for TypingMind’s extension loader */
  window.typingmindExtension = window.typingmindExtension || {};
  window.typingmindExtension[EXT_NAME] = { onLoad };

  /* Additionally run immediately if inserted by userscript managers */
  if (document.readyState === "complete" || document.readyState === "interactive") {
    onLoad();
  } else {
    window.addEventListener("DOMContentLoaded", onLoad);
  }
})();
