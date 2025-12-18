// TypingMind Homepage Space Reducer
// Reduces empty space above AI Agents section

(function() {
  const style = document.createElement('style');
  style.id = 'tm-space-reducer';
  style.textContent = `
    /* Reduce top padding on main content area */
    .flex.flex-col.items-center.justify-center {
      padding-top: 10px !important;
      margin-top: 0 !important;
    }
    
    /* Target the home/welcome area container */
    [class*="pt-"][class*="flex"][class*="flex-col"] {
      padding-top: 10px !important;
    }
    
    /* Reduce space above agents section specifically */
    .max-w-4xl, .max-w-3xl, .max-w-5xl {
      margin-top: 10px !important;
      padding-top: 10px !important;
    }
    
    /* Reduce any large top margins in main content */
    main > div:first-child,
    [role="main"] > div:first-child {
      margin-top: 0 !important;
      padding-top: 15px !important;
    }
  `;
  
  // Remove existing if reloading
  const existing = document.getElementById('tm-space-reducer');
  if (existing) existing.remove();
  
  document.head.appendChild(style);
  
  console.log('✅ Homepage space reducer active');
})();
