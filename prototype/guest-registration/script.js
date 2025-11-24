// App State Management
const AppState = {
    currentScreen: 'welcome-screen',
    userType: null,
    formData: {},
    verificationCode: '123456', // Mock code for demo
    countdown: 60,
    countdownInterval: null
};

// DOM Elements
const elements = {
    loadingScreen: document.getElementById('loading-screen'),
    appContainer: document.getElementById('app-container'),
    toastContainer: document.getElementById('toast-container')
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        hideLoadingScreen();
        initializeEventListeners();
        initializeForms();
    }, 2000);
});

// Loading Screen Management
function hideLoadingScreen() {
    elements.loadingScreen.classList.add('hidden');
    setTimeout(() => {
        elements.loadingScreen.style.display = 'none';
    }, 500);
}

// Screen Navigation
function nextScreen(screenId) {
    const currentScreen = document.querySelector('.screen.active');
    const nextScreen = document.getElementById(screenId);

    if (currentScreen && nextScreen) {
        // Add exit animation to current screen
        currentScreen.classList.remove('active');
        currentScreen.classList.add('prev');

        // Add entrance animation to next screen
        nextScreen.classList.add('active');

        // Update app state
        AppState.currentScreen = screenId;

        // Clean up previous screen classes after animation
        setTimeout(() => {
            currentScreen.classList.remove('prev');
        }, 300);

        // Initialize screen-specific functionality
        initializeScreen(screenId);
    }
}

function prevScreen(screenId) {
    const currentScreen = document.querySelector('.screen.active');
    const prevScreen = document.getElementById(screenId);

    if (currentScreen && prevScreen) {
        currentScreen.classList.remove('active');
        prevScreen.classList.add('active');

        AppState.currentScreen = screenId;
        initializeScreen(screenId);
    }
}

function initializeScreen(screenId) {
    switch(screenId) {
        case 'phone-verification-screen':
            startCountdown();
            initializePinInputs();
            break;
        case 'license-upload-screen':
            initializeCameraCapture();
            break;
        case 'payment-screen':
            initializePaymentForm();
            break;
        case 'success-screen':
            animateSuccess();
            break;
    }
}

// Account Type Selection
function selectAccountType(type) {
    AppState.userType = type;

    if (type === 'guest') {
        nextScreen('basic-info-screen');
    } else {
        showToast('Host registration flow will be available soon!', 'info');
    }
}

// Form Validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    return phone.length >= 10 && phoneRegex.test(phone);
}

function validatePassword(password) {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const score = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;

    return {
        isValid: score >= 4,
        score: score,
        requirements: {
            hasMinLength,
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecialChar
        }
    };
}

function updatePasswordStrength(password) {
    const validation = validatePassword(password);
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    if (!strengthBar || !strengthText) return;

    strengthBar.className = 'strength-fill';

    if (password.length === 0) {
        strengthBar.style.width = '0%';
        strengthText.textContent = 'Password strength';
    } else if (validation.score <= 2) {
        strengthBar.classList.add('weak');
        strengthText.textContent = 'Weak password';
    } else if (validation.score === 3) {
        strengthBar.classList.add('fair');
        strengthText.textContent = 'Fair password';
    } else if (validation.score === 4) {
        strengthBar.classList.add('good');
        strengthText.textContent = 'Good password';
    } else {
        strengthBar.classList.add('strong');
        strengthText.textContent = 'Strong password';
    }
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');

    if (field) {
        field.classList.add('error');
    }

    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');

    if (field) {
        field.classList.remove('error');
    }

    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Event Listeners
function initializeEventListeners() {
    // Basic Info Form
    const basicInfoForm = document.getElementById('basic-info-form');
    if (basicInfoForm) {
        basicInfoForm.addEventListener('submit', handleBasicInfoSubmit);
    }

    // Payment Form
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmit);
    }

    // Password strength monitoring
    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.addEventListener('input', (e) => {
            updatePasswordStrength(e.target.value);
        });
    }

    // Card number formatting
    const cardNumberField = document.getElementById('cardNumber');
    if (cardNumberField) {
        cardNumberField.addEventListener('input', formatCardNumber);
        cardNumberField.addEventListener('input', detectCardBrand);
    }

    // Expiry date formatting
    const expiryField = document.getElementById('expiry');
    if (expiryField) {
        expiryField.addEventListener('input', formatExpiryDate);
    }
}

