(() => {
  const STYLE_ID = 'tm-ui-overrides';
  
  // Prevent duplicate injection
  if (document.getElementById(STYLE_ID)) return;

  const BACKGROUND = '#191919';
  const ICON = '#DA9010';

  // Combined CSS with String.raw to preserve Tailwind escapes
  const css = String.raw`
    /* --- Part 1: Color Overrides --- */
    
    /* workspace color */
    .transition div .bg-\[--workspace-color\] {
      background-color: ${BACKGROUND} !important;
    }

    /* var(workspace height) */
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

    /* --- Part 2: Chat Button Tweaks --- */
    
    /* Transition all */
    #elements-in-action-buttons > .transition-all {
      position: relative;
      top: -3px;
    }
  `;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.setAttribute('data-origin', 'typingmind-extension');
  style.textContent = css;

  // INJECT IMMEDIATELY - Do not wait for DOMContentLoaded
  document.head.appendChild(style);

  console.log('[TypingMind] UI Overrides injected immediately.');
})();
