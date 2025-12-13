(function() {
    const style = document.createElement('style');
    style.innerHTML = `
    /* Sidebar Text Semi-Bold */
    span.truncate.min-w-0,
    div.truncate.w-full.text-sm.font-normal {
        font-weight: 600 !important;
    }

    /* Span Tag - Workspace Height */
    .h-\\[var\\(--workspace-height\\)\\] .md\\:flex-none .md\\:leading-none {
        font-weight: 500 !important;
    }
    `;
    document.head.appendChild(style);
})();
