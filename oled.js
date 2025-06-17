(function() {
    'use strict';

    /*
     * This string contains the CSS rules to be injected into the page.
     * Special characters used by Tailwind CSS (like ':', '[', ']') have been
     * "escaped" with a double backslash (\\) so JavaScript can interpret them correctly.
     * The "!important" flag is used to ensure these styles override the website's default styles.
    */
    const css = `
        /* Main background panels */
        div.flex-col div.overflow-y-auto > div.relative,
        div.flex-col.dark\\:bg-\\[--main-dark-color\\],
        div.flex-col > div.transition-all {
            background-color: #000000 !important;
        }

        /* Reset transform on workspace and navigation elements */
        .transition div .bg-\\[--workspace-color\\],
        #nav-handler .transition > .flex-col,
        .bg-\\[--workspace-color\\] > .flex:nth-child(1) {
            transform: none !important;
        }

        /*
         * NOTE: This rule is highly specific and may be brittle if the site structure changes.
         * It was: transform: translatex(557px) translatey(117px);
         * Such a specific transform is unusual for a theme and has been disabled by default
         * as it is a likely source of error. Uncomment it if you are certain it's needed.
         */
        /*
        div .bg-\\[--workspace-color\\] .flex .w-full .w-full {
            transform: translatex(557px) translatey(117px) !important;
        }
        */

        /* Increase font size and weight for chat messages */
        .transition div .sm\\:leading-normal {
            font-size: 18px !important;
            font-weight: 700 !important;
        }
    `;

    // This function creates a <style> tag and injects the CSS into the document's <head>.
    // It uses GM_addStyle if available (the standard for Tampermonkey), otherwise falls back
    // to a manual method.
    try {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            let styleNode = document.createElement('style');
            styleNode.type = 'text/css';
            styleNode.appendChild(document.createTextNode(css));
            document.head.appendChild(styleNode);
        }
        console.log('TypingMind OLED theme applied.');
    } catch (e) {
        console.error('Failed to apply TypingMind OLED theme:', e);
    }
})();
