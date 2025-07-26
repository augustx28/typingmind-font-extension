/**
 * Claude AI Dark-Only Theme for TypingMind
 * A clean, minimalist dark theme inspired by Claude AI's interface.
 *
 * This is a modified version of the original "Claude AI Theme" script,
 * tweaked to ONLY provide the dark mode styling. Light mode has been removed.
 * Typography, button styles, and input area styles from the original theme are preserved.
 */

(function() {
    'use strict';

    // Configuration - Simplified for Dark Mode Only
    const CONFIG = {
        colors: {
            // Main colors (for buttons, highlights, etc.)
            primary: '#d97449',
            primaryHover: '#c4653f',
            primaryLight: '#d9744920',

            // Dark mode colors are now the default
            mainBg: '#2f2f2f',
            sidebarBg: '#171717',
            workspaceBg: '#1a1a1a',
            cardBg: '#262626',
            textPrimary: '#e8e8e8',
            textSecondary: '#a3a3a3',
            textMuted: '#737373',
            border: '#404040',
            borderHover: '#525252',

            // Status colors
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6',
        },

        // Typography, spacing, and other styles are kept as requested
        typography: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: {
                xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem',
            },
            fontWeight: {
                normal: '400', medium: '500', semibold: '600', bold: '700',
            },
        },
        spacing: {
            xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem',
        },
        borderRadius: {
            sm: '0.375rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', '2xl': '1.5rem',
        },
        shadows: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
    };

    // Selectors for different TypingMind elements
    const SELECTORS = {
        body: 'body',
        sidebarBackground: '[data-element-id="side-bar-background"]',
        workspaceBar: '[data-element-id="workspace-bar"]',
        chatContainer: '[data-element-id="chat-container"]',
        messageUser: '[data-element-id="user-message"]',
        messageAssistant: '[data-element-id="message-assistant"]',
        inputContainer: '[data-element-id="input-container"]',
        inputTextarea: '[data-element-id="input-textarea"]',
        sendButton: '[data-element-id="send-button"]',
        regenerateButton: '[data-element-id="regenerate-button"]',
        customChatItem: '[data-element-id="custom-chat-item"]',
        button: 'button',
        input: 'input',
        textarea: 'textarea',
        select: 'select',
        card: '.card',
        modal: '.modal',
    };

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

    // Main theme styles generation
    function generateThemeStyles() {
        return `
            /* Claude AI Dark-Only Theme - Root Variables */
            :root {
                --claude-primary: ${CONFIG.colors.primary};
                --claude-primary-hover: ${CONFIG.colors.primaryHover};
                --claude-primary-light: ${CONFIG.colors.primaryLight};
                --claude-main-bg: ${CONFIG.colors.mainBg};
                --claude-sidebar-bg: ${CONFIG.colors.sidebarBg};
                --claude-workspace-bg: ${CONFIG.colors.workspaceBg};
                --claude-card-bg: ${CONFIG.colors.cardBg};
                --claude-text-primary: ${CONFIG.colors.textPrimary};
                --claude-text-secondary: ${CONFIG.colors.textSecondary};
                --claude-text-muted: ${CONFIG.colors.textMuted};
                --claude-border: ${CONFIG.colors.border};
                --claude-border-hover: ${CONFIG.colors.borderHover};
                --claude-shadow-sm: ${CONFIG.shadows.sm};
                --claude-shadow-md: ${CONFIG.shadows.md};
                --claude-shadow-lg: ${CONFIG.shadows.lg};
                --claude-radius-sm: ${CONFIG.borderRadius.sm};
                --claude-radius-md: ${CONFIG.borderRadius.md};
                --claude-radius-lg: ${CONFIG.borderRadius.lg};
                --claude-radius-xl: ${CONFIG.borderRadius.xl};
                --claude-font-family: ${CONFIG.typography.fontFamily};
            }

            /* Force dark mode variables onto TypingMind's variables */
            body.dark {
                --main-dark-color: var(--claude-main-bg) !important;
                --sidebar-color: var(--claude-sidebar-bg) !important;
                --sidebar-menu-color: var(--claude-workspace-bg) !important;
                --workspace-color: var(--claude-workspace-bg) !important;
                --popup-color: var(--claude-card-bg) !important;
                --main-dark-popup-color: var(--claude-card-bg) !important;
                background-color: var(--claude-main-bg) !important;
                color: var(--claude-text-primary) !important;
                font-family: var(--claude-font-family) !important;
            }

            /* Main structure styling */
            ${SELECTORS.sidebarBackground} { background-color: var(--claude-sidebar-bg) !important; border-right: 1px solid var(--claude-border) !important; }
            ${SELECTORS.workspaceBar} { background-color: var(--claude-workspace-bg) !important; }
            ${SELECTORS.chatContainer} { background-color: var(--claude-main-bg) !important; color: var(--claude-text-primary) !important; }

            /* Messages */
            ${SELECTORS.messageUser} {
                background-color: var(--claude-workspace-bg) !important;
                color: var(--claude-text-primary) !important;
                border-radius: var(--claude-radius-lg) !important;
                border: 1px solid var(--claude-border) !important;
                padding: ${CONFIG.spacing.md} !important;
            }
            ${SELECTORS.messageAssistant} {
                background-color: var(--claude-card-bg) !important;
                border-radius: var(--claude-radius-lg) !important;
                border: 1px solid var(--claude-border) !important;
                padding: ${CONFIG.spacing.md} !important;
                box-shadow: var(--claude-shadow-sm) !important;
            }

            /* Input Area (Preserving original style) */
            ${SELECTORS.inputContainer} {
                background-color: var(--claude-card-bg) !important;
                border-radius: var(--claude-radius-lg) !important;
                border: 1px solid var(--claude-border) !important;
                box-shadow: var(--claude-shadow-sm) !important;
            }
            ${SELECTORS.inputTextarea} {
                background-color: transparent !important;
                border: none !important;
                color: var(--claude-text-primary) !important;
                font-family: var(--claude-font-family) !important;
            }
            ${SELECTORS.inputTextarea}:focus {
                outline: none !important;
                box-shadow: 0 0 0 2px var(--claude-primary-light) !important;
            }

            /* Buttons (Preserving original style) */
            ${SELECTORS.button}, ${SELECTORS.sendButton}, ${SELECTORS.regenerateButton} {
                background-color: var(--claude-primary) !important;
                color: white !important;
                border: none !important;
                border-radius: var(--claude-radius-md) !important;
                font-weight: ${CONFIG.typography.fontWeight.medium} !important;
                transition: all 0.2s ease !important;
            }
            ${SELECTORS.button}:hover, ${SELECTORS.sendButton}:hover, ${SELECTORS.regenerateButton}:hover {
                background-color: var(--claude-primary-hover) !important;
                box-shadow: var(--claude-shadow-md) !important;
            }
            /* Override default blue buttons */
            button.bg-blue-600, button[class*="bg-blue-600"] {
                background-color: var(--claude-primary) !important;
                color: white !important;
            }
             button.bg-blue-600:hover, button[class*="bg-blue-600"]:hover,
             button.hover\\:bg-blue-700:hover, button[class*="hover:bg-blue-700"]:hover {
                background-color: var(--claude-primary-hover) !important;
            }

            /* General Form Elements */
            ${SELECTORS.input}, ${SELECTORS.textarea}, ${SELECTORS.select} {
                background-color: var(--claude-card-bg) !important;
                border: 1px solid var(--claude-border) !important;
                border-radius: var(--claude-radius-md) !important;
                color: var(--claude-text-primary) !important;
                font-family: var(--claude-font-family) !important;
            }
            ${SELECTORS.input}:focus, ${SELECTORS.textarea}:focus, ${SELECTORS.select}:focus {
                outline: none !important;
                border-color: var(--claude-primary) !important;
                box-shadow: 0 0 0 2px var(--claude-primary-light) !important;
            }
            
            /* Typography */
            body, p, span, div { font-family: var(--claude-font-family) !important; }
            h1, h2, h3, h4, h5, h6 {
                color: var(--claude-text-primary) !important;
                font-family: var(--claude-font-family) !important;
                font-weight: ${CONFIG.typography.fontWeight.semibold} !important;
            }
            
            /* Pop-ups and Modals */
            ${SELECTORS.card}, ${SELECTORS.modal}, .dropdown, .tooltip, [data-element-id="pop-up-modal"] {
                background-color: var(--claude-card-bg) !important;
                border: 1px solid var(--claude-border) !important;
                border-radius: var(--claude-radius-lg) !important;
                box-shadow: var(--claude-shadow-lg) !important;
                color: var(--claude-text-primary) !important;
            }

            /* Additional Dark Mode Fixes */
            .text-gray-900, .text-slate-900 { color: var(--claude-text-primary) !important; }
            .text-gray-600, .text-slate-600 { color: var(--claude-text-secondary) !important; }
            .text-gray-400, .text-slate-400 { color: var(--claude-text-muted) !important; }
            .border-gray-200, .border-gray-300, .border-slate-200, .border-slate-300 { border-color: var(--claude-border) !important; }
            
            /* Chat list items */
            ${SELECTORS.customChatItem}:hover { background-color: var(--claude-workspace-bg) !important; }
            ${SELECTORS.customChatItem}[data-selected="true"] { background-color: var(--claude-primary-light) !important; }
        `;
    }

    // Debounce utility
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply styles and ensure dark mode is always on
    function applyTheme() {
        // Force body to have the .dark class
        if (!document.body.classList.contains('dark')) {
            document.body.classList.add('dark');
        }
    }

    // Initialize theme
    function initTheme() {
        console.log('🎨 Initializing Claude AI Dark-Only Theme...');
        
        // Inject main styles
        injectStyles(generateThemeStyles());
        
        // Force dark mode on initial load
        applyTheme();
        
        // Set up mutation observer for dynamic content to re-apply class if needed
        const observer = new MutationObserver(debounce(applyTheme, 100));
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        console.log('✅ Claude AI Dark-Only Theme initialized successfully!');
    }

    // Start initialization when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();
