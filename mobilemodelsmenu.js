(function() {
  const style = document.createElement('style');
  style.id = 'custom-nav-styling'; // Optional ID to prevent duplicates
  style.textContent = `
    /* Division */
    #nav-handler div .sm\\:rounded-b-xl {
      border-bottom-right-radius: 10px !important;
      border-bottom-left-radius: 10px !important;
    }
  `;
  document.head.appendChild(style);
})();
