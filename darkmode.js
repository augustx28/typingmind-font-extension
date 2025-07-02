// Flat-Dark 1e1e1e – change this constant if you want another shade
const DARK_BG = '#1e1e1e';

// CSS variable we will override (matches TypingMind 02 Jul 2025)
const VAR_NAME = '--tm-bg-0';

/**
 * Applies or removes the dark override depending on current theme.
 */
function syncDarkColor() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  if (isDark) {
    // Push our color
    document.documentElement.style.setProperty(VAR_NAME, DARK_BG);
  } else {
    // Restore built-in color
    document.documentElement.style.removeProperty(VAR_NAME);
  }
}

/**
 * Runs once at startup and sets up a MutationObserver to react to changes.
 */
function initFlatDark() {
  // Apply immediately in case the page already loaded in dark mode
  syncDarkColor();

  // Observe further changes
  const obs = new MutationObserver(syncDarkColor);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
}

// Make sure the DOM is ready first (should already be, but be safe)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFlatDark);
} else {
  initFlatDark();
}
