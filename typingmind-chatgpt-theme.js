{
  "manifest_version": 3,
  "name": "TypingMind - ChatGPT Dark Theme",
  "version": "1.0.1",
  "description": "Applies a ChatGPT-inspired dark theme to TypingMind. Updated May 2025.",
  "author": "Your Name Here",
  "content_scripts": [
    {
      "matches": [
        "https://app.typingmind.com/*"
        // Add other domains if you use a self-hosted version, e.g.,
        // "*://your-typingmind-domain.com/*"
      ],
      "css": ["style.css"],
      "run_at": "document_start"
    }
  ],
   "icons": {
    "48": "icon48.png",
    "128": "icon128.png"
  }
}

/**
 * ChatGPT Theme for TypingMind - Content Script
 * Version: 1.0.0
 * Date: May 3, 2025
 */

(function() {
  'use strict';

  // Configuration
  const config = {
    theme: {
      enabled: true,
      // You can add theme options here for future versions
    }
  };

  // Load saved settings
  function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get('chatgptThemeConfig', (data) => {
        if (data.chatgptThemeConfig) {
          Object.assign(config, data.chatgptThemeConfig);
        }
        resolve(config);
      });
    });
  }

  // Save settings
  function saveSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ 'chatgptThemeConfig': config }, () => {
        resolve(true);
      });
    });
  }

  // Apply additional dynamic styles if needed
  function applyDynamicStyles() {
    const styleElement = document.createElement('style');
    styleElement.id = 'chatgpt-theme-dynamic-styles';
    
    // Add any dynamic styles here if needed in the future
    const dynamicCSS = `
      /* Dynamic styles can be added here if needed */
    `;
    
    styleElement.textContent = dynamicCSS;
    document.head.appendChild(styleElement);
  }

  // Initialize the theme
  async function initTheme() {
    await loadSettings();
    
    if (config.theme.enabled) {
      // Add class to body for CSS targeting
      document.documentElement.classList.add('chatgpt-theme');
      
      // Apply any dynamic styles
      applyDynamicStyles();
      
      // Log success message
      console.log('[ChatGPT Theme] Successfully applied to TypingMind');
    }
  }

  // Monitor for DOM changes to ensure theme persists through dynamic content loading
  function observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Re-apply theme to new elements if needed
          if (config.theme.enabled && !document.documentElement.classList.contains('chatgpt-theme')) {
            document.documentElement.classList.add('chatgpt-theme');
          }
        }
      });
    });
    
    // Start observing the document
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    
    return observer;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
  
  // Start DOM observer
  const observer = observeDOMChanges();
  
  // Clean up on window unload
  window.addEventListener('unload', () => {
    if (observer) {
      observer.disconnect();
    }
  });
})();
/**
 * ChatGPT Theme for TypingMind
 * Version: 1.0.0
 * Date: May 3, 2025
 * 
 * This stylesheet applies the ChatGPT dark theme colors and styling
 * to the TypingMind interface.
 */

/* Root variables for theme colors */
:root.chatgpt-theme,
html.chatgpt-theme {
  --chatgpt-bg-main: #343541;
  --chatgpt-bg-sidebar: #202123;
  --chatgpt-bg-input: #40414F;
  --chatgpt-bg-bot-message: #444654;
  --chatgpt-bg-user-message: #343541;
  --chatgpt-bg-hover: #2A2B32;
  --chatgpt-text-primary: #ECECF1;
  --chatgpt-text-secondary: #C5C5D2;
  --chatgpt-border-color: #565869;
  --chatgpt-code-bg: #1E1E28;
  --chatgpt-accent-color: #10A37F;
  --chatgpt-avatar-user: #5437DB;
  --chatgpt-avatar-bot: #10A37F;
}

/* Main background */
.chatgpt-theme body,
.chatgpt-theme #app,
.chatgpt-theme main,
.chatgpt-theme .main-content {
  background-color: var(--chatgpt-bg-main) !important;
  color: var(--chatgpt-text-primary) !important;
}

