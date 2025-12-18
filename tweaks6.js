// ==TypingMind Plugin==
// @name Custom Font Changer v2
// @description Change UI and Chat fonts with full weight support
// @version 2.0

(function() {
  const STORAGE_KEY = 'tm-custom-fonts-v2';
  
  const defaults = {
    uiLocalFont: '',
    uiWebFontUrl: '',
    uiWebFontName: '',
    chatLocalFont: '',
    chatWebFontUrl: '',
    chatWebFontName: ''
  };

  // Active font link trackers
  let activeUIFontLink = null;
  let activeChatFontLink = null;

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

  function loadWebFont(url, tracker) {
    if (tracker) tracker.remove();
    if (!url || !(url.startsWith('http://') || url.startsWith('https://'))) return null;
    
    const link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    link.onerror = () => console.error('Font load error:', url);
    document.head.appendChild(link);
    return link;
  }

  function applyFonts() {
    const settings = getSettings();
    const fallback = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

    // Load web fonts
    activeUIFontLink = loadWebFont(settings.uiWebFontUrl, activeUIFontLink);
    activeChatFontLink = loadWebFont(settings.chatWebFontUrl, activeChatFontLink);

    // Build font stacks (local takes priority)
    const uiFontName = settings.uiLocalFont || settings.uiWebFontName;
    const chatFontName = settings.chatLocalFont || settings.chatWebFontName;

    // Apply Global UI Font to body
    if (uiFontName) {
      document.body.style.fontFamily = `"${uiFontName}", ${fallback}`;
    } else {
      document.body.style.fontFamily = '';
    }

    // Apply Chat Font via stylesheet (preserves all weights)
    let styleEl = document.getElementById('tm-chat-font-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'tm-chat-font-style';
      document.head.appendChild(styleEl);
    }

    if (chatFontName) {
      const chatFontStack = `"${chatFontName}", ${fallback}`;
      styleEl.textContent = `
        [data-element-id="chat-space-middle-part"],
        [data-element-id="chat-space-middle-part"] .prose,
        [data-element-id="chat-space-middle-part"] .prose *,
        [data-element-id="chat-space-middle-part"] .prose-sm,
        [data-element-id="chat-space-middle-part"] .text-sm,
        div[data-radix-scroll-area-viewport] .whitespace-pre-wrap,
        .markdown-body,
        .markdown-body *,
        .group.flex.p-3.gap-3 {
          font-family: ${chatFontStack} !important;
        }
      `;
    } else {
      styleEl.textContent = '';
    }
  }

  function createSettingsUI() {
    const settings = getSettings();
    const existing = document.getElementById('tm-font-panel');
    if (existing) existing.remove();

    const panel = document.createElement('div');
    panel.id = 'tm-font-panel';
    panel.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99998;backdrop-filter:blur(6px);" id="font-overlay"></div>
      <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a1a1a;padding:24px 28px;border-radius:14px;z-index:99999;width:420px;color:#e5e5e5;box-shadow:0 20px 60px rgba(0,0,0,0.5);border:1px solid #333;">
        
        <h3 style="margin:0 0 20px;font-size:16px;font-weight:600;color:#fff;">Font Settings</h3>
        
        <!-- Global UI Section -->
        <div style="background:#262626;padding:16px;border-radius:10px;margin-bottom:16px;">
          <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:14px;">Global UI Font</div>
          
          <label style="display:block;font-size:13px;color:#aaa;margin-bottom:6px;">Local Font Name</label>
          <input type="text" id="ui-local" placeholder="e.g. Inter, Roboto, Arial" value="${settings.uiLocalFont}" style="width:100%;padding:10px 12px;margin-bottom:12px;border-radius:8px;border:1px solid #404040;background:#0d0d0d;color:#fff;font-size:14px;box-sizing:border-box;">
          
          <label style="display:block;font-size:13px;color:#aaa;margin-bottom:6px;">Web Font URL</label>
          <input type="text" id="ui-url" placeholder="https://fonts.googleapis.com/css2?family=..." value="${settings.uiWebFontUrl}" style="width:100%;padding:10px 12px;margin-bottom:12px;border-radius:8px;border:1px solid #404040;background:#0d0d0d;color:#fff;font-size:14px;box-sizing:border-box;">
          
          <label style="display:block;font-size:13px;color:#aaa;margin-bottom:6px;">Web Font Family Name</label>
          <input type="text" id="ui-name" placeholder="Exact font name from CSS" value="${settings.uiWebFontName}" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid #404040;background:#0d0d0d;color:#fff;font-size:14px;box-sizing:border-box;">
        </div>
        
        <!-- Chat Area Section -->
        <div style="background:#262626;padding:16px;border-radius:10px;margin-bottom:20px;">
          <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:14px;">Chat Area Font</div>
          
          <label style="display:block;font-size:13px;color:#aaa;margin-bottom:6px;">Local Font Name</label>
          <input type="text" id="chat-local" placeholder="e.g. Georgia, Merriweather" value="${settings.chatLocalFont}" style="width:100%;padding:10px 12px;margin-bottom:12px;border-radius:8px;border:1px solid #404040;background:#0d0d0d;color:#fff;font-size:14px;box-sizing:border-box;">
          
          <label style="display:block;font-size:13px;color:#aaa;margin-bottom:6px;">Web Font URL</label>
          <input type="text" id="chat-url" placeholder="https://fonts.googleapis.com/css2?family=..." value="${settings.chatWebFontUrl}" style="width:100%;padding:10px 12px;margin-bottom:12px;border-radius:8px;border:1px solid #404040;background:#0d0d0d;color:#fff;font-size:14px;box-sizing:border-box;">
          
          <label style="display:block;font-size:13px;color:#aaa;margin-bottom:6px;">Web Font Family Name</label>
          <input type="text" id="chat-name" placeholder="Exact font name from CSS" value="${settings.chatWebFontName}" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid #404040;background:#0d0d0d;color:#fff;font-size:14px;box-sizing:border-box;">
        </div>
        
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button id="font-reset" style="padding:10px 16px;border-radius:8px;border:1px solid #404040;background:transparent;color:#aaa;cursor:pointer;font-size:13px;">Reset All</button>
          <button id="font-cancel" style="padding:10px 16px;border-radius:8px;border:1px solid #404040;background:#333;color:#fff;cursor:pointer;font-size:13px;">Cancel</button>
          <button id="font-apply" style="padding:10px 20px;border-radius:8px;border:none;background:#5b5bf7;color:#fff;cursor:pointer;font-size:13px;font-weight:500;">Apply</button>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // Events
    document.getElementById('font-overlay').onclick = () => panel.remove();
    document.getElementById('font-cancel').onclick = () => panel.remove();
    
    document.getElementById('font-reset').onclick = () => {
      saveSettings(defaults);
      applyFonts();
      panel.remove();
    };

    document.getElementById('font-apply').onclick = () => {
      saveSettings({
        uiLocalFont: document.getElementById('ui-local').value.trim(),
        uiWebFontUrl: document.getElementById('ui-url').value.trim(),
        uiWebFontName: document.getElementById('ui-name').value.trim(),
        chatLocalFont: document.getElementById('chat-local').value.trim(),
        chatWebFontUrl: document.getElementById('chat-url').value.trim(),
        chatWebFontName: document.getElementById('chat-name').value.trim()
      });
      applyFonts();
      panel.remove();
    };
  }

  function addSettingsButton() {
    if (document.getElementById('tm-font-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'tm-font-btn';
    btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`;
    btn.title = 'Font Settings';
    btn.style.cssText = `
      position: fixed;
      bottom: 14px;
      right: 14px;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(30,30,30,0.85);
      color: #666;
      cursor: pointer;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      opacity: 0.6;
    `;

    btn.onmouseenter = () => {
      btn.style.opacity = '1';
      btn.style.color = '#fff';
      btn.style.background = 'rgba(50,50,50,0.95)';
    };
    btn.onmouseleave = () => {
      btn.style.opacity = '0.6';
      btn.style.color = '#666';
      btn.style.background = 'rgba(30,30,30,0.85)';
    };

    btn.onclick = createSettingsUI;
    document.body.appendChild(btn);
  }

  // Initialize
  applyFonts();
  addSettingsButton();
})();
