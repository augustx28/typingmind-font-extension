// ==UserScript==
// @name         TypingMind - Remove Sidebar Hover Color
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disables the background color change on hover for chat items in the sidebar.
// @author       You
// @match        https://www.typingmind.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // This CSS rule targets the links in the sidebar and removes their background color on hover.
    const customCSS = `
        #nav-handler a.flex:hover {
            background-color: transparent !important;
        }
    `;

    // The script creates a <style> element and injects your CSS into the webpage.
    const styleElement = document.createElement('style');
    styleElement.textContent = customCSS;
    document.head.append(styleElement);

})();
