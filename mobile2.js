// typingmind-sticky-bottom-bar.js
(() => {
  // 1) If you already know the exact selector, set it here and leave CANDIDATES empty.
  const EXACT_SELECTOR = ''; // e.g. '[data-element-id="header-toolbar"]'

  // 2) Otherwise, we will try these candidates in order.
  const CANDIDATES = [
    '[data-element-id="mobile-toolbar"]',
    '[data-element-id="header-toolbar"]',
    '[data-element-id*="toolbar"]',
    'header nav',
    'nav[role="navigation"]'
  ];

  // Inject CSS once
  const STYLE = `
  @media (max-width: 500px) {
    .tm-sticky-bottom {
      position: fixed !important;
      left: 0; right: 0; bottom: 0;
      width: 100%;
      z-index: 2147483646;
      transform: translate3d(0,0,0);
      background: var(--tm-toolbar-bg, var(--tm-bg, inherit));
      border-top: 1px solid rgba(0,0,0,0.08);
      padding-bottom: max(8px, env(safe-area-inset-bottom));
    }
    :root { --tm-bottom-bar-h: 56px; }
  }`;
  const styleEl = document.createElement('style');
  styleEl.setAttribute('data-tm-sticky-style', '1');
  styleEl.textContent = STYLE;
  document.head.appendChild(styleEl);

  let stickyEl = null;
  let paddedContainer = null;

  function findMenuBar() {
    if (EXACT_SELECTOR) {
      return document.querySelector(EXACT_SELECTOR);
    }
    for (const sel of CANDIDATES) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function getScrollableAncestor(el) {
    // Walk up to find the actual scrolling container
    let node = el?.parentElement || null;
    while (node) {
      const cs = getComputedStyle(node);
      const oy = cs.overflowY;
      const isScrollable = (oy === 'auto' || oy === 'scroll') && node.scrollHeight > node.clientHeight;
      if (isScrollable) return node;
      node = node.parentElement;
    }
    return document.scrollingElement || document.documentElement;
  }

  function updateHeights() {
    if (!stickyEl) return;
    const h = Math.ceil(stickyEl.getBoundingClientRect().height || 56);
    document.documentElement.style.setProperty('--tm-bottom-bar-h', `${h}px`);
    if (!paddedContainer) return;
    paddedContainer.style.paddingBottom = `calc(var(--tm-bottom-bar-h) + env(safe-area-inset-bottom))`;
  }

  function apply() {
    const el = findMenuBar();
    if (!el) return;

    if (!el.classList.contains('tm-sticky-bottom')) {
      el.classList.add('tm-sticky-bottom');
    }
    stickyEl = el;

    // Pad the real scroll container, not always <body>
    paddedContainer = getScrollableAncestor(el) || document.body;
    updateHeights();
  }

  // Initial run and observers
  const run = () => { apply(); updateHeights(); };
  run();

  // Recalculate on resize and orientation changes
  ['resize', 'orientationchange'].forEach(evt => window.addEventListener(evt, updateHeights, { passive: true }));

  // Observe DOM changes, since TypingMind is a SPA
  const mo = new MutationObserver(() => {
    // If bar was removed or replaced, re-apply
    if (!stickyEl || !document.contains(stickyEl)) {
      apply();
    } else {
      updateHeights();
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // Optional: expose a global for quick debugging
  window.__tmStickyBottom = { apply, updateHeights };
})();
