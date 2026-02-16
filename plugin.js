/* ============================================================================
 * TypingMind – Plugin Reorder (Mobile-Smooth) (2026-02-16)
 * - Touch + mouse drag via pointer events
 * - Auto-scroll near top/bottom
 * - Uses a "ghost" element for smooth dragging
 * - Re-injects handles after UI re-renders
 * - Persists order in localStorage (tm_plugin_custom_order)
 * ========================================================================== */
(() => {
  'use strict';

  const ORDER_KEY = 'tm_plugin_custom_order';
  const MENU_ID_PREFIX = 'headlessui-menu-items-';
  const ROW_SEL = '[role="menuitem"]';
  const LABEL_SEL = '.truncate';
  const STYLE_ID = 'tm-plugin-sorter-style-v2';

  let drag = null;
  let applying = false;
  let suppressClickUntil = 0;

  function now() { return Date.now(); }

  function normalizeText(s) {
    return (s || '').replace(/\s+/g, ' ').trim();
  }

  function storeGet() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ORDER_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function storeSave(arr) {
    try {
      localStorage.setItem(ORDER_KEY, JSON.stringify(arr || []));
    } catch {}
  }

  function injectCss() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .tm-handle{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        padding:10px;
        margin-right:4px;
        cursor:grab;
        touch-action:none;
        -webkit-user-select:none;
        user-select:none;
        flex:0 0 auto;
      }
      .tm-handle:active{cursor:grabbing}
      .tm-handle svg{pointer-events:none}

      .tm-placeholder{
        background: rgba(72,128,255,0.16);
        border: 2px dashed rgba(72,128,255,0.65);
        border-radius:10px;
        margin:4px 0;
        min-height:36px;
      }

      .tm-ghost{
        position:fixed;
        z-index:2147483647;
        pointer-events:none;
        box-shadow:0 10px 25px rgba(0,0,0,0.25);
        opacity:0.98;
        transform:translate3d(0,0,0);
        will-change:transform;
      }

      body.tm-sort-noselect, body.tm-sort-noselect *{
        -webkit-user-select:none !important;
        user-select:none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function getRowName(row) {
    const label = row.querySelector(LABEL_SEL) || row;
    return normalizeText(label.textContent);
  }

  function getRows(container) {
    return Array.from(container.querySelectorAll(':scope > ' + ROW_SEL));
  }

  function applySaved(container) {
    if (!container || drag) return;

    const saved = storeGet();
    if (!saved.length) return;

    applying = true;
    try {
      const rows = getRows(container);
      if (!rows.length) return;

      const map = new Map();
      for (const r of rows) map.set(getRowName(r), r);

      for (const name of saved) {
        const el = map.get(name);
        if (el) container.appendChild(el);
      }
    } finally {
      applying = false;
    }
  }

  function saveOrder(container) {
    if (!container) return;
    const order = getRows(container).map(getRowName).filter(Boolean);
    storeSave(order);
  }

  function addHandle(row) {
    if (!row || row.querySelector('.tm-handle')) return;

    const h = document.createElement('span');
    h.className = 'tm-handle';
    h.tabIndex = -1;
    h.innerHTML = `
      <svg class="w-5 h-5 text-slate-400" width="18" height="18" viewBox="0 0 18 18"
        xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <circle cx="6.75" cy="3.75" r=".75"/><circle cx="6.75" cy="9" r=".75"/><circle cx="6.75" cy="14.25" r=".75"/>
          <circle cx="11.25" cy="3.75" r=".75"/><circle cx="11.25" cy="9" r=".75"/><circle cx="11.25" cy="14.25" r=".75"/>
        </g>
      </svg>
    `;

    h.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, true);

    h.addEventListener('pointerdown', (e) => startDrag(e, row, h), { passive: false });

    const wrap =
      row.querySelector('.flex.items-center.justify-center.gap-2.truncate') ||
      row.querySelector('.flex.items-center.gap-2.truncate') ||
      row.querySelector(LABEL_SEL) ||
      row;

    wrap.prepend(h);
  }

  function ensureHandles(container) {
    const rows = getRows(container);
    for (const row of rows) addHandle(row);
  }

  function pickList(menu) {
    if (!menu || !menu.querySelector) return null;

    const candidates = [];

    if (menu.matches && menu.matches('.overflow-y-auto')) candidates.push(menu);
    candidates.push(...menu.querySelectorAll('.overflow-y-auto'));

    const withItems = candidates.filter((el) => el.querySelector && el.querySelector(ROW_SEL));

    const preferred = withItems.find((el) => el.classList && el.classList.contains('custom-scrollbar'));
    if (preferred) return preferred;

    if (withItems[0]) return withItems[0];

    if (menu.querySelector(ROW_SEL)) return menu;
    return null;
  }

  function initList(list) {
    if (!list || !list.querySelector) return;
    if (list.dataset.tmPluginSortAttached) return;

    const firstRow = list.querySelector(ROW_SEL);
    if (!firstRow) return;

    const container = firstRow.parentElement;
    if (!container) return;

    list.dataset.tmPluginSortAttached = '1';

    applySaved(container);
    ensureHandles(container);
    watchContainer(container);
  }

  function watchContainer(container) {
    if (container.dataset.tmPluginSortWatching) return;
    container.dataset.tmPluginSortWatching = '1';

    let t = 0;
    const schedule = () => {
      if (drag || applying) return;
      clearTimeout(t);
      t = setTimeout(() => {
        if (drag || applying) return;
        ensureHandles(container);
        applySaved(container);
      }, 50);
    };

    new MutationObserver((muts) => {
      if (drag || applying) return;
      for (const m of muts) {
        if (m.type === 'childList' && (m.addedNodes.length || m.removedNodes.length)) {
          schedule();
          break;
        }
      }
    }).observe(container, { childList: true, subtree: true });
  }

  function scan(root) {
    const scope = root && root.querySelectorAll ? root : document;

    const menus = [];
    if (root instanceof Element && root.id && root.id.startsWith(MENU_ID_PREFIX)) {
      menus.push(root);
    }
    menus.push(...scope.querySelectorAll(`[id^="${MENU_ID_PREFIX}"]`));

    for (const menu of menus) {
      const list = pickList(menu);
      if (list) initList(list);
    }
  }

  function watchBody() {
    new MutationObserver((muts) => {
      for (const m of muts) {
        for (const n of m.addedNodes) {
          if (!(n instanceof Element)) continue;

          if (n.id && n.id.startsWith(MENU_ID_PREFIX)) {
            scan(n);
            continue;
          }

          if (n.querySelector && n.querySelector(`[id^="${MENU_ID_PREFIX}"]`)) {
            scan(n);
          }
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  function repositionPlaceholder(clientY) {
    if (!drag) return;

    const { container, row, ph } = drag;
    if (!container || !ph) return;

    const items = getRows(container).filter((el) => el !== row);
    if (!items.length) return;

    for (const it of items) {
      const r = it.getBoundingClientRect();
      const mid = r.top + r.height / 2;
      if (clientY < mid) {
        it.before(ph);
        return;
      }
    }
    items[items.length - 1].after(ph);
  }

  function finishDrag(opts = {}) {
    if (!drag) return;

    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);

    cancelAnimationFrame(drag.raf);

    try { drag.ghost && drag.ghost.remove(); } catch {}
    try {
      if (drag.ph && drag.ph.isConnected) drag.ph.replaceWith(drag.row);
    } catch {}

    try { drag.row.style.display = drag.prevDisplay || ''; } catch {}

    document.body.classList.remove('tm-sort-noselect');

    if (drag.moved) suppressClickUntil = now() + 400;
    if (!opts.cancel) saveOrder(drag.container);

    drag = null;
  }

  function startDrag(e, row, handle) {
    if (drag) return;
    if (!row || !document.contains(row)) return;

    if (e.pointerType === 'mouse' && e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    const container = row.parentElement;
    if (!container) return;

    const scrollEl =
      row.closest('.overflow-y-auto') ||
      container.closest?.('.overflow-y-auto') ||
      null;

    const rect = row.getBoundingClientRect();

    const ph = document.createElement('div');
    ph.className = 'tm-placeholder';
    ph.style.height = `${rect.height}px`;
    row.before(ph);

    const prevDisplay = row.style.display;
    row.style.display = 'none';

    const ghost = row.cloneNode(true);
    ghost.classList.add('tm-ghost');
    ghost.style.left = `${rect.left}px`;
    ghost.style.top = `${rect.top}px`;
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.boxSizing = 'border-box';
    document.body.appendChild(ghost);

    document.body.classList.add('tm-sort-noselect');

    let edge = 60;
    let maxSpeed = 16;
    if (scrollEl) {
      const r = scrollEl.getBoundingClientRect();
      edge = Math.max(50, Math.min(100, r.height * 0.25));
      maxSpeed = Math.max(10, Math.min(24, r.height * 0.06));
    }

    drag = {
      row,
      handle,
      container,
      scrollEl,
      ph,
      ghost,
      prevDisplay,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      offX: e.clientX - rect.left,
      offY: e.clientY - rect.top,
      baseLeft: rect.left,
      baseTop: rect.top,
      edge,
      maxSpeed,
      moved: false,
      pointerId: e.pointerId,
      raf: 0
    };

    try { handle.setPointerCapture(e.pointerId); } catch {}

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp, { passive: false });
    window.addEventListener('pointercancel', onPointerUp, { passive: false });

    drag.raf = requestAnimationFrame(frame);
  }

  function onPointerMove(e) {
    if (!drag) return;
    if (e.pointerId !== drag.pointerId) return;

    e.preventDefault();

    drag.lastX = e.clientX;
    drag.lastY = e.clientY;

    if (!drag.moved) {
      const dx = drag.lastX - drag.startX;
      const dy = drag.lastY - drag.startY;
      if (Math.hypot(dx, dy) > 6) drag.moved = true;
    }
  }

  function onPointerUp(e) {
    if (!drag) return;
    if (e.pointerId !== drag.pointerId) return;
    finishDrag();
  }

  function frame() {
    if (!drag) return;

    if (!document.contains(drag.container) || !document.contains(drag.ph)) {
      finishDrag({ cancel: true });
      return;
    }

    const targetLeft = drag.lastX - drag.offX;
    const targetTop = drag.lastY - drag.offY;
    const dx = targetLeft - drag.baseLeft;
    const dy = targetTop - drag.baseTop;

    drag.ghost.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;

    if (drag.scrollEl) {
      const r = drag.scrollEl.getBoundingClientRect();
      const edge = drag.edge;
      let v = 0;

      if (drag.lastY < r.top + edge) {
        const t = (r.top + edge - drag.lastY) / edge;
        v = -drag.maxSpeed * Math.min(1, t);
      } else if (drag.lastY > r.bottom - edge) {
        const t = (drag.lastY - (r.bottom - edge)) / edge;
        v = drag.maxSpeed * Math.min(1, t);
      }

      if (v) drag.scrollEl.scrollTop += v;
    }

    repositionPlaceholder(drag.lastY);
    drag.raf = requestAnimationFrame(frame);
  }

  document.addEventListener('click', (e) => {
    if (now() < suppressClickUntil) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }, true);

  injectCss();
  scan(document);
  watchBody();
})();
