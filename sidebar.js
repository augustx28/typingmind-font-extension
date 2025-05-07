// ==UserScript==
// @name         ChatGPT Custom Sidebar - TypingMind Inspired
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces ChatGPT sidebar with a TypingMind-inspired design, new colors, and new icons.
// @author       Your Name
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js // Optional: Or use SVG icons directly
// ==/UserScript==

(function() {
    'use_strict';

    // --- 0. Configuration ---
    const COLORS = {
        bgPrimary: '#1A1A1A', // Main sidebar background
        bgSecondary: '#2A2A2A', // Chat item background, input fields
        bgHover: '#383838', // Hover states
        bgActive: '#007ACC', // Active chat item or accent element
        textPrimary: '#E5E5E5', // Main text
        textSecondary: '#B0B0B0', // Subtitles, less important text
        accent: '#00A9FF', // New chat button, highlights
        border: '#3D3D3D', // Borders if any
    };

    // --- Example SVG Icons (Replace with your chosen SVGs) ---
    // You can get these from sites like feathericons.com or materialdesignicons.com
    // Ensure they are properly escaped if embedded directly in JS strings, or use template literals.
    const ICONS = {
        newChat: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg>`, // Plus icon
        search: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`, // Search icon
        chatHistory: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`, // Placeholder for chat history icon
        settings: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`, // Settings icon
        userAccount: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`, // User icon
        // Add more icons as needed, mirroring TypingMind's structure
    };

    // --- 1. CSS Styles ---
    // This is where you'll define the look of your new sidebar.
    // It's inspired by TypingMind's structure but with your chosen colors/icons.
    const customCSS = `
        /* Hide original ChatGPT sidebar - YOU MUST FIND THE CORRECT SELECTOR */
        /* Example: .gpt-sidebar, #sidebar, [class*="default-sidebar-class"] */
        /* It might be a more complex selector. Inspect carefully! */
        /* THIS IS THE MOST CRITICAL SELECTOR TO GET RIGHT: */
        div[class*="shared__Wrapper"] { /* This is a common pattern, but verify! */
             display: none !important;
        }

        /* Potentially hide other elements if needed */
        /* Example: .some-other-chatgpt-element { display: none !important; } */

        /* New Custom Sidebar Styles */
        .custom-sidebar {
            width: 280px; /* Adjust as per TypingMind or your preference */
            height: 100vh;
            background-color: ${COLORS.bgPrimary};
            color: ${COLORS.textPrimary};
            display: flex;
            flex-direction: column;
            padding: 12px;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; /* Modern font stack */
            position: fixed; /* Or absolute, depending on ChatGPT's layout */
            top: 0;
            left: 0;
            z-index: 1000; /* Ensure it's on top */
        }

        .custom-sidebar-header {
            padding: 10px 0px;
            margin-bottom: 15px;
        }

        .custom-sidebar-new-chat-btn {
            background-color: ${COLORS.accent};
            color: ${COLORS.bgPrimary}; /* Or a light color like #FFFFFF */
            border: none;
            border-radius: 8px;
            padding: 12px;
            width: 100%;
            text-align: left;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            transition: background-color 0.2s ease;
        }
        .custom-sidebar-new-chat-btn:hover {
            background-color: ${shadeColor(COLORS.accent, -20)}; /* Darken accent on hover */
        }
        .custom-sidebar-new-chat-btn svg {
            margin-right: 10px;
            stroke: ${COLORS.bgPrimary}; /* Or #FFFFFF */
        }

        .custom-sidebar-search {
            margin-bottom: 15px;
        }
        .custom-sidebar-search input {
            width: 100%;
            padding: 10px;
            background-color: ${COLORS.bgSecondary};
            border: 1px solid ${COLORS.border};
            border-radius: 6px;
            color: ${COLORS.textPrimary};
            font-size: 14px;
        }
        .custom-sidebar-search input::placeholder {
            color: ${COLORS.textSecondary};
        }

        .custom-sidebar-section-title {
            font-size: 12px;
            color: ${COLORS.textSecondary};
            text-transform: uppercase;
            margin: 15px 0 8px 0;
            padding-left: 5px;
        }

        .custom-sidebar-chat-list {
            flex-grow: 1;
            overflow-y: auto;
            /* Custom scrollbar (optional) */
        }
        .custom-sidebar-chat-list::-webkit-scrollbar {
            width: 6px;
        }
        .custom-sidebar-chat-list::-webkit-scrollbar-thumb {
            background-color: ${COLORS.bgHover};
            border-radius: 3px;
        }


        .custom-sidebar-chat-item {
            display: flex;
            align-items: center;
            padding: 10px 8px;
            border-radius: 6px;
            margin-bottom: 4px;
            cursor: pointer;
            transition: background-color 0.2s ease;
            font-size: 14px;
        }
        .custom-sidebar-chat-item:hover {
            background-color: ${COLORS.bgHover};
        }
        .custom-sidebar-chat-item.active {
            background-color: ${COLORS.bgActive};
            color: white; /* Or a contrasting light color */
        }
        .custom-sidebar-chat-item svg {
            margin-right: 10px;
            stroke: ${COLORS.textPrimary}; /* Default icon color */
        }
        .custom-sidebar-chat-item.active svg {
            stroke: white; /* Icon color for active item */
        }


        .custom-sidebar-footer {
            margin-top: auto; /* Pushes to the bottom */
            padding-top: 10px;
            border-top: 1px solid ${COLORS.border};
        }

        .custom-sidebar-footer-item {
            display: flex;
            align-items: center;
            padding: 10px 8px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s ease;
        }
        .custom-sidebar-footer-item:hover {
            background-color: ${COLORS.bgHover};
        }
         .custom-sidebar-footer-item svg {
            margin-right: 10px;
            stroke: ${COLORS.textPrimary};
        }

        /* Adjust ChatGPT main content area if sidebar is fixed and takes up space */
        /* YOU WILL LIKELY NEED TO ADJUST THIS SELECTOR AND THE PADDING */
        /* Example: body #__next { padding-left: 280px !important; } */
        /* This selector needs to target the main content wrapper of ChatGPT */
        main[class*="relative"] { /* This is a guess, inspect ChatGPT's main content area */
            padding-left: 295px !important; /* Sidebar width + a little margin */
            transition: padding-left 0.3s ease; /* Smooth transition if sidebar collapses */
        }

        /* Add more specific styles for folders, prompts, etc., as per TypingMind's structure */
    `;
    GM_addStyle(customCSS);


    // --- 2. Helper Functions ---
    function createElement(tag, attributes = {}, children = []) {
        const el = document.createElement(tag);
        for (const key in attributes) {
            if (key === 'className') el.className = attributes[key];
            else if (key === 'textContent') el.textContent = attributes[key];
            else if (key === 'innerHTML') el.innerHTML = attributes[key]; // Use with caution
            else el.setAttribute(key, attributes[key]);
        }
        children.forEach(child => {
            if (typeof child === 'string') el.appendChild(document.createTextNode(child));
            else el.appendChild(child);
        });
        return el;
    }

    // Helper to darken/lighten colors (for hover effects)
    function shadeColor(color, percent) {
        let R = parseInt(color.substring(1, 3), 16);
        let G = parseInt(color.substring(3, 5), 16);
        let B = parseInt(color.substring(5, 7), 16);
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;
        R = Math.max(0, R);
        G = Math.max(0, G);
        B = Math.max(0, B);
        const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
        const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
        const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));
        return "#" + RR + GG + BB;
    }


    // --- 3. Main Sidebar Creation Function ---
    function createCustomSidebar() {
        // Remove existing custom sidebar if any (for re-runs or dynamic updates)
        const existingCustomSidebar = document.querySelector('.custom-sidebar');
        if (existingCustomSidebar) {
            existingCustomSidebar.remove();
        }

        const sidebar = createElement('div', { className: 'custom-sidebar' });

        // --- A. Sidebar Header (e.g., New Chat Button) ---
        const header = createElement('div', { className: 'custom-sidebar-header' });
        const newChatButton = createElement('button', {
            className: 'custom-sidebar-new-chat-btn',
            innerHTML: ICONS.newChat + 'New Chat' // Using innerHTML for SVG
        });
        newChatButton.addEventListener('click', () => {
            // IMPORTANT: Find the actual "New Chat" button or its functionality in ChatGPT and trigger it.
            // This might involve finding a button with a specific aria-label or class and clicking it.
            // Example: document.querySelector('nav button:first-child')?.click();
            // Or, if it navigates to a URL: window.location.href = "https://chatgpt.com/";
            console.log("New Chat clicked - Implement actual action!");
            const newChatButtonOriginal = document.querySelector('a[href="/"]'); // This is a common selector for the "New Chat" on ChatGPT
            if (newChatButtonOriginal) newChatButtonOriginal.click();
            else console.error("Original 'New Chat' button not found.");
        });
        header.appendChild(newChatButton);
        sidebar.appendChild(header);


        // --- B. Search Bar (if TypingMind has one prominently) ---
        // const searchSection = createElement('div', { className: 'custom-sidebar-search' });
        // const searchInput = createElement('input', { type: 'text', placeholder: 'Search chats...' });
        // searchInput.addEventListener('input', (e) => {
        //     console.log('Search term:', e.target.value);
        //     // Implement search/filter functionality for your chat list items
        // });
        // searchSection.appendChild(searchInput);
        // sidebar.appendChild(searchSection);


        // --- C. Chat History Section ---
        // This is the most complex part as you need to observe or replicate ChatGPT's chat list.
        // For simplicity, this example creates static items.
        // You'll need to adapt this to dynamically list actual chats from ChatGPT.
        // You might need to observe ChatGPT's DOM for its chat list and re-render yours.
        const chatListTitle = createElement('div', { className: 'custom-sidebar-section-title', textContent: 'Recent Chats' });
        sidebar.appendChild(chatListTitle);

        const chatList = createElement('div', { className: 'custom-sidebar-chat-list' });

        // Example chat items (replace with dynamic generation)
        const exampleChats = [
            { id: '1', title: 'My Trip to Italy Planning', icon: ICONS.chatHistory },
            { id: '2', title: 'JavaScript Project Ideas', icon: ICONS.chatHistory },
            { id: '3', title: 'Recipe for Sourdough Bread', icon: ICONS.chatHistory, active: true },
            // ... more chats
        ];

        exampleChats.forEach(chatData => {
            const chatItem = createElement('div', {
                className: `custom-sidebar-chat-item ${chatData.active ? 'active' : ''}`,
                innerHTML: (chatData.icon || ICONS.chatHistory) + `<span class="chat-title-text">${chatData.title}</span>`
            });
            chatItem.addEventListener('click', () => {
                console.log(`Clicked chat: ${chatData.title} - Implement navigation!`);
                // IMPORTANT: Find the corresponding chat link in the original ChatGPT sidebar and click it.
                // This usually involves finding an <a> tag with a specific href or title.
                // Example: document.querySelector(`a[href*="${chatData.id}"]`)?.click();

                // Remove 'active' class from other items and add to this one
                document.querySelectorAll('.custom-sidebar-chat-item.active').forEach(item => item.classList.remove('active'));
                chatItem.classList.add('active');
            });
            chatList.appendChild(chatItem);
        });
        sidebar.appendChild(chatList);

        // --- D. Other Sections (Mimic TypingMind: e.g., Prompts, Folders) ---
        // You'll need to inspect TypingMind and decide what sections to replicate.
        // Example:
        // const promptsTitle = createElement('div', {className: 'custom-sidebar-section-title', textContent: 'My Prompts'});
        // sidebar.appendChild(promptsTitle);
        // const promptsList = createElement('div', {className: 'custom-sidebar-item-list'});
        // ... add prompt items ...
        // sidebar.appendChild(promptsList);


        // --- E. Footer (Settings, Account) ---
        const footer = createElement('div', { className: 'custom-sidebar-footer' });

        const settingsItem = createElement('div', {
            className: 'custom-sidebar-footer-item',
            innerHTML: ICONS.settings + 'Settings'
        });
        settingsItem.addEventListener('click', () => {
            console.log("Settings clicked - Implement action!");
            // IMPORTANT: Find ChatGPT's settings button/link and trigger its action.
            // Example: document.querySelector('[aria-label*="Settings"]')?.click();
            // Or: document.querySelector('button:has(svg[data-icon="settings"])')?.click(); // More specific
            const settingsButton = Array.from(document.querySelectorAll('button, a')).find(
                el => el.textContent.toLowerCase().includes('settings') || (el.getAttribute('aria-label') && el.getAttribute('aria-label').toLowerCase().includes('settings'))
            );
            if (settingsButton) settingsButton.click();
            else console.error("Original 'Settings' button not found.");

        });
        footer.appendChild(settingsItem);

        const accountItem = createElement('div', {
            className: 'custom-sidebar-footer-item',
            innerHTML: ICONS.userAccount + 'My Account' // Or "Upgrade", "User Profile" etc.
        });
        accountItem.addEventListener('click', () => {
            console.log("Account clicked - Implement action!");
            // IMPORTANT: Find ChatGPT's account/profile button/link and trigger its action.
            // This is often at the very bottom of their sidebar.
            const userMenuButton = document.querySelector('button[id^="radix-"] > .text-sm'); // Common pattern for user menu
            if (userMenuButton) userMenuButton.click(); // This usually opens a dropdown.
            else console.error("Original 'User Account' button not found.");
        });
        footer.appendChild(accountItem);

        sidebar.appendChild(footer);

        // Append the new sidebar to the body (or a specific container if ChatGPT has one)
        document.body.appendChild(sidebar); // Or document.querySelector('#__next').prepend(sidebar);
    }


    // --- 4. Initialization and Observers ---
    function init() {
        // It's good practice to wait for a specific element of the page to be loaded
        // before trying to manipulate the DOM, especially for single-page applications.
        // The original sidebar or a main content area are good candidates.
        const MAPPINGS_READY_SELECTOR = 'main[class*="relative"]'; // A selector for an element that indicates page is ready
        let attempts = 0;

        const tryInit = () => {
            const targetNode = document.querySelector(MAPPINGS_READY_SELECTOR);
            if (targetNode) {
                console.log("ChatGPT Custom Sidebar: Page ready, initializing.");
                hideOriginalSidebar(); // Call this once initially
                createCustomSidebar();
                observeChatGPTChanges(); // Optional: for dynamic updates
            } else {
                attempts++;
                if (attempts < 50) { // Try for ~5 seconds
                    setTimeout(tryInit, 100);
                } else {
                    console.error("ChatGPT Custom Sidebar: Target element for initialization not found after multiple attempts.");
                }
            }
        };
        tryInit();
    }

    function hideOriginalSidebar() {
        // Attempt to hide the original sidebar.
        // This selector needs to be robust. You might need to combine selectors
        // or look for unique attributes.
        const originalSidebarSelectors = [
            'div[class*="shared__Wrapper"]', // Common as of some versions
            'nav[aria-label="Chat history"]', // Another possibility
            // Add more selectors if you find different versions or structures
        ];

        let foundAndHidden = false;
        originalSidebarSelectors.forEach(selector => {
            const elementToHide = document.querySelector(selector);
            if (elementToHide) {
                console.log(`Hiding original element: ${selector}`);
                elementToHide.style.display = 'none !important'; // Force hide
                foundAndHidden = true;
            }
        });
        if (!foundAndHidden) {
            console.warn("ChatGPT Custom Sidebar: Could not find original sidebar to hide. It might have already been removed or its selector changed.");
        }
    }


    // Optional: Use MutationObserver to re-apply if ChatGPT re-renders its UI
    function observeChatGPTChanges() {
        const targetNode = document.body; // Or a more specific container if identifiable
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            // Check if our custom sidebar still exists. If not, recreate.
            if (!document.querySelector('.custom-sidebar')) {
                console.log("Custom sidebar removed, attempting to re-create.");
                hideOriginalSidebar();
                createCustomSidebar();
            }
            // You might also need to check if the original sidebar has reappeared
            // and hide it again.
            // Or, if chat history items need to be re-synced. This can get complex.
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        console.log("ChatGPT Custom Sidebar: Observer started.");
    }


    // --- Run the script ---
    // Wait for the window to load to ensure all original elements are likely present
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
