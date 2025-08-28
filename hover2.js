// This function creates a <style> tag and adds your custom CSS to the page.
(function() {
    // Your CSS rules are placed inside the backticks (`).
    const css = `
        /* This rule for the chat input area is unchanged. */
        #nav-handler>div:nth-child(2)>main:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1) {
            background-color: rgba(255, 255, 255, 0) !important;
        }

        /* * NEW, MORE RELIABLE RULE for all AI responses.
         * This targets the text container inside any response bubble.
        */
        div[id^="response-"] .prose {
            background-color: rgba(255, 255, 255, 0) !important;
        }
    `;

    // Create a style element
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;

    // Append the style element to the document's head
    document.head.appendChild(styleSheet);
})();
