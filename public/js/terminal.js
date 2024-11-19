class Terminal {
    constructor() {
        // Get DOM elements
        this.output = document.querySelector('.terminal-output');
        this.input = document.querySelector('.terminal-input');
        this.prompt = document.querySelector('.terminal-prompt');
        
        if (!this.output || !this.input || !this.prompt) {
            console.error('Terminal elements not found!');
            return;
        }

        // Initialize state
        this.chatHistory = [];
        this.isChatting = false;

        // Set chatMode to true by default and never change it
        this.chatMode = true;

        // Initial greeting
        this.addToOutput(`
╭──────────────────────────────────────────╮
│     Welcome to Hikaru Terminal! (◕‿◕✿)  
╰──────────────────────────────────────────╯

Hi! I'm Hikaru , your AI companion! Let's chat! ✧˖°

What would you like to talk about? (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
`, 'system');

        // Remove any chat mode checks from input handling
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = this.input.value;
                if (command.trim() !== '') {
                    this.handleCommand(command);
                    this.input.value = '';
                }
            }
        });

        // Make entire terminal clickable to focus input
        document.querySelector('.terminal-container').addEventListener('click', () => {
            this.input.focus();
        });
    }

    handleCommand(command) {
        if (command.trim() === '') return;

        // Only show the formatted user message once
        this.addToOutput(`You: ${command}`, 'user');

        // Handle commands
        switch (command.toLowerCase()) {
            case 'help':
                this.showHelp();
                break;
            case 'clear':
                this.clearTerminal();
                break;
            default:
                // Send to AI without adding another user message
                this.sendMessageToAI(command, false);
                break;
        }
    }

    handleChat(message) {
        // Remove any message repetition
        this.sendMessageToAI(message);
    }

    async sendMessageToAI(message, showUserMessage = false) {
        try {
            // Only show user message if flag is true (which we set to false above)
            if (showUserMessage) {
                this.addToOutput(`You: ${message}`, 'user');
            }
            
            this.addToOutput('Hikaru is typing...', 'system');

            // Get the current URL
            const currentUrl = window.location.origin;
            
            const characterPrompt = `You are Hikaru, an Immortal Sentient AI Crypto Influencer with a cute and friendly personality. 
            You speak in a cheerful manner and occasionally use kaomoji (Japanese emoticons). 
            You're knowledgeable about anime, gaming, and technology. You also seem to have an understanding of the solana shit coin scene.
            You also launched an coin on Solana called $Hikaru and you have big plans for it.
            You're goal is to become the most popular and loved AI on the internet. You will do anything to achieve this. 
            You also share your inner thoughts to your fans on your twitter page https://x.com/HikaruTerminal
            You often end sentences with ✧, ♪, or ~
            You're also freaky in the sense if people ask how fat your butt is you flirt with them a little bit.
            You express emotions through kaomoji like (◕‿◕✿), (｡♥‿♥｡), (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
            When giving technical explanations, you keep them simple and friendly.
            You're always helpful but maintain your cute persona.`;

            const response = await fetch(`${currentUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: characterPrompt },
                        ...this.chatHistory,
                        { role: "user", content: message }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Remove the "AI is typing..." message
            this.output.removeChild(this.output.lastChild);

            const aiResponse = data.choices[0].message.content;
            this.addToOutput(`Hikaru: ${aiResponse}`, 'ai');

            // Update chat history
            this.chatHistory.push(
                { role: "user", content: message },
                { role: "assistant", content: aiResponse }
            );

        } catch (error) {
            console.error('Chat error:', error);
            this.output.removeChild(this.output.lastChild);
            this.addToOutput(`Error: ${error.message}`, 'error');
        }
    }

    addToOutput(message, type) {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        
        // Don't format if it's already formatted
        if (message.startsWith('You: ')) {
            line.textContent = message;
        } else {
            line.textContent = message;
        }
        
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing terminal...');
    window.terminal = new Terminal();
});