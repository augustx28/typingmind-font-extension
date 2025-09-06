@media (max-width: 500px) {
  /* Make the workspace navigation sticky at bottom */
  #nav-handler,
  .transition.h-\[var\(--workspace-height\)\] {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    transform: translateY(0) !important;
    z-index: 9999 !important;
    background: var(--background-primary, #ffffff) !important;
    border-top: 1px solid var(--border-color, #e5e7eb) !important;
    max-height: 60px !important;
    overflow-x: auto !important;
  }

  /* Adjust main content area to account for sticky bottom nav */
  .transition.flex-col.md\:pl-\[--workspace-width\] {
    padding-bottom: 65px !important; /* Space for fixed bottom nav */
    padding-left: 0 !important;
  }

  /* Optional: Hide sidebar on mobile if needed */
  .md\:pl-\[--workspace-width\] {
    padding-left: 0 !important;
  }

  /* Ensure proper scrolling for main content */
  body, html {
    overflow-x: hidden !important;
  }

  /* Make navigation items horizontal on mobile */
  #nav-handler .flex-col {
    flex-direction: row !important;
    justify-content: space-around !important;
    align-items: center !important;
    height: 60px !important;
  }
}