/* Sidebar */
.chatgpt-theme .sidebar,
.chatgpt-theme nav,
.chatgpt-theme aside {
  background-color: var(--chatgpt-bg-sidebar) !important;
  color: var(--chatgpt-text-primary) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

/* Chat container */
.chatgpt-theme .chat-container,
.chatgpt-theme .messages-container,
.chatgpt-theme .conversation-container {
  background-color: var(--chatgpt-bg-main) !important;
}

/* User message */
.chatgpt-theme .user-message,
.chatgpt-theme .human-message,
.chatgpt-theme .user-message-container,
.chatgpt-theme div[data-sender="user"] {
  background-color: var(--chatgpt-bg-user-message) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* Assistant message */
.chatgpt-theme .assistant-message,
.chatgpt-theme .bot-message,
.chatgpt-theme .assistant-message-container,
.chatgpt-theme div[data-sender="assistant"] {
  background-color: var(--chatgpt-bg-bot-message) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* Input area */
.chatgpt-theme .input-area,
.chatgpt-theme .prompt-input,
.chatgpt-theme textarea,
.chatgpt-theme input[type="text"] {
  background-color: var(--chatgpt-bg-input) !important;
  border-color: var(--chatgpt-border-color) !important;
  color: var(--chatgpt-text-primary) !important;
}

.chatgpt-theme .input-container,
.chatgpt-theme .input-footer {
  background-color: var(--chatgpt-bg-main) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* Buttons and interactive elements */
.chatgpt-theme button,
.chatgpt-theme .button {
  background-color: var(--chatgpt-bg-input) !important;
  color: var(--chatgpt-text-primary) !important;
  border-color: var(--chatgpt-border-color) !important;
}

.chatgpt-theme button:hover,
.chatgpt-theme .button:hover {
  background-color: var(--chatgpt-bg-hover) !important;
}

.chatgpt-theme button.primary,
.chatgpt-theme .button.primary {
  background-color: var(--chatgpt-accent-color) !important;
  color: white !important;
}

/* Conversation history items */
.chatgpt-theme .conversation-item,
.chatgpt-theme .history-item,
.chatgpt-theme .sidebar-item {
  color: var(--chatgpt-text-primary) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.chatgpt-theme .conversation-item:hover,
.chatgpt-theme .history-item:hover,
.chatgpt-theme .sidebar-item:hover {
  background-color: var(--chatgpt-bg-hover) !important;
}

/* Code blocks */
.chatgpt-theme pre,
.chatgpt-theme code,
.chatgpt-theme .codeblock {
  background-color: var(--chatgpt-code-bg) !important;
  color: var(--chatgpt-text-primary) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important;
}

/* Inline code */
.chatgpt-theme p code,
.chatgpt-theme li code,
.chatgpt-theme span code {
  background-color: var(--chatgpt-code-bg) !important;
  color: var(--chatgpt-text-primary) !important;
  padding: 2px 4px !important;
  border-radius: 4px !important;
}

/* Avatar styling */
.chatgpt-theme .user-avatar,
.chatgpt-theme .avatar[data-sender="user"] {
  background-color: var(--chatgpt-avatar-user) !important;
  color: white !important;
}

.chatgpt-theme .assistant-avatar,
.chatgpt-theme .avatar[data-sender="assistant"] {
  background-color: var(--chatgpt-avatar-bot) !important;
  color: white !important;
}

/* Dialog modals */
.chatgpt-theme .modal,
.chatgpt-theme .dialog,
.chatgpt-theme .popup {
  background-color: var(--chatgpt-bg-main) !important;
  color: var(--chatgpt-text-primary) !important;
  border-color: var(--chatgpt-border-color) !important;
}

/* Scrollbars */
.chatgpt-theme *::-webkit-scrollbar {
  width: 8px !important;
  height: 8px !important;
}

.chatgpt-theme *::-webkit-scrollbar-track {
  background: var(--chatgpt-bg-main) !important;
}

.chatgpt-theme *::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border-radius: 10px !important;
  border: none !important;
}

.chatgpt-theme *::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3) !important;
}

/* Links */
.chatgpt-theme a {
  color: #8ab4f8 !important;
}

.chatgpt-theme a:hover {
  text-decoration: underline !important;
}

/* Headers */
.chatgpt-theme h1,
.chatgpt-theme h2,
.chatgpt-theme h3,
.chatgpt-theme h4,
.chatgpt-theme h5,
.chatgpt-theme h6 {
  color: var(--chatgpt-text-primary) !important;
}

/* Additional UI elements that may need styling */
.chatgpt-theme .dropdown-menu,
.chatgpt-theme .select-menu {
  background-color: var(--chatgpt-bg-sidebar) !important;
  color: var(--chatgpt-text-primary) !important;
  border-color: var(--chatgpt-border-color) !important;
}

.chatgpt-theme .dropdown-item:hover,
.chatgpt-theme .select-item:hover {
  background-color: var(--chatgpt-bg-hover) !important;
}

/* Ensure all text is visible */
.chatgpt-theme * {
  color: var(--chatgpt-text-primary) !important;
}

.chatgpt-theme .text-muted,
.chatgpt-theme .subdued {
  color: var(--chatgpt-text-secondary) !important;
  opacity: 0.8 !important;
}

/* Fix any specific UI components that might need targeted fixes */
.chatgpt-theme .settings-panel,
.chatgpt-theme .preferences-panel {
  background-color: var(--chatgpt-bg-main) !important;
  color: var(--chatgpt-text-primary) !important;
}

/* Ensure form controls are visible */
.chatgpt-theme input[type="checkbox"],
.chatgpt-theme input[type="radio"] {
  border-color: var(--chatgpt-border-color) !important;
}

.chatgpt-theme input[type="checkbox"]:checked,
.chatgpt-theme input[type="radio"]:checked {
  background-color: var(--chatgpt-accent-color) !important;
}

