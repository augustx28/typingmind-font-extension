// ==UserScript==
// @name         TypingMind Custom Colors
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Applies custom folder and background colors to TypingMind.
// @author       You
// @match        https://www.typingmind.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // This string holds all your custom CSS rules.
    const customCSS = `
        /**
         * Rule 1: Changes the color of the folder icons.
         * The color is set to #DA9010 as requested.
         */
        .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\))\\] div .h-6 {
            color: #DA9010 !important;
        }

        /**
         * Rule 2: Changes the background color of the main content area.
         * The color is set to #191919 as requested.
         */
        .transition .flex-col .md\\:pl-\\[--workspace-width\\] {
            background-color: #191919 !important;
        }

        /**
         * Rule 3: Changes the background color of the left navigation bar.
         * The color is set to #191919 as requested.
         */
        #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
            background-color: #191919 !important;
        }
    `;

    // This part of the code creates a <style> tag in the HTML.
    const styleElement = document.createElement('style');

    // It then inserts your CSS rules into that <style> tag.
    styleElement.textContent = customCSS;

    // Finally, it adds the new <style> tag to the website's header, applying your styles.
    document.head.append(styleElement);

})();
