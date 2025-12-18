// TypingMind Homepage Space Reducer
(function() {
  'use strict';
  
  const style = document.createElement('style');
  style.id = 'tm-homepage-compact';
  style.textContent = `
    /* Reduce top padding on main content area */
    .flex.flex-col.items-center.justify-center {
      padding-top: 10px !important;
      min-height: auto !important;
    }
    
    /* Target the home/welcome container */
    [class*="justify-center"][class*="items-center"] {
      padding-top: 20px !important;
    }
    
    /* Reduce gap before agents section */
    .flex.flex-col.gap-6 {
      gap: 1rem !important;
    }
    
    /* Compact the main home area */
    main > div:first-child {
      padding-top: 1rem !important;
    }
    
    /* Remove excessive vertical centering on homepage */
    .h-full.flex.flex-col.justify-center {
      justify-content: flex-start !important;
      padding-top: 2rem !important;
    }
  `;
  
  // Remove existing if reloading
  const existing = document.getElementById('tm-homepage-compact');
  if (existing) existing.remove();
  
  document.head.appendChild(style);
  
  console.log('✅ Homepage space reducer active');
})();
