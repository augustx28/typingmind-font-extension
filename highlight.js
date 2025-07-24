/**
 * Text Highlighter Extension for TypingMind
 *
 * This script allows users to highlight text within chat messages by selecting it.
 * Highlights are saved persistently and remain visible even after page reloads.
 * Features an orange-tinted highlight color with black text.
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
        messageBlock: '.message-content', // Adjust based on actual TypingMind structure
        chatArea: '.chat-messages', // Adjust based on actual structure
      };

      // **Orange-tinted highlight color**
      this.HIGHLIGHT_COLOR = '#ffcc80'; // Light orange
      this.HIGHLIGHT_CLASS = 'tm-highlighted-text';
      this.STORAGE_KEY = 'typingmind_highlights';

      this.popover = this.createPopover();
      this.deleteButton = this.createDeleteButton();
      this.debouncedShowPopover = this.debounce(this.showPopover.bind(this), 100);

      // Load existing highlights
      this.loadHighlights();
    }

    // **Utility to limit function call rate**
    debounce(func, delay) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    }

    // **Creates the Highlight button popover**
    createPopover() {
      const popover = document.createElement("button");
      popover.className = "fixed rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg p-1.5 cursor-pointer z-50 flex items-center justify-center w-auto h-auto";
      popover.innerHTML = `
        <div class="flex items-center justify-center px-2 py-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-1">
            <path d="M8.5 3C8.5 2.44772 8.94772 2 9.5 2H14.5C15.0523 2 15.5 2.44772 15.5 3V5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H19V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V7H4C3.44772 7 3 6.55228 3 6C3 5.44772 3.44772 5 4 5H8.5V3Z" fill="${this.HIGHLIGHT_COLOR}"/>
            <path d="M10 10V17M14 10V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
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

    // **Creates delete button for highlights**
    createDeleteButton() {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "absolute hidden rounded bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs z-50 shadow-md";
      deleteBtn.innerHTML = "Remove";
      deleteBtn.style.fontSize = "11px";
      deleteBtn.style.fontWeight = "600";
      document.body.appendChild(deleteBtn);
      return deleteBtn;
    }

    // **Get current page identifier**
    getPageId() {
      return window.location.pathname + window.location.search;
    }

    // **Save highlights to localStorage**
    saveHighlights() {
      try {
        const pageId = this.getPageId();
        const highlights = this.getStoredHighlights();
        const highlightElements = document.querySelectorAll(`.${this.HIGHLIGHT_CLASS}`);

        highlights[pageId] = Array.from(highlightElements).map(el => ({
          text: el.textContent,
          parentText: el.parentElement?.textContent || "",
          timestamp: el.dataset.timestamp || Date.now()
        }));

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(highlights));
      } catch (error) {
        console.error("Error saving highlights:", error);
      }
    }

    // **Get stored highlights from localStorage**
    getStoredHighlights() {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
      } catch {
        return {};
      }
    }

    // **Load and restore highlights**
    loadHighlights() {
      const pageId = this.getPageId();
      const highlights = this.getStoredHighlights();
      const pageHighlights = highlights[pageId] || [];

      // Wait for content to load
      setTimeout(() => {
        pageHighlights.forEach(highlight => {
          this.restoreHighlight(highlight);
        });
      }, 1000);
    }

    // **Restore a single highlight**
    restoreHighlight(highlightData) {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      let node;
      while (node = walker.nextNode()) {
        const parentText = node.parentElement?.textContent || "";
        if (parentText.includes(highlightData.text) && 
            !node.parentElement.classList.contains(this.HIGHLIGHT_CLASS)) {
          const index = node.textContent.indexOf(highlightData.text);
          if (index !== -1) {
            this.highlightTextNode(node, index, highlightData.text.length, highlightData.timestamp);
            break;
          }
        }
      }
    }

    // **Highlight specific text in a text node**
    highlightTextNode(textNode, start, length, timestamp = Date.now()) {
      const text = textNode.textContent;
      const before = text.substring(0, start);
      const highlighted = text.substring(start, start + length);
      const after = text.substring(start + length);

      const span = document.createElement('span');
      span.className = this.HIGHLIGHT_CLASS;
      span.style.backgroundColor = this.HIGHLIGHT_COLOR;
      span.style.color = 'black';
      span.style.padding = '2px 0';
      span.style.borderRadius = '2px';
      span.style.cursor = 'pointer';
      span.dataset.timestamp = timestamp;
      span.textContent = highlighted;

      const parent = textNode.parentNode;
      if (before) parent.insertBefore(document.createTextNode(before), textNode);
      parent.insertBefore(span, textNode);
      if (after) parent.insertBefore(document.createTextNode(after), textNode);
      parent.removeChild(textNode);

      // **Add hover effect for easier deletion**
      span.addEventListener('mouseenter', (e) => this.showDeleteButton(e.target));
      span.addEventListener('mouseleave', () => this.hideDeleteButton());
    }

    // **Show delete button on highlight hover**
    showDeleteButton(highlightElement) {
      const rect = highlightElement.getBoundingClientRect();
      this.deleteButton.style.display = 'block';
      this.deleteButton.style.left = `${rect.left}px`;
      this.deleteButton.style.top = `${rect.top - 25}px`;

      this.deleteButton.onclick = () => {
        this.removeHighlight(highlightElement);
        this.hideDeleteButton();
      };
    }

    // **Hide delete button**
    hideDeleteButton() {
      this.deleteButton.style.display = 'none';
    }

    // **Remove a highlight**
    removeHighlight(highlightElement) {
      const text = highlightElement.textContent;
      const parent = highlightElement.parentNode;

      // Replace highlight span with plain text
      const textNode = document.createTextNode(text);
      parent.insertBefore(textNode, highlightElement);
      parent.removeChild(highlightElement);

      // Merge adjacent text nodes
      parent.normalize();

      // Save updated highlights
      this.saveHighlights();
    }

    // **Get current selection**
    getSelectionInfo() {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return null;

      const range = selection.getRangeAt(0);
      const text = selection.toString().trim();

      return { selection, range, text };
    }

    // **Show popover for highlighting**
    showPopover() {
      const selectionInfo = this.getSelectionInfo();
      if (!selectionInfo) {
        this.hidePopover();
        return;
      }

      this.state.selectedText = selectionInfo.text;
      this.state.selectedRange = selectionInfo.range;

      if (this.state.selectedText) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        this.popover.style.display = "flex";
        this.popover.style.visibility = "hidden";

        const popoverRect = this.popover.getBoundingClientRect();
        const GAP = 10;

        let left = this.state.mouseX - popoverRect.width / 2;
        let top = scrollTop + this.state.mouseY - popoverRect.height - GAP;

        // Ensure popover stays within viewport
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
      }
    }

    // **Hide popover**
    hidePopover() {
      this.popover.style.display = "none";
      this.state.selectedText = "";
      this.state.selectedRange = null;
    }

    // **Highlight the current selection**
    highlightSelection() {
      if (!this.state.selectedRange) return;

      const range = this.state.selectedRange;
      const timestamp = Date.now();

      // Process all text nodes in the range
      const textNodes = this.getTextNodesInRange(range);
      textNodes.forEach(({ node, start, end }) => {
        this.highlightTextNode(node, start, end - start, timestamp);
      });

      // Clear selection
      window.getSelection().removeAllRanges();

      // Save highlights
      this.saveHighlights();
    }

    // **Get all text nodes within a range**
    getTextNodesInRange(range) {
      const textNodes = [];
      const walker = document.createTreeWalker(
        range.commonAncestorContainer,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      let node;
      while (node = walker.nextNode()) {
        if (range.intersectsNode(node)) {
          const start = node === range.startContainer ? range.startOffset : 0;
          const end = node === range.endContainer ? range.endOffset : node.textContent.length;

          if (end > start) {
            textNodes.push({ node, start, end });
          }
        }
      }

      return textNodes;
    }

    // **Attach event listeners**
    attachEventListeners() {
      // Track mouse position
      document.addEventListener('mousemove', (e) => {
        this.state.mouseX = e.clientX;
        this.state.mouseY = e.clientY;
      });

      // Show popover on text selection
      document.addEventListener('mouseup', (e) => {
        // Small delay to ensure selection is complete
        setTimeout(() => {
          if (window.getSelection().toString().trim()) {
            this.debouncedShowPopover();
          }
        }, 10);
      });

      // Hide popover on click outside
      document.addEventListener('mousedown', (e) => {
        if (!this.popover.contains(e.target) && !this.deleteButton.contains(e.target)) {
          this.hidePopover();
          this.hideDeleteButton();
        }
      });

      // Hide popover on scroll
      document.addEventListener('scroll', () => {
        this.hidePopover();
        this.hideDeleteButton();
      }, true);

      // Re-load highlights when content changes
      const observer = new MutationObserver(() => {
        if (document.querySelectorAll(`.${this.HIGHLIGHT_CLASS}`).length === 0) {
          this.loadHighlights();
        }
      });

      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        characterData: true 
      });
    }

    // **Initialize the extension**
    init() {
      this.attachEventListeners();
      console.log("Text Highlighter extension loaded.");

      // Add custom styles
      const style = document.createElement('style');
      style.textContent = `
        .${this.HIGHLIGHT_CLASS} {
          transition: all 0.2s ease;
        }
        .${this.HIGHLIGHT_CLASS}:hover {
          filter: brightness(0.9);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Initialize extension
  const highlighter = new TextHighlighter();
  highlighter.init();

})();
