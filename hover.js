// TypingMind Universal Chat Transparency - Multi-Chat Support
(function() {
    'use strict';
    
    // Store current chat ID to detect changes
    let currentChatId = null;
    let styleAppliedCount = 0;
    
    // Comprehensive CSS rules
    const customStyles = `
        /* Remove ALL background colors from message containers */
        * [id*="response"] > div,
        * [id*="message"] > div {
            background-color: transparent !important;
            background: transparent !important;
        }
        
        /* Target message wrapper elements */
        [id^="response-"],
        [id^="message-"],
        [id*="response-"],
        [id*="message-"] {
            background-color: transparent !important;
            background: transparent !important;
        }
        
        /* Target all nested divs in messages */
        [id^="response-"] div,
        [id^="message-"] div {
            background-color: transparent !important;
        }
        
        /* Override Tailwind classes */
        .bg-white,
        .bg-gray-50,
        .bg-gray-100,
        .bg-gray-200,
        .bg-blue-50,
        .bg-blue-100,
        .bg-green-50,
        .bg-green-100,
        .bg-yellow-50,
        .bg-yellow-100 {
            background-color: transparent !important;
            background: transparent !important;
        }
        
        /* Dark mode overrides */
        .dark\\:bg-gray-900,
        .dark\\:bg-gray-800,
        .dark\\:bg-gray-700,
        .dark\\:bg-gray-600 {
            background-color: transparent !important;
            background: transparent !important;
        }
        
        /* Message content areas */
        .prose,
        .markdown,
        [class*="prose"],
        [class*="markdown"] {
            background-color: transparent !important;
        }
        
        /* Chat bubble and container overrides */
        main [class*="rounded"],
        main [class*="shadow"],
        main [class*="border"] {
            background-color: transparent !important;
        }
        
        /* Force transparency on all main content divs */
        main > div > div div {
            background-color: transparent !important;
        }
        
        /* Specific targeting for chat messages */
        div:has(> [id*="response"]),
        div:has(> [id*="message"]) {
            background-color: transparent !important;
        }
        
        /* Override inline styles */
        [style*="background"] {
            background-color: transparent !important;
            background: transparent !important;
        }
    `;
    
    // Function to inject styles
    function injectStyles() {
        let styleElement = document.getElementById('typingmind-universal-styles-v2');
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'typingmind-universal-styles-v2';
            document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = customStyles;
        console.log('✅ TypingMind Styles: CSS injected');
    }
    
    // Force inline style application
    function forceInlineStyles() {
        // Apply to all message containers
        const selectors = [
            '[id^="response-"]',
            '[id^="message-"]',
            '[id*="response"]',
            '[id*="message"]',
            '.prose',
            '.markdown',
            '[class*="bg-"]'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.style.setProperty('background-color', 'transparent', 'important');
                element.style.setProperty('background', 'transparent', 'important');
                
                // Apply to all child elements
                element.querySelectorAll('div').forEach(child => {
                    child.style.setProperty('background-color', 'transparent', 'important');
                    child.style.setProperty('background', 'transparent', 'important');
                });
            });
        });
        
        styleAppliedCount++;
        console.log(`✅ TypingMind Styles: Force applied inline styles (Count: ${styleAppliedCount})`);
    }
    
    // Detect chat changes
    function detectChatChange() {
        const chatIndicators = [
            window.location.pathname,
            window.location.hash,
            document.querySelector('[id^="response-"]')?.id,
            document.querySelector('main')?.innerHTML?.substring(0, 100)
        ];
        
        const currentIndicator = chatIndicators.join('|');
        
        if (currentIndicator !== currentChatId) {
            currentChatId = currentIndicator;
            console.log('🔄 TypingMind Styles: Chat change detected');
            
            // Reapply everything
            setTimeout(() => {
                injectStyles();
                forceInlineStyles();
            }, 100);
            
            setTimeout(() => {
                forceInlineStyles();
            }, 500);
            
            setTimeout(() => {
                forceInlineStyles();
            }, 1000);
        }
    }
    
    // Enhanced mutation observer
    function setupObserver() {
        let debounceTimer;
        
        const observer = new MutationObserver((mutations) => {
            clearTimeout(debounceTimer);
            
            // Check if meaningful changes occurred
            let hasRelevantChanges = false;
            
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            const id = node.id || '';
                            const html = node.innerHTML || '';
                            
                            if (id.includes('response') || 
                                id.includes('message') || 
                                html.includes('response') || 
                                html.includes('message')) {
                                hasRelevantChanges = true;
                                break;
                            }
                        }
                    }
                }
            }
            
            if (hasRelevantChanges) {
                debounceTimer = setTimeout(() => {
                    detectChatChange();
                    forceInlineStyles();
                }, 100);
            }
        });
        
        // Observe entire document
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style', 'id']
        });
        
        console.log('✅ TypingMind Styles: Observer active');
    }
    
    // Monitor URL changes (for SPA navigation)
    function setupRouteMonitor() {
        let lastUrl = location.href;
        
        // Check URL periodically
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                console.log('🔄 TypingMind Styles: URL change detected');
                
                setTimeout(() => {
                    detectChatChange();
                    injectStyles();
                    forceInlineStyles();
                }, 100);
            }
        }, 500);
        
        // Override history methods
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function() {
            originalPushState.apply(history, arguments);
            setTimeout(() => {
                detectChatChange();
                forceInlineStyles();
            }, 100);
        };
        
        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            setTimeout(() => {
                detectChatChange();
                forceInlineStyles();
            }, 100);
        };
        
        // Listen for popstate
        window.addEventListener('popstate', () => {
            setTimeout(() => {
                detectChatChange();
                forceInlineStyles();
            }, 100);
        });
    }
    
    // Aggressive continuous application
    function setupContinuousApplication() {
        // Apply styles every 2 seconds
        setInterval(() => {
            detectChatChange();
            injectStyles();
            forceInlineStyles();
        }, 2000);
    }
    
    // Initialize everything
    function init() {
        console.log('🚀 TypingMind Universal Styles: Initializing...');
        
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startExtension);
        } else {
            startExtension();
        }
    }
    
    function startExtension() {
        // Initial application
        injectStyles();
        forceInlineStyles();
        
        // Setup monitoring systems
        setupObserver();
        setupRouteMonitor();
        setupContinuousApplication();
        
        // Apply multiple times during initial load
        const delays = [100, 300, 500, 1000, 2000];
        delays.forEach(delay => {
            setTimeout(() => {
                injectStyles();
                forceInlineStyles();
            }, delay);
        });
        
        console.log('✅ TypingMind Universal Styles: Extension ready');
    }
    
    // Start the extension
    init();
    
    // Expose control panel
    window.typingmindStyles = {
        apply: () => {
            injectStyles();
            forceInlineStyles();
            console.log('✅ Styles manually applied');
        },
        remove: () => {
            const style = document.getElementById('typingmind-universal-styles-v2');
            if (style) style.remove();
            
            document.querySelectorAll('[style*="background"]').forEach(el => {
                el.style.removeProperty('background-color');
                el.style.removeProperty('background');
            });
            
            console.log('✅ Styles removed');
        },
        status: () => {
            console.log(`📊 Status:
- Styles Applied: ${styleAppliedCount} times
- Current Chat ID: ${currentChatId}
- Style Element: ${!!document.getElementById('typingmind-universal-styles-v2')}
            `);
        }
    };
    
})();
