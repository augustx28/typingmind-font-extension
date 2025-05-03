
  /* ------------------------------ CONFIG --------------------------------- */
  const STORAGE_KEY = "tm_sidebar_styler";
  
  // Utility: save / load user preferences
  const savePrefs = prefs => localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  const loadPrefs = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  };

  // Default values
  const prefs = Object.assign({ color:"#4A90E2", darkness:80 }, loadPrefs());
  
  /* -------------------------- CSS INJECTION ------------------------------ */
  const styleTag = document.createElement("style");
  styleTag.id = "tm-sidebar-styler-css";
  document.head.append(styleTag);
  
  const updateCSS = () => {
    const darkPct = prefs.darkness / 100;             // 0 → 1
    const rgb = hexToRgb(prefs.color);
    const sidebarBg = `rgba(${rgb.r},${rgb.g},${rgb.b},${darkPct})`;
    const hoverBg   = `rgba(${rgb.r},${rgb.g},${rgb.b},${Math.min(darkPct+0.1,1)})`;
    
    styleTag.textContent = `
      :root {
        --tm-ss-bg: ${sidebarBg};
        --tm-ss-hover: ${hoverBg};
        --tm-ss-active: ${prefs.color};
      }
      /* 1. Sidebar background & scrollbar */
      .sidebar, .Sidebar, .sidebar-menu {
        background: var(--tm-ss-bg) !important;
      }
      .sidebar::-webkit-scrollbar-thumb {
        background: var(--tm-ss-hover);
      }
      /* 2. Sidebar buttons / items */
      .sidebar-item, .sidebar .item, .sidebar button {
        transition: background .18s;
      }
      .sidebar-item:hover,
      .sidebar .item:hover {
        background: var(--tm-ss-hover) !important;
      }
      .sidebar-item.active,
      .sidebar .item.active {
        background: var(--tm-ss-active) !important;
        color: #fff !important;
      }
    `;
  };
  
  /* --------------------------- UI OVERLAY -------------------------------- */
  const buildPanel = () => {
    // Panel wrapper
    const panel = document.createElement("div");
    panel.id = "tm-styler-panel";
    panel.innerHTML = `
      <style>
        #tm-styler-panel {
          position: fixed; top: 10px; left: 10px; z-index: 9999;
          font: 14px/1.4 sans-serif;
        }
        #tm-styler-toggle {
          width:32px; height:32px; border-radius:5px; cursor:pointer;
          border:none; background:#eee; box-shadow:0 0 3px rgba(0,0,0,.2);
        }
        #tm-styler-settings {
          margin-top:8px; padding:10px; width:160px;
          background:#fff; border-radius:6px; box-shadow:0 2px 8px rgba(0,0,0,.25);
          display:none;
        }
        #tm-styler-settings label { display:block; margin:6px 0 2px; font-weight:600; }
        #tm-styler-settings input[type=range] { width:100%; }
      </style>
      <button id="tm-styler-toggle" title="Sidebar Styler 🎨">🎨</button>
      <div id="tm-styler-settings">
        <label>Color</label>
        <input id="tm-color" type="color" value="${prefs.color}">
        <label>Darkness</label>
        <input id="tm-darkness" type="range" min="10" max="100" value="${prefs.darkness}">
      </div>`;
    
    document.body.append(panel);
    
    // Element refs
    const toggleBtn = panel.querySelector("#tm-styler-toggle");
    const settings  = panel.querySelector("#tm-styler-settings");
    const colorInp  = panel.querySelector("#tm-color");
    const darkInp   = panel.querySelector("#tm-darkness");
    
    // Toggle panel open/close
    toggleBtn.onclick = () => settings.style.display = (settings.style.display ? "" : "block");
    
    // Live update events
    colorInp.oninput = e => { prefs.color = e.target.value; persistAndApply(); };
    darkInp.oninput  = e => { prefs.darkness = +e.target.value; persistAndApply(); };
  };
  
  /* ------------------------------ HELPERS -------------------------------- */
  const persistAndApply = () => { savePrefs(prefs); updateCSS(); };
  
  // Minimal HEX → RGB converter
  const hexToRgb = hex => {
    const raw = hex.replace("#", "");
    const bigint = parseInt(raw, 16);
    return raw.length === 3
      ? { r: (bigint>>8 & 0xf)*17, g: (bigint>>4 & 0xf)*17, b: (bigint & 0xf)*17 }
      : { r: bigint>>16 & 255, g: bigint>>8 & 255, b: bigint & 255 };
  };
  
  /* -------------------------- BOOTSTRAP LOGIC ---------------------------- */
  const waitForSidebar = () => new Promise(res=>{
    const el = document.querySelector(".sidebar, .Sidebar, .sidebar-menu");
    if (el) return res(el);
    // Observe until sidebar appears
    const obs = new MutationObserver(()=>{
      const el2 = document.querySelector(".sidebar, .Sidebar, .sidebar-menu");
      if (el2) { obs.disconnect(); res(el2); }
    });
    obs.observe(document.body, { childList:true, subtree:true });
  });
  
  (async () => {
    await waitForSidebar();
    updateCSS();
    buildPanel();
    console.log("%cTypingMind Sidebar Styler loaded ✓","color:#4A90E2;font-weight:bold");
  })();
})();
