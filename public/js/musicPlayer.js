class SimpleAudioPlayer {
    constructor() {
        // Create audio element
        this.audio = new Audio();
        this.audio.src = 'music/Akari1.mp3'; // Updated path
        this.audio.volume = 0.2;
        this.audio.loop = true;

        // Create controls
        this.createControls();
        
        // Auto-play setup with user interaction
        document.addEventListener('click', () => {
            this.playAudio();
        }, { once: true });
    }

    createControls() {
        // Create container
        const controls = document.createElement('div');
        controls.className = 'audio-controls';
        controls.innerHTML = `
            <button class="play-button">▶️</button>
            <div class="volume-control">
                <span class="volume-icon">🔊</span>
                <input type="range" class="volume-slider" min="0" max="100" value="20">
            </div>
        `;

        // Add to document
        document.body.appendChild(controls);

        // Setup event listeners
        this.playButton = controls.querySelector('.play-button');
        this.volumeSlider = controls.querySelector('.volume-slider');

        this.playButton.addEventListener('click', () => this.togglePlay());
        this.volumeSlider.addEventListener('input', (e) => {
            this.audio.volume = e.target.value / 100;
        });

        // Audio event listeners
        this.audio.addEventListener('play', () => {
            this.playButton.textContent = '⏸️';
            this.updateSoundwave(true);
        });

        this.audio.addEventListener('pause', () => {
            this.playButton.textContent = '▶️';
            this.updateSoundwave(false);
        });
    }

    playAudio() {
        this.audio.play().catch(error => console.log('Playback prevented:', error));
    }

    togglePlay() {
        if (this.audio.paused) {
            this.playAudio();
        } else {
            this.audio.pause();
        }
    }

    updateSoundwave(isPlaying) {
        const spans = document.querySelectorAll('.soundwave span');
        spans.forEach(span => {
            span.style.animationPlayState = isPlaying ? 'running' : 'paused';
        });
    }
}

// Initialize player
document.addEventListener('DOMContentLoaded', () => {
    window.audioPlayer = new SimpleAudioPlayer();
});