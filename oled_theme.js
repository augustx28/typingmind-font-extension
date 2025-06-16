(function() {
    'use strict';

    const css = `
        /* BackUnknown blur */
        #nav-handler .flex-col .backdrop-blur-md {
            background-color: #000000 !important;
        }

        /* Dynamic chat content container */
        #nav-handler .flex-col .dynamic-chat-content-container {
            background-color: #000000 !important;
            transform: translatex(0px) translatey(0px);
        }

        /* Transition all */
        .flex-col:nth-child(1) > .transition-all:nth-child(3) {
            background-color: #000000 !important;
        }

        /* General message container styling */
        .sm\\:flex-wrap {
            /* This is a general class, targeting it broadly might have unintended effects.
               If you want to target specific message containers, a more specific selector would be needed.
               For demonstration, this will apply a black background to elements with this class. */
            background-color: #000000 !important;
        }

        /* If you have a specific message ID you want to target, you can use it like this.
           However, message IDs are dynamic and will change with each session.
           A more general approach is usually better for themes. */
        /*
        .message-id-d1278aa4-d03e-40e0-8441-4f267d50f6db div .sm\\:flex-wrap {
            background-color: #000000 !important;
        }
        */
    `;
