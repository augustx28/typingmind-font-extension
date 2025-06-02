// content.js

// Create a <style> element
const styleElement = document.createElement('style');

// Set the CSS rules as the inner HTML of the <style> element
styleElement.innerHTML = `
  /* workspace color */
  .transition div .bg-\\[--workspace-color\\] {
    background-color: #161616 !important; /* Added !important for higher specificity if needed */
  }

  /* var( workspace height) */
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
    transform: translatex(0px) translatey(0px); /* Consider if !important is needed */
  }

  /* Nav handler */
  #nav-handler {
    transform: translatex(0px) translatey(0px); /* Consider if !important is needed */
  }

  /* Transition colors */
  .flex-col .grid div:nth-child(1) .cursor-pointer .transition-colors {
    transform: translatex(0px) translatey(0px); /* Consider if !important is needed */
  }

  /* Division */
  .h-\\[var\\(--workspace-height\\)\\] .sm\\:block .md\\:flex-col {
    transform: translatex(0px) translatey(0px); /* Consider if !important is needed */
  }

  /* Span Tag */
  .h-\\[var\\(--workspace-height\\)\\] .focus\\:text-white .flex-col span {
    font-weight: 500 !important;
  }

  /* Full */
  .pb-8 .flex-col .w-full {
    font-weight: 500 !important;
  }

  /* Span Tag */
  .bg-\\[--workspace-color\\] .flex .sm\\:leading-normal {
    font-weight: 700 !important;
    font-size: 18px !important;
  }
`;

// Append the <style> element to the <head> of the document
document.head.appendChild(styleElement);

console.log('TypingMind custom styles applied!');
