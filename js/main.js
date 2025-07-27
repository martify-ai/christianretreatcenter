/**
 * Christian Retreat Centre - Main JavaScript
 * This script handles functionality across the entire website.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Christian Retreat Centre website loaded');
    
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initWhatsAppButton();
    initModals();
    initFAQs();
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = mobileMenuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.mobile-menu-toggle') && 
                !event.target.closest('.nav-menu') && 
                navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Highlight current page in navigation
    highlightCurrentPage();
}

/**
 * Highlight the current page in the navigation menu
 */
function highlightCurrentPage() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        // Get the href attribute and extract the filename
        const linkHref = link.getAttribute('href');
        
        // If the current page matches the link or if we're on index.html and the link is to the home page
        if (currentPage.includes(linkHref) || 
            (currentPage.endsWith('/') && linkHref === 'index.html') ||
            (currentPage.endsWith('html_template/') && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * Scroll effects for header and back-to-top button
 */
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    // Add scroll event listener
    window.addEventListener('scroll', function() {
        // Add 'scrolled' class to header when page is scrolled
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Trigger the scroll event on page load to set initial state
    window.dispatchEvent(new Event('scroll'));
}

/**
 * WhatsApp Button Animation
 */
function initWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    
    if (whatsappBtn) {
        // Add a subtle animation to draw attention
        setInterval(() => {
            whatsappBtn.classList.add('pulse');
            
            setTimeout(() => {
                whatsappBtn.classList.remove('pulse');
            }, 1000);
        }, 5000);
    }
}

/**
 * Modal functionality (Privacy Policy, Terms & Conditions)
 */
function initModals() {
    // Privacy Policy Modal
    const privacyLinks = document.querySelectorAll('.privacy-link');
    const privacyModal = document.getElementById('privacy-modal');
    
    if (privacyLinks.length > 0 && privacyModal) {
        privacyLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                privacyModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close modal functionality
        const closeModalBtn = privacyModal.querySelector('.close-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                privacyModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        
        // Close modal when clicking outside of content
        privacyModal.addEventListener('click', function(e) {
            if (e.target === privacyModal) {
                privacyModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Generic function for any other modals
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.dataset.modal;
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

/**
 * FAQ accordion functionality
 */
function initFAQs() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                // Toggle the active class
                item.classList.toggle('active');
                
                // Update the icon
                const icon = question.querySelector('.faq-toggle i');
                if (item.classList.contains('active')) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                } else {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
            });
        });
    }
}

/**
 * Animate elements when they come into view
 * Note: This is a simple implementation. For production, consider using
 * a library like AOS (Animate on Scroll) for more robust functionality.
 */
function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.animate');
    
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    };
    
    const handleScroll = () => {
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('animated');
            }
        });
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Trigger initially
    handleScroll();
}

/**
 * Utility function to format dates
 * @param {Date} date - Date object to format
 * @param {string} format - Format string (optional)
 * @return {string} Formatted date string
 */
function formatDate(date, format = 'long') {
    if (!date) return '';
    
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    switch (format) {
        case 'short':
            return `${day} ${monthsShort[month]} ${year}`;
        case 'numeric':
            return `${day}/${month + 1}/${year}`;
        case 'month-year':
            return `${months[month]} ${year}`;
        default:
            return `${day} ${months[month]} ${year}`;
    }
}

/**
 * Add custom animation class for WhatsApp button
 */
document.head.insertAdjacentHTML('beforeend', `
    <style>
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .pulse {
            animation: pulse 1s ease;
        }
    </style>
`);