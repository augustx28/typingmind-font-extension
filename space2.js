(function() {
  const styleId = 'tm-custom-ui-tweaks';
  
  // Prevent duplicate injection if the script runs twice
  if (document.getElementById(styleId)) return;

  const css = `
    .md\\:pl-\\[--current-sidebar-width\\] .antialiased > .justify-center {
      position: relative;
    }

    /* Justify center */
    .md\\:flex .antialiased .justify-center {
      top: -13px;
    }

    .md\\:flex .antialiased:nth-child(2) > .justify-center:nth-child(1) {
      top: -109px;
    }

    .grid div .font-normal {
      font-weight: 500;
    }

    /* @container */
    .md\\:flex .overflow-y-auto .\\@container {
      transform: translatex(0px) translatey(0px);
    }
  `;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = css;
  document.head.appendChild(style);
})();
