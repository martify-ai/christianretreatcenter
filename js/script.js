// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    console.log('Christian Retreat Centre - Website Initialized');
    
    // Load page-specific scripts based on current page
    loadPageScripts();
});

/**
 * Load page-specific JavaScript files based on current page
 */
function loadPageScripts() {
    // Get the current page filename
    const path = window.location.pathname;
    const page = path.split("/").pop();
    
    // Default script for all pages
    loadScript('/js/main.js');
    
    // Load page-specific scripts
    switch(page) {
        case 'index.html':
        case '':
            // Home page scripts
            break;
        case 'about.html':
            // About page scripts
            break;
        case 'facilities.html':
            loadScript('/js/facilities.js');
            break;
        case 'services.html':
            loadScript('/js/services.js');
            break;
        case 'gallery.html':
            loadScript('/js/gallery.js');
            break;
        case 'events.html':
            loadScript('/js/events.js');
            break;
        case 'booking.html':
            loadScript('/js/booking.js');
            break;
        case 'contact.html':
            loadScript('/js/contact.js');
            break;
    }
}

/**
 * Helper function to load a script dynamically
 * @param {string} src - Script source path
 */
function loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
}