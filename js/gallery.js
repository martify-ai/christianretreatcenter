/**
 * Christian Retreat Centre - Gallery Page JavaScript
 * This script handles functionality specific to the gallery page.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Gallery page initialized');
    
    // Initialize gallery components
    initGalleryFilters();
    initGalleryLightbox();
    initMasonryLayout();
});

/**
 * Gallery Filtering Functionality
 */
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.gallery-filter-button');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter category
                const filter = this.dataset.filter;
                
                // Filter gallery items with animation
                galleryItems.forEach(item => {
                    // First add transition
                    item.style.transition = 'all 0.3s ease';
                    
                    if (filter === 'all') {
                        // Show all items
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                            }, 10);
                        }, 300);
                    } else {
                        // Check if item has the category
                        if (item.dataset.category === filter) {
                            // Show item
                            item.style.opacity = '0';
                            setTimeout(() => {
                                item.style.display = 'block';
                                setTimeout(() => {
                                    item.style.opacity = '1';
                                }, 10);
                            }, 300);
                        } else {
                            // Hide item
                            item.style.opacity = '0';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    }
                });
                
                // Re-arrange masonry layout after filtering
                setTimeout(() => {
                    initMasonryLayout();
                }, 600);
            });
        });
    }
}

/**
 * Gallery Lightbox Functionality
 */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;
    let lightbox;
    
    // Create lightbox elements
    const createLightbox = () => {
        // Create lightbox container
        lightbox = document.createElement('div');
        lightbox.className = 'gallery-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close"><i class="fas fa-times"></i></button>
                <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
                <div class="lightbox-image-container">
                    <img src="" alt="Gallery Image" class="lightbox-image">
                </div>
                <div class="lightbox-caption"></div>
                <div class="lightbox-counter"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Add event listeners
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        
        // Close lightbox when clicking outside of content
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightbox || lightbox.style.display !== 'flex') return;
            
            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        });
        
        // Add lightbox styling
        const style = document.createElement('style');
        style.textContent = `
            .gallery-lightbox {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                z-index: 2000;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            
            .lightbox-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
            }
            
            .lightbox-image-container {
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                max-height: 80vh;
            }
            
            .lightbox-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
            }
            
            .lightbox-close, .lightbox-prev, .lightbox-next {
                position: absolute;
                background: rgba(0, 0, 0, 0.5);
                color: white;
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .lightbox-close:hover, .lightbox-prev:hover, .lightbox-next:hover {
                background: rgba(0, 0, 0, 0.8);
            }
            
            .lightbox-close {
                top: -25px;
                right: -25px;
            }
            
            .lightbox-prev {
                top: 50%;
                left: -25px;
                transform: translateY(-50%);
            }
            
            .lightbox-next {
                top: 50%;
                right: -25px;
                transform: translateY(-50%);
            }
            
            .lightbox-caption {
                color: white;
                text-align: center;
                margin-top: 10px;
                font-size: 16px;
            }
            
            .lightbox-counter {
                color: rgba(255, 255, 255, 0.7);
                text-align: center;
                margin-top: 5px;
                font-size: 14px;
            }
            
            @media (max-width: 768px) {
                .lightbox-prev, .lightbox-next {
                    width: 40px;
                    height: 40px;
                    font-size: 18px;
                }
            }
        `;
        document.head.appendChild(style);
    };
    
    // Create lightbox if not already created
    if (!document.querySelector('.gallery-lightbox')) {
        createLightbox();
    } else {
        lightbox = document.querySelector('.gallery-lightbox');
    }
    
    // Open lightbox with clicked image
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Only show visible items in lightbox
            const visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
            currentIndex = visibleItems.indexOf(item);
            
            openLightbox(item, visibleItems);
        });
    });
    
    // Open lightbox
    function openLightbox(item, visibleItems) {
        const imgSrc = item.querySelector('img').src;
        const caption = item.dataset.caption || '';
        
        // Set image and caption
        lightbox.querySelector('.lightbox-image').src = imgSrc;
        lightbox.querySelector('.lightbox-caption').textContent = caption;
        
        // Update counter
        lightbox.querySelector('.lightbox-counter').textContent = `${currentIndex + 1} / ${visibleItems.length}`;
        
        // Show lightbox
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Preload next and previous images
        if (visibleItems.length > 1) {
            const prevIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
            const nextIndex = (currentIndex + 1) % visibleItems.length;
            
            preloadImage(visibleItems[prevIndex].querySelector('img').src);
            preloadImage(visibleItems[nextIndex].querySelector('img').src);
        }
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Show previous image
    function showPrevImage() {
        const visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        
        const prevItem = visibleItems[currentIndex];
        openLightbox(prevItem, visibleItems);
    }
    
    // Show next image
    function showNextImage() {
        const visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
        currentIndex = (currentIndex + 1) % visibleItems.length;
        
        const nextItem = visibleItems[currentIndex];
        openLightbox(nextItem, visibleItems);
    }
    
    // Preload image for smoother transitions
    function preloadImage(src) {
        const img = new Image();
        img.src = src;
    }
}

/**
 * Masonry Layout for Gallery
 */
function initMasonryLayout() {
    const gallery = document.querySelector('.gallery-grid');
    
    if (gallery) {
        // Get visible items
        const visibleItems = Array.from(gallery.querySelectorAll('.gallery-item')).filter(item => item.style.display !== 'none');
        
        // Simple masonry layout
        const columns = getOptimalColumns();
        
        // Reset gallery layout
        gallery.style.columnCount = columns;
        gallery.style.columnGap = '20px';
        
        // Make each item display as block
        visibleItems.forEach(item => {
            item.style.breakInside = 'avoid';
            item.style.marginBottom = '20px';
        });
    }
    
    // Function to determine optimal number of columns based on screen width
    function getOptimalColumns() {
        const windowWidth = window.innerWidth;
        
        if (windowWidth > 1200) return 4;
        if (windowWidth > 900) return 3;
        if (windowWidth > 600) return 2;
        return 1;
    }
    
    // Update layout on window resize
    window.addEventListener('resize', debounce(function() {
        initMasonryLayout();
    }, 200));
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @return {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}