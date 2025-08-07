(function () {
  const STYLE_ID = 'tmx-css-injector-w-2025-08-07';

  function injectCSS() {
    if (document.getElementById(STYLE_ID)) {
      // Already injected
      return;
    }

    const css = String.raw`
/* BackUnknown blur */
.md\:pl-\[--current-sidebar-width\] .flex-col .backdrop-blur-md{
  min-height:0px;
  height:40px;
}

/* Transition all */
.md\:pl-\[--current-sidebar-width\] .overflow-y-auto:nth-child(1) .\@container .flex-col:nth-child(1) > .transition-all:nth-child(3){
  transform:translatex(0px) translatey(0px);
  height:155px;
}

/* Flex */
.transition-all:nth-child(1) > .flex:nth-child(2){
  height:36px;
}

/* BackUnknown blur */
#nav-handler .flex-col .backdrop-blur-md{
  min-height:36px;
  height:36px;
}
    `;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.type = 'text/css';
    style.setAttribute('data-origin', 'TypingMind Extension: W UI Tweaks');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // Optional: debug log
    // console.info('[TypingMind CSS Extension] Styles injected');
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  onReady(injectCSS);
})();
