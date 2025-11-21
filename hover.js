(function() {
    const css = `
        /* Keep your input area tweak */
        #nav-handler>div:nth-child(2)>main:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1) {
            background-color: rgba(255, 255, 255, 0) !important;
        }

        /* Only response blocks inside the main chat scroll area */
        .chat-main .response-block,
        .chat-messages .response-block {
            background-color: rgba(255, 255, 255, 0) !important;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
})();
