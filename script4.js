(function() {
    'use strict';
    
    // Wait for the DOM to be ready
    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                obs.disconnect();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Initialize the plugin reorder functionality
    function initPluginReorder() {
        // Look for the plugins container
        waitForElement('[data-testid="plugins-list"], .plugins-container, div[class*="plugin"]', (container) => {
            setupDragAndDrop();
        });
    }
    
    // Main drag and drop setup
    function setupDragAndDrop() {
        let draggedElement = null;
        let draggedIndex = null;
        
        // Find all plugin items
        function getPluginItems() {
            // Try multiple selectors as TypingMind might use different ones
            const selectors = [
                '[data-testid="plugin-item"]',
                '.plugin-item',
                'div[class*="plugin-item"]',
                '.plugins-list > div',
                '.plugins-container > div'
            ];
            
            for (const selector of selectors) {
                const items = document.querySelectorAll(selector);
                if (items.length > 0) {
                    return items;
                }
            }
            return [];
        }
        
        // Apply drag and drop to plugin items
        function applyDragAndDrop() {
            const pluginItems = getPluginItems();
            
            pluginItems.forEach((item, index) => {
                // Make items draggable
                item.draggable = true;
                item.style.cursor = 'move';
                
                // Add visual indicator on hover
                item.addEventListener('mouseenter', () => {
                    if (!item.classList.contains('dragging')) {
                        item.style.opacity = '0.9';
                    }
                });
                
                item.addEventListener('mouseleave', () => {
                    if (!item.classList.contains('dragging')) {
                        item.style.opacity = '1';
                    }
                });
                
                // Drag start
                item.addEventListener('dragstart', (e) => {
                    draggedElement = item;
                    draggedIndex = index;
                    item.classList.add('dragging');
                    item.style.opacity = '0.5';
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/html', item.innerHTML);
                });
                
                // Drag end
                item.addEventListener('dragend', (e) => {
                    item.classList.remove('dragging');
                    item.style.opacity = '1';
                    
                    // Clean up all drop indicators
                    const allItems = getPluginItems();
                    allItems.forEach(el => {
                        el.classList.remove('drag-over');
                        el.style.borderTop = '';
                        el.style.borderBottom = '';
                    });
                });
                
                // Drag over
                item.addEventListener('dragover', (e) => {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    e.dataTransfer.dropEffect = 'move';
                    
                    // Add visual indicator
                    const rect = item.getBoundingClientRect();
                    const midpoint = rect.top + rect.height / 2;
                    
                    if (e.clientY < midpoint) {
                        item.style.borderTop = '2px solid #3b82f6';
                        item.style.borderBottom = '';
                    } else {
                        item.style.borderTop = '';
                        item.style.borderBottom = '2px solid #3b82f6';
                    }
                    
                    return false;
                });
                
                // Drag leave
                item.addEventListener('dragleave', (e) => {
                    item.style.borderTop = '';
                    item.style.borderBottom = '';
                });
                
                // Drop
                item.addEventListener('drop', (e) => {
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }
                    
                    if (draggedElement !== item) {
                        const parent = item.parentNode;
                        const rect = item.getBoundingClientRect();
                        const midpoint = rect.top + rect.height / 2;
                        
                        if (e.clientY < midpoint) {
                            parent.insertBefore(draggedElement, item);
                        } else {
                            parent.insertBefore(draggedElement, item.nextSibling);
                        }
                        
                        // Save the new order
                        savePluginOrder();
                    }
                    
                    return false;
                });
            });
        }
        
        // Save plugin order to localStorage
        function savePluginOrder() {
            const pluginItems = getPluginItems();
            const pluginOrder = [];
            
            pluginItems.forEach((item) => {
                // Try to extract plugin identifier
                const pluginName = item.querySelector('h3, .plugin-name, [class*="name"]')?.textContent || 
                                 item.textContent.trim().split('\n')[0];
                if (pluginName) {
                    pluginOrder.push(pluginName);
                }
            });
            
            localStorage.setItem('typingmind-plugin-order', JSON.stringify(pluginOrder));
            console.log('Plugin order saved:', pluginOrder);
        }
        
        // Restore plugin order from localStorage
        function restorePluginOrder() {
            const savedOrder = localStorage.getItem('typingmind-plugin-order');
            if (!savedOrder) return;
            
            try {
                const pluginOrder = JSON.parse(savedOrder);
                const pluginItems = Array.from(getPluginItems());
                const parent = pluginItems[0]?.parentNode;
                
                if (!parent) return;
                
                // Create a map of plugin names to elements
                const pluginMap = new Map();
                pluginItems.forEach(item => {
                    const pluginName = item.querySelector('h3, .plugin-name, [class*="name"]')?.textContent || 
                                     item.textContent.trim().split('\n')[0];
                    if (pluginName) {
                        pluginMap.set(pluginName, item);
                    }
                });
                
                // Reorder based on saved order
                pluginOrder.forEach(name => {
                    const element = pluginMap.get(name);
                    if (element) {
                        parent.appendChild(element);
                    }
                });
                
                console.log('Plugin order restored');
            } catch (e) {
                console.error('Failed to restore plugin order:', e);
            }
        }
        
        // Apply drag and drop functionality
        applyDragAndDrop();
        restorePluginOrder();
        
        // Re-apply when DOM changes (new plugins added, etc.)
        const observer = new MutationObserver(() => {
            setTimeout(() => {
                applyDragAndDrop();
            }, 100);
        });
        
        const pluginContainer = document.querySelector('.plugins-list, .plugins-container, [data-testid="plugins-list"]');
        if (pluginContainer) {
            observer.observe(pluginContainer, {
                childList: true,
                subtree: true
            });
        }
    }
    
    // Add custom styles
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .dragging {
                opacity: 0.5 !important;
                cursor: move !important;
            }
            
            .drag-over {
                background-color: rgba(59, 130, 246, 0.1);
            }
            
            [draggable="true"] {
                transition: opacity 0.2s ease;
            }
            
            /* Add grab cursor on hover for draggable items */
            [draggable="true"]:hover {
                cursor: grab;
            }
            
            [draggable="true"]:active {
                cursor: grabbing;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize everything
    function init() {
        console.log('TypingMind Plugin Reorder Extension loaded');
        addStyles();
        
        // Wait a bit for TypingMind to fully load
        setTimeout(() => {
            initPluginReorder();
        }, 1000);
        
        // Also listen for navigation changes
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(() => {
                    initPluginReorder();
                }, 1000);
            }
        }).observe(document, { subtree: true, childList: true });
    }
    
    // Start the extension
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
