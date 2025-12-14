/* ============================================================================
 * TypingMind – Robust Plugin Reorder (SortableJS Edition)
 * 1. Loads SortableJS dynamically.
 * 2. targets the "Active Plugin" dropdown.
 * 3. Saves order to LocalStorage.
 * ========================================================================== */

(function() {
    const STORAGE_KEY = 'tm_plugin_custom_order_v2';
    
    // 1. Load SortableJS from CDN
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js";
    script.onload = () => {
        console.log("✅ SortableJS loaded for TypingMind");
        startObserver();
    };
    document.head.appendChild(script);

    // 2. The Watcher (MutationObserver)
    function startObserver() {
        // Watch the whole body for the "Plugin Dropdown" to appear
        new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                // Look for the specific dropdown container provided by HeadlessUI
                if (mutation.addedNodes.length) {
                    const pluginList = document.querySelector('[id^="headlessui-menu-items"] div.overflow-y-auto');
                    
                    // Check if we found the list and haven't attached Sortable yet
                    if (pluginList && !pluginList.classList.contains('js-sortable-attached')) {
                        initSortable(pluginList);
                    }
                }
            }
        }).observe(document.body, { childList: true, subtree: true });
    }

    // 3. Initialize Sortable
    function initSortable(el) {
        el.classList.add('js-sortable-attached');
        el.style.cursor = 'grab'; // Visual cue that it's draggable

        // Load saved order immediately before user sees it
        applySavedOrder(el);

        new Sortable(el, {
            animation: 150,
            ghostClass: 'bg-blue-100', // Visual cue when dragging
            onEnd: function (evt) {
                saveOrder(evt.from);
            }
        });
        console.log("✅ Drag-and-drop attached to Plugin Menu");
    }

    // 4. Save Order to LocalStorage
    function saveOrder(container) {
        const items = Array.from(container.children);
        // We use the text content (Plugin Name) as the ID
        const order = items.map(item => item.textContent.trim());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    }

    // 5. Apply Saved Order
    function applySavedOrder(container) {
        const savedOrder = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!savedOrder) return;

        const currentItems = Array.from(container.children);
        
        // Map current items by their text content for easy lookup
        const itemMap = {};
        currentItems.forEach(item => {
            itemMap[item.textContent.trim()] = item;
        });

        // Re-append items in the saved order
        savedOrder.forEach(pluginName => {
            if (itemMap[pluginName]) {
                container.appendChild(itemMap[pluginName]);
            }
        });
    }
})();
