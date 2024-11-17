class KawaiiCursor {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        this.cursorDot = document.querySelector('.cursor-dot');
        this.clickEffects = document.querySelector('.click-effects');
        
        // Kawaii emojis for click effects
        this.kawaiiFaces = ['✨', '💖', '🌸', '⭐', '🎀', '🌟', '💫', '🍡', '🌺'];
        
        this.init();
    }

    init() {
        // Move cursor
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                this.cursor.style.left = e.clientX + 'px';
                this.cursor.style.top = e.clientY + 'px';
                
                // Dot follows with slight delay
                setTimeout(() => {
                    this.cursorDot.style.left = e.clientX + 'px';
                    this.cursorDot.style.top = e.clientY + 'px';
                }, 50);
            });
        });

        // Hover effect on clickable elements
        const clickableElements = document.querySelectorAll('a, button, input, .key');
        clickableElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.style.width = '30px';
                this.cursor.style.height = '30px';
                this.cursor.style.backgroundColor = 'rgba(189, 147, 249, 0.4)';
                this.cursor.style.borderColor = '#bd93f9';
            });

            element.addEventListener('mouseleave', () => {
                this.cursor.style.width = '20px';
                this.cursor.style.height = '20px';
                this.cursor.style.backgroundColor = 'rgba(255, 121, 198, 0.4)';
                this.cursor.style.borderColor = '#ff79c6';
            });
        });

        // Click effect
        document.addEventListener('click', (e) => {
            this.createClickEffect(e.clientX, e.clientY);
            this.createKawaiiEmoji(e.clientX, e.clientY);
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.cursorDot.style.opacity = '0';
        });

        // Show cursor when entering window
        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.cursorDot.style.opacity = '1';
        });
    }

    createClickEffect(x, y) {
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        
        // Create ripple effect
        effect.innerHTML = `
            <svg width="50" height="50" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="10" fill="none" stroke="#ff79c6" stroke-width="2">
                    <animate attributeName="r" from="10" to="25"
                        dur="0.8s" fill="freeze" />
                    <animate attributeName="opacity" from="1" to="0"
                        dur="0.8s" fill="freeze" />
                </circle>
            </svg>
        `;
        
        this.clickEffects.appendChild(effect);
        setTimeout(() => effect.remove(), 800);
    }

    createKawaiiEmoji(x, y) {
        const emoji = document.createElement('div');
        emoji.className = 'click-effect';
        emoji.style.left = x + 'px';
        emoji.style.top = y + 'px';
        emoji.style.fontSize = '1.5rem';
        emoji.style.color = '#ff79c6';
        
        // Random kawaii emoji
        emoji.textContent = this.kawaiiFaces[Math.floor(Math.random() * this.kawaiiFaces.length)];
        
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const distance = 50;
        const duration = 600;
        
        emoji.animate([
            {
                transform: 'translate(-50%, -50%) scale(0.2)',
                opacity: 1
            },
            {
                transform: `translate(
                    calc(-50% + ${Math.cos(angle) * distance}px), 
                    calc(-50% + ${Math.sin(angle) * distance}px)
                ) scale(1)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        this.clickEffects.appendChild(emoji);
        setTimeout(() => emoji.remove(), duration);
    }
}

// Initialize cursor
document.addEventListener('DOMContentLoaded', () => {
    const kawaiiCursor = new KawaiiCursor();
});