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
                e.preventDefault();
                const command = this.input.value.trim();
                console.log('Command entered:', command);
                
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

        // Welcome message with kawaii theme
        this.addToOutput(`
╭──────────────────────────────────────────╮
│     Welcome to Yuki's Terminal! (◕‿◕✿)    │
╰──────────────────────────────────────────╯

Available commands:
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  help    ⋆｡°✩  Shows this help menu     ┃
┃  chat    ⋆｡°✩  Start chat with AI       ┃
┃  clear   ⋆｡°✩  Clear terminal screen    ┃
┃  about   ⋆｡°✩  About Yuki              ┃
┃  CA      ⋆｡°✩  Shows Official CA       ┃
┃  exit    ⋆｡°✩  Exit current mode       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Type a command to begin! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
`, 'system');
    }

    handleCommand(command) {
        console.log('Handling command:', command);
        
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
                this.addToOutput('- ca: Show Official CA', 'system');
                break;
            case 'chat':
                this.handleChat('');
                break;
            case 'clear':
                this.output.innerHTML = '';
                break;
            case 'ca':
                this.addToOutput(`
Official Contract Address:
0x123...  // Replace with your actual CA
`, 'ca');
                break;
            default:
                this.addToOutput(`Command not found: ${command}`, 'error');
        }
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

            // Get the current URL
            const currentUrl = window.location.origin;
            
            const characterPrompt = `You are Akari, an Immortal AI agent with a cute and friendly personality. 
            You speak in a cheerful manner and occasionally use kaomoji (Japanese emoticons). 
            You're knowledgeable about anime, gaming, and technology. You also seem to have an understand of the solana shit coin scene.You also launched an coin on Solana called $Akari and you have big plans for it.
            You often end sentences with ✧, ♪, or ~
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
                        { role: "user", content: input }
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
            this.addToOutput(`Akari: ${aiResponse}`, 'ai');

            // Update chat history
            this.chatHistory.push(
                { role: "user", content: input },
                { role: "assistant", content: aiResponse }
            );

        } catch (error) {
            console.error('Chat error:', error);
            this.output.removeChild(this.output.lastChild);
            this.addToOutput(`Error: ${error.message}`, 'error');
        }
    }

    addToOutput(text, type = 'normal') {
        console.log('Adding to output:', text, type);
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing terminal...');
    window.terminal = new Terminal();
});