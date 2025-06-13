(function() {
    'use strict';

    const myCss = `
        /* Workspace height */
        #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] {
            background-color: #191919;
        }

        /* Division */
        .transition div .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\] {
            background-color: #191919;
        }

        /* Workspace color */
        .transition div .bg-\\[--workspace-color\\] {
            background-color: #191919;
        }

        /* Division */
        .h-\\[var\\(--workspace-height\\)\\] .sm\\:block .md\\:flex-col {
            border-width: 1px;
            border-color: #2d2d2d;
            border-top-left-radius: 9px;
            border-top-right-radius: 9px;
            border-bottom-left-radius: 9px;
            border-bottom-right-radius: 9px;
            background-color: #020202;
            height: 797px;
            position: relative;
            top: 9px;
            transform: translatex(0px) translatey(0px);
        }

        /* Division */
        .min-h-full .w-full .flex-col .flex .flex > div {
            color: rgba(255, 255, 255, 0.46);
        }

        .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\] div .\\!flex {
            border-color: #3a3a3a;
        }

        /* Svg */
        .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\] div .h-6 {
            color: #da9010;
        }

        /* Text amber 400 */
        .\\!flex div .text-amber-400 {
            color: #fa8423;
        }

        .bg-\\[--workspace-color\\] .flex > .w-full {
            font-size: 15px;
        }

        /* Full */
        .bg-\\[--workspace-color\\] > .flex > .w-full {
            border-top-left-radius: 9px;
            border-top-right-radius: 9px;
            border-bottom-left-radius: 9px;
            border-bottom-right-radius: 9px;
            width: 232px;
            color: #db801d;
        }
    `;

    // Create a <style> element
    const styleElement = document.createElement('style');

    // Add the CSS rules to the <style> element
    styleElement.textContent = myCss;

    // Append the <style> element to the <head> of the document
    document.head.appendChild(styleElement);
})();
