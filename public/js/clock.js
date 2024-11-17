class KawaiiClock {
    constructor() {
        this.clockContainer = document.querySelector('.clock-container');
        this.clockTime = document.querySelector('.clock-time');
        this.clockDate = document.querySelector('.clock-date');
        this.clockFace = document.querySelector('.clock-face');
        
        this.kawaiiFaces = [
            '(｡♥‿♥｡)',
            '(◕‿◕✿)',
            '(づ｡◕‿‿◕｡)づ',
            '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',
            '(◠‿◠✿)',
            '(✿◠‿◠)',
            '(◕‿◕)',
            '(｡◕‿◕｡)'
        ];

        this.init();
    }

    init() {
        // Start the clock
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);

        // Add hover effect
        this.clockContainer.addEventListener('mouseenter', () => {
            this.clockContainer.style.transform = 'translateY(-5px)';
            this.clockContainer.style.borderColor = '#bd93f9';
        });

        this.clockContainer.addEventListener('mouseleave', () => {
            this.clockContainer.style.transform = 'translateY(0)';
            this.clockContainer.style.borderColor = '#ff79c6';
        });
    }

    updateClock() {
        const now = new Date();
        
        // Update time
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        this.clockTime.innerHTML = `${hours}<span class="dots">:</span>${minutes}<span class="dots">:</span>${seconds}`;
        
        // Update date
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const dayName = days[now.getDay()];
        const monthName = months[now.getMonth()];
        const date = now.getDate();
        
        this.clockDate.textContent = `${dayName}, ${monthName} ${date}`;
        
        // Change kawaii face every minute
        if (seconds === '00') {
            this.updateKawaiiFace();
        }
    }

    updateKawaiiFace() {
        const randomFace = this.kawaiiFaces[Math.floor(Math.random() * this.kawaiiFaces.length)];
        this.clockFace.textContent = randomFace;
    }
}

// Initialize clock
document.addEventListener('DOMContentLoaded', () => {
    const kawaiiClock = new KawaiiClock();
});