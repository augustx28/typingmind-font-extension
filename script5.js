function applyCustomStyles() {
  const css = `
    /* workspace color */
    .transition div .bg-\\[--workspace-color\\] {
      background-color: #161616 !important;
    }

    /* var(  workspace height) */
    #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
      background-color: #161616 !important;
    }

    /* Division */
    .transition div .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\] {
      background-color: #161616 !important;
    }

    /* Svg */
    .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\] div .h-6 {
      color: #f49f00 !important;
    }

    /* Full */
    .bg-\\[--workspace-color\\] .flex .w-full .w-full {
      transform: translateX(0px) translateY(0px);
    }

    /* Nav handler */
    #nav-handler {
      transform: translateX(0px) translateY(0px);
    }

    /* Transition colors */
    .flex-col .grid div:nth-child(1) .cursor-pointer .transition-colors {
      transform: translateX(0px) translateY(0px);
    }

    /* Division */
    .h-\\[var\\(--workspace-height\\)\\] .sm\\:block .md\\:flex-col {
      transform: translateX(0px) translateY(0px);
    }

    /* Span Tag */
    .h-\\[var\\(--workspace-height\\)\\] .focus\\:text-white .flex-col span {
      font-weight: 500;
    }

    /* Full */
    .pb-8 .flex-col .w-full {
      font-weight: 500;
    }

    /* Span Tag */
    .bg-\\[--workspace-color\\] .flex .sm\\:leading-normal {
      font-weight: 700;
      font-size: 18px;
    }
  `;

  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.appendChild(document.createTextNode(css));
  document.head.appendChild(styleElement);
}

// Call the function to apply the styles
applyCustomStyles();

// You might also want to ensure the styles are reapplied if TypingMind dynamically changes content
// For example, using a MutationObserver or by calling applyCustomStyles() at appropriate intervals
// or in response to specific events, if TypingMind's extension API supports that.
// For a simple user script/extension, calling it once might be sufficient if the elements are static.
