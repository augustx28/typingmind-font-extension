{
  "manifest_version": 3,
  "name": "TypingMind Sidebar Tuner",
  "description": "Darken or recolor TypingMind’s sidebar.",
  "version": "1.0.0",
  "icons": {
    "128": "icons/icon128.png"
  },
  "permissions": ["storage"],
  "content_scripts": [
    {
      "matches": ["https://app.typingmind.com/*", "https://www.typingmind.com/*"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "action": {
    "default_popup": "popup/popup.html",
    "default_title": "Sidebar Colors"
  }
}
