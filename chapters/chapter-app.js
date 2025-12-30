// Chapter-specific JavaScript functionality
// Includes navbar auto-hide with blackhole video switching

// Navbar and blackhole video elements
const navbar = document.querySelector('header');
const blackholeOriginal = document.getElementById('blackhole-original');
const blackholeCropped = document.getElementById('blackhole-cropped');
const blackholeContainer = document.querySelector('.blackhole-box');

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

// Chapter-specific navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navBubbles = document.querySelectorAll('.nav-bubble');
    
    navBubbles.forEach(bubble => {
        bubble.addEventListener('click', function() {
            const text = this.textContent.toLowerCase();
            
            if (text === 'chapters') {
                window.location.href = '../index.html#chapters';
            } else if (text === 'about') {
                window.location.href = '../index.html#about';
            } else if (text === 'topics') {
                window.location.href = '../index.html#topics';
            }
        });
    });
});