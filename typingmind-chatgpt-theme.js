{
  "manifest_version": 1,
  "name": "ChatGPT Dark Theme for TypingMind",
  "version": "1.1.0",
  "description": "Applies a ChatGPT-style dark gray theme to the TypingMind UI. (Updated)",
  "author": "AI Assistant & Your Name",
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "css": ["style.css"]
    }
  ]
}
/* ChatGPT Dark Theme for TypingMind - style.css */
/* Version 1.1.0 */

/* === Color Palette (Based on common ChatGPT dark theme observations) === */
:root {
  --chatgpt-dark-bg-primary: #202123;      /* Deepest gray, main background */
  --chatgpt-dark-bg-secondary: #343541;    /* Slightly lighter, messages/inputs */
  --chatgpt-dark-bg-sidebar: #2A2B32;      /* Sidebar background */
  --chatgpt-dark-bg-hover: #40414F;        /* Hover states */
  --chatgpt-dark-text-primary: #ECECF1;    /* Primary text (off-white) */
  --chatgpt-dark-text-secondary: #A9A9A9;   /* Secondary text, icons */
  --chatgpt-dark-border: #565869;         /* Borders */
  --chatgpt-dark-input-bg: #40414F;       /* Input field background */
}

/* === Base Overrides === */
body, html {
  background-color: var(--chatgpt-dark-bg-primary) !important;
  color: var(--chatgpt-dark-text-primary) !important;
}

/* === Sidebar Styling === */
/* !! Adjust selectors like .sidebar, .nav-item based on TypingMind !! */
.sidebar, #sidebar, .left-navigation, .conversations-list {
  background-color: var(--chatgpt-dark-bg-sidebar) !important;
  border-right: 1px solid var(--chatgpt-dark-border) !important;
  color: var(--chatgpt-dark-text-secondary) !important;
}

.sidebar a, .nav-item, .conversation-item a, .sidebar button {
  color: var(--chatgpt-dark-text-secondary) !important;
  border: none !important;
  background-color: transparent !important;
}

.sidebar a:hover, .nav-item:hover, .conversation-item a:hover, .sidebar button:hover,
.sidebar .active, .nav-item.active, .conversation-item.active a {
  background-color: var(--chatgpt-dark-bg-hover) !important;
  color: var(--chatgpt-dark-text-primary) !important;
  border-radius: 6px; /* Subtle rounding */
}

/* Ensure icons match text color */
.sidebar svg, .nav-item svg, .conversation-item svg {
   fill: currentColor !important; /* Or stroke, depending on the icon type */
   color: currentColor !important;
}


/* === Main Chat Area === */
/* !! Adjust selectors like .chat-container, .main-view !! */
.chat-container, .main-view, #chat-history {
  background-color: var(--chatgpt-dark-bg-primary) !important;
}

/* === Message Bubbles === */
/* !! Adjust selectors like .message, .user-message, .ai-message !! */
.message, .chat-bubble, .message-row {
  background-color: var(--chatgpt-dark-bg-primary) !important; /* Match main background */
  color: var(--chatgpt-dark-text-primary) !important;
  border: none !important; /* Remove borders if any */
  margin-bottom: 15px !important; /* Adjust spacing */
}

/* Optional: Slightly different background for user/AI messages if desired */
.message.user-message {
  /* background-color: var(--chatgpt-dark-bg-secondary) !important; */ /* Example */
}
.message.ai-message {
   /* background-color: var(--chatgpt-dark-bg-secondary) !important; */ /* Example */
}

/* Make code blocks consistent */
pre, code, .code-block {
  background-color: var(--chatgpt-dark-bg-secondary) !important;
  color: var(--chatgpt-dark-text-primary) !important;
  border: 1px solid var(--chatgpt-dark-border) !important;
  border-radius: 4px !important;
}

/* === Input Area === */
/* !! Adjust selectors like .input-area, #message-input !! */
.input-area, .composer, #prompt-textarea-container {
  background-color: var(--chatgpt-dark-bg-primary) !important;
  border-top: 1px solid var(--chatgpt-dark-border) !important;
}

textarea, .prompt-textarea, #message-input {
  background-color: var(--chatgpt-dark-input-bg) !important;
  color: var(--chatgpt-dark-text-primary) !important;
  border: 1px solid var(--chatgpt-dark-border) !important;
  border-radius: 8px !important;
  box-shadow: none !important;
}

textarea::placeholder, .prompt-textarea::placeholder {
  color: var(--chatgpt-dark-text-secondary) !important;
  opacity: 0.8;
}

/* === Buttons === */
/* !! Adjust button selectors if needed !! */
button, .btn, input[type="submit"] {
  background-color: var(--chatgpt-dark-input-bg) !important;
  color: var(--chatgpt-dark-text-primary) !important;
  border: 1px solid var(--chatgpt-dark-border) !important;
  border-radius: 6px !important;
  padding: 8px 16px !important;
  transition: background-color 0.2s ease;
}

button:hover, .btn:hover, input[type="submit"]:hover {
  background-color: var(--chatgpt-dark-bg-hover) !important;
  border-color: #6e707b !important; /* Slightly lighter border on hover */
}

/* === Scrollbars (Webkit browsers like Chrome/Edge/Safari) === */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: var(--chatgpt-dark-bg-sidebar); /* Track matches sidebar */
}
::-webkit-scrollbar-thumb {
  background-color: var(--chatgpt-dark-border); /* Thumb color */
  border-radius: 5px;
  border: 2px solid var(--chatgpt-dark-bg-sidebar); /* Padding around thumb */
}
::-webkit-scrollbar-thumb:hover {
  background-color: #6b6d7e; /* Lighter thumb on hover */
}

/* === General Link Styling (if not covered above) === */
a {
  color: #A7C5F5 !important; /* A slightly blue tint for links, common in dark modes */
}
a:hover {
  color: #C2DAF9 !important;
}

/* === IMPORTANT FINAL NOTE === */
/* The CSS selectors used here (.sidebar, .chat-container, .message, etc.) */
/* are BEST GUESSES. You **MUST** use your browser's Developer Tools */
/* (Right-click -> Inspect) on TypingMind to find the *actual* class names */
/* and IDs used for elements like the sidebar, chat messages, input fields, */
/* and buttons, then UPDATE the selectors in this file accordingly. */
