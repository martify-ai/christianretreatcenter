/**
 * Christian Retreat Centre - Services Page JavaScript
 * This script handles functionality specific to the services page.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Services page initialized');
    
    // Initialize components
    initServiceTabs();
    initPackageSelection();
    initTestimonialSlider();
    initCostCalculator();
});

/**
 * Service Tabs Functionality
 */
function initServiceTabs() {
    const tabsContainer = document.querySelector('.service-tabs');
    
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
 * Package Selection Functionality
 */
function initPackageSelection() {
    const packageCards = document.querySelectorAll('.package-card');
    
    if (packageCards.length > 0) {
        packageCards.forEach(card => {
            const selectBtn = card.querySelector('.select-package-btn');
            
            if (selectBtn) {
                selectBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Get package details
                    const packageName = card.querySelector('h3').textContent;
                    const packagePrice = card.querySelector('.package-price').dataset.price;
                    
                    // Store selected package in session storage
                    sessionStorage.setItem('selectedPackage', packageName);
                    sessionStorage.setItem('packagePrice', packagePrice);
                    
                    // Redirect to booking page
                    window.location.href = 'booking.html';
                });
            }
            
            // Add hover effect
            card.addEventListener('mouseenter', function() {
                this.classList.add('hover');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('hover');
            });
        });
    }
}

/**
 * Testimonial Slider Functionality
 */
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    
    if (slider) {
        const slidesContainer = slider.querySelector('.testimonial-slides');
        const slideItems = slider.querySelectorAll('.testimonial-slide');
        const prevButton = slider.querySelector('.slider-prev');
        const nextButton = slider.querySelector('.slider-next');
        const dotsContainer = slider.querySelector('.slider-dots');
        
        if (slideItems.length === 0) return;
        
        let currentSlide = 0;
        
        // Create pagination dots
        if (dotsContainer) {
            slideItems.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('slider-dot');
                if (index === 0) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    goToSlide(index);
                });
                
                dotsContainer.appendChild(dot);
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
        let autoSlideInterval = setInterval(nextSlide, 6000);
        
        // Pause on hover
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 6000);
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
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.slider-dot');
                dots.forEach((dot, index) => {
                    if (index === currentSlide) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        }
    }
}

/**
 * Cost Calculator Functionality
 */
function initCostCalculator() {
    const calculator = document.getElementById('cost-calculator');
    
    if (calculator) {
        const guestCountInput = document.getElementById('calc-guest-count');
        const daysInput = document.getElementById('calc-days');
        const accommodationSelect = document.getElementById('calc-accommodation');
        const mealPlanSelect = document.getElementById('calc-meal-plan');
        const additionalServicesCheckboxes = document.querySelectorAll('.additional-service-checkbox');
        const resultContainer = document.getElementById('calculator-result');
        
        // Rates object (would come from server in production)
        const rates = {
            accommodation: {
                'standard-room': 15000,
                'deluxe-room': 25000,
                'family-suite': 40000,
                'retreat-cabin': 60000,
                'dormitory': 8000
            },
            mealPlan: {
                'no-meals': 0,
                'breakfast-only': 3500,
                'half-board': 6500,
                'full-board': 9500
            },
            additionalServices: {
                'airport-transfer': 15000,
                'guided-meditation': 5000,
                'devotional-materials': 2500,
                'private-worship': 10000,
                'pastoral-counseling': 7500
            }
        };
        
        // Listen for input changes and calculate cost
        const inputElements = [guestCountInput, daysInput, accommodationSelect, mealPlanSelect, ...additionalServicesCheckboxes];
        
        inputElements.forEach(element => {
            element.addEventListener('change', calculateCost);
        });
        
        // Initial calculation
        calculateCost();
        
        // Calculate and update cost
        function calculateCost() {
            // Get input values
            const guestCount = parseInt(guestCountInput.value) || 1;
            const days = parseInt(daysInput.value) || 1;
            const accommodation = accommodationSelect.value;
            const mealPlan = mealPlanSelect.value;
            
            // Calculate accommodation cost
            let accommodationCost = rates.accommodation[accommodation] * guestCount * days;
            
            // Calculate meal plan cost
            let mealPlanCost = rates.mealPlan[mealPlan] * guestCount * days;
            
            // Calculate additional services cost
            let additionalServicesCost = 0;
            additionalServicesCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    const serviceId = checkbox.id.replace('service-', '');
                    additionalServicesCost += rates.additionalServices[serviceId];
                }
            });
            
            // Calculate total cost
            const totalCost = accommodationCost + mealPlanCost + additionalServicesCost;
            
            // Update result
            updateResult(accommodationCost, mealPlanCost, additionalServicesCost, totalCost);
        }
        
        // Update result display
        function updateResult(accommodationCost, mealPlanCost, additionalServicesCost, totalCost) {
            if (resultContainer) {
                resultContainer.innerHTML = `
                    <div class="result-header">
                        <h3>Estimated Cost</h3>
                    </div>
                    <div class="result-breakdown">
                        <div class="result-item">
                            <span class="result-label">Accommodation:</span>
                            <span class="result-value">₦${accommodationCost.toLocaleString()}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Meals:</span>
                            <span class="result-value">₦${mealPlanCost.toLocaleString()}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Additional Services:</span>
                            <span class="result-value">₦${additionalServicesCost.toLocaleString()}</span>
                        </div>
                        <div class="result-item result-total">
                            <span class="result-label">Total:</span>
                            <span class="result-value">₦${totalCost.toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="result-note">
                        <p>* This is an estimate. Final prices may vary.</p>
                    </div>
                    <div class="result-actions">
                        <a href="booking.html" class="btn btn-primary">Book Now</a>
                        <button id="share-estimate" class="btn btn-outline-primary">Share Estimate</button>
                    </div>
                `;
                
                // Add share functionality
                const shareButton = document.getElementById('share-estimate');
                if (shareButton) {
                    shareButton.addEventListener('click', function() {
                        const guestCount = parseInt(guestCountInput.value) || 1;
                        const days = parseInt(daysInput.value) || 1;
                        
                        // Create shareable text
                        const shareText = `My retreat estimate at Christian Retreat Centre: ₦${totalCost.toLocaleString()} for ${guestCount} guest(s) for ${days} day(s). Check it out!`;
                        
                        // Check if Web Share API is available
                        if (navigator.share) {
                            navigator.share({
                                title: 'Christian Retreat Centre - Cost Estimate',
                                text: shareText,
                                url: window.location.href
                            })
                            .catch(console.error);
                        } else {
                            // Fallback: copy to clipboard
                            const textarea = document.createElement('textarea');
                            textarea.value = shareText;
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textarea);
                            
                            // Show copied notification
                            const notification = document.createElement('div');
                            notification.className = 'copy-notification';
                            notification.textContent = 'Estimate copied to clipboard!';
                            notification.style.position = 'fixed';
                            notification.style.bottom = '20px';
                            notification.style.left = '50%';
                            notification.style.transform = 'translateX(-50%)';
                            notification.style.backgroundColor = '#4d7c40';
                            notification.style.color = 'white';
                            notification.style.padding = '10px 20px';
                            notification.style.borderRadius = '5px';
                            notification.style.zIndex = '1000';
                            
                            document.body.appendChild(notification);
                            
                            setTimeout(() => {
                                document.body.removeChild(notification);
                            }, 3000);
                        }
                    });
                }
            }
        }
    }
}