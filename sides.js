// ==TypingMindExtension==
// @name         Mobile Parallel Chat Navigator
// @description  Adds navigation arrows to switch between parallel model responses on mobile
// @version      1.0.0
// @author       Your Name
// @match        *
// ==/TypingMindExtension==

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    arrowSize: '48px',
    arrowColor: '#3b82f6',
    arrowHoverColor: '#2563eb',
    zIndex: 1000,
    mobileBreakpoint: 768
  };

  let currentModelIndex = 0;
  let totalModels = 0;
  let parallelContainers = [];

  // Create navigation arrows
  function createNavigationArrows() {
    // Remove existing arrows if any
    removeNavigationArrows();

    // Left arrow
    const leftArrow = document.createElement('div');
    leftArrow.id = 'parallel-nav-left';
    leftArrow.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    `;
    leftArrow.style.cssText = `
      position: fixed;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: ${CONFIG.arrowSize};
      height: ${CONFIG.arrowSize};
      background: ${CONFIG.arrowColor};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: ${CONFIG.zIndex};
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      color: white;
      opacity: 0;
      pointer-events: none;
    `;

    // Right arrow
    const rightArrow = document.createElement('div');
    rightArrow.id = 'parallel-nav-right';
    rightArrow.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `;
    rightArrow.style.cssText = `
      position: fixed;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: ${CONFIG.arrowSize};
      height: ${CONFIG.arrowSize};
      background: ${CONFIG.arrowColor};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: ${CONFIG.zIndex};
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      color: white;
      opacity: 0;
      pointer-events: none;
    `;

    // Model indicator
    const indicator = document.createElement('div');
    indicator.id = 'parallel-nav-indicator';
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 8px 16px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border-radius: 20px;
      font-size: 14px;
      z-index: ${CONFIG.zIndex};
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    `;

    // Add hover effects
    leftArrow.addEventListener('mouseenter', () => {
      leftArrow.style.background = CONFIG.arrowHoverColor;
      leftArrow.style.transform = 'translateY(-50%) scale(1.1)';
    });
    leftArrow.addEventListener('mouseleave', () => {
      leftArrow.style.background = CONFIG.arrowColor;
      leftArrow.style.transform = 'translateY(-50%) scale(1)';
    });

    rightArrow.addEventListener('mouseenter', () => {
      rightArrow.style.background = CONFIG.arrowHoverColor;
      rightArrow.style.transform = 'translateY(-50%) scale(1.1)';
    });
    rightArrow.addEventListener('mouseleave', () => {
      rightArrow.style.background = CONFIG.arrowColor;
      rightArrow.style.transform = 'translateY(-50%) scale(1)';
    });

    // Add click handlers
    leftArrow.addEventListener('click', () => navigateParallel('prev'));
    rightArrow.addEventListener('click', () => navigateParallel('next'));

    document.body.appendChild(leftArrow);
    document.body.appendChild(rightArrow);
    document.body.appendChild(indicator);
  }

  function removeNavigationArrows() {
    const leftArrow = document.getElementById('parallel-nav-left');
    const rightArrow = document.getElementById('parallel-nav-right');
    const indicator = document.getElementById('parallel-nav-indicator');
    
    if (leftArrow) leftArrow.remove();
    if (rightArrow) rightArrow.remove();
    if (indicator) indicator.remove();
  }

  function isMobile() {
    return window.innerWidth <= CONFIG.mobileBreakpoint;
  }

  function detectParallelChats() {
    // Try multiple selectors to find parallel chat containers
    const selectors = [
      '[data-parallel-chat]',
      '.parallel-chat-container',
      '[class*="parallel"]',
      '[class*="model-response"]',
      '.chat-message-container'
    ];

    let containers = [];
    
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 1) {
        containers = Array.from(elements);
        break;
      }
    }

    // Fallback: look for multiple response containers
    if (containers.length === 0) {
      const allMessages = document.querySelectorAll('[class*="message"], [class*="response"], [role="article"]');
      const grouped = {};
      
      allMessages.forEach(msg => {
        const timestamp = msg.getAttribute('data-timestamp') || msg.textContent.substring(0, 50);
        if (!grouped[timestamp]) grouped[timestamp] = [];
        grouped[timestamp].push(msg);
      });

      const parallelGroups = Object.values(grouped).filter(group => group.length > 1);
      if (parallelGroups.length > 0) {
        containers = parallelGroups[parallelGroups.length - 1];
      }
    }

    return containers;
  }

  function updateParallelContainers() {
    parallelContainers = detectParallelChats();
    totalModels = parallelContainers.length;

    if (!isMobile() || totalModels <= 1) {
      hideNavigation();
      return false;
    }

    return true;
  }

  function showNavigation() {
    const leftArrow = document.getElementById('parallel-nav-left');
    const rightArrow = document.getElementById('parallel-nav-right');
    const indicator = document.getElementById('parallel-nav-indicator');

    if (leftArrow && rightArrow && indicator) {
      leftArrow.style.opacity = currentModelIndex > 0 ? '1' : '0.3';
      leftArrow.style.pointerEvents = currentModelIndex > 0 ? 'auto' : 'none';
      
      rightArrow.style.opacity = currentModelIndex < totalModels - 1 ? '1' : '0.3';
      rightArrow.style.pointerEvents = currentModelIndex < totalModels - 1 ? 'auto' : 'none';
      
      indicator.style.opacity = '1';
      indicator.textContent = `${currentModelIndex + 1} / ${totalModels}`;
    }
  }

  function hideNavigation() {
    const leftArrow = document.getElementById('parallel-nav-left');
    const rightArrow = document.getElementById('parallel-nav-right');
    const indicator = document.getElementById('parallel-nav-indicator');

    if (leftArrow) leftArrow.style.opacity = '0';
    if (rightArrow) rightArrow.style.opacity = '0';
    if (indicator) indicator.style.opacity = '0';
  }

  function navigateParallel(direction) {
    if (direction === 'prev' && currentModelIndex > 0) {
      currentModelIndex--;
    } else if (direction === 'next' && currentModelIndex < totalModels - 1) {
      currentModelIndex++;
    }

    updateDisplay();
  }

  function updateDisplay() {
    parallelContainers.forEach((container, index) => {
      if (index === currentModelIndex) {
        container.style.display = '';
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        container.style.display = 'none';
      }
    });

    showNavigation();
  }

  function initialize() {
    createNavigationArrows();
    
    const checkInterval = setInterval(() => {
      if (updateParallelContainers()) {
        currentModelIndex = 0;
        updateDisplay();
      }
    }, 1000);

    // Handle window resize
    window.addEventListener('resize', () => {
      if (updateParallelContainers()) {
        updateDisplay();
      } else {
        hideNavigation();
      }
    });

    // Observe DOM changes for new messages
    const observer = new MutationObserver(() => {
      if (updateParallelContainers()) {
        updateDisplay();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
