/**
 * Christian Retreat Centre - Events Page JavaScript
 * This script handles functionality specific to the events page.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Events page initialized');
    
    // Initialize events components
    initEventFilters();
    initEventModal();
    initCalendar();
    initRegistrationForm();
});

/**
 * Event Filtering Functionality
 */
function initEventFilters() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const eventCards = document.querySelectorAll('.event-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter category
                const filter = this.dataset.filter;
                
                // Filter event cards
                eventCards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                    } else {
                        if (card.dataset.category === filter) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }
}

/**
 * Event Modal Functionality
 */
function initEventModal() {
    const eventModal = document.getElementById('event-modal');
    const eventCards = document.querySelectorAll('.event-card, .past-event-card');
    const modalClose = document.querySelector('.event-modal-close');
    
    if (eventModal && eventCards.length > 0) {
        // Open modal when clicking event cards
        eventCards.forEach(card => {
            card.addEventListener('click', function() {
                // Get event details
                const eventTitle = this.querySelector('h3').textContent;
                const eventDate = this.dataset.date || 'TBD';
                const eventTime = this.dataset.time || '10:00 AM - 4:00 PM';
                const eventLocation = this.dataset.location || 'Main Hall, Christian Retreat Centre';
                const eventCategory = this.dataset.category || 'Event';
                const eventDescription = this.dataset.description || 'No description available.';
                const eventImageSrc = this.querySelector('img')?.src || '';
                
                // Populate modal content
                document.querySelector('.event-modal-title h2').textContent = eventTitle;
                document.querySelector('.event-modal-date').innerHTML = `<i class="far fa-calendar-alt"></i> ${formatEventDate(eventDate)}`;
                document.querySelector('.event-modal-time').innerHTML = `<i class="far fa-clock"></i> ${eventTime}`;
                document.querySelector('.event-modal-location').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${eventLocation}`;
                document.querySelector('.event-modal-category').innerHTML = `<i class="fas fa-tag"></i> ${eventCategory}`;
                document.querySelector('.event-modal-description').innerHTML = eventDescription;
                
                // Set image if available
                const modalImage = document.querySelector('.event-modal-image img');
                if (modalImage) {
                    modalImage.src = eventImageSrc;
                }
                
                // Show modal
                eventModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close modal when clicking X
        if (modalClose) {
            modalClose.addEventListener('click', function() {
                eventModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        
        // Close modal when clicking outside of content
        eventModal.addEventListener('click', function(e) {
            if (e.target === eventModal) {
                eventModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

/**
 * Calendar Functionality
 */
function initCalendar() {
    const calendarContainer = document.querySelector('.calendar-grid');
    const calendarTitle = document.querySelector('.calendar-title');
    const prevMonthBtn = document.querySelector('.calendar-prev');
    const nextMonthBtn = document.querySelector('.calendar-next');
    
    if (calendarContainer && calendarTitle) {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        
        // Sample events data (would be loaded from backend in production)
        const events = [
            { title: 'Family Retreat', date: '2023-07-10', category: 'retreat' },
            { title: 'Worship Night', date: '2023-07-15', category: 'worship' },
            { title: 'Bible Study Workshop', date: '2023-07-22', category: 'workshop' },
            { title: 'Couples Retreat', date: '2023-07-25', category: 'retreat' },
            { title: 'Youth Conference', date: '2023-08-05', category: 'conference' }
        ];
        
        // Initial calendar render
        renderCalendar(currentMonth, currentYear);
        
        // Previous month button
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', function() {
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                renderCalendar(currentMonth, currentYear);
            });
        }
        
        // Next month button
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', function() {
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
                renderCalendar(currentMonth, currentYear);
            });
        }
        
        // Function to render the calendar
        function renderCalendar(month, year) {
            // Update title
            if (calendarTitle) {
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                               'July', 'August', 'September', 'October', 'November', 'December'];
                calendarTitle.textContent = `${months[month]} ${year}`;
            }
            
            // Get first day of month and number of days
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            // Clear calendar
            calendarContainer.innerHTML = '';
            
            // Add day headers
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            days.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.className = 'calendar-day-header';
                dayHeader.textContent = day;
                calendarContainer.appendChild(dayHeader);
            });
            
            // Add empty cells for days before first day of month
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day inactive';
                calendarContainer.appendChild(emptyDay);
            }
            
            // Today's date for highlighting
            const today = new Date();
            const todayDate = today.getDate();
            const todayMonth = today.getMonth();
            const todayYear = today.getFullYear();
            
            // Add calendar days
            for (let day = 1; day <= daysInMonth; day++) {
                const calendarDay = document.createElement('div');
                calendarDay.className = 'calendar-day';
                
                // Check if this is today
                if (day === todayDate && month === todayMonth && year === todayYear) {
                    calendarDay.classList.add('today');
                }
                
                // Add day number
                const dayNumber = document.createElement('div');
                dayNumber.className = 'day-number';
                dayNumber.textContent = day;
                calendarDay.appendChild(dayNumber);
                
                // Add events for this day
                const eventsForDay = events.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate.getDate() === day && 
                           eventDate.getMonth() === month && 
                           eventDate.getFullYear() === year;
                });
                
                eventsForDay.forEach(event => {
                    const eventElement = document.createElement('div');
                    eventElement.className = 'day-event';
                    if (event.category === 'retreat' || event.category === 'conference') {
                        eventElement.classList.add('special');
                    }
                    eventElement.textContent = event.title;
                    
                    // Show event details on click
                    eventElement.addEventListener('click', function(e) {
                        e.stopPropagation();
                        showEventDetails(event);
                    });
                    
                    calendarDay.appendChild(eventElement);
                });
                
                calendarContainer.appendChild(calendarDay);
            }
        }
        
        // Function to show event details
        function showEventDetails(event) {
            const eventModal = document.getElementById('event-modal');
            
            if (eventModal) {
                // Populate modal content
                document.querySelector('.event-modal-title h2').textContent = event.title;
                document.querySelector('.event-modal-date').innerHTML = `<i class="far fa-calendar-alt"></i> ${formatEventDate(event.date)}`;
                document.querySelector('.event-modal-category').innerHTML = `<i class="fas fa-tag"></i> ${event.category.charAt(0).toUpperCase() + event.category.slice(1)}`;
                
                // Show modal
                eventModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        }
    }
}

/**
 * Registration Form Functionality
 */
function initRegistrationForm() {
    const registrationForm = document.getElementById('registration-form');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateRegistrationForm(registrationForm)) {
                // Show loading state
                const submitButton = registrationForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
                
                // Simulate form submission (would be replaced with actual AJAX in production)
                setTimeout(() => {
                    // Reset form
                    registrationForm.reset();
                    
                    // Show success message
                    const formContainer = registrationForm.closest('.registration-form');
                    const successMessage = document.createElement('div');
                    successMessage.className = 'registration-success';
                    successMessage.innerHTML = `
                        <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                        <h3>Registration Complete!</h3>
                        <p>Thank you for registering for this event. You will receive a confirmation email shortly.</p>
                        <button class="btn btn-primary mt-3 close-success">Close</button>
                    `;
                    
                    // Add success message styling
                    successMessage.style.textAlign = 'center';
                    successMessage.style.padding = '2rem';
                    successMessage.style.backgroundColor = '#f0f7ed';
                    successMessage.style.borderRadius = '0.5rem';
                    successMessage.style.marginTop = '1.5rem';
                    
                    // Add icon styling
                    const iconDiv = successMessage.querySelector('.success-icon');
                    iconDiv.style.fontSize = '3rem';
                    iconDiv.style.color = '#4d7c40';
                    iconDiv.style.marginBottom = '1rem';
                    
                    // Hide form and show success message
                    registrationForm.style.display = 'none';
                    formContainer.appendChild(successMessage);
                    
                    // Add close button functionality
                    const closeButton = successMessage.querySelector('.close-success');
                    if (closeButton) {
                        closeButton.addEventListener('click', function() {
                            // Show form again
                            registrationForm.style.display = 'block';
                            // Remove success message
                            formContainer.removeChild(successMessage);
                            // Reset button state
                            submitButton.disabled = false;
                            submitButton.innerHTML = originalButtonText;
                        });
                    }
                    
                }, 1500);
            }
        });
    }
}

/**
 * Validate the registration form
 * @param {HTMLFormElement} form - The form to validate
 * @return {boolean} - Whether the form is valid
 */
function validateRegistrationForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Remove any existing error messages
    const existingErrors = form.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
    
    // Check each required field
    requiredFields.forEach(field => {
        // Reset field styling
        field.style.borderColor = '';
        
        // Check if field is empty or unchecked
        if ((field.type === 'checkbox' && !field.checked) || 
            (field.type !== 'checkbox' && !field.value.trim())) {
            
            // Mark as invalid
            field.style.borderColor = '#dc3545';
            
            // Add error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'form-error';
            errorMessage.textContent = 'This field is required';
            errorMessage.style.color = '#dc3545';
            errorMessage.style.fontSize = '0.875rem';
            errorMessage.style.marginTop = '0.25rem';
            
            // Add after the field
            field.parentNode.insertBefore(errorMessage, field.nextSibling);
            
            isValid = false;
        }
        
        // Email validation
        if (field.type === 'email' && !isValidEmail(field.value)) {
            // Mark as invalid
            field.style.borderColor = '#dc3545';
            
            // Add error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'form-error';
            errorMessage.textContent = 'Please enter a valid email address';
            errorMessage.style.color = '#dc3545';
            errorMessage.style.fontSize = '0.875rem';
            errorMessage.style.marginTop = '0.25rem';
            
            // Add after the field
            field.parentNode.insertBefore(errorMessage, field.nextSibling);
            
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @return {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Format date for display
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @return {string} - Formatted date string
 */
function formatEventDate(dateStr) {
    if (!dateStr || dateStr === 'TBD') return 'TBD';
    
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-NG', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch (e) {
        return dateStr;
    }
}