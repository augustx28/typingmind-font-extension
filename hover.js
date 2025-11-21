// Create a style element
const style = document.createElement('style');

// Define the CSS content
// We target .response-block generally and force the background to be transparent
// on both the normal state and the hover state to prevent any flickering/changes.
style.textContent = `
  .response-block, 
  .response-block:hover, 
  .response-block:active {
    background-color: rgba(38,38,38,0) !important;
    transition: none !important; /* Optional: removes the fade animation */
  }
`;

// Append the style element to the document head
document.head.appendChild(style);
