// ==UserScript==
// @name         TypingMind Parallel Chat Arrows (Mobile)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds navigation arrows to switch between parallel model responses on TypingMind's mobile view.
// @author       Your Name
// @match        https://www.typingmind.com/chathistory/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration: You may need to update these selectors! ---
    // This is the most likely part to break if TypingMind updates their site.
    // Use your browser's "Inspect" tool to find the correct class names.
    const CHAT_CONTAINER_SELECTOR = '.group-chat-item'; // The container for a single prompt/response group.
    const MODEL_RESPONSE_SELECTOR = '.chat-message-container'; // The individual container for each model's response.
    // --- End of Configuration ---

    function addNavigationArrows(chatGroup) {
        // First, check if this group already has our arrows. If so, do nothing.
        if (chatGroup.querySelector('.parallel-nav-arrow')) {
            return;
        }

        const responses = chatGroup.querySelectorAll(MODEL_RESPONSE_SELECTOR);
        // Only add arrows if there is more than one model response.
        if (responses.length > 1) {
            let currentIndex = 0;

            // Initially, hide all responses except the first one.
            responses.forEach((response, index) => {
                if (index !== 0) {
                    response.style.display = 'none';
                }
            });

            // Function to show the correct response.
            const showResponse = (index) => {
                responses.forEach(r => r.style.display = 'none');
                responses[index].style.display = 'block';
            };

            // Create the Left Arrow.
            const leftArrow = document.createElement('div');
            leftArrow.innerHTML = '‹'; // Left-pointing angle bracket
            leftArrow.className = 'parallel-nav-arrow left';
            leftArrow.onclick = () => {
                currentIndex = (currentIndex - 1 + responses.length) % responses.length;
                showResponse(currentIndex);
            };

            // Create the Right Arrow.
            const rightArrow = document.createElement('div');
            rightArrow.innerHTML = '›'; // Right-pointing angle bracket
            rightArrow.className = 'parallel-nav-arrow right';
            rightArrow.onclick = () => {
                currentIndex = (currentIndex + 1) % responses.length;
                showResponse(currentIndex);
            };

            // Add the arrows to the chat group container.
            chatGroup.appendChild(leftArrow);
            chatGroup.appendChild(rightArrow);
            chatGroup.style.position = 'relative'; // Necessary for positioning the arrows.
        }
    }

    // --- Add CSS for the arrows ---
    const styles = `
        .parallel-nav-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: 32px;
            font-weight: bold;
            color: #888;
            cursor: pointer;
            z-index: 100;
            padding: 10px 5px;
            user-select: none; /* Prevents text selection on click */
            background-color: rgba(240, 240, 240, 0.7);
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }
        .parallel-nav-arrow:hover {
            color: #000;
            background-color: rgba(220, 220, 220, 0.9);
        }
        .parallel-nav-arrow.left {
            left: -15px;
        }
        .parallel-nav-arrow.right {
            right: -15px;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);


    // --- Use a MutationObserver to detect when new chats are added ---
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    // Check if the added node is a chat container or contains them.
                    if (node.nodeType === 1) { // Ensure it's an element
                        if (node.matches(CHAT_CONTAINER_SELECTOR)) {
                            addNavigationArrows(node);
                        }
                        node.querySelectorAll(CHAT_CONTAINER_SELECTOR).forEach(addNavigationArrows);
                    }
                });
            }
        }
    });

    // Start observing the main chat area for changes.
    // You might need to find a more specific selector for the main content area.
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);

    // Also run once on load for any existing chat items.
    document.querySelectorAll(CHAT_CONTAINER_SELECTOR).forEach(addNavigationArrows);
    console.log("TypingMind Parallel Arrows script loaded.");

})();
