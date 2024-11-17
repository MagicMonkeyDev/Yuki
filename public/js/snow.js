class SnowEffect {
    constructor() {
        this.container = document.querySelector('.snow-container');
        this.count = 100; // Increased from 50 to 100
        this.snowflakes = [];
        
        this.colors = [
            'rgba(255, 121, 198, 0.8)', // Pink
            'rgba(189, 147, 249, 0.8)', // Purple
            'rgba(139, 233, 253, 0.8)', // Cyan
            'rgba(255, 255, 255, 0.8)', // White
            'rgba(241, 250, 140, 0.8)'  // Yellow
        ];
        
        this.initializeSnowflakes();
    }

    initializeSnowflakes() {
        this.container.innerHTML = '';
        this.snowflakes = [];

        for (let i = 0; i < this.count; i++) {
            this.createSnowflake(true);
        }

        this.animate();
    }

    createSnowflake(isInitial = false) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        const size = Math.random() * 5 + 2;
        const startingX = Math.random() * window.innerWidth;
        const timeToFall = Math.random() * 5 + 5;
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];

        const startingY = isInitial ? Math.random() * window.innerHeight : -10;

        Object.assign(snowflake.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${startingX}px`,
            top: `${startingY}px`,
            backgroundColor: color,
            opacity: Math.random() * 0.6 + 0.4
        });

        snowflake.style.animation = `fall ${timeToFall}s linear infinite`;
        snowflake.style.animationDelay = '0s';

        this.container.appendChild(snowflake);
        this.snowflakes.push({
            element: snowflake,
            x: startingX,
            speed: timeToFall
        });

        snowflake.addEventListener('animationend', () => {
            snowflake.remove();
            this.snowflakes = this.snowflakes.filter(s => s.element !== snowflake);
            this.createSnowflake();
        });
    }

    animate() {
        this.snowflakes.forEach(snowflake => {
            const newX = parseFloat(snowflake.element.style.left) + Math.sin(Date.now() / 1000) * 0.5;
            snowflake.element.style.left = `${newX}px`;
        });

        requestAnimationFrame(() => this.animate());
    }
}

const snowEffect = new SnowEffect();

window.addEventListener('resize', () => {
    snowEffect.initializeSnowflakes();
});