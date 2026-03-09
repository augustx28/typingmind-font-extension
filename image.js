(function () {
  const AVATAR_SELECTOR = 'img.user-avatar, img[alt="User profile"]';

  function makeAvatarTransparent(root = document) {
    const avatars = root.querySelectorAll?.(AVATAR_SELECTOR) || [];

    avatars.forEach((img) => {
      // Remove the fallback gray class if it exists
      img.classList.remove('error-fallback-gray');

      // Force the image itself to stay transparent
      img.style.setProperty('background', 'transparent', 'important');
      img.style.setProperty('background-color', 'transparent', 'important');
      img.style.setProperty('box-shadow', 'none', 'important');
      img.style.setProperty('border', 'none', 'important');

      // Sometimes the gray is actually on the wrapper, not the image
      let parent = img.parentElement;
      let depth = 0;

      while (parent && depth < 3) {
        parent.style.setProperty('background', 'transparent', 'important');
        parent.style.setProperty('background-color', 'transparent', 'important');
        parent.style.setProperty('box-shadow', 'none', 'important');
        parent.style.setProperty('border', 'none', 'important');
        parent = parent.parentElement;
        depth++;
      }
    });
  }

  function injectCSS() {
    if (document.getElementById('tm-avatar-transparent-fix')) return;

    const style = document.createElement('style');
    style.id = 'tm-avatar-transparent-fix';
    style.textContent = `
      img.user-avatar,
      img[alt="User profile"],
      img.user-avatar.error-fallback-gray {
        background: transparent !important;
        background-color: transparent !important;
        box-shadow: none !important;
        border: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  injectCSS();
  makeAvatarTransparent();

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue;

        if (node.matches?.(AVATAR_SELECTOR)) {
          makeAvatarTransparent(document);
        } else if (node.querySelector?.(AVATAR_SELECTOR)) {
          makeAvatarTransparent(node);
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Extra passes in case TypingMind renders late
  setTimeout(() => makeAvatarTransparent(), 500);
  setTimeout(() => makeAvatarTransparent(), 1500);
})();
