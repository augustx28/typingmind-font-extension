
(function() {
    'use strict';

    const css = `
        .@container .flex-col .overflow-y-auto > .relative {
            background-color: #000000 !important;
        }

        /* Dark */
        .@container .flex-col .dark\\:bg-\\[--main-dark-color\\] {
            background-color: #000000 !important;
        }

        /* Transition all */
        .@container .flex-col > .transition-all {
            background-color: #000000 !important;
        }

        /* workspace color */
        .transition div .bg-\\[--workspace-color\\] {
            transform: translatex(0px) translatey(0px) !important;
        }

        /* Flex col */
        #nav-handler .transition > .flex-col {
            transform: translatex(0px) translatey(0px) !important;
        }

        /* Flex */
        .bg-\\[--workspace-color\\] > .flex:nth-child(1) {
            transform: translatex(0px) translatey(0px) !important;
        }

        /* Full */
        div .bg-\\[--workspace-color\\] .flex .w-full .w-full {
            transform: translatex(557px) translatey(117px) !important;
        }

        /* Span Tag */
        .transition div .sm\\:leading-normal {
            font-size: 18px !important;
            font-weight: 700 !important;
        }
    `;

    // Inject the CSS into the page
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement('style');
        styleNode.type = 'text/css';
        styleNode.appendChild(document.createTextNode(css));
        document.head.appendChild(styleNode);
    }
})();
