// Apply styles immediately before DOM content loads
(function() {
  // Create style element
  const style = document.createElement('style');
  style.textContent = `
    /* Your custom CSS here */
    body { background-color: #your-color; }
    /* Other theme styles */
  `;
  
  // Insert as first element in head to override defaults
  document.head.insertBefore(style, document.head.firstChild);
})();
