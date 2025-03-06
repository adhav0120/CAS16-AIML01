let messageCount = 0;  // Track how many messages exchanged
let feedbackRequested = false;  // Track feedback status
let sentMessages = new Set();  // Track sent messages to avoid repeats

// Toggle chatbot visibility
function toggleChatbot() {
    const chatbotContainer = document.getElementById('chatbotContainer');
    chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'block' : 'none';
    if (chatbotContainer.style.display === 'block') {
        document.getElementById('chatbotInput').focus();
    }
}

// Initialize event listener for Enter key
document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('chatbotInput');
    inputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

// Send message
function sendMessage() {
    const inputField = document.getElementById('chatbotInput');
    const userMessage = inputField.value.trim();
    if (userMessage === "") return;

    addMessageToChatbot('user', userMessage);

    if (feedbackRequested) {
        handleFeedbackResponse(userMessage);
        feedbackRequested = false;
        return;
    }

    const botMessage = getBotResponse(userMessage);

    setTimeout(() => {
        if (!sentMessages.has(botMessage)) {  // Avoid repeats
            addMessageToChatbot('bot', botMessage);
            logInteraction(userMessage, botMessage);
            sentMessages.add(botMessage);
            messageCount++;
        }

        if (messageCount === 5 && !feedbackRequested) {
            requestFeedback();
        }
    }, 600);

    inputField.value = "";
    scrollChatToBottom();
}

// Add message to the chat window
function addMessageToChatbot(sender, text) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.innerText = text;
    messagesContainer.appendChild(messageElement);
    scrollChatToBottom();
}

// Ensure chat stays scrolled to bottom
function scrollChatToBottom() {
    const messagesContainer = document.getElementById('chatbotMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// AI + Recommendations + Sentiment + Product Search
function getBotResponse(userMessage) {
    const aiRecommendation = getAIRecommendation(userMessage);
    if (aiRecommendation) return aiRecommendation;

    const sentiment = analyzeSentiment(userMessage);
    const productSuggestion = smartProductSearch(userMessage);

    if (sentiment === 'positive') {
        return "😊 I'm so happy you're enjoying your visit! Anything else I can assist with?";
    } else if (sentiment === 'negative') {
        return "😟 I'm sorry to hear that. Let me know how I can improve your experience.";
    } else if (productSuggestion) {
        return productSuggestion;
    } else {
        return "💬 I'm here to assist! Are you looking for products, recommendations, or just browsing?";
    }
}

// Sentiment Analysis
function analyzeSentiment(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('love') || lowerMessage.includes('happy') || lowerMessage.includes('great')) return 'positive';
    if (lowerMessage.includes('angry') || lowerMessage.includes('hate') || lowerMessage.includes('bad')) return 'negative';
    return 'neutral';
}

// Expanded Product Search
function smartProductSearch(message) {
    const products = [
        { name: 'Laptop', price: '$799.99' },
        { name: 'Headphones', price: '$59.99' },
        { name: 'Smart Watch', price: '$99.99' },
        { name: 'Backpack', price: '$39.99' },
        { name: 'Running Shoes', price: '$69.99' },
        { name: 'Coffee Maker', price: '$49.99' },
        { name: 'Desk Chair', price: '$119.99' }
    ];
    const lowerMessage = message.toLowerCase();
    const product = products.find(p => lowerMessage.includes(p.name.toLowerCase()));

    if (product) {
        return `🔎 We found ${product.name} for ${product.price}. Would you like to add it to your cart?`;
    }
    return null;
}

// AI Recommendations
function getAIRecommendation(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('recommend')) {
        return "✨ Based on trends, I recommend checking out: Wireless Earbuds, Eco-Friendly Water Bottles, and Ergonomic Chairs!";
    } else if (lowerMessage.includes('gift') || lowerMessage.includes('present')) {
        return "🎁 Need gift ideas? Try Smart Watches, Fashion Backpacks, or Personalized Mugs!";
    } else if (lowerMessage.includes('new arrival') || lowerMessage.includes('latest')) {
        return "🆕 Check out our latest arrivals: Noise-Cancelling Headphones, Smart Home Cameras, and Adjustable Desks!";
    }
    return null;
}

// Log interactions to localStorage
function logInteraction(userMessage, botMessage) {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.push({ user: userMessage, bot: botMessage, timestamp: new Date().toISOString() });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Ask for feedback
function requestFeedback() {
    const feedbackMessage = "📝 We'd love your feedback! Was this chat helpful? Please reply 'yes' or 'no'.";
    if (!sentMessages.has(feedbackMessage)) {
        setTimeout(() => {
            addMessageToChatbot('bot', feedbackMessage);
            feedbackRequested = true;
            sentMessages.add(feedbackMessage);
        }, 1000);
    }
}

// Handle feedback response
function handleFeedbackResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage === 'yes') {
        const thankYouMessage = "🎉 Awesome! Thanks for your feedback!";
        if (!sentMessages.has(thankYouMessage)) {
            addMessageToChatbot('bot', thankYouMessage);
            sentMessages.add(thankYouMessage);
        }
    } else if (lowerMessage === 'no') {
        const improvementMessage = "😔 Sorry to hear that. We're always working to improve. Let us know how we can do better!";
        if (!sentMessages.has(improvementMessage)) {
            addMessageToChatbot('bot', improvementMessage);
            sentMessages.add(improvementMessage);
        }
    } else {
        const clarificationMessage = "🤔 Please reply with 'yes' or 'no' to help us improve.";
        if (!sentMessages.has(clarificationMessage)) {
            addMessageToChatbot('bot', clarificationMessage);
            sentMessages.add(clarificationMessage);
            feedbackRequested = true;  // Ask again
        }
    }
}

// Optional: Load previous chat history on page load (if needed)
function loadChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.forEach(chat => {
        addMessageToChatbot('user', chat.user);
        addMessageToChatbot('bot', chat.bot);
    });
}
