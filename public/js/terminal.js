import OPENAI_API_KEY from './config.js';

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

        // Add event listeners
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent default enter behavior
                const command = this.input.value.trim();
                console.log('Command entered:', command); // Debug log
                
                if (command) {
                    this.handleCommand(command);
                    this.input.value = '';
                }
            }
        });

        // Make entire terminal clickable to focus input
        document.querySelector('.terminal-container').addEventListener('click', () => {
            this.input.focus();
        });

        // Initial welcome message
        this.addToOutput('Welcome to Yuki Terminal! Type "help" for commands.', 'system');
    }

    handleCommand(command) {
        console.log('Handling command:', command); // Debug log
        
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
        console.log('Adding to output:', text, type); // Debug log
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }

    // Rest of your terminal class...
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing terminal...'); // Debug log
    const terminal = new Terminal();
});