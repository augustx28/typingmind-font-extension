// TypingMind Extension: Custom Workspace Height CSS
// Injects CSS for small screens to adjust workspace positioning

(function() {
  // Define the CSS content
  const css = `
    @media (max-width: 499.995px) {
      /* Override workspace height positioning */
      #nav-handler .transition .h-\\ [var\\(--workspace-height\\)] {
        bottom: 0px;
        top: 735px;
        position: fixed;
        right: 0px;
      }
    }
  `;

  // Create a style element
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;

  // Append to the head to apply the styles
  document.head.appendChild(style);

  console.log('Custom CSS extension loaded: Workspace height adjustments applied.');
})();
