(function() {
    // --- START CONFIGURATION ---
    // YOU MUST FIND AND REPLACE THESE VALUES
    
    // This is the main selector that holds ALL parallel chat messages
    const CHAT_CONTAINER_SELECTOR = '.chat-container-wrapper'; 
    
    // This is the selector for *each individual* model's chat box
    const CHAT_BOX_SELECTOR = '.parallel-chat-box'; 
    
    // --- END CONFIGURATION ---

    let currentChatIndex = 0;
    let chatBoxes = [];

    // Function to find and update the list of chat boxes
    function findChatBoxes() {
        const container = document.querySelector(CHAT_CONTAINER_SELECTOR);
        if (container) {
            chatBoxes = Array.from(container.querySelectorAll(CHAT_BOX_SELECTOR));
        }
    }

    // Function to switch the view
    function switchChat(direction) {
        if (chatBoxes.length === 0) {
            findChatBoxes(); // Try to find them again
            if (chatBoxes.length === 0) return; // Still nothing, abort
        }

        // Hide the current chat box
        if (chatBoxes[currentChatIndex]) {
            chatBoxes[currentChatIndex].style.display = 'none';
        }

        // Move to the next or previous index
        currentChatIndex += direction;

        // Loop around if at the end or beginning
        if (currentChatIndex >= chatBoxes.length) {
            currentChatIndex = 0;
        }
        if (currentChatIndex < 0) {
            currentChatIndex = chatBoxes.length - 1;
        }

        // Show the new chat box
        if (chatBoxes[currentChatIndex]) {
            chatBoxes[currentChatIndex].style.display = 'block';
        }
    }

    // Function to create and add the arrows
    function createArrows() {
        // Only run on small screens (mobile)
        if (window.innerWidth > 768) {
            return;
        }

        // Check if arrows already exist
        if (document.getElementById('tm-arrow-left')) {
            return;
        }

        const rightArrow = document.createElement('div');
        rightArrow.id = 'tm-arrow-right';
        rightArrow.innerHTML = '❯';
        rightArrow.style = 'position: fixed; top: 50%; right: 5px; z-index: 9999; padding: 10px; background: rgba(0,0,0,0.5); color: white; border-radius: 50%; cursor: pointer;';
        rightArrow.onclick = () => switchChat(1);

        const leftArrow = document.createElement('div');
        leftArrow.id = 'tm-arrow-left';
        leftArrow.innerHTML = '❮';
        leftArrow.style = 'position: fixed; top: 50%; left: 5px; z-index: 9999; padding: 10px; background: rgba(0,0,0,0.5); color: white; border-radius: 50%; cursor: pointer;';
        leftArrow.onclick = () => switchChat(-1);

        document.body.appendChild(rightArrow);
        document.body.appendChild(leftArrow);
    }

    // We need to re-run this logic often, as TypingMind loads chats dynamically.
    // A MutationObserver is the "correct" way, but a simple interval is easier.
    
    // Run the script initially
    setTimeout(() => {
        createArrows();
        findChatBoxes();
        // Initially, hide all but the first chat box
        chatBoxes.forEach((box, index) => {
            if (index !== 0) {
                box.style.display = 'none';
            }
        });
    }, 2000); // Wait 2 seconds for the app to load

    // Re-check when the user switches chats (URL changes)
    window.addEventListener('popstate', () => {
        setTimeout(createArrows, 500);
        currentChatIndex = 0; // Reset index
    });

})();
