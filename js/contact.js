/**
 * Christian Retreat Centre - Contact Page JavaScript
 * This script handles functionality specific to the contact page.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact page initialized');
    
    // Initialize components
    initContactForm();
    initFAQToggle();
});

/**
 * Contact Form Handling
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm(contactForm)) {
                // Show loading state
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                // Simulate form submission (would be replaced with actual AJAX in production)
                setTimeout(() => {
                    // Reset form
                    contactForm.reset();
                    
                    // Show success message
                    const formContainer = contactForm.closest('.form-container');
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-success';
                    successMessage.innerHTML = `
                        <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                        <h3>Thank You!</h3>
                        <p>Your message has been sent successfully. We'll get back to you as soon as possible.</p>
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
                    contactForm.style.display = 'none';
                    formContainer.appendChild(successMessage);
                    
                    // Reset button state
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                    
                    // Scroll to success message
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                    
                }, 1500);
            }
        });
    }
}

/**
 * Validate the contact form
 * @param {HTMLFormElement} form - The form to validate
 * @return {boolean} - Whether the form is valid
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Remove any existing error messages
    const existingErrors = form.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
    
    // Check each required field
    requiredFields.forEach(field => {
        // Reset field styling
        field.style.borderColor = '';
        
        // Check if field is empty
        if (!field.value.trim()) {
            markFieldAsError(field, 'This field is required');
            isValid = false;
            return;
        }
        
        // Email validation
        if (field.type === 'email' && !isValidEmail(field.value)) {
            markFieldAsError(field, 'Please enter a valid email address');
            isValid = false;
            return;
        }
    });
    
    return isValid;
}

/**
 * Mark a form field as having an error
 * @param {HTMLElement} field - The field with an error
 * @param {string} message - The error message to display
 */
function markFieldAsError(field, message) {
    // Style the field
    field.style.borderColor = '#dc3545';
    
    // Add error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'form-error';
    errorMessage.textContent = message;
    errorMessage.style.color = '#dc3545';
    errorMessage.style.fontSize = '0.875rem';
    errorMessage.style.marginTop = '0.25rem';
    
    // Insert error message after the field
    field.parentNode.insertBefore(errorMessage, field.nextSibling);
    
    // Add focus event to remove error when field is focused
    field.addEventListener('focus', function() {
        field.style.borderColor = '';
        if (errorMessage.parentNode) {
            errorMessage.parentNode.removeChild(errorMessage);
        }
    }, { once: true });
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
 * Initialize FAQ accordion toggles
 */
function initFAQToggle() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current FAQ
                item.classList.toggle('active');
            });
        }
    });
}