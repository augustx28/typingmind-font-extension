function stopHoverOnTenthResponse() {
  const el = document.querySelector(
    '#nav-handler .transition-all .overflow-y-auto .\\@container .flex-col .custom-scrollbar .dynamic-chat-content-container .rounded-lg div .items-stretch .h-full .sm\\:outline div .response-block:nth-child(10)'
  );
  if (!el) return;

  // Lock current background
  const currentBg = window.getComputedStyle(el).backgroundColor;
  el.style.backgroundColor = currentBg;
  el.style.transition = 'none';

  // Kill any hover effect by overriding inline
  el.addEventListener('mouseenter', () => {
    el.style.backgroundColor = currentBg;
  });
  el.addEventListener('mouseleave', () => {
    el.style.backgroundColor = currentBg;
  });
}

// Run initially and on DOM changes
stopHoverOnTenthResponse();
const observer = new MutationObserver(stopHoverOnTenthResponse);
observer.observe(document.body, { childList: true, subtree: true });
