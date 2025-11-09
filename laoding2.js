(function() {
    'use strict';
    
    // Create and inject CSS immediately
    const style = document.createElement('style');
    style.textContent = `
        /* Your custom theme colors */
        :root {
            --primary-color: #your-color;
            --background-color: #your-bg;
            /* Add your other custom colors here */
        }
        
        /* Hide content initially to prevent flash */
        html, body {
            visibility: hidden;
        }
        
        /* Apply theme immediately */
        .your-custom-theme {
            /* Your theme styles */
        }
    `;
    
    // Insert at the very beginning of head
    if (document.head) {
        document.head.insertBefore(style, document.head.firstChild);
    } else {
        // Fallback if head not ready
        document.documentElement.insertBefore(style, document.documentElement.firstChild);
    }
    
    // Add your theme class
    document.documentElement.classList.add('your-custom-theme');
    
    // Show content once theme is applied
    document.addEventListener('DOMContentLoaded', function() {
        document.documentElement.style.visibility = 'visible';
    });
    
    // Your existing extension code continues here...
    console.log('Theme extension loaded with early CSS injection');
})();
