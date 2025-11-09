// Immediately hide content to prevent flash
if (!document.documentElement.hasAttribute('data-theme-loading')) {
  document.documentElement.setAttribute('data-theme-loading', 'true');
  document.documentElement.style.cssText = 'opacity: 0 !important; transition: opacity 0.1s;';
}

// Your existing color/theme code here
function applyCustomColors() {
  // ... your color changes ...
}

applyCustomColors();

// Show content after styles applied
requestAnimationFrame(() => {
  document.documentElement.style.opacity = '1';
  setTimeout(() => {
    document.documentElement.removeAttribute('data-theme-loading');
  }, 100);
});
