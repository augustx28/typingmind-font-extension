/* ============================================================================
   ChatGPT Dark Theme for TypingMind
   Inspired by the official ChatGPT desktop app dark palette
   Author: YOUR_NAME
   ============================================================================ */

/**
 * Hex reference (ChatGPT v1.2024 dark palette)
 * ─────────────────────────────────────────────
 * Sidebar ………………… #202123
 * Main BG ……………… #343541
 * User bubble ……… #40414F
 * Assistant bubble… #444654
 * Border ………………… #565869
 * Text (primary) … #ECECF1
 * Accent ………………… #10A37F
 */

(function registerChatGPTDarkTheme() {
  const STYLE_ID = 'tm-chatgpt-dark-theme-style';

  if (document.getElementById(STYLE_ID)) return; // avoid double-inject

  const css = `
    :root {
      /* Core */
      --tm-bg-body:          #343541;
      --tm-bg-content:       #343541;
      --tm-bg-sidebar:       #202123;
      --tm-bg-card-user:     #40414F;
      --tm-bg-card-assistant:#444654;
      --tm-text-primary:     #ECECF1;
      --tm-text-secondary:   rgba(236,236,241,.65);
      --tm-border-color:     #565869;
      --tm-accent:           #10A37F;
      --tm-radius:           8px;
    }

    /* Page & typography */
    html, body {
      background-color: var(--tm-bg-body) !important;
      color: var(--tm-text-primary);
    }

    /* Sidebar */
    .typingmind-sidebar {
      background-color: var(--tm-bg-sidebar) !important;
      color: var(--tm-text-primary);
    }
    .typingmind-sidebar .sidebar-item,
    .typingmind-sidebar .new-chat-button {
      background: transparent;
      color: var(--tm-text-primary);
      border-radius: var(--tm-radius);
    }
    .typingmind-sidebar .sidebar-item:hover,
    .typingmind-sidebar .new-chat-button:hover {
      background: rgba(255,255,255,.05);
    }

    /* Message bubbles */
    .chat-message.user,
    .chat-message.role-user {
      background-color: var(--tm-bg-card-user) !important;
      color: var(--tm-text-primary);
      border: 1px solid transparent;
      border-radius: var(--tm-radius);
    }
    .chat-message.assistant,
    .chat-message.role-assistant {
      background-color: var(--tm-bg-card-assistant) !important;
      color: var(--tm-text-primary);
      border: 1px solid transparent;
      border-radius: var(--tm-radius);
    }

    /* Code blocks */
    .chat-message pre,
    .chat-message code {
      background-color: #202123 !important;
      color
