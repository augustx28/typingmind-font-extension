// Mobile Model Switcher for TypingMind
(() => {
  const MOBILE_BREAKPOINT = 768;
  let currentIndex = 0;
  let responses = [];
  
  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }
  
  function findResponseContainers() {
    // TypingMind uses data-element-id for UI elements
    return document.querySelectorAll('[data-element-id*="response-container"], [class*="response-container"]');
  }
  
  function addArrows() {
    if (!isMobile()) return;
    
    responses = findResponseContainers();
    if (responses.length <= 1) return;
    
    // Create arrow container
    const arrowContainer = document.createElement('div');
    arrowContainer.style.cssText = `
      position: fixed;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    
    // Left/Previous arrow
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '←';
    prevBtn.style.cssText = `
      width: 40px;
      height: 40px;
      background: rgba(0,0,0,0.7);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      backdrop-filter: blur(10px);
    `;
    
    // Right/Next arrow
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '→';
    nextBtn.style.cssText = prevBtn.style.cssText;
    
    // Handle clicks
    prevBtn.onclick = () => {
      currentIndex = Math.max(0, currentIndex - 1);
      showResponse(currentIndex);
    };
    
    nextBtn.onclick = () => {
      currentIndex = Math.min(responses.length - 1, currentIndex + 1);
      showResponse(currentIndex);
    };
    
    // Show/hide responses
    function showResponse(index) {
      responses.forEach((resp, i) => {
        resp.style.display = i === index ? 'block' : 'none';
      });
      
      // Disable arrows at boundaries
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === responses.length - 1;
      prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
      nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
    }
    
    // Initial setup
    arrowContainer.appendChild(prevBtn);
    arrowContainer.appendChild(nextBtn);
    document.body.appendChild(arrowContainer);
    showResponse(0);
    
    // Add model indicator
    const indicator = document.createElement('div');
    indicator.id = 'model-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
      z-index: 1000;
    `;
    document.body.appendChild(indicator);
    
    function updateIndicator() {
      const modelName = responses[currentIndex]?.querySelector('[data-element-id*="model-name"]')?.textContent || 
                       `Model ${currentIndex + 1}`;
      indicator.textContent = modelName;
    }
    
    updateIndicator();
    // Update on arrow clicks
    prevBtn.onclick = () => {
      currentIndex = Math.max(0, currentIndex - 1);
      showResponse(currentIndex);
      updateIndicator();
    };
    nextBtn.onclick = () => {
      currentIndex = Math.min(responses.length - 1, currentIndex + 1);
      showResponse(currentIndex);
      updateIndicator();
    };
  }
  
  // Run when chat responses appear
  const observer = new MutationObserver(() => {
    const newResponses = findResponseContainers();
    if (newResponses.length !== responses.length) {
      document.querySelectorAll('button[id*="model-arrow"]').forEach(el => el.remove());
      document.getElementById('model-indicator')?.remove();
      currentIndex = 0;
      addArrows();
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Initial check
  setTimeout(addArrows, 1000);
})();
