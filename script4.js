// TypingMind ChatGPT Theme Extension
// This extension applies ChatGPT's color scheme to TypingMind's menu

(function() {
    'use strict';
    
    // ChatGPT color variables
    const chatGPTColors = {
        sidebarBg: '#171717',           // Dark sidebar background
        sidebarHover: '#2f2f2f',       // Hover state for sidebar items
        sidebarText: '#ececec',        // Primary text color
        sidebarTextSecondary: '#8e8ea0', // Secondary text color
        accent: '#10a37f',             // Green accent color
        accentHover: '#0d8c6c',        // Darker green for hover
        border: '#4d4d4f',             // Border color
        inputBg: '#40414f',            // Input background
        headerBg: '#343541'            // Header background
    };
    
    // Create and inject CSS styles
    function injectChatGPTStyles() {
        const styleId = 'chatgpt-theme-extension';
        
        // Remove existing styles if they exist
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
            existingStyle.remove();
        }
        
        const css = `
            /* Main sidebar styling */
            .sidebar, 
            [class*="sidebar"],
            nav[class*="sidebar"],
            aside {
                background-color: ${chatGPTColors.sidebarBg} !important;
                border-right: 1px solid ${chatGPTColors.border} !important;
            }
            
            /* Sidebar menu items */
            .sidebar a,
            .sidebar button,
            .sidebar [role="menuitem"],
            .sidebar li,
            nav a,
            nav button,
            nav [role="menuitem"],
            aside a,
            aside button,
            aside li {
                color: ${chatGPTColors.sidebarText} !important;
                background-color: transparent !important;
                border-radius: 8px !important;
                transition: background-color 0.2s ease !important;
            }
            
            /* Hover states for menu items */
            .sidebar a:hover,
            .sidebar button:hover,
            .sidebar [role="menuitem"]:hover,
            .sidebar li:hover,
            nav a:hover,
            nav button:hover,
            nav [role="menuitem"]:hover,
            aside a:hover,
            aside button:hover,
            aside li:hover {
                background-color: ${chatGPTColors.sidebarHover} !important;
                color: ${chatGPTColors.sidebarText} !important;
            }
            
            /* Active/selected menu items */
            .sidebar .active,
            .sidebar [aria-selected="true"],
            .sidebar [class*="active"],
            nav .active,
            nav [aria-selected="true"],
            nav [class*="active"],
            aside .active,
            aside [aria-selected="true"],
            aside [class*="active"] {
                background-color: ${chatGPTColors.accent} !important;
                color: white !important;
            }
            
            /* Secondary text in sidebar */
            .sidebar small,
            .sidebar .text-gray-500,
            .sidebar [class*="text-gray"],
            .sidebar [class*="opacity"],
            nav small,
            nav .text-gray-500,
            nav [class*="text-gray"],
            aside small,
            aside [class*="text-gray"] {
                color: ${chatGPTColors.sidebarTextSecondary} !important;
            }
            
            /* Icons in sidebar */
            .sidebar svg,
            .sidebar i,
            nav svg,
            nav i,
            aside svg,
            aside i {
                color: ${chatGPTColors.sidebarText} !important;
                opacity: 0.8;
            }
            
            /* Sidebar headers/titles */
            .sidebar h1,
            .sidebar h2,
            .sidebar h3,
            .sidebar h4,
            .sidebar h5,
            .sidebar h6,
            nav h1,
            nav h2,
            nav h3,
            nav h4,
            nav h5,
            nav h6,
            aside h1,
            aside h2,
            aside h3,
            aside h4,
            aside h5,
            aside h6 {
                color: ${chatGPTColors.sidebarText} !important;
            }
            
            /* Input fields in sidebar */
            .sidebar input,
            .sidebar textarea,
            nav input,
            nav textarea,
            aside input,
            aside textarea {
                background-color: ${chatGPTColors.inputBg} !important;
                border: 1px solid ${chatGPTColors.border} !important;
                color: ${chatGPTColors.sidebarText} !important;
            }
            
            /* Buttons with accent color */
            .sidebar button[class*="primary"],
            .sidebar button[class*="accent"],
            .sidebar .btn-primary,
            nav button[class*="primary"],
            nav .btn-primary,
            aside button[class*="primary"],
            aside .btn-primary {
                background-color: ${chatGPTColors.accent} !important;
                border-color: ${chatGPTColors.accent} !important;
                color: white !important;
            }
            
            .sidebar button[class*="primary"]:hover,
            .sidebar button[class*="accent"]:hover,
            .sidebar .btn-primary:hover,
            nav button[class*="primary"]:hover,
            nav .btn-primary:hover,
            aside button[class*="primary"]:hover,
            aside .btn-primary:hover {
                background-color: ${chatGPTColors.accentHover} !important;
                border-color: ${chatGPTColors.accentHover} !important;
            }
            
            /* Dividers and borders in sidebar */
            .sidebar hr,
            .sidebar .border-t,
            .sidebar .border-b,
            .sidebar [class*="border"],
            nav hr,
            nav .border-t,
            nav .border-b,
            aside hr,
            aside .border-t,
            aside .border-b {
                border-color: ${chatGPTColors.border} !important;
            }
            
            /* Dropdown menus */
            .sidebar .dropdown-menu,
            .sidebar [role="menu"],
            nav .dropdown-menu,
            nav [role="menu"],
            aside .dropdown-menu,
            aside [role="menu"] {
                background-color: ${chatGPTColors.sidebarBg} !important;
                border: 1px solid ${chatGPTColors.border} !important;
            }
            
            /* Scrollbars in sidebar */
            .sidebar::-webkit-scrollbar,
            nav::-webkit-scrollbar,
            aside::-webkit-scrollbar {
                width: 6px;
            }
            
            .sidebar::-webkit-scrollbar-track,
            nav::-webkit-scrollbar-track,
            aside::-webkit-scrollbar-track {
                background: ${chatGPTColors.sidebarBg};
            }
            
            .sidebar::-webkit-scrollbar-thumb,
            nav::-webkit-scrollbar-thumb,
            aside::-webkit-scrollbar-thumb {
                background: ${chatGPTColors.border};
                border-radius: 3px;
            }
            
            .sidebar::-webkit-scrollbar-thumb:hover,
            nav::-webkit-scrollbar-thumb:hover,
            aside::-webkit-scrollbar-thumb:hover {
                background: ${chatGPTColors.sidebarTextSecondary};
            }
        `;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    // Apply styles immediately
    injectChatGPTStyles();
    
    // Re-apply styles when DOM changes (for dynamic content)
    const observer = new MutationObserver(function(mutations) {
        let shouldReapply = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldReapply = true;
            }
        });
        
        if (shouldReapply) {
            setTimeout(injectChatGPTStyles, 100);
        }
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Apply styles when page is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectChatGPTStyles);
    }
    
    // Apply styles on window load as backup
    window.addEventListener('load', injectChatGPTStyles);
    
    console.log('ChatGPT Theme Extension loaded successfully');
})();
