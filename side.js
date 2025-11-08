// TypingMind Mobile Parallel Models Navigator Extension
// This extension adds navigation arrows to switch between parallel model responses on mobile

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    checkInterval: 1000, // Check for new messages every second
    arrowSize: '40px',
    arrowColor: '#6366f1',
    arrowHoverColor: '#4f46e5',
  };

  // State management
  let processedMessages = new Set();
  let currentModelIndices = new Map(); // Track current model index for each message group

  // Create arrow button
  function createArrowButton(direction) {
    const arrow = document.createElement('div');
    arrow.className = `tm-model-nav-arrow tm-model-nav-${direction}`;
    arrow.innerHTML = direction === 'left' ? '◀' : '▶';
    arrow.style.cssText = `
      position: absolute;
      top: 50%;
      ${direction}: 10px;
      transform: translateY(-50%);
      width: ${CONFIG.arrowSize};
      height: ${CONFIG.arrowSize};
      background: ${CONFIG.arrowColor};
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 1000;
      transition: all 0.2s ease;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    `;
    
    // Hover effects
    arrow.addEventListener('mouseenter', () => {
      arrow.style.background = CONFIG.arrowHoverColor;
      arrow.style.transform = 'translateY(-50%) scale(1.1)';
    });
    arrow.addEventListener('mouseleave', () => {
      arrow.style.background = CONFIG.arrowColor;
      arrow.style.transform = 'translateY(-50%) scale(1)';
    });
    
    // Touch feedback
    arrow.addEventListener('touchstart', () => {
      arrow.style.transform = 'translateY(-50%) scale(0.95)';
    });
    arrow.addEventListener('touchend', () => {
      arrow.style.transform = 'translateY(-50%) scale(1)';
    });

    return arrow;
  }

  // Create model indicator badge
  function createModelBadge() {
    const badge = document.createElement('div');
    badge.className = 'tm-model-badge';
    badge.style.cssText = `
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(99, 102, 241, 0.9);
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      z-index: 999;
      pointer-events: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;
    return badge;
  }

  // Find all parallel model responses for a message group
  function findParallelResponses(messageElement) {
    // Look for sibling elements that are also AI responses
    const responses = [];
    let current = messageElement;
    
    // TypingMind typically groups parallel responses together
    // Check for common patterns in TypingMind's structure
    const parent = messageElement.parentElement;
    if (!parent) return responses;

    // Find all AI message elements in the same group
    const allMessages = parent.querySelectorAll('[class*="message"], [class*="response"], [data-role="assistant"]');
    
    allMessages.forEach(msg => {
      // Check if this is an AI response
      const isAI = msg.classList.toString().includes('assistant') || 
                   msg.classList.toString().includes('ai') ||
                   msg.getAttribute('data-role') === 'assistant';
      
      if (isAI) {
        responses.push(msg);
      }
    });

    return responses.length > 1 ? responses : [];
  }

  // Switch to a specific model response
  function switchToModel(responses, targetIndex, messageGroup) {
    if (targetIndex < 0 || targetIndex >= responses.length) return;

    // Hide all responses
    responses.forEach((resp, idx) => {
      resp.style.display = idx === targetIndex ? 'block' : 'none';
    });

    // Update current index
    const groupId = responses[0].closest('[class*="group"]')?.getAttribute('data-id') || 
                    responses[0].getAttribute('data-message-id') || 
                    'default';
    currentModelIndices.set(groupId, targetIndex);

    // Update badge if it exists
    const badge = messageGroup.querySelector('.tm-model-badge');
    if (badge) {
      const modelName = getModelName(responses[targetIndex]);
      badge.textContent = `${targetIndex + 1}/${responses.length} - ${modelName}`;
    }
  }

  // Extract model name from response element
  function getModelName(responseElement) {
    // Try to find model name in various common locations
    const modelLabel = responseElement.querySelector('[class*="model"], [class*="label"]');
    if (modelLabel) return modelLabel.textContent.trim();

    // Check data attributes
    const modelAttr = responseElement.getAttribute('data-model') || 
                     responseElement.getAttribute('data-provider');
    if (modelAttr) return modelAttr;

    // Fallback
    return 'Model';
  }

  // Process a message group to add navigation
  function processMessageGroup(messageElement) {
    const messageId = messageElement.getAttribute('data-message-id') || 
                     messageElement.getAttribute('id') || 
                     Math.random().toString(36);

    // Skip if already processed
    if (processedMessages.has(messageId)) return;

    const parallelResponses = findParallelResponses(messageElement);
    
    if (parallelResponses.length <= 1) {
      processedMessages.add(messageId);
      return;
    }

    console.log(`Found ${parallelResponses.length} parallel responses`);

    // Create container with relative positioning
    const container = parallelResponses[0].parentElement;
    if (!container) return;

    container.style.position = 'relative';

    // Get or initialize current index
    const groupId = container.getAttribute('data-id') || messageId;
    const currentIndex = currentModelIndices.get(groupId) || 0;

    // Add model badge
    const badge = createModelBadge();
    const modelName = getModelName(parallelResponses[currentIndex]);
    badge.textContent = `${currentIndex + 1}/${parallelResponses.length} - ${modelName}`;
    container.appendChild(badge);

    // Add left arrow
    const leftArrow = createArrowButton('left');
    leftArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      const newIndex = (currentIndex - 1 + parallelResponses.length) % parallelResponses.length;
      switchToModel(parallelResponses, newIndex, container);
    });
    container.appendChild(leftArrow);

    // Add right arrow
    const rightArrow = createArrowButton('right');
    rightArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      const newIndex = (currentIndex + 1) % parallelResponses.length;
      switchToModel(parallelResponses, newIndex, container);
    });
    container.appendChild(rightArrow);

    // Initialize display state
    switchToModel(parallelResponses, currentIndex, container);

    processedMessages.add(messageId);
  }

  // Main observer to detect new messages
  function observeMessages() {
    // Find the chat container (adjust selector based on TypingMind's structure)
    const chatContainer = document.querySelector('[class*="chat"], [class*="messages"], main, [role="main"]');
    
    if (!chatContainer) {
      console.log('Chat container not found, retrying...');
      setTimeout(observeMessages, CONFIG.checkInterval);
      return;
    }

    // Process existing messages
    const messages = chatContainer.querySelectorAll('[class*="message"], [data-role="assistant"]');
    messages.forEach(processMessageGroup);

    // Observe for new messages
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Check if the node itself is a message
            if (node.matches('[class*="message"], [data-role="assistant"]')) {
              processMessageGroup(node);
            }
            // Check for messages within the added node
            const messages = node.querySelectorAll('[class*="message"], [data-role="assistant"]');
            messages.forEach(processMessageGroup);
          }
        });
      });
    });

    observer.observe(chatContainer, {
      childList: true,
      subtree: true
    });

    console.log('TypingMind Mobile Navigator: Extension activated');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeMessages);
  } else {
    observeMessages();
  }

  // Add global styles
  const style = document.createElement('style');
  style.textContent = `
    .tm-model-nav-arrow:active {
      transform: translateY(-50%) scale(0.9) !important;
    }
    
    @media (max-width: 768px) {
      .tm-model-nav-arrow {
        width: 36px !important;
        height: 36px !important;
        font-size: 18px !important;
      }
    }
  `;
  document.head.appendChild(style);

})();
