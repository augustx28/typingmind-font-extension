(function() {
    'use strict';

    // All your custom CSS rules are placed within this template literal string.
    const customCSS = `
        /* BackUnknown blur */
        .md\\:pl-\\[--current-sidebar-width\\] .flex-col .backdrop-blur-md{
         min-height:39px;
         height:40px;
        }

        /* Transition all */
        .md\\:pl-\\[--current-sidebar-width\\] .overflow-y-auto:nth-child(1) .\\@container .flex-col:nth-child(1) > .transition-all:nth-child(3){
         margin-top:-7px;
        }

        /* BackUnknown blur */
        #nav-handler .flex-col .backdrop-blur-md{
         height:39px;
         min-height:3px;
        }

        /* Full */
        .md\\:pl-\\[--current-sidebar-width\\] .transition-all .w-full:nth-child(2){
         height:35px;
        }

        /* Transition all */
        .flex-col:nth-child(1) > .transition-all:nth-child(3){
         margin-top:-7px;
        }

        /* Full */
        #nav-handler .flex-col .transition-all .w-full:nth-child(2){
         min-height:-34px;
         height:34px;
        }

        /* Transition all */
        .\\@container .flex-col .transition-all > .transition-all{
         transform:translatex(0px) translatey(0px);
        }
    `;

    // This part of the script creates a <style> element
    const styleElement = document.createElement('style');

    // It then fills the <style> element with your CSS rules
    styleElement.textContent = customCSS;

    // Finally, it injects the <style> element into the <head> of the webpage
    document.head.append(styleElement);

})();
