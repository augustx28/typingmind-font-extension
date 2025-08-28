// Create a new <style> element
const style = document.createElement('style');

// Define your CSS rules as a string
// I added !important to ensure this style overrides any existing ones.
const css = `
  #nav-handler>div:nth-child(2)>main:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1) {
    background-color: rgba(255, 255, 255, 0) !important;
  }
`;

// Add the CSS rules to the <style> element
style.innerHTML = css;

// Append the <style> element to the document's <head>
document.head.appendChild(style);

console.log('Custom TypingMind style applied.');
