// TypingMind Mobile Parallel Models Navigator
// manifest.json structure at the bottom

(function() {
  'use strict';

  // Configuration
  const config = {
    arrowSize: '48px',
    arrowColor: '#4F46E5',
    arrowHoverColor: '#6366F1',
    zIndex: 1000,
    mobileBreakpoint: 768
  };

  let currentModelIndex = 0;
  let modelResponses = [];
  let leftArrow = null;
  let rightArrow = null;
  let observer = null;

  // Create arrow buttons
  function createArrows() {
    const arrowStyle = `
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      width: ${config.arrowSize};
      height: ${config.arrowSize};
      background: ${config.arrowColor};
      border: none;
      border-radius: 50%;
      color: white;
      font-size: 24px;
      cursor: pointer;
      z-index: ${config.zIndex};
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      opacity: 0;
      pointer-events: none;
    `;

    leftArrow = document.createElement('button');
    leftArrow.innerHTML = '←';
    leftArrow.style.cssText = arrowStyle + 'left: 10px;';
    leftArrow.setAttribute('aria-label', 'Previous model response');
    leftArrow.addEventListener('click', navigatePrevious);

    rightArrow = document.createElement('button');
    rightArrow.innerHTML = '→';
    rightArrow.style.cssText = arrowStyle + 'right: 10px;';
    rightArrow.setAttribute('aria-label', 'Next model response');
    rightArrow.addEventListener('click', navigateNext);

    // Hover effects
    [leftArrow, rightArrow].forEach(arrow => {
      arrow.addEventListener('mouseenter', function() {
        this.style.background = config.arrowHoverColor;
        this.style.transform = 'translateY(-50%) scale(1.1)';
      });
      arrow.addEventListener('mouseleave', function() {
        this.style.background = config.arrowColor;
        this.style.transform = 'translateY(-50%) scale(1)';
      });
    });

    document.body.appendChild(leftArrow);
    document.body.appendChild(rightArrow);
  }

  // Detect parallel model responses
  function detectModelResponses() {
    // TypingMind uses specific classes/attributes for parallel responses
    // Adjust selectors based on actual TypingMind DOM structure
    const possibleSelectors = [
      '[data-model-response]',
      '.model-response',
      '[data-parallel-model]',
      '.parallel-response',
      '.chat-message.assistant[data-model]'
    ];

    let responses = [];
    
    for (const selector of possibleSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 1) {
        responses = Array.from(elements);
        break;
      }
    }

    // Fallback: detect by looking for multiple consecutive assistant messages
    if (responses.length === 0) {
      const assistantMessages = document.querySelectorAll('.chat-message.assistant, [role="assistant"]');
      if (assistantMessages.length > 1) {
        // Group consecutive assistant messages
        const lastUserMessage = Array.from(document.querySelectorAll('.chat-message.user, [role="user"]')).pop();
        if (lastUserMessage) {
          responses = Array.from(assistantMessages).filter(msg => {
            return msg.compareDocumentPosition(lastUserMessage) & Node.DOCUMENT_POSITION_PRECEDING;
          });
        }
      }
    }

    return responses;
  }

  // Update visible response
  function updateVisibleResponse() {
    modelResponses.forEach((response, index) => {
      if (index === currentModelIndex) {
        response.style.display = '';
        response.style.opacity = '1';
        response.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        response.style.display = 'none';
        response.style.opacity = '0';
      }
    });

    updateArrowVisibility();
    updateModelIndicator();
  }

  // Update arrow visibility
  function updateArrowVisibility() {
    const isMobile = window.innerWidth <= config.mobileBreakpoint;
    const hasMultipleResponses = modelResponses.length > 1;

    if (isMobile && hasMultipleResponses) {
      leftArrow.style.opacity = currentModelIndex > 0 ? '1' : '0.3';
      leftArrow.style.pointerEvents = currentModelIndex > 0 ? 'auto' : 'none';
      
      rightArrow.style.opacity = currentModelIndex < modelResponses.length - 1 ? '1' : '0.3';
      rightArrow.style.pointerEvents = currentModelIndex < modelResponses.length - 1 ? 'auto' : 'none';
    } else {
      leftArrow.style.opacity = '0';
      rightArrow.style.opacity = '0';
      leftArrow.style.pointerEvents = 'none';
      rightArrow.style.pointerEvents = 'none';
    }
  }

  // Create model indicator
  function createModelIndicator() {
    let indicator = document.getElementById('model-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'model-indicator';
      indicator.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        z-index: ${config.zIndex + 1};
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      `;
      document.body.appendChild(indicator);
    }
    return indicator;
  }

  // Update model indicator
  function updateModelIndicator() {
    const indicator = createModelIndicator();
    
    if (modelResponses.length > 1) {
      const modelName = getModelName(modelResponses[currentModelIndex]);
      indicator.textContent = `${modelName} (${currentModelIndex + 1}/${modelResponses.length})`;
      indicator.style.opacity = '1';
      
      setTimeout(() => {
        indicator.style.opacity = '0';
      }, 2000);
    }
  }

  // Extract model name from response element
  function getModelName(element) {
    // Try various attributes and text content
    const modelAttr = element.getAttribute('data-model') || 
                      element.getAttribute('data-model-name') ||
                      element.querySelector('[data-model]')?.getAttribute('data-model');
    
    if (modelAttr) return modelAttr;

    // Look for model name in text content
    const textContent = element.textContent || '';
    const modelPatterns = ['GPT', 'Claude', 'Gemini', 'Llama', 'Mistral', 'Anthropic'];
    
    for (const pattern of modelPatterns) {
      if (textContent.includes(pattern)) return pattern;
    }

    return `Model ${currentModelIndex + 1}`;
  }

  // Navigation functions
  function navigatePrevious() {
    if (currentModelIndex > 0) {
      currentModelIndex--;
      updateVisibleResponse();
    }
  }

  function navigateNext() {
    if (currentModelIndex < modelResponses.length - 1) {
      currentModelIndex++;
      updateVisibleResponse();
    }
  }

  // Main scan function
  function scanForParallelResponses() {
    const responses = detectModelResponses();
    
    if (responses.length > 1 && JSON.stringify(responses) !== JSON.stringify(modelResponses)) {
      modelResponses = responses;
      currentModelIndex = 0;
      updateVisibleResponse();
    } else if (responses.length <= 1) {
      modelResponses = [];
      updateArrowVisibility();
    }
  }

  // Initialize
  function init() {
    createArrows();
    createModelIndicator();
    
    // Initial scan
    scanForParallelResponses();

    // Set up mutation observer
    observer = new MutationObserver(() => {
      scanForParallelResponses();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-model', 'class']
    });

    // Handle window resize
    window.addEventListener('resize', updateArrowVisibility);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (window.innerWidth <= config.mobileBreakpoint && modelResponses.length > 1) {
        if (e.key === 'ArrowLeft') navigatePrevious();
        if (e.key === 'ArrowRight') navigateNext();
      }
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* 
manifest.json for Chrome Extension:

{
  "manifest_version": 3,
  "name": "TypingMind Mobile Parallel Navigator",
  "version": "1.0.0",
  "description": "Navigate between parallel model responses on TypingMind mobile with arrow buttons",
  "permissions": [],
  "host_permissions": [
    "https://www.typingmind.com/*",
    "https://typingmind.com/*"
  ],
  "content_scripts": [
    {
      "matches": [
        "https://www.typingmind.com/*",
        "https://typingmind.com/*"
      ],
      "js": ["content.js"],
      "run_at": "document_end"
    }
  ],
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  }
}

Installation Instructions:
1. Save the JavaScript code as 'content.js'
2. Create 'manifest.json' with the structure above
3. Create icon files (16x16, 48x48, 128x128 px)
4. Load as unpacked extension in Chrome/Edge
5. Visit TypingMind and use parallel models on mobile
*/
