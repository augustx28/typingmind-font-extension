// Custom Layout Adjustment (Shift Up + Font Weight)
const style = document.createElement('style');
style.innerHTML = `
  /* Main Container Position */
  .md\\:pl-\\[--current-sidebar-width\\] .antialiased > .justify-center {
    position: relative;
  }

  /* Shift Responsive Container Up */
  .md\\:flex .antialiased .justify-center {
    top: -13px;
  }

  /* Shift Main Content (Agents) Up Significantly */
  .md\\:flex .antialiased:nth-child(2) > .justify-center:nth-child(1) {
    top: -109px;
  }

  /* Make Normal Text Bolder */
  .grid div .font-normal {
    font-weight: 500;
  }
`;
document.head.appendChild(style);
