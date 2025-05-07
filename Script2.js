/* ─────────────  EXTRA BUTTON (non-destructive) ───────────── */
(function () {
  "use strict";

  /* unique ID so we never create it twice */
  const CUSTOM_BTN_ID = "workspace-tab-mybutton";

  /* optional: your custom action */
  function doSomething() {
    alert("Hello from my new button!");
    // …or run any code you need
  }

  /* clones the look of TypingMind’s buttons and inserts ours */
  function addCustomButton() {
    if (document.getElementById(CUSTOM_BTN_ID)) return;          // already added

    const bar    = document.querySelector('div[data-element-id="workspace-bar"]');
    if (!bar) return;                                            // bar not ready yet

    const refBtn = bar.querySelector('button[data-element-id="workspace-tab-settings"]');
    if (!refBtn) return;                                         // reference button missing

    /* build our button */
    const btn            = document.createElement("button");
    btn.id               = CUSTOM_BTN_ID;
    btn.dataset.elementId = CUSTOM_BTN_ID;
    btn.className        = refBtn.className;                     // copy all Tailwind classes
    btn.title            = "My custom action";                   // tooltip

    /* Inner markup copies TypingMind’s internal structure */
    btn.innerHTML = `
      <span class="${refBtn.querySelector("span")?.className || ""}">
        <div class="${refBtn.querySelector("div")?.className || ""}">
          <!--   ICON: Material “bolt”  -->
          <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 21h-1l1-7H5l4-11h1l-1 7h6l-4 11z"/>
          </svg>
        </div>
        <span class="font-normal self-stretch text-center text-xs leading-4 md:leading-none">
          My Btn
        </span>
      </span>
    `;

    btn.onclick = (e) => { e.preventDefault(); doSomething(); };

    /* put it just before the Settings button */
    bar.insertBefore(btn, refBtn);
  }

  /* run once now … */
  addCustomButton();

  /* …and keep trying if the workspace bar appears later */
  const obs = new MutationObserver(addCustomButton);
  obs.observe(document.body, { childList: true, subtree: true });

  console.log("%cTypingMind Extra-Button – loaded", "color:#42b983");
})();
