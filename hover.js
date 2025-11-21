(function() {
    const css = `
        /* 
         * Target ONLY the chat input container.
         * 'div:has(> textarea)' finds the div that directly contains the text input.
         * This prevents the hover effect (color change) and keeps it transparent/static.
         */
        div:has(> textarea) {
            background-color: rgba(255, 255, 255, 0) !important;
            transition: none !important; /* Removes the smooth hover transition */
            box-shadow: none !important; /* Optional: removes any glow/border shadow */
        }

        /* 
         * Your existing rule for AI responses.
         * Keeps the AI message blocks transparent as requested.
         */
        .response-block {
            background-color: rgba(255, 255, 255, 0) !important;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
})();
