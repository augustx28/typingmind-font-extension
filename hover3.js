// This function creates a <style> tag and adds your custom CSS to the page.
(function() {
    const css = `
        /* --- 1. INPUT AREA (Keep existing rule) --- */
        #nav-handler>div:nth-child(2)>main:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1) {
            background-color: rgba(255, 255, 255, 0) !important;
        }

        /* --- 2. RESPONSE AREA TRANSPARENCY --- */
        /* Target the main container and force it to be transparent, 
           even on hover (stops the lightening effect). */
        main .response-block,
        main .response-block:hover {
            background-color: transparent !important;
            box-shadow: none !important; /* Optional: removes shadow for a cleaner look */
        }

        /* --- 3. RESTORE HEADER (MODEL SELECTOR) --- */
        /* Target the first element inside the response block (the header/selector)
           and give it a background color so it doesn't disappear. */
        main .response-block > div:first-child {
            /* 'var(--bg-base-200)' is a common theme variable. 
               If this color doesn't match your theme, replace it with a hex code 
               like #ffffff (white) or #1f2937 (dark gray). */
            background-color: var(--bg-base-200, #f3f4f6) !important; 
            
            /* Ensure the border/separation is still visible if needed */
            border-bottom: 1px solid rgba(0,0,0,0.1) !important; 
        }
    `;

    // Create a style element
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;

    // Append the style element to the document's head
    document.head.appendChild(styleSheet);
})();
