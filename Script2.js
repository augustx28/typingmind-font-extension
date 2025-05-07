/* --- At the top with other constants --- */
const NEW_BTN_ID = "workspace-tab-new-feature"; // Choose a unique ID

/* --- New function to add your second button --- */
function addNewFeatureButton() {
  if (document.getElementById(NEW_BTN_ID)) return;

  const bar = document.querySelector('div[data-element-id="workspace-bar"]');
  if (!bar) return;

  // You might want to place it next to the original font button,
  // or find another reference button.
  const refBtn = document.getElementById(BTN_ID) || bar.querySelector('button[data-element-id="workspace-tab-settings"]');
  if (!refBtn) return;

  const newBtn = document.createElement("button");
  newBtn.id = NEW_BTN_ID;
  newBtn.dataset.elementId = NEW_BTN_ID; // Important for TypingMind's system
  newBtn.className = refBtn.className; // Reuse existing button classes for styling
  newBtn.title = "New Feature Title"; // Tooltip for the button

  newBtn.innerHTML = `
    <span class="${refBtn.querySelector("span")?.className || ""}">
      <div class="${refBtn.querySelector("div")?.className || ""}">
        <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <!-- Replace with your desired SVG icon path -->
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      </div>
      <span class="font-normal self-stretch text-center text-xs leading-4 md:leading-none">New Action</span>
    </span>
  `;

  newBtn.onclick = (e) => {
    e.preventDefault();
    // --- DEFINE THE ACTION FOR YOUR NEW BUTTON HERE ---
    console.log("New Feature Button Clicked!");
    // For example, you could toggle a new modal, run a specific function, etc.
    // window.YourNewModal.toggle(); or yourCustomFunction();
    // --- END OF NEW BUTTON ACTION ---
  };

  // Insert the new button. You might want to insert it after the font button,
  // or before/after another specific element.
  if (document.getElementById(BTN_ID)) {
    refBtn.parentNode.insertBefore(newBtn, refBtn.nextSibling); // Places it after the font button if font button exists
  } else {
    bar.insertBefore(newBtn, refBtn); // Fallback to placing before settings if font button isn't there (shouldn't happen if init order is correct)
  }
}

/* --- Modify the init function and MutationObserver --- */
function init() {
  buildModal();     // Existing
  applyFont();      // Existing
  addMenuButton();  // Existing
  addNewFeatureButton(); // **Call to add your new button**
}

// ... inside your MutationObserver callback ...
// obs.observe(document.body, { childList: true, subtree: true });
// The MutationObserver should ideally call a function that tries to add all buttons
// if their respective bars are loaded.
// For simplicity, if addMenuButton is already being robustly called by it,
// you can add addNewFeatureButton there too.

// A more robust MutationObserver might look like:
const obs = new MutationObserver(() => {
    addMenuButton();
    addNewFeatureButton(); // Call your new button function here as well
});
obs.observe(document.body, { childList: true, subtree: true });

