/*  TypingMind Custom-Font Extension
    Douglas Crockford (impersonated 😉) – v1.1.2 | Shift+Alt+F opens the panel
    MIT-licensed, zero tracking, zero external code execution
*/
(function () {
  "use strict";

  /* ---------- localStorage keys ---------- */
  const KEY = { url: "tm_font_url", family: "tm_font_family", size: "tm_font_size" };
  const STYLE_ID = "tm-font-style";
  const MODAL_ID = "tm-font-modal";

  /* ---------- helpers ---------- */
  const clean = (v) => (typeof v === "string" ? v.trim().replace(/^['"]|['"]$/g, "") : "");
  const save = (k, v) => { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); applyFont(); };
  const get  = (k) => clean(localStorage.getItem(k) || "");

  /* ---------- font injector ---------- */
  function applyFont() {
    const url = get(KEY.url), fam = get(KEY.family), size = get(KEY.size);
    let css = "";
    const urlMatch = url.match(/href=['"]([^'"]+)['"]/);
    const cleanUrl = urlMatch ? urlMatch[1] : url;
    if (cleanUrl) css += `@import url('${cleanUrl}');\n`;
    if (fam || size) {
      css += `
html, body, button, input, select, textarea, div, span, p, h1, h2, h3, h4, h5, h6, a,
[data-element-id="chat-space-middle-part"],
[data-element-id="chat-space-middle-part"] *,
.prose, .prose-sm, .text-sm,
#chat-container, #chat-container * {
  ${fam ? `font-family:${fam.includes(" ")?`'${fam}'`:fam}!important;` : ""}
  ${size? `font-size:${parseInt(size,10)}px!important;`: ""}
}`;
    }
    let tag=document.getElementById(STYLE_ID);
    if(!tag){tag=document.createElement("style");tag.id=STYLE_ID;document.head.appendChild(tag);}
    if(tag.textContent!==css) tag.textContent=css;
  }

  /* ---------- modal UI ---------- */
  function buildModal() { /* unchanged body ... */ /* [omitted for brevity] */ }

  /* ---------- add menu button ---------- */
  function addMenuButton() {
    if (document.getElementById("tm-font-menu-button")) return;
    const workspaceBar=document.querySelector('[data-element-id="workspace-bar"]');
    if(!workspaceBar) return;
    const settingsButton=workspaceBar.querySelector('[data-element-id="workspace-tab-settings"]');
    if(!settingsButton) return;

    const fontButton=document.createElement("button");
    fontButton.id="tm-font-menu-button";
    fontButton.title="Custom Font Settings (Shift+Alt+F)";
    fontButton.className=settingsButton.className;   // reuse styling

    /* --------- NEW, robust markup --------- */
    const iconSvg=`
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 20h3"/>
        <path d="M14 20h7"/>
        <path d="M6.9 15h6.9"/>
        <path d="M10.2 6.3l5.8 13.7"/>
        <path d="M5 20l6-16h2l7 16"/>
      </svg>`;
    fontButton.innerHTML=`
      <span class="flex flex-col items-center gap-1">
        <span class="relative">
          <div class="relative w-6 h-6 flex items-center justify-center">
            ${iconSvg}
          </div>
        </span>
        <span class="text-[11px] leading-none">Font</span>
      </span>`;

    if(settingsButton.parentNode) settingsButton.parentNode.insertBefore(fontButton,settingsButton);
    fontButton.addEventListener("click",()=>window.TMFontModal.toggle());
  }

  /* ---------- hotkey & observers ---------- */
  document.addEventListener("keydown",(e)=>{
    const mac=/Mac/i.test(navigator.platform), modOk=mac?e.metaKey:e.altKey;
    if(modOk&&e.shiftKey&&e.key.toUpperCase()==="F"){e.preventDefault();window.TMFontModal.toggle();}
  });
  new MutationObserver(addMenuButton).observe(document.body,{childList:true,subtree:true});

  /* ---------- init ---------- */
  const boot=()=>{buildModal();addMenuButton();applyFont();};
  /complete|interactive/.test(document.readyState)?boot():document.addEventListener("DOMContentLoaded",boot);
  console.log("%cTypingMind Font Extension loaded – Shift+Alt+F / ⌘⇧F","color:#42b983;font-weight:bold");
})();
