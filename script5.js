(function () {
  const CONFIG = {
    colors: {
      background: '#000000', // Pure black for OLED
      surface: '#111111', // Slightly lighter for surfaces
      text: '#ffffff', // White text
      textSecondary: '#b3b3b3', // Light gray for secondary text
      textMuted: '#888888', // Muted gray for timestamps
      border: '#333333', // Dark gray borders
      input: {
        background: '#1a1a1a', // Dark input background
        text: '#ffffff', // White input text
        placeholder: '#888888', // Gray placeholder
      },
      button: {
        primary: '#2563eb', // Blue primary buttons
        primaryHover: '#3b82f6', // Lighter blue on hover
        secondary: '#374151', // Gray secondary buttons
        secondaryHover: '#4b5563', // Lighter gray on hover
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

  /* ---------------- Sidebar Modifications ---------------- */
  if (!document.getElementById('typingmindSidebarFixDark')) {
    const sidebarStyle = document.createElement('style');
    sidebarStyle.id = 'typingmindSidebarFixDark';
    sidebarStyle.type = 'text/css';
    sidebarStyle.innerHTML = `
      [data-element-id="workspace-bar"],
      [data-element-id="side-bar-background"],
      [data-element-id="sidebar-beginning-part"],
      [data-element-id="sidebar-middle-part"] {
        background-color: ${CONFIG.colors.background} !important;
      }

      [data-element-id="new-chat-button-in-side-bar"] {
        background-color: ${CONFIG.colors.button.primary} !important;
        color: ${CONFIG.colors.text} !important;
      }

      [data-element-id="new-chat-button-in-side-bar"] * {
        color: ${CONFIG.colors.text} !important;
      }

      [data-element-id="search-chats-bar"] {
        background-color: ${CONFIG.colors.input.background} !important;
        color: ${CONFIG.colors.input.text} !important;
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

      [data-element-id="workspace-bar"] *:not(svg):not(path)[class*="text-white"],
      [data-element-id="workspace-bar"] *:not(svg):not(path)[class*="text-white/"],
      [data-element-id="workspace-bar"] *:not(svg):not(path)[class*="text-gray-"],
      [data-element-id="workspace-bar"] *:not(svg):not(path)[class*="dark:text-white"],
      [data-element-id="side-bar-background"] *:not(svg):not(path)[class*="text-white"],
      [data-element-id="side-bar-background"] *:not(svg):not(path)[class*="text-white/"],
      [data-element-id="side-bar-background"] *:not(svg):not(path)[class*="text-gray-"],
      [data-element-id="side-bar-background"] *:not(svg):not(path)[class*="dark:text-white"] {
        color: ${CONFIG.colors.text} !important;
        opacity: 1 !important;
        --tw-text-opacity: 1 !important;
      }

      [data-element-id="custom-chat-item"]:hover,
      [data-element-id="selected-chat-item"] {
        background-color: ${CONFIG.colors.surface} !important;
      }

      [data-element-id="custom-chat-item"] button[aria-label="Delete Chat"],
      [data-element-id="custom-chat-item"] button[aria-label="Favorite Chat"],
      [data-element-id="custom-chat-item"] button[aria-label="Chat settings"],
      [data-element-id="selected-chat-item"] button[aria-label="Delete Chat"],
      [data-element-id="selected-chat-item"] button[aria-label="Favorite Chat"],
      [data-element-id="selected-chat-item"] button[aria-label="Chat settings"] {
        display: none !important;
      }

      [data-element-id="custom-chat-item"]:hover button[aria-label="Delete Chat"],
      [data-element-id="custom-chat-item"]:hover button[aria-label="Favorite Chat"],
      [data-element-id="custom-chat-item"]:hover button[aria-label="Chat settings"],
      [data-element-id="selected-chat-item"]:hover button[aria-label="Delete Chat"],
      [data-element-id="selected-chat-item"]:hover button[aria-label="Favorite Chat"],
      [data-element-id="selected-chat-item"]:hover button[aria-label="Chat settings"],
      [data-element-id="custom-chat-item"] button[aria-expanded="true"],
      [data-element-id="selected-chat-item"] button[aria-expanded="true"] {
        display: inline-block !important;
      }

      #headlessui-portal-root {
        display: block !important;
        visibility: visible !important;
        pointer-events: auto !important;
      }

      #headlessui-portal-root [role="menu"] {
        display: block !important;
        visibility: visible !important;
        background-color: ${CONFIG.colors.surface} !important;
        color: ${CONFIG.colors.text} !important;
        pointer-events: auto !important;
        border: 1px solid ${CONFIG.colors.border} !important;
      }

      #headlessui-portal-root [role="menuitem"] {
        display: flex !important;
        visibility: visible !important;
        pointer-events: auto !important;
        color: ${CONFIG.colors.text} !important;
      }

      [data-element-id="tag-search-panel"] {
        background-color: ${CONFIG.colors.surface} !important;
        border: 1px solid ${CONFIG.colors.border} !important;
        color: ${CONFIG.colors.text} !important;
      }

      [data-element-id="tag-search-panel"] input[type="search"] {
        background-color: ${CONFIG.colors.input.background} !important;
        border: 1px solid ${CONFIG.colors.border} !important;
        color: ${CONFIG.colors.input.text} !important;
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

      [data-element-id="tag-search-panel"] label,
      [data-element-id="tag-search-panel"] p,
      [data-element-id="tag-search-panel"] span,
      [data-element-id="tag-search-panel"] button {
        color: ${CONFIG.colors.text} !important;
      }

      [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar {
        width: 8px !important;
      }

      [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-track {
        background: ${CONFIG.colors.surface} !important;
        border-radius: 4px !important;
      }

      [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-thumb {
        background: ${CONFIG.colors.button.secondary} !important;
        border-radius: 4px !important;
      }

      [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-thumb:hover {
        background: ${CONFIG.colors.button.secondaryHover} !important;
      }

      [data-element-id="tag-search-panel"] .overflow-auto {
        scrollbar-width: thin !important;
        scrollbar-color: ${CONFIG.colors.button.secondary} ${CONFIG.colors.surface} !important;
      }

      [data-element-id="chat-folder"] textarea,
      [data-element-id="custom-chat-item"] textarea,
      [data-element-id="selected-chat-item"] textarea,
      [data-element-id="side-bar-background"] textarea {
        background-color: ${CONFIG.colors.input.background} !important;
        color: ${CONFIG.colors.input.text} !important;
        border: 1px solid ${CONFIG.colors.border} !important;
      }

      [data-element-id="chat-folder"] textarea:focus,
      [data-element-id="custom-chat-item"] textarea:focus,
      [data-element-id="selected-chat-item"] textarea:focus,
      [data-element-id="side-bar-background"] textarea:focus {
        background-color: ${CONFIG.colors.input.background} !important;
        color: ${CONFIG.colors.input.text} !important;
        border-color: ${CONFIG.colors.button.primary} !important;
        box-shadow: 0 0 0 2px rgba(37,99,235,0.2) !important;
      }

      [data-element-id="workspace-bar"] button span.hover\\:bg-white\\/20:hover,
      [data-element-id="workspace-bar"] button:hover span.text-white\\/70,
      [data-element-id="workspace-profile-button"]:hover {
        background-color: rgba(255,255,255,0.1) !important;
      }

      /* SVG icon color fixes */
      [data-element-id="sidebar-beginning-part"] svg *,
      [data-element-id="workspace-bar"] svg *,
      [data-element-id="side-bar-background"] svg * {
        stroke: ${CONFIG.colors.text} !important;
        fill: ${CONFIG.colors.text} !important;
      }

      /* Folder icons and sidebar elements */
      [data-element-id="chat-folder"],
      [data-element-id="folder-header"],
      [data-element-id="folder-children"] {
        background-color: ${CONFIG.colors.background} !important;
        color: ${CONFIG.colors.text} !important;
      }

      /* Chat item titles and text */
      [data-element-id="custom-chat-item"] span,
      [data-element-id="custom-chat-item"] div,
      [data-element-id="selected-chat-item"] span,
      [data-element-id="selected-chat-item"] div {
        color: ${CONFIG.colors.text} !important;
      }
    `;

    document.head.appendChild(sidebarStyle);

    new MutationObserver(() => {
      if (!document.getElementById('typingmindSidebarFixDark'))
        document.head.appendChild(sidebarStyle);
    }).observe(document.body, { childList: true, subtree: true });

    const fixSearchPlaceholder = () => {
      const input = document.querySelector(
        '[data-element-id="search-chats-bar"]'
      );
      if (input && !input.placeholder)
        input.setAttribute('placeholder', 'Search chats');
    };

    document.addEventListener('DOMContentLoaded', fixSearchPlaceholder);
    fixSearchPlaceholder();

    console.log('TypingMind Dark Sidebar loaded.');
  }

  /* ---------------- Main Chat & Input Styles ---------------- */
  const mainStyle = document.createElement('style');
  mainStyle.textContent = `
    body, html {
      background-color: ${CONFIG.colors.background} !important;
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
      background-color: ${CONFIG.colors.background} !important;
    }

    /* Target all text elements to ensure consistent color */
    p, span, div, h1, h2, h3, h4, h5, h6, li, a, button, input, textarea {
      color: ${CONFIG.colors.text} !important;
    }

    /* Target specific gray text classes used in the UI */
    [class*="text-gray-"],
    .text-gray-500,
    .text-gray-600,
    .text-gray-700,
    .text-gray-800,
    .text-gray-900 {
      color: ${CONFIG.colors.textSecondary} !important;
    }

    /* Target timestamps and metadata */
    .text-xs.text-gray-500,
    .italic.truncate,
    .truncate,
    [class*="text-black"] {
      color: ${CONFIG.colors.textMuted} !important;
    }

    [data-element-id="chat-space-middle-part"] .prose.max-w-full *:not(
      pre, pre *, code, code *,
      .flex.items-start.justify-center.flex-col.gap-2 *
    ),
    [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] > div {
      color: ${CONFIG.colors.text} !important;
    }

    [data-element-id="chat-space-middle-part"] .prose.max-w-full,
    [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] {
      color: ${CONFIG.colors.text} !important;
    }

    [data-element-id="chat-space-middle-part"] [data-element-id="response-block"]:has([data-element-id="user-message"]) [data-element-id="chat-avatar-container"] {
      display: none !important;
    }

    [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] {
      margin-left: auto !important;
      margin-right: 0 !important;
      display: block !important;
      max-width: 70% !important;
      border-radius: ${CONFIG.borderRadius.large} !important;
      background-color: ${CONFIG.colors.surface} !important;
      color: ${CONFIG.colors.text} !important;
      padding: ${CONFIG.spacing.medium} !important;
      margin-bottom: ${CONFIG.spacing.small} !important;
      border: 1px solid ${CONFIG.colors.border} !important;
    }

    [data-element-id="chat-space-middle-part"] [data-element-id="user-message"],
    [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] > div {
      background-color: ${CONFIG.colors.surface} !important;
    }

    /* AI message containers */
    [data-element-id="response-block"] {
      background-color: ${CONFIG.colors.background} !important;
    }

    /* Fix main content sections */
    [data-element-id="chat-space-middle-part"] pre:has(div.relative) {
      background-color: ${CONFIG.colors.surface} !important;
      border: 1px solid ${CONFIG.colors.border} !important;
      border-radius: ${CONFIG.borderRadius.small} !important;
    }

    [data-element-id="chat-space-middle-part"] pre.mb-2.overflow-auto.text-sm.border.border-gray-200.rounded.bg-gray-100 {
      background-color: ${CONFIG.colors.surface} !important;
      color: ${CONFIG.colors.text} !important;
      border: 1px solid ${CONFIG.colors.border} !important;
      padding: 8px !important;
      border-radius: 4px !important;
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
      overflow-x: hidden !important;
    }

    [data-element-id="chat-space-middle-part"] pre > div.relative {
      position: relative !important;
    }

    [data-element-id="chat-space-middle-part"] pre > div.relative > div.sticky {
      position: sticky !important;
      top: 0 !important;
      z-index: 10 !important;
      background-color: ${CONFIG.colors.surface} !important;
      border-radius: 0.5rem 0.5rem 0 0 !important;
      border-bottom: 1px solid ${CONFIG.colors.border} !important;
    }

    [data-element-id="chat-space-middle-part"] pre > div.relative > div > pre {
      border: none !important;
      background: transparent !important;
      margin: 0 !important;
      color: ${CONFIG.colors.text} !important;
    }

    [data-element-id="chat-space-middle-part"] [data-element-id="response-block"]:hover {
      background-color: transparent !important;
    }

    /* Lists and markers */
    [data-element-id="chat-space-middle-part"] .prose.max-w-full ul,
    [data-element-id="chat-space-middle-part"] .prose.max-w-full ol {
      margin: 0.5rem 0 !important;
    }

    [data-element-id="chat-space-middle-part"] .prose.max-w-full li {
      margin: 0.3rem 0 !important;
    }

    [data-element-id="chat-space-middle-part"] .prose.max-w-full li::marker {
      color: ${CONFIG.colors.text} !important;
      font-weight: bold !important;
    }

    [data-element-id="chat-space-middle-part"] .prose.max-w-full ul > li {
      list-style-type: disc !important;
      padding-left: 0.5rem !important;
    }

    [data-element-id="chat-space-middle-part"] .prose.max-w-full ol > li {
      list-style-type: decimal !important;
      padding-left: 0.5rem !important;
    }

    /* Code elements */
    [data-element-id="chat-space-middle-part"] code {
      color: #e5e7eb !important;
      background-color: ${CONFIG.colors.surface} !important;
      padding: 0.2em 0.4em !important;
      border-radius: 3px !important;
      border: 1px solid ${CONFIG.colors.border} !important;
    }

    /* Header/nav elements */
    nav, header {
      background-color: ${CONFIG.colors.background} !important;
    }

    /* Table elements */
    table, th, td {
      border-color: ${CONFIG.colors.border} !important;
      background-color: ${CONFIG.colors.background} !important;
    }

    th {
      background-color: ${CONFIG.colors.surface} !important;
    }

    /* Fix any remaining gray backgrounds */
    [class*="bg-gray-"],
    .bg-gray-50,
    .bg-gray-100,
    .bg-gray-200,
    .bg-white {
      background-color: ${CONFIG.colors.background} !important;
    }

    /* Chat history items */
    [data-element-id="chat-history-item"] {
      background-color: ${CONFIG.colors.background} !important;
      color: ${CONFIG.colors.text} !important;
    }

    /* Function call blocks */
    [data-element-id="function-call-block"],
    .w-full.rounded-md.bg-gray-50.p-4 {
      background-color: ${CONFIG.colors.surface} !important;
      border: 1px solid ${CONFIG.colors.border} !important;
    }

    /* Fix the chat message containers */
    [data-element-id="ai-message"] {
      background-color: ${CONFIG.colors.background} !important;
    }

    /* Top navbar */
    [data-element-id="chat-space-beginning-part"] div {
      background-color: ${CONFIG.colors.background} !important;
    }

    /* Keep blue buttons as blue (standard behavior) */
    .bg-blue-500, .bg-blue-600, .bg-blue-700,
    [class*="bg-blue-"], button[class*="bg-blue-"], a[class*="bg-blue-"] {
      background-color: ${CONFIG.colors.button.primary} !important;
      color: white !important;
    }

    .bg-blue-500:hover, .bg-blue-600:hover, .bg-blue-700:hover,
    [class*="bg-blue-"]:hover, button[class*="bg-blue-"]:hover, a[class*="bg-blue-"]:hover {
      background-color: ${CONFIG.colors.button.primaryHover} !important;
    }

    /* Specific fix for the bottom right buttons */
    .fixed.bottom-4.right-4 button,
    .fixed.bottom-0.right-0 button {
      background-color: ${CONFIG.colors.button.primary} !important;
      color: white !important;
    }

    /* Blue links remain blue */
    a[class*="text-blue-"], button[class*="text-blue-"], [class*="text-blue-"] {
      color: ${CONFIG.colors.button.primary} !important;
    }

    /* Dialogs and modals */
    [role="dialog"], .fixed.inset-0 {
      background-color: rgba(0,0,0,0.8) !important;
    }

    [role="dialog"] > div {
      background-color: ${CONFIG.colors.surface} !important;
      border: 1px solid ${CONFIG.colors.border} !important;
    }
  `;

  document.head.appendChild(mainStyle);

  const inputStyle = document.createElement('style');
  inputStyle.textContent = `
    [data-element-id="chat-space-end-part"] {
      background-color: ${CONFIG.colors.background} !important;
    }

    [data-element-id="chat-space-end-part"] [role="presentation"] {
      background-color: ${CONFIG.colors.input.background};
      border-radius: ${CONFIG.borderRadius.large};
      margin-bottom: ${CONFIG.spacing.medium};
      border: 1px solid ${CONFIG.colors.border} !important;
    }

    #chat-input-textbox {
      min-height: 44px !important;
      padding: 0.75rem 1rem !important;
      border-radius: 1.5rem !important;
      color: ${CONFIG.colors.input.text} !important;
      border: 0 solid ${CONFIG.colors.border} !important;
      outline: none !important;
      margin: 8px 0 !important;
      overflow-wrap: break-word !important;
      tab-size: 4 !important;
      text-size-adjust: 100% !important;
      white-space: pre-wrap !important;
      font-variant-ligatures: none !important;
      -webkit-tap-highlight-color: transparent !important;
      background-color: ${CONFIG.colors.input.background} !important;
    }

    #chat-input-textbox::placeholder {
      color: ${CONFIG.colors.input.placeholder} !important;
      opacity: 1 !important;
    }

    [data-element-id="chat-input-actions"] button:not([data-element-id="send-button"]):not([data-element-id="more-options-button"]):not([data-element-id="replace-only-button"]) {
      transition: all 0.2s ease !important;
      color: ${CONFIG.colors.textSecondary} !important;
    }

    [data-element-id="chat-input-actions"] button:not([data-element-id="send-button"]):not([data-element-id="more-options-button"]):not([data-element-id="replace-only-button"]):hover {
      background-color: rgba(255,255,255,0.1) !important;
      border-radius: 0.5rem !important;
    }

    [data-element-id="chat-input-actions"] {
      padding: 0.5rem 0.75rem !important;
    }

    [data-element-id="send-button"],
    [data-element-id="more-options-button"] {
      background-color: ${CONFIG.colors.button.primary} !important;
      border-color: ${CONFIG.colors.button.primary} !important;
      color: white !important;
    }

    [data-element-id="send-button"]:hover,
    [data-element-id="more-options-button"]:hover {
      background-color: ${CONFIG.colors.button.primaryHover} !important;
      border-color: ${CONFIG.colors.button.primaryHover} !important;
    }

    /* Fix any remaining input area styling */
    [data-element-id="chat-input"],
    .rounded-xl.border.bg-white,
    .bg-white.rounded-xl.border {
      background-color: ${CONFIG.colors.input.background} !important;
      border-color: ${CONFIG.colors.border} !important;
    }

    /* Bottom toolbar */
    [data-element-id="chat-space-end-part"] {
      background-color: ${CONFIG.colors.background} !important;
    }
  `;

  document.head.appendChild(inputStyle);

  /* ---------------- Text Parsing & Code Block Handling ---------------- */
  const multiStepParse = txt => Utils.safe(() => {
    let res = txt;
    
    res = res.replace(
      /```(\w+)?\s*([\s\S]*?)\s*```/g,
      (_, lang, code) => {
        lang = lang ? lang.toLowerCase() : '';
        return `<pre style="background:${CONFIG.colors.surface}; border:1px solid ${CONFIG.colors.border}; padding:12px; border-radius:${CONFIG.borderRadius.small}; overflow-x:auto; margin:8px 0;" class="code-block${lang ? ' language-' + lang : ''}"><code style="white-space:pre; display:block; overflow-wrap:normal; word-break:normal; color:#e5e7eb; font-family:monospace;">${code}</code></pre>`;
      }
    );

    res = res.replace(
      /`([^`]+)`/g,
      (_, inline) =>
        `<code style="background-color:${CONFIG.colors.surface}; color:#e5e7eb; padding:0.2em 0.4em; border-radius:3px; border:1px solid ${CONFIG.colors.border};">${inline}</code>`
    );

    res = res.replace(
      /&#039;([^&#]+)&#039;/g,
      (_, content) =>
        `<code style="background-color:${CONFIG.colors.surface}; color:#e5e7eb; padding:0.2em 0.4em; border-radius:3px; border:1px solid ${CONFIG.colors.border};">${content}</code>`
    );

    return res;
  }, 'multiStepParse');

  const processMessageContent = safeTxt => Utils.safe(() => {
    const tests = [];
    let proc = safeTxt.replace(
      /(&lt;test&gt;)([\s\S]*?)(&lt;\/test&gt;)/g,
      (m, open, inner, close) => {
        const ph = `__TEST_${tests.length}__`;
        tests.push({ open, inner, close });
        return ph;
      }
    );

    proc = multiStepParse(proc);

    tests.forEach(({ open, inner, close }, i) => {
      const parsed = multiStepParse(inner);
      proc = proc.replace(
        `__TEST_${i}__`,
        `${open}<code style="background-color:${CONFIG.colors.surface}; color:#e5e7eb; padding:0.2em 0.4em; border-radius:3px; border:1px solid ${CONFIG.colors.border};">${parsed}</code>${close}`
      );
    });

    return proc;
  }, 'processMessageContent');

  const styleUserMessageEl = msgEl => Utils.safe(() => {
    msgEl.setAttribute('data-processed', 'true');
    const raw = msgEl.textContent || '';
    if (!/[<`']/.test(raw)) return
