// ==UserScript==
// @name         TypingMind Customizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Customizes the appearance of TypingMind.
// @author       Your Name
// @match        https://www.typingmind.com/*
// @grant        GM_addStyle
// ==/UserScript==

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
            transform: translatex(0px) translatey(0px) !important;
        }

        /* Transition all */
        .flex-col:nth-child(1) > .transition-all:nth-child(3) {
            background-color: #000000 !important;
        }

        /* Division */
        .message-id-d1278aa4-d03e-40e0-8441-4f267d50f6db div .sm\\:flex-wrap {
            background-color: #000000 !important;
        }
    `;

    GM_addStyle(css);
})();
