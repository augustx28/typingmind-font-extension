/* ============================================================================
 * TypingMind Plugin Sorter (Robust Version)
 * - Uses SortableJS for native, smooth dragging
 * - Adds a visual "grip" handle to items
 * - Persists order to LocalStorage
 * ========================================================================== */

(function () {
    const STORAGE_KEY = 'tm_plugin_order_robust_v1';
    const SELECTOR_MENU_ITEMS = '[id^="headlessui-menu-items"] > .overflow-y-auto';
    const SELECTOR_ITEM = '[role="menuitem"]';

    // 1. Inject CSS for the "Grip" Handle and Dragging State
    const style = document.createElement('style');
    style.innerHTML = `
        /* The draggable item */
        ${SELECTOR_MENU_ITEMS} ${SELECTOR_ITEM} {
            position: relative;
            padding-left: 24px !important; /* Make room for handle */
            transition: background 0.1s;
        }
        
        /* The Grip Handle (Visual dots) */
        ${SELECTOR_MENU_ITEMS} ${SELECTOR_ITEM}::before {
            content: '⋮⋮';
            position: absolute;
            left: 6px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
            color: #9ca3af; /* Gray-400 */
            cursor: grab;
            letter-spacing: -1px;
            opacity: 0.5;
            z-index: 10;
        }
        
        ${SELECTOR_MENU_ITEMS} ${SELECTOR_ITEM}:hover::before {
            opacity: 1;
            color: #4b5563; /* Gray-600 */
        }

        /* Dragging state */
        .sortable-ghost {
            opacity: 0.2;
            background: #e5e7eb;
        }
        .sortable-drag {
            cursor: grabbing;
        }
    `;
    document.head.appendChild(style);

    // 2. Load SortableJS
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js";
    script.onload = () => {
        console.log("✅ SortableJS loaded");
        startObserver();
    };
    document.head.appendChild(script);

    // 3. Watch for the Menu to Open
    function startObserver() {
        new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    const menuList = document.querySelector(SELECTOR_MENU_ITEMS);
                    if (menuList && !menuList.classList.contains('js-sorted')) {
                        initSortable(menuList);
                    }
                }
            }
        }).observe(document.body, { childList: true, subtree: true });
    }

    // 4. Initialize Sortable on the Menu
    function initSortable(el) {
        el.classList.add('js-sorted');
        
        // Apply saved order immediately
        applyOrder(el);

        new Sortable(el, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            dragClass: 'sortable-drag',
            handle: '', // Make whole row draggable? Or use '::before' trick?
                        // We let the whole row be draggable but SortableJS handles the click event properly.
            
            // CRITICAL: Prevent drag interfering with click
            preventOnFilter: false, 
            
            onEnd: function (evt) {
                saveOrder(evt.to);
            }
        });
    }

    // 5. Save Order
    function saveOrder(container) {
        // We use the text content (Plugin Name) as the unique ID
        const items = Array.from(container.querySelectorAll(SELECTOR_ITEM));
        const order = items.map(item => item.innerText.trim());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    }

    // 6. Apply Order
    function applyOrder(container) {
        const savedOrder = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!savedOrder || savedOrder.length === 0) return;

        const currentItems = Array.from(container.querySelectorAll(SELECTOR_ITEM));
        const itemMap = {};

        // Map items by text content
        currentItems.forEach(item => {
            itemMap[item.innerText.trim()] = item;
        });

        // Re-append in order
        // Note: This moves the DOM elements physically.
        // React might re-render, but SortableJS + this re-run usually handles it.
        savedOrder.forEach(name => {
            if (itemMap[name]) {
                container.appendChild(itemMap[name]);
            }
        });
        
        // Append any new/unknown plugins at the bottom
        currentItems.forEach(item => {
            const name = item.innerText.trim();
            if (!savedOrder.includes(name)) {
                container.appendChild(item);
            }
        });
    }
})();
