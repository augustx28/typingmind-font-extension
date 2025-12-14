// Custom Layout Adjustment (Fixed Selectors)
const style = document.createElement('style');
style.innerHTML = `
  /* 1. Main Container Position */
  .md\\:pl-\\[--current-sidebar-width\\] .antialiased > .justify-center {
    position: relative !important;
  }

  /* 2. Shift Responsive Container Up */
  .md\\:flex .antialiased .justify-center {
    top: -13px !important;
  }

  /* 3. Shift Main Content (Agents) Up Significantly */
  .md\\:flex .antialiased:nth-child(2) > .justify-center:nth-child(1) {
    top: -109px !important;
  }

  /* 4. Make Normal Text Bolder */
  .grid div .font-normal {
    font-weight: 500 !important;
  }
`;
document.head.appendChild(style);
