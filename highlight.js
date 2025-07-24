/**
 * Text Highlighter Extension for TypingMind - UPDATED
 *
 * This script allows users to highlight text within chat messages.
 * Highlights persist across page loads and can be easily removed on desktop or mobile.
 *
 * Key Updates:
 * - Highlight color changed to orange.
 * - Mobile-friendly: Use touch to select text and create highlights.
 * - Simple Deletion: Tap or click a highlight to get the remove option (no more right-click).
 * - Performance: More efficient logic for applying highlights and tracking new messages.
 * - Accuracy: Fixed bug where highlighting would select entire paragraphs instead of just the selected text.
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

      // --- CONFIGURATION ---
      this.HIGHLIGHT_COLOR = '#FFC069'; // New orange-ish highlight color
      this.STORAGE_KEY = 'typingmind_highlights';
      this.SELECTORS = {
        responseBlock: '[data-element-id="response-block"]',
        // A more specific container helps performance, but 'main' is a safe fallback.
        chatContainer: 'main',
      };
      // --- END CONFIGURATION ---

      this.highlights = new Map();
      this.popover = this.createPopover();
      this.debouncedShowPopover = this.debounce(this.showPopover.bind(this), 100);

      this.loadHighlights();
    }

    // Utility to prevent a function from firing too frequently
    debounce(func, delay) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    }

    // Creates the "Highlight" button popover
    createPopover() {
      const popover = document.createElement("button");
      popover.className = "fixed rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg p-1.5 cursor-pointer z-50 flex items-center justify-center w-auto h-auto";
      popover.innerHTML = `
         <div class="flex items-center justify-center px-2 py-1">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-1">
             <path d="M3.5 5.5C3.5 4.39543 4.39543 3.5 5.5 3.5H16.5C17.6046 3.5 18.5 4.39543 18.5 5.5V8.5C18.5 9.60457 17.6046 10.5 16.5 10.5H5.5C4.39543 10.5 3.5 9.60457 3.5 8.5V5.5Z" stroke="currentColor" stroke-width="1.5"></path>
             <path d="M3.5 14.5C3.5 13.3954 4.39543 12.5 5.5 12.5H16.5C17.6046 12.5 18.5 13.3954 18.5 14.5V17.5C18.5 18.6046 17.6046 19.5 16.5 19.5H5.5C4.39543 19.5 3.5 18.6046 3.5 17.5V14.5Z" fill="currentColor" stroke="currentColor" stroke-width="1.5"></path>
             <path d="M20.5 6.5V17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
           </svg>
           <span class="text-sm font-medium">Highlight</span>
         </div>`;
      popover.style.display = "none";
      popover.addEventListener('click', () => {
        this.highlightSelection();
      });
      document.body.appendChild(popover);
      return popover;
    }

    // **Main highlighting function - NEW & IMPROVED**
    highlightSelection() {
      if (!this.state.selectedRange || this.state.selectedRange.collapsed) {
        this.hidePopover();
        return;
      }

      const highlightId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const selectedText = this.state.selectedRange.toString();

      try {
        const span = document.createElement('span');
        span.className = 'typingmind-highlight';
        span.dataset.highlightId = highlightId;
        span.style.backgroundColor = this.HIGHLIGHT_COLOR;
        span.style.color = 'black'; // Keep text black as requested
        span.style.cursor = 'pointer';
        span.style.borderRadius = '3px';
        span.style.padding = '2px 1px';
        span.style.margin = '0 1px';


        // This method correctly wraps even complex selections that span multiple HTML tags.
        const contents = this.state.selectedRange.extractContents();
        span.appendChild(contents);
        this.state.selectedRange.insertNode(span);

        // **IMPROVEMENT**: Use 'click' for removal, which works on desktop and mobile (tap).
        span.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation(); // Stop event from bubbling up
          this.showRemovePopup(e, highlightId);
        });

        this.saveHighlight(highlightId, selectedText);
        window.getSelection().removeAllRanges();

      } catch (error) {
        console.error('TypingMind Highlighter: Error applying highlight.', error);
      } finally {
        this.hidePopover();
      }
    }

    // **Shows the "Remove" button - now triggered by click/tap**
    showRemovePopup(e, highlightId) {
      // Remove any existing popups first
      const existingPopup = document.querySelector('.typingmind-remove-popup');
      if (existingPopup) existingPopup.remove();

      const removePopup = document.createElement('div');
      removePopup.className = 'typingmind-remove-popup fixed rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg p-2 cursor-pointer z-50';
      removePopup.innerHTML = `
         <div class="flex items-center px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
           <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
             <path d="M2 4h12M5 4V2.5C5 2.22386 5.22386 2 5.5 2h5c.27614 0 .5.22386.5.5V4m1 0v9.5c0 .27614-.22386.5-.5.5h-7c-.27614 0-.5-.22386-.5-.5V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
           </svg>
           <span class="text-sm">Remove highlight</span>
         </div>`;

      // Position the popup near the click/tap location
      removePopup.style.left = `${e.clientX}px`;
      removePopup.style.top = `${e.clientY + 10}px`;

      removePopup.addEventListener('click', (event) => {
        event.stopPropagation();
        this.removeHighlight(highlightId);
        removePopup.remove();
      });

      // Clicks outside the popup will close it
      setTimeout(() => {
        document.addEventListener('click', function onClickOutside() {
          removePopup.remove();
          document.removeEventListener('click', onClickOutside);
        });
      }, 0);

      document.body.appendChild(removePopup);
    }


    // **Removes a highlight from the page and storage**
    removeHighlight(highlightId) {
      const highlightedSpans = document.querySelectorAll(`[data-highlight-id="${highlightId}"]`);

      highlightedSpans.forEach(span => {
        const parent = span.parentNode;
        // Unwrap the content of the span
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
        parent.normalize(); // Merges adjacent text nodes
      });

      this.highlights.delete(highlightId);
      this.saveToStorage();
    }

    // **Saves a specific highlight to memory and calls storage function**
    saveHighlight(highlightId, text) {
      this.highlights.set(highlightId, {
        id: highlightId,
        text: text,
        url: window.location.href,
        timestamp: Date.now()
      });
      this.saveToStorage();
    }

    // **Saves all highlights to browser's localStorage**
    saveToStorage() {
      try {
        const data = Array.from(this.highlights.entries());
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('TypingMind Highlighter: Error saving highlights.', error);
      }
    }

    // **Loads highlights from storage on initialization**
    loadHighlights() {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          this.highlights = new Map(data);
          // Wait for the page to be ready before applying
          if (document.readyState === 'complete') {
            this.applyStoredHighlights();
          } else {
            window.addEventListener('load', () => this.applyStoredHighlights());
          }
        }
      } catch (error) {
        console.error('TypingMind Highlighter: Error loading highlights.', error);
      }
    }

    // **Applies all stored highlights to the current page**
    applyStoredHighlights() {
      const currentUrl = window.location.href;
      this.highlights.forEach((highlight) => {
        if (highlight.url === currentUrl) {
          this.searchAndHighlight(highlight.text, highlight.id);
        }
      });
    }

    // **Searches for text and applies a highlight - NEW & IMPROVED**
    searchAndHighlight(searchText, highlightId) {
      // **IMPROVEMENT**: Don't re-apply highlights that are already on the page.
      if (document.querySelector(`[data-highlight-id="${highlightId}"]`)) {
        return;
      }
      const responseBlocks = document.querySelectorAll(this.SELECTORS.responseBlock);
      const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedText);

      responseBlocks.forEach(block => {
        const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
        let node;
        const nodesToProcess = [];
        while (node = walker.nextNode()) {
          if (node.textContent.includes(searchText) && !node.parentNode.closest('.typingmind-highlight')) {
             nodesToProcess.push(node);
          }
        }
        
        nodesToProcess.forEach(textNode => {
          const match = textNode.textContent.match(searchRegex);
          if (!match) return;

          const matchIndex = match.index;
          // Split the text node to isolate the text to be highlighted
          const middle = textNode.splitText(matchIndex);
          middle.splitText(searchText.length);

          const span = document.createElement('span');
          span.className = 'typingmind-highlight';
          span.dataset.highlightId = highlightId;
          span.style.backgroundColor = this.HIGHLIGHT_COLOR;
          span.style.color = 'black';
          span.style.cursor = 'pointer';
          span.style.borderRadius = '3px';
          span.style.padding = '2px 1px';
          span.style.margin = '0 1px';
          span.appendChild(middle.cloneNode(true));
          
          middle.parentNode.replaceChild(span, middle);

          // **IMPROVEMENT**: Use 'click' for removal, works on mobile.
          span.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showRemovePopup(e, highlightId);
          });
        });
      });
    }

    // **Gets selection details safely**
    getSelectionDetails() {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        return { text: "", range: null };
      }
      // Check if selection is within a valid response block
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const parentElement = container.nodeType === Node.ELEMENT_NODE ? container : container.parentNode;
      if (!parentElement.closest(this.SELECTORS.responseBlock)) {
        return { text: "", range: null };
      }
      return {
        text: selection.toString().trim(),
        range: range.cloneRange(),
      };
    }

    // **Shows the popover above the selected text**
    showPopover() {
      const selectionDetails = this.getSelectionDetails();

      if (selectionDetails.text && selectionDetails.range) {
        this.state.selectedRange = selectionDetails.range;

        const rect = this.state.selectedRange.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const GAP = 10;

        this.popover.style.display = "flex";
        this.popover.style.visibility = "hidden";

        // Let the browser render it before we measure it
        void this.popover.offsetHeight;
        const popoverRect = this.popover.getBoundingClientRect();

        let left = rect.left + rect.width / 2 - popoverRect.width / 2;
        let top = scrollTop + rect.top - popoverRect.height - GAP;

        // Reposition if it's off-screen
        if (top < scrollTop) top = scrollTop + rect.bottom + GAP;
        if (left < 0) left = 10;
        if (left + popoverRect.width > window.innerWidth) left = window.innerWidth - popoverRect.width - 10;

        this.popover.style.left = `${left}px`;
        this.popover.style.top = `${top}px`;
        this.popover.style.visibility = "visible";
      } else {
        this.hidePopover();
      }
    }

    // **Hides the popover**
    hidePopover() {
      if (this.popover) {
        this.popover.style.display = "none";
      }
      this.state.selectedRange = null;
    }

    // **Attaches all necessary event listeners**
    attachEventListeners() {
      // **IMPROVEMENT**: Listen for both mouse and touch end events for selection
      document.addEventListener('mouseup', (e) => {
        // Ignore clicks on the popover itself
        if (this.popover.contains(e.target)) return;
        this.debouncedShowPopover(e);
      });
      document.addEventListener('touchend', (e) => {
        // Prevent firing both touchend and mouseup
        e.preventDefault();
        this.debouncedShowPopover(e);
      });

      // Hide popover on mousedown unless it's on the popover
      document.addEventListener('mousedown', (e) => {
        if (!this.popover.contains(e.target) && !e.target.closest('.typingmind-remove-popup')) {
          this.hidePopover();
        }
      });
      document.addEventListener('scroll', () => this.hidePopover(), true);

      // **IMPROVEMENT**: Use a more performant observer
      const targetNode = document.querySelector(this.SELECTORS.chatContainer) || document.body;
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if a response block was added
            const hasResponseBlock = Array.from(mutation.addedNodes).some(node =>
              node.nodeType === Node.ELEMENT_NODE && (node.matches(this.SELECTORS.responseBlock) || node.querySelector(this.SELECTORS.responseBlock))
            );
            if (hasResponseBlock) {
              this.applyStoredHighlights();
              // No need to check other mutations
              break;
            }
          }
        }
      });
      observer.observe(targetNode, { childList: true, subtree: true });
    }

    // **Initializes the extension**
    init() {
      this.attachEventListeners();
      console.log("Text Highlighter extension loaded successfully. 🍊");
    }
  }

  // Run the extension
  const textHighlighter = new TextHighlighter();
  textHighlighter.init();

})();
