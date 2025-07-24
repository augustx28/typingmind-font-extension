/**
 * Highlighter Extension for TypingMind
 *
 * This script allows users to highlight text within chat messages.
 * Highlights are saved and persist across sessions for each chat.
 * Clicking a highlight removes it.
 */
(() => {
    'use strict';

    class Highlighter {
        // Initializes the extension by setting up constants, injecting CSS, and attaching observers.
        constructor() {
            this.STORAGE_KEY = 'typingmind-highlighter-data';
            this.HIGHLIGHT_CLASS = 'tm-highlighter-mark';
            this.SELECTORS = {
                responseBlock: '[data-element-id="response-block"]',
                messageContent: '.prose', // The container with the actual message text
            };
            this.state = this.loadAllHighlights();
        }

        // Injects the necessary CSS for the highlight style into the document head.
        injectCSS() {
            const style = document.createElement('style');
            style.textContent = `
                .${this.HIGHLIGHT_CLASS} {
                    background-color: #fefc97 !important; /* A nice yellow highlight color */
                    cursor: pointer;
                    border-radius: 3px;
                    padding: 0 2px;
                }
            `;
            document.head.appendChild(style);
        }

        // Retrieves the unique ID for the current chat from the URL.
        getChatId() {
            const match = window.location.pathname.match(/\/chat\/([^/]+)/);
            return match ? match[1] : null;
        }

        // Loads all saved highlights from localStorage.
        loadAllHighlights() {
            try {
                const data = localStorage.getItem(this.STORAGE_KEY);
                return data ? JSON.parse(data) : {};
            } catch (error) {
                console.error("Highlighter: Error loading highlights from localStorage.", error);
                return {};
            }
        }

        // Saves the current state of all highlights to localStorage.
        saveAllHighlights() {
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
            } catch (error) {
                console.error("Highlighter: Error saving highlights to localStorage.", error);
            }
        }

        // Handles the mouseup event to apply a highlight to the selected text.
        handleSelection() {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed) {
                return;
            }

            const selectedText = selection.toString().trim();
            if (selectedText.length === 0) {
                return;
            }

            const range = selection.getRangeAt(0);
            const responseBlock = range.startContainer.parentElement.closest(this.SELECTORS.responseBlock);

            // Ensure selection is within a valid message block and not on an existing highlight
            if (!responseBlock || range.startContainer.parentElement.closest(`.${this.HIGHLIGHT_CLASS}`)) {
                return;
            }
            
            // Apply the highlight and save the state
            const mark = document.createElement('span');
            mark.className = this.HIGHLIGHT_CLASS;
            
            try {
                range.surroundContents(mark);
                this.saveStateForMessage(responseBlock);
            } catch (error) {
                 // This can happen if the selection spans across multiple HTML elements.
                 // While more complex handling is possible, for most cases this is sufficient.
                console.warn("Highlighter: Could not wrap the current selection.", error);
            }

            selection.removeAllRanges(); // Clear the selection
        }
        
        // Handles clicks on existing highlights to remove them.
        handleHighlightClick(event) {
            const target = event.target;
            if (target && target.classList.contains(this.HIGHLIGHT_CLASS)) {
                const responseBlock = target.closest(this.SELECTORS.responseBlock);
                if (!responseBlock) return;

                // "Unwrap" the highlight by replacing the span with its text content
                const parent = target.parentNode;
                const text = document.createTextNode(target.textContent);
                parent.replaceChild(text, target);
                
                // Normalize the text nodes to merge adjacent ones
                parent.normalize();

                this.saveStateForMessage(responseBlock);
            }
        }

        // Saves the HTML content of a specific message block.
        saveStateForMessage(responseBlock) {
            const chatId = this.getChatId();
            const messageId = responseBlock.dataset.messageId;
            const contentElement = responseBlock.querySelector(this.SELECTORS.messageContent);

            if (!chatId || !messageId || !contentElement) return;

            if (!this.state[chatId]) {
                this.state[chatId] = {};
            }
            this.state[chatId][messageId] = contentElement.innerHTML;
            this.saveAllHighlights();
        }

        // Applies saved highlights to a message block when it appears on the screen.
        loadStateForMessage(responseBlock) {
            const chatId = this.getChatId();
            const messageId = responseBlock.dataset.messageId;
            const contentElement = responseBlock.querySelector(this.SELECTORS.messageContent);
            
            if (chatId && messageId && contentElement && this.state[chatId]?.[messageId]) {
                contentElement.innerHTML = this.state[chatId][messageId];
            }
        }

        // Uses a MutationObserver to detect when chat messages are added to the DOM.
        observeChatArea() {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // It's an element
                            // Check if the added node is a response block or contains one
                            const responseBlocks = (node.matches(this.SELECTORS.responseBlock))
                                ? [node]
                                : node.querySelectorAll(this.SELECTORS.responseBlock);

                            responseBlocks.forEach(block => this.loadStateForMessage(block));
                        }
                    });
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        // Attaches global event listeners.
        attachEventListeners() {
            // Use 'mouseup' to catch the end of a text selection.
            document.addEventListener('mouseup', this.handleSelection.bind(this));
            
            // Use 'click' to handle removal of highlights.
            document.addEventListener('click', this.handleHighlightClick.bind(this), true);
        }

        // Kicks off the extension.
        init() {
            this.injectCSS();
            this.attachEventListeners();
            this.observeChatArea();
            console.log("Highlighter extension loaded. ✍️");
        }
    }

    // Wait for the app to be ready before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const highlighterInstance = new Highlighter();
            highlighterInstance.init();
        });
    } else {
        const highlighterInstance = new Highlighter();
        highlighterInstance.init();
    }

})();
