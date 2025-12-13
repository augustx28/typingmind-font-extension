(() => {
  const STYLE_ID = 'tm-custom-tweaks-v2';
  
  // Variables
  const BACKGROUND = '#191919';
  const ICON = '#DA9010';
  
  // Prevent duplicate injection
  if (document.getElementById(STYLE_ID)) return;

  const css = String.raw`
    /* --- PART 1: ORIGINAL OVERRIDES --- */
    
    /* Workspace color */
    .transition div .bg-\[--workspace-color\] {
      background-color: ${BACKGROUND} !important;
    }

    /* Navbar/Handler background (Old selector) */
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

    /* --- PART 2: NEW UPDATE FIXES --- */

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

    /* Overflow hidden background */
    .md\:pl-\[--workspace-width\] .flex-shrink-0 .bg-\[--workspace-color\] .justify-center > .overflow-hidden {
      background-color: #38383c !important;
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

  console.log('[TypingMind] Custom CSS V2 injected.');
})();
