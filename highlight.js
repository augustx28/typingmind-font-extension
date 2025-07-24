/**
 * Text Highlighter Extension for TypingMind (Updated)
 *
 * This script allows users to highlight text within chat messages.
 * Highlights persist across page loads and can be removed with a single click.
 *
 * ## Key Improvements:
 * - **Instant Popover**: The highlight button appears immediately after you select text.
 * - **New Color**: Highlights now use an amber color (#FFC107) for better visibility, while text remains black.
 * - **Simple Deletion**: Just click on any highlighted text to permanently remove the highlight. The old right-click menu is gone.
 * - **Bug Fixes & Stability**: The core highlighting logic has been rewritten to be more robust, preventing errors with complex selections. Popover positioning is also more accurate.
 * - **Performance**: The script is now more efficient at applying saved highlights when new messages are loaded.
 */

(() => {
  'use strict';

  class TextHighlighter {
    constructor() {
      this.state = {
        selectedText: "",
        selectedRange: null,
      };

      this.SELECTORS = {
        // Selector for the block containing the AI's response text
        responseBlock: '[data-element-id="response-block"]',
      };

      this.STORAGE_KEY = 'typingmind_highlights';
      this.highlights = new Map(); // Stores highlights by a unique ID
      
      this.popover = this.createPopover();
      
      // Load any highlights saved from previous sessions
      this.loadHighlights();
    }

    createPopover() {
      const popover = document.createElement("button");
      popover.className = "fixed rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg p-1.5 cursor-pointer z-50 flex items-center justify-center w-auto h-auto";
      popover.innerHTML = `
        <div class="flex items-center justify-center px-2 py-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-1">
            <path d="M3.5 5.5C3.5 4.39543 4.39543 3.5 5.5 3.5H16.5C17.6046 3.5 18.5 4.39543 18.5 5.5V8.5C18.5 9.60457 17.6046 10.5 16.5 10.5H5.5C4.39543 10.5 3.5 9.60457 3.5 8.5V5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3.5 14.5C3.5 13.3954 4.39543 12.5 5.5 12.5H16.5C17.6046 12.5 18.5 13.3954 18.5 14.5V17.5C18.5 18.6046 17.6046 19.5 16.5 19.5H5.5C4.39543 19.5 3.5 18.6046 3.5 17.5V14.5Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20.5 6.5V17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="text-sm font-medium">Highlight</span>
        </div>`;
      popover.style.display = "none";
      popover.onclick = () => {
        this.highlightSelection();
        this.hidePopover();
      };
      document.body.appendChild(popover);
      return popover;
    }

    /**
     * Creates a highlight span around the currently selected text.
     * This implementation is robust and correctly handles complex selections.
     */
    highlightSelection() {
      if (!this.state.selectedRange) return;

      const highlightId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        const span = this.createHighlightSpan(highlightId);
        
        // Use extractContents which is robust for complex selections.
        // It removes the selected content from the DOM and returns it as a fragment.
        const selectedContents = this.state.selectedRange.extractContents();
        span.appendChild(selectedContents);
        
        // Insert the new span (containing the original content) back into the document.
        this.state.selectedRange.insertNode(span);

        this.saveHighlight(highlightId, span.textContent);
        window.getSelection().removeAllRanges();

      } catch (error) {
        console.error('Error applying highlight:', error);
      }
    }

    /**
     * A helper function to create the styled highlight span with its click-to-remove behavior.
     * @param {string} highlightId - The unique ID for this highlight.
     * @returns {HTMLElement} The configured <span> element.
     */
    createHighlightSpan(highlightId) {
        const span = document.createElement('span');
        span.className = 'typingmind-highlight';
        span.dataset.highlightId = highlightId;
        span.title = 'Click to remove highlight'; // Tooltip for better usability
        span.style.cssText = `
            background-color: #FFC107; /* UPDATED: Amber color */
            color: black;
            border-radius: 3px;
            padding: 1px 0;
            cursor: pointer;
        `;

        // IMPROVEMENT: Simplified removal with a direct left-click.
        span.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.removeHighlight(highlightId);
        });

        return span;
    }

    /**
     * Removes a highlight from the document and from storage.
     * @param {string} highlightId - The ID of the highlight to remove.
     */
    removeHighlight(highlightId) {
      const highlights = document.querySelectorAll(`[data-highlight-id="${highlightId}"]`);
      
      highlights.forEach(span => {
        const parent = span.parentNode;
        // Unwrap the span, restoring the original text node(s).
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
        parent.normalize(); // Merges adjacent text nodes for a clean DOM.
      });

      // Remove from storage and save the updated state.
      this.highlights.delete(highlightId);
      this.saveToStorage();
    }
    
    saveHighlight(highlightId, text) {
      this.highlights.set(highlightId, {
        id: highlightId,
        text: text,
        url: window.location.href,
        timestamp: Date.now()
      });
      this.saveToStorage();
    }

    saveToStorage() {
      try {
        const data = Array.from(this.highlights.entries());
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving highlights to storage:', error);
      }
    }

    loadHighlights() {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          this.highlights = new Map(JSON.parse(stored));
          this.applyStoredHighlights();
        }
      } catch (error) {
        console.error('Error loading highlights from storage:', error);
      }
    }

    applyStoredHighlights() {
      const currentUrl = window.location.href;
      
      // IMPROVEMENT: Reduced delay for faster application on load.
      setTimeout(() => {
        this.highlights.forEach((highlight) => {
          if (highlight.url === currentUrl) {
            this.searchAndHighlight(highlight.text, highlight.id);
          }
        });
      }, 500);
    }
    
    /**
     * Finds text within the page and wraps it to restore highlights on page load.
     */
    searchAndHighlight(searchText, highlightId) {
        if (!searchText) return;
        const responseBlocks = document.querySelectorAll(this.SELECTORS.responseBlock);

        responseBlocks.forEach(block => {
            // Use TreeWalker to reliably find text nodes, even in complex HTML.
            const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null, false);
            const nodesToProcess = [];
            let node;
            while (node = walker.nextNode()) {
                // BUG FIX: Avoid re-highlighting text that's already part of a highlight.
                if (node.parentNode.className !== 'typingmind-highlight') {
                    nodesToProcess.push(node);
                }
            }

            nodesToProcess.forEach(node => {
                const index = node.textContent.indexOf(searchText);
                if (index !== -1) {
                    const range = document.createRange();
                    range.setStart(node, index);
                    range.setEnd(node, index + searchText.length);
                    
                    const span = this.createHighlightSpan(highlightId);
                    range.surroundContents(span);
                }
            });
        });
    }

    getSelectionText() {
      const selection = window.getSelection();
      return selection ? selection.toString().trim() : "";
    }

    /**
     * Shows the popover UI element above the current text selection.
     */
    showPopover(e) {
      const selection = window.getSelection();
      const responseBlock = e.target.closest(this.SELECTORS.responseBlock);

      if (!selection || selection.isCollapsed || !responseBlock) {
        return;
      }

      this.state.selectedText = this.getSelectionText();
      
      if (this.state.selectedText && selection.rangeCount > 0) {
        this.state.selectedRange = selection.getRangeAt(0).cloneRange();
        
        // IMPROVEMENT: Use the selection's own rectangle for precise positioning.
        const rect = this.state.selectedRange.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        this.popover.style.display = "flex";
        this.popover.style.left = `${scrollLeft + rect.left + (rect.width / 2) - (this.popover.offsetWidth / 2)}px`;
        let top = scrollTop + rect.top - this.popover.offsetHeight - 8;
        if (top < scrollTop) { // Prevent popover from going off-screen at the top
            top = scrollTop + rect.bottom + 8;
        }
        this.popover.style.top = `${top}px`;

      } else {
        this.hidePopover();
      }
    }

    hidePopover() {
      this.popover.style.display = "none";
      this.state.selectedText = "";
      this.state.selectedRange = null;
    }

    /**
     * Attaches all necessary global event listeners.
     */
    attachEventListeners() {
      // IMPROVEMENT: Popover now appears instantly on mouseup.
      document.addEventListener('mouseup', this.showPopover.bind(this));

      document.addEventListener('mousedown', (e) => {
        if (!this.popover.contains(e.target) && !window.getSelection().toString()) {
          this.hidePopover();
        }
      });

      document.addEventListener('scroll', () => this.hidePopover(), true);

      // Watch for new chat messages being added to the DOM.
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            this.applyStoredHighlights();
            break; 
          }
        }
      });
      
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
    }

    init() {
      this.attachEventListeners();
      console.log("✅ Text Highlighter extension updated and loaded.");
    }
  }

  // Create an instance and run the extension
  const textHighlighter = new TextHighlighter();
  textHighlighter.init();

})();
