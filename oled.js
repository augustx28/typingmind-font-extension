function addOledTheme() {
  // Create a style element
  const style = document.createElement('style');

  // Add the CSS rules to the style element
  style.textContent = `
    /* Main container and background */
    body,
    #__next .custom-theme,
    .\@container .flex-col .overflow-y-auto > .relative,
    .\@container .flex-col .dark\:bg-\[--main-dark-color\],
    .\@container .flex-col > .transition-all,
    .\@container .flex-col .overflow-y-auto {
      background-color: #000000 !important;
    }

    /* Workspace and layout adjustments */
    .transition div .bg-\[--workspace-color\],
    #nav-handler .transition > .flex-col,
    .bg-\[--workspace-color\] > .flex:nth-child(1) {
      transform: translatex(0px) translatey(0px);
    }

    /* Specific element positioning */
    div .bg-\[--workspace-color\] .flex .w-full .w-full,
    .message-id-24d6ca05-79fb-4605-99c0-c5fc94b56122 div .items-stretch {
      transform: translatex(557px) translatey(117px);
    }

    /* Typography */
    .transition div .sm\:leading-normal {
      font-size: 18px;
      font-weight: 700;
    }
  `;

  // Append the style element to the document's head
  document.head.appendChild(style);
}

// Run the function to apply the theme
addOledTheme();
