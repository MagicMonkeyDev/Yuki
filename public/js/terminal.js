import OPENAI_API_KEY from './config.js';

class Terminal {
    constructor() {
        this.terminal = document.querySelector('.terminal-container');
        this.output = document.querySelector('.terminal-output');
        this.input = document.querySelector('.terminal-input');
        this.chatHistory = [];
        this.isChatting = false;

        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = this.input.value.trim();
                if (command) {
                    this.handleCommand(command);
                    this.input.value = '';
                }
            }
        });

        // Initialize with welcome message
        this.addToOutput('Welcome to Yuki Terminal! Type "help" for commands.', 'system');
    }

    async handleChat(input) {
        if (!this.isChatting) {
            this.isChatting = true;
            this.addToOutput('Starting chat mode... Type "exit" to end the conversation.', 'system');
            return;
        }

        if (input.toLowerCase() === 'exit') {
            this.isChatting = false;
            this.chatHistory = [];
            this.addToOutput('Exiting chat mode...', 'system');
            return;
        }

        try {
            this.addToOutput(`You: ${input}`, 'user');
            this.addToOutput('AI is typing...', 'system');

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        ...this.chatHistory,
                        { role: "user", content: input }
                    ]
                })
            });

            const data = await response.json();
            
            // Remove the "AI is typing..." message
            this.output.removeChild(this.output.lastChild);

            if (data.error) {
                throw new Error(data.error);
            }

            const aiResponse = data.choices[0].message.content;
            this.addToOutput(`AI: ${aiResponse}`, 'ai');

            // Update chat history
            this.chatHistory.push(
                { role: "user", content: input },
                { role: "assistant", content: aiResponse }
            );

        } catch (error) {
            this.output.removeChild(this.output.lastChild); // Remove "AI is typing..."
            this.addToOutput('Error: Could not get a response from AI.', 'error');
        }
    }

    handleCommand(command) {
        if (this.isChatting) {
            this.handleChat(command);
            return;
        }

        switch (command.toLowerCase()) {
            case 'help':
                this.addToOutput('Available commands:', 'system');
                this.addToOutput('- help: Show this help message', 'system');
                this.addToOutput('- chat: Start chat mode with AI', 'system');
                this.addToOutput('- clear: Clear the terminal', 'system');
                break;
            case 'chat':
                this.handleChat('');
                break;
            case 'clear':
                this.output.innerHTML = '';
                break;
            default:
                this.addToOutput(`Command not found: ${command}`, 'error');
        }
    }

    addToOutput(text, type = 'normal') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }
}

// Initialize terminal
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});