/* ============================================
   CAREERS PAGE JAVASCRIPT
   ============================================ */

// Configuration
const CONFIG = {
    JOBS_OPEN: false, // Set to true when hiring
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
    MIN_MESSAGE_LENGTH: 50,
    ACCEPTED_FILE_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCareerPage();
    initMobileMenu();
    initCustomCursor();
    initFormValidation();
    initFileUpload();
    initCharacterCounter();
    initFormSubmission();
    initScrollAnimations();
});

// ============================================
// CAREER PAGE INITIALIZATION
// ============================================

function initCareerPage() {
    const careerOpen = document.getElementById('career-open');
    const careerClosed = document.getElementById('career-closed');

    if (!careerOpen || !careerClosed) return;

    if (CONFIG.JOBS_OPEN) {
        careerOpen.style.display = 'block';
        careerClosed.style.display = 'none';
        careerOpen.setAttribute('aria-hidden', 'false');
        careerClosed.setAttribute('aria-hidden', 'true');
    } else {
        careerOpen.style.display = 'none';
        careerClosed.style.display = 'flex';
        careerOpen.setAttribute('aria-hidden', 'true');
        careerClosed.setAttribute('aria-hidden', 'false');
    }
}

// ============================================
// MOBILE MENU
// ============================================

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (!menuToggle || !navbar) return;

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navbar.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navbar.contains(e.target)) {
            navbar.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        }
    });
}

// ============================================
// CUSTOM CURSOR
// ============================================

function initCustomCursor() {
    const cursor = document.querySelector('.nt-cursor');
    if (!cursor || 'ontouchstart' in window) {
        cursor && (cursor.style.display = 'none');
        return;
    }

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const speed = 0.15;
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();

    // Cursor effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, label[for]');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));
}

// ============================================
// FILE UPLOAD
// ============================================

function initFileUpload() {
    const fileInput = document.getElementById('resume');
    const fileName = document.getElementById('file-name');
    const fileLabel = document.querySelector('.file-label');

    if (!fileInput || !fileName) return;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (!file) {
            resetFileUpload();
            return;
        }

        // Validate file size
        if (file.size > CONFIG.MAX_FILE_SIZE) {
            showFileError('File size exceeds 5MB. Please choose a smaller file.');
            fileInput.value = '';
            return;
        }

        // Validate file type
        if (!CONFIG.ACCEPTED_FILE_TYPES.includes(file.type)) {
            showFileError('Please upload a PDF, DOC, or DOCX file.');
            fileInput.value = '';
            return;
        }

        // Display file name
        fileName.textContent = file.name;
        fileName.classList.add('has-file');
        fileLabel.classList.add('file-selected');
        clearFileError();
    });

    // Drag and drop support
    fileLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileLabel.classList.add('drag-over');
    });

    fileLabel.addEventListener('dragleave', () => {
        fileLabel.classList.remove('drag-over');
    });

    fileLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        fileLabel.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            
            // Trigger change event
            fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
}

function resetFileUpload() {
    const fileName = document.getElementById('file-name');
    const fileLabel = document.querySelector('.file-label');
    
    if (fileName) {
        fileName.textContent = 'Upload Resume (PDF, DOC, DOCX) *';
        fileName.classList.remove('has-file');
    }
    
    if (fileLabel) {
        fileLabel.classList.remove('file-selected');
    }
    
    clearFileError();
}

function showFileError(message) {
    const fileGroup = document.querySelector('.file-upload');
    if (!fileGroup) return;
    
    let errorEl = fileGroup.querySelector('.file-error');
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'file-error';
        fileGroup.appendChild(errorEl);
    }
    
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

function clearFileError() {
    const errorEl = document.querySelector('.file-error');
    if (errorEl) {
        errorEl.style.display = 'none';
    }
}

// ============================================
// CHARACTER COUNTER
// ============================================

function initCharacterCounter() {
    const messageTextarea = document.getElementById('message');
    const charCount = document.querySelector('.char-count');

    if (!messageTextarea || !charCount) return;

    messageTextarea.addEventListener('input', (e) => {
        const length = e.target.value.length;
        const minLength = CONFIG.MIN_MESSAGE_LENGTH;
        
        if (length < minLength) {
            charCount.textContent = `${minLength - length} characters remaining`;
            charCount.style.color = 'var(--nt-text-muted)';
        } else {
            charCount.textContent = `${length} characters`;
            charCount.style.color = 'var(--nt-accent)';
        }
    });
}

// ============================================
// FORM VALIDATION
// ============================================

function initFormValidation() {
    const form = document.getElementById('career-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    else if (field.type === 'tel' && value) {
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Textarea min length
    else if (field.tagName === 'TEXTAREA' && value && value.length < CONFIG.MIN_MESSAGE_LENGTH) {
        isValid = false;
        errorMessage = `Please enter at least ${CONFIG.MIN_MESSAGE_LENGTH} characters`;
    }

    // Update field state
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
        removeFieldError(field);
    } else {
        field.classList.add('error');
        field.classList.remove('valid');
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    let errorEl = formGroup.querySelector('.field-error');
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        formGroup.appendChild(errorEl);
    }

    errorEl.textContent = message;
}

function removeFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    const errorEl = formGroup.querySelector('.field-error');
    if (errorEl) {
        errorEl.remove();
    }
}

// ============================================
// FORM SUBMISSION
// ============================================

function initFormSubmission() {
    const form = document.getElementById('career-form');
    const formMessage = document.getElementById('form-message');

    if (!form || !formMessage) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        const inputs = form.querySelectorAll('input:not([type="radio"]), textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showMessage('error', 'Please fix the errors above before submitting.');
            return;
        }

        // Prepare form data
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Submitting...</span> <i class="fas fa-spinner fa-spin"></i>';

        try {
            // Simulate API call (replace with actual endpoint)
            await submitApplication(formData);
            
            // Success
            showMessage('success', 'Application submitted successfully! We\'ll be in touch soon.');
            form.reset();
            resetFileUpload();
            
            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } catch (error) {
            // Error
            showMessage('error', 'Something went wrong. Please try again or contact us directly.');
            console.error('Form submission error:', error);
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Submit Application</span> <i class="fas fa-paper-plane"></i>';
        }
    });
}

async function submitApplication(formData) {
    // Simulate API call - replace with actual implementation
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success
            resolve({ success: true });
            
            // Uncomment to simulate error:
            // reject(new Error('Submission failed'));
        }, 2000);
    });

    /* 
    // Real implementation example:
    const response = await fetch('careers.php', {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        throw new Error('Submission failed');
    }
    
    return await response.json();
    */
}

function showMessage(type, text) {
    const formMessage = document.getElementById('form-message');
    if (!formMessage) return;

    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';

    // Auto-hide after 7 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 7000);
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll('.career-card, .career-closed, .benefit-card, .job-card');
    animatedElements.forEach(el => observer.observe(el));
}

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// BACK TO TOP BUTTON
// ============================================

const backToTop = document.querySelector('.back-to-top');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}