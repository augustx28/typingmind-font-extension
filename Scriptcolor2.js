/**
 * TypingMind ChatGPT Dark Theme
 *
 * This script injects CSS to mimic the dark gray color scheme of the ChatGPT interface.
 * NOTE: CSS Selectors might need updating if TypingMind's structure changes.
 */
(function() {
    'use strict';

    // **Define ChatGPT Dark Theme Colors**
    const colors = {
        backgroundPrimary: '#343541', // Main background, user messages
        backgroundSecondary: '#444654', // Assistant messages
        backgroundTertiary: '#202123', // Sidebar, headers
        textPrimary: '#ECECF1', // Main text
        textSecondary: '#D1D5DB', // Slightly dimmer text
        border: '#565869', // Borders, dividers
        inputBackground: '#40414F', // Input text area
        buttonBackground: '#40414F', // Buttons
        buttonHoverBackground: '#4D4E5A', // Button hover
    };

    // **CSS Rules**
    // These selectors are *examples* based on common web structures.
    // **YOU WILL LIKELY NEED TO UPDATE THESE** using your browser's developer tools.
    const css = `
        /* --- General Body & Text --- */
        body, #__next {
            background-color: ${colors.backgroundPrimary} !important;
            color: ${colors.textPrimary} !important;
        }

        /* --- Sidebar --- */
        /* Replace '.sidebar-selector' with TypingMind's actual sidebar class/ID */
        .dark .bg-gray-900, .dark .border-gray-700 { /* Example selectors, might need changing */
            background-color: ${colors.backgroundTertiary} !important;
            border-color: ${colors.border} !important;
        }
         /* Sidebar links/text */
         .dark .text-gray-300, .dark .text-gray-400 {
             color: ${colors.textSecondary} !important;
         }
         .dark .hover\\:bg-gray-700:hover {
              background-color: ${colors.inputBackground} !important;
         }


        /* --- Chat Area --- */
        /* Replace '.chat-container-selector' if needed */
        .dark .bg-gray-800 { /* Example main chat area background */
            background-color: ${colors.backgroundPrimary} !important;
        }

        /* --- User Message Bubbles --- */
        /* Replace '.user-message-selector' */
        .dark .bg-gray-800 .whitespace-pre-wrap { /* Example for user message - might need adjustment */
             /* Often inherits body background, but can be set explicitly if needed */
             /* background-color: ${colors.backgroundPrimary} !important; */
             color: ${colors.textPrimary} !important;
        }

        /* --- Assistant Message Bubbles --- */
        /* Replace '.assistant-message-selector' */
        .dark .bg-gray-700 .whitespace-pre-wrap, /* Example selectors, often differs slightly */
        .dark .markdown { /* Target markdown formatted text */
            background-color: ${colors.backgroundSecondary} !important;
            color: ${colors.textPrimary} !important;
            border: 1px solid ${colors.border} !important; /* Optional subtle border */
            border-radius: 6px; /* Optional rounded corners */
            padding: 10px 12px; /* Optional padding */
        }
        .dark .bg-black\\/10 { /* This often targets code blocks */
             background-color: ${colors.backgroundTertiary} !important;
             color: ${colors.textPrimary} !important;
             border: 1px solid ${colors.border} !important;
        }

        /* --- Input Area --- */
        /* Replace '.input-textarea-selector' and '.input-container-selector' */
        textarea, .dark textarea { /* Target the text area */
            background-color: ${colors.inputBackground} !important;
            color: ${colors.textPrimary} !important;
            border-color: ${colors.border} !important;
            caret-color: ${colors.textPrimary}; /* Make cursor visible */
        }
         .dark .border-gray-600 { /* General container borders */
             border-color: ${colors.border} !important;
         }

        /* --- Buttons --- */
        /* Replace '.button-selector' */
        button, .dark button {
            background-color: ${colors.buttonBackground} !important;
            color: ${colors.textPrimary} !important;
            border: 1px solid ${colors.border} !important;
        }
        button:hover, .dark button:hover {
            background-color: ${colors.buttonHoverBackground} !important;
        }

        /* --- Headers/Other Elements --- */
        /* Add more specific selectors as needed */
        .dark .border-b { /* Bottom borders */
             border-color: ${colors.border} !important;
        }
        .dark h1, .dark h2, .dark h3 { /* Headers */
            color: ${colors.textPrimary} !important;
        }

        /* --- Scrollbars (Optional, Webkit/Blink browsers) --- */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: ${colors.backgroundTertiary};
        }
        ::-webkit-scrollbar-thumb {
            background-color: ${colors.border};
            border-radius: 4px;
            border: 2px solid ${colors.backgroundTertiary};
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: ${colors.inputBackground};
        }

    `;

    // **Inject CSS into the page**
    try {
        const styleElement = document.createElement('style');
        styleElement.id = 'chatgpt-dark-theme-styles'; // Add an ID for easy removal/update if needed
        styleElement.innerHTML = css;
        document.head.appendChild(styleElement);
        console.log('ChatGPT Dark Theme applied successfully.');
    } catch (error) {
        console.error('Error applying ChatGPT Dark Theme:', error);
    }

})();
