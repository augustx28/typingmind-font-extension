// TypingMind Universal Chat Transparency Extension
(function() {
    'use strict';
    
    // Universal CSS rules for ALL chat messages
    const customStyles = `
        /* Target ALL response message containers */
        [id^="response-"] > div:first-child > div:nth-child(2) > div:first-child {
            background-color: rgba(255, 255, 255, 0) !important;
        }
        
        /* Target ALL user message containers */
        [id^="message-"] > div:first-child > div:nth-child(2) > div:first-child {
            background-color: rgba(255, 255, 255, 0) !important;
        }
        
        /* Alternative selectors for chat message backgrounds */
        .prose {
            background-color: transparent !important;
        }
        
        /* Target message content areas */
        div[class*="markdown"] {
            background-color: transparent !important;
        }
        
        /* Target chat bubble containers - more generic approach */
        main div[id*="response"] > div > div:nth-child(2) > div {
            background-color: rgba(255, 255, 255, 0) !important;
        }
        
        main div[id*="message"] > div > div:nth-child(2) > div {
            background-color: rgba(255, 255, 255, 0) !important;
        }
        
        /* Remove backgrounds from chat content wrappers */
        div[class*="bg-white"]:has([id^="response-"]),
        div[class*="bg-gray"]:has([id^="response-"]) {
            background-color: transparent !important;
        }
        
        div[class*="bg-white"]:has([id^="message-"]),
        div[class*="bg-gray"]:has([id^="message-"]) {
            background-color: transparent !important;
        }
        
        /* Target the main chat container areas */
        #nav-handler main > div > div > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > div {
            background-color: rgba(255, 255, 255, 0) !important;
        }
        
        /* Additional broad targeting for message areas */
        .message-content,
        .chat-message,
        .assistant-message,
        .user-message {
            background-color: transparent !important;
        }
        
        /* Remove any default message backgrounds */
        [role="article"] {
            background-color: transparent !important;
        }
        
        /* Target Tailwind utility classes commonly used in chat interfaces */
        .bg-white,
        .bg-gray-50,
        .bg-gray-100,
        .bg-blue-50,
        .bg-green-50 {
            background-color: rgba(255, 255, 255, 0) !important;
        }
        
        /* Dark mode backgrounds */
        .dark\\:bg-gray-800,
        .dark\\:bg-gray-900,
        .dark\\:bg-gray-700 {
            background-color: rgba(0, 0, 0, 0) !important;
        }
    `;
    
    // Function to inject CSS into the page
    function injectStyles() {
        // Remove existing styles if present
        const existingStyles = document.getElementById('typingmind-universal-chat-styles');
        if (existingStyles) {
            existingStyles.remove();
        }
        
        // Create new style element
        const styleElement = document.createElement('style');
        styleElement.id = 'typingmind-universal-chat-styles';
        styleElement.textContent = customStyles;
        
        // Append to document head
        document.head.appendChild(styleElement);
        
        console.log('TypingMind Universal Chat Styles: CSS injected successfully');
    }
    
    // Function to continuously monitor and apply styles
    function maintainStyles() {
        // Re-inject styles periodically to catch any dynamic updates
        setInterval(() => {
            injectStyles();
        }, 2000); // Check every 2 seconds
    }
    
    // Enhanced observer for dynamic content
    function observeChatArea() {
        const observer = new MutationObserver((mutations) => {
            let shouldReinject = false;
            
            mutations.forEach((mutation) => {
                // Check if new nodes contain chat messages
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const hasMessage = node.id?.includes('response') || 
                                         node.id?.includes('message') ||
                                         node.querySelector?.('[id*="response"]') ||
                                         node.querySelector?.('[id*="message"]');
                        if (hasMessage) {
                            shouldReinject = true;
                        }
                    }
                });
            });
            
            if (shouldReinject) {
                injectStyles();
            }
        });
        
        // Observe the entire body for maximum coverage
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'id']
        });
        
        console.log('TypingMind Universal Chat Styles: Enhanced observer started');
    }
    
    // Apply styles to existing elements
    function applyToExistingElements() {
        // Force transparency on all message elements
        const allMessages = document.querySelectorAll('[id^="response-"], [id^="message-"]');
        allMessages.forEach(element => {
            const container = element.querySelector('div > div:nth-child(2) > div');
            if (container) {
                container.style.setProperty('background-color', 'transparent', 'important');
            }
        });
        
        console.log(`TypingMind Universal Chat Styles: Applied to ${allMessages.length} existing messages`);
    }
    
    // Initialize the extension
    function init() {
        // Initial injection
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(() => {
                    injectStyles();
                    applyToExistingElements();
                    observeChatArea();
                    maintainStyles();
                }, 500); // Small delay to ensure DOM is fully rendered
            });
        } else {
            setTimeout(() => {
                injectStyles();
                applyToExistingElements();
                observeChatArea();
                maintainStyles();
            }, 500);
        }
    }
    
    // Start the extension
    init();
    
    // Expose control functions
    window.typingmindUniversalStyles = {
        reinject: () => {
            injectStyles();
            applyToExistingElements();
        },
        remove: () => {
            const styleElement = document.getElementById('typingmind-universal-chat-styles');
            if (styleElement) {
                styleElement.remove();
                console.log('TypingMind Universal Chat Styles: Removed');
            }
            
            // Remove inline styles
            const allMessages = document.querySelectorAll('[id^="response-"], [id^="message-"]');
            allMessages.forEach(element => {
                const container = element.querySelector('div > div:nth-child(2) > div');
                if (container) {
                    container.style.removeProperty('background-color');
                }
            });
        },
        forceApply: () => {
            // Aggressive style application
            document.querySelectorAll('*').forEach(element => {
                const id = element.id || '';
                const className = element.className || '';
                if (id.includes('response') || id.includes('message') || 
                    className.includes('message') || className.includes('chat')) {
                    element.style.setProperty('background-color', 'transparent', 'important');
                }
            });
            console.log('TypingMind Universal Chat Styles: Force applied to all matching elements');
        }
    };
    
})();
