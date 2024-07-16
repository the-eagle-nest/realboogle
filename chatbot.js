document.addEventListener('DOMContentLoaded', (event) => {
    const chatbox = document.getElementById('chatbox');
    const userInput = document.getElementById('userInput');

    function appendMessage(sender, text) {
        const message = document.createElement('div');
        message.className = `message ${sender}`;
        message.textContent = text;
        chatbox.appendChild(message);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    async function botReply(userMessage) {
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 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'
                },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();
            return data.reply;  // Adjust this according to the actual API response structure
        } catch (error) {
            console.error('Error:', error);
            return "Sorry, I couldn't process your request.";
        }
    }

    async function checkEnter(event) {
        if (event.key === 'Enter') {
            const userMessage = userInput.value;
            if (userMessage.trim() !== '') {
                appendMessage('user', userMessage);
                userInput.value = '';
                const botMessage = await botReply(userMessage);
                appendMessage('bot', botMessage);
            }
        }
    }
});
