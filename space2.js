// Move AI Agents Up (The "Flexbox" Method)
const style = document.createElement('style');
style.innerHTML = `
  /* 1. Target the same container 
     2. Disable vertical centering (justify-content: flex-start)
     3. Add 10% spacing from the top so it's not glued to the header
  */
  .md\\:pl-\\[--current-sidebar-width\\] .antialiased .justify-center {
    justify-content: flex-start !important; 
    padding-top: 10vh !important; 
    top: 0 !important; /* Reset any manual shifts */
  }
`;
document.head.appendChild(style);
