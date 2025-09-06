// file: mobile-nav-bottom-sticky.js
(() => {
  // Enhanced CSS for proper bottom positioning on mobile
  const CSS = `
    @media (max-width: 499.995px) {
      /* Reset any transforms and position the nav at bottom */
      #nav-handler {
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        z-index: 9999 !important;
        transform: none !important;
        max-height: 80px !important; /* Prevent nav from being too tall */
      }
      
      /* Ensure the transition container doesn't push nav off-screen */
      #nav-handler .transition {
        transform: none !important;
        position: relative !important;
      }
      
      /* Reset the height-based positioning */
      #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
        transform: none !important;
        height: auto !important;
        max-height: 80px !important;
      }
      
      /* Ensure nav content is visible and properly styled */
      #nav-handler nav,
      #nav-handler .nav-content {
        position: relative !important;
        background: var(--bg-primary, #ffffff) !important;
        border-top: 1px solid var(--border-color, #e5e5e5) !important;
        padding: 8px 0 !important;
      }
      
      /* Add padding to main content to prevent overlap with fixed nav */
      body {
        padding-bottom: 80px !important;
      }
      
      /* Ensure the main chat area doesn't get hidden behind nav */
      .main-content,
      [class*="workspace"],
      [class*="chat-container"] {
        margin-bottom: 80px !important;
      }
    }
  `.trim();

  // Inject <style> element with unique ID
  const STYLE_ID = 'tm-ext-mobile-nav-bottom-sticky';
  
  const inject = () => {
    // Remove existing style if present to avoid duplicates
    const existing = document.getElementById(STYLE_ID);
    if (existing) {
      existing.remove();
    }
    
    // Create and inject new style element
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
    
    console.log('TypingMind mobile nav positioned at bottom');
  };

  // Run injection when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
  
  // Re-inject on dynamic content changes (TypingMind is a SPA)
  const observer = new MutationObserver(() => {
    if (!document.getElementById(STYLE_ID)) {
      inject();
    }
  });
  
  // Start observing once DOM is ready
  const startObserving = () => {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };
  
  if (document.body) {
    startObserving();
  } else {
    document.addEventListener('DOMContentLoaded', startObserving);
  }

  // Cleanup helper function for testing
  window.__removeTmMobileNavBottom = () => {
    const el = document.getElementById(STYLE_ID);
    if (el) el.remove();
    observer.disconnect();
    console.log('Mobile nav bottom positioning removed');
  };
})();
