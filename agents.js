(function() {
    const style = document.createElement('style');
    style.textContent = `
    /* Flex shrink 0 */
    #__next .custom-theme #nav-handler .md\\:w-\\[--workspace-width\\] .md\\:flex .overflow-x-auto .justify-start > .justify-center > .flex-shrink-0 {
        height: 20px !important;
        width: 44px !important;
    }

    /* Antialiased */
    .md\\:pl-\\[--current-sidebar-width\\] .flex-col .antialiased:nth-child(1) {
        padding-top: 0px;
    }
    `;
    document.head.appendChild(style);
})();
