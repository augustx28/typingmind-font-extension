/* ******************************************************************
 * TypingMind “Color-Everything” Extension
 * Author: 20-yr JS/UI veteran (generated via ChatGPT)
 * Paste into: TypingMind ➜ Settings ➜ Extensions  (or userscript)
 ******************************************************************* */
(() => {
  /********************* 1. CONFIG (defaults) ************************/
  const DEFAULT_THEME = {
    primary : '#4F46E5', // Top bar, main buttons
    bg      : '#F8FAFC', // Main background
    sidebar : '#1E293B', // Left nav / menu background
    bubbleAI: '#0EA5E9', // Assistant message
    bubbleMe: '#10B981', // Your message
    text    : '#0F172A'  // Generic text color
  };

  /********************* 2. STATE & HELPERS **************************/
  const LS_KEY = 'tm-color-theme';
  const state  = { ...DEFAULT_THEME, ...JSON.parse(localStorage.getItem(LS_KEY) || '{}') };

  // Apply current colors to :root
  const applyTheme = () => {
    const root = document.documentElement;
    Object.entries(state).forEach(([k, v]) =>
      root.style.setProperty(`--tm-${k}`, v)
    );
  };

  // Save current state to localStorage
  const saveTheme = () => localStorage.setItem(LS_KEY, JSON.stringify(state));

  /********************* 3. STYLE INJECTION **************************/
  const styleTag = document.createElement('style');
  styleTag.id = 'tm-color-everything-style';
  styleTag.textContent = `
    :root{
      --tm-primary : ${state.primary};
      --tm-bg      : ${state.bg};
      --tm-sidebar : ${state.sidebar};
      --tm-bubbleAI: ${state.bubbleAI};
      --tm-bubbleMe: ${state.bubbleMe};
      --tm-text    : ${state.text};
    }
    /* Generic areas */
    body, .app-main         { background: var(--tm-bg) !important; color: var(--tm-text); }
    header, .topbar, .btn   { background: var(--tm-primary) !important; color:#fff !important;}
    nav, .sidebar           { background: var(--tm-sidebar) !important; }
    /* Message bubbles (adapt selectors if TypingMind updates) */
    .message-row.ai   .message-bubble{ background: var(--tm-bubbleAI) !important; color:#fff;}
    .message-row.user .message-bubble{ background: var(--tm-bubbleMe) !important; color:#fff;}
    /* Quick hover tweak */
    .btn:hover{ filter:brightness(1.05); }
    /* Palette panel */
    #tmPalettePanel{
        position:fixed; top:60px; right:16px; z-index:9999;
        background:#fff; border:1px solid #ddd; border-radius:8px;
        padding:12px; width:210px; box-shadow:0 4px 18px rgba(0,0,0,.08);
        font-family:system-ui, sans-serif; display:none;
    }
    #tmPalettePanel h3{margin:0 0 8px;font-size:14px;}
    #tmPalettePanel label{font-size:12px; display:flex; justify-content:space-between; margin-bottom:6px;}
    #tmPalettePanel input{border:none; width:50px; height:24px; cursor:pointer;}
    #tmPalettePanel button{margin-top:8px; width:100%; cursor:pointer;
      background:var(--tm-primary); color:#fff; border:none; padding:6px 0; border-radius:6px;}
    /* Toggle button */
    #tmPaletteToggle{
        position:fixed; top:12px; right:12px; z-index:9999;
        width:36px; height:36px; border-radius:50%; border:none;
        background:var(--tm-primary); color:#fff; font-size:18px; cursor:pointer;
    }`;
  document.head.appendChild(styleTag);
  applyTheme(); // initial paint

  /********************* 4. UI: Toggle Button ************************/
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'tmPaletteToggle';
  toggleBtn.title = 'Theme palette';
  toggleBtn.innerHTML = '🎨';
  document.body.appendChild(toggleBtn);

  /********************* 5. UI: Palette Panel ************************/
  const panel = document.createElement('div');
  panel.id = 'tmPalettePanel';
  panel.innerHTML = `
     <h3>Pick your colors</h3>
     ${Object.keys(DEFAULT_THEME).map(key => `
       <label>${key}
          <input type="color" id="pick-${key}" value="${state[key]}"/>
       </label>`).join('')}
     <button id="savePalette">Save</button>
  `;
  document.body.appendChild(panel);

  /********************* 6. EVENT HANDLERS ***************************/
  // Show/Hide panel
  toggleBtn.addEventListener('click', () => {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  });

  // Live-preview on input
  Object.keys(DEFAULT_THEME).forEach(key => {
    const input = panel.querySelector(`#pick-${key}`);
    input.addEventListener('input', e => {
      state[key] = e.target.value;
      applyTheme();
    });
  });

  // Save + close
  panel.querySelector('#savePalette').addEventListener('click', () => {
    saveTheme();
    panel.style.display = 'none';
  });

})();
