(function() {
    const css = `
        /* * Target ONLY the AI response bubbles. 
         * using 'transparent' covers the rgba(0,0,0,0) requirement.
         */
        .response-block {
            background-color: transparent !important;
        }

        /* * Ensure the hover (over) effect is also removed.
         */
        .response-block:hover {
            background-color: transparent !important;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
})();
