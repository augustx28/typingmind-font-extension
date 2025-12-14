/* ============================================================================
 * TypingMind "Nuclear" Plugin Sorter (v3.0 - Portal Edition)
 * * - FIXES: Headless UI Portals (menus rendering outside main DOM).
 * - FIXES: React Event Conflicts (uses forceFallback: true).
 * - FIXES: Brittle Selectors (uses structural targeting).
 * * This script waits for the specific "Plugin" menu portal to spawn,
 * hijacks it, and forces your saved order upon it.
 * ========================================================================== */

(function() {
    // --- CONFIGURATION ---
    const STORAGE_KEY = 'tm_nuclear_plugin_order_v1';
    
    // --- LOAD ENGINE ---
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js";
    script.onload = () => {
        console.log("☢️ Plugin Sorter Engine Loaded");
        startPortalWatcher();
    };
    document.head.appendChild(script);

    // --- THE WATCHER ---
    function startPortalWatcher() {
        // We watch the <body> because Headless UI appends menus to the very end of the body
        new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        // 1. Check if the added node looks like a Portal/Modal layer
                        if (node.nodeType === 1 && node.innerHTML && node.innerHTML.includes('headlessui-portal-root')) {
                            // Deep search inside this new portal for the plugin list
                            detectAndAttach(node);
                        }
                        // Fallback: Sometimes the node itself isn't the root, but the list is injected directly
                        if (node.nodeType === 1) {
                             detectAndAttach(document.body); 
                        }
                    });
                }
            }
        }).observe(document.body, { childList: true, subtree: true });
    }

    // --- THE HUNTER ---
    function detectAndAttach(scope) {
        // We look for a DIV that:
        // 1. Is a scrolling container (overflow-y-auto)
        // 2. Contains known plugin text (like "Web Search" or "Interactive Canvas")
        // 3. Has not been attached yet
        
        const candidates = scope.querySelectorAll('div.overflow-y-auto');
        
        candidates.forEach(list => {
            if (list.classList.contains('js-nuclear-sorted')) return;

            // Verification: Does this list actually contain plugins?
            // We check for at least one known default plugin to avoid sorting the wrong menu
            if (list.innerText.includes("Web Search") || list.innerText.includes("DALL-E")) {
                console.log("🎯 Plugin Menu Target Acquired");
                initSortable(list);
            }
        });
    }

    // --- THE SORTER ---
    function initSortable(el) {
        el.classList.add('js-nuclear-sorted');
        el.style.position = 'relative'; // Stabilizes the list during drag

        // 1. Apply Saved Order Instantly (Before user interacts)
        applyOrder(el);

        // 2. Create Sortable Instance
        new Sortable(el, {
            animation: 150,
            
            // CRITICAL FIX: "forceFallback: true" ignores native HTML5 drag.
            // This bypasses React's event system preventing glitches.
            forceFallback: true, 
            fallbackClass: 'sortable-fallback', // Class for the cloned item while dragging
            
            ghostClass: 'bg-blue-50', 
            delay: 0, 
            
            // Prevent dragging from triggering clicks on the checkbox
            filter: 'input, button, svg', 
            preventOnFilter: false,

            onEnd: function (evt) {
                saveOrder(evt.to);
            }
        });
    }

    // --- MEMORY (PERSISTENCE) ---
    function saveOrder(container) {
        // Map items by their visible text name
        const items = Array.from(container.children);
        const order = items.map(item => getPluginName(item));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
        console.log("💾 Order Saved");
    }

    function applyOrder(container) {
        const savedOrder = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!savedOrder || !savedOrder.length) return;

        const currentItems = Array.from(container.children);
        const itemMap = {};

        // Index current items
        currentItems.forEach(item => {
            const name = getPluginName(item);
            if(name) itemMap[name] = item;
        });

        // Re-append in order (DOM Manipulation)
        savedOrder.forEach(name => {
            if (itemMap[name]) {
                container.appendChild(itemMap[name]);
            }
        });
        
        // Ensure any new/unsaved plugins are still visible at the bottom
        currentItems.forEach(item => {
            if (!savedOrder.includes(getPluginName(item))) {
                container.appendChild(item);
            }
        });
    }

    // Helper to extract clean text name from the messy HTML structure
    function getPluginName(el) {
        return el.innerText ? el.innerText.split('\n')[0].trim() : null;
    }
})();
