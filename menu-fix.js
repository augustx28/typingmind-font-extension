// TypingMind Extension: Custom CSS for Workspace Height and Navigation

// Function to inject CSS
function injectCustomCSS() {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
    @media (max-width: 499.995px) {
      /* Adjust workspace height */
      #nav-handler .transition .h-\\ [var(--workspace-height)] {
        bottom: 0px;
        top: 720px;
        position: fixed;
        right: 0px;
      }
    }

    @media (max-width: 499px) {
      /* Adjust workspace height */
      #nav-handler .transition .h-\\ [var(--workspace-height)] {
        top: 760px;
      }

      /* Navigation padding */
      .transition .flex-col .md\\:pl-\\ [--workspace-width] {
        padding-bottom: 4px;
      }
    }
  `;
  document.head.appendChild(style);
  console.log('Custom CSS injected successfully.');
}

// Run the injection when the DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  injectCustomCSS();
} else {
  document.addEventListener('DOMContentLoaded', injectCustomCSS);
}
