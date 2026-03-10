document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: getPageHeaders,
      },
      (results) => {
        const container = document.getElementById("header-container");
        container.innerHTML = ""; // Clear loading status

        if (!results || !results[0] || results[0].result.length === 0) {
          container.innerHTML = '<p class="status">No headers found.</p>';
          return;
        }

        const headers = results[0].result;

        headers.forEach((header, index) => {
          const div = document.createElement("div");
          div.textContent = header.text;
          div.className = `header-item ${header.tagName}`;
          
          // Click listener to scroll the actual page
          div.addEventListener("click", () => {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: (idx) => {
                const elements = document.querySelectorAll("h1, h2, h3, h4");
                if (elements[idx]) {
                  elements[idx].scrollIntoView({ behavior: "smooth", block: "start" });
                }
              },
              args: [index],
            });
          });

          container.appendChild(div);
        });
      }
    );
  });
});

// This function runs INSIDE the web page
function getPageHeaders() {
  // Grab h1-h4 tags
  const headers = Array.from(document.querySelectorAll("h1, h2, h3, h4"));
  return headers.map((h) => ({
    tagName: h.tagName.toLowerCase(),
    text: h.innerText.trim(),
  })).filter(h => h.text.length > 0); // Remove empty headers
}
