<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #343541;
            color: #ECECF1;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        h1, h2 {
            color: #ECECF1;
        }
        pre {
            background-color: #444654;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            color: #D1D5DB;
            font-family: 'Courier New', Courier, monospace;
        }
        code {
            background-color: #444654;
            padding: 3px 5px;
            border-radius: 3px;
            font-family: 'Courier New', Courier, monospace;
        }
        .script-header {
            background-color: #444654;
            padding: 10px 15px;
            border-radius: 6px 6px 0 0;
            font-weight: bold;
            border-bottom: 1px solid #565869;
        }
        .install-btn {
            background-color: #10A37F;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            margin: 20px 0;
            transition: background-color 0.2s;
        }
        .install-btn:hover {
            background-color: #0D8A6C;
        }
        .color-sample {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin: 20px 0;
        }
        .color-block {
            width: 100px;
            height: 100px;
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 12px;
            text-align: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .preview {
            border: 1px solid #565869;
            border-radius: 6px;
            margin: 20px 0;
            overflow: hidden;
        }
        .preview-header {
            background-color: #202123;
            padding: 15px;
            border-bottom: 1px solid #565869;
        }
        .preview-sidebar {
            background-color: #202123;
            width: 200px;
            padding: 15px;
            float: left;
            height: 300px;
        }
        .preview-content {
            background-color: #343541;
            margin-left: 200px;
            padding: 15px;
            height: 300px;
            overflow: auto;
        }
        .preview-message {
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 6px;
        }
        .user-message {
            background-color: #343541;
        }
        .ai-message {
            background-color: #444654;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>TypingMind ChatGPT Theme Extension</h1>
        <p>This JavaScript code will transform TypingMind's interface to match ChatGPT's dark gray theme. The extension targets specific UI elements to ensure a seamless experience.</p>
        
        <h2>ChatGPT Color Palette</h2>
        <div class="color-sample">
            <div class="color-block" style="background-color: #343541;">
                <span>Main Background</span>
                <span>#343541</span>
            </div>
            <div class="color-block" style="background-color: #444654;">
                <span>Secondary</span>
                <span>#444654</span>
            </div>
            <div class="color-block" style="background-color: #202123;">
                <span>Sidebar</span>
                <span>#202123</span>
            </div>
            <div class="color-block" style="background-color: #565869;">
                <span>Border</span>
                <span>#565869</span>
            </div>
            <div class="color-block" style="background-color: #ECECF1; color: #343541;">
                <span>Text Primary</span>
                <span>#ECECF1</span>
            </div>
        </div>
        
        <h2>Installation</h2>
        <p>To use this theme, you'll need to install a browser extension like Tampermonkey, then create a new script with the following code:</p>
        
        <div class="preview">
            <div class="script-header">TypingMind-ChatGPT-Theme.js</div>
            <pre>// ==UserScript==
// @name         TypingMind ChatGPT Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apply ChatGPT dark gray theme to TypingMind
// @author       Your Name
// @match        https://*.typingmind.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Apply the styles when DOM is fully loaded
    window.addEventListener('load', function() {
        applyStyles();
        
        // For dynamic content that might be added later
        const observer = new MutationObserver(function(mutations) {
            applyStyles();
        });
        
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
    });
    
    function applyStyles() {
        // Create a style element to inject our CSS
        const styleEl = document.createElement('style');
        styleEl.id = 'chatgpt-theme-styles';
        styleEl.textContent = `
            /* Main background color */
            body, .bg-white, .bg-gray-50, .bg-gray-100, .bg-gray-200 {
                background-color: #343541 !important;
                color: #ECECF1 !important;
            }
            
            /* Sidebar background color */
            .bg-gray-800, .bg-gray-900, nav, aside {
                background-color: #202123 !important;
            }
            
            /* Message sections (alternating backgrounds like in ChatGPT) */
            .message:nth-child(odd), .prose {
                background-color: #343541 !important;
            }
            
            .message:nth-child(even), .bg-gray-50 {
                background-color: #444654 !important;
            }
            
            /* Input area */
            textarea, input, select, .input, [type="text"], [type="email"], [type="password"] {
                background-color: #40414F !important;
                color: #ECECF1 !important;
                border-color: #565869 !important;
            }
            
            /* Buttons */
            button, .btn {
                background-color: #40414F !important;
                color: #ECECF1 !important;
                border-color: #565869 !important;
            }
            
            button:hover, .btn:hover {
                background-color: #565869 !important;
            }
            
            /* Primary buttons */
            .btn-primary, button[type="submit"] {
                background-color: #10A37F !important;
                color: white !important;
            }
            
            .btn-primary:hover, button[type="submit"]:hover {
                background-color: #0D8A6C !important;
            }
            
            /* Code blocks */
            pre, code {
                background-color: #444654 !important;
                color: #D1D5DB !important;
            }
            
            /* Text colors */
            h1, h2, h3, h4, h5, h6, p, span, div, a {
                color: #ECECF1 !important;
            }
            
            /* Borders */
            .border, .border-t, .border-b, .border-l, .border-r, [class*="border"] {
                border-color: #565869 !important;
            }
            
            /* Dialog/Modal backgrounds */
            .modal, .dialog, [role="dialog"] {
                background-color: #343541 !important;
            }
            
            /* Scrollbar customization */
            ::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }
            
            ::-webkit-scrollbar-track {
                background: #343541;
            }
            
            ::-webkit-scrollbar-thumb {
                background: #565869;
                border-radius: 5px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: #676980;
            }
        `;
        
        // Remove existing style if it exists
        const existingStyle = document.getElementById('chatgpt-theme-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Add the style to the document
        document.head.appendChild(styleEl);
    }
})();</pre>
        </div>
        
        <button class="install-btn" onclick="alert('This is a preview. Copy the code to your Tampermonkey extension to install.')">Copy Script</button>
        
        <h2>Preview</h2>
        <p>Here's a visualization of how TypingMind would look with the ChatGPT theme applied:</p>
        
        <div class="preview">
            <div class="preview-header">
                TypingMind with ChatGPT Theme
            </div>
            <div class="preview-sidebar">
                <div style="color: #ECECF1; margin-bottom: 15px; font-weight: bold;">Conversations</div>
                <div style="color: #ECECF1; opacity: 0.8; margin-bottom: 8px;">• New chat</div>
                <div style="color: #ECECF1; opacity: 0.8; margin-bottom: 8px;">• Project planning</div>
                <div style="color: #ECECF1; opacity: 0.8; margin-bottom: 8px;">• Code review</div>
            </div>
            <div class="preview-content">
                <div class="preview-message ai-message">
                    <div style="font-weight: bold; margin-bottom: 5px;">AI Assistant</div>
                    Hello! How can I help you today?
                </div>
                <div class="preview-message user-message">
                    <div style="font-weight: bold; margin-bottom: 5px;">You</div>
                    Can you help me understand how to use JavaScript promises?
                </div>
                <div class="preview-message ai-message">
                    <div style="font-weight: bold; margin-bottom: 5px;">AI Assistant</div>
                    Absolutely! JavaScript promises are objects that represent the eventual completion (or failure) of an asynchronous operation and its resulting value.
                    <br><br>
                    Here's a simple example:
                    <br><br>
                    <code>
                    const myPromise = new Promise((resolve, reject) => {<br>
                    &nbsp;&nbsp;// Asynchronous operation here<br>
                    &nbsp;&nbsp;if (/* operation successful */) {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;resolve('Success!');<br>
                    &nbsp;&nbsp;} else {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;reject('Failure!');<br>
                    &nbsp;&nbsp;}<br>
                    });
                    </code>
                </div>
            </div>
            <div style="clear: both;"></div>
        </div>
        
        <h2>How It Works</h2>
        <p>This script uses CSS to override the default TypingMind styling with colors that match ChatGPT's interface. The script:</p>
        <ul>
            <li>Applies when the page loads</li>
            <li>Continues monitoring for dynamically added content</li>
            <li>Targets specific UI elements to maintain functionality</li>
            <li>Uses ChatGPT's exact color palette</li>
        </ul>
        
        <p>You may need to adjust some selectors based on TypingMind's structure if they update their interface.</p>
    </div>
    
    <script>
        // Copy script to clipboard
        document.querySelector('.install-btn').addEventListener('click', function() {
            const scriptText = document.querySelector('pre').innerText;
            navigator.clipboard.writeText(scriptText).then(function() {
                alert('Script copied to clipboard! Paste it into your Tampermonkey extension.');
            }, function() {
                alert('Failed to copy script. Please select and copy it manually.');
            });
        });
    </script>
</body>
</html>
