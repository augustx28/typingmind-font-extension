{
  "manifest_version": 3,
  "name": "TypingMind - ChatGPT Dark Theme",
  "version": "1.0.1",
  "description": "Applies a ChatGPT-inspired dark theme to TypingMind. Updated May 2025.",
  "author": "Your Name Here",
  "content_scripts": [
    {
      "matches": [
        "https://app.typingmind.com/*"
        // Add other domains if you use a self-hosted version, e.g.,
        // "*://your-typingmind-domain.com/*"
      ],
      "css": ["style.css"],
      "run_at": "document_start"
    }
  ],
   "icons": {
    "48": "icon48.png",
    "128": "icon128.png"
  }
}
