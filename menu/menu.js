(() => {
  const STYLE_ID = 'tm-custom-tweaks-v4';
  
  // Variables
  const BACKGROUND = '#191919';
  const ICON = '#DA9010';
  const BUTTON_BG = '#38383c';
  const HOVER_BG = '#4E4E52'; 
  
  // Prevent duplicate injection
  if (document.getElementById(STYLE_ID)) return;

  const css = String.raw`
    /* =========================================
       PART 1: CORE THEME OVERRIDES
       ========================================= */
    
    /* Workspace color */
    .transition div .bg-\[--workspace-color\] {
      background-color: ${BACKGROUND} !important;
    }

    /* Navbar/Handler background */
    #nav-handler .transition .h-\[var\(--workspace-height\)\] {
      background-color: ${BACKGROUND} !important;
    }

    /* Navigation */
    .transition .flex-col .md\:pl-\[--workspace-width\] {
      background-color: ${BACKGROUND} !important;
    }

    /* Folder icons color */
    .md\:max-w-\[calc\(var\(--sidebar-width\)-var\(--workspace-width\)\)\] div .h-6 {
      color: ${ICON} !important;
    }

    /* Chat action button positioning */
    #elements-in-action-buttons > .transition-all {
      position: relative;
      top: -3px;
    }

    /* =========================================
       PART 2: LAYOUT FIXES (Previous Update)
       ========================================= */

    /* Nav handler sidebar width fix */
    #nav-handler .md\:w-\[--sidebar-width\] .h-\[var\(--workspace-height\)\] {
      background-color: ${BACKGROUND} !important;
    }

    /* Division fix */
    #nav-handler .md\:w-\[--workspace-width\] .md\:flex {
      background-color: ${BACKGROUND} !important;
    }

    /* Nav handler workspace width fix */
    #nav-handler .md\:w-\[--workspace-width\] .h-\[var\(--workspace-height\)\] {
      background-color: ${BACKGROUND} !important;
    }

    /* Transition opacity fix */
    .md\:w-auto .flex-shrink-0 .transition-opacity {
      transform: translatex(0px) translatey(0px);
    }

    /* New Chat Button Background */
    .md\:pl-\[--workspace-width\] .flex-shrink-0 .bg-\[--workspace-color\] .justify-center > .overflow-hidden {
      background-color: ${BUTTON_BG} !important;
      transition: background-color 0.2s ease;
    }

    /* New Chat Button Hover Effect */
    .md\:pl-\[--workspace-width\] .flex-shrink-0 .bg-\[--workspace-color\] .justify-center > .overflow-hidden:hover {
      background-color: ${HOVER_BG} !important;
      cursor: pointer;
    }

    /* =========================================
       PART 3: LATEST UI CLEANUP (Hidden Elements & Adjustments)
       ========================================= */

    /* Hide Nav Handler leading text */
    #nav-handler .md\:flex .md\:leading-none {
      visibility: hidden;
    }

    /* Flex shrink margin adjustment */
    .justify-start .justify-center .justify-center .justify-center .flex-shrink-0 {
      margin-top: 9px;
    }

    /* Hide specific justify-start elements */
    .md\:pl-\[--current-sidebar-width\] .justify-start .justify-start:nth-child(1) .justify-start {
      visibility: hidden;
    }

    /* Hide bold font elements (2nd child) */
    .md\:pl-\[--current-sidebar-width\] .sm\:block .font-bold:nth-child(2) {
      visibility: hidden;
    }

    /* Hide bold font elements (1st child) */
    .md\:pl-\[--current-sidebar-width\] .sm\:block .font-bold:nth-child(1) {
      visibility: hidden;
    }

    /* Positioning fix for centered element */
    .h-\[var\(--workspace-height\)\] .overflow-x-auto .justify-start:nth-child(1) .justify-center:nth-child(10) > .justify-center:nth-child(1) {
      position: relative;
    }

    /* Top offset adjustment */
    .overflow-x-auto .justify-start:nth-child(1) .justify-center:nth-child(10) > .justify-center:nth-child(1) {
      top: -10px;
    }

    /* Dimension fix for 10th child */
    .h-\[var\(--workspace-height\)\] .justify-start .justify-center:nth-child(10) {
      width: 57px;
      height: 49px;
    }

    /* Mobile Media Query Adjustments (<500px) */
    @media (max-width: 499.995px) {
      /* Button transform reset */
      .h-\[var\(--workspace-height\)\] .justify-start .md\:flex-none:nth-child(8) {
        transform: translatex(0px) translatey(0px);
      }
      
      /* Mobile dimension fix */
      .h-\[var\(--workspace-height\)\] .justify-start .justify-center:nth-child(10) {
        width: 57px;
        height: 48px;
      }
      
      /* Mobile top offset fix */
      .h-\[var\(--workspace-height\)\] .overflow-x-auto .justify-start:nth-child(1) .justify-center:nth-child(10) > .justify-center:nth-child(1) {
        top: -5px;
      }
    }
  `;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.setAttribute('data-origin', 'typingmind-extension');
  style.textContent = css;

  const attach = () => (document.head || document.documentElement).appendChild(style);
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach, { once: true });
  } else {
    attach();
  }

  console.log('[TypingMind] Custom CSS V4 (Merged) injected.');
})();
