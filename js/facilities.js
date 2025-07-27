/**
 * Christian Retreat Centre - Facilities Page JavaScript
 * This script handles functionality specific to the facilities page.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Facilities page initialized');
    
    // Initialize components
    initFacilitiesSlider();
    initFacilityTabs();
    initAvailabilityCheck();
});

/**
 * Facilities Slider Functionality
 */
function initFacilitiesSlider() {
    const sliders = document.querySelectorAll('.facility-slider');
    
    sliders.forEach(slider => {
        const slidesContainer = slider.querySelector('.slider-slides');
        const slideItems = slider.querySelectorAll('.slider-slide');
        const prevButton = slider.querySelector('.slider-prev');
        const nextButton = slider.querySelector('.slider-next');
        const paginationContainer = slider.querySelector('.slider-pagination');
        
        if (slideItems.length === 0) return;
        
        let currentSlide = 0;
        
        // Create pagination dots
        if (paginationContainer) {
            slideItems.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('pagination-dot');
                if (index === 0) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    goToSlide(index);
                });
                
                paginationContainer.appendChild(dot);
            });
        }
        
        // Set initial position
        updateSlider();
        
        // Previous button click
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slideItems.length) % slideItems.length;
                updateSlider();
            });
        }
        
        // Next button click
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slideItems.length;
                updateSlider();
            });
        }
        
        // Auto slide functionality
        let autoSlideInterval = setInterval(nextSlide, 5000);
        
        // Pause on hover
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 5000);
        });
        
        // Touch swipe functionality
        let touchStartX = 0;
        let touchEndX = 0;
        
        slider.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slider.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            // Detect swipe direction
            if (touchEndX < touchStartX) {
                // Swipe left - go to next slide
                currentSlide = (currentSlide + 1) % slideItems.length;
            } else if (touchEndX > touchStartX) {
                // Swipe right - go to previous slide
                currentSlide = (currentSlide - 1 + slideItems.length) % slideItems.length;
            }
            
            updateSlider();
        }
        
        // Go to specific slide
        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
        }
        
        // Next slide function
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slideItems.length;
            updateSlider();
        }
        
        // Update slider position and active states
        function updateSlider() {
            // Move slides container
            if (slidesContainer) {
                slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
            }
            
            // Update pagination dots
            if (paginationContainer) {
                const dots = paginationContainer.querySelectorAll('.pagination-dot');
                dots.forEach((dot, index) => {
                    if (index === currentSlide) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        }
    });
}

/**
 * Facility Tabs Functionality
 */
