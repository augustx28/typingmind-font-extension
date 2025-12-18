// ==TypingMind Plugin==
// @name Custom Font Changer
// @description Change UI and Chat fonts with full weight support
// @version 1.1

(function() {
  const STORAGE_KEY = 'tm-custom-fonts';
  
  const defaults = {
    uiLocalFont: '',
    uiWebFontUrl: '',
    uiWebFontName: '',
    chatLocalFont: '',
    chatWebFontUrl: '',
    chatWebFontName: ''
  };

  function getSettings() {
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
    } catch {
      return defaults;
    }
  }

  function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  function applyFonts() {
    const settings = getSettings();
    let styleEl = document.getElementById('tm-custom-fonts-style');
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'tm-custom-fonts-style';
      document.head.appendChild(styleEl);
    }

    // Build font stacks
    const uiFonts = [settings.uiLocalFont, settings.uiWebFontName].filter(Boolean);
    const chatFonts = [settings.chatLocalFont, settings.chatWebFontName].filter(Boolean);
    
    const uiFontStack = uiFonts.length ? `"${uiFonts.join('", "')}"` : null;
    const chatFontStack = chatFonts.length ? `"${chatFonts.join('", "')}"` : null;

    // Load web fonts
    let fontFaces = '';
    if (settings.uiWebFontUrl) {
      fontFaces += `@import url('${settings.uiWebFontUrl}');\n`;
    }
    if (settings.chatWebFontUrl && settings.chatWebFontUrl !== settings.uiWebFontUrl) {
      fontFaces += `@import url('${settings.chatWebFontUrl}');\n`;
    }

    let css = fontFaces;

    // Global UI font (preserve weights)
    if (uiFontStack) {
      css += `
        body,
        html,
        input,
        textarea,
        button,
        select {
          font-family: ${uiFontStack}, system-ui, -apple-system, sans-serif;
        }
      `;
    }

    // Chat area font (preserve weights by not using *)
    if (chatFontStack) {
      css += `
        .prose,
        .prose p,
        .prose h1,
        .prose h2,
        .prose h3,
        .prose h4,
        .prose h5,
        .prose h6,
        .prose li,
        .prose span,
        .prose strong,
        .prose em,
        .prose code,
        .prose blockquote,
        .markdown-body,
        .markdown-body p,
        .markdown-body h1,
        .markdown-body h2,
        .markdown-body h3,
        .markdown-body h4,
        .markdown-body li,
        .markdown-body span,
        .markdown-body strong,
        .whitespace-pre-wrap,
        [data-message-author-role] p,
        [data-message-author-role] span,
        [data-message-author-role] li {
          font-family: ${chatFontStack}, system-ui, -apple-system, sans-serif;
        }
      `;
    }

    styleEl.textContent = css;
  }

  function createSettingsUI() {
    const settings = getSettings();
    
    const panel = document.createElement('div');
    panel.id = 'tm-font-settings-panel';
    panel.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:99998;backdrop-filter:blur(4px);" id="font-overlay"></div>
      <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#18181b;padding:28px;border-radius:16px;z-index:99999;width:440px;color:#e4e4e7;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);border:1px solid #27272a;">
        <h3 style="margin:0 0 24px;font-size:17px;font-weight:600;display:flex;align-items:center;gap:10px;">
          <span style="font-size:20px;">⚙️</span> Font Settings
        </h3>
        
        <!-- Global UI Section -->
        <div style="margin-bottom:20px;padding:16px;background:#27272a;border-radius:10px;">
          <h4 style="margin:0 0 12px;font-size:13px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">Global UI</h4>
          <input type="text" id="ui-local-font" placeholder="Local font name (e.g. Inter, Roboto)" value="${settings.uiLocalFont}" style="width:100%;padding:10px 12px;margin-bottom:10px;border-radius:8px;border:1px solid #3f3f46;background:#09090b;color:#fff;font-size:14px;box-sizing:border-box;">
          <input type="text" id="ui-web-font-url" placeholder="Web font URL" value="${settings.uiWebFontUrl}" style="width:100%;padding:10px 12px;margin-bottom:10px;border-radius:8px;border:1px solid #3f3f46;background:#09090b;color:#fff;font-size:14px;box-sizing:border-box;">
          <input type="text" id="ui-web-font-name" placeholder="Web font family name (e.g. Inter)" value="${settings.uiWebFontName}" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid #3f3f46;background:#09090b;color:#fff;font-size:14px;box-sizing:border-box;">
        </div>
        
        <!-- Chat Area Section -->
        <div style="margin-bottom:24px;padding:16px;background:#27272a;border-radius:10px;">
          <h4 style="margin:0 0 12px;font-size:13px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">Chat Area Only</h4>
          <input type="text" id="chat-local-font" placeholder="Local font name" value="${settings.chatLocalFont}" style="width:100%;padding:10px 12px;margin-bottom:10px;border-radius:8px;border:1px solid #3f3f46;background:#09090b;color:#fff;font-size:14px;box-sizing:border-box;">
          <input type="text" id="chat-web-font-url" placeholder="Web font URL" value="${settings.chatWebFontUrl}" style="width:100%;padding:10px 12px;margin-bottom:10px;border-radius:8px;border:1px solid #3f3f46;background:#09090b;color:#fff;font-size:14px;box-sizing:border-box;">
          <input type="text" id="chat-web-font-name" placeholder="Web font family name" value="${settings.chatWebFontName}" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid #3f3f46;background:#09090b;color:#fff;font-size:14px;box-sizing:border-box;">
        </div>
        
        <div style="display:flex;gap:12px;justify-content:flex-end;">
          <button id="font-reset" style="padding:10px 18px;border-radius:8px;border:1px solid #3f3f46;background:transparent;color:#a1a1aa;cursor:pointer;font-size:14px;">Reset</button>
          <button id="font-cancel" style="padding:10px 18px;border-radius:8px;border:1px solid #3f3f46;background:#27272a;color:#fff;cursor:pointer;font-size:14px;">Cancel</button>
          <button id="font-save" style="padding:10px 18px;border-radius:8px;border:none;background:#6366f1;color:#fff;cursor:pointer;font-size:14px;font-weight:500;">Apply</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    document.getElementById('font-overlay').onclick = () => panel.remove();
    document.getElementById('font-cancel').onclick = () => panel.remove();
    
    document.getElementById('font-reset').onclick = () => {
      saveSettings(defaults);
      applyFonts();
      panel.remove();
    };
    
    document.getElementById('font-save').onclick = () => {
      saveSettings({
        uiLocalFont: document.getElementById('ui-local-font').value.trim(),
        uiWebFontUrl: document.getElementById('ui-web-font-url').value.trim(),
        uiWebFontName: document.getElementById('ui-web-font-name').value.trim(),
        chatLocalFont: document.getElementById('chat-local-font').value.trim(),
        chatWebFontUrl: document.getElementById('chat-web-font-url').value.trim(),
        chatWebFontName: document.getElementById('chat-web-font-name').value.trim()
      });
      applyFonts();
      panel.remove();
    };
  }

  function addSettingsButton() {
    if (document.getElementById('tm-font-btn')) return;
    
    const btn = document.createElement('button');
    btn.id = 'tm-font-btn';
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`;
    btn.title = 'Font Settings';
    btn.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(39,39,42,0.8);
      backdrop-filter: blur(8px);
      color: #a1a1aa;
      cursor: pointer;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    `;
    
    btn.onmouseenter = () => {
      btn.style.background = 'rgba(63,63,70,0.9)';
      btn.style.color = '#fff';
      btn.style.transform = 'scale(1.05)';
    };
    btn.onmouseleave = () => {
      btn.style.background = 'rgba(39,39,42,0.8)';
      btn.style.color = '#a1a1aa';
      btn.style.transform = 'scale(1)';
    };
    
    btn.onclick = createSettingsUI;
    document.body.appendChild(btn);
  }

  // Initialize
  applyFonts();
  addSettingsButton();
})();
