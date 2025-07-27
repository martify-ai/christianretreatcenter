/**
 * Christian Retreat Centre - Booking Page JavaScript
 * This script handles functionality specific to the booking page.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Booking page initialized');
    
    // Initialize booking components
    initBookingProcess();
    initDatePicker();
    initAccommodationSelection();
    initMeetingSpaceSelection();
    initAdditionalServices();
    initBookingSummary();
});

/**
 * Booking Process Steps Functionality
 */
function initBookingProcess() {
    const processSteps = document.querySelectorAll('.process-step');
    const bookingSections = document.querySelectorAll('.booking-section');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    
    if (processSteps.length > 0) {
        // Show only the first section initially
        if (bookingSections.length > 0) {
            bookingSections.forEach((section, index) => {
                if (index > 0) {
                    section.style.display = 'none';
                }
            });
        }
        
        // Handle Next buttons
        nextButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const currentSection = button.closest('.booking-section');
                const currentIndex = Array.from(bookingSections).indexOf(currentSection);
                
                if (currentIndex < bookingSections.length - 1) {
                    // Validate current section before proceeding
                    if (validateSection(currentSection)) {
                        // Hide current section
                        currentSection.style.display = 'none';
                        
                        // Show next section
                        bookingSections[currentIndex + 1].style.display = 'block';
                        bookingSections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
                        
                        // Update process steps
                        updateProcessSteps(currentIndex + 1);
                    }
                }
            });
        });
        
        // Handle Previous buttons
        prevButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const currentSection = button.closest('.booking-section');
                const currentIndex = Array.from(bookingSections).indexOf(currentSection);
                
                if (currentIndex > 0) {
                    // Hide current section
                    currentSection.style.display = 'none';
                    
                    // Show previous section
                    bookingSections[currentIndex - 1].style.display = 'block';
                    bookingSections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
                    
                    // Update process steps
                    updateProcessSteps(currentIndex - 1);
                }
            });
        });
        
        // Set the first step as active initially
        updateProcessSteps(0);
    }
    
    // Function to update the process steps
    function updateProcessSteps(activeIndex) {
        processSteps.forEach((step, index) => {
            if (index < activeIndex) {
                step.classList.remove('active');
                step.classList.add('completed');
            } else if (index === activeIndex) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }
    
    // Function to validate a section before proceeding
    function validateSection(section) {
        // Get all required fields in the current section
        const requiredFields = section.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            // Reset previous error styles
            field.style.borderColor = '';
            
            // Remove any existing error messages
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Check if field is empty or unchecked
            if ((field.type === 'checkbox' && !field.checked) || 
                (field.type !== 'checkbox' && !field.value.trim())) {
                
                // Mark as invalid
                field.style.borderColor = '#dc3545';
                
                // Add error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'This field is required';
                errorMessage.style.color = '#dc3545';
                errorMessage.style.fontSize = '0.875rem';
                errorMessage.style.marginTop = '0.25rem';
                
                // Add after the field
                field.parentNode.insertBefore(errorMessage, field.nextSibling);
                
                isValid = false;
            }
        });
        
        // If invalid, scroll to the first invalid field
        if (!isValid) {
            const firstInvalidField = section.querySelector('[required][style*="border-color"]');
            if (firstInvalidField) {
                firstInvalidField.focus();
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        return isValid;
    }
}

/**
 * Date Picker Functionality
 */
function initDatePicker() {
    const datePickerCalendar = document.querySelector('.date-picker-calendar');
    const datePickerTitle = document.querySelector('.date-picker-title');
    const prevMonthBtn = document.querySelector('.date-picker-prev');
    const nextMonthBtn = document.querySelector('.date-picker-next');
    const selectedDateInput = document.getElementById('selected-date');
    const checkoutDateInput = document.getElementById('checkout-date');
    
    if (datePickerCalendar && datePickerTitle) {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        
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
            if (datePickerTitle) {
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                               'July', 'August', 'September', 'October', 'November', 'December'];
                datePickerTitle.textContent = `${months[month]} ${year}`;
            }
            
            // Get first day of month and number of days
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            // Clear calendar
            datePickerCalendar.innerHTML = '';
            
            // Add day headers
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            days.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.className = 'calendar-day-header';
                dayHeader.textContent = day;
                datePickerCalendar.appendChild(dayHeader);
            });
            
            // Add empty cells for days before first day of month
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day inactive';
                datePickerCalendar.appendChild(emptyDay);
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
                calendarDay.textContent = day;
                
                // Check if this is today
                if (day === todayDate && month === todayMonth && year === todayYear) {
                    calendarDay.classList.add('today');
                }
                
                // Check if date is in the past
                const checkDate = new Date(year, month, day);
                if (checkDate < today && !(day === todayDate && month === todayMonth && year === todayYear)) {
                    calendarDay.classList.add('inactive');
                } else {
                    // Date selection handling
                    calendarDay.addEventListener('click', function() {
                        // Remove selected class from all days
                        document.querySelectorAll('.calendar-day.selected').forEach(day => {
                            day.classList.remove('selected');
                        });
                        
                        // Add selected class to clicked day
                        this.classList.add('selected');
                        
                        // Update input field with selected date
                        if (selectedDateInput) {
                            const selectedDate = new Date(year, month, day);
                            selectedDateInput.value = formatDate(selectedDate);
                            
                            // If checkout date input exists, set it to day+1
                            if (checkoutDateInput) {
                                const checkoutDate = new Date(year, month, day + 1);
                                checkoutDateInput.value = formatDate(checkoutDate);
                            }
                            
                            // Update booking summary
                            updateBookingSummary();
                        }
                    });
                }
                
                datePickerCalendar.appendChild(calendarDay);
            }
        }
        
        // Helper function to format dates
        function formatDate(date) {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        }
    }
}

