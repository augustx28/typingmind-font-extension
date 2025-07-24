/**
 * Text Highlighter Extension for TypingMind
 * 
 * Enhanced version with:
 * - Orange highlight color with black text
 * - Mobile-friendly highlighting and deletion
 * - Simple tap-to-delete functionality
 * - Improved error handling and performance
 */

(() => {
  'use strict';

  class TextHighlighter {
    constructor() {
      this.state = {
        selectedText: "",
        selectedRange: null,
        isProcessing: false,
        touchX: 0,
        touchY: 0,
        mouseX: 0,
        mouseY: 0,
        isMobile: this.checkIfMobile(),
      };

      this.SELECTORS = {
        responseBlock: '[data-element-id="response-block"]',
      };

      this.STORAGE_KEY = 'typingmind_highlights';
      this.highlights = new Map();

      // **Orange highlight color**
      this.HIGHLIGHT_COLOR = '#ff9800'; // Orange color

      this.popover = this.createPopover();
      this.debouncedShowPopover = this.debounce(this.showPopover.bind(this), 50);

      // Load saved highlights on initialization
      this.loadHighlights();
    }

    /**
     * Check if device is mobile
     */
    checkIfMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
             ('ontouchstart' in window) || 
             (navigator.maxTouchPoints > 0);
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
      popover.className = "fixed rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg p-2 cursor-pointer z-50 flex items-center justify-center w-auto h-auto";
      popover.innerHTML = `
        <div class="flex items-center justify-center px-3 py-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2">
            <path d="M3.5 5.5C3.5 4.39543 4.39543 3.5 5.5 3.5H16.5C17.6046 3.5 18.5 4.39543 18.5 5.5V8.5C18.5 9.60457 17.6046 10.5 16.5 10.5H5.5C4.39543 10.5 3.5 9.60457 3.5 8.5V5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3.5 14.5C3.5 13.3954 4.39543 12.5 5.5 12.5H16.5C17.6046 12.5 18.5 13.3954 18.5 14.5V17.5C18.5 18.6046 17.6046 19.5 16.5 19.5H5.5C4.39543 19.5 3.5 18.6046 3.5 17.5V14.5Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20.5 6.5V17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="text-sm font-medium">Highlight</span>
        </div>`;
      popover.style.display = "none";

      // **Handle both click and touch events**
      popover.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.highlightSelection();
        this.hidePopover();
      };

      popover.ontouchend = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.highlightSelection();
        this.hidePopover();
      };

      document.body.appendChild(popover);
      return popover;
    }

    /**
     * Main highlighting function
     */
    highlightSelection() {
      if (!this.state.selectedRange || this.state.isProcessing) return;

      this.state.isProcessing = true;
      const highlightId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      try {
        const textNodes = this.getTextNodesInRange(this.state.selectedRange);

        textNodes.forEach(node => {
          const span = document.createElement('span');
          span.className = 'typingmind-highlight';
          span.dataset.highlightId = highlightId;
          span.style.cssText = `
            background-color: ${this.HIGHLIGHT_COLOR};
            color: black;
            padding: 2px 0;
            cursor: pointer;
            position: relative;
            user-select: none;
            -webkit-user-select: none;
            -webkit-tap-highlight-color: transparent;
          `;

          const textClone = node.cloneNode(true);
          span.appendChild(textClone);
          node.parentNode.replaceChild(span, node);

          // **Simple click/tap to remove**
          this.addRemoveHandler(span, highlightId);
        });

        this.saveHighlight(highlightId, this.state.selectedText);
        window.getSelection().removeAllRanges();

      } catch (error) {
        console.error('Error highlighting text:', error);
      } finally {
        this.state.isProcessing = false;
      }
    }

    /**
     * Add remove handler for both mobile and desktop
     */
    addRemoveHandler(element, highlightId) {
      let touchTimeout;
      let touchStartTime;

      // **Desktop click handler**
      element.addEventListener('click', (e) => {
        if (!this.state.isMobile) {
          e.preventDefault();
          e.stopPropagation();
          this.showDeleteConfirmation(e, highlightId);
        }
      });

      // **Mobile touch handlers**
      element.addEventListener('touchstart', (e) => {
        touchStartTime = Date.now();
        touchTimeout = setTimeout(() => {
          e.preventDefault();
          e.stopPropagation();
          this.showDeleteConfirmation(e.touches[0], highlightId);
        }, 500); // Hold for 500ms to delete
      });

      element.addEventListener('touchend', (e) => {
        const touchDuration = Date.now() - touchStartTime;
        clearTimeout(touchTimeout);

        // Quick tap to delete on mobile
        if (touchDuration < 500) {
          e.preventDefault();
          e.stopPropagation();
          this.showDeleteConfirmation(e.changedTouches[0], highlightId);
        }
      });

      element.addEventListener('touchmove', () => {
        clearTimeout(touchTimeout);
      });
    }

    /**
     * Show delete confirmation popup
     */
    showDeleteConfirmation(e, highlightId) {
      // Remove any existing popup
      const existingPopup = document.querySelector('.highlight-delete-popup');
      if (existingPopup) existingPopup.remove();

      const deletePopup = document.createElement('div');
      deletePopup.className = 'highlight-delete-popup fixed rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-red-500 shadow-lg p-3 z-50';
      deletePopup.innerHTML = `
        <div class="text-center">
          <p class="text-sm mb-3 font-medium">Delete this highlight?</p>
          <div class="flex gap-2 justify-center">
            <button class="delete-yes px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium">Delete</button>
            <button class="delete-no px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-700 text-sm font-medium">Cancel</button>
          </div>
        </div>`;

      // Position the popup
      const x = e.clientX || e.pageX;
      const y = e.clientY || e.pageY;

      deletePopup.style.left = `${Math.min(x - 75, window.innerWidth - 170)}px`;
      deletePopup.style.top = `${y - 80}px`;

      // Handle delete confirmation
      const deleteYes = deletePopup.querySelector('.delete-yes');
      const deleteNo = deletePopup.querySelector('.delete-no');

      const handleDelete = () => {
        this.removeHighlight(highlightId);
        deletePopup.remove();
      };

      const handleCancel = () => {
        deletePopup.remove();
      };

      deleteYes.addEventListener('click', handleDelete);
      deleteYes.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleDelete();
      });

      deleteNo.addEventListener('click', handleCancel);
      deleteNo.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleCancel();
      });

      // Remove popup when clicking elsewhere
      const removeOnOutsideClick = (event) => {
        if (!deletePopup.contains(event.target)) {
          deletePopup.remove();
          document.removeEventListener('click', removeOnOutsideClick);
          document.removeEventListener('touchend', removeOnOutsideClick);
        }
      };

      document.body.appendChild(deletePopup);

      setTimeout(() => {
        document.addEventListener('click', removeOnOutsideClick);
        document.addEventListener('touchend', removeOnOutsideClick);
      }, 100);
    }

    /**
     * Get all text nodes within a range
     */
    getTextNodesInRange(range) {
      const textNodes = [];
      const walker = document.createTreeWalker(
        range.commonAncestorContainer,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            try {
              const nodeRange = document.createRange();
              nodeRange.selectNode(node);

              if (range.compareBoundaryPoints(Range.END_TO_START, nodeRange) < 0 &&
                  range.compareBoundaryPoints(Range.START_TO_END, nodeRange) > 0) {
                return NodeFilter.FILTER_ACCEPT;
              }
              return NodeFilter.FILTER_REJECT;
            } catch (error) {
              return NodeFilter.FILTER_REJECT;
            }
          }
        }
      );

      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }

      return textNodes;
    }

    /**
     * Remove a highlight
     */
    removeHighlight(highlightId) {
      try {
        const highlights = document.querySelectorAll(`[data-highlight-id="${highlightId}"]`);

        highlights.forEach(span => {
          const parent = span.parentNode;
          while (span.firstChild) {
            parent.insertBefore(span.firstChild, span);
          }
          parent.removeChild(span);
        });

        this.highlights.delete(highlightId);
        this.saveToStorage();
      } catch (error) {
        console.error('Error removing highlight:', error);
      }
    }

    /**
     * Save highlight to memory and storage
     */
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

    /**
     * Save all highlights to localStorage
     */
    saveToStorage() {
      try {
        const data = Array.from(this.highlights.entries());
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving highlights:', error);
      }
    }

    /**
     * Load highlights from storage
     */
    loadHighlights() {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          this.highlights = new Map(data);
          this.applyStoredHighlights();
        }
      } catch (error) {
        console.error('Error loading highlights:', error);
      }
    }

    /**
     * Apply stored highlights to current page
     */
    applyStoredHighlights() {
      const currentUrl = window.location.href;

      setTimeout(() => {
        this.highlights.forEach((highlight, highlightId) => {
          if (highlight.url === currentUrl) {
            this.searchAndHighlight(highlight.text, highlightId);
          }
        });
      }, 1000);
    }

    /**
     * Search for text and apply highlight
     */
    searchAndHighlight(searchText, highlightId) {
      try {
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
              const before = text.substring(0, index);
              const match = text.substring(index, index + searchText.length);
              const after = text.substring(index + searchText.length);

              const span = document.createElement('span');
              span.className = 'typingmind-highlight';
              span.dataset.highlightId = highlightId;
              span.style.cssText = `
                background-color: ${this.HIGHLIGHT_COLOR};
                color: black;
                padding: 2px 0;
                cursor: pointer;
                position: relative;
                user-select: none;
                -webkit-user-select: none;
                -webkit-tap-highlight-color: transparent;
              `;
              span.textContent = match;

              this.addRemoveHandler(span, highlightId);

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
      } catch (error) {
        console.error('Error applying stored highlight:', error);
      }
    }

    /**
     * Get selection text safely
     */
    getSelectionText() {
      const selection = window.getSelection();
      return selection ? selection.toString().trim() : "";
    }

    /**
     * Show popover above selected text
     */
    showPopover(e) {
      const selection = window.getSelection();
      const responseBlock = e.target ? e.target.closest(this.SELECTORS.responseBlock) : null;

      if (!selection || selection.isCollapsed || !responseBlock) {
        return;
      }

      this.state.selectedText = this.getSelectionText();

      if (this.state.selectedText && selection.rangeCount > 0) {
        try {
          this.state.selectedRange = selection.getRangeAt(0).cloneRange();

          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const GAP = 25;

          this.popover.style.display = "flex";
          this.popover.style.visibility = "hidden";

          void this.popover.offsetHeight;

          const popoverRect = this.popover.getBoundingClientRect();

          // Use touch coordinates on mobile, mouse coordinates on desktop
          const x = this.state.isMobile ? this.state.touchX : this.state.mouseX;
          const y = this.state.isMobile ? this.state.touchY : this.state.mouseY;

          let left = x - popoverRect.width / 2;
          let top = scrollTop + y - popoverRect.height - GAP;

          if (top < scrollTop + 10) {
            top = scrollTop + y + GAP;
          }

          const windowWidth = window.innerWidth;
          if (left < 10) left = 10;
          if (left + popoverRect.width > windowWidth - 10) {
            left = windowWidth - popoverRect.width - 10;
          }

          this.popover.style.left = `${left}px`;
          this.popover.style.top = `${top}px`;
          this.popover.style.visibility = "visible";
        } catch (error) {
          console.error('Error showing popover:', error);
          this.hidePopover();
        }
      } else {
        this.hidePopover();
      }
    }

    /**
     * Hide the popover
     */
    hidePopover() {
      this.popover.style.display = "none";
      this.state.selectedText = "";
      this.state.selectedRange = null;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
      // **Mouse events for desktop**
      document.addEventListener('mousemove', (e) => {
        this.state.mouseX = e.clientX;
        this.state.mouseY = e.clientY;
      });

      document.addEventListener('mouseup', (e) => {
        if (!this.state.isMobile) {
          this.debouncedShowPopover(e);
        }
      });

      // **Touch events for mobile**
      document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          this.state.touchX = e.touches[0].clientX;
          this.state.touchY = e.touches[0].clientY;
        }
      });

      document.addEventListener('touchend', (e) => {
        if (this.state.isMobile && e.changedTouches.length > 0) {
          this.state.touchX = e.changedTouches[0].clientX;
          this.state.touchY = e.changedTouches[0].clientY;
          this.debouncedShowPopover(e);
        }
      });

      document.addEventListener('selectionchange', () => {
        if (this.state.isMobile) {
          const selection = window.getSelection();
          if (selection && !selection.isCollapsed) {
            this.debouncedShowPopover({ target: selection.anchorNode.parentElement });
          }
        }
      });

      document.addEventListener('mousedown', (e) => {
        if (!this.popover.contains(e.target)) {
          this.hidePopover();
        }
      });

      document.addEventListener('touchstart', (e) => {
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

    /**
     * Initialize the extension
     */
    init() {
      this.attachEventListeners();
      console.log("Text Highlighter extension loaded (Mobile-friendly version)");
    }
  }

  const textHighlighter = new TextHighlighter();
  textHighlighter.init();

})();
