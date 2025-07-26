/**
 * Claude AI Dark Theme for TypingMind
 * A minimalist dark mode theme inspired by Claude AI's interface.
 * This version applies ONLY the dark mode colors and leaves all other
 * styling (typography, layout, fonts, etc.) to TypingMind's default.
 */

(function() {
    'use strict';

    // Configuration for Dark Mode Colors
    const CONFIG = {
        colors: {
            // Main accent colors
            primary: '#d97449',
            primaryHover: '#c4653f',
            primaryLight: '#d9744920',

            // Dark mode backgrounds
            darkMainBg: '#2f2f2f',
            darkSidebarBg: '#171717',
            darkWorkspaceBg: '#1a1a1a',
            darkCardBg: '#262626',

            // Dark mode text colors
            darkTextPrimary: '#e8e8e8',
            darkTextSecondary: '#a3a3a3',
            darkTextMuted: '#737373',

            // Dark mode borders
            darkBorder: '#404040',
            darkBorderHover: '#525252',
        }
    };

    // Selectors for different TypingMind elements
    const SELECTORS = {
        // Main structure
        body: 'body',
        mainContainer: '#__next',
        customTheme: '.custom-theme',
        
        // Sidebar and navigation
        sidebarBackground: '[data-element-id="side-bar-background"]',
        sidebarBeginning: '[data-element-id="sidebar-beginning-part"]',
        workspaceBar: '[data-element-id="workspace-bar"]',
        navContainer: '[data-element-id="nav-container"]',
        
        // Buttons and interactive elements
        newChatButton: '[data-element-id="new-chat-button-in-side-bar"]',
        workspaceTabChat: '[data-element-id="workspace-tab-chat"]',
        workspaceTabAgents: '[data-element-id="workspace-tab-agents"]',
        workspaceTabPrompts: '[data-element-id="workspace-tab-prompts"]',
        workspaceTabPlugins: '[data-element-id="workspace-tab-plugins"]',
        workspaceTabModels: '[data-element-id="workspace-tab-models"]',
        workspaceTabTeams: '[data-element-id="workspace-tab-teams"]',
        workspaceTabSettings: '[data-element-id="workspace-tab-settings"]',
        userProfileButton: '[data-element-id="workspace-profile-button"]',
        userProfileImage: '[data-element-id="user-profile-image"]',
        
        // Chat and messages
        chatContainer: '[data-element-id="chat-container"]',
        messageUser: '[data-element-id="user-message"]',
        messageAssistant: '[data-element-id="message-assistant"]',
        messageContainer: '[data-element-id="message-container"]',
        
        // Input area
        inputContainer: '[data-element-id="input-container"]',
        inputTextarea: '[data-element-id="input-textarea"]',
        sendButton: '[data-element-id="send-button"]',
        regenerateButton: '[data-element-id="regenerate-button"]',
        searchChatsBar: '[data-element-id="search-chats-bar"]',
        tagSearchPanel: '[data-element-id="tag-search-panel"]',
        customChatItem: '[data-element-id="custom-chat-item"]',
        
        // Common elements
        button: 'button',
        input: 'input',
        textarea: 'textarea',
        select: 'select',
        
        // Generic classes
        card: '.card',
        modal: '.modal',
        dropdown: '.dropdown',
        tooltip: '.tooltip',
    };

    /**
     * Injects the generated CSS styles into the document's head.
     * @param {string} styles - The CSS rules to inject.
     */
    function injectStyles(styles) {
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.id = 'claude-ai-dark-theme-styles';
        styleSheet.textContent = styles;

        const existingStyles = document.getElementById('claude-ai-dark-theme-styles');
        if (existingStyles) {
            existingStyles.remove();
        }

        document.head.appendChild(styleSheet);
    }

    /**
     * Generates the CSS string containing all the dark mode color overrides.
     * @returns {string} The complete CSS for the theme.
     */
    function generateThemeStyles() {
        return `
            /* Claude AI Dark Theme - Custom CSS Variables */
            .dark {
                --claude-primary: ${CONFIG.colors.primary};
                --claude-primary-hover: ${CONFIG.colors.primaryHover};
                --claude-primary-light: ${CONFIG.colors.primaryLight};
                --claude-main-bg: ${CONFIG.colors.darkMainBg};
                --claude-sidebar-bg: ${CONFIG.colors.darkSidebarBg};
                --claude-workspace-bg: ${CONFIG.colors.darkWorkspaceBg};
                --claude-card-bg: ${CONFIG.colors.darkCardBg};
                --claude-text-primary: ${CONFIG.colors.darkTextPrimary};
                --claude-text-secondary: ${CONFIG.colors.darkTextSecondary};
                --claude-text-muted: ${CONFIG.colors.darkTextMuted};
                --claude-border: ${CONFIG.colors.darkBorder};
                --claude-border-hover: ${CONFIG.colors.darkBorderHover};
            }

            /* Override TypingMind's default dark mode variables */
            body.dark {
                --main-dark-color: var(--claude-main-bg) !important;
                --sidebar-color: var(--claude-sidebar-bg) !important;
                --sidebar-menu-color: var(--claude-workspace-bg) !important;
                --workspace-color: var(--claude-workspace-bg) !important;
                --popup-color: var(--claude-card-bg) !important;
                --main-dark-popup-color: var(--claude-card-bg) !important;
                background-color: var(--claude-main-bg) !important;
                color: var(--claude-text-primary) !important;
            }

            /* --- Element-specific color overrides for Dark Mode --- */

            /* Sidebar */
            .dark ${SELECTORS.sidebarBackground} { background-color: var(--claude-sidebar-bg) !important; border-right: 1px solid var(--claude-border) !important; }
            .dark ${SELECTORS.sidebarBeginning} { background-color: var(--claude-workspace-bg) !important; }
            .dark ${SELECTORS.workspaceBar} { background-color: var(--claude-workspace-bg) !important; }

            /* Buttons */
            .dark ${SELECTORS.newChatButton} { background-color: var(--claude-primary) !important; color: white !important; border: none !important; }
            .dark ${SELECTORS.newChatButton}:hover { background-color: var(--claude-primary-hover) !important; }

            /* Workspace Tabs */
            .dark ${SELECTORS.workspaceTabChat} span, .dark ${SELECTORS.workspaceTabAgents} span, .dark ${SELECTORS.workspaceTabPrompts} span, .dark ${SELECTORS.workspaceTabPlugins} span, .dark ${SELECTORS.workspaceTabModels} span, .dark ${SELECTORS.workspaceTabTeams} span, .dark ${SELECTORS.workspaceTabSettings} span { color: var(--claude-text-secondary) !important; }
            .dark ${SELECTORS.workspaceTabChat} span:hover, .dark ${SELECTORS.workspaceTabAgents} span:hover, .dark ${SELECTORS.workspaceTabPrompts} span:hover, .dark ${SELECTORS.workspaceTabPlugins} span:hover, .dark ${SELECTORS.workspaceTabModels} span:hover, .dark ${SELECTORS.workspaceTabTeams} span:hover, .dark ${SELECTORS.workspaceTabSettings} span:hover { background-color: var(--claude-primary-light) !important; color: var(--claude-text-primary) !important; }
            .dark ${SELECTORS.workspaceTabChat} span.bg-white\\/20, .dark ${SELECTORS.workspaceTabChat} span.text-white { background-color: var(--claude-primary) !important; color: white !important; }

            /* User Profile */
            .dark ${SELECTORS.userProfileButton}:hover { background-color: var(--claude-primary-light) !important; }
            .dark ${SELECTORS.userProfileImage} { border: 2px solid var(--claude-border) !important; }

            /* Chat Area */
            .dark ${SELECTORS.chatContainer} { background-color: var(--claude-main-bg) !important; color: var(--claude-text-primary) !important; }
            .dark ${SELECTORS.messageUser} { background-color: var(--claude-sidebar-bg) !important; color: var(--claude-text-primary) !important; border: 1px solid var(--claude-border) !important; }
            .dark ${SELECTORS.messageUser}.bg-blue-600, .dark ${SELECTORS.messageUser}[class*="bg-blue-600"] { background-color: var(--claude-sidebar-bg) !important; color: var(--claude-text-primary) !important; border-color: var(--claude-border) !important; }
            .dark ${SELECTORS.messageUser}.bg-blue-600:hover, .dark ${SELECTORS.messageUser}[class*="bg-blue-600"]:hover, .dark ${SELECTORS.messageUser}:hover { background-color: var(--claude-sidebar-bg) !important; color: var(--claude-text-primary) !important; border-color: var(--claude-border) !important; }
            .dark ${SELECTORS.messageAssistant} { background-color: var(--claude-card-bg) !important; border: 1px solid var(--claude-border) !important; }

            /* Input Area */
            .dark ${SELECTORS.inputContainer} { background-color: var(--claude-card-bg) !important; border: 1px solid var(--claude-border) !important; }
            .dark ${SELECTORS.inputTextarea} { background-color: transparent !important; border: none !important; color: var(--claude-text-primary) !important; }
            .dark ${SELECTORS.inputTextarea}:focus { outline: none !important; box-shadow: 0 0 0 2px var(--claude-primary-light) !important; }
            .dark ${SELECTORS.sendButton} { background-color: var(--claude-primary) !important; color: white !important; border: none !important; }
            .dark ${SELECTORS.sendButton}:hover { background-color: var(--claude-primary-hover) !important; }

            /* Regenerate Button */
            .dark ${SELECTORS.regenerateButton} { background-color: var(--claude-primary) !important; color: white !important; border: none !important; cursor: pointer !important; }
            .dark ${SELECTORS.regenerateButton}:hover { background-color: var(--claude-primary-hover) !important; }

            /* Search */
            .dark ${SELECTORS.searchChatsBar} { background-color: var(--claude-sidebar-bg) !important; color: var(--claude-text-primary) !important; }
            .dark ${SELECTORS.searchChatsBar}::placeholder { color: var(--claude-text-muted) !important; }
            .dark ${SELECTORS.searchChatsBar} + span, .dark ${SELECTORS.searchChatsBar} ~ button { color: var(--claude-text-muted) !important; }
            .dark ${SELECTORS.searchChatsBar} + span svg, .dark ${SELECTORS.searchChatsBar} ~ button svg { color: var(--claude-text-muted) !important; }

            /* Tag Search Panel */
            .dark ${SELECTORS.tagSearchPanel} { background-color: var(--claude-card-bg) !important; border: 1px solid var(--claude-border) !important; }
            .dark ${SELECTORS.tagSearchPanel}.bg-gray-600, .dark ${SELECTORS.tagSearchPanel}[class*="bg-gray-600"] { background-color: var(--claude-card-bg) !important; border: 1px solid var(--claude-border) !important; }
            .dark ${SELECTORS.tagSearchPanel} label { color: var(--claude-text-primary) !important; }
            .dark ${SELECTORS.tagSearchPanel} input { background-color: var(--claude-sidebar-bg) !important; color: var(--claude-text-primary) !important; border: 1px solid var(--claude-border) !important; }
            .dark ${SELECTORS.tagSearchPanel} input::placeholder { color: var(--claude-text-muted) !important; }
            .dark ${SELECTORS.tagSearchPanel} p { color: var(--claude-text-secondary) !important; }
            .dark ${SELECTORS.tagSearchPanel} button:first-child { background-color: transparent !important; color: var(--claude-primary) !important; border: none !important; }
            .dark ${SELECTORS.tagSearchPanel} button:first-child:hover { background-color: var(--claude-primary-light) !important; color: var(--claude-primary-hover) !important; }
            .dark ${SELECTORS.tagSearchPanel} button:nth-child(2) { background-color: transparent !important; color: var(--claude-text-primary) !important; border: 1px solid var(--claude-border) !important; }
            .dark ${SELECTORS.tagSearchPanel} button:nth-child(2):hover { background-color: var(--claude-sidebar-bg) !important; border-color: var(--claude-border-hover) !important; }
            .dark ${SELECTORS.tagSearchPanel} button:last-child { background-color: var(--claude-primary) !important; color: white !important; border: none !important; }
            .dark ${SELECTORS.tagSearchPanel} button:last-child:hover { background-color: var(--claude-primary-hover) !important; }

            /* Chat History Items */
            .dark ${SELECTORS.customChatItem} { color: var(--claude-text-primary) !important; }
            .dark ${SELECTORS.customChatItem}:hover { background-color: var(--claude-sidebar-bg) !important; }
            .dark ${SELECTORS.customChatItem}.bg-blue-600, .dark ${SELECTORS.customChatItem}[class*="bg-blue-600"] { background-color: transparent !important; color: var(--claude-text-primary) !important; border-color: transparent !important; }
            .dark ${SELECTORS.customChatItem}.bg-blue-600:hover, .dark ${SELECTORS.customChatItem}[class*="bg-blue-600"]:hover, .dark ${SELECTORS.customChatItem}:hover { background-color: var(--claude-sidebar-bg) !important; color: var(--claude-text-primary) !important; border-color: transparent !important; }
            .dark ${SELECTORS.customChatItem}:active, .dark ${SELECTORS.customChatItem}[data-selected="true"] { background-color: var(--claude-primary-light) !important; }
            .dark ${SELECTORS.customChatItem} button { color: var(--claude-text-secondary) !important; }
            .dark ${SELECTORS.customChatItem} button:hover { background-color: var(--claude-primary-light) !important; color: var(--claude-text-primary) !important; }
            .dark ${SELECTORS.customChatItem} input[type="checkbox"] { background-color: var(--claude-card-bg) !important; border: 1px solid var(--claude-border) !important; color: var(--claude-primary) !important; }
            .dark ${SELECTORS.customChatItem} input[type="checkbox"]:checked { background-color: var(--claude-primary) !important; border-color: var(--claude-primary) !important; }
            .dark ${SELECTORS.customChatItem} input[type="checkbox"]:focus { outline: 2px solid var(--claude-primary-light) !important; outline-offset: 2px !important; }

            /* Global Overrides */
            .dark input[type="checkbox"] { background-color: var(--claude-card-bg) !important; border: 1px solid var(--claude-border) !important; color: var(--claude-primary) !important; }
            .dark input[type="checkbox"]:checked { background-color: var(--claude-primary) !important; border-color: var(--claude-primary) !important; }
            .dark input[type="checkbox"]:focus { outline: 2px solid var(--claude-primary-light) !important; outline-offset: 2px !important; }
            .dark input[type="checkbox"]:hover { border-color: var(--claude-border-hover) !important; }

            .dark button.bg-blue-600, .dark button[class*="bg-blue-600"], .dark .bg-blue-600 { background-color: var(--claude-primary) !important; color: white !important; border-color: var(--claude-primary) !important; }
            .dark button.bg-blue-600:hover, .dark button[class*="bg-blue-600"]:hover, .dark .bg-blue-600:hover, .dark button.hover\\:bg-blue-700:hover, .dark button[class*="hover:bg-blue-700"]:hover, .dark .hover\\:bg-blue-700:hover, .dark [data-element-id*="search-action"]:hover { background-color: var(--claude-primary-hover) !important; border-color: var(--claude-primary-hover) !important; }
            .dark button.bg-blue-600:focus, .dark button[class*="bg-blue-600"]:focus, .dark .bg-blue-600:focus, .dark button[class*="focus:ring-blue-"]:focus, .dark .focus\\:ring-blue-500:focus { outline: 2px solid var(--claude-primary-light) !important; outline-offset: 2px !important; }

            .dark input, .dark textarea, .dark select { background-color: var(--claude-card-bg) !important; border: 1px solid var(--claude-border) !important; color: var(--claude-text-primary) !important; }
            .dark input:focus, .dark textarea:focus, .dark select:focus { border-color: var(--claude-primary) !important; box-shadow: 0 0 0 2px var(--claude-primary-light) !important; }

            /* Code blocks */
            .dark code { background-color: var(--claude-sidebar-bg) !important; border: 1px solid var(--claude-border) !important; color: var(--claude-text-primary) !important; }
            .dark pre { background-color: var(--claude-sidebar-bg) !important; border: 1px solid var(--claude-border) !important; }
            .dark pre code { background-color: transparent !important; border: none !important; }

            /* Modals and dropdowns */
            .dark .modal, .dark .dropdown, .dark .tooltip { background-color: var(--claude-card-bg) !important; border: 1px solid var(--claude-border) !important; color: var(--claude-text-primary) !important; }
            .dark .fixed.inset-0.bg-gray-800.bg-opacity-75 { background-color: rgba(0, 0, 0, 0.75) !important; }

            /* Scrollbar */
            .dark ::-webkit-scrollbar-track { background: var(--claude-sidebar-bg) !important; }
            .dark ::-webkit-scrollbar-thumb { background: var(--claude-border) !important; }
            .dark ::-webkit-scrollbar-thumb:hover { background: var(--claude-border-hover) !important; }

            /* Links */
            .dark a { color: var(--claude-primary) !important; }
            .dark a:hover { color: var(--claude-primary-hover) !important; text-decoration: underline !important; }

            /* Generic Overrides for Dark Mode */
            .dark .bg-gray-800 { background-color: var(--claude-sidebar-bg) !important; }
            .dark .text-white { color: var(--claude-text-primary) !important; }
            .dark .bg-white { background-color: var(--claude-card-bg) !important; }
            .dark .text-gray-900, .dark .text-slate-900 { color: var(--claude-text-primary) !important; }
            .dark .text-gray-600, .dark .text-slate-600 { color: var(--claude-text-secondary) !important; }
            .dark .text-gray-400, .dark .text-slate-400 { color: var(--claude-text-muted) !important; }
            .dark .border-gray-200, .dark .border-gray-300, .dark .border-slate-200, .dark .border-slate-300 { border-color: var(--claude-border) !important; }
            .dark [data-element-id="user-message"] { background-color: var(--claude-workspace-bg) !important; color: var(--claude-text-primary) !important; }
            .dark [data-element-id*="workspace-tab"] span.bg-white\\/20, .dark [data-element-id*="workspace-tab"] span[class*="bg-white/20"] { background-color: var(--claude-workspace-bg) !important; color: var(--claude-primary) !important; }
            .dark button.text-blue-500, .dark button[class*="text-blue-500"] { color: var(--claude-primary) !important; }
            .dark button.text-blue-500:hover, .dark button[class*="text-blue-500"]:hover { color: var(--claude-primary-hover) !important; }

            /* Final Button Fixes */
            .dark [data-element-id="send-button"], .dark [data-element-id="more-options-button"] { background-color: var(--claude-primary) !important; color: white !important; border-color: var(--claude-primary) !important; }
            .dark [data-element-id="send-button"]:hover, .dark [data-element-id="more-options-button"]:hover { background-color: var(--claude-primary-hover) !important; border-color: var(--claude-primary-hover) !important; }
            .dark [data-element-id="more-options-button"] svg { color: white !important; }
        `;
    }

    /**
     * Initializes the theme by generating and injecting the styles.
     */
    function initTheme() {
        console.log('🎨 Initializing Claude AI Dark Theme...');
        injectStyles(generateThemeStyles());
        console.log('✅ Claude AI Dark Theme initialized successfully!');
    }

    // Run the theme initialization once the DOM is ready.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }

})();
