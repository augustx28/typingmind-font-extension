/**
 * Text Highlighter Extension for TypingMind (Updated Version)
 *
 * This script allows users to highlight text within chat messages.
 * Highlights persist across page loads.
 * Re-selecting a highlight allows for its removal.
 *
 * @version 2.0
 * @author Gemini
 */

(() => {
    'use strict';

    // Ensure the script doesn't run more than once
    if (window.textHighlighterInstance) {
        return;
    }

    class TextHighlighter {
        constructor() {
            // --- Configuration ---
            this.STORAGE_KEY = 'typingmind_highlights_v2';
            this.HIGHLIGHT_CLASS = 'typingmind-highlight';
            this.POPOVER_CLASS = 'tm-highlighter-popover';
            this.HIGHLIGHT_COLOR = '#ffc107'; // Amber/orange highlight color

            // --- State ---
            this.state = {
                selectedRange: null,
            };
            this.highlights = new Map(); // Stores { id: { text, url } }

            // --- Debouncing for performance ---
            this.debouncedApplyHighlights = this.debounce(this.applyStoredHighlights, 500);
            this.handleMouseUp = this.handleMouseUp.bind(this);
        }

        /**
         * Initializes the extension by injecting styles, loading data, and attaching listeners.
         */
        init() {
            this.injectStyles();
            this.popover = this.createPopover();
            this.loadHighlightsFromStorage();
            this.attachEventListeners();
            // Initial application of highlights after a short delay for page content to load
            setTimeout(() => this.applyStoredHighlights(), 1000);
            console.log("Text Highlighter extension loaded successfully. 🚀");
        }

        // ## Core Highlighting Logic ##

        /**
         * Toggles a highlight on the current selection.
         * If the selection is already highlighted, it removes the highlight.
         * Otherwise, it creates a new one.
         */
        toggleHighlight() {
            if (!this.state.selectedRange) return;

            const range = this.state.selectedRange;
            const container = range.commonAncestorContainer;
            
            // Check if the selection is inside an existing highlight
            const existingHighlight = container.nodeType === Node.ELEMENT_NODE ?
                container.closest(`.${this.HIGHLIGHT_CLASS}`) :
                container.parentElement.closest(`.${this.HIGHLIGHT_CLASS}`);

            if (existingHighlight) {
                const highlightId = existingHighlight.dataset.highlightId;
                this.removeHighlight(highlightId);
            } else {
                this.createHighlightFromRange(range);
            }

            this.hidePopover();
            window.getSelection().removeAllRanges();
        }

        /**
         * Creates a new highlight span around the given Range object.
         * @param {Range} range - The range of content to highlight.
         */
        createHighlightFromRange(range) {
            const selectedText = range.toString().trim();
            if (!selectedText) return;

            const highlightId = `tm-highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            try {
                const span = document.createElement('span');
                span.className = this.HIGHLIGHT_CLASS;
                span.dataset.highlightId = highlightId;

                // Use range.surroundContents() for simple cases, which is very efficient.
                // It works when the range starts and ends in the same parent.
                // For complex selections across multiple elements, we fall back to a robust method.
                if (range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
                     range.surroundContents(span);
                } else {
                    // Fallback for complex ranges: extract, wrap, and insert.
                    span.appendChild(range.extractContents());
                    range.insertNode(span);
                }

                this.saveHighlight(highlightId, selectedText, window.location.href);
            } catch (error) {
                console.error('Error creating highlight:', error);
                // In case of an error with surroundContents on a complex range, try the robust method.
                try {
                    const span = document.createElement('span');
                    span.className = this.HIGHLIGHT_CLASS;
                    span.dataset.highlightId = highlightId;
                    span.appendChild(range.extractContents());
                    range.insertNode(span);
                    this.saveHighlight(highlightId, selectedText, window.location.href);
                } catch (fallbackError) {
                     console.error('Fallback highlight method also failed:', fallbackError);
                }
            }
        }

        /**
         * Removes a highlight from the DOM and from storage.
         * @param {string} highlightId - The ID of the highlight to remove.
         */
        removeHighlight(highlightId) {
            const span = document.querySelector(`[data-highlight-id="${highlightId}"]`);
            if (!span) return;

            const parent = span.parentNode;
            // Move all children of the span (the original text/nodes) out
            // and place them right before the span.
            while (span.firstChild) {
                parent.insertBefore(span.firstChild, span);
            }
            // Remove the now-empty span
            parent.removeChild(span);
            // Merge adjacent text nodes for a clean DOM
            parent.normalize();

            this.highlights.delete(highlightId);
            this.saveHighlightsToStorage();
        }

        // ## Persistence (Loading & Saving) ##

        saveHighlight(id, text, url) {
            this.highlights.set(id, { text, url });
            this.saveHighlightsToStorage();
        }

        saveHighlightsToStorage() {
            try {
                const data = Array.from(this.highlights.entries());
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            } catch (error) {
                console.error('Error saving highlights to storage:', error);
            }
        }

        loadHighlightsFromStorage() {
            try {
                const storedData = localStorage.getItem(this.STORAGE_KEY);
                if (storedData) {
                    this.highlights = new Map(JSON.parse(storedData));
                }
            } catch (error) {
                console.error('Error loading highlights from storage:', error);
            }
        }

        /**
         * Scans the document and applies any stored highlights relevant to the current URL.
         * This is a "best-effort" text-based search.
         */
        applyStoredHighlights() {
            const currentUrl = window.location.href;
            const contentArea = document.querySelector('main') || document.body;

            this.highlights.forEach((highlightData, highlightId) => {
                if (highlightData.url !== currentUrl) return;
                if (document.querySelector(`[data-highlight-id="${highlightId}"]`)) return;

                this.findAndWrapText(contentArea, highlightData.text, highlightId);
            });
        }

        findAndWrapText(container, searchText, highlightId) {
            const treeWalker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, (node) => {
                const parentElement = node.parentElement;
                // Filter out nodes that are already highlighted or inside scripts/styles
                if (parentElement.closest(`.${this.HIGHLIGHT_CLASS}, script, style, .${this.POPOVER_CLASS}`)) {
                    return NodeFilter.FILTER_REJECT;
                }
                if (node.nodeValue.trim() === '') {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            });

            let currentNode;
            const nodesToProcess = [];
            while (currentNode = treeWalker.nextNode()) {
                if (currentNode.nodeValue.includes(searchText)) {
                    nodesToProcess.push(currentNode);
                }
            }
            
            // Process nodes in reverse to avoid issues with range modification
            for(const node of nodesToProcess.reverse()){
                const text = node.nodeValue;
                const index = text.lastIndexOf(searchText); // Use lastIndexOf with reverse traversal

                if (index !== -1) {
                    try {
                        const range = document.createRange();
                        range.setStart(node, index);
                        range.setEnd(node, index + searchText.length);
                        
                        const span = document.createElement('span');
                        span.className = this.HIGHLIGHT_CLASS;
                        span.dataset.highlightId = highlightId;
                        range.surroundContents(span);
                        return; // Exit after finding and wrapping the first match
                    } catch (e) {
                        // This can happen if the found text spans across nodes, which this simple method doesn't handle.
                        // A full-fledged solution requires more complex range manipulation.
                        // For this extension's purpose, we accept this limitation.
                    }
                }
            }
        }


        // ## UI and Event Handling ##

        injectStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .${this.HIGHLIGHT_CLASS} {
                    background-color: ${this.HIGHLIGHT_COLOR};
                    color: black;
                    border-radius: 3px;
                    padding: 1px 0;
                }
                .${this.POPOVER_CLASS} {
                    position: absolute; /* Positioned via transform */
                    z-index: 10000;
                    background-color: #2D3748; /* dark gray */
                    color: white;
                    border: 1px solid #4A5568;
                    border-radius: 6px;
                    padding: 5px 12px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                    display: none; /* Hidden by default */
                    user-select: none;
                    transition: background-color 0.15s ease-in-out;
                }
                .${this.POPOVER_CLASS}:hover {
                    background-color: #4A5568;
                }
            `;
            document.head.appendChild(style);
        }

        createPopover() {
            const popover = document.createElement("button");
            popover.className = this.POPOVER_CLASS;
            document.body.appendChild(popover);

            popover.addEventListener('mousedown', (e) => {
                e.preventDefault(); // Prevent mousedown from clearing the selection
                e.stopPropagation();
                this.toggleHighlight();
            });

            return popover;
        }

        handleMouseUp(e) {
            if (e.target.closest(`.${this.POPOVER_CLASS}`)) {
                return;
            }

            setTimeout(() => {
                const selection = window.getSelection();
                if (!selection || selection.isCollapsed || selection.toString().trim().length === 0) {
                    this.hidePopover();
                    return;
                }

                const responseBlock = selection.anchorNode?.parentElement.closest('[data-element-id="response-block"]');
                if (!responseBlock) {
                    this.hidePopover();
                    return;
                }

                this.state.selectedRange = selection.getRangeAt(0).cloneRange();
                const rangeBounds = this.state.selectedRange.getBoundingClientRect();
                this.showPopover(rangeBounds);
                
            }, 10);
        }

        showPopover(bounds) {
            const container = this.state.selectedRange.commonAncestorContainer;
            const isInsideHighlight = container.nodeType === Node.ELEMENT_NODE ?
                container.closest(`.${this.HIGHLIGHT_CLASS}`) :
                container.parentElement.closest(`.${this.HIGHLIGHT_CLASS}`);

            this.popover.textContent = isInsideHighlight ? "Remove Highlight" : "Highlight";

            this.popover.style.display = 'block'; // Make it visible to measure its dimensions
            const popoverRect = this.popover.getBoundingClientRect();

            let top = window.scrollY + bounds.top - popoverRect.height - 8;
            let left = window.scrollX + bounds.left + (bounds.width / 2) - (popoverRect.width / 2);

            // Keep popover on screen
            if (top < window.scrollY) top = window.scrollY + bounds.bottom + 8;
            if (left < 10) left = 10;
            if (left + popoverRect.width > window.innerWidth) left = window.innerWidth - popoverRect.width - 10;

            this.popover.style.left = `${left}px`;
            this.popover.style.top = `${top}px`;
        }

        hidePopover() {
            if (this.popover) {
                this.popover.style.display = 'none';
            }
            this.state.selectedRange = null;
        }

        attachEventListeners() {
            document.addEventListener('mouseup', this.handleMouseUp);
            document.addEventListener('scroll', () => this.hidePopover(), true);
            document.addEventListener('mousedown', (e) => {
                if (!e.target.closest(`.${this.POPOVER_CLASS}`)) {
                    this.hidePopover();
                }
            });

            const observer = new MutationObserver((mutations) => {
                const hasAddedNodes = mutations.some(m => m.addedNodes.length > 0 && Array.from(m.addedNodes).some(n => n.nodeType === Node.ELEMENT_NODE));
                if (hasAddedNodes) {
                    this.debouncedApplyHighlights();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        // ## Utilities ##
        
        debounce(func, delay) {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
            };
        }
    }

    // --- Entry Point ---
    window.textHighlighterInstance = new TextHighlighter();
    window.textHighlighterInstance.init();

})();
