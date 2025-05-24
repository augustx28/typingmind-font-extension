// TypingMind Plugin Reorder Extension
// This extension adds drag-and-drop functionality to rearrange plugins

(function() {
    'use strict';
    
    let isDragging = false;
    let dragElement = null;
    let dragOffset = { x: 0, y: 0 };
    let placeholder = null;
    
    // Create styles for the drag functionality
    const style = document.createElement('style');
    style.textContent = `
        .plugin-draggable {
            cursor: grab;
            transition: transform 0.2s ease;
        }
        
        .plugin-draggable:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .plugin-dragging {
            cursor: grabbing !important;
            opacity: 0.8;
            transform: rotate(5deg);
            z-index: 1000;
            pointer-events: none;
        }
        
        .plugin-placeholder {
            border: 2px dashed #ccc;
            background: rgba(0,0,0,0.05);
            border-radius: 8px;
            margin: 4px 0;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-style: italic;
        }
        
        .plugin-placeholder::after {
            content: "Drop plugin here";
        }
        
        .plugin-item {
            transition: all 0.2s ease;
        }
        
        .plugin-reorder-handle {
            cursor: grab;
            padding: 4px;
            margin-right: 8px;
            opacity: 0.5;
            transition: opacity 0.2s ease;
        }
        
        .plugin-reorder-handle:hover {
            opacity: 1;
        }
        
        .plugin-reorder-handle::before {
            content: "⋮⋮";
            font-size: 12px;
            line-height: 1;
            color: #666;
        }
    `;
    document.head.appendChild(style);
    
    // Function to find plugin containers
    function findPluginContainers() {
        // Look for common plugin container selectors
        const selectors = [
            '[data-testid*="plugin"]',
            '.plugin-item',
            '.extension-item',
            '[class*="plugin"]',
            '[class*="extension"]'
        ];
        
        let containers = [];
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                containers = Array.from(elements);
                break;
            }
        }
        
        // Fallback: look for lists that might contain plugins
        if (containers.length === 0) {
            const lists = document.querySelectorAll('ul, ol, div[class*="list"]');
            for (const list of lists) {
                const items = list.children;
                if (items.length > 2) { // Assume it's a plugin list if it has multiple items
                    containers = Array.from(items);
                    break;
                }
            }
        }
        
        return containers;
    }
    
    // Function to add drag handles to plugins
    function addDragHandles() {
        const containers = findPluginContainers();
        
        containers.forEach(container => {
            if (container.querySelector('.plugin-reorder-handle')) return; // Already has handle
            
            container.classList.add('plugin-draggable');
            container.draggable = true;
            
            // Add drag handle
            const handle = document.createElement('div');
            handle.className = 'plugin-reorder-handle';
            handle.title = 'Drag to reorder';
            
            // Insert handle at the beginning
            container.insertBefore(handle, container.firstChild);
            
            // Add event listeners
            container.addEventListener('dragstart', handleDragStart);
            container.addEventListener('dragend', handleDragEnd);
            container.addEventListener('dragover', handleDragOver);
            container.addEventListener('drop', handleDrop);
            container.addEventListener('dragenter', handleDragEnter);
            container.addEventListener('dragleave', handleDragLeave);
        });
    }
    
    function handleDragStart(e) {
        isDragging = true;
        dragElement = e.target.closest('.plugin-draggable');
        dragElement.classList.add('plugin-dragging');
        
        // Create placeholder
        placeholder = document.createElement('div');
        placeholder.className = 'plugin-placeholder';
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', dragElement.outerHTML);
    }
    
    function handleDragEnd(e) {
        isDragging = false;
        
        if (dragElement) {
            dragElement.classList.remove('plugin-dragging');
            dragElement = null;
        }
        
        // Remove placeholder
        if (placeholder && placeholder.parentNode) {
            placeholder.parentNode.removeChild(placeholder);
            placeholder = null;
        }
        
        // Clean up any remaining placeholders
        document.querySelectorAll('.plugin-placeholder').forEach(p => p.remove());
        
        // Save the new order
        savePluginOrder();
    }
    
    function handleDragOver(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const target = e.target.closest('.plugin-draggable');
        if (target && target !== dragElement) {
            const rect = target.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            
            if (placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
            }
            
            if (e.clientY < midpoint) {
                target.parentNode.insertBefore(placeholder, target);
            } else {
                target.parentNode.insertBefore(placeholder, target.nextSibling);
            }
        }
    }
    
    function handleDrop(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        
        if (placeholder && placeholder.parentNode) {
            placeholder.parentNode.insertBefore(dragElement, placeholder);
            placeholder.parentNode.removeChild(placeholder);
        }
    }
    
    function handleDragEnter(e) {
        e.preventDefault();
    }
    
    function handleDragLeave(e) {
        // Optional: Add visual feedback when leaving drag area
    }
    
    // Function to save plugin order to localStorage
    function savePluginOrder() {
        try {
            const containers = findPluginContainers();
            const order = containers.map((container, index) => {
                // Try to extract plugin identifier
                const id = container.id || 
                          container.dataset.id || 
                          container.querySelector('[data-id]')?.dataset.id ||
                          container.textContent.trim().substring(0, 50);
                return { id, index };
            });
            
            localStorage.setItem('typingmind-plugin-order', JSON.stringify(order));
            console.log('Plugin order saved:', order);
        } catch (error) {
            console.error('Failed to save plugin order:', error);
        }
    }
    
    // Function to restore plugin order from localStorage
    function restorePluginOrder() {
        try {
            const savedOrder = localStorage.getItem('typingmind-plugin-order');
            if (!savedOrder) return;
            
            const order = JSON.parse(savedOrder);
            const containers = findPluginContainers();
            
            if (containers.length === 0) return;
            
            const parent = containers[0].parentNode;
            
            // Sort containers based on saved order
            order.forEach(item => {
                const container = containers.find(c => {
                    const id = c.id || 
                              c.dataset.id || 
                              c.querySelector('[data-id]')?.dataset.id ||
                              c.textContent.trim().substring(0, 50);
                    return id === item.id;
                });
                
                if (container) {
                    parent.appendChild(container);
                }
            });
            
            console.log('Plugin order restored');
        } catch (error) {
            console.error('Failed to restore plugin order:', error);
        }
    }
    
    // Function to add control buttons
    function addControlButtons() {
        const existingControls = document.querySelector('.plugin-reorder-controls');
        if (existingControls) return;
        
        const controls = document.createElement('div');
        controls.className = 'plugin-reorder-controls';
        controls.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1001;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;
        
        controls.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 8px;">Plugin Reorder</div>
            <button id="reset-plugin-order" style="padding: 4px 8px; margin-right: 8px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">Reset Order</button>
            <button id="toggle-plugin-reorder" style="padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">Toggle Handles</button>
        `;
        
        document.body.appendChild(controls);
        
        // Add event listeners
        document.getElementById('reset-plugin-order').addEventListener('click', () => {
            localStorage.removeItem('typingmind-plugin-order');
            location.reload();
        });
        
        document.getElementById('toggle-plugin-reorder').addEventListener('click', () => {
            const handles = document.querySelectorAll('.plugin-reorder-handle');
            handles.forEach(handle => {
                handle.style.display = handle.style.display === 'none' ? 'block' : 'none';
            });
        });
    }
    
    // Initialize the extension
    function init() {
        console.log('TypingMind Plugin Reorder Extension loaded');
        
        // Wait for page to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // Initial setup
        setTimeout(() => {
            addDragHandles();
            restorePluginOrder();
            addControlButtons();
        }, 1000);
        
        // Re-initialize when page changes (for SPA navigation)
        const observer = new MutationObserver(() => {
            setTimeout(() => {
                addDragHandles();
                restorePluginOrder();
            }, 500);
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Also check periodically in case plugins are loaded dynamically
        setInterval(() => {
            addDragHandles();
        }, 5000);
    }
    
    // Start the extension
    init();
    
    // Expose functions for debugging
    window.pluginReorderExtension = {
        addDragHandles,
        savePluginOrder,
        restorePluginOrder,
        findPluginContainers
    };
    
})();