function initializeForms() {
    // Real-time validation for all forms
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidationOnInput);
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldName = field.name;

    clearFieldError(field.id);

    switch(fieldName) {
        case 'email':
            if (!validateEmail(value)) {
                showFieldError(field.id, 'Please enter a valid email address');
            }
            break;
        case 'phone':
            if (!validatePhone(value)) {
                showFieldError(field.id, 'Please enter a valid phone number');
            }
            break;
        case 'password':
            const validation = validatePassword(value);
            if (!validation.isValid) {
                showFieldError(field.id, 'Password must be stronger');
            }
            break;
        case 'confirmPassword':
            const originalPassword = document.getElementById('password').value;
            if (value !== originalPassword) {
                showFieldError(field.id, 'Passwords do not match');
            }
            break;
    }
}

function clearValidationOnInput(event) {
    const field = event.target;
    if (field.classList.contains('error')) {
        clearFieldError(field.id);
    }
}

// Form Handlers
function handleBasicInfoSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Validate all fields
    let isValid = true;

    if (!data.firstName) {
        showFieldError('firstName', 'First name is required');
        isValid = false;
    }

    if (!data.lastName) {
        showFieldError('lastName', 'Last name is required');
        isValid = false;
    }

    if (!validateEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }

    if (!validatePhone(data.phone)) {
        showFieldError('phone', 'Please enter a valid phone number');
        isValid = false;
    }

    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
        showFieldError('password', 'Password must be stronger');
        isValid = false;
    }

    if (data.password !== data.confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }

    if (!data.terms) {
        showFieldError('terms', 'You must agree to the terms and conditions');
        isValid = false;
    }

    if (isValid) {
        // Store form data
        AppState.formData = { ...AppState.formData, ...data };

        // Show phone number in verification screen
        const phoneDisplay = document.getElementById('phone-display');
        if (phoneDisplay) {
            phoneDisplay.textContent = `${data.countryCode} ${data.phone}`;
        }

        showToast('Account information saved successfully!', 'success');
        nextScreen('phone-verification-screen');
    }
}

function handlePaymentSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Validate payment fields
    let isValid = true;

    if (data.paymentMethod === 'card') {
        if (!validateCardNumber(data.cardNumber)) {
            showFieldError('cardNumber', 'Please enter a valid card number');
            isValid = false;
        }

        if (!validateExpiryDate(data.expiry)) {
            showFieldError('expiry', 'Please enter a valid expiry date');
            isValid = false;
        }

        if (!validateCVV(data.cvv)) {
            showFieldError('cvv', 'Please enter a valid CVV');
            isValid = false;
        }

        if (!data.cardName) {
            showFieldError('cardName', 'Cardholder name is required');
            isValid = false;
        }

        if (!data.zipCode) {
            showFieldError('zipCode', 'ZIP code is required');
            isValid = false;
        }
    }

    if (isValid) {
        // Store payment data
        AppState.formData = { ...AppState.formData, ...data };

        showToast('Payment method added successfully!', 'success');
        setTimeout(() => {
            nextScreen('success-screen');
        }, 1000);
    }
}

// Phone Verification
function initializePinInputs() {
    const pinInputs = document.querySelectorAll('.pin-input');

    pinInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;

            // Only allow numbers
            if (!/^\d$/.test(value)) {
                e.target.value = '';
                return;
            }

            // Move to next input
            if (value && index < pinInputs.length - 1) {
                pinInputs[index + 1].focus();
            }

            // Add filled class
            if (value) {
                e.target.classList.add('filled');
            } else {
                e.target.classList.remove('filled');
            }

            // Check if all inputs are filled
            const allFilled = Array.from(pinInputs).every(input => input.value !== '');
            const verifyBtn = document.getElementById('verify-btn');
            if (verifyBtn) {
                verifyBtn.disabled = !allFilled;
            }
        });

        input.addEventListener('keydown', (e) => {
            // Handle backspace
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                pinInputs[index - 1].focus();
                pinInputs[index - 1].value = '';
                pinInputs[index - 1].classList.remove('filled');
            }
        });
    });
}

function startCountdown() {
    AppState.countdown = 60;
    const resendBtn = document.getElementById('resend-btn');
    const countdownElement = document.getElementById('countdown');

    if (resendBtn) resendBtn.disabled = true;

    AppState.countdownInterval = setInterval(() => {
        AppState.countdown--;

        if (countdownElement) {
            countdownElement.textContent = AppState.countdown;
        }

        if (AppState.countdown <= 0) {
            clearInterval(AppState.countdownInterval);
            if (resendBtn) {
                resendBtn.disabled = false;
                resendBtn.innerHTML = 'Resend Code';
            }
        }
    }, 1000);
}

