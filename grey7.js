// TypingMind Extension: UI Visual Tweaks
// Description: Applies custom styling to various UI elements

(function() {
  'use strict';
  
  // Create and inject the CSS styles
  function injectStyles() {
    // Check if styles already exist
    if (document.getElementById('custom-ui-tweaks')) {
      return;
    }
    
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.id = 'custom-ui-tweaks';
    styleElement.textContent = `
      /* Justify center - Black background */
      #headlessui-menu-button-\\:raa\\: .justify-center {
        background-color: #000000;
      }

      /* Transition all - Remove forced background, allow hover states */
      #elements-in-action-buttons > .transition-all {
        background-color: transparent !important;
      }
      
      /* Light gray hover for both themes */
      #elements-in-action-buttons > .transition-all:hover {
        background-color: rgba(128, 128, 128, 0.15) !important;
      }
      
      /* Dark mode hover - slightly lighter gray */
      .dark #elements-in-action-buttons > .transition-all:hover {
        background-color: rgba(128, 128, 128, 0.25) !important;
      }

      /* Overflow hidden - Rounded corners */
      .bg-\\[--workspace-color\\] .justify-center > .overflow-hidden {
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
        transition: background-color 0.2s ease;
      }
      
      /* New Chat button hover - Light gray */
      .bg-\\[--workspace-color\\] .justify-center > .overflow-hidden:hover {
        background-color: rgba(128, 128, 128, 0.15) !important;
      }
      
      /* Dark mode New Chat button hover */
      .dark .bg-\\[--workspace-color\\] .justify-center > .overflow-hidden:hover {
        background-color: rgba(128, 128, 128, 0.25) !important;
      }

      /* Light mode - ensure buttons are visible */
      .light #elements-in-action-buttons > .transition-all,
      :root:not(.dark) #elements-in-action-buttons > .transition-all {
        opacity: 1 !important;
        color: inherit !important;
      }
      
      /* Hide original icon */
      .bg-\\[--workspace-color\\] .overflow-hidden .flex-shrink-0 svg {
        display: none !important;
      }
    `;
    
    // Append to head
    document.head.appendChild(styleElement);
    console.log('UI Tweaks Extension: Styles injected successfully');
  }
  
  // Replace the icon with custom SVG
  function replaceIcon() {
    const iconContainer = document.querySelector('.bg-\\[--workspace-color\\] .overflow-hidden .flex-shrink-0');
    
    if (iconContainer && !iconContainer.dataset.iconReplaced) {
      // Mark as replaced to avoid duplicates
      iconContainer.dataset.iconReplaced = 'true';
      
      // Create new SVG element
      const newSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      newSVG.setAttribute('width', '20');
      newSVG.setAttribute('height', '20');
      newSVG.setAttribute('viewBox', '0 0 20 20');
      newSVG.setAttribute('fill', 'currentColor');
      newSVG.setAttribute('class', 'shrink-0 group');
      newSVG.setAttribute('aria-hidden', 'true');
      
      // First path
      const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path1.setAttribute('class', 'group-hover:-translate-x-[0.5px] transition group-active:translate-x-0');
      path1.setAttribute('d', 'M8.99962 2C12.3133 2 14.9996 4.68629 14.9996 8C14.9996 11.3137 12.3133 14 8.99962 14H2.49962C2.30105 13.9998 2.12113 13.8821 2.04161 13.7002C1.96224 13.5181 1.99835 13.3058 2.1334 13.1602L3.93516 11.2178C3.34317 10.2878 2.99962 9.18343 2.99962 8C2.99962 4.68643 5.68609 2.00022 8.99962 2ZM8.99962 3C6.23838 3.00022 3.99961 5.23871 3.99961 8C3.99961 9.11212 4.36265 10.1386 4.97618 10.9688C5.11884 11.1621 5.1035 11.4293 4.94004 11.6055L3.64512 13H8.99962C11.761 13 13.9996 10.7614 13.9996 8C13.9996 5.23858 11.761 3 8.99962 3Z');
      
      // Second path
      const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path2.setAttribute('class', 'group-hover:translate-x-[0.5px] transition group-active:translate-x-0');
      path2.setAttribute('d', 'M16.5445 9.72754C16.4182 9.53266 16.1678 9.44648 15.943 9.53418C15.7183 9.62215 15.5932 9.85502 15.6324 10.084L15.7369 10.3955C15.9073 10.8986 16.0006 11.438 16.0006 12C16.0006 13.1123 15.6376 14.1386 15.024 14.9687C14.8811 15.1621 14.8956 15.4302 15.0592 15.6064L16.3531 17H11.0006C9.54519 17 8.23527 16.3782 7.32091 15.3848L7.07091 15.1103C6.88996 14.9645 6.62535 14.9606 6.43907 15.1143C6.25267 15.2682 6.20668 15.529 6.31603 15.7344L6.58458 16.0625C7.68048 17.253 9.25377 18 11.0006 18H17.5006C17.6991 17.9998 17.8791 17.8822 17.9586 17.7002C18.038 17.5181 18.0018 17.3058 17.8668 17.1602L16.0631 15.2178C16.6554 14.2876 17.0006 13.1837 17.0006 12C17.0006 11.3271 16.8891 10.6792 16.6842 10.0742L16.5445 9.72754Z');
      
      // Append paths to SVG
      newSVG.appendChild(path1);
      newSVG.appendChild(path2);
      
      // Add the new SVG to container
      iconContainer.appendChild(newSVG);
      
      console.log('UI Tweaks Extension: Icon replaced successfully');
    }
  }
  
  // Observer to watch for dynamic content changes
  function observeChanges() {
    const observer = new MutationObserver((mutations) => {
      replaceIcon();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Initialize the extension
  function init() {
    // Inject styles immediately
    injectStyles();
    
    // Replace icon after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        replaceIcon();
        observeChanges();
      });
    } else {
      replaceIcon();
      observeChanges();
    }
    
    // Also try replacing after a short delay to catch late-loading elements
    setTimeout(replaceIcon, 1000);
    setTimeout(replaceIcon, 2000);
  }
  
  // Run initialization
  init();
  
  // Return extension info (optional, for TypingMind)
  return {
    name: 'UI Visual Tweaks',
    version: '1.0.0',
    description: 'Applies custom styling to TypingMind interface elements'
  };
})();
