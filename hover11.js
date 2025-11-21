// This function creates a <style> tag and adds your custom CSS to the page.
(function() {
    const css = `
        /* This rule for the chat input area is unchanged. */
        #nav-handler>div:nth-child(2)>main:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1) {
            background-color: rgba(255, 255, 255, 0) !important;
        }

        /* * FIXED RULE:
         * 1. Scoped with 'main' to only target the chat area (ignores the model selector in the header).
         * 2. Added ':hover' to ensure the color doesn't change when you move your mouse over it.
         */
        main .response-block,
        main .response-block:hover {
            background-color: rgba(255, 255, 255, 0) !important;
            /* Optional: If you want the original bubble color but just no hover effect, 
               change the line above to: background-color: inherit !important; */
        }
    `;

    // Create a style element
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;

    // Append the style element to the document's head
    document.head.appendChild(styleSheet);
})();