function initFacilityTabs() {
    const tabsContainer = document.querySelector('.facility-tabs');
    
    if (tabsContainer) {
        const tabButtons = tabsContainer.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to current button and content
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
}

/**
 * Availability Check Functionality
 */
function initAvailabilityCheck() {
    const availabilityForm = document.getElementById('availability-form');
    
    if (availabilityForm) {
        availabilityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const checkInDate = document.getElementById('check-in-date').value;
            const checkOutDate = document.getElementById('check-out-date').value;
            const guestCount = document.getElementById('guest-count').value;
            const facilityType = document.getElementById('facility-type').value;
            
            // Validate form
            if (!checkInDate || !checkOutDate || !guestCount || !facilityType) {
                showFormError('Please fill out all required fields');
                return;
            }
            
            // Check if check-in date is before check-out date
            const checkIn = new Date(checkInDate);
            const checkOut = new Date(checkOutDate);
            
            if (checkIn >= checkOut) {
                showFormError('Check-out date must be after check-in date');
                return;
            }
            
            // Show loading state
            const submitButton = availabilityForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
            
            // Hide any existing errors
            const existingError = document.querySelector('.availability-error');
            if (existingError) {
                existingError.remove();
            }
            
            // Simulate availability check (would be replaced with actual AJAX in production)
            setTimeout(() => {
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                
                // Show availability results
                showAvailabilityResults(checkInDate, checkOutDate, guestCount, facilityType);
            }, 1500);
        });
        
        // Function to show form error
        function showFormError(message) {
            // Remove any existing error
            const existingError = document.querySelector('.availability-error');
            if (existingError) {
                existingError.remove();
            }
            
            // Create and show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'availability-error';
            errorMessage.textContent = message;
            errorMessage.style.color = '#dc3545';
            errorMessage.style.marginTop = '1rem';
            
            availabilityForm.appendChild(errorMessage);
        }
        
        // Function to show availability results
        function showAvailabilityResults(checkInDate, checkOutDate, guestCount, facilityType) {
            // Get results container or create it
            let resultsContainer = document.querySelector('.availability-results');
            
            if (!resultsContainer) {
                resultsContainer = document.createElement('div');
                resultsContainer.className = 'availability-results';
                availabilityForm.parentNode.insertBefore(resultsContainer, availabilityForm.nextSibling);
            }
            
            // Parse dates for display
            const checkIn = new Date(checkInDate);
            const checkOut = new Date(checkOutDate);
            
            // Calculate number of nights
            const nights = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            
            // Format dates
            const formatDate = (date) => {
                return date.toLocaleDateString('en-NG', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            };
            
            // Sample availability data (would come from backend in production)
            const availability = {
                'standard-room': {
                    available: true,
                    price: 15000,
                    maxGuests: 2
                },
                'deluxe-room': {
                    available: true,
                    price: 25000,
                    maxGuests: 2
                },
                'family-suite': {
                    available: guestCount <= 4,
                    price: 40000,
                    maxGuests: 4
                },
                'retreat-cabin': {
                    available: guestCount <= 6,
                    price: 60000,
                    maxGuests: 6
                },
                'conference-hall': {
                    available: true,
                    price: 150000,
                    maxGuests: 200
                },
                'meeting-room': {
                    available: guestCount <= 30,
                    price: 50000,
                    maxGuests: 30
                }
            };
            
            // Check if selected facility is available
            const selectedFacility = availability[facilityType];
            
            // Generate results HTML
            resultsContainer.innerHTML = `
                <div class="results-header">
                    <h3>Availability Results</h3>
                    <p>For ${guestCount} guest(s), ${nights} night(s) from ${formatDate(checkIn)} to ${formatDate(checkOut)}</p>
                </div>
                
                <div class="results-content">
                    ${selectedFacility.available && guestCount <= selectedFacility.maxGuests ? `
                        <div class="availability-item available">
                            <div class="availability-status">
                                <i class="fas fa-check-circle"></i>
                                <span>Available</span>
                            </div>
                            <div class="availability-details">
                                <h4>${getFacilityName(facilityType)}</h4>
                                <p>₦${selectedFacility.price.toLocaleString()} per night</p>
                                <p>Total for ${nights} nights: ₦${(selectedFacility.price * nights).toLocaleString()}</p>
                            </div>
                            <div class="availability-action">
                                <a href="booking.html" class="btn btn-primary">Book Now</a>
                                <button class="btn btn-outline-primary mt-2 inquiry-btn">Make Inquiry</button>
                            </div>
                        </div>
                    ` : `
                        <div class="availability-item unavailable">
                            <div class="availability-status">
                                <i class="fas fa-times-circle"></i>
                                <span>Unavailable</span>
                            </div>
                            <div class="availability-details">
                                <h4>${getFacilityName(facilityType)}</h4>
                                <p>We're sorry, this facility is not available for your selected dates or guest count.</p>
                                <p>Maximum guests: ${selectedFacility.maxGuests}</p>
                            </div>
                            <div class="availability-action">
                                <button class="btn btn-outline-primary inquiry-btn">Make Inquiry</button>
                                <button class="btn btn-secondary mt-2 alternative-btn">See Alternatives</button>
                            </div>
                        </div>
                    `}
                    
                    <div class="alternative-options ${selectedFacility.available && guestCount <= selectedFacility.maxGuests ? 'mt-4' : ''}">
                        <h4>You might also be interested in:</h4>
                        <div class="alternatives-grid">
                            ${Object.keys(availability)
                                .filter(key => key !== facilityType)
                                .slice(0, 3)
                                .map(key => `
                                    <div class="alternative-item">
                                        <h5>${getFacilityName(key)}</h5>
                                        <p>₦${availability[key].price.toLocaleString()} per night</p>
                                        <p>Max guests: ${availability[key].maxGuests}</p>
                                        <button class="btn btn-sm btn-outline-primary check-btn" data-facility="${key}">Check Availability</button>
                                    </div>
                                `).join('')
                            }
                        </div>
                    </div>
                </div>
            `;
            
            // Add event listeners for alternative options
            resultsContainer.querySelectorAll('.check-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const facility = this.dataset.facility;
                    document.getElementById('facility-type').value = facility;
                    availabilityForm.dispatchEvent(new Event('submit'));
                });
            });
            
            // Add event listener for inquiry button
            resultsContainer.querySelectorAll('.inquiry-btn').forEach(button => {
                button.addEventListener('click', function() {
                    window.location.href = 'contact.html';
                });
            });
            
            // Add event listener for see alternatives button
            const alternativeBtn = resultsContainer.querySelector('.alternative-btn');
            if (alternativeBtn) {
                alternativeBtn.addEventListener('click', function() {
                    const alternativeOptions = resultsContainer.querySelector('.alternative-options');
                    alternativeOptions.scrollIntoView({ behavior: 'smooth' });
                });
            }
            
            // Scroll to results
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Helper function to get facility name from ID
        function getFacilityName(facilityId) {
            const facilityNames = {
                'standard-room': 'Standard Room',
                'deluxe-room': 'Deluxe Room',
                'family-suite': 'Family Suite',
                'retreat-cabin': 'Retreat Cabin',
                'conference-hall': 'Conference Hall',
                'meeting-room': 'Meeting Room'
            };
            
            return facilityNames[facilityId] || facilityId;
        }
    }
}