function verifyPhone() {
    const pinInputs = document.querySelectorAll('.pin-input');
    const enteredCode = Array.from(pinInputs).map(input => input.value).join('');

    if (enteredCode === AppState.verificationCode) {
        showToast('Phone verified successfully!', 'success');
        setTimeout(() => {
            nextScreen('license-upload-screen');
        }, 1000);
    } else {
        showToast('Invalid verification code. Please try again.', 'error');
        // Clear pin inputs
        pinInputs.forEach(input => {
            input.value = '';
            input.classList.remove('filled');
        });
        document.getElementById('verify-btn').disabled = true;
    }
}

function resendCode() {
    showToast('Verification code sent!', 'success');
    startCountdown();
}

// License Upload
function initializeCameraCapture() {
    // Simulate camera initialization
    console.log('Camera initialized for license capture');
}

function capturePhoto() {
    // Simulate photo capture with loading state
    const cameraContainer = document.getElementById('camera-container');
    const photoPreview = document.getElementById('photo-preview');
    const licenseImage = document.getElementById('license-image');

    // Show loading state
    showToast('Taking photo...', 'info');

    setTimeout(() => {
        // Simulate captured photo (using placeholder)
        const placeholderImageData = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRyaXZlcidzIExpY2Vuc2U8L3RleHQ+PC9zdmc+';

        licenseImage.src = placeholderImageData;
        cameraContainer.style.display = 'none';
        photoPreview.style.display = 'block';

        showToast('Photo captured successfully!', 'success');
    }, 1500);
}

function uploadFromGallery() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const cameraContainer = document.getElementById('camera-container');
                const photoPreview = document.getElementById('photo-preview');
                const licenseImage = document.getElementById('license-image');

                licenseImage.src = e.target.result;
                cameraContainer.style.display = 'none';
                photoPreview.style.display = 'block';

                showToast('Photo uploaded successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    input.click();
}

function retakePhoto() {
    const cameraContainer = document.getElementById('camera-container');
    const photoPreview = document.getElementById('photo-preview');

    cameraContainer.style.display = 'block';
    photoPreview.style.display = 'none';
}

function processLicense() {
    const photoPreview = document.getElementById('photo-preview');
    const ocrProcessing = document.getElementById('ocr-processing');

    photoPreview.style.display = 'none';
    ocrProcessing.style.display = 'block';

    // Simulate OCR processing
    setTimeout(() => {
        ocrProcessing.style.display = 'none';
        showOCRResults();
    }, 3000);
}

function showOCRResults() {
    const ocrResults = document.getElementById('ocr-results');

    // Populate with mock data
    document.getElementById('license-number').value = 'D1234567890123';
    document.getElementById('license-name').value = `${AppState.formData.firstName} ${AppState.formData.lastName}`;
    document.getElementById('license-dob').value = '01/15/1990';
    document.getElementById('license-exp').value = '12/31/2025';

    ocrResults.style.display = 'block';
    showToast('License information extracted successfully!', 'success');
}

function editManually() {
    const inputs = document.querySelectorAll('#ocr-results input');
    inputs.forEach(input => {
        input.readOnly = false;
        input.style.background = '#ffffff';
    });
    showToast('You can now edit the extracted information', 'info');
}

function confirmLicense() {
    showToast('License verified successfully!', 'success');
    setTimeout(() => {
        nextScreen('payment-screen');
    }, 1000);
}

function skipForNow() {
    showToast('License verification skipped. Some features will be limited.', 'warning');
    setTimeout(() => {
        nextScreen('payment-screen');
    }, 1000);
}

// Payment Processing
function initializePaymentForm() {
    const paymentOptions = document.querySelectorAll('.payment-option');

    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');

            const radio = option.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;

            const cardForm = document.getElementById('card-form');
            if (radio.value === 'card') {
                cardForm.style.display = 'block';
            } else {
                cardForm.style.display = 'none';
            }
        });
    });
}

function selectPaymentMethod(method) {
    const cardForm = document.getElementById('card-form');

    if (method === 'card') {
        cardForm.style.display = 'block';
    } else {
        cardForm.style.display = 'none';

        if (method === 'apple') {
            showToast('Apple Pay integration would be implemented here', 'info');
        } else if (method === 'google') {
            showToast('Google Pay integration would be implemented here', 'info');
        }
    }
}

