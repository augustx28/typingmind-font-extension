(function () {
  // --- Configuration for OLED Dark Theme ---
  const OLED_THEME_CONFIG = {
    colors: {
      background: '#000000',        // True black for OLED
      text: '#E0E0E0',              // Light gray for main text
      textMedium: '#B0B0B0',        // Medium gray for secondary text
      textDim: '#888888',           // Dimmer text for less important info/placeholders
      border: '#282828',            // Subtle dark gray borders
      inputBackground: '#0D0D0D',   // Very dark gray, slightly off-black for inputs
      buttonPrimaryBackground: '#1A1A1A', // Primary button background
      buttonPrimaryHover: '#2A2A2A',   // Primary button hover
      accentBackground: '#1F1F1F',  // Background for selected/hovered items
      codeBackground: '#0A0A0A',    // Near black for code blocks
      codeText: '#C5C5C5',          // Light gray for code text
      scrollbarThumb: '#404040',
      scrollbarTrack: '#101010',
    },
    borderRadius: { // Using more standard border radii
      small: '4px',
      medium: '6px',
      large: '8px',
    },
    spacing: { // Standard spacing units
      small: '0.5rem',
      medium: '1rem',
      large: '1.5rem'
    }
  };

  // --- Attempt to Remove Old Matrix Theme Styles ---
  // This helps ensure a cleaner slate for the new theme.
  const matrixStyleIDs = ['typingmindSidebarFixMerged', 'matrix-global-fix'];
  matrixStyleIDs.forEach(id => {
    const styleElement = document.getElementById(id);
    if (styleElement) {
      styleElement.remove();
      console.log(`Removed old style: ${id}`);
    }
  });

  // --- Create and Inject New OLED Theme Styles ---
  const oledThemeStyle = document.createElement('style');
  oledThemeStyle.id = 'typingmind-oled-dark-theme';
  oledThemeStyle.type = 'text/css';

  // Helper for common !important properties
  const important = (value) => `${value} !important`;

  oledThemeStyle.innerHTML = `
    /* --- Global OLED Styles --- */
    body, html {
      background-color: ${important(OLED_THEME_CONFIG.colors.background)};
      color: ${important(OLED_THEME_CONFIG.colors.text)};
    }

    /* --- General Element Styling --- */
    p, span, div, h1, h2, h3, h4, h5, h6, li, a, th, td {
      color: inherit !important; /* Inherit from body or parent */
    }

    /* Remove Matrix animations */
    * {
      animation: none ${important('none')};
      text-shadow: none ${important('none')};
    }

    /* --- Scrollbar Styling --- */
    * {
      scrollbar-width: thin ${important('thin')};
      scrollbar-color: ${important(OLED_THEME_CONFIG.colors.scrollbarThumb + ' ' + OLED_THEME_CONFIG.colors.scrollbarTrack)};
    }
    ::-webkit-scrollbar {
      width: 8px ${important('8px')};
      height: 8px ${important('8px')};
    }
    ::-webkit-scrollbar-track {
      background: ${important(OLED_THEME_CONFIG.colors.scrollbarTrack)};
    }
    ::-webkit-scrollbar-thumb {
      background: ${important(OLED_THEME_CONFIG.colors.scrollbarThumb)};
      border-radius: 4px ${important('4px')};
    }
    ::-webkit-scrollbar-thumb:hover {
      background: ${important(OLED_THEME_CONFIG.colors.accentBackground)};
    }

    /* --- Sidebar Modifications --- */
    [data-element-id="workspace-bar"],
    [data-element-id="side-bar-background"],
    [data-element-id="sidebar-beginning-part"],
    [data-element-id="sidebar-middle-part"] {
      background-color: ${important(OLED_THEME_CONFIG.colors.background)};
    }

    [data-element-id="new-chat-button-in-side-bar"] {
      background-color: ${important(OLED_THEME_CONFIG.colors.buttonPrimaryBackground)};
      color: ${important(OLED_THEME_CONFIG.colors.text)};
      border: 1px solid ${important(OLED_THEME_CONFIG.colors.border)};
    }
    [data-element-id="new-chat-button-in-side-bar"]:hover {
      background-color: ${important(OLED_THEME_CONFIG.colors.buttonPrimaryHover)};
    }
    [data-element-id="new-chat-button-in-side-bar"] * {
      color: ${important(OLED_THEME_CONFIG.colors.text)};
    }

    [data-element-id="search-chats-bar"] {
      background-color: ${important(OLED_THEME_CONFIG.colors.inputBackground)};
      color: ${important(OLED_THEME_CONFIG.colors.text)};
      border: 1px solid ${important(OLED_THEME_CONFIG.colors.border)};
    }
    [data-element-id="search-chats-bar"]::placeholder {
      color: ${important(OLED_THEME_CONFIG.colors.textDim)};
      opacity: 1 ${important('1')};
      -webkit-text-fill-color: ${important(OLED_THEME_CONFIG.colors.textDim)};
    }

    [data-element-id="workspace-bar"] *:not(svg):not(path),
    [data-element-id="side-bar-background"] *:not(svg):not(path) {
      color: ${important(OLED_THEME_CONFIG.colors.textMedium)};
    }
    [data-element-id="workspace-bar"] *:not(svg):not(path):hover,
    [data-element-id="side-bar-background"] *:not(svg):not(path):hover {
      color: ${important(OLED_THEME_CONFIG.colors.text)};
    }

    [data-element-id="custom-chat-item"]:hover,
    [data-element-id="selected-chat-item"] {
      background-color: ${important(OLED_THEME_CONFIG.colors.accentBackground)};
    }

    /* Ensuring visibility of chat item buttons on hover (default behavior) */
    [data-element-id="custom-chat-item"] button,
    [data-element-id="selected-chat-item"] button {
      display: inline-block ${important('inline-block')}; /* Or as per TypingMind's default */
    }

    /* Menus and Dialogs */
    #headlessui-portal-root [role="menu"], [role="dialog"] > div {
      background-color: ${important(OLED_THEME_CONFIG.colors.inputBackground)};
      color: ${important(OLED_THEME_CONFIG.colors.text)};
      border: 1px solid ${important(OLED_THEME_CONFIG.colors.border)};
    }
    #headlessui-portal-root [role="menuitem"]:hover {
       background-color: ${important(OLED_THEME_CONFIG.colors.accentBackground)};
    }
    .fixed.inset-0 { /* Dialog overlay */
        background-color: rgba(0,0,0,0.7) ${important('rgba(0,0,0,0.7)')};
    }


    /* --- Main Chat & Input Styles --- */
    [data-element-id="chat-space-middle-part"],
    [data-element-id="chat-space-beginning-part"],
    [data-element-id="chat-space-end-part"],
    [data-element-id="chat-space"], main,
    div[class*="bg-gray-"], div[class*="bg-white"] { /* Catch-all for default light backgrounds */
      background-color: ${important(OLED_THEME_CONFIG.colors.background)};
    }

    /* General text color in chat (user and AI messages) */
    [data-element-id="chat-space-middle-part"] .prose.max-w-full *:not(pre):not(code),
    [data-element-id="user-message"] div,
    [data-element-id="ai-message"] div {
      color: ${important(OLED_THEME_CONFIG.colors.text)};
    }

    /* User message bubble */
    [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] {
      background-color: ${important(OLED_THEME_CONFIG.colors.inputBackground)};
      color: ${important(OLED_THEME_CONFIG.colors.text)};
      border-radius: ${important(OLED_THEME_CONFIG.borderRadius.large)};
      /* Adjust margin/padding if needed, or let TypingMind handle it */
    }

    /* Code Blocks */
    pre, [data-element-id="chat-space-middle-part"] pre, pre code {
      background-color: ${important(OLED_THEME_CONFIG.colors.codeBackground)};
      color: ${important(OLED_THEME_CONFIG.colors.codeText)};
      border: 1px solid ${important(OLED_THEME_CONFIG.colors.border)};
      border-radius: ${important(OLED_THEME_CONFIG.borderRadius.small)};
      white-space: pre-wrap ${important('pre-wrap')};
      word-wrap: break-word ${important('break-word')};
    }
    [data-element-id="chat-space-middle-part"] code:not(pre code) { /* Inline code */
      background-color: ${important(OLED_THEME_CONFIG.colors.codeBackground)};
      color: ${important(OLED_THEME_CONFIG.colors.codeText)};
      padding: 0.2em 0.4em ${important('0.2em 0.4em')};
      border-radius: 3px ${important('3px')};
    }

    /* Input Area */
    [data-element-id="chat-space-end-part"],
    [data-element-id="chat-input"] {
      background-color: ${important(OLED_THEME_CONFIG.colors.background)};
      border-top: 1px solid ${important(OLED_THEME_CONFIG.colors.border)};
    }
    #chat-input-textbox {
      background-color: ${important(OLED_THEME_CONFIG.colors.inputBackground)};
      color: ${important(OLED_THEME_CONFIG.colors.text)};
      border: 1px solid ${important(OLED_THEME_CONFIG.colors.border)};
      border-radius: ${important(OLED_THEME_CONFIG.borderRadius.large)};
    }
    #chat-input-textbox::placeholder {
      color: ${important(OLED_THEME_CONFIG.colors.textDim)};
      opacity: 1 ${important('1')};
    }

    /* Buttons (general, send, etc.) */
    button, input[type="button"], input[type="submit"] {
      background-color: ${important(OLED_THEME_CONFIG.colors.buttonPrimaryBackground)};
      color: ${important(OLED_THEME_CONFIG.colors.text)};
      border: 1px solid ${important(OLED_THEME_CONFIG.colors.border)};
      border-radius: ${important(OLED_THEME_CONFIG.borderRadius.medium)};
      padding: ${OLED_THEME_CONFIG.spacing.small} ${OLED_THEME_CONFIG.spacing.medium} ${important('')};
    }
    button:hover, input[type="button"]:hover, input[type="submit"]:hover {
      background-color: ${important(OLED_THEME_CONFIG.colors.buttonPrimaryHover)};
      border-color: ${important(OLED_THEME_CONFIG.colors.accentBackground)};
    }
    [data-element-id="send-button"], [data-element-id="more-options-button"] {
       /* Potentially more specific styling if needed */
    }

    /* Override any lingering blue/gray default buttons/links */
    .bg-blue-500, .bg-blue-600, [class*="bg-blue-"],
    .text-blue-500, .text-blue-600, [class*="text-blue-"] {
      background-color: ${important(OLED_THEME_CONFIG.colors.buttonPrimaryBackground)} !important;
      color: ${important(OLED_THEME_CONFIG.colors.text)} !important;
      border: 1px solid ${important(OLED_THEME_CONFIG.colors.border)} !important;
    }
    .bg-blue-500:hover, .bg-blue-600:hover, [class*="bg-blue-"]:hover {
      background-color: ${important(OLED_THEME_CONFIG.colors.buttonPrimaryHover)} !important;
    }

    /* SVG Icon Colors */
    svg {
      fill: ${important(OLED_THEME_CONFIG.colors.textMedium)};
    }
    button svg, a svg {
      fill: ${important(OLED_THEME_CONFIG.colors.textMedium)}; /* Or match button text */
    }
    button:hover svg, a:hover svg {
      fill: ${important(OLED_THEME_CONFIG.colors.text)};
    }

    /* Fallback for any other backgrounds or text that were missed */
    [class*="bg-gray-"], [class*="bg-white"] {
        background-color: ${important(OLED_THEME_CONFIG.colors.background)};
    }
    [class*="text-gray-"], [class*="text-black"] { /* Exclude white already set */
        color: ${important(OLED_THEME_CONFIG.colors.textMedium)};
    }
    [class*="border-gray-"] {
        border-color: ${important(OLED_THEME_CONFIG.colors.border)};
    }

    /* Model selector dropdown and other similar UI elements */
    [data-element-id="model-selector-trigger"], [data-element-id="prompt-library-trigger"], [data-element-id="ai-profile-trigger"] {
        background-color: ${important(OLED_THEME_CONFIG.colors.inputBackground)};
        border: 1px solid ${important(OLED_THEME_CONFIG.colors.border)};
        color: ${important(OLED_THEME_CONFIG.colors.textMedium)};
    }
    [data-element-id="model-selector-trigger"]:hover, [data-element-id="prompt-library-trigger"]:hover, [data-element-id="ai-profile-trigger"]:hover {
        background-color: ${important(OLED_THEME_CONFIG.colors.accentBackground)};
        color: ${important(OLED_THEME_CONFIG.colors.text)};
    }

  `;
  document.head.appendChild(oledThemeStyle);

  // --- MutationObserver to re-apply styles if DOM changes dynamically ---
  // This is a simplified observer. The Matrix theme had a more complex one.
  // For a theme change, this might not be strictly necessary if initial styles are robust,
  // but can help if TypingMind dynamically adds/removes classes or elements without retaining styles.
  const observer = new MutationObserver(() => {
    // Check if our style tag is still present
    if (!document.getElementById('typingmind-oled-dark-theme')) {
      document.head.appendChild(oledThemeStyle);
      console.log('OLED Dark Theme re-applied due to DOM change.');
    }
    // You could add more specific checks here if certain elements lose styling
  });

  observer.observe(document.body, { childList: true, subtree: true });

  console.log('TypingMind OLED Dark Theme applied. Matrix theme elements should be overridden.');

})();
