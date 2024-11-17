class PhoneNotifications {
    constructor() {
        this.phoneContainer = document.querySelector('.phone-container');
        this.notificationArea = document.querySelector('.notification-area');
        this.minimizeBtn = document.querySelector('.minimize-btn');
        this.statusTime = document.querySelector('.status-bar .time');
        this.isMinimized = false;
        
        // Replace with your Twitter credentials
        this.twitterConfig = {
            username: 'YourTwitterHandle',
            bearerToken: 'YOUR_BEARER_TOKEN'
        };

        this.init();
    }

    init() {
        this.setupMinimizeButton();
        this.updateStatusTime();
        this.loadTweets();
        
        // Update time every minute
        setInterval(() => this.updateStatusTime(), 60000);
        // Refresh tweets every 5 minutes
        setInterval(() => this.loadTweets(), 300000);
    }

    setupMinimizeButton() {
        this.minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMinimize();
        });

        this.phoneContainer.addEventListener('click', () => {
            if (this.isMinimized) {
                this.toggleMinimize();
            }
        });
    }

    updateStatusTime() {
        const now = new Date();
        this.statusTime.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    async loadTweets() {
        try {
            const response = await fetch(`https://api.twitter.com/2/users/by/username/${this.twitterConfig.username}/tweets?max_results=10&tweet.fields=created_at,public_metrics`, {
                headers: {
                    'Authorization': `Bearer ${this.twitterConfig.bearerToken}`
                }
            });

            const data = await response.json();
            this.displayTweets(data.data);
        } catch (error) {
            console.error('Error fetching tweets:', error);
            this.displayFallbackTweets();
        }
    }

    displayTweets(tweets) {
        this.notificationArea.innerHTML = '';
        tweets.forEach((tweet, index) => {
            setTimeout(() => {
                this.addTweet(tweet);
            }, index * 300);
        });
    }

    addTweet(tweet) {
        const tweetElement = document.createElement('div');
        tweetElement.className = 'tweet';
        
        const timeAgo = this.getTimeAgo(new Date(tweet.created_at));
        
        tweetElement.innerHTML = `
            <div class="tweet-header">
                <span class="tweet-time">${timeAgo}</span>
            </div>
            <div class="tweet-content">${tweet.text}</div>
            <div class="tweet-actions">
                <span class="tweet-action">♥ ${tweet.public_metrics.like_count}</span>
                <span class="tweet-action">⟲ ${tweet.public_metrics.retweet_count}</span>
            </div>
        `;

        tweetElement.style.opacity = '0';
        tweetElement.style.transform = 'translateY(20px)';
        this.notificationArea.appendChild(tweetElement);

        requestAnimationFrame(() => {
            tweetElement.style.transition = 'all 0.3s ease';
            tweetElement.style.opacity = '1';
            tweetElement.style.transform = 'translateY(0)';
        });
    }

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + 'y';
        
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + 'mo';
        
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + 'd';
        
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + 'h';
        
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + 'm';
        
        return Math.floor(seconds) + 's';
    }

    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        this.phoneContainer.classList.toggle('minimized');
        this.minimizeBtn.textContent = this.isMinimized ? '+' : '−';
    }

    displayFallbackTweets() {
        // Display sample tweets if API fails
        const sampleTweets = [
            {
                text: "✨ Just launched something new! Check it out!",
                created_at: new Date(Date.now() - 120000).toISOString(),
                public_metrics: { like_count: 42, retweet_count: 12 }
            },
            // Add more sample tweets...
        ];
        this.displayTweets(sampleTweets);
    }
}

// Initialize phone
document.addEventListener('DOMContentLoaded', () => {
    const phoneNotifications = new PhoneNotifications();
});