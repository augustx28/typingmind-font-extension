// Change Only Folder Icon Color to #DA9010
(function() {
  const style = document.createElement('style');
  style.innerHTML = `
    /* Target svg elements that have the specific tailwind color class.
       Using !important overrides the original class.
    */
    svg.text-slate-400 {
      color: #DA9010 !important; 
    }

    /* Optional: If the above is too broad, use this more specific one 
       based on your first message.
    */
    /* svg.text-slate-400.h-6.w-6.flex-shrink-0 {
      color: #DA9010 !important; 
    }
    */
  `;
  document.head.appendChild(style);
})();
