// This function creates a <style> tag and adds your custom CSS to the page.
(function() {
    const css = `
        /* 1. KEEP INPUT AREA TRANSPARENT (Your original request) */
        #nav-handler>div:nth-child(2)>main:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1) {
            background-color: rgba(255, 255, 255, 0) !important;
        }

        /* 2. MAKE THE RESPONSE BODY TRANSPARENT & DISABLE HOVER FLICKER */
        main .response-block, 
        main .response-block:hover {
            background-color: transparent !important;
            box-shadow: none !important;
        }

        /* 3. FIX THE HEADER (MODEL SELECTOR) - MAKE IT SOLID */
        /* We target the first section inside the response block (the header) 
           and force it to have a background color so it isn't see-through. */
        main .response-block > div:first-child {
            background-color: #1F2937 !important; /* Dark Grey - Change this HEX code if you want a different color */
            border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* Adds a subtle separator line */
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
        }
        
        /* Optional: Fix the footer (buttons at bottom) if they also look weird */
        main .response-block > div:last-child {
             background-color: transparent !important;
        }
    `;

    // Create a style element
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;

    // Append the style element to the document's head
    document.head.appendChild(styleSheet);
})();
