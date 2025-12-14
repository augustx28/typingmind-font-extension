(function() {
  const style = document.createElement('style');
  style.innerHTML = `
    /* =========================================
       1. Folder Icon Color Change
       ========================================= */
    svg.text-slate-400 {
      color: #DA9010 !important; 
    }

    /* =========================================
       2. Workspace & Background Overrides
       ========================================= */
    /* Overflow hidden area background */
    .md\\:pl-\\[--workspace-width\\] .flex-shrink-0 .bg-\\[--workspace-color\\] .justify-center > .overflow-hidden {
      background-color: #38383c !important;
    }

    /* Sidebar/Nav handler height adjustments */
    #nav-handler .md\\:w-\\[--sidebar-width\\] .h-\\[var\\(--workspace-height\\)\\] {
      background-color: #191919 !important;
    }

    /* Workspace color generic */
    .md\\:w-auto .flex-col .bg-\\[--workspace-color\\] {
      background-color: #191919 !important;
    }

    /* Transition opacity container (Background) */
    .md\\:w-auto .flex-col .flex-col .md\\:pl-\\[--workspace-width\\] > .transition-opacity {
      background-color: #191919 !important;
    }

    /* Navigation container */
    .md\\:w-auto .flex-col .md\\:pl-\\[--workspace-width\\] {
      background-color: #191919 !important;
    }

    /* Nav handler specific height vars */
    #nav-handler .h-\\[--workspace-height\\] .h-\\[var\\(--workspace-height\\)\\] {
      background-color: #191919 !important;
    }

    /* =========================================
       3. Navigation & Header Adjustments
       ========================================= */
    /* Svg positioning */
    #nav-handler .md\\:flex .w-5 {
      position: relative;
      top: 3px;
    }

    /* Division background color */
    #nav-handler .md\\:w-\\[--workspace-width\\] .md\\:flex {
      background-color: #191919;
    }

    /* Hide Span Tag (visibility hidden) */
    #nav-handler .md\\:flex .md\\:leading-none {
      visibility: hidden;
    }

    /* Transition opacity (Opacity Level) */
    .md\\:w-auto .flex-shrink-0 .transition-opacity {
      opacity: 0.3;
    }

    /* NEW: Hide Font Bold Elements (1st & 2nd child) */
    .md\\:pl-\\[--current-sidebar-width\\] .sm\\:block .font-bold:nth-child(1) {
      visibility: hidden;
    }

    .md\\:pl-\\[--current-sidebar-width\\] .sm\\:block .font-bold:nth-child(2) {
      visibility: hidden;
    }

   

    /* =========================================
       4. Mobile Media Queries
       ========================================= */

    /* Max-width: 741px (NEW) */
    @media (max-width: 741px) {
      /* Button reset transform */
      .overflow-x-auto .justify-start .md\\:flex-none:nth-child(11) {
        transform: translatex(0px) translatey(0px);
      }
    }

    /* Max-width: 585.991px (NEW) */
    @media (max-width: 585.991px) {
      /* Span Tag positioning */
      .overflow-x-auto .justify-center .md\\:leading-none {
        position: relative;
        top: 2px;
      }
      
      /* Button positioning */
      .overflow-x-auto .justify-start .md\\:flex-none:nth-child(11) {
        position: relative;
        left: 5px;
      }
    }

    /* Max-width: 499.995px (Existing) */
    @media (max-width: 499.995px) {
      /* Justify center adjustments */
      .sm\\:block .justify-start:nth-child(1) .justify-center:nth-child(10) > .justify-center:nth-child(1) {
        padding-left: 2px;
        padding-right: 2px;
        margin-right: 5px;
      }
      
      .overflow-x-auto .justify-start:nth-child(1) .justify-center:nth-child(10) > .justify-center:nth-child(1) {
        height: 48px;
        padding-top: 6px;
        padding-bottom: 6px;
        margin-top: -1px;
        position: relative;
        left: 3px;
      }
      
      /* Text white margins */
      .overflow-x-auto .justify-start .text-white {
        margin-left: 2px;
        margin-right: 2px;
      }
      
      /* Button positioning (Legacy) */
      .overflow-x-auto .justify-start .md\\:flex-none:nth-child(11) {
        position: relative;
        left: 5px;
      }
      
      /* Custom theme nav handler width */
      #__next .custom-theme #nav-handler .h-\\[--workspace-height\\] .justify-between .overflow-x-auto .justify-start:nth-child(1) .justify-center:nth-child(10) > .justify-center:nth-child(1) {
        width: 57px;
      }
    }

    /* Max-width: 499px (Combined) */
    @media (max-width: 499px) {
      /* Text white absolute left */
      .overflow-x-auto .justify-start .text-white {
        left: 11px !important;
      }
      
      /* Button margins */
      .overflow-x-auto .justify-start .md\\:flex-none:nth-child(8) {
        margin-left: 0px;
        margin-right: 0px;
      }
      
      /* Center positioning */
      .overflow-x-auto .justify-start:nth-child(1) .justify-center:nth-child(10) > .justify-center:nth-child(1) {
        left: 9px;
        top: 1px; /* Overridden to -1px below if specificity matches, kept original here */
      }

      /* NEW: Button left adjust */
      .overflow-x-auto .justify-start .md\\:flex-none:nth-child(11) {
        left: 15px; /* Updated from 13px */
      }

      /* NEW: Top adjustment for center element */
      .overflow-x-auto .justify-start:nth-child(1) .justify-center:nth-child(10) > .justify-center:nth-child(1) {
        top: -1px;
      }
    }

    /* Max-width: 498.991px (NEW) */
    @media (max-width: 498.991px) {
      /* Force reset transform on deep nested justify-start */
      #__next .custom-theme #nav-handler .md\\:pl-\\[--current-sidebar-width\\] .overflow-y-auto .resize-container .flex-col .custom-scrollbar .dynamic-chat-content-container .antialiased .justify-start .justify-start:nth-child(1) .justify-start {
        transform: translatex(0px) translatey(0px) !important;
      }
    }
  `;
  document.head.appendChild(style);
})();
