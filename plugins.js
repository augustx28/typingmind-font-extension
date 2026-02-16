/* ============================================================================
 * TypingMind – Mobile-Ready Plugin Reorder (Fixed & Smooth)
 * ========================================================================== */
(() => {
    /* Configuration & Selectors */
    const CONFIG = {
        key: 'tm_plugin_order_mobile_fixed', // Storage key
        selectors: {
            // The scrollable container for the list
            list: 'div.overflow-y-auto',
            // The individual plugin row (from your snippet)
            row: '[role="menuitem"]',
            // VALIDATOR: Ensure we ONLY target lists containing plugin switches (ignores Models/MCP)
            validator: 'button[data-element-id^="plugins-switch"]',
            // Where to grab the text name for saving
            name: '.truncate'
        }
    };

    /* Storage Helper */
    class Store {
        constructor(key) { this.key = key; }
        get() { return JSON.parse(localStorage.getItem(this.key) || '[]'); }
        save(data) { localStorage.setItem(this.key, JSON.stringify(data)); }
    }

    /* Main Logic */
    class PluginSorter {
        constructor() {
            this.store = new Store(CONFIG.key);
            this.drag = null; // State container
            this.injectStyles();
            this.startObserver();
        }

        /* 1. Inject CSS specifically tuned for Mobile */
        injectStyles() {
            if (document.getElementById('tm-mobile-sort-css')) return;
            const style = document.createElement('style');
            style.id = 'tm-mobile-sort-css';
            style.textContent = `
                /* The Drag Handle */
                .tm-handle {
                    cursor: grab;
                    padding: 10px; /* Larger hit area for fingers */
                    margin-right: 2px;
                    touch-action: none; /* CRITICAL: Stops mobile page scroll */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #94a3b8;
                    transition: color 0.2s;
                    -webkit-tap-highlight-color: transparent;
                }
                .tm-handle:active { color: #3b82f6; cursor: grabbing; }
                
                /* The Empty Space (Drop Target) */
                .tm-placeholder {
                    background: rgba(59, 130, 246, 0.05);
                    border: 1px dashed rgba(59, 130, 246, 0.4);
                    border-radius: 8px;
                    margin: 4px 0;
                    flex-shrink: 0;
                }

                /* The item currently being dragged */
                .tm-dragging {
                    position: fixed !important;
                    z-index: 10000 !important;
                    pointer-events: none !important; /* Let clicks pass through to detection */
                    opacity: 0.95;
                    transform: scale(1.02);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
                    width: var(--drag-width) !important;
                    background: var(--drag-bg, #1e293b);
                    border-radius: 8px;
                }
            `;
            document.head.appendChild(style);
        }

        /* 2. Watch for the Plugin Menu to appear */
        startObserver() {
            new MutationObserver((mutations) => {
                mutations.forEach(m => {
                    m.addedNodes.forEach(n => {
                        if (n.nodeType !== 1) return;
                        // Find any lists inside the new node
                        const lists = n.matches?.(CONFIG.selectors.list) 
                            ? [n] 
                            : n.querySelectorAll?.(CONFIG.selectors.list);
                        
                        if(lists) lists.forEach(list => this.initList(list));
                    });
                });
            }).observe(document.body, { childList: true, subtree: true });
        }

        /* 3. Initialize a List (If it's the right one) */
        initList(list) {
            if (list.dataset.tmSortInit) return;
            
            // SECURITY CHECK: Does this list actually contain plugins?
            // We look for the specific "plugins-switch" button you shared.
            const isPluginList = list.querySelector(CONFIG.selectors.validator);
            if (!isPluginList) return; 

            list.dataset.tmSortInit = 'true';
            
            // Re-order immediately based on saved history
            this.applySavedOrder(list);

            // Add handles to current items
            const rows = list.querySelectorAll(CONFIG.selectors.row);
            rows.forEach(row => this.addHandle(row));

            // Watch for new plugins loading in via scrolling/search
            new MutationObserver(() => {
                list.querySelectorAll(CONFIG.selectors.row).forEach(row => this.addHandle(row));
            }).observe(list, { childList: true });
        }

        /* 4. Add the Drag Handle */
        addHandle(row) {
            if (row.querySelector('.tm-handle')) return;

            // Target the inner wrapper to place handle at the far left
            // Structure: Row > [Inner Wrapper] > [Content]
            const wrapper = row.firstElementChild; 
            if (!wrapper) return;

            const handle = document.createElement('div');
            handle.className = 'tm-handle';
            // Simple 6-dot grip icon
            handle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            
            // Attach Pointer Events (Works for Touch & Mouse)
            handle.onpointerdown = (e) => this.dragStart(e, row);
            
            wrapper.prepend(handle);
        }

        /* 5. Start Dragging */
        dragStart(e, row) {
            e.preventDefault(); // Stop text selection
            const list = row.closest(CONFIG.selectors.list);
            
            // Capture the pointer so drag continues even if finger slips off element
            e.target.setPointerCapture(e.pointerId);

            const rect = row.getBoundingClientRect();
            
            // Create Placeholder (keeps the space open)
            const placeholder = document.createElement('div');
            placeholder.className = 'tm-placeholder';
            placeholder.style.height = `${rect.height}px`;
            row.before(placeholder);

            // Get background color for seamless look
            const bg = window.getComputedStyle(row).backgroundColor;
            row.style.setProperty('--drag-bg', bg === 'rgba(0, 0, 0, 0)' ? '#1f2937' : bg); // Fallback if transparent
            row.style.setProperty('--drag-width', `${rect.width}px`);
            
            // Set initial state
            row.classList.add('tm-dragging');
            
            this.drag = {
                row, 
                list, 
                placeholder, 
                rect,
                offsetY: e.clientY - rect.top,
                startX: rect.left
            };

            // Calculate initial position immediately
            this.updatePosition(e.clientX, e.clientY);

            // Bind move/up events
            this.drag.moveFn = (ev) => this.dragMove(ev);
            this.drag.upFn = (ev) => this.dragEnd(ev);
            
            document.addEventListener('pointermove', this.drag.moveFn);
            document.addEventListener('pointerup', this.drag.upFn);
        }

        /* 6. Drag Move (High Performance) */
        dragMove(e) {
            e.preventDefault(); // Stop scrolling on mobile
            if (!this.drag) return;
            this.updatePosition(e.clientX, e.clientY);
            this.checkSort(e.clientY);
            this.autoScroll(e.clientY);
        }

        updatePosition(x, y) {
            const { row, offsetY, startX } = this.drag;
            // Lock X axis (optional, feels cleaner) or follow finger freely. 
            // Here we allow slight X movement but keep it mostly locked to list
            row.style.top = `${y - offsetY}px`;
            row.style.left = `${startX}px`; 
        }

        /* 7. Auto Scroll logic for Mobile */
        autoScroll(y) {
            const { list } = this.drag;
            const r = list.getBoundingClientRect();
            const threshold = 60; // Larger trigger zone for fingers
            
            if (y < r.top + threshold) list.scrollTop -= 8;
            if (y > r.bottom - threshold) list.scrollTop += 8;
        }

        /* 8. Swap Logic */
        checkSort(y) {
            const { list, placeholder, row } = this.drag;
            const siblings = [...list.querySelectorAll(`${CONFIG.selectors.row}:not(.tm-dragging)`)];
            
            const nextSibling = siblings.find(sibling => {
                const box = sibling.getBoundingClientRect();
                return y < box.top + (box.height / 2);
            });

            if (nextSibling) {
                nextSibling.before(placeholder);
            } else {
                list.appendChild(placeholder);
            }
        }

        /* 9. End Drag */
        dragEnd(e) {
            if (!this.drag) return;
            const { row, placeholder, list, moveFn, upFn } = this.drag;

            // Cleanup events
            document.removeEventListener('pointermove', moveFn);
            document.removeEventListener('pointerup', upFn);

            // Snap into place
            placeholder.replaceWith(row);
            row.classList.remove('tm-dragging');
            row.style.removeProperty('top');
            row.style.removeProperty('left');
            row.style.removeProperty('width');
            
            this.saveOrder(list);
            this.drag = null;
        }

        /* 10. Save & Load */
        saveOrder(list) {
            const order = [...list.querySelectorAll(CONFIG.selectors.row)]
                .map(r => r.querySelector(CONFIG.selectors.name)?.textContent?.trim())
                .filter(Boolean);
            this.store.save(order);
        }

        applySavedOrder(list) {
            const saved = this.store.get();
            if (!saved.length) return;

            const items = [...list.querySelectorAll(CONFIG.selectors.row)];
            const map = new Map(items.map(i => [i.querySelector(CONFIG.selectors.name)?.textContent?.trim(), i]));

            // Append in order
            saved.forEach(name => {
                const el = map.get(name);
                if (el) list.appendChild(el);
            });
        }
    }

    // Start
    new PluginSorter();
})();
