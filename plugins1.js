/* ============================================================================
 * TypingMind – Mobile-Ready Plugin Reorder (Left-Aligned Text Fix)
 * ========================================================================== */
(() => {
    /* Configuration & Selectors */
    const CONFIG = {
        key: 'tm_plugin_order_mobile_v2', // Storage key
        selectors: {
            list: 'div.overflow-y-auto',
            row: '[role="menuitem"]',
            // Specific validator to ensure we ONLY target the Plugins list
            validator: 'button[data-element-id^="plugins-switch"]', 
            name: '.truncate'
        }
    };

    class Store {
        constructor(key) { this.key = key; }
        get() { return JSON.parse(localStorage.getItem(this.key) || '[]'); }
        save(data) { localStorage.setItem(this.key, JSON.stringify(data)); }
    }

    class PluginSorter {
        constructor() {
            this.store = new Store(CONFIG.key);
            this.drag = null;
            this.injectStyles();
            this.startObserver();
        }

        /* 1. Inject CSS */
        injectStyles() {
            if (document.getElementById('tm-mobile-sort-css')) return;
            const style = document.createElement('style');
            style.id = 'tm-mobile-sort-css';
            style.textContent = `
                /* --- ALIGNMENT FIX --- */
                /* Force the inner text/icon container to align LEFT, not CENTER */
                [role="menuitem"] .flex.items-center.justify-center.gap-2.truncate {
                    justify-content: flex-start !important; 
                }

                /* The Drag Handle */
                .tm-handle {
                    cursor: grab;
                    padding: 8px 12px 8px 4px; /* Bigger touch target */
                    touch-action: none; /* Stops mobile scrolling while dragging */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #94a3b8; /* Slate-400 */
                    flex-shrink: 0;
                }
                .tm-handle:active { color: #3b82f6; cursor: grabbing; }

                /* The Ghost/Placeholder */
                .tm-placeholder {
                    background: rgba(59, 130, 246, 0.05);
                    border: 1px dashed rgba(59, 130, 246, 0.4);
                    border-radius: 8px;
                    margin: 4px 0;
                    flex-shrink: 0;
                }

                /* The Flying Element */
                .tm-dragging {
                    position: fixed !important;
                    z-index: 9999 !important;
                    opacity: 0.95;
                    transform: scale(1.02);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
                    width: var(--drag-width) !important;
                    background: var(--drag-bg, #1e293b);
                    pointer-events: none; /* Let events pass through to document */
                    border-radius: 8px;
                }
            `;
            document.head.appendChild(style);
        }

        /* 2. Watch DOM */
        startObserver() {
            new MutationObserver((mutations) => {
                mutations.forEach(m => {
                    m.addedNodes.forEach(n => {
                        if (n.nodeType !== 1) return;
                        const lists = n.matches?.(CONFIG.selectors.list) 
                            ? [n] 
                            : n.querySelectorAll?.(CONFIG.selectors.list);
                        
                        if(lists) lists.forEach(list => this.initList(list));
                    });
                });
            }).observe(document.body, { childList: true, subtree: true });
        }

        /* 3. Initialize List */
        initList(list) {
            if (list.dataset.tmSortInit) return;
            
            // Validate: Only run on lists that contain Plugin Switches
            const isPluginList = list.querySelector(CONFIG.selectors.validator);
            if (!isPluginList) return; 

            list.dataset.tmSortInit = 'true';
            
            // Load saved order
            this.applySavedOrder(list);

            // Add handles
            const rows = list.querySelectorAll(CONFIG.selectors.row);
            rows.forEach(row => this.addHandle(row));

            // Watch for scroll-loaded items
            new MutationObserver(() => {
                list.querySelectorAll(CONFIG.selectors.row).forEach(row => this.addHandle(row));
            }).observe(list, { childList: true });
        }

        /* 4. Add Handle */
        addHandle(row) {
            if (row.querySelector('.tm-handle')) return;

            // Insert into the first inner wrapper
            const wrapper = row.firstElementChild; 
            if (!wrapper) return;

            const handle = document.createElement('div');
            handle.className = 'tm-handle';
            // 6-dot grip icon
            handle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            
            handle.onpointerdown = (e) => this.dragStart(e, row);
            
            wrapper.prepend(handle);
        }

        /* 5. Drag Start */
        dragStart(e, row) {
            e.preventDefault();
            const list = row.closest(CONFIG.selectors.list);
            
            // Capture pointer for consistent mobile drag
            e.target.setPointerCapture(e.pointerId);

            const rect = row.getBoundingClientRect();
            
            // Create Placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'tm-placeholder';
            placeholder.style.height = `${rect.height}px`;
            row.before(placeholder);

            // Capture styles
            const bg = window.getComputedStyle(row).backgroundColor;
            row.style.setProperty('--drag-bg', bg === 'rgba(0, 0, 0, 0)' ? '#1f2937' : bg); 
            row.style.setProperty('--drag-width', `${rect.width}px`);
            
            row.classList.add('tm-dragging');
            
            this.drag = {
                row, list, placeholder, 
                offsetY: e.clientY - rect.top,
                startX: rect.left
            };

            this.updatePosition(e.clientX, e.clientY);

            this.drag.moveFn = (ev) => this.dragMove(ev);
            this.drag.upFn = (ev) => this.dragEnd(ev);
            
            document.addEventListener('pointermove', this.drag.moveFn);
            document.addEventListener('pointerup', this.drag.upFn);
        }

        /* 6. Drag Move */
        dragMove(e) {
            if (!this.drag) return;
            e.preventDefault(); 
            this.updatePosition(e.clientX, e.clientY);
            this.checkSort(e.clientY);
            this.autoScroll(e.clientY);
        }

        updatePosition(x, y) {
            const { row, offsetY, startX } = this.drag;
            row.style.top = `${y - offsetY}px`;
            row.style.left = `${startX}px`; // Lock X axis for cleaner look
        }

        /* 7. Auto Scroll */
        autoScroll(y) {
            const { list } = this.drag;
            const r = list.getBoundingClientRect();
            const threshold = 50;
            
            if (y < r.top + threshold) list.scrollTop -= 10;
            else if (y > r.bottom - threshold) list.scrollTop += 10;
        }

        /* 8. Sorting Logic */
        checkSort(y) {
            const { list, placeholder } = this.drag;
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

        /* 9. Drag End */
        dragEnd(e) {
            if (!this.drag) return;
            const { row, placeholder, list, moveFn, upFn } = this.drag;

            document.removeEventListener('pointermove', moveFn);
            document.removeEventListener('pointerup', upFn);

            placeholder.replaceWith(row);
            row.classList.remove('tm-dragging');
            row.style.removeProperty('top');
            row.style.removeProperty('left');
            row.style.removeProperty('width');
            
            this.saveOrder(list);
            this.drag = null;
        }

        /* 10. Save/Load */
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

            saved.forEach(name => {
                const el = map.get(name);
                if (el) list.appendChild(el);
            });
        }
    }

    new PluginSorter();
})();
