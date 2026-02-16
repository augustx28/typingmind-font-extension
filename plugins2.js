/* ============================================================================
 * TypingMind - Mobile-friendly Plugin Reorder (plugins-only)
 * - Smooth touch drag (pointer events + touch-action)
 * - Continuous auto-scroll near top/bottom
 * - Saves order to localStorage
 * - Only targets "web plugins" (plugin switch + favicon icon), so Model Tools + MCP get ignored
 * - Forces plugin name block to align left (not centered)
 * ========================================================================== */
(() => {
  if (window.__tmPluginSorterMobileV1__) return;
  window.__tmPluginSorterMobileV1__ = true;

  const STORAGE_KEY = "tm_plugin_custom_order";
  const STYLE_ID = "tm-plugin-sorter-style-mobile-v1";

  // Keep TRUE to avoid touching Model Tools and MCP items that appear in the same menu.
  // If you have real plugins that do NOT show a favicon icon, set this to false.
  const STRICT_FAVICON_FILTER = true;

  const SEL = {
    row: '[role="menuitem"]',
    pluginSwitch: 'button[role="switch"][data-element-id^="plugins-switch"]',
    favicon: 'img[src*="s2/favicons?domain="]',
  };

  const store = {
    get() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
      catch { return []; }
    },
    set(v) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.isArray(v) ? v : [])); }
      catch {}
    },
    clear() {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
  };

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .tm-plugin-handle{
        cursor: grab;
        touch-action: none;
        -webkit-user-select: none;
        user-select: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        flex: 0 0 auto;
        border-radius: 10px;
        margin-right: 6px;
      }
      .tm-plugin-handle:active{ cursor: grabbing; }
      .tm-plugin-placeholder{
        background: rgba(72,128,255,.14);
        border: 2px dashed rgba(72,128,255,.8);
        border-radius: 10px;
        margin: 4px 0;
        pointer-events: none;
      }
      .tm-plugin-ghost{
        position: fixed;
        z-index: 2147483647;
        pointer-events: none;
        opacity: .96;
        transform: rotate(1deg);
        box-shadow: 0 10px 28px rgba(0,0,0,.25);
        will-change: left, top;
      }
    `;
    document.head.appendChild(style);
  }

  function isElement(n) { return n && n.nodeType === 1; }

  function getNameElFromFavicon(row) {
    const img = row.querySelector(SEL.favicon);
    if (!img) return null;
    const iconBox = img.closest("div");
    const nameEl = iconBox ? iconBox.nextElementSibling : null;
    return isElement(nameEl) ? nameEl : null;
  }

  function getPluginName(row) {
    const nameEl = getNameElFromFavicon(row);
    const t1 = nameEl ? (nameEl.textContent || "").trim() : "";
    if (t1) return t1;

    const sw = row.querySelector(SEL.pluginSwitch);
    const truncs = Array.from(row.querySelectorAll(".truncate"))
      .filter(el => isElement(el) && el.children.length === 0)
      .filter(el => !sw || !sw.contains(el))
      .map(el => (el.textContent || "").trim())
      .filter(Boolean);

    return truncs[0] || "";
  }

  function isSortablePluginRow(row) {
    if (!isElement(row)) return false;
    if (row.getAttribute("role") !== "menuitem") return false;

    if (!row.querySelector(SEL.pluginSwitch)) return false;

    if (STRICT_FAVICON_FILTER && !row.querySelector(SEL.favicon)) return false;

    return !!getPluginName(row);
  }

  function getLeftWrap(row) {
    const img = row.querySelector(SEL.favicon);
    if (img) {
      const iconBox = img.closest("div");
      const wrap = iconBox && iconBox.parentElement;
      if (wrap && row.contains(wrap)) return wrap;
    }
    const nameEl = row.querySelector(".truncate");
    return nameEl ? nameEl.parentElement : null;
  }

  function alignTextLeft(row) {
    const wrap = getLeftWrap(row);
    if (wrap) {
      wrap.style.justifyContent = "flex-start";
      wrap.style.alignItems = "center";
      wrap.style.minWidth = "0";
      wrap.style.flex = "1 1 auto";
    }
    row.style.textAlign = "left";
  }

  function findScrollContainer(el) {
    let cur = el;
    while (cur && cur !== document.body) {
      const s = getComputedStyle(cur);
      const oy = s.overflowY;
      const canScroll = (oy === "auto" || oy === "scroll") && cur.scrollHeight > cur.clientHeight + 2;
      if (canScroll) return cur;
      cur = cur.parentElement;
    }
    return null;
  }

  function ensureHandle(row, api) {
    if (row.dataset.tmPluginHandle === "1") return;
    row.dataset.tmPluginHandle = "1";

    alignTextLeft(row);

    const wrap = getLeftWrap(row);
    if (!wrap) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tm-plugin-handle";
    btn.setAttribute("aria-label", "Drag to reorder plugin");
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <circle cx="6.75" cy="3.75" r=".75"/><circle cx="6.75" cy="9" r=".75"/><circle cx="6.75" cy="14.25" r=".75"/>
          <circle cx="11.25" cy="3.75" r=".75"/><circle cx="11.25" cy="9" r=".75"/><circle cx="11.25" cy="14.25" r=".75"/>
        </g>
      </svg>
    `;

    btn.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); }, true);
    btn.addEventListener("contextmenu", (e) => { e.preventDefault(); }, true);
    btn.addEventListener("pointerdown", (e) => api.onDown(e, row), { passive: false });

    wrap.prepend(btn);
  }

  function applySavedOrder(itemsParent) {
    const saved = store.get();
    if (!Array.isArray(saved) || saved.length === 0) return;

    const rows = Array.from(itemsParent.querySelectorAll(SEL.row)).filter(isSortablePluginRow);
    if (rows.length < 2) return;

    const byName = new Map();
    rows.forEach(r => {
      const n = getPluginName(r);
      if (n && !byName.has(n)) byName.set(n, r);
    });

    const used = new Set();
    const newOrder = [];

    saved.forEach(n => {
      const r = byName.get(n);
      if (r && !used.has(r)) { newOrder.push(r); used.add(r); }
    });

    rows.forEach(r => {
      if (!used.has(r)) { newOrder.push(r); used.add(r); }
    });

    // Keep plugins inside their original slots so other sections don't move.
    const slots = rows.map(() => document.createComment("tm-plugin-slot"));
    rows.forEach((r, i) => r.replaceWith(slots[i]));
    newOrder.forEach((r, i) => slots[i].replaceWith(r));
  }

  function saveOrder(itemsParent) {
    const rows = Array.from(itemsParent.querySelectorAll(SEL.row)).filter(isSortablePluginRow);
    store.set(rows.map(getPluginName).filter(Boolean));
  }

  class DragController {
    constructor() {
      this.drag = null;
      this.onMove = this.onMove.bind(this);
      this.onUp = this.onUp.bind(this);
      this.scrollTick = this.scrollTick.bind(this);
    }

    onDown(e, row) {
      if (!isSortablePluginRow(row)) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;

      e.preventDefault();
      e.stopPropagation();

      const itemsParent = row.parentElement;
      if (!itemsParent) return;

      const scrollContainer = findScrollContainer(itemsParent) || itemsParent;
      const rect = row.getBoundingClientRect();

      const ph = document.createElement("div");
      ph.className = "tm-plugin-placeholder";
      ph.style.height = `${rect.height}px`;

      const ghost = row.cloneNode(true);
      ghost.classList.add("tm-plugin-ghost");
      ghost.removeAttribute("id");
      ghost.querySelectorAll("[id]").forEach(n => n.removeAttribute("id"));
      ghost.style.width = `${rect.width}px`;
      ghost.style.left = `${rect.left}px`;
      ghost.style.top = `${rect.top}px`;

      itemsParent.insertBefore(ph, row);
      row.style.display = "none";
      document.body.appendChild(ghost);

      this.drag = {
        row, ghost, ph, itemsParent, scrollContainer,
        pointerId: e.pointerId,
        offX: e.clientX - rect.left,
        offY: e.clientY - rect.top,
        lastX: e.clientX,
        lastY: e.clientY,
        edge: 64,
        maxScroll: 26,
        rafMove: 0,
        rafScroll: 0,
      };

      window.addEventListener("pointermove", this.onMove, { capture: true, passive: false });
      window.addEventListener("pointerup", this.onUp, { capture: true, passive: false });
      window.addEventListener("pointercancel", this.onUp, { capture: true, passive: false });

      this.drag.rafScroll = requestAnimationFrame(this.scrollTick);
    }

    onMove(e) {
      const d = this.drag;
      if (!d || e.pointerId !== d.pointerId) return;
      e.preventDefault();

      d.lastX = e.clientX;
      d.lastY = e.clientY;

      if (d.rafMove) return;
      d.rafMove = requestAnimationFrame(() => {
        d.rafMove = 0;
        this.updateGhost();
        this.repositionPlaceholder();
      });
    }

    updateGhost() {
      const d = this.drag;
      if (!d) return;
      d.ghost.style.left = `${d.lastX - d.offX}px`;
      d.ghost.style.top = `${d.lastY - d.offY}px`;
    }

    repositionPlaceholder() {
      const d = this.drag;
      if (!d) return;

      const rows = Array.from(d.itemsParent.querySelectorAll(SEL.row))
        .filter(isSortablePluginRow)
        .filter(r => r !== d.row)
        .filter(r => r.style.display !== "none");

      if (rows.length === 0) return;

      const y = d.lastY;
      let placed = false;

      for (const r of rows) {
        const rr = r.getBoundingClientRect();
        if (y < rr.top + rr.height / 2) {
          r.before(d.ph);
          placed = true;
          break;
        }
      }
      if (!placed) rows[rows.length - 1].after(d.ph);
    }

    scrollTick() {
      const d = this.drag;
      if (!d) return;

      const r = d.scrollContainer.getBoundingClientRect();
      const y = d.lastY;

      let v = 0;
      if (y < r.top + d.edge) {
        v = -Math.ceil(d.maxScroll * Math.min(1, (r.top + d.edge - y) / d.edge));
      } else if (y > r.bottom - d.edge) {
        v = Math.ceil(d.maxScroll * Math.min(1, (y - (r.bottom - d.edge)) / d.edge));
      }

      if (v !== 0) {
        d.scrollContainer.scrollTop += v;
        this.repositionPlaceholder();
      }

      d.rafScroll = requestAnimationFrame(this.scrollTick);
    }

    onUp(e) {
      const d = this.drag;
      if (!d || e.pointerId !== d.pointerId) return;

      window.removeEventListener("pointermove", this.onMove, true);
      window.removeEventListener("pointerup", this.onUp, true);
      window.removeEventListener("pointercancel", this.onUp, true);

      if (d.rafMove) cancelAnimationFrame(d.rafMove);
      if (d.rafScroll) cancelAnimationFrame(d.rafScroll);

      d.ghost.remove();
      d.row.style.display = "";
      d.ph.replaceWith(d.row);

      saveOrder(d.itemsParent);
      this.drag = null;
    }
  }

  injectStyle();
  const drag = new DragController();

  function scan() {
    if (drag.drag) return;

    const rows = Array.from(document.querySelectorAll(SEL.row)).filter(isSortablePluginRow);
    if (rows.length === 0) return;

    const parents = new Set();
    rows.forEach(r => {
      ensureHandle(r, drag);
      if (r.parentElement) parents.add(r.parentElement);
    });

    parents.forEach(p => {
      if (p.dataset.tmPluginOrderApplied === "1") return;
      applySavedOrder(p);
      p.dataset.tmPluginOrderApplied = "1";
    });
  }

  scan();

  const mo = new MutationObserver(() => {
    if (scan._t) return;
    scan._t = setTimeout(() => { scan._t = 0; scan(); }, 60);
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // Optional: run in console to reset
  window.tmPluginOrderReset = () => store.clear();
})();
