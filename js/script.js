/* ============================================
   ESS SOLUTION - Main JavaScript
   Interactivity | Animations | Performance
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        disable: 'mobile' // Disable on mobile for better performance
    });

    // Re-enable AOS on mobile with simpler animations
    if (window.innerWidth <= 768) {
        AOS.init({
            duration: 600,
            easing: 'ease-out',
            once: true,
            offset: 30
        });
    }
});

// ===== HEADER SCROLL EFFECT =====
const headerWrapper = document.getElementById('headerWrapper');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;

    // Header wrapper shadow on scroll
    if (scrollY > 50) {
        headerWrapper.classList.add('scrolled');
    } else {
        headerWrapper.classList.remove('scrolled');
    }

    // Back to Top button visibility
    if (scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Active nav link based on scroll position
    updateActiveNavLink();
});

// ===== BACK TO TOP =====
backToTop.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== MOBILE MENU TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Close menu when clicking outside
document.addEventListener('click', function (e) {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

// ===== ACTIVE NAV LINK BASED ON SCROLL =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== STATS COUNTER ANIMATION =====
const statCounters = document.querySelectorAll('.stat-counter');
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;

    statCounters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (!target) return;

        const duration = 2000; // Animation duration in ms
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });

    statsAnimated = true;
}

// Trigger stats animation when stats section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
}

// ===== TESTIMONIAL SLIDER =====
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
let currentTestimonial = 0;
let testimonialInterval;

function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
        card.classList.remove('active');
        dots[i]?.classList.remove('active');
    });

    if (testimonialCards[index]) {
        testimonialCards[index].classList.add('active');
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }
    currentTestimonial = index;
}

function nextTestimonial() {
    const next = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(next);
}

// Dot click handlers
dots.forEach(dot => {
    dot.addEventListener('click', function () {
        const index = parseInt(this.getAttribute('data-index'));
        showTestimonial(index);
        resetTestimonialInterval();
    });
});

// Auto rotate testimonials
function startTestimonialInterval() {
    if (testimonialCards.length > 1) {
        testimonialInterval = setInterval(nextTestimonial, 4000);
    }
}

function resetTestimonialInterval() {
    clearInterval(testimonialInterval);
    startTestimonialInterval();
}

// Initialize testimonial slider
if (testimonialCards.length > 0) {
    showTestimonial(0);
    startTestimonialInterval();

    // Pause on hover
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        testimonialSlider.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
        testimonialSlider.addEventListener('mouseleave', startTestimonialInterval);
    }
}

// ===== BODY SCROLL LOCK FOR MOBILE MENU =====
const bodyStyle = document.createElement('style');
bodyStyle.textContent = `
    body.menu-open {
        overflow: hidden;
    }

    /* Optional overlay when mobile menu is open */
    @media (max-width: 768px) {
        body.menu-open::after {
            content: '';
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            z-index: 999;
            transition: opacity 0.3s ease;
        }
    }
`;
document.head.appendChild(bodyStyle);

// ===== PARALLAX EFFECT FOR HERO SHAPES (Desktop only) =====
if (window.innerWidth > 768) {
    window.addEventListener('mousemove', function (e) {
        const shapes = document.querySelectorAll('.shape');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        shapes.forEach((shape, index) => {
            const factor = (index + 1) * 15;
            const moveX = (x - 0.5) * factor;
            const moveY = (y - 0.5) * factor;
            shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

// ===== SERVICE CARD HOVER ENHANCEMENT =====
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-8px)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});

// ===== PERFORMANCE: Debounce scroll handler =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounced scroll for better performance
let ticking = false;
window.addEventListener('scroll', function () {
    if (!ticking) {
        window.requestAnimationFrame(function () {
            // Header visibility and active nav are already handled in main scroll listener
            ticking = false;
        });
        ticking = true;
    }
});

console.log('%c ESS Solution %c Website Ready ',
    'background: #2563eb; color: white; padding: 8px 12px; border-radius: 4px 0 0 4px; font-weight: bold;',
    'background: #06b6d4; color: white; padding: 8px 12px; border-radius: 0 4px 4px 0;'
);
console.log('%c🚀 Powered with excellence | %cesssolutioninfo@gmail.com',
    'color: #334155;', 'color: #2563eb; font-weight: bold;'
);
