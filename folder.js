// Change Folder Icon Color to #DA9010
(function() {
  const style = document.createElement('style');
  style.innerHTML = `
    /* Target the specific folder SVG icons */
    svg.text-slate-400.h-6.w-6.flex-shrink-0 {
      color: #DA9010 !important; 
    }
  `;
  document.head.appendChild(style);
})();
