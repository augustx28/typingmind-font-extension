(() => {
  const extensionId = 'mobile-layout-fix';
  
  // Create style element if it doesn't exist
  let styleElement = document.getElementById(extensionId);
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = extensionId;
    document.head.appendChild(styleElement);
  }
  
  // Your custom CSS
  const customCSS = `
    @media (max-width: 499.995px) {
      /* var(workspace height) */
      #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
        bottom: 0px;
        top: 740px;
        position: fixed;
        right: 0px;
      }
    }
    
    @media (max-width: 499px) {
      /* var(workspace height) */
      #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
        top: 760px;
      }
      
      /* Navigation */
      .transition .flex-col .md\\:pl-\\[--workspace-width\\] {
        padding-bottom: 4px;
      }
    }
  `;
  
  // Apply the CSS
  styleElement.textContent = customCSS;
  
  // Optional: Log to confirm extension is loaded
  console.log('Mobile Layout Fix extension loaded successfully');
})();
