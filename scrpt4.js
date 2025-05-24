// ==UserScript==
// @name        TypingMind Plugin Reorder
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description Allows rearranging installed plugins in TypingMind.
// @match       https://www.typingmind.com/*
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    console.log("TypingMind Plugin Reorder Extension Loaded");

    let draggedItem = null;
    let pluginListContainer = null;

    // Function to identify and make plugins draggable
    function initializePluginReorder() {
        // IMPORTANT: You MUST inspect the TypingMind UI to find the correct selectors.
        // These are EXAMPLE selectors.
        const pluginSectionSelector = '#plugin-settings-section'; // Or a more specific data-element-id
        const pluginItemSelector = '.plugin-list-item';      // Or a more specific data-element-id for each item

        // Try to find the plugin list container.
        // This might need to be more sophisticated, perhaps waiting for the element to appear.
        pluginListContainer = document.querySelector(pluginSectionSelector);

        if (!pluginListContainer) {
            console.warn("Plugin Reorder: Plugin list container not found. Retrying in 2 seconds...");
            setTimeout(initializePluginReorder, 2000); // Retry if not found immediately
            return;
        }

        const pluginItems = pluginListContainer.querySelectorAll(pluginItemSelector);

        if (pluginItems.length === 0) {
            console.warn("Plugin Reorder: No plugin items found in the container.");
            return;
        }

        console.log(`Plugin Reorder: Found ${pluginItems.length} plugin items.`);

        pluginItems.forEach(item => {
            item.setAttribute('draggable', 'true');
            item.style.cursor = 'grab'; // Visual cue

            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('dragleave', handleDragLeave);
            item.addEventListener('drop', handleDrop);
            item.addEventListener('dragend', handleDragEnd);
        });

        // Add dragover to the container as well to allow dropping
        pluginListContainer.addEventListener('dragover', handleDragOverContainer);
    }

    function handleDragStart(e) {
        draggedItem = this;
        this.style.opacity = '0.5';
        this.style.border = '2px dashed #007bff'; // Highlight dragged item
        e.dataTransfer.effectAllowed = 'move';
        // e.dataTransfer.setData('text/html', this.innerHTML); // Optional: if needed for specific drop logic
        console.log("Drag Start:", this.textContent.trim().substring(0,20) + "...");
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary to allow dropping
        }
        e.dataTransfer.dropEffect = 'move';

        // Optional: Visual feedback for where the item will be dropped
        if (this !== draggedItem && this.parentNode === pluginListContainer) {
             // 'this' is the item being hovered over
            const rect = this.getBoundingClientRect();
            const nextSibling = (e.clientY - rect.top) > (rect.height / 2) ? this.nextSibling : this;

            // Basic visual cue: move a placeholder or add a border
            // For simplicity, we'll just ensure the container allows drop
            // More advanced logic could show a drop indicator line
            this.style.borderTop = '2px solid #007bff'; // Example placeholder visual
        }
        return false;
    }

    function handleDragOverContainer(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }


    function handleDragLeave(e) {
        // Remove visual feedback when dragging away from an item
        this.style.borderTop = ''; // Clear placeholder visual
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // Prevents the browser from redirecting.
        }

        // Don't do anything if dropping the item on itself
        if (draggedItem !== this && this.parentNode === pluginListContainer) {
            const allItems = Array.from(pluginListContainer.querySelectorAll('[draggable="true"]'));
            const draggedIndex = allItems.indexOf(draggedItem);
            const targetIndex = allItems.indexOf(this);

            console.log("Drop Event:", draggedItem.textContent.trim().substring(0,20) + "...", "onto", this.textContent.trim().substring(0,20) + "...");

            if (draggedIndex < targetIndex) {
                pluginListContainer.insertBefore(draggedItem, this.nextSibling);
            } else {
                pluginListContainer.insertBefore(draggedItem, this);
            }
            // Note: This reorders the DOM elements.
            // It does NOT save this order to TypingMind's persistent storage.
            // The order will be lost on page refresh or app restart.
            console.log("Plugin order changed in the DOM.");
        }
        this.style.borderTop = ''; // Clear placeholder visual
        return false;
    }

    function handleDragEnd(e) {
        this.style.opacity = '1';
        this.style.border = ''; // Clear any borders
        draggedItem = null;

        // Clear all temporary borders from other items
        const pluginItems = pluginListContainer.querySelectorAll('[draggable="true"]');
        pluginItems.forEach(item => {
            item.style.borderTop = '';
        });
        console.log("Drag End");
    }

    // TypingMind loads content dynamically. We need to ensure the UI is ready.
    // A MutationObserver is a more robust way to wait for elements than setTimeout.
    const observer = new MutationObserver((mutationsList, observerInstance) => {
        // EXAMPLE selector for the area where plugins might appear
        const potentialPluginArea = document.querySelector('body'); // Be more specific if possible

        if (potentialPluginArea) {
            // Check if the target container is now available
            const pluginSettingsContainer = document.querySelector('#plugin-settings-section'); // Your placeholder
            if (pluginSettingsContainer && !pluginListContainer) { // Initialize only once
                 console.log("Plugin Reorder: Plugin section likely loaded. Initializing...");
                 initializePluginReorder();
                 // Optionally, disconnect the observer if you only need to run once
                 // observerInstance.disconnect();
            }
        }
    });

    // Start observing the body for childList and subtree changes
    // Adjust the target node and configuration as needed for TypingMind's structure
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Fallback or initial attempt (may not always work if elements load later)
    setTimeout(initializePluginReorder, 3000); // Give it a few seconds for initial load

})();