function formatCardNumber(event) {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const matches = value.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
        event.target.value = parts.join(' ');
    } else {
        event.target.value = value;
    }
}

function detectCardBrand(event) {
    const value = event.target.value.replace(/\s/g, '');
    const cardBrand = document.getElementById('card-brand');

    if (!cardBrand) return;

    let brand = '';

    if (/^4/.test(value)) {
        brand = '💳'; // Visa
    } else if (/^5[1-5]/.test(value)) {
        brand = '💳'; // Mastercard
    } else if (/^3[47]/.test(value)) {
        brand = '💳'; // American Express
    } else if (/^6/.test(value)) {
        brand = '💳'; // Discover
    }

    cardBrand.textContent = brand;
}

function formatExpiryDate(event) {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }

    event.target.value = value;
}

function validateCardNumber(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleanNumber);
}

function validateExpiryDate(expiry) {
    const [month, year] = expiry.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) return false;

    return true;
}

function validateCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
}

function skipPayment() {
    showToast('Payment setup skipped. You can add a payment method later.', 'warning');
    setTimeout(() => {
        nextScreen('success-screen');
    }, 1000);
}

// Success Screen
function animateSuccess() {
    const checkmark = document.querySelector('.checkmark-circle');
    if (checkmark) {
        checkmark.style.animation = 'checkmark-bounce 0.6s ease-out';
    }
}

function completeRegistration() {
    showToast('Welcome to CarShare! Registration complete.', 'success');
    // In a real app, this would navigate to the main app
    setTimeout(() => {
        showToast('You would now be redirected to the main CarShare app', 'info');
    }, 2000);
}

function completeProfile() {
    showToast('Profile completion options would be shown here', 'info');
}

// Utility Functions
function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggleIcon = document.querySelector('.password-toggle i');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordField.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

// Modal Management
function showLogin() {
    const modal = document.getElementById('login-modal');
    modal.classList.add('show');
}

function closeLogin() {
    const modal = document.getElementById('login-modal');
    modal.classList.remove('show');
}

function showBiometric() {
    const modal = document.getElementById('biometric-modal');
    modal.classList.add('show');
}

function closeBiometric() {
    const modal = document.getElementById('biometric-modal');
    modal.classList.remove('show');
}

function usePassword() {
    closeBiometric();
    showLogin();
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'fas fa-check-circle';
    if (type === 'error') icon = 'fas fa-exclamation-circle';
    if (type === 'warning') icon = 'fas fa-exclamation-triangle';
    if (type === 'info') icon = 'fas fa-info-circle';

    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;

    elements.toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => modal.classList.remove('show'));
    }
});

// Click outside modal to close
document.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});

// Prevent form submission on Enter for specific inputs
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('pin-input')) {
        e.preventDefault();
        const allFilled = Array.from(document.querySelectorAll('.pin-input')).every(input => input.value !== '');
        if (allFilled) {
            verifyPhone();
        }
    }
});

// Accessibility enhancements
document.addEventListener('focusin', (e) => {
    if (e.target.matches('input, button, select')) {
        e.target.setAttribute('data-focused', 'true');
    }
});

document.addEventListener('focusout', (e) => {
    if (e.target.matches('input, button, select')) {
        e.target.removeAttribute('data-focused');
    }
});

// Simulate network delays for realistic experience
function simulateNetworkDelay(callback, delay = 1000) {
    setTimeout(callback, delay);
}

// Error simulation for testing
function simulateError(probability = 0.1) {
    return Math.random() < probability;
}

// Development helpers
const DevTools = {
    skipToScreen: (screenId) => {
        if (document.getElementById(screenId)) {
            nextScreen(screenId);
        }
    },

    fillMockData: () => {
        document.getElementById('firstName').value = 'John';
        document.getElementById('lastName').value = 'Doe';
        document.getElementById('email').value = 'john.doe@example.com';
        document.getElementById('phone').value = '555-123-4567';
        document.getElementById('password').value = 'SecurePass123!';
        document.getElementById('confirmPassword').value = 'SecurePass123!';
        document.getElementById('terms').checked = true;
    },

    triggerToast: (message, type) => {
        showToast(message, type);
    }
};


// Make DevTools available in console for testing
window.DevTools = DevTools;

console.log('CarShare Guest Registration prototype loaded successfully!');
console.log('Available dev tools:');
console.log('- DevTools.skipToScreen(screenId)');
console.log('- DevTools.fillMockData()');
console.log('- DevTools.triggerToast(message, type)');