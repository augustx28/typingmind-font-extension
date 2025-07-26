(function() {
    'use strict';

    const customCSS = `
        /* Simply reduce the header height */
        header, [role="banner"], .backdrop-blur-md {
            max-height: 45px !important;
            overflow: visible !important;
        }

        /* Adjust top padding/margin of main content */
        main, [role="main"], .overflow-y-auto {
            margin-top: -10px !important;
        }

        /* Ensure all interactive elements remain clickable */
        * {
            pointer-events: auto !important;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = customCSS;
    document.head.appendChild(styleElement);
})();
