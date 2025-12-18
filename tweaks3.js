// ==TypingMind Plugin==
// @name Custom Font Changer
// @description Change UI and Chat fonts separately using local or web fonts
// @version 1.0

(function() {
  const STORAGE_KEY = 'tm-custom-fonts';
  
  // Default settings
  const defaults = {
    uiLocalFont: '',
    uiWebFont: '',
    chatLocalFont: '',
    chatWebFont: ''
  };

  // Load saved settings
  function getSettings() {
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
    } catch {
      return defaults;
    }
  }

  // Save settings
  function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  // Apply fonts
  function applyFonts() {
    const settings = getSettings();
    let styleEl = document.getElementById('tm-custom-fonts-style');
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'tm-custom-fonts-style';
      document.head.appendChild(styleEl);
    }

    // Build font-family strings (local takes priority, web as fallback)
    const uiFont = [settings.uiLocalFont, settings.uiWebFont].filter(Boolean).join(', ') || 'inherit';
    const chatFont = [settings.chatLocalFont, settings.chatWebFont].filter(Boolean).join(', ') || 'inherit';

    // Load web fonts if provided
    let webFontImports = '';
    if (settings.uiWebFont) {
      webFontImports += `@import url('${settings.uiWebFont}');\n`;
    }
    if (settings.chatWebFont && settings.chatWebFont !== settings.uiWebFont) {
      webFontImports += `@import url('${settings.chatWebFont}');\n`;
    }

    styleEl.textContent = `
      ${webFontImports}
      
      /* Entire UI Font */
      body, html, * {
        font-family: ${uiFont}, system-ui, sans-serif !important;
      }
      
      /* Chat Area Only Override */
      .prose, 
      .prose *, 
      [class*="message"] p,
      [class*="message"] span,
      [class*="message"] li,
      [class*="chat"] .whitespace-pre-wrap,
      .markdown-body,
      .markdown-body * {
        font-family: ${chatFont}, system-ui, sans-serif !important;
      }
    `;
  }

  // Create settings panel
  function createSettingsUI() {
    const settings = getSettings();
    
    const panel = document.createElement('div');
    panel.id = 'tm-font-settings-panel';
    panel.innerHTML = `
      <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1e1e1e;padding:24px;border-radius:12px;z-index:99999;min-width:400px;color:#fff;box-shadow:0 8px 32px rgba(0,0,0,0.4);">
        <h3 style="margin:0 0 20px;font-size:18px;">🔤 Custom Font Settings</h3>
        
        <div style="margin-bottom:16px;">
          <h4 style="margin:0 0 8px;font-size:14px;color:#aaa;">Global UI Font</h4>
          <input type="text" id="ui-local-font" placeholder="Local font (e.g., Arial, Helvetica)" value="${settings.uiLocalFont}" style="width:100%;padding:8px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#2a2a2a;color:#fff;">
          <input type="text" id="ui-web-font" placeholder="Google Fonts URL" value="${settings.uiWebFont}" style="width:100%;padding:8px;border-radius:6px;border:1px solid #444;background:#2a2a2a;color:#fff;">
        </div>
        
        <div style="margin-bottom:20px;">
          <h4 style="margin:0 0 8px;font-size:14px;color:#aaa;">Chat Area Font</h4>
          <input type="text" id="chat-local-font" placeholder="Local font (e.g., Georgia, Times)" value="${settings.chatLocalFont}" style="width:100%;padding:8px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#2a2a2a;color:#fff;">
          <input type="text" id="chat-web-font" placeholder="Google Fonts URL" value="${settings.chatWebFont}" style="width:100%;padding:8px;border-radius:6px;border:1px solid #444;background:#2a2a2a;color:#fff;">
        </div>
        
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button id="font-cancel" style="padding:8px 16px;border-radius:6px;border:none;background:#444;color:#fff;cursor:pointer;">Cancel</button>
          <button id="font-save" style="padding:8px 16px;border-radius:6px;border:none;background:#4f46e5;color:#fff;cursor:pointer;">Save</button>
        </div>
      </div>
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99998;"></div>
    `;
    
    document.body.appendChild(panel);
    
    document.getElementById('font-cancel').onclick = () => panel.remove();
    document.getElementById('font-save').onclick = () => {
      saveSettings({
        uiLocalFont: document.getElementById('ui-local-font').value.trim(),
        uiWebFont: document.getElementById('ui-web-font').value.trim(),
        chatLocalFont: document.getElementById('chat-local-font').value.trim(),
        chatWebFont: document.getElementById('chat-web-font').value.trim()
      });
      applyFonts();
      panel.remove();
    };
  }

  // Add settings button
  function addSettingsButton() {
    if (document.getElementById('tm-font-btn')) return;
    
    const btn = document.createElement('button');
    btn.id = 'tm-font-btn';
    btn.innerHTML = '🔤';
    btn.title = 'Font Settings';
    btn.style.cssText = 'position:fixed;bottom:20px;right:20px;width:44px;height:44px;border-radius:50%;border:none;background:#4f46e5;color:#fff;font-size:20px;cursor:pointer;z-index:9999;box-shadow:0 2px 8px rgba(0,0,0,0.3);';
    btn.onclick = createSettingsUI;
    document.body.appendChild(btn);
  }

  // Initialize
  applyFonts();
  addSettingsButton();
})();
