(function() {
    'use strict';

    const css = `
        .@container .flex-col .overflow-y-auto > .relative {
            background-color: #000000;
        }

        /* Dark */
        .@container .flex-col .dark\\:bg-\\[--main-dark-color\\] {
            background-color: #000000;
        }

        /* Transition all */
        .@container .flex-col > .transition-all {
            background-color: #000000;
        }

        /* workspace color */
        .transition div .bg-\\[--workspace-color\\] {
            transform: translatex(0px) translatey(0px);
        }

        /* Flex col */
        #nav-handler .transition > .flex-col {
            transform: translatex(0px) translatey(0px);
        }

        /* Flex */
        .bg-\\[--workspace-color\\] > .flex:nth-child(1) {
            transform: translatex(0px) translatey(0px);
        }

        /* Full */
        div .bg-\\[--workspace-color\\] .flex .w-full .w-full {
            transform: translatex(557px) translatey(117px);
        }

        /* Span Tag */
        .transition div .sm\\:leading-normal {
            font-size: 18px;
            font-weight: 700;
        }

        #__next .custom-theme {
            background-color: #000000;
        }

        /* Body */
        body {
            background-color: #000000 !important;
        }

        /* Items stretch */
        .message-id-24d6ca05-79fb-4605-99c0-c5fc94b56122 div .items-stretch {
            transform: translatex(557px) translatey(117px);
        }

        /* Overflow auto */
        .@container .flex-col .overflow-y-auto {
            background-color: #000000;
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();
