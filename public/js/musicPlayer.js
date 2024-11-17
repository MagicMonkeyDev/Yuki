class SimpleAudioPlayer {
    constructor() {
        // Remove any existing volume controls first
        const existingControls = document.querySelectorAll('.volume-control-container');
        existingControls.forEach(control => control.remove());

        this.audio = new Audio('/public/music/Akari.mp3');
        this.audio.volume = 0.2; // Start at 20% volume
        this.audio.loop = true;
        
        this.init();
        this.setupSoundwaveSync();
    }

    init() {
        // Create only volume control HTML
        const volumeControlHTML = `
            <div class="volume-control-container">
                <div class="volume-icon">🔊</div>
                <input type="range" class="volume-slider" min="0" max="100" value="20">
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', volumeControlHTML);
        
        this.volumeSlider = document.querySelector('.volume-slider');
        
        this.volumeSlider.addEventListener('input', (e) => {
            this.audio.volume = e.target.value / 100;
        });

        // Start playing when possible
        document.addEventListener('click', () => {
            this.audio.play().catch(console.error);
        }, { once: true });
    }

    setupSoundwaveSync() {
        const updateSoundwave = (isPlaying) => {
            const spans = document.querySelectorAll('.soundwave span');
            spans.forEach(span => {
                span.style.animationPlayState = isPlaying ? 'running' : 'paused';
            });
        };

        // Add event listeners for play/pause
        this.audio.addEventListener('play', () => updateSoundwave(true));
        this.audio.addEventListener('pause', () => updateSoundwave(false));
        this.audio.addEventListener('ended', () => updateSoundwave(false));

        // Initial state
        updateSoundwave(false);
    }
}

// Initialize audio player only once
if (!window.audioPlayer) {
    window.audioPlayer = new SimpleAudioPlayer();
}