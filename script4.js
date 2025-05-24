// TypingMind Plugin Rearrangement Extension
(function() {
    'use strict';
    
    // Wait for the app to fully load
    const initializePluginRearrangement = () => {
        // Check if we're on the plugins page
        const checkPluginsPage = () => {
            const url = window.location.href;
            return url.includes('#plugins') || url.includes('/plugins');
        };
        
        // Add drag and drop functionality to plugin items
        const enablePluginDragDrop = () => {
            // Find plugin container
            const pluginContainer = document.querySelector('[data-testid="plugins-container"], .plugins-list, [class*="plugin-list"], [class*="plugins-grid"]');
            
            if (!pluginContainer) {
                // Try alternative selectors
                const possibleContainers = document.querySelectorAll('div[class*="grid"], div[class*="flex"]');
                for (const container of possibleContainers) {
                    if (container.querySelectorAll('[data-plugin-id], [class*="plugin-item"], [class*="plugin-card"]').length > 0) {
                        setupDragAndDrop(container);
                        return;
                    }
                }
                return;
            }
            
            setupDragAndDrop(pluginContainer);
        };
        
        const setupDragAndDrop = (container) => {
            const plugins = container.querySelectorAll('[data-plugin-id], [class*="plugin-item"], [class*="plugin-card"]');
            
            if (plugins.length === 0) return;
            
            // Store original order
            let pluginOrder = Array.from(plugins).map((plugin, index) => ({
                element: plugin,
                originalIndex: index,
                id: plugin.getAttribute('data-plugin-id') || plugin.innerText
            }));
            
            plugins.forEach((plugin, index) => {
                // Make plugin draggable
                plugin.draggable = true;
                plugin.style.cursor = 'move';
                plugin.style.transition = 'transform 0.2s ease';
                
                // Add drag handle visual indicator
                if (!plugin.querySelector('.drag-handle')) {
                    const dragHandle = document.createElement('div');
                    dragHandle.className = 'drag-handle';
                    dragHandle.innerHTML = '⋮⋮';
                    dragHandle.style.cssText = `
                        position: absolute;
                        left: 5px;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #666;
                        font-size: 20px;
                        cursor: move;
                        user-select: none;
                    `;
                    plugin.style.position = 'relative';
                    plugin.appendChild(dragHandle);
                }
                
                // Drag start
                plugin.addEventListener('dragstart', (e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/html', plugin.innerHTML);
                    plugin.classList.add('dragging');
                    plugin.style.opacity = '0.5';
                });
                
                // Drag over
                plugin.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    
                    const draggingElement = document.querySelector('.dragging');
                    if (draggingElement && draggingElement !== plugin) {
                        const rect = plugin.getBoundingClientRect();
                        const midpoint = rect.top + rect.height / 2;
                        
                        if (e.clientY < midpoint) {
                            plugin.style.transform = 'translateY(5px)';
                            plugin.parentNode.insertBefore(draggingElement, plugin);
                        } else {
                            plugin.style.transform = 'translateY(-5px)';
                            plugin.parentNode.insertBefore(draggingElement, plugin.nextSibling);
                        }
                    }
                });
                
                // Drag leave
                plugin.addEventListener('dragleave', () => {
                    plugin.style.transform = '';
                });
                
                // Drag end
                plugin.addEventListener('dragend', () => {
                    plugin.classList.remove('dragging');
                    plugin.style.opacity = '';
                    
                    // Reset all transforms
                    container.querySelectorAll('[draggable="true"]').forEach(p => {
                        p.style.transform = '';
                    });
                    
                    // Save new order
                    savePluginOrder(container);
                });
                
                // Drop
                plugin.addEventListener('drop', (e) => {
                    e.preventDefault();
                    plugin.style.transform = '';
                });
            });
            
            // Add visual feedback styles
            const style = document.createElement('style');
            style.textContent = `
                .dragging {
                    opacity: 0.5 !important;
                }
                [draggable="true"]:hover {
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .drag-handle:hover {
                    color: #333;
                }
            `;
            document.head.appendChild(style);
        };
        
        // Save plugin order to localStorage
        const savePluginOrder = (container) => {
            const plugins = container.querySelectorAll('[data-plugin-id], [class*="plugin-item"], [class*="plugin-card"]');
            const order = Array.from(plugins).map((plugin, index) => ({
                id: plugin.getAttribute('data-plugin-id') || plugin.innerText,
                position: index
            }));
            
            localStorage.setItem('typingmind-plugin-order', JSON.stringify(order));
            
            // Show save notification
            showNotification('Plugin order saved!');
        };
        
        // Load saved plugin order
        const loadPluginOrder = () => {
            const savedOrder = localStorage.getItem('typingmind-plugin-order');
            if (!savedOrder) return;
            
            try {
                const order = JSON.parse(savedOrder);
                const container = document.querySelector('[data-testid="plugins-container"], .plugins-list, [class*="plugin-list"], [class*="plugins-grid"]');
                
                if (!container) return;
                
                const plugins = Array.from(container.querySelectorAll('[data-plugin-id], [class*="plugin-item"], [class*="plugin-card"]'));
                
                // Sort plugins based on saved order
                plugins.sort((a, b) => {
                    const aId = a.getAttribute('data-plugin-id') || a.innerText;
                    const bId = b.getAttribute('data-plugin-id') || b.innerText;
                    
                    const aOrder = order.find(o => o.id === aId);
                    const bOrder = order.find(o => o.id === bId);
                    
                    if (!aOrder || !bOrder) return 0;
                    
                    return aOrder.position - bOrder.position;
                });
                
                // Reorder DOM elements
                plugins.forEach(plugin => {
                    container.appendChild(plugin);
                });
            } catch (e) {
                console.error('Failed to load plugin order:', e);
            }
        };
        
        // Show notification
        const showNotification = (message) => {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 12px 24px;
                border-radius: 4px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        };
        
        // Add animations
        const addAnimations = () => {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        };
        
        // Initialize on page load and navigation
        const initialize = () => {
            if (checkPluginsPage()) {
                setTimeout(() => {
                    loadPluginOrder();
                    enablePluginDragDrop();
                }, 500);
            }
        };
        
        // Add animations
        addAnimations();
        
        // Watch for navigation changes
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                initialize();
            }
        }).observe(document, { subtree: true, childList: true });
        
        // Initial setup
        initialize();
        
        // Also listen for hash changes
        window.addEventListener('hashchange', initialize);
    };
    
    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePluginRearrangement);
    } else {
        initializePluginRearrangement();
    }
})();
