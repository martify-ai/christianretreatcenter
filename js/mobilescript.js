document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile menu fix initialized');

    // Force reload main.js to ensure it's properly loaded
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Add additional event listener to ensure it works
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            console.log('Mobile menu toggle clicked');

            // Toggle visibility with !important to override any other styles
            if (navMenu.style.display === 'block') {
                navMenu.style.display = 'none';

                // Change icon
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            } else {
                navMenu.style.display = 'block';

                // Change icon
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-times';
                }
            }
        });
    }
});