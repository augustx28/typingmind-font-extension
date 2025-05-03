/* =========================================================================
   TypingMind – Sidebar Theme Extension
   Author : YOU
   Version: 1.0.0
   License: MIT
   ======================================================================== */

/* eslint-env browser */
(() => {
  /* --------------------------- CONFIGURATION --------------------------- */
  const STORAGE_KEY = 'tmSidebarTheme';     // localStorage key
  const DEFAULTS = { hue: 210, lightness: 18 }; // dark blue-gray

  /* ---------------------- DOM HELPERS & CONSTANTS ---------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const SIDEBAR_SELECTOR = '[data-testid="sidebar"], .sidebar, #sidebar';

  /* ------------------------- LOAD / SAVE STATE ------------------------- */
  const loadState = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULTS; }
    catch (_) { return DEFAULTS; }
  };
  const saveState = (state) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  /* ------------------------- STYLE GENERATION -------------------------- */
  const applyTheme = ({ hue, lightness }) => {
    const saturation = 25; // tweak as desired
    const bg      = `hsl(${hue}deg ${saturation}% ${lightness}%)`;
    const fg      = lightness < 50 ? '#EEE' : '#111';
    const fgMuted = lightness < 50 ? '#BBB' : '#333';

    const css = `
      ${SIDEBAR_SELECTOR}{
        background:${bg}!important;
        color:${fg}!important;
      }
      ${SIDEBAR_SELECTOR} *{
        color:${fg}!important;
      }
      ${SIDEBAR_SELECTOR} svg{
        fill:${fgMuted}!important;
      }
      /* active / hover states */
      ${SIDEBAR_SELECTOR} a:hover,
      ${SIDEBAR_SELECTOR} .active{
        background:rgba(255,255,255,0.07)!important;
      }
    `;

    styleEl.textContent = css;
  };

  /* --------------------------- UI CREATION ----------------------------- */
  const createControlPanel = (state) => {
    const wrap = document.createElement('div');
    wrap.id = 'tm-theme-controls';
    wrap.style.cssText = `
      display:flex;flex-direction:column;gap:8px;
      padding:12px 10px;border-top:1px solid rgba(255,255,255,0.07);
    `;

    // Color picker
    const colorLabel = document.createElement('label');
    colorLabel.textContent = 'Hue';
    colorLabel.style.fontSize = '11px';

    const colorInput = document.createElement('input');
    colorInput.type = 'range';
    colorInput.min  = 0;
    colorInput.max  = 360;
    colorInput.value = state.hue;
    colorInput.style.width = '100%';

    // Darkness slider
    const darkLabel = document.createElement('label');
    darkLabel.textContent = 'Darkness';
    darkLabel.style.fontSize = '11px';

    const darkInput = document.createElement('input');
    darkInput.type  = 'range';
    darkInput.min   = 0;           // 0% lightness → black
    darkInput.max   = 100;         // 100% lightness → white
    darkInput.value = state.lightness;
    darkInput.style.width = '100%';

    // Event handlers
    const handler = () => {
      const newState = {
        hue: +colorInput.value,
        lightness: +darkInput.value
      };
      applyTheme(newState);
      saveState(newState);
    };
    colorInput.addEventListener('input', handler);
    darkInput.addEventListener('input', handler);

    // Build tree
    wrap.append(colorLabel, colorInput, darkLabel, darkInput);
    return wrap;
  };

  /* ------------------------------ INIT --------------------------------- */
  let styleEl;
  const init = () => {
    const sidebar = $(SIDEBAR_SELECTOR);
    if (!sidebar) return;                        // TypingMind not ready yet

    // 1. Inject <style>
    styleEl = document.createElement('style');
    document.head.appendChild(styleEl);

    // 2. Apply previously saved theme
    const state = loadState();
    applyTheme(state);

    // 3. Add Control Panel
    const panel = createControlPanel(state);
    sidebar.appendChild(panel);                 // bottom of the sidebar
  };

  /* Wait for DOM (typingmind is SPA, so watch mutations too) */
  const observer = new MutationObserver(() => {
    if ($(SIDEBAR_SELECTOR) && !$('#tm-theme-controls')) init();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // For first, fast load
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }
})();
