// Add near preferences
const PREFER_PLUGIN_KEY = '1stop-web-search-prefer-plugins';
const getPreferPlugins = () => { try { return localStorage.getItem(PREFER_PLUGIN_KEY) === '1'; } catch { return false; } };
const setPreferPlugins = v => { try { localStorage.setItem(PREFER_PLUGIN_KEY, v ? '1' : '0'); } catch {} };

// Add helper
const SEARCH_PLUGIN_PATTERNS = [/tavily/i, /serp/i, /perplex/i, /google.*search/i, /web[_-]?search/i];
function hasExternalSearchPlugin(tools){
  if (!Array.isArray(tools)) return false;
  return tools.some(t => t && (
    (t.type === 'function' && t.function?.name && SEARCH_PLUGIN_PATTERNS.some(rx => rx.test(t.function.name))) ||
    (t.name && t.type !== 'web_search' && SEARCH_PLUGIN_PATTERNS.some(rx => rx.test(String(t.name))))
  ));
}

// In ensureWebTool(), change:
let shouldInclude = enabledByUser && isValidEffort;  // was const
// Detect plugins and optionally skip native tool
const pluginPresent = hasExternalSearchPlugin(payload.tools);
if (getPreferPlugins() && pluginPresent) {
  if (hasWebSearch) { payload.tools.splice(webSearchIndex, 1); return { payload, modified: true }; }
  return { payload, modified: false };
}
// After the context-size <select> in ensureWebSearchSettingsSection()
const preferRow = document.createElement('label');
preferRow.className = 'mt-2 flex items-center gap-x-2 text-sm';
preferRow.innerHTML = '<input type="checkbox" class="h-4 w-4"> Prefer plugins for web search when available';
wrap.appendChild(preferRow);
const preferInput = preferRow.querySelector('input');
preferInput.checked = getPreferPlugins();
preferInput.addEventListener('change', () => setPreferPlugins(preferInput.checked));
reset.addEventListener('click', () => { setPreferPlugins(false); preferInput.checked = false; });
