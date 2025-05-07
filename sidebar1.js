(function() {
    'use strict';

    // The dark grey color from chatgpt.com
    const darkGreyColor = '#202123';

    // Function to apply the color
    function colorSidebar() {
        // --- Potential Sidebar Selectors ---
        // It's difficult to know the exact selector without inspecting the TypingMind page.
        // Here are some common possibilities. You might need to adjust these
        // if they don't work.
        //
        // 1. By a specific ID (if the sidebar has one)
        //    Example: const sidebar = document.getElementById('sidebar-id');
        //
        // 2. By a specific class name (most likely)
        //    Example: const sidebar = document.querySelector('.sidebar-class');
        //             const sidebar = document.querySelector('.tm-sidebar'); // A guess
        //             const sidebar = document.querySelector('[class*="sidebar"]'); // More general
        //
        // 3. By a tag name and then filtering (less precise)
        //    Example: const navs = document.getElementsByTagName('nav');
        //             if (navs.length > 0) { /* Logic to identify the correct nav */ }

        // --- START ---
        // **TRY THIS SELECTOR FIRST for TypingMind**
        // Based on common naming conventions and the site, a class selector
        // is the most probable. Let's try a generic one that might encompass it.
        // TypingMind's sidebar might be nested or have a specific class.
        // We'll try to find elements that look like a sidebar.

        // Updated selector based on common structures for such sidebars.
        // This will target the div that typically wraps the navigation/sidebar content.
        // We're looking for a div that is a direct child of 'body' or within a main layout container,
        // often with a role or class indicating it's a navigation pane or sidebar.

        // Attempt to find the sidebar. Common structures involve <nav> elements or <div> elements
        // with classes like 'sidebar', 'nav', 'menu', or similar.
        // Since direct inspection isn't possible here, we'll try a few common patterns.

        let sidebarElement = null;

        // Option 1: Look for a <nav> element that could be the sidebar.
        const navElements = document.getElementsByTagName('nav');
        if (navElements.length > 0) {
            // Assuming the first <nav> or a <nav> with specific characteristics.
            // This might need refinement based on the actual structure.
            for (let i = 0; i < navElements.length; i++) {
                // Check if it's positioned like a sidebar (e.g., on the left)
                const style = window.getComputedStyle(navElements[i]);
                if (style.position === 'fixed' || style.position === 'absolute' || style.height === '100vh') {
                     // A common pattern is for sidebars to be the first major nav element
                     // or one that's styled to be on the side.
                     // Let's try a more specific selector if available, otherwise, this is a fallback.
                }
            }
        }

        // Option 2: Look for a <div> with a class name that suggests a sidebar.
        // This is often more reliable if class names are used consistently.
        // Common class names: 'sidebar', 'left-sidebar', 'main-nav', 'tm-sidebar-custom' (example)
        // We will target a more general pattern that might fit TypingMind's structure.
        // Usually, sidebars are direct children of a main container or body, or part of a layout grid.

        // Try a more specific selector that is often used for the main sidebar container in web apps.
        // This targets a div that is likely the main container for the sidebar UI.
        const potentialSidebars = document.querySelectorAll('div[class*="Sidebar__SidebarContainer"], div[class*="Nav__NavContainer"], div[class^="SidebarLayout__"], nav[class*="Sidebar"], div[role="navigation"]');

        if (potentialSidebars.length > 0) {
            // Assuming the first one found is the correct one.
            // In more complex sites, you might need a more specific selector.
            sidebarElement = potentialSidebars[0]; // Or iterate to find the most likely candidate

            // A common structure for TypingMind-like apps might be a div directly inside a main app container
            // or a div that's a direct child of body if it's a full-height sidebar.
            // Let's try to find a div that's the first child of a container or has a specific layout role.
            // This selector looks for a div that's likely a sidebar based on typical app structures.
             const mainLayoutChildren = document.querySelectorAll('#__next > div > div:first-child, body > div > div:first-child');
             if (mainLayoutChildren.length > 0 && mainLayoutChildren[0].clientHeight > window.innerHeight * 0.5) { // Check if it's tall
                 sidebarElement = mainLayoutChildren[0];
             }
        }


        // --- MORE SPECIFIC GUESS for TypingMind (based on typical React app structures) ---
        // TypingMind likely uses a common framework. A sidebar component might be a direct child
        // of a main app wrapper (often <div id="__next"> for Next.js apps, or similar).
        // Let's assume the sidebar is the first or second div child of the main app container.
        const appRoot = document.getElementById('__next'); // Common in Next.js apps
        if (appRoot) {
            const potentialSidebarInRoot = appRoot.querySelector('div:first-child > div:first-child');
            if (potentialSidebarInRoot && potentialSidebarInRoot.offsetWidth > 100 && potentialSidebarInRoot.offsetWidth < 400 && potentialSidebarInRoot.offsetHeight > window.innerHeight * 0.8) {
                 // Heuristic: width between 100px and 400px, and takes most of the viewport height
                 sidebarElement = potentialSidebarInRoot;
            }
            if (!sidebarElement) {
                 // Try another common structure: a nav element directly within the app root's first child
                 const navInRoot = appRoot.querySelector('div:first-child > nav');
                 if (navInRoot) {
                    sidebarElement = navInRoot;
                 }
            }
        }

        // As a general approach for TypingMind, which appears to be a modern web app,
        // the sidebar is likely a `div` or `nav` element, possibly with a specific data-attribute or a generated class name.
        // Let's try to find an element that looks like a sidebar based on its position and size.
        // This is more of a fallback if specific selectors don't work.
        if (!sidebarElement) {
            const allDivs = document.getElementsByTagName('div');
            for (let i = 0; i < allDivs.length; i++) {
                const style = window.getComputedStyle(allDivs[i]);
                if (
                    (style.position === 'fixed' || style.position === 'sticky' || style.position === 'absolute') &&
                    style.left === '0px' &&
                    style.top === '0px' &&
                    (style.height === '100vh' || style.height === '100%') &&
                    parseInt(style.width, 10) > 150 && parseInt(style.width, 10) < 450 // Typical sidebar width
                ) {
                    sidebarElement = allDivs[i];
                    break;
                }
            }
        }


        // **Final Attempt with a common TypingMind structure observed (example):**
        // If the sidebar is consistently the first `div` child of a `div` that itself is the first child of `#__next`
        // This can be quite specific and might break if the structure changes.
        // You might need to use browser developer tools to find the most stable selector.
        // Open developer tools (right-click -> Inspect) on TypingMind, find the sidebar element,
        // and identify its unique ID or a stable combination of class names.

        // For demonstration, let's assume a general selector that often works for sidebars in such apps:
        // This targets the first div child of the first div child of the element with id '__next'.
        // This is a common pattern in apps built with frameworks like Next.js.
        // You SHOULD inspect TypingMind's actual HTML to find the most reliable selector.
        const selector1 = '#__next > div > div:first-child'; // Common for a main container that includes the sidebar
        // And then, perhaps the sidebar is the first child of THAT container:
        const selector2 = '#__next > div > div:first-child > div:first-child'; // More specific to the sidebar itself
        // Or, it might be a <nav> element.
        const selector3 = 'nav[class*="your-sidebar-class"]'; // Replace with actual class if known

        // Let's try a selector that is often used for the main content area holding the sidebar
        // This selector assumes the sidebar is the first major `div` element within the main content `div` of the `#__next` element.
        // This is a common layout: #__next > main_wrapper_div > sidebar_div
        try {
            let mainAppContainer = document.querySelector('#__next > div'); // Often the main container
            if (mainAppContainer) {
                // The sidebar is typically the first child `div` if it's a left sidebar
                let potentialSidebar = mainAppContainer.querySelector('div:first-child');

                // Verification: A real sidebar usually has a noticeable width and takes up significant height.
                if (potentialSidebar && potentialSidebar.offsetWidth > 50 && potentialSidebar.offsetHeight > (window.innerHeight * 0.5)) {
                    sidebarElement = potentialSidebar;
                } else {
                    // Fallback: Maybe it's a <nav> element directly inside
                    potentialSidebar = mainAppContainer.querySelector('nav:first-child');
                     if (potentialSidebar && potentialSidebar.offsetWidth > 50 && potentialSidebar.offsetHeight > (window.innerHeight * 0.5)) {
                        sidebarElement = potentialSidebar;
                    }
                }
            }
        } catch (e) {
            console.error("Error selecting sidebar:", e);
        }


        // --- END OF SELECTOR ATTEMPTS ---

        if (sidebarElement) {
            sidebarElement.style.backgroundColor = darkGreyColor;

            // Optional: If the sidebar contains other elements that have their own backgrounds
            // which are now clashing, you might need to make them transparent or adjust them.
            // For example, if there are list items or headers inside the sidebar:
            // const sidebarItems = sidebarElement.querySelectorAll('ul, li, div, h1, h2, h3, a');
            // sidebarItems.forEach(item => {
            //   item.style.backgroundColor = 'transparent'; // Or inherit, or the same darkGreyColor
            //   if(item.tagName === 'A' || item.closest('a')) { // Ensure text is visible
            //      item.style.color = '#FFFFFF'; // Example: white text
            //   }
            // });
            // This part is highly dependent on the internal structure of TypingMind's sidebar.
            // Start without it, and add if necessary.

            console.log('TypingMind sidebar color applied.');
        } else {
            console.warn('TypingMind sidebar element not found. The selectors might need adjustment.');
            // Advise user to inspect element and find the correct selector
            console.log('Please inspect the sidebar element on TypingMind and update the selector in the script.');
            console.log('Common selectors to try: document.querySelector(".sidebar-class-name"), document.getElementById("sidebar-id"), or a more specific path like document.querySelector("#__next > div > div:first-child")');
        }
    }

    // Run the function when the page is loaded or DOM is ready.
    // Using MutationObserver to also apply styles if the sidebar is loaded dynamically.
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        colorSidebar();
    } else {
        document.addEventListener('DOMContentLoaded', colorSidebar);
    }

    // Observe DOM changes for dynamically loaded content (like SPAs)
    const observer = new MutationObserver((mutationsList, observerInstance) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                // Check if the sidebar (or a potential candidate) is now in the DOM or changed
                // Re-apply color if it's not already colored or if new parts appeared
                const checkSidebarAgain = document.querySelector('#__next > div > div:first-child'); // Re-check one of the likely selectors
                if (checkSidebarAgain && checkSidebarAgain.style.backgroundColor !== darkGreyColor) {
                    colorSidebar();
                }
                // You could also stop observing once the sidebar is found and colored,
                // but for SPAs, it might be re-rendered.
                // observerInstance.disconnect(); // Optional: if you only want to run it once after it appears.
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: false });

})();
