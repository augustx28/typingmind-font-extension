/**
 * Highlighter Extension for TypingMind
 *
 * This script allows users to select text within chat messages
 * and apply a persistent highlight to it. Clicking a highlighted
 * section removes the highlight.
 */
(() => {
    'use strict';

    class Highlighter {
        // Initializes the extension.
        constructor() {
            // Selector for the chat message blocks.
            this.SELECTORS = {
                responseBlock: '[data-element-id="response-block"]',
            };
            // The CSS class that will be applied to highlighted text.
            this.HIGHLIGHT_CLASS = 'tm-persistent-highlight';
        }

        /**
         * Injects the necessary CSS for the highlight style into the page.
         * It checks if the styles already exist to avoid duplication.
         */
        injectStyles() {
            if (document.getElementById('typingmind-highlighter-styles')) return;

            const style = document.createElement('style');
            style.id = 'typingmind-highlighter-styles';
            style.innerHTML = `
                .${this.HIGHLIGHT_CLASS} {
                    background-color: #FFDC00; /* A nice, vibrant yellow */
                    color: black;
                    border-radius: 3px;
                    padding: 1px 0;
                    cursor: pointer; /* Indicates that the highlight is clickable */
                    transition: background-color 0.2s ease-in-out;
                }
                .${this.HIGHLIGHT_CLASS}:hover {
                    background-color: #FFB000; /* Darkens slightly on hover */
                }
            `;
            document.head.appendChild(style);
        }

        /**
         * Wraps the current user text selection with a <mark> element
         * to apply the highlight style.
         */
        highlightSelection() {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed) return;

            const range = selection.getRangeAt(0);
            const container = range.commonAncestorContainer;

            // Ensure the selection is inside a valid chat response block.
            const responseBlock = (container.nodeType === Node.ELEMENT_NODE ? container : container.parentElement)
                                 .closest(this.SELECTORS.responseBlock);

            if (!responseBlock) {
                selection.removeAllRanges();
                return;
            }

            try {
                // Create the <mark> element that will act as the highlight.
                const mark = document.createElement('mark');
                mark.className = this.HIGHLIGHT_CLASS;

                // Wrap the selected content with the new <mark> element.
                range.surroundContents(mark);
            } catch (error) {
                console.warn("Highlighter: Could not highlight selection, possibly due to complex content.", error);
            } finally {
                // Clear the selection after highlighting.
                selection.removeAllRanges();
            }
        }
        
        /**
         * Removes a highlight when it's clicked. This function uses event
         * delegation to efficiently handle clicks.
         * @param {MouseEvent} event - The click event.
         */
        unHighlight(event) {
            const target = event.target;

            // If the clicked element is one of our highlights...
            if (target && target.classList.contains(this.HIGHLIGHT_CLASS)) {
                event.preventDefault();
                event.stopPropagation();

                // ...replace the <mark> element with its inner content (the text).
                // This cleanly "unwraps" the text and removes the highlight.
                target.replaceWith(...target.childNodes);
            }
        }

        /**
         * Binds the necessary global event listeners for the extension to function.
         */
        attachEventListeners() {
            // Apply a highlight when the user finishes a text selection.
            document.addEventListener('mouseup', this.highlightSelection.bind(this));

            // Listen for clicks on the entire document to handle un-highlighting.
            document.addEventListener('click', this.unHighlight.bind(this), true);
        }

        /**
         * Kicks off the extension by injecting styles and attaching event listeners.
         */
        init() {
            this.injectStyles();
            this.attachEventListeners();
            console.log("Highlighter extension loaded. ✨");
        }
    }

    // Create an instance of the Highlighter and initialize it.
    const highlighterInstance = new Highlighter();
    highlighterInstance.init();

})();
