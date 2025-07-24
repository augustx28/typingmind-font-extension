// == TypingMind Highlight Saver ==
// Runs in the context of every TypingMind page.
(() => {
  const HL_CLASS = 'tm-persistent-highlight';
  const HL_COLOR = '#FFD54A'; // yellow-orange
  const STORAGE_KEY = `tm.highlights.${location.pathname}`;

  /* ---------- Utilities ---------- */
  const uuid = () => crypto.randomUUID();

  function loadHighlights() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }

  function saveHighlights(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  /* ---------- Apply saved highlights on load ---------- */
  function restore() {
    const saved = loadHighlights();
    saved.forEach(h => {
      const range = locateRange(h);
      if (range) wrapRange(range, h.id);
    });
  }

  /* Convert stored position data back to a Range object */
  function locateRange({ path, start, end }) {
    const node = resolvePath(path);
    if (!node || !node.nodeType === Node.TEXT_NODE) return null;
    const range = document.createRange();
    range.setStart(node, start);
    range.setEnd(node, end);
    return range;
  }

  /* XPath-like array path to reach a text node */
  function getPath(node) {
    const path = [];
    let n = node;
    while (n && n !== document.body) {
      const parent = n.parentNode;
      if (!parent) break;
      path.unshift(Array.prototype.indexOf.call(parent.childNodes, n));
      n = parent;
    }
    return path;
  }
  function resolvePath(pathArr) {
    let n = document.body;
    for (const idx of pathArr) n = n.childNodes[idx];
    return n;
  }

  /* ---------- Highlight creation ---------- */
  function wrapRange(range, id = uuid()) {
    const span = document.createElement('span');
    span.className = HL_CLASS;
    span.dataset.hlId = id;
    span.style.background = HL_COLOR;
    range.surroundContents(span);
    return span;
  }

  function createFromSelection() {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      const textNode = range.startContainer;
      if (textNode.nodeType !== Node.TEXT_NODE) return; // simple guard

      const id = uuid();
      wrapRange(range, id);

      const record = {
        id,
        path: getPath(textNode),
        start: range.startOffset,
        end: range.endOffset
      };
      const all = loadHighlights();
      all.push(record);
      saveHighlights(all);

      sel.removeAllRanges(); // optional UX cleanup
    }
  }

  /* ---------- Deletion ---------- */
  function deleteHighlight(span) {
    const id = span.dataset.hlId;
    // unwrap span
    const parent = span.parentNode;
    parent.replaceChild(document.createTextNode(span.textContent), span);
    parent.normalize();

    // remove from storage
    const all = loadHighlights().filter(h => h.id !== id);
    saveHighlights(all);
  }

  /* ---------- Event listeners ---------- */
  document.addEventListener('mouseup', () => {
    // small timeout to allow double-click selections to stabilize
    setTimeout(createFromSelection, 10);
  });

  document.addEventListener('click', e => {
    const span = e.target.closest(`.${HL_CLASS}`);
    if (!span) return;
    if (confirm('Delete highlight?')) deleteHighlight(span);
  });

  /* ---------- First run ---------- */
  restore();
})();
