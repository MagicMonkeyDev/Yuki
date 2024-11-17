import OPENAI_API_KEY from './config.js';

class Terminal {
    constructor() {
        this.terminal = document.querySelector('.terminal-container');
        this.output = document.querySelector('.terminal-output');
        this.input = document.querySelector('.terminal-input');
        this.history = [];
        this.historyIndex = -1;
        
        this.commands = {
            'help': () => this.showHelp(),
            'about': () => this.showAbout(),
            'chat': () => this.startChat(),
            'ca': () => this.showContractAddress()
        };
        
        this.chatHistory = [];
        this.isChatting = false;
        
        this.init();
        
    }

    init() {
        this.addToOutput(`
╭──────────────── Welcome to the Kawaii Terminal! ✧˖°˖✧ ─────────────
│                                                                     
│  (づ｡◕‿‿◕｡)づ Available Commands:                                   
│                                                                     
│  ╰─❀ help    - Show this help message                             
│  ╰─❀ about   - About this terminal                       
│  ╰─❀ chat    - Chat with Akari                                  
│  ╰─❀ ca      - Shows Official Contract Address      
│                                                               
╰─────────────────────────────────────────────────────────────────────
`, 'system');
        
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = this.input.value.trim();
                if (command) {
                    this.processCommand(command);
                    this.history.push(command);
                    this.historyIndex = this.history.length;
                    this.input.value = '';
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.input.value = this.history[this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.input.value = this.history[this.historyIndex];
                } else {
                    this.historyIndex = this.history.length;
                    this.input.value = '';
                }
            }
        });

        this.terminal.addEventListener('click', () => {
            this.input.focus();
        });

        this.output.addEventListener('mousedown', (e) => {
            if (window.getSelection().toString()) {
                e.stopPropagation();
            }
        });
    }

    processCommand(commandStr) {
        this.addToOutput(`> ${commandStr}`, 'input');
        
        const args = commandStr.split(' ');
        const command = args.shift().toLowerCase();
        
        if (this.commands[command]) {
            this.commands[command](args);
        } else {
            this.addToOutput(`Command not found: ${command} (´･_･\`)`, 'error');
        }
    }

    addToOutput(text, type = 'normal') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }

    showHelp() {
        const commands = [
            'Available commands:',
            'help    - Show this help message',
            'about   - About this terminal',
            'chat    - Chat with Akari',
            'ca      - Shows Official Contract Address'
        ];
        commands.forEach(cmd => this.addToOutput(cmd, 'help'));
    }

    showAbout() {
        this.addToOutput('Kawaii Terminal v1.0 (づ｡◕‿‿◕｡)づ', 'about');
        this.addToOutput('Made with love and sparkles ✨', 'about');
    }

    startChat() {
        this.addToOutput('Konnichiwa! I\'m Akari! How can I help you today? (◕‿◕✿)', 'chat');
        // Add your chat implementation here
    }

    showContractAddress() {
        this.addToOutput('Official Contract Address:', 'ca');
        this.addToOutput('0x...', 'ca'); // Replace with your actual contract address
        this.addToOutput('✨ Always verify the contract address! Stay safe! ✨', 'ca');
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
            const response = await this.getChatGPTResponse(input);
            this.addToOutput(`You: ${input}`, 'user');
            this.addToOutput(`AI: ${response}`, 'ai');
        } catch (error) {
            this.addToOutput('Error: Could not get a response from ChatGPT.', 'error');
        }
    }

    async getChatGPTResponse(input) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        ...this.chatHistory,
                        { role: "user", content: input }
                    ],
                    max_tokens: 150
                })
            });

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // Update chat history
            this.chatHistory.push(
                { role: "user", content: input },
                { role: "assistant", content: aiResponse }
            );

            return aiResponse;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    handleCommand(command) {
        if (this.isChatting) {
            this.handleChat(command);
            return;
        }

        // Add chat command to your existing commands
        switch (command.toLowerCase()) {
            case 'chat':
                this.handleChat('');
                break;
            // ... your other existing commands ...
        }
    }
}

// Initialize terminal
document.addEventListener('DOMContentLoaded', () => {
    const terminal = new Terminal();
});