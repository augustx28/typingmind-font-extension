// This function creates a <style> tag and adds your custom CSS to the page.
(function() {
    // Your CSS rules are placed inside the backticks (`).
    const css = `
        /* Your first rule for the chat input area */
        #nav-handler>div:nth-child(2)>main:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1) {
            background-color: rgba(255, 255, 255, 0) !important;
        }

        /* MODIFIED RULE: This targets all AI response containers */
        /* It looks for any element whose ID *starts with* "response-" */
        div[id^="response-"] > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) {
            background-color: rgba(255, 255, 255, 0) !important;
        }
    `;

    // Create a style element
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;

    // Append the style element to the document's head
    document.head.appendChild(styleSheet);
})();
