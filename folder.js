(function() {
  const targetColor = "#DA9010"; // Your Gold Color

  function colorFolders() {
    // 1. Target the text elements using your selector
    const textLabels = document.querySelectorAll('span.truncate.min-w-0');

    textLabels.forEach(label => {
      // Color the text
      label.style.color = targetColor;

      // 2. Find the parent container to locate the sibling icon
      // We look up to the nearest container (usually a button or div)
      const container = label.closest('button') || label.closest('div[role="button"]');
      
      if (container) {
        // Find the SVG icon inside that container
        const icon = container.querySelector('svg');
        if (icon) {
          icon.style.color = targetColor;
          icon.style.fill = targetColor; // Ensures the icon fill updates
        }
      }
    });
  }

  // Run immediately
  colorFolders();

  // Watch for changes (essential for TypingMind's dynamic UI)
  const observer = new MutationObserver(colorFolders);
  observer.observe(document.body, { childList: true, subtree: true });
})();
