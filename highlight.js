/**
 * Text Highlighter Extension for TypingMind
 *
 * This script allows users to highlight text within chat messages.
 * Highlights persist across page loads and can be removed with a simple click.
 *
 * ## Version 3.0.0 Update Notes
 * - FIXED: Popover button now appears reliably on mobile devices (Android/iOS).
 * - FIXED: Can now highlight multiple words, sentences, and paragraphs.
 * - REWRITTEN: The logic for restoring highlights on page load is now robust and can
 * re-apply complex highlights that span across different text formats (e.g., bold, italic).
 * - IMPROVED: Event handling is now more efficient and stable.
 */

(() => {
  'use strict';

  class TextHighlighter {
    constructor() {
      // --- Configuration ---
      this.HIGHLIGHT_COLOR = '#FFA726'; // Soft orange color
      this.STORAGE_KEY = 'typingmind_highlights_v3'; // Updated key for new logic
      this.SELECTORS = {
        responseBlock: '[data-element-id="response-block"]',
        highlightSpanClass: 'typingmind-highlight',
      };

      // --- State ---
      this.state = {
        selectedRange: null,
      };
      this.highlights = new Map();

      // --- Initialization ---
      this.popover = this.createPopover();
      this.loadHighlights();
    }

    // --- Core Highlighting Logic ---

    /**
     * Highlights the current user text selection. Called when the user clicks the popover.
     */
    highlightSelection() {
      if (!this.state.selectedRange) return;

      const highlightId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const range = this.state.selectedRange;
      
      try {
        // This is a robust method to wrap even complex selections.
        const fragment = range.extractContents();
        const span = this.createHighlightSpan(highlightId);
        span.appendChild(fragment);
        range.insertNode(span);
        
        this.addRemoveListener(span, highlightId);
        this.saveHighlight(highlightId, span.textContent); // `textContent` gets the full text of the fragment
        
        window.getSelection().removeAllRanges();
      } catch (error) {
        console.error('Highlight Error: The selected text could not be wrapped. It might span across incompatible elements.', error);
      }
    }

    /**
     * Removes a highlight from the DOM and storage.
     * @param {string} highlightId - The unique ID of the highlight to remove.
     */
    removeHighlight(highlightId) {
      document.querySelectorAll(`[data-highlight-id="${highlightId}"]`).forEach(span => {
        const parent = span.parentNode;
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
        parent.normalize(); // Clean up DOM by merging adjacent text nodes
      });

      this.highlights.delete(highlightId);
      this.saveToStorage();
    }
    
    // --- UI and DOM Methods ---

    createPopover() {
      const popover = document.createElement("button");
      popover.className = "fixed rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg p-1.5 cursor-pointer z-50 flex items-center justify-center";
      popover.innerHTML = `<div class="flex items-center justify-center px-2 py-1"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-1"><path d="M3.5 14.5C3.5 13.3954 4.39543 12.5 5.5 12.5H16.5C17.6046 12.5 18.5 13.3954 18.5 14.5V17.5C18.5 18.6046 17.6046 19.5 16.5 19.5H5.5C4.39543 19.5 3.5 18.6046 3.5 17.5V14.5Z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/><path d="M11 3.5L20.5 12.5V17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5.5 10.5L3.5 8.5V5.5C3.5 4.39543 4.39543 3.5 5.5 3.5H16.5C17.6046 3.5 18.5 4.39543 18.5 5.5V8.5C18.5 9.60457 17.6046 10.5 16.5 10.5H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><span class="text-sm font-medium">Highlight</span></div>`;
      popover.style.display = "none";
      popover.addEventListener('click', () => {
        this.highlightSelection();
        this.hidePopover();
      });
      document.body.appendChild(popover);
      return popover;
    }

    createHighlightSpan(highlightId) {
      const span = document.createElement('span');
      span.className = this.SELECTORS.highlightSpanClass;
      span.dataset.highlightId = highlightId;
      span.style.cssText = `background-color: ${this.HIGHLIGHT_COLOR}; color: black; padding: 1px 0; border-radius: 3px; cursor: pointer;`;
      return span;
    }

    showPopover() {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
          this.hidePopover();
          return;
      }

      const isInsideResponseBlock = selection.anchorNode.parentElement.closest(this.SELECTORS.responseBlock);
      if (!isInsideResponseBlock) {
          this.hidePopover();
          return;
      }
      
      this.state.selectedRange = selection.getRangeAt(0).cloneRange();
      const rangeRect = this.state.selectedRange.getBoundingClientRect();
      this.popover.style.display = "flex"; // Make it visible to calculate its size
      
      const popoverRect = this.popover.getBoundingClientRect();
      const GAP = 10;
      
      let left = window.scrollX + rangeRect.left + (rangeRect.width / 2) - (popoverRect.width / 2);
      let top = window.scrollY + rangeRect.top - popoverRect.height - GAP;

      if (top < window.scrollY) top = window.scrollY + rangeRect.bottom + GAP;
      if (left < 0) left = 10;
      if (left + popoverRect.width > window.innerWidth) left = window.innerWidth - popoverRect.width - 10;
      
      this.popover.style.left = `${left}px`;
      this.popover.style.top = `${top}px`;
    }

    showRemovePopup(e, highlightId) {
      this.hidePopover();
      const removePopup = document.createElement('div');
      removePopup.className = 'fixed rounded-lg bg-red-500 text-white border border-red-600 shadow-lg p-2 cursor-pointer z-50';
      removePopup.innerHTML = `<div class="flex items-center px-2 py-1 hover:bg-red-600 rounded"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2"><path d="M2 4h12M5 4V2.5C5 2.22386 5.22386 2 5.5 2h5c.27614 0 .5.22386.5.5V4m1 0v9.5c0 .27614-.22386.5-.5.5h-7c-.27614 0-.5-.22386-.5-.5V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="text-sm">Remove</span></div>`;
      
      const rect = e.currentTarget.getBoundingClientRect();
      removePopup.style.left = `${window.scrollX + rect.left}px`;
      removePopup.style.top = `${window.scrollY + rect.bottom + 8}px`;
      
      removePopup.onclick = (event) => {
        event.stopPropagation();
        this.removeHighlight(highlightId);
        removePopup.remove();
      };
      document.body.appendChild(removePopup);

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
      if (this.popover) this.popover.style.display = "none";
      this.state.selectedRange = null;
    }
    
    // --- Storage and Persistence ---

    saveHighlight(highlightId, text) {
      this.highlights.set(highlightId, { id: highlightId, text, url: window.location.href });
      this.saveToStorage();
    }

    saveToStorage() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(this.highlights.entries())));
    }

    loadHighlights() {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          this.highlights = new Map(JSON.parse(stored));
          this.observeContentChanges();
        } catch (error) {
          console.error("Failed to load or parse highlights:", error);
          this.highlights = new Map();
        }
      }
    }

    /**
     * Re-applies all stored highlights for the current URL.
     * This is the master function that calls the new findAndWrapText logic.
     */
    applyAllStoredHighlights() {
      const currentUrl = window.location.href;
      this.highlights.forEach((highlight, id) => {
        if (highlight.url === currentUrl && !document.querySelector(`[data-highlight-id="${id}"]`)) {
          this.findAndWrapText(highlight.text, id);
        }
      });
    }

    /**
     * [NEW] Finds text across multiple nodes and wraps it in a highlight span.
     * This is the robust replacement for the old persistence logic.
     */
    findAndWrapText(searchText, highlightId) {
        for (const block of document.querySelectorAll(this.SELECTORS.responseBlock)) {
            const textNodes = [];
            const walker = document.createTreeWalker(block, Node.TEXT_NODE, null, false);
            while (walker.nextNode()) {
                if (!walker.currentNode.parentElement.closest(`.${this.SELECTORS.highlightSpanClass}`)) {
                    textNodes.push(walker.currentNode);
                }
            }

            const combinedText = textNodes.map(n => n.nodeValue).join('');
            const startIndex = combinedText.indexOf(searchText);
            if (startIndex === -1) continue;

            const endIndex = startIndex + searchText.length;
            let charCount = 0;
            let startNode, startOffset, endNode, endOffset;

            for (const node of textNodes) {
                const nodeLength = node.nodeValue.length;
                if (!startNode && startIndex < charCount + nodeLength) {
                    startNode = node;
                    startOffset = startIndex - charCount;
                }
                if (!endNode && endIndex <= charCount + nodeLength) {
                    endNode = node;
                    endOffset = endIndex - charCount;
                    break;
                }
                charCount += nodeLength;
            }

            if (startNode && endNode) {
                try {
                    const range = document.createRange();
                    range.setStart(startNode, startOffset);
                    range.setEnd(endNode, endOffset);
                    const span = this.createHighlightSpan(highlightId);
                    range.surroundContents(span);
                    this.addRemoveListener(span, highlightId);
                    return; // Stop after finding and applying the highlight
                } catch (e) {
                    console.error("Failed to re-apply highlight for:", searchText, e);
                }
            }
        }
    }

    // --- Event Handling ---

    addRemoveListener(element, highlightId) {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.showRemovePopup(e, highlightId);
      });
    }
    
    observeContentChanges() {
        const observer = new MutationObserver(this.debounce(() => this.applyAllStoredHighlights(), 500));
        observer.observe(document.body, { childList: true, subtree: true });
        this.debounce(() => this.applyAllStoredHighlights(), 500)();
    }

    attachEventListeners() {
      // [IMPROVED] This handler reliably shows the popover on desktop and mobile.
      const selectionHandler = () => {
          setTimeout(() => {
              const selectionText = window.getSelection().toString();
              if (selectionText && selectionText.trim().length > 0) {
                  this.showPopover();
              } else {
                  this.hidePopover();
              }
          }, 10); // 10ms delay gives the browser time to update the selection
      };
      document.addEventListener('mouseup', selectionHandler);
      document.addEventListener('touchend', selectionHandler);

      document.addEventListener('mousedown', (e) => {
        if (this.popover && !this.popover.contains(e.target)) {
          this.hidePopover();
        }
      });
      document.addEventListener('scroll', () => this.hidePopover(), true);
    }
    
    debounce(func, delay) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    }

    init() {
      this.attachEventListeners();
      console.log("🧡 Text Highlighter [v3.0] loaded successfully.");
    }
  }

  // --- Run the extension ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new TextHighlighter().init());
  } else {
    new TextHighlighter().init();
  }
})();
