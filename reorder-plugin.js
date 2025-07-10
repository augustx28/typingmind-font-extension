/* ============================================================================
 * TypingMind – Minimal Plugin Order Applier (2025-07-10)
 * Applies saved plugin order from localStorage. No dragging functionality.
 * Keeps order as long as this extension is active.
 * ========================================================================== */
(() => {
  /* Tiny storage helper */
  class Store {
    constructor(key) { this.key = key; }
    get() { return JSON.parse(localStorage.getItem(this.key) || '[]'); }
  }

  /* Main applier */
  class OrderApplier {
    KEY = 'tm_plugin_custom_order';
    SEL = {
      list: '[id^="headlessui-menu-items-"] div.overflow-y-auto.custom-scrollbar',
      row: '[role="menuitem"]',
      wrap: '.flex.items-center.justify-center.gap-2.truncate'
    };

    constructor() {
      this.store = new Store(this.KEY);
      this.#css(); // Minimal CSS for grips (optional, can remove if not needed)
      this.#watch();
    }

    /* Inject minimal CSS (for grips only) */
    #css() {
      if (document.getElementById('tm-plugin-applier-style')) return;
      const style = document.createElement('style');
      style.id = 'tm-plugin-applier-style';
      style.textContent = `
        .tm-handle { cursor: default; display: flex; align-items: center; }
      `;
      document.head.appendChild(style);
    }

    /* Observe plugin menus */
    #watch() {
      new MutationObserver(muts => {
        muts.forEach(m => {
          m.addedNodes.forEach(n => {
            const list = n.querySelector?.(this.SEL.list);
            if (list && !list.dataset.sortAttach) this.#init(list);
          });
        });
      }).observe(document.body, { subtree: true, childList: true });
    }

    /* Initialize one list */
    #init(list) {
      list.dataset.sortAttach = '1';
      this.#applySaved(list);
      list.querySelectorAll(this.SEL.row).forEach(r => this.#grip(r)); // Add grips (visual only)
      console.log('[PluginOrderApplier] Applied saved order');
    }

    /* Add visual grip (non-functional) */
    #grip(row) {
      if (row.dataset.hasHandle) return;
      row.dataset.hasHandle = '1';
      const h = document.createElement('div');
      h.className = 'tm-handle';
      h.innerHTML = `<svg class="w-5 h-5 text-slate-400" width="18" height="18" viewBox="0 0 18 18"
        xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="1.5"
        stroke-linecap="round"><circle cx="6.75" cy="3.75" r=".75"/><circle cx="6.75" cy="9" r=".75"/>
        <circle cx="6.75" cy="14.25" r=".75"/><circle cx="11.25" cy="3.75" r=".75"/>
        <circle cx="11.25" cy="9" r=".75"/><circle cx="11.25" cy="14.25" r=".75"/></g></svg>`;
      row.querySelector(this.SEL.wrap)?.prepend(h);
    }

    /* Apply saved order */
    #applySaved(list) {
      const saved = this.store.get();
      if (!saved.length) return;
      const map = new Map();
      list.querySelectorAll(this.SEL.row).forEach(r => {
        const n = r.querySelector('.truncate')?.textContent.trim();
        if (n) map.set(n, r);
      });
      saved.forEach(n => { const el = map.get(n); if (el) list.appendChild(el); });
    }
  }

  new OrderApplier(); // Boot
})();
