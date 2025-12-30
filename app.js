// Project videos - check if elements exist before accessing
const video1 = document.getElementById('projectVideo1');
const video2 = document.getElementById('projectVideo2');
const video3 = document.getElementById('projectVideo3');

// Navbar and blackhole video elements
const navbar = document.querySelector('header');
const blackholeOriginal = document.getElementById('blackhole-original');
const blackholeCropped = document.getElementById('blackhole-cropped');
const blackholeContainer = document.querySelector('.blackhole-box');

// Filter out null videos
const videoList = [video1, video2, video3].filter(video => video !== null);

// Simple navbar auto-hide
let hideTimer;
let navbarHidden = false;
let canHide = true;

function hideNavbar() {
    if (!canHide || navbarHidden) return;

    console.log('Hiding navbar - switching to cropped video');
    navbar.style.transform = 'translateY(-100%)';
    navbar.style.opacity = '0';
    navbarHidden = true;

    // Apply positioning and remove previous animation
    blackholeContainer.classList.add('navbar-hidden');
    blackholeContainer.classList.remove('blackhole-fade-down');

    // Add fade-down animation after transition
    setTimeout(() => {
        blackholeContainer.classList.add('blackhole-fade-down');
    }, 50);
}

function showNavbar() {
    if (!navbarHidden) return;

    console.log('Showing navbar - switching to original video');
    navbar.style.transform = 'translateY(0)';
    navbar.style.opacity = '1';
    navbarHidden = false;

    // Reset positioning and remove previous animation
    blackholeContainer.classList.remove('navbar-hidden');
    blackholeContainer.classList.remove('blackhole-fade-down');

    // Add fade-down animation after transition
    setTimeout(() => {
        blackholeContainer.classList.add('blackhole-fade-down');
    }, 50);

    // Restart timer after showing
    startHideTimer();
}

function startHideTimer() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideNavbar, 3000);
}

// Start initial timer
startHideTimer();

// Show navbar on mouse move to top
document.addEventListener('mousemove', (e) => {
    if (navbarHidden && e.clientY < 80) {
        showNavbar();
    }
});

// Prevent hiding when hovering navbar
navbar.addEventListener('mouseenter', () => {
    canHide = false;
    clearTimeout(hideTimer);
});

navbar.addEventListener('mouseleave', () => {
    canHide = true;
    startHideTimer();
});

videoList.forEach(function (video) {
    video.addEventListener("mouseover", function () {
        video.play()
    })
    video.addEventListener("mouseout", function () {
        video.pause();
    })
})

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navBubbles = document.querySelectorAll('.nav-bubble');
    
    navBubbles.forEach(bubble => {
        bubble.addEventListener('click', function() {
            const text = this.textContent.toLowerCase();
            
            if (text === 'chapters') {
                document.getElementById('chapters').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            } else if (text === 'about') {
                document.getElementById('about').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            } else if (text === 'topics') {
                document.getElementById('topics').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    });

    // Start Reading button functionality
    const startButton = document.querySelector('.hero-info button');
    if (startButton) {
        startButton.addEventListener('click', function() {
            document.getElementById('about').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }

    // Initialize chapter stats on homepage
    initializeChapterStats();
})


// Chapter Stats Functionality
function initializeChapterStats() {
    if (typeof chapterDB === 'undefined') return;
    
    const chapterCards = document.querySelectorAll('.chapter-card');
    const allStats = chapterDB.getAllChapterStats();
    
    chapterCards.forEach((card, index) => {
        const chapterNumber = index + 1;
        const chapterId = `chapter${chapterNumber}`;
        const stats = allStats[chapterId];
        
        if (stats) {
            // Create stats element
            const statsHTML = `
                <div class="chapter-stats">
                    <div class="chapter-likes">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span>${stats.likes}</span>
                    </div>
                    <div class="chapter-comments">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span>${stats.comments.length}</span>
                    </div>
                </div>
            `;
            
            // Append to chapter card
            card.insertAdjacentHTML('beforeend', statsHTML);
        }
    });
}

// Update stats when returning from chapter page
window.addEventListener('focus', () => {
    // Refresh stats when user returns to homepage
    setTimeout(() => {
        const existingStats = document.querySelectorAll('.chapter-stats');
        existingStats.forEach(stat => stat.remove());
        initializeChapterStats();
    }, 100);
});