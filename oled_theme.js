// Create a new style element
const style = document.createElement('style');

// Set the CSS content
style.textContent = `
  /* BackUnknown blur */
  #nav-handler .flex-col .backdrop-blur-md {
    background-color: #000000 !important;
  }

  /* Dynamic chat content container */
  #nav-handler .flex-col .dynamic-chat-content-container {
    background-color: #000000 !important;
    transform: translatex(0px) translatey(0px);
  }

  /* Transition all */
  .flex-col:nth-child(1) > .transition-all:nth-child(3) {
    background-color: #000000 !important;
  }

  /* Division */
  .message-id-d1278aa4-d03e-40e0-8441-4f267d50f6db div .sm\\:flex-wrap {
    background-color: #000000 !important;
  }
`;

// Append the style element to the document head
document.head.appendChild(style);
