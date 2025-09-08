// typingmind-custom-colors.js
(function () {
  const STYLE_ID = 'tmx-w-custom-colors-2025-09-08';

  // Minimal CSS.escape fallback
  const esc = (s) => (typeof CSS !== 'undefined' && CSS.escape)
    ? CSS.escape(s)
    : String(s).replace(/[^a-zA-Z0-9_-]/g, (ch) => '\\' + ch);

  // Build selectors from the classes you specified (with corrected variables)
  const s1 = '.' + esc('h-[var(--workspace-height)]') + '.' + esc('sm:block') + '.' + esc('md:flex-col');
  const s2 = '.' + esc('md:max-w-[calc(var(--sidebar-width)-var(--workspace-width))]') + ' div ' + '.' + esc('h-6');
  const s3 = '.' + esc('transition') + ' ' + '.' + esc('flex-col') + ' ' + '.' + esc('md:pl-[--workspace-width]');

  const css = `
${s1} { color: #191919 !important; }
${s2} { color: #DA9010 !important; }
${s2} svg, ${s2} svg *, ${s2} [role="img"] { fill: currentColor !important; stroke: currentColor !important; }
${s3} { color: #191919 !important; }
  `.trim();

  function inject() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
    console.info('TypingMind extension: custom colors injected', { selectors: { s1, s2, s3 }, styleId: STYLE_ID });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
