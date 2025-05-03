/* ChatGPT Theme for TypingMind
 * Created: May 3, 2025
 * Version: 1.0
 * Description: This theme mimics the ChatGPT dark theme UI for TypingMind
 */

/* Global styles */
:root {
  --chatgpt-bg-dark: #202123;
  --chatgpt-bg-darker: #131314;
  --chatgpt-bg-chat: #343541;
  --chatgpt-bg-response: #444654;
  --chatgpt-text: #ECECF1;
  --chatgpt-text-secondary: #9ca3af;
  --chatgpt-border: #4d4d4f;
  --chatgpt-accent: #10a37f;
  --chatgpt-hover: #2A2B32;
}

/* Background colors */
body, .page-content, .dark {
  background-color: var(--chatgpt-bg-chat) !important;
  color: var(--chatgpt-text) !important;
}

/* Sidebar styling */
.sidebar, .sidebar-content, .dark .sidebar {
  background-color: var(--chatgpt-bg-dark) !important;
  border-right: 1px solid var(--chatgpt-border) !important;
}

.sidebar-header, .dark .sidebar-header {
  border-bottom: 1px solid var(--chatgpt-border) !important;
}

/* Chat list & navigation */
.chat-list-item, .nav-item, .folder-item, .dark .chat-list-item, .dark .nav-item, .dark .folder-item {
  color: var(--chatgpt-text) !important;
  border-radius: 5px !important;
  margin-bottom: 3px !important;
}

.chat-list-item:hover, .nav-item:hover, .folder-item:hover,
.dark .chat-list-item:hover, .dark .nav-item:hover, .dark .folder-item:hover {
  background-color: var(--chatgpt-hover) !important;
}

.chat-list-item.active, .nav-item.active, .folder-item.active,
.dark .chat-list-item.active, .dark .nav-item.active, .dark .folder-item.active {
  background-color: var(--chatgpt-hover) !important;
}

/* Chat interface */
.chat-container, .chat-content, .dark .chat-container, .dark .chat-content {
  background-color: var(--chatgpt-bg-chat) !important;
}

/* Message bubbles */
.message-bubble, .dark .message-bubble {
  border-radius: 5px !important;
  padding: 12px !important;
  margin-bottom: 20px !important;
}

.message-bubble.user, .dark .message-bubble.user {
  background-color: var(--chatgpt-bg-chat) !important;
  border: 1px solid var(--chatgpt-border) !important;
}

.message-bubble.assistant, .dark .message-bubble.assistant {
  background-color: var(--chatgpt-bg-response) !important;
}

/* Input area */
.chat-input-container, .chat-input, .dark .chat-input-container, .dark .chat-input {
  background-color: var(--chatgpt-bg-dark) !important;
  border: 1px solid var(--chatgpt-border) !important;
  border-radius: 8px !important;
}

.chat-input:focus, .dark .chat-input:focus {
  border-color: var(--chatgpt-accent) !important;
}

/* Buttons */
button, .button, .dark button, .dark .button {
  background-color: var(--chatgpt-bg-dark) !important;
  color: var(--chatgpt-text) !important;
  border: 1px solid var(--chatgpt-border) !important;
  border-radius: 5px !important;
}

button:hover, .button:hover, .dark button:hover, .dark .button:hover {
  background-color: var(--chatgpt-hover) !important;
}

button.primary, .button.primary, .dark button.primary, .dark .button.primary {
  background-color: var(--chatgpt-accent) !important;
  border-color: var(--chatgpt-accent) !important;
}

button.primary:hover, .button.primary:hover, 
.dark button.primary:hover, .dark .button.primary:hover {
  background-color: #0e8c6c !important;
}

/* Settings Modal */
.modal, .modal-content, .dark .modal, .dark .modal-content {
  background-color: var(--chatgpt-bg-dark) !important;
  border: 1px solid var(--chatgpt-border) !important;
}

.modal-header, .dark .modal-header {
  border-bottom: 1px solid var(--chatgpt-border) !important;
}

.modal-footer, .dark .modal-footer {
  border-top: 1px solid var(--chatgpt-border) !important;
}

/* Form controls */
input, textarea, select, .dark input, .dark textarea, .dark select {
  background-color: var(--chatgpt-bg-darker) !important;
  color: var(--chatgpt-text) !important;
  border: 1px solid var(--chatgpt-border) !important;
  border-radius: 5px !important;
}

input:focus, textarea:focus, select:focus,
.dark input:focus, .dark textarea:focus, .dark select:focus {
  border-color: var(--chatgpt-accent) !important;
}

/* Code blocks */
pre, code, .code-block, .dark pre, .dark code, .dark .code-block {
  background-color: var(--chatgpt-bg-darker) !important;
  border: 1px solid var(--chatgpt-border) !important;
  border-radius: 5px !important;
}

/* Headers */
h1, h2, h3, h4, h5, h6, .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6 {
  color: var(--chatgpt-text) !important;
}

/* Links */
a, .link, .dark a, .dark .link {
  color: var(--chatgpt-accent) !important;
}

a:hover, .link:hover, .dark a:hover, .dark .link:hover {
  text-decoration: underline !important;
}

/* Scrollbars */
::-webkit-scrollbar {
  width: 8px !important;
  height: 8px !important;
}

::-webkit-scrollbar-track {
  background: var(--chatgpt-bg-darker) !important;
}

::-webkit-scrollbar-thumb {
  background: var(--chatgpt-border) !important;
  border-radius: 10px !important;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--chatgpt-text-secondary) !important;
}

/* Tables */
table, .dark table {
  border-collapse: collapse !important;
  width: 100% !important;
}

th, td, .dark th, .dark td {
  border: 1px solid var(--chatgpt-border) !important;
  padding: 8px !important;
}

th, .dark th {
  background-color: var(--chatgpt-bg-darker) !important;
}

/* Additional custom styling for TypingMind-specific elements */
.model-selector, .dark .model-selector {
  background-color: var(--chatgpt-bg-dark) !important;
  border: 1px solid var(--chatgpt-border) !important;
}

.dropdown-menu, .dark .dropdown-menu {
  background-color: var(--chatgpt-bg-dark) !important;
  border: 1px solid var(--chatgpt-border) !important;
}

.dropdown-item, .dark .dropdown-item {
  color: var(--chatgpt-text) !important;
}

.dropdown-item:hover, .dark .dropdown-item:hover {
  background-color: var(--chatgpt-hover) !important;
}

/* Toast notifications */
.toast, .notification, .dark .toast, .dark .notification {
  background-color: var(--chatgpt-bg-dark) !important;
  color: var(--chatgpt-text) !important;
  border: 1px solid var(--chatgpt-border) !important;
}

/* Loading spinner */
.spinner, .loader, .dark .spinner, .dark .loader {
  border-color: var(--chatgpt-accent) !important;
  border-right-color: transparent !important;
}
