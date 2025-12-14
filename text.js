(() => {
  const styleId = 'tm-custom-font-fix';
  if (document.getElementById(styleId)) return; // Prevent duplicates

  const css = `
/* Font normal */
.grid div .font-normal {
  font-weight: 500;
}

@media (max-width: 498.991px) {
  /* Span Tag - Double escaped for JS string safety */
  #__next .custom-theme #nav-handler .md\\:w-\\[--sidebar-width\\] .md\\:w-auto .flex-col .flex-col .md\\:pl-\\[--workspace-width\\] .flex-shrink-0 .bg-\\[--workspace-color\\] .justify-center .overflow-hidden .sm\\:leading-normal {
    font-size: 15px !important;
    text-shadow: rgba(0, 0, 0, 0.3) 0px 1px 1px !important;
  }
}
  `;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = css;
  document.head.appendChild(style);
})();
