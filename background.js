/**
 * Simple Claude AI Background Theme for TypingMind
 * This extension applies only the light and dark mode background colors
 * inspired by the Claude AI interface. All other styling has been removed.
 */
(function() {
    'use strict';

    // --- Configuration ---
    // Defines the specific background colors for light and dark modes.
    const BACKGROUND_COLORS = {
        // Light Mode Backgrounds
        light: {
            main: '#fdfcfb',      // Warm off-white main area
            sidebar: '#f7f5f3',   // Warm beige sidebar
            workspace: '#f0ede8', // Slightly darker beige for workspace & message selection
            popup: '#ffffff',      // Pure white for cards and popups
        },
        // Dark Mode Backgrounds
        dark: {
            main: '#2f2f2f',      // Dark gray main area
            sidebar: '#171717',   // Very dark (almost black) sidebar
            workspace: '#1a1a1a', // Dark workspace & message selection
            popup: '#262626',      // Dark gray for cards and popups
        }
    };

    /**
     * Generates the minimal CSS string needed to apply the background colors.
     * This function creates custom CSS variables for our theme and then maps them
     * to TypingMind's own internal CSS variables for maximum compatibility.
     * @returns {string} The complete CSS rules as a string.
     */
    function generateThemeStyles() {
        return `
        /* 1. Define our custom theme variables for light mode (default) */
        :root {
            --claude-bg-main: ${BACKGROUND_COLORS.light.main};
            --claude-bg-sidebar: ${BACKGROUND_COLORS.light.sidebar};
            --claude-bg-workspace: ${BACKGROUND_COLORS.light.workspace};
            --claude-bg-popup: ${BACKGROUND_COLORS.light.popup};
        }

        /* 2. Redefine our custom theme variables when dark mode is active */
        .dark {
            --claude-bg-main: ${BACKGROUND_COLORS.dark.main};
            --claude-bg-sidebar: ${BACKGROUND_COLORS.dark.sidebar};
            --claude-bg-workspace: ${BACKGROUND_COLORS.dark.workspace};
            --claude-bg-popup: ${BACKGROUND_COLORS.dark.popup};
        }

        /* 3. Apply our variables to TypingMind's core layout elements */
        body {
            /* These apply to both light and dark mode by referencing our variables */
            --sidebar-color: var(--claude-bg-sidebar) !important;
            --sidebar-menu-color: var(--claude-bg-workspace) !important;
            --workspace-color: var(--claude-bg-workspace) !important;
            --popup-color: var(--claude-bg-popup) !important;

            /* Set the main background color directly. For light mode, this is all we need. */
            background-color: var(--claude-bg-main) !important;
        }

        /* 4. Apply dark mode specific overrides using TypingMind's variables */
        body.dark {
            --main-dark-color: var(--claude-bg-main) !important;
            --main-dark-popup-color: var(--claude-bg-popup) !important;
        }
        `;
    }

    /**
     * Injects the generated styles into the document's <head>.
     * It will remove any old version of this theme's styles first.
     * @param {string} styles - The CSS string to inject.
     */
    function injectStyles(styles) {
        const styleSheetId = 'simple-claude-background-theme';
        const oldStyleSheet = document.getElementById(styleSheetId);
        if (oldStyleSheet) {
            oldStyleSheet.remove();
        }

        const styleSheet = document.createElement('style');
        styleSheet.id = styleSheetId;
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // --- Main Execution ---
    // This is where the script runs. It generates the styles and injects them.
    console.log('🎨 Applying Simple Claude Background Theme...');
    injectStyles(generateThemeStyles());
    console.log('✅ Backgrounds updated successfully!');

})();
