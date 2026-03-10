(function () {
  const STYLE_ID = "bold-outline-style";
  const BTN_ID = "bold-outline-btn";
  const PANEL_ID = "bold-outline-panel";

  // Inject styles once
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap');

      #${BTN_ID} {
        position: fixed;
        bottom: 80px;
        right: 20px;
        z-index: 99999;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: #2a2a2a;
        color: #fff;
        border: 1px solid #444;
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.4);
        transition: background 0.2s;
      }
      #${BTN_ID}:hover { background: #444; }

      #${PANEL_ID} {
        position: fixed;
        bottom: 140px;
        right: 20px;
        z-index: 99999;
        width: 300px;
        max-height: 60vh;
        overflow-y: auto;
        background: #1e1e1e;
        border: 1px solid #333;
        border-radius: 10px;
        padding: 12px 14px;
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        color: #fff;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        display: none;
      }
      #${PANEL_ID}.visible { display: block; }

      #${PANEL_ID} .outline-title {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #888;
        margin-bottom: 10px;
        padding-bottom: 6px;
        border-bottom: 1px solid #333;
      }

      #${PANEL_ID} .outline-item {
        padding: 7px 8px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 13px;
        line-height: 1.4;
        transition: background 0.15s;
        margin-bottom: 2px;
      }
      #${PANEL_ID} .outline-item:hover { background: #333; }

      #${PANEL_ID} .ol-h1 { margin-left: 0; font-size: 14px; }
      #${PANEL_ID} .ol-h2 { margin-left: 14px; color: #ddd; }
      #${PANEL_ID} .ol-h3 { margin-left: 28px; color: #bbb; }
      #${PANEL_ID} .ol-h4 { margin-left: 42px; color: #999; font-size: 12px; }

      #${PANEL_ID} .outline-empty {
        color: #666;
        font-size: 12px;
        text-align: center;
        padding: 20px 0;
      }

      /* Mobile tweaks */
      @media (max-width: 600px) {
        #${PANEL_ID} {
          width: calc(100vw - 40px);
          right: 20px;
          bottom: 130px;
          max-height: 50vh;
        }
        #${BTN_ID} {
          bottom: 75px;
          right: 14px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Create floating button
  let btn = document.getElementById(BTN_ID);
  if (!btn) {
    btn = document.createElement("button");
    btn.id = BTN_ID;
    btn.textContent = "☰";
    btn.title = "Bold Outline";
    document.body.appendChild(btn);
  }

  // Create panel
  let panel = document.getElementById(PANEL_ID);
  if (!panel) {
    panel = document.createElement("div");
    panel.id = PANEL_ID;
    document.body.appendChild(panel);
  }

  // Toggle panel on click
  btn.addEventListener("click", () => {
    const isVisible = panel.classList.contains("visible");
    if (isVisible) {
      panel.classList.remove("visible");
    } else {
      populateOutline();
      panel.classList.add("visible");
    }
  });

  // Close panel when clicking outside
  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && e.target !== btn) {
      panel.classList.remove("visible");
    }
  });

  function populateOutline() {
    panel.innerHTML = '<div class="outline-title">Page Outline</div>';

    // Target the main chat/content area, skip nav/sidebar
    const chatArea =
      document.querySelector('[data-element-id="chat-space-middle-part"]') ||
      document.querySelector("main") ||
      document.querySelector('[role="main"]') ||
      document.body;

    const headers = chatArea.querySelectorAll("h1, h2, h3, h4");

    // Filter: only headers that are visible and have text
    const validHeaders = Array.from(headers).filter((h) => {
      const text = h.innerText.trim();
      if (!text) return false;
      if (h.offsetParent === null) return false; // hidden elements
      return true;
    });

    if (validHeaders.length === 0) {
      panel.innerHTML +=
        '<div class="outline-empty">No headers found in this chat.</div>';
      return;
    }

    validHeaders.forEach((h) => {
      const div = document.createElement("div");
      div.className = `outline-item ol-${h.tagName.toLowerCase()}`;
      div.textContent = h.innerText.trim();
      div.addEventListener("click", () => {
        h.scrollIntoView({ behavior: "smooth", block: "start" });
        panel.classList.remove("visible");
      });
      panel.appendChild(div);
    });
  }
})();
