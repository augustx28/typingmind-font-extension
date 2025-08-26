

(function() {
    'use strict';

    // This CSS rule targets the links in the sidebar and removes their background color on hover.
    const customCSS = `
        #nav-handler a.flex:hover {
            background-color: transparent !important;
        }
    `;

    // The script creates a <style> element and injects your CSS into the webpage.
    const styleElement = document.createElement('style');
    styleElement.textContent = customCSS;
    document.head.append(styleElement);

})();