/**
 * Accommodation Selection Functionality
 */
function initAccommodationSelection() {
    const accommodationCards = document.querySelectorAll('.accommodation-card');
    const accommodationInput = document.getElementById('selected-accommodation');
    
    if (accommodationCards.length > 0 && accommodationInput) {
        accommodationCards.forEach(card => {
            card.addEventListener('click', function() {
                // Remove selected class from all cards
                accommodationCards.forEach(c => c.classList.remove('selected'));
                
                // Add selected class to clicked card
                this.classList.add('selected');
                
                // Update hidden input value
                accommodationInput.value = this.dataset.accommodationId;
                
                // Update booking summary
                updateBookingSummary();
            });
        });
    }
}

/**
 * Meeting Space Selection Functionality
 */
function initMeetingSpaceSelection() {
    const meetingSpaceItems = document.querySelectorAll('.meeting-space-item');
    
    if (meetingSpaceItems.length > 0) {
        meetingSpaceItems.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            
            if (checkbox) {
                // Toggle selection when clicking on the item
                item.addEventListener('click', function(e) {
                    // Don't toggle if clicking on the checkbox directly
                    if (e.target !== checkbox) {
                        checkbox.checked = !checkbox.checked;
                    }
                    
                    // Toggle selected class
                    item.classList.toggle('selected', checkbox.checked);
                    
                    // Update booking summary
                    updateBookingSummary();
                });
                
                // Update item class when checkbox changes
                checkbox.addEventListener('change', function() {
                    item.classList.toggle('selected', this.checked);
                    
                    // Update booking summary
                    updateBookingSummary();
                });
            }
        });
    }
}

/**
 * Additional Services Functionality
 */
function initAdditionalServices() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    if (serviceItems.length > 0) {
        serviceItems.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            
            if (checkbox) {
                // Update booking summary when checkbox changes
                checkbox.addEventListener('change', function() {
                    updateBookingSummary();
                });
            }
        });
    }
}

/**
 * Update Booking Summary
 */
