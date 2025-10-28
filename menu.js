// color-overrides.js
(() => {
  const STYLE_ID = 'tm-color-overrides';
  const BACKGROUND = '#191919';
  const ICON = '#DA9010';

  // Avoid duplicate injection
  if (document.getElementById(STYLE_ID)) return;

  // Preserve all backslashes in complex Tailwind selectors
  const css = String.raw`
/* workspace color */
.transition div .bg-\[--workspace-color\]{
  background-color: ${BACKGROUND} !important;
}

/* var(workspace height) */
#nav-handler .transition .h-\[var\(--workspace-height\)\]{
  background-color: ${BACKGROUND} !important;
}

/* Navigation */
.transition .flex-col .md\:pl-\[--workspace-width\]{
  background-color: ${BACKGROUND} !important;
}

/* Folder icons color */
.md\:max-w-\[calc\(var\(--sidebar-width\)-var\(--workspace-width\)\)\] div .h-6 {
  color: ${ICON} !important;
}
  `;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.setAttribute('data-origin', 'typingmind-extension');
  style.textContent = css;

  // Insert as late as possible for stronger precedence
  const attach = () => (document.head || document.documentElement).appendChild(style);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach, { once: true });
  } else {
    attach();
  }

  console.log('[TypingMind] Color overrides injected.');
})();

// chat-button-tweak.js
(() => {
  const STYLE_ID = 'tm-chat-button-tweak';
  if (document.getElementById(STYLE_ID)) return;

  const css = String.raw`
/* Transition all */
#elements-in-action-buttons > .transition-all{
 position:relative;
 top:-3px;
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

  console.log('[TypingMind] Chat action button positioning tweak injected.');
})();
