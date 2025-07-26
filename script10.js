(function() {
    'use strict';

    const customCSS = `
        /* Reduce top header/navbar height */
        .backdrop-blur-md {
            min-height: 40px !important;
            max-height: 40px !important;
        }

        /* Adjust main content area spacing */
        [class*="md:pl-"][class*="sidebar-width"] {
            --header-offset: 40px;
        }

        /* Reduce top margin of main chat area */
        .transition-all:has(> [class*="container"]) {
            margin-top: 0 !important;
        }

        /* Ensure proper spacing for navigation elements */
        #nav-handler .backdrop-blur-md {
            height: 40px !important;
            min-height: 40px !important;
        }

        /* Adjust container padding to compensate for reduced header */
        .overflow-y-auto > div:first-child {
            padding-top: 0.5rem !important;
        }

        /* Fix potential z-index issues with navigation */
        .backdrop-blur-md {
            z-index: 50;
            position: relative;
        }

        /* Ensure clickable areas remain accessible */
        button, a, [role="button"] {
            position: relative;
            z-index: 10;
        }

        /* Smooth transitions for all adjustments */
        .transition-all {
            transition: all 0.2s ease-in-out;
        }
    `;

    // Create and inject the style element
    const styleElement = document.createElement('style');
    styleElement.id = 'typingmind-space-optimizer';
    styleElement.textContent = customCSS;

    // Remove any existing instance to prevent duplicates
    const existingStyle = document.getElementById('typingmind-space-optimizer');
    if (existingStyle) {
        existingStyle.remove();
    }

    document.head.appendChild(styleElement);
})();