function updateBookingSummary() {
    const summaryContainer = document.querySelector('.booking-summary');
    
    if (!summaryContainer) return;
    
    // Get selected values
    const selectedDate = document.getElementById('selected-date')?.value || 'Not selected';
    const checkoutDate = document.getElementById('checkout-date')?.value || 'Not selected';
    
    // Calculate number of nights
    let numberOfNights = 0;
    if (selectedDate !== 'Not selected' && checkoutDate !== 'Not selected') {
        const checkIn = new Date(selectedDate);
        const checkOut = new Date(checkoutDate);
        numberOfNights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
    }
    
    // Get selected accommodation
    let accommodationName = 'None selected';
    let accommodationPrice = 0;
    const selectedAccommodation = document.querySelector('.accommodation-card.selected');
    if (selectedAccommodation) {
        accommodationName = selectedAccommodation.querySelector('h3').textContent;
        accommodationPrice = parseFloat(selectedAccommodation.dataset.price || 0);
    }
    
    // Calculate accommodation total
    const accommodationTotal = accommodationPrice * Math.max(numberOfNights, 1);
    
    // Get selected meeting spaces
    const selectedMeetingSpaces = document.querySelectorAll('.meeting-space-item input[type="checkbox"]:checked');
    let meetingSpacesTotal = 0;
    
    selectedMeetingSpaces.forEach(space => {
        const price = parseFloat(space.dataset.price || 0);
        meetingSpacesTotal += price;
    });
    
    // Get selected additional services
    const selectedServices = document.querySelectorAll('.service-item input[type="checkbox"]:checked');
    let servicesTotal = 0;
    
    selectedServices.forEach(service => {
        const price = parseFloat(service.dataset.price || 0);
        servicesTotal += price;
    });
    
    // Calculate total
    const subtotal = accommodationTotal + meetingSpacesTotal + servicesTotal;
    const taxRate = 0.05; // 5% tax
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;
    
    // Update summary HTML
    const summaryItemsContainer = summaryContainer.querySelector('.summary-items') || summaryContainer;
    
    summaryItemsContainer.innerHTML = `
        <div class="summary-item">
            <span class="summary-item-label">Check-in Date:</span>
            <span class="summary-item-value">${formatDisplayDate(selectedDate)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-item-label">Check-out Date:</span>
            <span class="summary-item-value">${formatDisplayDate(checkoutDate)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-item-label">Number of Nights:</span>
            <span class="summary-item-value">${numberOfNights || 'N/A'}</span>
        </div>
        <div class="summary-item">
            <span class="summary-item-label">Accommodation:</span>
            <span class="summary-item-value">${accommodationName}</span>
        </div>
        <div class="summary-item">
            <span class="summary-item-label">Accommodation Price:</span>
            <span class="summary-item-value">₦${accommodationPrice.toLocaleString()} per night</span>
        </div>
        
        ${selectedMeetingSpaces.length > 0 ? `
        <div class="summary-item">
            <span class="summary-item-label">Meeting Spaces:</span>
            <span class="summary-item-value">${selectedMeetingSpaces.length} selected</span>
        </div>` : ''}
        
        ${selectedServices.length > 0 ? `
        <div class="summary-item">
            <span class="summary-item-label">Additional Services:</span>
            <span class="summary-item-value">${selectedServices.length} selected</span>
        </div>` : ''}
        
        <div class="summary-item summary-subtotal">
            <span class="summary-item-label">Subtotal:</span>
            <span class="summary-item-value">₦${subtotal.toLocaleString()}</span>
        </div>
        <div class="summary-item">
            <span class="summary-item-label">Tax (5%):</span>
            <span class="summary-item-value">₦${taxAmount.toLocaleString()}</span>
        </div>
        <div class="summary-item summary-total">
            <span class="summary-item-label">Total:</span>
            <span class="summary-item-value">₦${total.toLocaleString()}</span>
        </div>
        
        <div class="summary-note">
            * Prices are estimates and may change based on final confirmation and additional services requested.
        </div>
    `;
}

/**
 * Format date for display
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @return {string} - Formatted date string
 */
function formatDisplayDate(dateStr) {
    if (dateStr === 'Not selected') return dateStr;
    
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-NG', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch (e) {
        return dateStr;
    }
}