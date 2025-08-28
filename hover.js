// TypingMind Custom Chat Styling Extension
(function() {
    'use strict';
    
    // Your custom CSS rules
    const customStyles = `
        /* Make specific chat container elements transparent */
        #nav-handler>div:nth-child(2)>main:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1) {
            background-color: rgba(255, 255, 255, 0) !important;
        }
        
        /* Make specific response elements transparent */
        #response-93483c26-c37e-40cc-ad44-9034385a7785>div:nth-child(1)>div:nth-child(2)>div:nth-child(1) {
            background-color: rgba(255, 255, 255, 0) !important;
        }
        
        /* Additional styling for better transparency effect */
        [id^="response-"]>div:nth-child(1)>div:nth-child(2)>div:nth-child(1) {
            background-color: rgba(255, 255, 255, 0) !important;
        }
    `;
    
    // Function to inject CSS into the page
    function injectStyles() {
        // Check if styles are already injected
        if (document.getElementById('typingmind-custom-chat-styles')) {
            return;
        }
        
        // Create style element
        const styleElement = document.createElement('style');
        styleElement.id = 'typingmind-custom-chat-styles';
        styleElement.textContent = customStyles;
        
        // Append to document head
        document.head.appendChild(styleElement);
        
        console.log('TypingMind Custom Chat Styles: CSS injected successfully');
    }
    
    // Function to handle dynamic content
    function observeChatArea() {
        // Observer to detect when new chat elements are added
        const observer = new MutationObserver((mutations) => {
            // Re-inject styles if needed for dynamic content
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    // Ensure styles remain applied
                    injectStyles();
                }
            });
        });
        
        // Start observing the chat area for changes
        const chatContainer = document.querySelector('#nav-handler');
        if (chatContainer) {
            observer.observe(chatContainer, {
                childList: true,
                subtree: true
            });
            console.log('TypingMind Custom Chat Styles: Observer started');
        }
    }
    
    // Initialize the extension
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                injectStyles();
                observeChatArea();
            });
        } else {
            // DOM is already ready
            injectStyles();
            observeChatArea();
        }
    }
    
    // Start the extension
    init();
    
    // Expose functions for debugging (optional)
    window.typingmindCustomStyles = {
        reinject: injectStyles,
        remove: function() {
            const styleElement = document.getElementById('typingmind-custom-chat-styles');
            if (styleElement) {
                styleElement.remove();
                console.log('TypingMind Custom Chat Styles: Removed');
            }
        }
    };
    
})();
