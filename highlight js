/**
 * Text Highlighter Extension for TypingMind
 *
 * This script allows users to highlight text within chat messages.
 * Highlights persist across page loads and can be removed with a simple click.
 *
 * ## Version 2.0.0 Update Notes
 * - Highlight color changed to a soft orange (#FFA726).
 * - Added `touchend` event support for creating highlights on mobile devices.
 * - Deletion trigger changed from `contextmenu` (right-click) to `click` for easier use on all devices.
 * - Improved deletion popup positioning to appear below the clicked highlight.
 * - Added a check to prevent re-highlighting already highlighted text when loading from storage.
 */

(() => {
  'use strict';

  class TextHighlighter {
    constructor() {
      // --- Configuration ---
      this.HIGHLIGHT_COLOR = '#FFA726'; // Soft orange color for highlights
      this.STORAGE_KEY = 'typingmind_highlights_v2';
      this.SELECTORS = {
        responseBlock: '[data-element-id="response-block"]',
        highlightSpan: 'typingmind-highlight',
      };

      // --- State ---
      this.state = {
        selectedText: "",
        selectedRange: null,
        mouseX: 0,
        mouseY: 0,
      };
      this.highlights = new Map();

      // --- Initialization ---
      this.popover = this.createPopover();
      this.debouncedShowPopover = this.debounce(this.showPopover.bind(this), 100);
      this.loadHighlights();
    }

    // --- Core Methods ---

    /**
     * Highlights the current user text selection.
     */
    highlightSelection() {
      if (!this.state.selectedRange) return;

      const highlightId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const range = this.state.selectedRange;
      
      try {
        // A robust way to handle selections that may span multiple nodes.
        const fragment = range.extractContents();
        const span = this.createHighlightSpan(highlightId);
        span.appendChild(fragment);
        range.insertNode(span);
        
        this.addRemoveListener(span, highlightId);
        
        // Save the highlight
        this.saveHighlight(highlightId, span.textContent);
        
        // Clear the selection from the screen
        window.getSelection().removeAllRanges();
      } catch (error) {
        console.error('Error applying highlight:', error);
      }
    }

    /**
     * Removes a highlight from the DOM and storage.
     * @param {string} highlightId - The unique ID of the highlight to remove.
     */
    removeHighlight(highlightId) {
      document.querySelectorAll(`[data-highlight-id="${highlightId}"]`).forEach(span => {
        const parent = span.parentNode;
        // Unwrap the content of the span
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
        parent.normalize(); // Merges adjacent text nodes
      });

      // Remove from storage
      this.highlights.delete(highlightId);
      this.saveToStorage();
    }

    // --- DOM & UI Methods ---

    /**
     * Creates the main popover for the "Highlight" button.
     */
    createPopover() {
      const popover = document.createElement("button");
      popover.className = "fixed rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg p-1.5 cursor-pointer z-50 flex items-center justify-center";
      popover.innerHTML = `
        <div class="flex items-center justify-center px-2 py-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-1"><path d="M3.5 14.5C3.5 13.3954 4.39543 12.5 5.5 12.5H16.5C17.6046 12.5 18.5 13.3954 18.5 14.5V17.5C18.5 18.6046 17.6046 19.5 16.5 19.5H5.5C4.39543 19.5 3.5 18.6046 3.5 17.5V14.5Z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/><path d="M11 3.5L20.5 12.5V17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5.5 10.5L3.5 8.5V5.5C3.5 4.39543 4.39543 3.5 5.5 3.5H16.5C17.6046 3.5 18.5 4.39543 18.5 5.5V8.5C18.5 9.60457 17.6046 10.5 16.5 10.5H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
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
     * Creates the span element used for highlighting text.
     * @param {string} highlightId - The unique ID for this highlight.
     * @returns {HTMLSpanElement} The configured span element.
     */
    createHighlightSpan(highlightId) {
      const span = document.createElement('span');
      span.className = this.SELECTORS.highlightSpan;
      span.dataset.highlightId = highlightId;
      span.style.cssText = `
        background-color: ${this.HIGHLIGHT_COLOR};
        color: black;
        padding: 1px 0;
        border-radius: 3px;
        cursor: pointer;
      `;
      return span;
    }
    
    /**
     * Shows the popover button above the selected text.
     */
    showPopover() {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        this.hidePopover();
        return;
      }
      
      const isInsideResponseBlock = selection.anchorNode.parentElement.closest(this.SELECTORS.responseBlock);
      if (!isInsideResponseBlock) {
        this.hidePopover();
        return;
      }

      this.state.selectedText = selection.toString();
      this.state.selectedRange = selection.getRangeAt(0).cloneRange();
      
      const rangeRect = this.state.selectedRange.getBoundingClientRect();
      const popoverRect = this.popover.getBoundingClientRect();
      const GAP = 10;
      
      let left = window.scrollX + rangeRect.left + (rangeRect.width / 2) - (popoverRect.width / 2);
      let top = window.scrollY + rangeRect.top - popoverRect.height - GAP;

      // Adjust if popover goes off-screen
      if (top < window.scrollY) {
        top = window.scrollY + rangeRect.bottom + GAP;
      }
      if (left < 0) left = 10;
      if (left + popoverRect.width > window.innerWidth) {
        left = window.innerWidth - popoverRect.width - 10;
      }
      
      this.popover.style.left = `${left}px`;
      this.popover.style.top = `${top}px`;
      this.popover.style.display = "flex";
    }

    /**
     * Shows a small popup to confirm highlight removal.
     * @param {MouseEvent} e - The click event.
     * @param {string} highlightId - The ID of the clicked highlight.
     */
    showRemovePopup(e, highlightId) {
      // Prevent other popups from showing
      this.hidePopover();
      
      const removePopup = document.createElement('div');
      removePopup.className = 'fixed rounded-lg bg-red-500 text-white border border-red-600 shadow-lg p-2 cursor-pointer z-50';
      removePopup.innerHTML = `
        <div class="flex items-center px-2 py-1 hover:bg-red-600 rounded">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2"><path d="M2 4h12M5 4V2.5C5 2.22386 5.22386 2 5.5 2h5c.27614 0 .5.22386.5.5V4m1 0v9.5c0 .27614-.22386.5-.5.5h-7c-.27614 0-.5-.22386-.5-.5V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span class="text-sm">Remove</span>
        </div>`;
      
      const rect = e.currentTarget.getBoundingClientRect();
      removePopup.style.left = `${window.scrollX + rect.left}px`;
      removePopup.style.top = `${window.scrollY + rect.bottom + 8}px`;
      
      removePopup.onclick = (event) => {
        event.stopPropagation();
        this.removeHighlight(highlightId);
        removePopup.remove();
      };

      document.body.appendChild(removePopup);

      // Self-destruct logic for the removal popup
      setTimeout(() => {
        const removeOnClickOutside = (event) => {
          if (!removePopup.contains(event.target)) {
            removePopup.remove();
            document.removeEventListener('click', removeOnClickOutside, true);
          }
        };
        document.addEventListener('click', removeOnClickOutside, true);
      }, 0);
    }

    hidePopover() {
      this.popover.style.display = "none";
      this.state.selectedText = "";
      this.state.selectedRange = null;
    }

    // --- Storage and Persistence ---

    saveHighlight(highlightId, text) {
      this.highlights.set(highlightId, {
        id: highlightId,
        text: text,
        url: window.location.href, // Scope highlights to the current chat
        timestamp: Date.now()
      });
      this.saveToStorage();
    }

    saveToStorage() {
      const data = Array.from(this.highlights.entries());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    loadHighlights() {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          this.highlights = new Map(JSON.parse(stored));
          // Use a MutationObserver to apply highlights when chat content changes
          this.observeContentChanges();
        } catch (error) {
          console.error("Failed to load or parse highlights:", error);
          this.highlights = new Map();
        }
      }
    }

    /**
     * Applies stored highlights by searching for text content on the page.
     */
    applyStoredHighlights() {
      const currentUrl = window.location.href;
      this.highlights.forEach((highlight, id) => {
        if (highlight.url === currentUrl && !document.querySelector(`[data-highlight-id="${id}"]`)) {
          this.findAndWrapText(highlight.text, id);
        }
      });
    }

    /**
     * Finds text within response blocks and wraps it in a highlight span.
     * @param {string} searchText - The text content to find.
     * @param {string} highlightId - The ID to assign to the highlight.
     */
    findAndWrapText(searchText, highlightId) {
        const responseBlocks = document.querySelectorAll(this.SELECTORS.responseBlock);
        const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(escapedText, 'g');

        responseBlocks.forEach(block => {
            const walker = document.createTreeWalker(block, Node.TEXT_NODE, {
                acceptNode: (node) => {
                    // **CRITICAL**: Skip nodes that are already part of a highlight
                    if (node.parentElement.classList.contains(this.SELECTORS.highlightSpan)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (searchRegex.test(node.nodeValue)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            });

            const nodesToProcess = [];
            while (walker.nextNode()) nodesToProcess.push(walker.currentNode);

            nodesToProcess.forEach(node => {
                const matches = node.nodeValue.match(searchRegex);
                if (!matches) return;

                const parts = node.nodeValue.split(searchRegex);
                const parent = node.parentNode;
                
                for (let i = 0; i < parts.length; i++) {
                    parent.insertBefore(document.createTextNode(parts[i]), node);
                    if (i < parts.length - 1) {
                        const span = this.createHighlightSpan(highlightId);
                        span.textContent = matches[i];
                        this.addRemoveListener(span, highlightId);
                        parent.insertBefore(span, node);
                    }
                }
                parent.removeChild(node);
            });
        });
    }


    // --- Event Handling ---

    addRemoveListener(element, highlightId) {
      // ⭐ Changed from 'contextmenu' to 'click' for mobile/desktop convenience
      element.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Stop event from triggering other listeners
        this.showRemovePopup(e, highlightId);
      });
    }

    observeContentChanges() {
        const observer = new MutationObserver(this.debounce(() => {
            this.applyStoredHighlights();
        }, 500)); // Debounce to avoid excessive calls

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        // Initial application
        setTimeout(() => this.applyStoredHighlights(), 500);
    }
    
    attachEventListeners() {
      // ⭐ Added 'touchend' for mobile support
      document.addEventListener('mouseup', this.showPopover.bind(this));
      document.addEventListener('touchend', this.showPopover.bind(this));
      
      // Hide popover on scroll or click outside
      document.addEventListener('scroll', () => this.hidePopover(), true);
      document.addEventListener('mousedown', (e) => {
        if (!this.popover.contains(e.target)) {
          this.hidePopover();
        }
      });
    }

    /**
     * Utility to debounce a function call.
     */
    debounce(func, delay) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    }

    /**
     * Entry point for the extension.
     */
    init() {
      this.attachEventListeners();
      console.log("🧡 Text Highlighter extension loaded successfully.");
    }
  }

  // --- Run the extension ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new TextHighlighter().init());
  } else {
    new TextHighlighter().init();
  }
})();
