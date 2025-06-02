function addCustomCSS() {
  const css = `
    /* workspace color */
    .transition div .bg-\\[--workspace-color\\] {
      background-color: #161616 !important; /* Added !important for specificity */
    }

    /* var(  workspace height) */
    #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
      background-color: #161616 !important; /* Added !important for specificity */
    }

    /* Division */
    .transition div .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\] {
      background-color: #000000 !important; /* Added !important for specificity */
    }

    /* Svg */
    .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\] div .h-6 {
      color: #f49f00 !important; /* Added !important for specificity */
    }

    /* Full */
    .bg-\\[--workspace-color\\] .flex .w-full .w-full {
      transform: translatex(0px) translatey(0px);
    }

    /* Nav handler */
    #nav-handler {
      transform: translatex(0px) translatey(0px);
    }

    /* Transition colors */
    .flex-col .grid div:nth-child(1) .cursor-pointer .transition-colors {
      transform: translatex(0px) translatey(0px);
    }

    /* Division */
    .h-\\[var\\(--workspace-height\\)\\] .sm\\:block .md\\:flex-col {
      transform: translatex(0px) translatey(0px);
    }

    /* Span Tag */
    .h-\\[var\\(--workspace-height\\)\\] .focus\\:text-white .flex-col span {
      font-weight: 500;
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

// Run the function to apply the CSS
addCustomCSS();

// It's a good practice to also provide a way to remove the CSS if needed
function removeCustomCSS() {
  const styleElement = document.head.querySelector('style[type="text/css"]');
  if (styleElement && styleElement.textContent.includes('/* workspace color */')) { // Check for a unique comment to identify our style
    document.head.removeChild(styleElement);
  }
}

// To remove, you would call:
// removeCustomCSS();
