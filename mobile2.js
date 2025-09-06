// file: mobile-nav-stick.js
(() => {
  'use strict';

  // 0) Remove your old CSS if it was injected previously
  const OLD_STYLE_ID = 'tm-ext-mobile-nav-shift';
  const old = document.getElementById(OLD_STYLE_ID);
  if (old) old.remove();

  // 1) Config
  const STYLE_ID = 'tm-ext-mobile-nav-stick';
  const NAV_FIXED_CLASS = 'tm-mobile-nav-fixed';
  const SPACER_CLASS = 'tm-mobile-nav-spacer';
  const MOBILE_BP = 500; // px, match your original 499.995px breakpoint

  // Try several reasonable selectors. Update if you know the exact one.
  const CANDIDATES = [
    '[data-element-id="mobile-bottom-nav"]',
    '[data-element-id="bottom-nav"]',
    '[data-element-id*="bottom"][data-element-id*="nav"]',
    '#nav-handler [role="navigation"]',
    '#nav-handler nav'
  ];

  // 2) CSS
  const CSS = `
@media (max-width: ${MOBILE_BP - 0.005}px) {
  .${NAV_FIXED_CLASS} {
    position: fixed !important;
    left: 0; right: 0;
    bottom: max(env(safe-area-inset-bottom, 0px), 0px);
    z-index: 2147483647;
    transform: none !important;
    width: 100%;
    box-sizing: border-box;
    /* Optional: background and border to ensure contrast; tweak as you like */
    /* background: var(--tm-color-bg, rgba(255,255,255,0.98)); */
    /* border-top: 1px solid rgba(0,0,0,0.08); */
  }

  html.${SPACER_CLASS}, body.${SPACER_CLASS} {
    padding-bottom: calc(var(--tm-mobile-nav-height, 64px) + max(env(safe-area-inset-bottom, 0px), 0px)) !important;
  }
}

/* Older iOS fallback for constant() */
@supports (padding: constant(safe-area-inset-bottom)) {
  @media (max-width: ${MOBILE_BP - 0.005}px) {
    .${NAV_FIXED_CLASS} {
      bottom: max(constant(safe-area-inset-bottom, 0px), 0px);
    }
    html.${SPACER_CLASS}, body.${SPACER_CLASS} {
      padding-bottom: calc(var(--tm-mobile-nav-height, 64px) + max(constant(safe-area-inset-bottom, 0px), 0px)) !important;
    }
  }
}
  `.trim();

  // 3) Helpers
  const injectStyle = () => {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  };

  const findNav = () => {
    for (const sel of CANDIDATES) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  };

  const updateHeightVar = (nav) => {
    const rect = nav.getBoundingClientRect();
    const h = Math.ceil(rect.height || 56);
    document.documentElement.style.setProperty('--tm-mobile-nav-height', `${h}px`);
  };

  const applyFix = () => {
    const nav = findNav();
    if (!nav) return false;
    injectStyle();
    nav.classList.add(NAV_FIXED_CLASS);
    // Add spacer so page content is not covered
    document.documentElement.classList.add(SPACER_CLASS);
    document.body.classList.add(SPACER_CLASS);

    // Measure after layout
    requestAnimationFrame(() => updateHeightVar(nav));

    // Keep height in sync on resize or nav size changes
    try {
      const ro = new ResizeObserver(() => updateHeightVar(nav));
      ro.observe(nav);
      window.addEventListener('resize', () => updateHeightVar(nav));
      window.addEventListener('orientationchange', () => updateHeightVar(nav));
      document.addEventListener('visibilitychange', () => updateHeightVar(nav));
    } catch {}
    return true;
  };

  const boot = () => {
    if (applyFix()) return;
    const mo = new MutationObserver(() => {
      if (applyFix()) mo.disconnect();
    });
    mo.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // 4) Cleanup helper
  window.__removeTmMobileNavStick = () => {
    const s = document.getElementById(STYLE_ID);
    if (s) s.remove();
    const nav = findNav();
    if (nav) nav.classList.remove(NAV_FIXED_CLASS);
    document.documentElement.classList.remove(SPACER_CLASS);
    document.body.classList.remove(SPACER_CLASS);
    document.documentElement.style.removeProperty('--tm-mobile-nav-height');
  };
})();
