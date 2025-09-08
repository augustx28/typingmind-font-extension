// TypingMind Extension: Mobile Navigation Position Fix
// This extension adjusts the navigation handler position on mobile devices

(function() {
    'use strict';
    
    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    
    // Your CSS rules for mobile viewport
    const cssContent = `
        @media (max-width: 499.995px) {
            /* Workspace height navigation handler fix */
            #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
                bottom: 0px;
                top: 794px;
                position: fixed;
                right: 0px;
            }
        }
    `;
    
    // Add the CSS to the style element
    styleElement.innerHTML = cssContent;
    
    // Append the style element to the document head
    document.head.appendChild(styleElement);
    
    // Log success message (optional, can be removed in production)
    console.log('TypingMind Mobile Navigation Fix Extension loaded successfully');
    
})();
