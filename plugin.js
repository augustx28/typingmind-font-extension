/* ============================================================================
 * TypingMind – Mobile-Friendly Plugin Reorder (Plugins only) (2026-02-16)
 * - Drag via handle (touch + mouse)
 * - Smooth auto-scroll (rAF)
 * - Only targets real plugins (rows that contain a plugins-switch toggle)
 * - Saves order in localStorage
 * ========================================================================== */
(() => {
  const STORAGE_KEY = 'tm_plugin_custom_order_v2';
  const HANDLE_CLASS = 'tm-plugin-handle';
  const PLACEHOLDER_CLASS = 'tm-plugin-placeholder';
  const DRAGGING_CLASS = 'tm-plugin-dragging';
  const SORTING_BODY_CLASS = 'tm-plugin-sorting';

  function storeGet() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (err) {
      return [];
    }
  }
  function storeSave(order) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    } catch (err) {}
  }

  function injectStyles() {
    if (document.getElementById('tm-plugin-sorter-style-v2')) return;
    const style = document.createElement('style');
    style.id = 'tm-plugin-sorter-style-v2';
    style.textContent = `
      .${HANDLE_CLASS}{
        cursor:grab;
        display:flex;
        align-items:center;
        padding:8px;
        margin-right:4px;
        border-radius:8px;
        touch-action:none;
        -webkit-user-select:none;
        user-select:none;
      }
      .${HANDLE_CLASS}:active{cursor:grabbing}
      .${PLACEHOLDER_CLASS}{
        background:rgba(154,179,255,.18);
        border:2px dashed rgba(72,128,255,.9);
        border-radius:10px;
        margin:4px 0;
      }
      .${DRAGGING_CLASS}{
        opacity:.95;
        box-shadow:0 10px 24px rgba(0,0,0,.25);
        transform:translate3d(0,0,0) rotate(1deg);
      }
      body.${SORTING_BODY_CLASS}{
        -webkit-user-select:none;
        user-select:none;
      }
    `;
    document.head.appendChild(style);
  }

  // IMPORTANT: this is what prevents rearranging Model Tools + MCP.
  // We only reorder rows that have the plugins toggle button.
  function isPluginRow(row) {
    if (!row || row.nodeType !== 1) return false;
    return !!row.querySelector('button[data-element-id^="plugins-switch"]');
  }

  function getRowName(row) {
    const truncs = row ? row.querySelectorAll('.truncate') : null;
    if (truncs && truncs.length) {
      for (let i = truncs.length - 1; i >= 0; i--) {
        const t = (truncs[i].textContent || '').trim();
        if (t) return t;
      }
    }
    const fallback = row && row.textContent ? row.textContent.trim() : '';
    return fallback.replace(/\s+/g, ' ');
  }

  function getPluginRows(list) {
    return Array.from(list.querySelectorAll('[role="menuitem"]')).filter(isPluginRow);
  }

  function countDirectMenuItems(el) {
    if (!el || !el.children) return 0;
    let c = 0;
    for (const ch of el.children) {
      if (ch && ch.getAttribute && ch.getAttribute('role') === 'menuitem') c++;
    }
    return c;
  }

  function findListFromRow(row) {
    let el = row.parentElement;
    while (el && el !== document.body) {
      if (countDirectMenuItems(el) >= 2) return el;
      el = el.parentElement;
    }
    return row.parentElement;
  }

  function getHandleMount(row) {
    const img = row.querySelector('img');
    if (img) {
      const c = img.closest('.truncate');
      if (c) return c;
    }
    const firstDiv = row.querySelector('div');
    return firstDiv || row;
  }

  function ensureHandle(row, onDown) {
    if (row.dataset.tmPluginHandle === '1') return;
    row.dataset.tmPluginHandle = '1';

    const mount = getHandleMount(row);
    if (!mount) return;

    const h = document.createElement('div');
    h.className = HANDLE_CLASS;
    h.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"
        style="color:rgba(148,163,184,1)">
        <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <circle cx="6.75" cy="3.75" r=".75"/><circle cx="6.75" cy="9" r=".75"/><circle cx="6.75" cy="14.25" r=".75"/>
          <circle cx="11.25" cy="3.75" r=".75"/><circle cx="11.25" cy="9" r=".75"/><circle cx="11.25" cy="14.25" r=".75"/>
        </g>
      </svg>
    `;

    h.addEventListener('pointerdown', (e) => onDown(e, row, h), { passive: false });
    mount.prepend(h);
  }

  function applySavedOrder(list) {
    const saved = storeGet();
    if (!saved.length) return;

    const pluginRows = getPluginRows(list);
    if (pluginRows.length < 2) return;

    const byName = new Map();
    pluginRows.forEach((r) => byName.set(getRowName(r), r));

    const used = new Set();
    const frag = document.createDocumentFragment();

    saved.forEach((name) => {
      const r = byName.get(name);
      if (r && !used.has(r)) {
        used.add(r);
        frag.appendChild(r);
      }
    });

    pluginRows.forEach((r) => {
      if (!used.has(r)) frag.appendChild(r);
    });

    // Insert plugin block back where it was (keeps non-plugin rows in place)
    const children = Array.from(list.children);
    const lastPlugin = pluginRows[pluginRows.length - 1];
    const lastIndex = children.indexOf(lastPlugin);
    const referenceNode = children[lastIndex + 1] || null;

    list.insertBefore(frag, referenceNode);
  }

  function saveOrder(list) {
    const pluginRows = getPluginRows(list);
    const order = pluginRows.map(getRowName).filter(Boolean);
    storeSave(order);
  }

  let drag = null;

  function startDrag(e, row, handle) {
    if (!e || !row) return;
    if (typeof e.button === 'number' && e.button !== 0) return;

    const list = findListFromRow(row);
    if (!list) return;
    if (!isPluginRow(row)) return;

    e.preventDefault();
    e.stopPropagation();

    injectStyles();

    const rect = row.getBoundingClientRect();
    const ph = document.createElement('div');
    ph.className = PLACEHOLDER_CLASS;
    ph.style.height = rect.height + 'px';

    row.before(ph);

    row.classList.add(DRAGGING_CLASS);
    row.style.width = rect.width + 'px';
    row.style.position = 'fixed';
    row.style.left = rect.left + 'px';
    row.style.top = rect.top + 'px';
    row.style.zIndex = '99999';
    row.style.pointerEvents = 'none';
    row.style.willChange = 'transform';

    document.body.classList.add(SORTING_BODY_CLASS);

    const pointerId = e.pointerId;
    try {
      if (handle && handle.setPointerCapture) handle.setPointerCapture(pointerId);
    } catch (err) {}

    drag = {
      row,
      list,
      ph,
      handle,
      pointerId,
      offX: e.clientX - rect.left,
      offY: e.clientY - rect.top,
      x: e.clientX,
      y: e.clientY,
      edge: 60,
      maxScroll: 18,
      raf: 0
    };

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp, { passive: false });
    window.addEventListener('pointercancel', onUp, { passive: false });

    tick();
  }

  function onMove(e) {
    if (!drag) return;
    if (e.pointerId !== drag.pointerId) return;
    drag.x = e.clientX;
    drag.y = e.clientY;
    e.preventDefault();
  }

  function movePlaceholder() {
    if (!drag) return;
    const list = drag.list;
    const row = drag.row;
    const ph = drag.ph;
    const x = drag.x;
    const y = drag.y;

    const pluginRows = getPluginRows(list).filter((r) => r !== row);
    if (!pluginRows.length) return;

    const el = document.elementFromPoint(x, y);
    const over = el && el.closest ? el.closest('[role="menuitem"]') : null;

    if (over && over !== row && list.contains(over) && isPluginRow(over)) {
      const r = over.getBoundingClientRect();
      if (y < r.top + r.height / 2) over.before(ph);
      else over.after(ph);
      return;
    }

    // Clamp inside plugin rows range (prevents falling into Model Tools + MCP)
    const first = pluginRows[0].getBoundingClientRect();
    const last = pluginRows[pluginRows.length - 1].getBoundingClientRect();

    if (y < first.top) pluginRows[0].before(ph);
    else if (y > last.bottom) pluginRows[pluginRows.length - 1].after(ph);
  }

  function autoScroll() {
    if (!drag) return;
    const list = drag.list;
    const y = drag.y;
    const edge = drag.edge;
    const maxScroll = drag.maxScroll;

    const r = list.getBoundingClientRect();
    const topDist = y - r.top;
    const botDist = r.bottom - y;

    let v = 0;
    if (topDist >= 0 && topDist < edge) {
      const p = 1 - topDist / edge;
      v = -Math.max(2, Math.round(maxScroll * p));
    } else if (botDist >= 0 && botDist < edge) {
      const p = 1 - botDist / edge;
      v = Math.max(2, Math.round(maxScroll * p));
    }

    if (v) list.scrollTop += v;
  }

  function tick() {
    if (!drag) return;

    const row = drag.row;
    const x = drag.x;
    const y = drag.y;

    const left = x - drag.offX;
    const top = y - drag.offY;

    const baseLeft = parseFloat(row.style.left) || 0;
    const baseTop = parseFloat(row.style.top) || 0;
    row.style.transform = `translate3d(${left - baseLeft}px, ${top - baseTop}px, 0)`;

    autoScroll();
    movePlaceholder();

    drag.raf = requestAnimationFrame(tick);
  }

  function endDrag(commit) {
    if (!drag) return;

    cancelAnimationFrame(drag.raf);

    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);

    try {
      if (drag.handle && drag.handle.releasePointerCapture) {
        drag.handle.releasePointerCapture(drag.pointerId);
      }
    } catch (err) {}

    document.body.classList.remove(SORTING_BODY_CLASS);

    if (drag.ph && drag.ph.parentNode) drag.ph.replaceWith(drag.row);

    const row = drag.row;
    row.classList.remove(DRAGGING_CLASS);
    row.style.position = '';
    row.style.left = '';
    row.style.top = '';
    row.style.width = '';
    row.style.zIndex = '';
    row.style.pointerEvents = '';
    row.style.willChange = '';
    row.style.transform = '';

    if (commit) saveOrder(drag.list);

    drag = null;
  }

  function onUp(e) {
    if (!drag) return;
    if (e.pointerId !== drag.pointerId) return;
    e.preventDefault();
    endDrag(true);
  }

  function attach() {
    injectStyles();

    const switches = document.querySelectorAll('button[data-element-id^="plugins-switch"]');
    switches.forEach((btn) => {
      const row = btn.closest('[role="menuitem"]');
      if (!row) return;

      const list = findListFromRow(row);
      if (!list) return;

      if (list.dataset.tmPluginSortAttached !== '1') {
        list.dataset.tmPluginSortAttached = '1';
        applySavedOrder(list);
      }

      getPluginRows(list).forEach((r) => ensureHandle(r, startDrag));
    });
  }

  let queued = false;
  const mo = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      attach();
    });
  });

  mo.observe(document.body, { childList: true, subtree: true });
  attach();
})();
