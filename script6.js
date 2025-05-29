// == TypingMind Extension: Pure-Black Sidebar ==
// Description: Forces several sidebar sections to pure black
(function injectPureBlackSidebar() {
  const css = `
    /* BackUnknown blur */
    #nav-handler .flex-col .backdrop-blur-md{
      background-color:#000000 !important;
    }

    /* Relative */
    .overflow-y-auto .dark\\:bg-\\[--main-dark-color\\] .flex-col .overflow-y-auto > .relative{
      background-color:#000000 !important;
    }

    /* Transition all */
    .overflow-y-auto .dark\\:bg-\\[--main-dark-color\\] .flex-col > .transition-all{
      background-color:#000000 !important;
    }
  `;

  /* Inject the <style> tag */
  const style = document.createElement('style');
  style.id = 'tm-pure-black-sidebar';
  style.textContent = css;
  document.head.appendChild(style);
})();
