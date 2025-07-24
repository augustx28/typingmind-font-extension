/**
 * Text Highlighter Extension for TypingMind
 *
 * This script allows users to highlight text within chat messages.
 * Highlights persist across page loads and can be removed.
 */

(() => {
  'use strict';

  class TextHighlighter {
    constructor() {
      this.state = {
        selectedText: "",
        selectedRange: null,
        isProcessing: false,
        mouseX: 0,
        mouseY: 0,
      };

      this.SELECTORS = {
        responseBlock: '[data-element-id="response-block"]',
      };

      this.STORAGE_KEY = 'typingmind_highlights';
      this.highlights = new Map(); // Store highlights by unique ID
      
      this.popover = this.createPopover();
      this.debouncedShowPopover = this.debounce(this.showPopover.bind(this), 10);
      
      // Load saved highlights on initialization
      this.loadHighlights();
    }

    debounce(func, delay) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
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

    // **Main highlighting function**
    highlightSelection() {
      if (!this.state.selectedRange) return;

      const highlightId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const highlightColor = '#ffeb3b'; // Yellow highlight
      
      try {
        // Get all text nodes within the range
        const textNodes = this.getTextNodesInRange(this.state.selectedRange);
        
        // Wrap each text node in a highlight span
        textNodes.forEach(node => {
          const span = document.createElement('span');
          span.className = 'typingmind-highlight';
          span.dataset.highlightId = highlightId;
          span.style.cssText = `
            background-color: ${highlightColor};
            color: black;
            padding: 2px 0;
            cursor: pointer;
            position: relative;
          `;
          
          // Clone the text node and wrap it
          const textClone = node.cloneNode(true);
          span.appendChild(textClone);
          node.parentNode.replaceChild(span, node);
          
          // Add click handler for removal
          span.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showRemovePopup(e, highlightId);
          });
        });

        // Save highlight data
        this.saveHighlight(highlightId, this.state.selectedText);
        
        // Clear selection
        window.getSelection().removeAllRanges();
      } catch (error) {
        console.error('Error highlighting text:', error);
      }
    }

    // **Get all text nodes within a range**
    getTextNodesInRange(range) {
      const textNodes = [];
      const walker = document.createTreeWalker(
        range.commonAncestorContainer,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const nodeRange = document.createRange();
            nodeRange.selectNode(node);
            
            if (range.compareBoundaryPoints(Range.END_TO_START, nodeRange) < 0 &&
                range.compareBoundaryPoints(Range.START_TO_END, nodeRange) > 0) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_REJECT;
          }
        }
      );

      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }
      
      return textNodes;
    }

    // **Show remove popup on right-click**
    showRemovePopup(e, highlightId) {
      const removePopup = document.createElement('div');
      removePopup.className = 'fixed rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg p-2 cursor-pointer z-50';
      removePopup.innerHTML = `
        <div class="flex items-center px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
            <path d="M2 4h12M5 4V2.5C5 2.22386 5.22386 2 5.5 2h5c.27614 0 .5.22386.5.5V4m1 0v9.5c0 .27614-.22386.5-.5.5h-7c-.27614 0-.5-.22386-.5-.5V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-sm">Remove highlight</span>
        </div>`;
      
      removePopup.style.left = `${e.clientX}px`;
      removePopup.style.top = `${e.clientY}px`;
      
      removePopup.onclick = () => {
        this.removeHighlight(highlightId);
        removePopup.remove();
      };

      // Remove popup when clicking elsewhere
      const removeOnClick = (event) => {
        if (!removePopup.contains(event.target)) {
          removePopup.remove();
          document.removeEventListener('click', removeOnClick);
        }
      };
      
      document.body.appendChild(removePopup);
      setTimeout(() => {
        document.addEventListener('click', removeOnClick);
      }, 0);
    }

    // **Remove a highlight**
    removeHighlight(highlightId) {
      const highlights = document.querySelectorAll(`[data-highlight-id="${highlightId}"]`);
      
      highlights.forEach(span => {
        const parent = span.parentNode;
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
      });

      // Remove from storage
      this.highlights.delete(highlightId);
      this.saveToStorage();
    }

    // **Save highlight to memory and storage**
    saveHighlight(highlightId, text) {
      const url = window.location.href;
      this.highlights.set(highlightId, {
        id: highlightId,
        text: text,
        url: url,
        timestamp: Date.now()
      });
      this.saveToStorage();
    }

    // **Save all highlights to localStorage**
    saveToStorage() {
      try {
        const data = Array.from(this.highlights.entries());
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving highlights:', error);
      }
    }

    // **Load highlights from storage**
    loadHighlights() {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          this.highlights = new Map(data);
          
          // Apply highlights for current page
          this.applyStoredHighlights();
        }
      } catch (error) {
        console.error('Error loading highlights:', error);
      }
    }

    // **Apply stored highlights to current page**
    applyStoredHighlights() {
      const currentUrl = window.location.href;
      
      // Wait for content to load
      setTimeout(() => {
        this.highlights.forEach((highlight, highlightId) => {
          if (highlight.url === currentUrl) {
            // Search for the text and highlight it
            this.searchAndHighlight(highlight.text, highlightId);
          }
        });
      }, 1000);
    }

    // **Search for text and apply highlight**
    searchAndHighlight(searchText, highlightId) {
      const responseBlocks = document.querySelectorAll(this.SELECTORS.responseBlock);
      
      responseBlocks.forEach(block => {
        const walker = document.createTreeWalker(
          block,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );

        let node;
        while (node = walker.nextNode()) {
          const text = node.textContent;
          const index = text.indexOf(searchText);
          
          if (index !== -1) {
            // Split the text node and wrap the middle part
            const before = text.substring(0, index);
            const match = text.substring(index, index + searchText.length);
            const after = text.substring(index + searchText.length);
            
            const span = document.createElement('span');
            span.className = 'typingmind-highlight';
            span.dataset.highlightId = highlightId;
            span.style.cssText = `
              background-color: #ffeb3b;
              color: black;
              padding: 2px 0;
              cursor: pointer;
              position: relative;
            `;
            span.textContent = match;
            
            // Add click handler
            span.addEventListener('contextmenu', (e) => {
              e.preventDefault();
              this.showRemovePopup(e, highlightId);
            });

            const parent = node.parentNode;
            
            if (before) {
              parent.insertBefore(document.createTextNode(before), node);
            }
            parent.insertBefore(span, node);
            if (after) {
              parent.insertBefore(document.createTextNode(after), node);
            }
            
            parent.removeChild(node);
          }
        }
      });
    }

    // **Get selection text safely**
    getSelectionText() {
      const selection = window.getSelection();
      return selection ? selection.toString().trim() : "";
    }

    // **Show popover above selected text**
    showPopover(e) {
      const selection = window.getSelection();
      const responseBlock = e.target.closest(this.SELECTORS.responseBlock);

      if (!selection || selection.isCollapsed || !responseBlock) {
        return;
      }

      this.state.selectedText = this.getSelectionText();
      
      if (this.state.selectedText && selection.rangeCount > 0) {
        this.state.selectedRange = selection.getRangeAt(0).cloneRange();
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const GAP = 20;

        this.popover.style.display = "flex";
        this.popover.style.visibility = "hidden";

        void this.popover.offsetHeight;

        const popoverRect = this.popover.getBoundingClientRect();

        let left = this.state.mouseX - popoverRect.width / 2;
        let top = scrollTop + this.state.mouseY - popoverRect.height - GAP;

        if (top < scrollTop) {
          top = scrollTop + this.state.mouseY + GAP;
        }

        const windowWidth = window.innerWidth;
        if (left < 0) left = 0;
        if (left + popoverRect.width > windowWidth) {
          left = windowWidth - popoverRect.width - 10;
        }

        this.popover.style.left = `${left}px`;
        this.popover.style.top = `${top}px`;
        this.popover.style.visibility = "visible";
      } else {
        this.hidePopover();
      }
    }

    // **Hide the popover**
    hidePopover() {
      this.popover.style.display = "none";
      this.state.selectedText = "";
      this.state.selectedRange = null;
    }

    // **Attach event listeners**
    attachEventListeners() {
      document.addEventListener('mousemove', (e) => {
        this.state.mouseX = e.clientX;
        this.state.mouseY = e.clientY;
      });

      document.addEventListener('mouseup', this.debouncedShowPopover);

      document.addEventListener('mousedown', (e) => {
        if (!this.popover.contains(e.target)) {
          this.hidePopover();
        }
      });

      document.addEventListener('scroll', () => this.hidePopover(), true);

      // Watch for new content
      const observer = new MutationObserver(() => {
        this.applyStoredHighlights();
      });
      
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
    }

    // **Initialize the extension**
    init() {
      this.attachEventListeners();
      console.log("Text Highlighter extension loaded.");
    }
  }

  const textHighlighter = new TextHighlighter();
  textHighlighter.init();

})();
