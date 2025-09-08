// This is the main function for the extension.
(function() {
    'use strict';

    // This function creates a <style> tag and adds your custom CSS rules to the TypingMind page.
    function addCustomUiColors() {
        const css = `
            /**
             * Rule 1: Change the color of the folder names.
             * The color #DA9010 will be applied to the text of each folder.
             */
            .sidebar-chats-list [role="treeitem"] .truncate {
                color: #DA9010 !important;
            }

            /**
             * Rule 2: Change the background color of the main chat panel.
             * This targets the main area where you see the conversation.
             */
            main[role="main"] {
                background-color: #191919 !important;
            }

            /**
             * Rule 3: Change the background color of the sidebar.
             * This targets the entire sidebar that contains your chat history and folders.
             */
            nav[aria-label="Chat history"] {
                background-color: #191919 !important;
            }
        `;

        // Create a new <style> element.
        const styleElement = document.createElement('style');

        // Add an ID to the style element so we can find and update it later if needed.
        styleElement.id = 'custom-ui-colors-extension';

        // Put your CSS rules inside the <style> element.
        styleElement.textContent = css;

        // Before adding the new styles, check if an old version already exists and remove it.
        const existingStyle = document.getElementById(styleElement.id);
        if (existingStyle) {
            existingStyle.remove();
        }

        // Add the new <style> element to the document's <head>.
        document.head.appendChild(styleElement);
    }

    // Run the function to apply the styles.
    addCustomUiColors();

})();
