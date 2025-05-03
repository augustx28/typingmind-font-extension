// File: extensions/chatgpt-dark-theme/index.js
// ChatGPT Dark-Gray Theme for TypingMind
(() => {
  /* ============================================================
     COLOR CONSTANTS (exact values from ChatGPT web app)
  ============================================================ */
  const COLORS = {
    BG_PRIMARY   : '#202123',              // conversation background
    BG_SECONDARY : '#343541',              // sidebar background
    BG_TERTIARY  : '#40414f',              // cards / bubbles
    TEXT_PRIMARY : '#ECECF1',
    TEXT_SECOND  : '#A3A3B2',
    ACCENT       : '#10A37F',
    ACCENT_SOFT  : 'rgba(16,163,127,.15)',
    BORDER_LIGHT : '#33353F',
    BORDER_DARK  : '#2F3037'
  };

  /* ============================================================
     REGISTER THE THEME WITH TYPINGMIND
  ============================================================ */
  const register = (host = window.typingmind || window.TypingMind) => {
    if (!host?.extension?.registerTheme) {
      console.error('[ChatGPT-Dark Theme] Theme API not found.');
      return;
    }

    host.extension.registerTheme({
      /* mandatory */
      id   : 'chatgpt-dark',
      name : 'ChatGPT Dark Gray',
      description: 'Perfect replica of ChatGPT dark color scheme',

      /* color palette */
      colors: {
        backgroundPrimary   : COLORS.BG_PRIMARY,
        backgroundSecondary : COLORS.BG_SECONDARY,
        backgroundTertiary  : COLORS.BG_TERTIARY,
        textPrimary         : COLORS.TEXT_PRIMARY,
        textSecondary       : COLORS.TEXT_SECOND,
        accent              : COLORS.ACCENT,
        accentSoft          : COLORS.ACCENT_SOFT,
        borderLight         : COLORS.BORDER_LIGHT,
        borderDark          : COLORS.BORDER_DARK
      },

      /* do NOT change fonts */
      typography: {},

      /* optional raw CSS for fine-tuning */
      css: `
        /* Root backgrounds */
        body,
        .tm-body {
          background-color: ${COLORS.BG_PRIMARY} !important;
          color: ${COLORS.TEXT_PRIMARY} !important;
        }

        /* Sidebar */
        .tm-sidebar {
          background-color: ${COLORS.BG_SECONDARY} !important;
          border-right: 1px solid ${COLORS.BORDER_DARK};
        }

        /* Chat bubbles */
        .tm-message--user      { background: #2E2F35; }
        .tm-message--assistant { background: ${COLORS.BG_TERTIARY}; }

        /* Scrollbar styling */
        ::-webkit-scrollbar       { width: 8px; }
        ::-webkit-scrollbar-thumb { background-color: #5E5F6E; border-radius: 4px; }
      `
    });
  };

  /* ============================================================
     WAIT FOR TypingMind IF IT ISN'T READY YET
  ============================================================ */
  if (document.readyState === 'complete') {
    register();
  } else {
    window.addEventListener('DOMContentLoaded', register);
  }
})();
