/**
 * Text Highlighter Extension for TypingMind
 *
 * This script allows users to highlight text within chat messages.
 * Highlights persist across page loads and can be removed with a single click.
 *
 * -- MODIFIED VERSION --
 * - Highlight color changed to Amber/Orange (#ffc107).
 * - Highlight removal is now a simple left-click on the highlight.
 * - Core highlighting logic improved for stability and performance.
 */

(() => {
  'use strict';

  class TextHighlighter {
    constructor() {
      this.state = {
        selectedText: "",
        selectedRange: null,
        mouseX: 0,
        mouseY: 0,
      };

      this.SELECTORS = {
        responseBlock: '[data-element-id="response-block"]',
      };
      
      this.HIGHLIGHT_CLASS = 'typingmind-highlight';
      this.HIGHLIGHT_COLOR = '#ffc107'; // Amber/Orange color
      this.STORAGE_KEY = 'typingmind_highlights';
      this.highlights = new Map();

      this.popover = this.createPopover();
      this.debouncedShowPopover = this.debounce(this.showPopover.bind(this), 100);

      this.loadHighlights();
    }

    // --- Core Methods ---

    /**
     * Initializes the extension by attaching event listeners and applying stored highlights.
     */
    init() {
      this.attachEventListeners();
      // Use a MutationObserver to apply highlights to dynamically loaded content.
      this.observeContentChanges();
      console.log("Text Highlighter extension loaded. ✨");
    }

    /**
     * Wraps the user's current text selection in a highlight span.
     */
    highlightSelection() {
      if (!this.state.selectedRange) return;

      const highlightId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create the new span element for the highlight
      const span = document.createElement('span');
      span.className = this.HIGHLIGHT_CLASS;
      span.dataset.highlightId = highlightId;
      span.style.backgroundColor = this.HIGHLIGHT_COLOR;
      span.style.color = 'black'; // Keep text color black as requested
      span.style.cursor = 'pointer';
      
      // Add a simple click event to remove the highlight
      span.addEventListener('click', () => this.removeHighlight(highlightId), { once: true });

      try {
        // Use the robust surroundContents method to wrap the selection
        this.state.selectedRange.surroundContents(span);
        
        // Save the new highlight and clear the selection
        this.saveHighlight(highlightId, this.state.selectedText);
        window.getSelection().removeAllRanges();
      } catch (error) {
        console.error('Highlighting failed: The selection may be too complex.', error);
        // Optionally, inform the user: alert("Could not highlight this selection.");
      }
    }

    /**
     * Removes a highlight from the DOM and from storage.
     * @param {string} highlightId - The unique ID of the highlight to remove.
     */
    removeHighlight(highlightId) {
      const highlightedSpans = document.querySelectorAll(`[data-highlight-id="${highlightId}"]`);
      
      highlightedSpans.forEach(span => {
        const parent = span.parentNode;
        // Unwrap the content of the span
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
        parent.normalize(); // Merge adjacent text nodes
      });

      // Remove from storage and save the change
      if (this.highlights.has(highlightId)) {
        this.highlights.delete(highlightId);
        this.saveToStorage();
      }
    }
    
    // --- Persistence (Loading & Saving) ---

    loadHighlights() {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          this.highlights = new Map(data);
          this.applyStoredHighlights();
        }
      } catch (error) {
        console.error('Error loading highlights from localStorage:', error);
      }
    }

    saveToStorage() {
      try {
        const data = Array.from(this.highlights.entries());
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving highlights to localStorage:', error);
      }
    }
    
    saveHighlight(highlightId, text) {
      this.highlights.set(highlightId, {
        text: text,
        url: window.location.href,
      });
      this.saveToStorage();
    }
    
    /**
     * Finds and applies all stored highlights that match the current page URL.
     */
    applyStoredHighlights() {
      const currentUrl = window.location.href;
      this.highlights.forEach((highlight, highlightId) => {
        if (highlight.url === currentUrl) {
          this.searchAndHighlight(highlight.text, highlightId);
        }
      });
    }

    /**
     * Searches for a text string within response blocks and highlights it.
     * @param {string} searchText - The text content to find.
     * @param {string} highlightId - The ID to assign to the new highlight.
     */
    searchAndHighlight(searchText, highlightId) {
      // **Performance gain**: Don't re-highlight if it's already on the page.
      if (document.querySelector(`[data-highlight-id="${highlightId}"]`)) {
        return;
      }

      const responseBlocks = document.querySelectorAll(this.SELECTORS.responseBlock);
      const searchTrimmed = searchText.trim();

      responseBlocks.forEach(block => {
        const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null, false);
        let node;
        const nodesToProcess = [];
        // First, collect all nodes to avoid issues with modifying the DOM while iterating
        while(node = walker.nextNode()) {
          if (node.textContent.includes(searchTrimmed)) {
            nodesToProcess.push(node);
          }
        }
        
        // Now, process the collected nodes
        nodesToProcess.forEach(node => {
           // Check again in case a previous operation on the same block merged this node
          if (!node.parentElement || !node.textContent.includes(searchTrimmed)) return;

          const index = node.textContent.indexOf(searchTrimmed);
          if (index === -1) return;

          const range = document.createRange();
          range.setStart(node, index);
          range.setEnd(node, index + searchTrimmed.length);

          const span = document.createElement('span');
          span.className = this.HIGHLIGHT_CLASS;
          span.dataset.highlightId = highlightId;
          span.style.backgroundColor = this.HIGHLIGHT_COLOR;
          span.style.color = 'black';
          span.style.cursor = 'pointer';
          span.addEventListener('click', () => this.removeHighlight(highlightId), { once: true });
          
          // Use surroundContents for robustness, even when re-applying
          try {
            range.surroundContents(span);
          } catch(e) {
            // This can happen if the text is already partially wrapped, so we just log it.
            console.warn('Could not re-apply highlight for:', searchText);
          }
        });
      });
    }

    // --- UI & Event Handling ---

    createPopover() {
      const popover = document.createElement("button");
      popover.className = "fixed rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg p-1.5 cursor-pointer z-50 flex items-center justify-center w-auto h-auto";
      popover.innerHTML = `
        <div class="flex items-center justify-center px-2 py-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-1">
            <path d="M3.5 5.5C3.5 4.39543 4.39543 3.5 5.5 3.5H16.5C17.6046 3.5 18.5 4.39543 18.5 5.5V8.5C18.5 9.60457 17.6046 10.5 16.5 10.5H5.5C4.39543 10.5 3.5 9.60457 3.5 8.5V5.5Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M3.5 14.5C3.5 13.3954 4.39543 12.5 5.5 12.5H16.5C17.6046 12.5 18.5 13.3954 18.5 14.5V17.5C18.5 18.6046 17.6046 19.5 16.5 19.5H5.5C4.39543 19.5 3.5 18.6046 3.5 17.5V14.5Z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>
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
    
    showPopover(e) {
      const selection = window.getSelection();
      // Ensure the selection is within a valid response block
      const isSelectionInResponseBlock = selection.rangeCount > 0 && selection.getRangeAt(0).startContainer.parentElement.closest(this.SELECTORS.responseBlock);

      if (selection.isCollapsed || !isSelectionInResponseBlock) {
        this.hidePopover();
        return;
      }
      
      this.state.selectedText = selection.toString().trim();
      if (this.state.selectedText) {
        this.state.selectedRange = selection.getRangeAt(0).cloneRange();
        const rect = this.state.selectedRange.getBoundingClientRect();
        
        this.popover.style.display = "flex";
        
        // Position popover above the selection
        const popoverRect = this.popover.getBoundingClientRect();
        let left = rect.left + (rect.width / 2) - (popoverRect.width / 2);
        let top = rect.top - popoverRect.height - 8; // 8px gap
        
        // Adjust if off-screen
        if (top < 0) {
            top = rect.bottom + 8;
        }
        if (left < 0) left = 5;
        if (left + popoverRect.width > window.innerWidth) {
            left = window.innerWidth - popoverRect.width - 5;
        }

        this.popover.style.left = `${left}px`;
        this.popover.style.top = `${top + window.scrollY}px`;
      }
    }

    hidePopover() {
      if (this.popover.style.display !== 'none') {
        this.popover.style.display = 'none';
        this.state.selectedText = "";
        this.state.selectedRange = null;
      }
    }
    
    attachEventListeners() {
      // Use mouseup on the document to trigger the popover
      document.addEventListener('mouseup', this.debouncedShowPopover);
      // Mousedown to hide popover if clicking elsewhere
      document.addEventListener('mousedown', (e) => {
        if (!this.popover.contains(e.target)) {
          this.hidePopover();
        }
      });
      // Hide on scroll to prevent detached popovers
      document.addEventListener('scroll', () => this.hidePopover(), true);
    }
    
    observeContentChanges() {
        const observer = new MutationObserver((mutations) => {
            // Check if new nodes were added that could contain chat responses
            const hasNewContent = mutations.some(m => m.addedNodes.length > 0);
            if (hasNewContent) {
                // A short delay can help ensure the framework has finished rendering
                setTimeout(() => this.applyStoredHighlights(), 500);
            }
        });
      
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- Utilities ---

    debounce(func, delay) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    }
  }

  // --- Run the extension ---
  // Ensure the DOM is ready before initializing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new TextHighlighter().init();
    });
  } else {
    new TextHighlighter().init();
  }

})();
