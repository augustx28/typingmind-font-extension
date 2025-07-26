/**
 * Dark Mode Background and Borders for TypingMind
 * Extracts only the dark mode background, border, and divider colors from the Claude AI Theme.
 */
(function() {
    'use strict';

    // Configuration for Dark Mode Colors
    const CONFIG = {
        colors: {
            // Dark mode backgrounds
            darkMainBg: '#2f2f2f',      // Main background
            darkSidebarBg: '#171717',   // Sidebar background
            darkWorkspaceBg: '#1a1a1a',// Workspace background
            darkCardBg: '#262626',      // Card and container background

            // Borders and dividers
            darkBorder: '#404040',      // Dark mode border
            darkBorderHover: '#525252', // Dark mode border on hover
        },
    };

    /**
     * Injects the necessary CSS styles into the document's head.
     * @param {string} styles - The CSS rules to be injected.
     */
    function injectStyles(styles) {
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.id = 'custom-dark-mode-theme-styles';
        styleSheet.textContent = styles;

        // Remove any existing custom theme styles to avoid conflicts
        const existingStyles = document.getElementById('custom-dark-mode-theme-styles');
        if (existingStyles) {
            existingStyles.remove();
        }

        document.head.appendChild(styleSheet);
    }

    /**
     * Generates the CSS style string with the dark mode color variables.
     * @returns {string} The generated CSS styles.
     */
    function generateThemeStyles() {
        return `
            /* Dark Mode Theme - Root Variables */
            .dark {
                --custom-main-bg: ${CONFIG.colors.darkMainBg};
                --custom-sidebar-bg: ${CONFIG.colors.darkSidebarBg};
                --custom-workspace-bg: ${CONFIG.colors.darkWorkspaceBg};
                --custom-card-bg: ${CONFIG.colors.darkCardBg};
                --custom-border: ${CONFIG.colors.darkBorder};
                --custom-border-hover: ${CONFIG.colors.darkBorderHover};
            }

            /* Apply Dark Mode Backgrounds, Borders, and Dividers */
            .dark body,
            .dark #__next {
                background-color: var(--custom-main-bg) !important;
            }

            .dark [data-element-id="side-bar-background"] {
                background-color: var(--custom-sidebar-bg) !important;
                border-right-color: var(--custom-border) !important;
            }
            
            .dark [data-element-id="workspace-bar"],
            .dark [data-element-id="sidebar-beginning-part"] {
                background-color: var(--custom-workspace-bg) !important;
            }

            .dark [data-element-id="chat-container"],
            .dark [data-element-id="user-message"] {
                background-color: var(--custom-main-bg) !important;
            }

            .dark [data-element-id="message-assistant"],
            .dark [data-element-id="input-container"],
            .dark .modal,
            .dark .dropdown,
            .dark .tooltip,
            .dark .card,
            .dark [class*="card"] {
                background-color: var(--custom-card-bg) !important;
                border-color: var(--custom-border) !important;
            }
            
            /* General Border and Divider Styling */
            .dark hr,
            .dark input,
            .dark textarea,
            .dark select,
            .dark button {
                border-color: var(--custom-border) !important;
            }

            .dark input:hover,
            .dark textarea:hover,
            .dark select:hover,
            .dark button:hover {
                border-color: var(--custom-border-hover) !important;
            }
        `;
    }

    /**
     * Initializes the theme by injecting the styles.
     */
    function initTheme() {
        console.log('🎨 Initializing Custom Dark Mode Theme...');
        injectStyles(generateThemeStyles());
        console.log('✅ Custom Dark Mode Theme initialized successfully!');
    }

    // Run the theme initialization when the DOM is ready.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }

    // Optional: Expose a cleanup function for development purposes.
    window.cleanupCustomDarkModeTheme = function() {
        const styleSheet = document.getElementById('custom-dark-mode-theme-styles');
        if (styleSheet) {
            styleSheet.remove();
        }
        console.log('🧹 Custom Dark Mode Theme cleaned up');
    };
})();
