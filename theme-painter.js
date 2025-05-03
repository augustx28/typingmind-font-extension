/* Live theme applier for TypingMind */
(function () {
  const STORAGE_KEY = 'tm-theme-painter';
  const defaultTheme = {
    '--tm-app-bg': '#f5f5f5',
    '--tm-panel-bg': '#ffffff',
    '--tm-panel-border': '#e0e0e0',
    '--tm-text-primary': '#111111',
    '--tm-text-secondary': '#555555',
    '--tm-btn-bg': '#0071e3',
    '--tm-btn-text': '#ffffff',
    '--tm-user-bubble-bg': '#0071e3',
    '--tm-user-bubble-text': '#ffffff',
    '--tm-assistant-bubble-bg': '#f0f0f0',
    '--tm-assistant-bubble-text': '#111111',
    '--tm-sidebar-bg': '#fafafa',
    '--tm-sidebar-text': '#111111',
    '--tm-sidebar-active-bg': '#e8e8e8',
    '--tm-scrollbar-thumb': '#c2c2c2',
    '--tm-scrollbar-track': 'transparent'
  };

  /* 1. Utility – apply variables to :root */
  function applyTheme(theme) {
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }

  /* 2. Load saved theme on startup */
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const currentTheme = { ...defaultTheme, ...saved };
  applyTheme(currentTheme);

  /* 3. Listen for storage events (if settings page edits in another tab) */
  window.addEventListener('storage', (evt) => {
    if (evt.key === STORAGE_KEY) {
      const newTheme = JSON.parse(evt.newValue || '{}');
      applyTheme({ ...defaultTheme, ...newTheme });
    }
  });

  /* 4. Expose helper for settings page */
  window.TMThemePainter = {
    getTheme: () => ({ ...currentTheme }),
    setVar: (key, val) => {
      const newTheme = { ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'), [key]: val };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTheme));
      applyTheme({ ...defaultTheme, ...newTheme });
    },
    reset: () => {
      localStorage.removeItem(STORAGE_KEY);
      applyTheme(defaultTheme);
    }
  };
})();
