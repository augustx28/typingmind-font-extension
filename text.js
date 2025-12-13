(function() {
  const style = document.createElement('style');
  style.textContent = `
    /* Bold Sidebar Text */
    span.truncate.min-w-0,
    div.truncate.w-full.text-sm.font-normal {
      font-weight: bold !important;
    }
  `;
  document.head.appendChild(style);
})();
