// ChatGPT Theme for TypingMind
// Version 1.0

// Wait for TypingMind to load
document.addEventListener('typingmind-ready', function() {
  // Create style element
  const style = document.createElement('style');
  style.textContent = `
    /* Main interface colors */
    :root {
      --tm-color-bg: #343540 !important;
      --tm-color-chat-bg: #343540 !important;
      --tm-color-sidebar-bg: #202123 !important;
      --tm-color-sidebar-selected: rgba(255, 255, 255, 0.1) !important;
      --tm-color-sidebar-hover: rgba(255, 255, 255, 0.05) !important;
      
      /* Message colors */
      --tm-color-user-msg-bg: #444654 !important;
      --tm-color-assistant-msg-bg: #343540 !important;
      
      /* Code block colors */
      --tm-color-code-bg: #1e1e2e !important;
      
      /* Button colors */
      --tm-color-primary: #74AA9C !important;
      --tm-color-primary-hover: #5d8a7d !important;
      
      /* Border colors */
      --tm-color-border: #444654 !important;
      
      /* Input area colors */
      --tm-color-input-bg: #40414f !important;
    }
    
    /* Apply darker sidebar color */
    .sidebar {
      background-color: var(--tm-color-sidebar-bg) !important;
    }
    
    /* Apply user message background */
    .message-user {
      background-color: var(--tm-color-user-msg-bg) !important;
    }
    
    /* Apply assistant message background */
    .message-assistant {
      background-color: var(--tm-color-assistant-msg-bg) !important;
    }
    
    /* Apply input area background */
    .chat-input-area {
      background-color: var(--tm-color-input-bg) !important;
    }
    
    /* Apply code block backgrounds */
    pre, code {
      background-color: var(--tm-color-code-bg) !important;
    }
    
    /* Fix any other elements that might need adjustment */
    .main-content {
      background-color: var(--tm-color-bg) !important;
    }
    
    /* Override any buttons to match ChatGPT style */
    button.primary {
      background-color: var(--tm-color-primary) !important;
    }
    
    button.primary:hover {
      background-color: var(--tm-color-primary-hover) !important;
    }
  `;
  
  // Add style to document
  document.head.appendChild(style);
  
  console.log('ChatGPT theme applied to TypingMind');
});
