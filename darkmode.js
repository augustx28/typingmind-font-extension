(() => {
  // Define custom dark theme colors
  const CUSTOM_DARK_COLORS = {
    // Main background colors
    '--bg-primary': '#1e1e1e',
    '--bg-secondary': '#252526',
    '--bg-tertiary': '#2d2d30',
    
    // Surface colors
    '--surface-primary': '#252526',
    '--surface-secondary': '#2d2d30',
    '--surface-tertiary': '#3e3e42',
    
    // Additional backgrounds
    '--bg-backdrop': '#1e1e1e',
    '--bg-surface': '#252526',
    '--bg-hover': '#2d2d30',
    '--bg-active': '#37373d',
    
    // Sidebar specific
    '--sidebar-bg': '#1e1e1e',
    '--sidebar-hover': '#2d2d30',
    
    // Chat message backgrounds
    '--message-bg-user': '#252526',
    '--message-bg-assistant': '#2d2d30',
    
    // Input areas
    '--input-bg': '#252526',
    '--textarea-bg': '#252526',
    
    // Modal/dialog backgrounds
    '--modal-bg': '#1e1e1e',
    '--dialog-bg': '#252526'
  };

  // Function to apply dark theme
  function applyCustomDarkTheme() {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark' ||
                      document.body.classList.contains('dark') ||
                      document.documentElement.classList.contains('dark');
    
    if (isDarkMode) {
      // Apply CSS variables
      Object.entries(CUSTOM_DARK_COLORS).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
      });
      
      // Apply inline styles for specific elements
      const style = document.getElementById('custom-dark-style') || createStyleElement();
      style.textContent = `
        /* Global dark theme overrides */
        html[data-theme="dark"], 
        body.dark,
        html.dark {
          background-color: #1e1e1e !important;
        }
        
        /* Sidebar */
        html[data-theme="dark"] .sidebar,
        html[data-theme="dark"] aside {
          background-color: #1e1e1e !important;
        }
        
        /* Chat messages */
        html[data-theme="dark"] .message-container {
          background-color: #252526 !important;
        }
        
        /* Input area */
        html[data-theme="dark"] .input-container,
        html[data-theme="dark"] textarea {
          background-color: #252526 !important;
        }
        
        /* Modals and dialogs */
        html[data-theme="dark"] .modal-content,
        html[data-theme="dark"] .dialog {
          background-color: #252526 !important;
        }
        
        /* Settings panels */
        html[data-theme="dark"] .settings-panel {
          background-color: #1e1e1e !important;
        }
        
        /* Cards and surfaces */
        html[data-theme="dark"] .card,
        html[data-theme="dark"] .surface {
          background-color: #252526 !important;
        }
        
        /* Dropdown menus */
        html[data-theme="dark"] .dropdown-menu {
          background-color: #252526 !important;
          border-color: #3e3e42 !important;
        }
        
        /* Headers and toolbars */
        html[data-theme="dark"] header,
        html[data-theme="dark"] .toolbar {
          background-color: #1e1e1e !important;
        }
      `;
    } else {
      // Remove custom styles in light mode
      const style = document.getElementById('custom-dark-style');
      if (style) {
        style.textContent = '';
      }
      
      // Remove CSS variables
      Object.keys(CUSTOM_DARK_COLORS).forEach(property => {
        document.documentElement.style.removeProperty(property);
      });
    }
  }

  // Create style element
  function createStyleElement() {
    const style = document.createElement('style');
    style.id = 'custom-dark-style';
    document.head.appendChild(style);
    return style;
  }

  // Watch for theme changes
  function watchThemeChanges() {
    // Initial application
    applyCustomDarkTheme();
    
    // Watch for attribute changes on html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'data-theme' || 
             mutation.attributeName === 'class')) {
          applyCustomDarkTheme();
        }
      });
    });
    
    // Observe both html and body for class/attribute changes
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['data-theme', 'class'] 
    });
    
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    // Listen for system color scheme changes
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeQuery.addListener(() => {
        setTimeout(applyCustomDarkTheme, 100); // Small delay to let TypingMind update first
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchThemeChanges);
  } else {
    watchThemeChanges();
  }
})();
