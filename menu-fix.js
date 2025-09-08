// Mobile Responsive CSS Extension for TypingMind
(function() {
    'use strict';
    
    // Extension metadata
    const extensionInfo = {
        name: 'Mobile Responsive CSS',
        version: '1.0.0',
        description: 'Applies custom CSS for better mobile experience'
    };
    
    // Function to inject CSS
    function injectMobileCSS() {
        // Check if styles already exist to avoid duplicates
        if (document.getElementById('mobile-responsive-styles')) {
            return;
        }
        
        // Create style element
        const styleElement = document.createElement('style');
        styleElement.id = 'mobile-responsive-styles';
        styleElement.type = 'text/css';
        
        // Your CSS content
        const cssContent = `
            @media (max-width: 499.995px) {
                /* var(workspace height) */
                #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
                    bottom: 0px;
                    top: 760px;
                    position: fixed;
                    right: 0px;
                }
            }
            
            @media (max-width: 499px) {
                /* var(workspace height) */
                #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
                    top: 760px;
                }
                
                /* Navigation */
                .transition .flex-col .md\\:pl-\\[--workspace-width\\] {
                    padding-bottom: 4px;
                }
            }
        `;
        
        // Add CSS to style element
        styleElement.innerHTML = cssContent;
        
        // Append to document head
        document.head.appendChild(styleElement);
        
        console.log('Mobile Responsive CSS Extension loaded successfully');
    }
    
    // Function to observe DOM changes (in case elements load dynamically)
    function observeDOM() {
        const observer = new MutationObserver(function(mutations) {
            // Re-apply styles if needed
            if (!document.getElementById('mobile-responsive-styles')) {
                injectMobileCSS();
            }
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Initialize extension
    function init() {
        // Inject CSS immediately
        injectMobileCSS();
        
        // Set up observer for dynamic content
        observeDOM();
        
        // Also inject on window resize to ensure styles persist
        window.addEventListener('resize', function() {
            injectMobileCSS();
        });
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM is already loaded
        init();
    }
    
})();
