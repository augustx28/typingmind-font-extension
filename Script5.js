(function () {
  const CONFIG = {
    colors: {
      background: '#000000', // Pure black for OLED
      text: '#FFFFFF', // White text
      secondaryText: '#8E8E93', // Gray secondary text
      border: '#2C2C2E', // Dark gray border
      input: {
        background: '#1C1C1E', // Very dark gray input
        text: '#FFFFFF', // White text
        placeholder: '#8E8E93', // Gray placeholder
      },
      button: {
        primary: '#0A84FF', // Standard blue accent
        hover: '#0066CC', // Darker blue on hover
      },
    },
    spacing: {
      small: '0.5rem',
      medium: '1rem',
      large: '1.5rem'
    },
    borderRadius: {
      small: '0.5rem',
      medium: '1rem',
      large: '1.5rem'
    },
  };

  const SELECTORS = {
    CODE_BLOCKS: 'pre code',
    RESULT_BLOCKS: 'details pre',
    USER_MESSAGE_BLOCK: 'div[data-element-id="user-message"]',
    CHAT_SPACE: '[data-element-id="chat-space-middle-part"]',
  };

  const Utils = {
    debounce: (fn, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
      };
    },
    safe: (fn, context = 'unknown') => {
      try {
        return fn();
      } catch (e) {
        console.error(`Error in ${context}:`, e);
        return null;
      }
    },
    escapeHtml: str => typeof str !== 'string' ? '' : str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;'),
  };

  /* ---------------- Sidebar Dark OLED Theme ---------------- */
  if (!document.getElementById('typingmindDarkOLEDSidebar')) {
    const sidebarStyle = document.createElement('style');
    sidebarStyle.id = 'typingmindDarkOLEDSidebar';
    sidebarStyle.type = 'text/css';
    sidebarStyle.innerHTML = `
      [data-element-id="workspace-bar"],
      [data-element-id="side-bar-background"],
      [data-element-id="sidebar-beginning-part"],
      [data-element-id="sidebar-middle-part"] {
        background-color: #000000 !important;
      }

      [data-element-id="new-chat-button-in-side-bar"] {
        background-color: ${CONFIG.colors.button.primary} !important;
        color: #FFFFFF !important;
      }

      [data-element-id="new-chat-button-in-side-bar"] * {
        color: #FFFFFF !important;
      }

      [data-element-id="search-chats-bar"] {
        background-color: ${CONFIG.colors.input.background} !important;
        color: ${CONFIG.colors.text} !important;
        border: 1px solid ${CONFIG.colors.border} !important;
      }

      [data-element-id="search-chats-bar"][placeholder]::placeholder,
      [data-element-id="search-chats-bar"]::-webkit-input-placeholder,
      [data-element-id="search-chats-bar"]::-moz-placeholder,
      [data-element-id="search-chats-bar"]:-ms-input-placeholder {
        color: ${CONFIG.colors.input.placeholder} !important;
        opacity: 1 !important;
        -webkit-text-fill-color: ${CONFIG.colors.input.placeholder} !important;
      }

      [data-element-id="workspace-bar"] *:not(svg):not(path),
      [data-element-id="side-bar-background"] *:not(svg):not(path) {
        color: ${CONFIG.colors.text} !important;
        opacity: 1 !important;
        --tw-text-opacity: 1 !important;
      }

      [data-element-id="custom-chat-item"]:hover,
      [data-element-id="selected-chat-item"] {
        background-color: rgba(255,255,255,0.05) !important;
      }

      [data-element-id="tag-search-panel"] {
        background-color: #000000 !important;
        border: 1px solid ${CONFIG.colors.border} !important;
        color: ${CONFIG.colors.text} !important;
      }

      [data-element-id="tag-search-panel"] input[type="search"] {
        background-color: ${CONFIG.colors.input.background} !important;
        border: 1px solid ${CONFIG.colors.border} !important;
        color: ${CONFIG.colors.text} !important;
      }

      [data-element-id="tag-search-panel"] input[type="checkbox"] {
        appearance: none !important;
        width: 16px !important;
        height: 16px !important;
        border: 1px solid ${CONFIG.colors.border} !important;
        border-radius: 3px !important;
        background-color: ${CONFIG.colors.input.background} !important;
        position: relative !important;
        cursor: pointer !important;
      }

      [data-element-id="tag-search-panel"] input[type="checkbox"]:checked {
        background-color: ${CONFIG.colors.button.primary} !important;
        border-color: ${CONFIG.colors.button.primary} !important;
      }

      [data-element-id="tag-search-panel"] input[type="checkbox"]:checked::after {
        content: '' !important;
        position: absolute !important;
        left: 5px !important;
        top: 2px !important;
        width: 4px !important;
        height: 8px !important;
        border: solid white !important;
        border-width: 0 2px 2px 0 !important;
        transform: rotate(45deg) !important;
      }

      [data-element-id="workspace-bar"] button span.hover\\:bg-white\\/20:hover,
      [data-element-id="workspace-bar"] button:hover span.text-white\\/70,
      [data-element-id="workspace-profile-button"]:hover {
        background-color: rgba(255,255,255,0.1) !important;
      }

      /* Chat folder and item styling */
      [data-element-id="chat-folder"],
      [data-element-id="folder-header"],
      [data-element-id="folder-children"] {
        background-color: #000000 !important;
        color: ${CONFIG.colors.text} !important;
      }

      /* Scrollbar styling */
      .overflow-auto::-webkit-scrollbar {
        width: 8px !important;
      }

      .overflow-auto::-webkit-scrollbar-track {
        background: #1C1C1E !important;
        border-radius: 4px !important;
      }

      .overflow-auto::-webkit-scrollbar-thumb {
        background: #48484A !important;
        border-radius: 4px !important;
      }

      .overflow-auto::-webkit-scrollbar-thumb:hover {
        background: #636366 !important;
      }
    `;
    document.head.appendChild(sidebarStyle);
  }

  /* ---------------- Main Chat & Content Dark OLED Theme ---------------- */
  const mainStyle = document.createElement('style');
  mainStyle.textContent = `
    body, html {
      background-color: #000000 !important;
    }

    [data-element-id="chat-space-middle-part"],
    [data-element-id="chat-space-beginning-part"],
    [data-element-id="chat-space-end-part"],
    [data-element-id="chat-space"],
    main,
    div[class*="bg-gray-"],
    div[class*="bg-white"],
    .bg-gray-50,
    .bg-white {
      background-color: #000000 !important;
    }

    /* Default text colors */
    p, span, div, h1, h2, h3, h4, h5, h6, li, a, button, input, textarea {
      color: ${CONFIG.colors.text} !important;
    }

    /* Secondary text */
    [class*="text-gray-500"],
    [class*="text-gray-600"],
    .text-xs.text-gray-500,
    .italic.truncate,
    .truncate {
      color: ${CONFIG.colors.secondaryText} !important;
    }

    /* Chat messages */
    [data-element-id="chat-space-middle-part"] .prose.max-w-full *:not(
      pre, pre *, code, code *
    ),
    [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] > div {
      color: ${CONFIG.colors.text} !important;
    }

    [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] {
      margin-left: auto !important;
      margin-right: 0 !important;
      display: block !important;
      max-width: 70% !important;
      border-radius: ${CONFIG.borderRadius.large} !important;
      background-color: ${CONFIG.colors.input.background} !important;
      color: ${CONFIG.colors.text} !important;
      padding: ${CONFIG.spacing.small} !important;
      margin-bottom: ${CONFIG.spacing.small} !important;
    }

    /* Code blocks */
    [data-element-id="chat-space-middle-part"] pre:has(div.relative) {
      background-color: #1C1C1E !important;
      border: 1px solid ${CONFIG.colors.border} !important;
      border-radius: ${CONFIG.borderRadius.small} !important;
    }

    [data-element-id="chat-space-middle-part"] code {
      color: #FF9500 !important;
      background-color: #1C1C1E !important;
    }

    /* Lists */
    [data-element-id="chat-space-middle-part"] .prose.max-w-full li::marker {
      color: ${CONFIG.colors.text} !important;
    }

    /* Tables */
    table, th, td {
      border-color: ${CONFIG.colors.border} !important;
    }

    /* Function call blocks */
    [data-element-id="function-call-block"],
    .w-full.rounded-md.bg-gray-50.p-4 {
      background-color: #1C1C1E !important;
      border: 1px solid ${CONFIG.colors.border} !important;
    }

    /* Buttons - keep standard colors */
    .bg-blue-500,
    .bg-blue-600,
    .bg-blue-700,
    [class*="bg-blue-"],
    button[class*="bg-blue-"],
    a[class*="bg-blue-"] {
      /* Let them keep their original blue colors */
    }

    /* Dialog boxes */
    [role="dialog"],
    [role="menu"] {
      background-color: rgba(0,0,0,0.8) !important;
    }

    [role="dialog"] > div,
    [role="menu"] > div {
      background-color: #1C1C1E !important;
      border: 1px solid ${CONFIG.colors.border} !important;
    }
  `;
  document.head.appendChild(mainStyle);

  /* ---------------- Input Area Dark OLED Theme ---------------- */
  const inputStyle = document.createElement('style');
  inputStyle.textContent = `
    [data-element-id="chat-space-end-part"] {
      background-color: #000000 !important;
    }

    [data-element-id="chat-space-end-part"] [role="presentation"] {
      background-color: ${CONFIG.colors.input.background} !important;
      border-radius: ${CONFIG.borderRadius.large} !important;
      margin-bottom: ${CONFIG.spacing.medium} !important;
      border: 1px solid ${CONFIG.colors.border} !important;
    }

    #chat-input-textbox {
      min-height: 44px !important;
      padding: 0.75rem 1rem !important;
      border-radius: 1.5rem !important;
      color: ${CONFIG.colors.text} !important;
      border: 0 solid ${CONFIG.colors.border} !important;
      outline: none !important;
      margin: 8px 0 !important;
      background-color: ${CONFIG.colors.input.background} !important;
    }

    #chat-input-textbox::placeholder {
      color: ${CONFIG.colors.input.placeholder} !important;
      opacity: 1 !important;
    }

    [data-element-id="chat-input-actions"] button {
      color: ${CONFIG.colors.text} !important;
    }

    [data-element-id="chat-input-actions"] button:hover {
      background-color: rgba(255,255,255,0.1) !important;
      border-radius: 0.5rem !important;
    }

    /* Fix any remaining elements */
    [data-element-id="chat-input"],
    .rounded-xl.border.bg-white,
    .bg-white.rounded-xl.border {
      background-color: ${CONFIG.colors.input.background} !important;
      border-color: ${CONFIG.colors.border} !important;
    }
  `;
  document.head.appendChild(inputStyle);

  /* ---------------- Global Dark OLED Styles ---------------- */
  const globalStyle = document.createElement('style');
  globalStyle.id = 'dark-oled-global';
  globalStyle.textContent = `
    * {
      scrollbar-width: thin;
      scrollbar-color: #48484A #1C1C1E;
    }

    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: #1C1C1E;
    }

    ::-webkit-scrollbar-thumb {
      background: #48484A;
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #636366;
    }
  `;
  document.head.appendChild(globalStyle);

  /* ---------------- Clean up Matrix-specific functionality ---------------- */
  const improveTextDisplay = Utils.debounce(() => {
    // Apply any remaining dark theme fixes
    Utils.safe(() => {
      // Fix remaining white backgrounds
      document.querySelectorAll('[class*="bg-white"], [class*="bg-gray-"]').forEach(el => {
        if (!el.closest('[data-element-id="send-button"]')) {
          el.style.backgroundColor = '#000000';
        }
      });
    }, 'improveTextDisplay');
  }, 100);

  document.addEventListener('DOMContentLoaded', improveTextDisplay);

  new MutationObserver(() => {
    setTimeout(improveTextDisplay, 0);
  }).observe(document.body, { 
    childList: true, 
    subtree: true 
  });

  console.log('Dark OLED theme applied successfully');
})();
