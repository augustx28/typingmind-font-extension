/**
 * Text Highlighter Extension for TypingMind
 *
 * This script allows users to highlight text within chat messages.
 * Highlights persist across page loads and can be removed with a simple click.
 *
 * ## Version 4.0.0 Update Notes
 * - FIXED: Highlighting text with mixed formatting (bold, headers, etc.) now appears correctly.
 * The text color is now consistently black, and the orange background is always visible.
 * - IMPROVED: Switched from inline styles to an injected stylesheet for more robust and
 * powerful styling that overrides the app's default styles correctly.
 */

(() => {
  'use strict';

  class TextHighlighter {
    constructor() {
      // --- Configuration ---
      this.HIGHLIGHT_COLOR = '#FFA726'; // Soft orange color
      this.STORAGE_KEY = 'typingmind_highlights_v4'; // Updated key for new logic
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
      this._injectCss(); // Inject the robust stylesheet
      this.popover = this._createPopover();
      this.loadHighlights();
    }
    
    /**
     * [NEW] Injects a stylesheet to handle highlighting robustly.
     * This ensures highlights override any existing text styles (like bold, headers) correctly.
     */
    _injectCss() {
        const styleId = 'typingmind-highlighter-styles';
        if (document.getElementById(styleId)) return; // Ensure styles are injected only once

        const css = `
            .${this.SELECTORS.highlightSpanClass} {
                background-color: ${this.HIGHLIGHT_COLOR} !important;
                color: black !important;
                padding: 1px 0;
                border-radius: 3px;
                cursor: pointer;
            }
            
            /* This is the key fix: it targets ALL elements inside a highlight */
            .${this.SELECTORS.highlightSpanClass} * {
                color: inherit !important; /* Forces child elements to inherit the black color */
                background-color: transparent !important; /* Prevents child elements from having their own background */
            }
        `;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }

    // --- Core Highlighting Logic ---

    highlightSelection() {
      if (!this.state.selectedRange) return;

      const highlightId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const range = this.state.selectedRange;
      
      try {
        const fragment = range.extractContents();
        const span = this._createHighlightSpan(highlightId);
        span.appendChild(fragment);
        range.insertNode(span);
        
        this._addRemoveListener(span, highlightId);
        this.saveHighlight(highlightId, span.textContent);
        
        window.getSelection().removeAllRanges();
      } catch (error) {
        console.error('Highlight Error: The selected text could not be wrapped.', error);
      }
    }

    removeHighlight(highlightId) {
      document.querySelectorAll(`[data-highlight-id="${highlightId}"]`).forEach(span => {
        const parent = span.parentNode;
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
        parent.normalize();
      });

      this.highlights.delete(highlightId);
      this.saveToStorage();
    }
    
    // --- UI and DOM Methods ---

    _createPopover() {
      const popover = document.createElement("button");
      popover.className = "fixed rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg p-1.5 cursor-pointer z-50 flex items-center justify-center";
      popover.innerHTML = `<div class="flex items-center justify-center px-2 py-1"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-1"><path d="M3.5 14.5C3.5 13.3954 4.39543 12.5 5.5 12.5H16.5C17.6046 12.5 18.5 13.3954 18.5 14.5V17.5C18.5 18.6046 17.6046 19.5 16.5 19.5H5.5C4.39543 19.5 3.5 18.6046 3.5 17.5V14.5Z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/><path d="M11 3.5L20.5 12.5V17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5.5 10.5L3.5 8.5V5.5C3.5 4.39543 4.39543 3.5 5.5 3.5H16.5C17.6046 3.5 18.5 4.39543 18.5 5.5V8.5C18.5 9.60457 17.6046 10.5 16.5 10.5H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><span class="text-sm font-medium">Highlight</span></div>`;
      popover.style.display = "none";
      popover.addEventListener('click', () => {
        this.highlightSelection();
        this._hidePopover();
      });
      document.body.appendChild(popover);
      return popover;
    }

    _createHighlightSpan(highlightId) {
      const span = document.createElement('span');
      // All styling is now handled by the injected CSS class for robustness
      span.className = this.SELECTORS.highlightSpanClass;
      span.dataset.highlightId = highlightId;
      return span;
    }

    _showPopover() {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
          this._hidePopover();
          return;
      }

      const isInsideResponseBlock = selection.anchorNode.parentElement.closest(this.SELECTORS.responseBlock);
      if (!isInsideResponseBlock) {
          this._hidePopover();
          return;
      }
      
      this.state.selectedRange = selection.getRangeAt(0).cloneRange();
      const rangeRect = this.state.selectedRange.getBoundingClientRect();
      this.popover.style.display = "flex";
      
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

    _showRemovePopup(e, highlightId) {
      this._hidePopover();
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
    
    _hidePopover() {
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
          this._observeContentChanges();
        } catch (error) {
          console.error("Failed to load or parse highlights:", error);
          this.highlights = new Map();
        }
      }
    }

    applyAllStoredHighlights() {
      const currentUrl = window.location.href;
      this.highlights.forEach((highlight, id) => {
        if (highlight.url === currentUrl && !document.querySelector(`[data-highlight-id="${id}"]`)) {
          this._findAndWrapText(highlight.text, id);
        }
      });
    }

    _findAndWrapText(searchText, highlightId) {
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
                    const span = this._createHighlightSpan(highlightId);
                    range.surroundContents(span);
                    this._addRemoveListener(span, highlightId);
                    return;
                } catch (e) {
                    console.error("Failed to re-apply highlight for:", searchText, e);
                }
            }
        }
    }

    // --- Event Handling ---

    _addRemoveListener(element, highlightId) {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._showRemovePopup(e, highlightId);
      });
    }
    
    _observeContentChanges() {
        const observer = new MutationObserver(this._debounce(() => this.applyAllStoredHighlights(), 500));
        observer.observe(document.body, { childList: true, subtree: true });
        this._debounce(() => this.applyAllStoredHighlights(), 500)();
    }

    _attachEventListeners() {
      const selectionHandler = () => {
          setTimeout(() => {
              const selectionText = window.getSelection().toString();
              if (selectionText && selectionText.trim().length > 0) {
                  this._showPopover();
              } else {
                  this._hidePopover();
              }
          }, 10);
      };
      document.addEventListener('mouseup', selectionHandler);
      document.addEventListener('touchend', selectionHandler);

      document.addEventListener('mousedown', (e) => {
        if (this.popover && !this.popover.contains(e.target)) {
          this._hidePopover();
        }
      });
      document.addEventListener('scroll', () => this._hidePopover(), true);
    }
    
    _debounce(func, delay) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    }

    init() {
      this._attachEventListeners();
      console.log("🧡 Text Highlighter [v4.0] loaded successfully.");
    }
  }

  // --- Run the extension ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new TextHighlighter().init());
  } else {
    new TextHighlighter().init();
  }
})();
