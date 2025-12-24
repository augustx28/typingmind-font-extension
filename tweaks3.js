if (!tweaksButton && settingsButton) {
  // Fixed: ensure reference is always a button, not a div
  const referenceButtonForStyle = settingsButton || 
    workspaceBar.querySelector('button[data-element-id="workspace-tab-cloudsync"]') || 
    workspaceBar.querySelector('button[data-element-id="workspace-profile-button"]') ||
    workspaceBar.querySelector('button');

  if (!referenceButtonForStyle) return;

  tweaksButton = document.createElement("button");
  tweaksButton.id = "workspace-tab-tweaks";
  tweaksButton.title = "Open UI Tweaks (Shift+Alt+T or Shift+Cmd+T)";
  tweaksButton.dataset.elementId = "workspace-tab-tweaks";
  tweaksButton.className = referenceButtonForStyle.className;
  const outerSpan = document.createElement("span");
  const refOuterSpan = referenceButtonForStyle.querySelector(":scope > span");
  outerSpan.className = refOuterSpan ? refOuterSpan.className : "flex flex-col items-center justify-center h-full";
  const iconDiv = document.createElement("div");
  const refIconDiv = referenceButtonForStyle.querySelector(":scope > span > div:first-child");
  iconDiv.className = refIconDiv ? refIconDiv.className : "relative flex items-center justify-center";
  const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgIcon.setAttribute("class", "w-5 h-5 flex-shrink-0");
  svgIcon.setAttribute("viewBox", "0 0 24 24");
  svgIcon.setAttribute("fill", "currentColor");
  svgIcon.style.color = getSetting(settingsKeys.workspaceIconColor, defaultWorkspaceIconColorVisual);
  const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svgPath.setAttribute("d", "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4c-.83 0-1.5-.67-1.5-1.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z");
  svgIcon.appendChild(svgPath);
  iconDiv.appendChild(svgIcon);
  const textSpan = document.createElement("span");
  const refTextSpan = referenceButtonForStyle.querySelector(":scope > span > span:last-child");
  textSpan.className = refTextSpan ? refTextSpan.className : "font-normal self-stretch text-center text-xs leading-4 md:leading-none";
  textSpan.textContent = "Tweaks";
  outerSpan.append(iconDiv, textSpan);
  tweaksButton.appendChild(outerSpan);
  tweaksButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleModal(true);
  });

  // Fixed: Handle wrapper structure for proper alignment
  const settingsButtonParent = settingsButton.parentElement;
  if (settingsButtonParent && 
      settingsButtonParent !== workspaceBar && 
      settingsButtonParent.tagName === 'DIV' &&
      !settingsButtonParent.hasAttribute('data-element-id')) {
    // Button has a wrapper div, create matching wrapper for Tweaks
    const tweaksWrapper = document.createElement('div');
    tweaksWrapper.className = settingsButtonParent.className;
    tweaksWrapper.appendChild(tweaksButton);
    settingsButtonParent.parentElement.insertBefore(tweaksWrapper, settingsButtonParent);
  } else {
    // No wrapper, insert directly
    settingsButton.parentNode.insertBefore(tweaksButton, settingsButton);
  }
  tweaksButton.style.display = "inline-flex";
}
