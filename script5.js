function customizeTypingMindAppearance() {
  const css = `
    /* workspace color */
    .transition div .bg-\\[--workspace-color\\] {
      background-color: #232323 !important;
    }

    /* var( workspace height) */
    #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
      background-color: #232323 !important;
    }

    /* Division */
    .transition div .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\] {
      background-color: #000000 !important;
    }

    /* Svg */
    .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\] div .h-6 {
      color: #f49f00 !important;
    }

    /* Full */
    .bg-\\[--workspace-color\\] .flex .w-full .w-full {
      transform: translatex(0px) translatey(0px);
    }

    /* Nav handler */
    #nav-handler {
      transform: translatex(0px) translatey(0px);
    }

    /* Full */
    .min-h-full > .w-full {
      transform: translatex(0px) translatey(0px);
    }

    /* Full */
    .pb-8 .flex-col .w-full {
      font-weight: 500;
    }
  `;

  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.appendChild(document.createTextNode(css));
  document.head.appendChild(styleElement);
}

// Run the function to apply the styles
customizeTypingMindAppearance();
