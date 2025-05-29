/* ===== TypingMind: solid-black theme injector ===== */
(function injectBlackTheme() {
  // Prevent double-insertion if TypingMind hot-reloads
  if (document.getElementById('tm-black-theme')) return;

  const css = `
  /* Relative */
  .overflow-y-auto .dark\\:bg-\\[--main-dark-color\\] .flex-col .overflow-y-auto > .relative{
    background-color:#000000;
  }

  /* Transition all */
  .overflow-y-auto .dark\\:bg-\\[--main-dark-color\\] .flex-col > .transition-all{
    background-color:#000000;
  }

  /* Division */
  .h-\\[var\\(--workspace-height\\)\\] .sm\\:block .md\\:flex-col{
    background-color:#000000;
  }

  /* workspace color */
  .transition div .bg-\\[--workspace-color\\]{
    background-color:#000000;
  }

  /* Division */
  .transition div .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\]{
    background-color:#000000;
  }

  /* Flex col */
  .h-\\[var\\(--workspace-height\\)\\] .relative > .flex-col{
    background-color:rgba(0,0,0,0);
  }

  /* Division */
  .\\@container .flex-col .overflow-y-auto > div{
    background-color:#000000;
  }

  /* Overflow auto */
  .\\@container .flex-col .overflow-y-auto{
    background-color:#020202;
  }

  /* Grid */
  .\\@container .flex-col .grid{
    background-color:#000000;
  }

  /* BackUnknown blur */
  .\\@container .flex-col .backdrop-blur-md{
    background-color:#000000;
  }
  `;

  const styleEl = document.createElement('style');
  styleEl.id = 'tm-black-theme';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  console.log('[TypingMind] Black theme injected');
})();
