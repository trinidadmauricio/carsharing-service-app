// Global state
let currentScreen = 'login-screen';
let countdownTimers = {};
let userEmail = '';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Hide loading screen after delay
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
    }, 1500);

    // Setup form event listeners
    setupFormListeners();

    // Setup PIN input handlers
    setupPinInputs();

    // Setup password validation
    setupPasswordValidation();

    // Check for biometric support
    checkBiometricSupport();
}

function setupFormListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Password reset form
    const resetForm = document.getElementById('password-reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', handlePasswordReset);
    }

    // New password form
    const newPasswordForm = document.getElementById('new-password-form');
    if (newPasswordForm) {
        newPasswordForm.addEventListener('submit', handleNewPassword);
    }
}

function setupPinInputs() {
    const pinInputs = document.querySelectorAll('.pin-input');
    pinInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => handlePinInput(e, index));
        input.addEventListener('keydown', (e) => handlePinKeydown(e, index));
        input.addEventListener('paste', (e) => handlePinPaste(e, index));
    });
}

function setupPasswordValidation() {
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmNewPassword');

    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', validateNewPassword);
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }
}

// Screen Navigation
function nextScreen(screenId) {
    const currentElement = document.getElementById(currentScreen);
    const nextElement = document.getElementById(screenId);

    if (currentElement && nextElement) {
        currentElement.classList.remove('active');
        currentElement.classList.add('prev');

        nextElement.classList.remove('prev');
        nextElement.classList.add('active');

        currentScreen = screenId;

        // Trigger screen-specific actions
        onScreenEnter(screenId);
    }
}

function prevScreen(screenId) {
    const currentElement = document.getElementById(currentScreen);
    const prevElement = document.getElementById(screenId);

    if (currentElement && prevElement) {
        currentElement.classList.remove('active');
        currentElement.classList.add('next');

        prevElement.classList.remove('prev');
        prevElement.classList.add('active');

        currentScreen = screenId;

        // Clean up timers when going back
        clearAllTimers();
    }
}

function onScreenEnter(screenId) {
    switch(screenId) {
        case 'two-factor-screen':
            startCountdown('countdown-2fa', 'resend-2fa-btn', resend2FA);
            focusFirstPinInput();
            break;
        case 'reset-sent-screen':
            startCountdown('countdown-reset', 'resend-reset-btn', resendResetLink);
            break;
        case 'biometric-screen':
            startBiometricAuthentication();
            break;
    }
}

// Login Handling
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Validate inputs
    if (!validateLoginInputs(email, password)) {
        return;
    }

    // Show loading state
    const submitBtn = document.getElementById('sign-in-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';

    try {
        // Simulate API call
        await simulateApiCall(1500);

        // Store email for later use
        userEmail = email;

        // Check if 2FA is enabled (simulate)
        const has2FA = email.includes('2fa') || email.includes('secure');

        if (has2FA) {
            showToast('2FA code sent to your registered email', 'success');
            nextScreen('two-factor-screen');
            updateMaskedContact(email);
        } else {
            // Check for biometric
            if (supportsBiometric() && localStorage.getItem('biometric_enabled') === 'true') {
                nextScreen('biometric-screen');
            } else {
                handleSuccessfulLogin();
            }
        }
    } catch (error) {
        showToast('Invalid email or password', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function validateLoginInputs(email, password) {
    let isValid = true;

    // Clear previous errors
    clearError('loginEmail');
    clearError('loginPassword');

    // Validate email
    if (!email) {
        showError('loginEmail', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('loginEmail', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate password
    if (!password) {
        showError('loginPassword', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('loginPassword', 'Password must be at least 6 characters');
        isValid = false;
    }

    return isValid;
}

// Social Login
function socialLogin(provider) {
    showToast(`Redirecting to ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`, 'info');

    setTimeout(() => {
        // Simulate successful social login
        showToast(`Successfully signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`, 'success');
        handleSuccessfulLogin();
    }, 2000);
}

// Two-Factor Authentication
function handlePinInput(e, index) {
    const input = e.target;
    const value = input.value;

    // Only allow digits
    if (!/^\d$/.test(value) && value !== '') {
        input.value = '';
        return;
    }

    if (value) {
        input.classList.add('filled');

        // Move to next input
        if (index < 5) {
            const nextInput = document.querySelector(`[data-index="${index + 1}"]`);
            if (nextInput) {
                nextInput.focus();
            }
        }
    } else {
        input.classList.remove('filled');
    }

    // Check if all inputs are filled
    checkPinComplete();
}

function handlePinKeydown(e, index) {
    // Handle backspace
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
        const prevInput = document.querySelector(`[data-index="${index - 1}"]`);
        if (prevInput) {
            prevInput.focus();
        }
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
        const prevInput = document.querySelector(`[data-index="${index - 1}"]`);
        if (prevInput) {
            prevInput.focus();
        }
    }

    if (e.key === 'ArrowRight' && index < 5) {
        const nextInput = document.querySelector(`[data-index="${index + 1}"]`);
        if (nextInput) {
            nextInput.focus();
        }
    }
}

function handlePinPaste(e, index) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);

    const pinInputs = document.querySelectorAll('.pin-input');
    digits.split('').forEach((digit, i) => {
        if (pinInputs[i]) {
            pinInputs[i].value = digit;
            pinInputs[i].classList.add('filled');
        }
    });

    // Focus last filled input or first empty
    const lastIndex = Math.min(digits.length - 1, 5);
    pinInputs[lastIndex].focus();

    checkPinComplete();
}

function checkPinComplete() {
    const pinInputs = document.querySelectorAll('.pin-input');
    const isComplete = Array.from(pinInputs).every(input => input.value);
    const verifyBtn = document.getElementById('verify-2fa-btn');

    if (verifyBtn) {
        verifyBtn.disabled = !isComplete;
    }

    // Auto-submit if complete
    if (isComplete) {
        setTimeout(verify2FA, 500);
    }
}

function focusFirstPinInput() {
    const firstInput = document.querySelector('[data-index="0"]');
    if (firstInput) {
        firstInput.focus();
    }
}

async function verify2FA() {
    const pinInputs = document.querySelectorAll('.pin-input');
    const code = Array.from(pinInputs).map(input => input.value).join('');

    if (code.length !== 6) {
        showToast('Please enter the complete 6-digit code', 'error');
        return;
    }

    const verifyBtn = document.getElementById('verify-2fa-btn');
    const originalText = verifyBtn.textContent;
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

    try {
        await simulateApiCall(1500);

        // Simulate validation
        if (code === '123456' || code === '000000') {
            showToast('2FA verification successful!', 'success');

            // Check for biometric next
            if (supportsBiometric() && localStorage.getItem('biometric_enabled') === 'true') {
                nextScreen('biometric-screen');
            } else {
                handleSuccessfulLogin();
            }
        } else {
            throw new Error('Invalid code');
        }
    } catch (error) {
        showToast('Invalid verification code. Please try again.', 'error');

        // Clear PIN inputs
        pinInputs.forEach(input => {
            input.value = '';
            input.classList.remove('filled');
        });

        focusFirstPinInput();
        verifyBtn.disabled = false;
        verifyBtn.textContent = originalText;
    }
}

function resend2FA() {
    showToast('New verification code sent', 'success');
    startCountdown('countdown-2fa', 'resend-2fa-btn', resend2FA);
}

function updateMaskedContact(email) {
    const maskedEmail = maskEmail(email);
    const element = document.getElementById('masked-contact');
    if (element) {
        element.textContent = maskedEmail;
    }
}

// Biometric Authentication
function checkBiometricSupport() {
    if (supportsBiometric()) {
        // Update biometric icon based on support
        const icon = document.getElementById('biometric-icon');
        const title = document.getElementById('biometric-title');
        const subtitle = document.getElementById('biometric-subtitle');

        if (navigator.userAgent.includes('Mac')) {
            icon.className = 'fas fa-fingerprint';
            title.textContent = 'Use Touch ID';
            subtitle.textContent = 'Sign in to CarShare with your fingerprint';
        } else {
            icon.className = 'fas fa-face-smile';
            title.textContent = 'Use Face ID';
            subtitle.textContent = 'Sign in to CarShare with your face';
        }
    }
}

function supportsBiometric() {
    // Simulate biometric support check
    return 'PublicKeyCredential' in window || navigator.userAgent.includes('Mobile');
}

async function startBiometricAuthentication() {
    // Simulate biometric prompt
    setTimeout(async () => {
        try {
            // Simulate biometric authentication
            const success = Math.random() > 0.3; // 70% success rate for demo

            if (success) {
                showToast('Biometric authentication successful!', 'success');
                handleSuccessfulLogin();
            } else {
                throw new Error('Biometric authentication failed');
            }
        } catch (error) {
            showToast('Biometric authentication failed. Please use your password.', 'error');
            nextScreen('login-screen');
        }
    }, 2000);
}

function cancelBiometric() {
    nextScreen('login-screen');
}

function useFallback() {
    nextScreen('login-screen');
    showToast('Please sign in with your password', 'info');
}

// Password Reset
async function handlePasswordReset(e) {
    e.preventDefault();

    const email = document.getElementById('resetEmail').value;

    if (!validateResetEmail(email)) {
        return;
    }

    const submitBtn = document.getElementById('send-reset-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
        await simulateApiCall(2000);

        // Store email for confirmation screen
        userEmail = email;
        document.getElementById('reset-email-display').textContent = email;

        showToast('Password reset email sent successfully', 'success');
        nextScreen('reset-sent-screen');
    } catch (error) {
        showToast('Failed to send reset email. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function validateResetEmail(email) {
    clearError('resetEmail');

    if (!email) {
        showError('resetEmail', 'Email address is required');
        return false;
    }

    if (!isValidEmail(email)) {
        showError('resetEmail', 'Please enter a valid email address');
        return false;
    }

    return true;
}

function resendResetLink() {
    showToast('Password reset email resent', 'success');
    startCountdown('countdown-reset', 'resend-reset-btn', resendResetLink);
}

function simulateEmailClick() {
    showToast('Simulating email link click...', 'info');
    setTimeout(() => {
        nextScreen('new-password-screen');
    }, 1000);
}

// New Password Creation
async function handleNewPassword(e) {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    if (!validateNewPasswordForm(newPassword, confirmPassword)) {
        return;
    }

    const submitBtn = document.getElementById('reset-password-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

    try {
        await simulateApiCall(2000);

        showToast('Password updated successfully!', 'success');
        nextScreen('password-success-screen');
    } catch (error) {
        showToast('Failed to update password. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function validateNewPassword() {
    const password = document.getElementById('newPassword').value;
    const requirements = checkPasswordRequirements(password);

    // Update visual requirements
    updatePasswordRequirements(requirements);

    // Update strength bar
    updatePasswordStrength(password);

    // Enable/disable submit button
    const allRequirementsMet = Object.values(requirements).every(req => req);
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    const passwordsMatch = password === confirmPassword && password.length > 0;

    document.getElementById('reset-password-btn').disabled = !(allRequirementsMet && passwordsMatch);
}

function validatePasswordMatch() {
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    clearError('confirmNewPassword');

    if (confirmPassword && password !== confirmPassword) {
        showError('confirmNewPassword', 'Passwords do not match');
        return false;
    }

    // Re-check if submit button should be enabled
    validateNewPassword();
    return true;
}

function validateNewPasswordForm(newPassword, confirmPassword) {
    let isValid = true;

    clearError('newPassword');
    clearError('confirmNewPassword');

    const requirements = checkPasswordRequirements(newPassword);
    const allRequirementsMet = Object.values(requirements).every(req => req);

    if (!allRequirementsMet) {
        showError('newPassword', 'Password does not meet all requirements');
        isValid = false;
    }

    if (newPassword !== confirmPassword) {
        showError('confirmNewPassword', 'Passwords do not match');
        isValid = false;
    }

    return isValid;
}

function checkPasswordRequirements(password) {
    return {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password)
    };
}

function updatePasswordRequirements(requirements) {
    Object.keys(requirements).forEach(req => {
        const element = document.getElementById(`req-${req}`);
        if (element) {
            const icon = element.querySelector('i');
            if (requirements[req]) {
                element.classList.add('valid');
                icon.className = 'fas fa-check';
            } else {
                element.classList.remove('valid');
                icon.className = 'fas fa-times';
            }
        }
    });
}

function updatePasswordStrength(password) {
    const strengthBar = document.querySelector('#new-password-strength .strength-fill');
    const strengthText = document.querySelector('#new-password-strength .strength-text');

    if (!strengthBar || !strengthText) return;

    const requirements = checkPasswordRequirements(password);
    const score = Object.values(requirements).filter(Boolean).length;

    // Remove all strength classes
    strengthBar.className = 'strength-fill';

    if (score === 0) {
        strengthText.textContent = 'Password strength';
    } else if (score <= 1) {
        strengthBar.classList.add('weak');
        strengthText.textContent = 'Weak';
    } else if (score <= 2) {
        strengthBar.classList.add('fair');
        strengthText.textContent = 'Fair';
    } else if (score <= 3) {
        strengthBar.classList.add('good');
        strengthText.textContent = 'Good';
    } else {
        strengthBar.classList.add('strong');
        strengthText.textContent = 'Strong';
    }
}

// Utility Functions
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling;
    const icon = toggle.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function startCountdown(countdownId, buttonId, callback) {
    const countdownElement = document.getElementById(countdownId);
    const button = document.getElementById(buttonId);

    if (!countdownElement || !button) return;

    let seconds = 60;
    button.disabled = true;

    const timerId = setInterval(() => {
        seconds--;
        countdownElement.textContent = seconds;

        if (seconds <= 0) {
            clearInterval(timerId);
            button.disabled = false;
            button.innerHTML = button.innerHTML.replace(/Resend in \d+s/, 'Resend code');
            delete countdownTimers[countdownId];
        }
    }, 1000);

    countdownTimers[countdownId] = timerId;
}

function clearAllTimers() {
    Object.values(countdownTimers).forEach(timerId => clearInterval(timerId));
    countdownTimers = {};
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function maskEmail(email) {
    const [local, domain] = email.split('@');
    const maskedLocal = local.slice(0, 2) + '•'.repeat(Math.max(0, local.length - 4)) + local.slice(-2);
    return `${maskedLocal}@${domain}`;
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);

    if (errorElement) {
        errorElement.textContent = message;
    }

    if (inputElement) {
        inputElement.classList.add('error');
    }
}

function clearError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);

    if (errorElement) {
        errorElement.textContent = '';
    }

    if (inputElement) {
        inputElement.classList.remove('error');
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = getToastIcon(type);
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 300);
    }, 4000);
}

function getToastIcon(type) {
    switch(type) {
        case 'success': return 'fas fa-check-circle';
        case 'error': return 'fas fa-exclamation-circle';
        case 'warning': return 'fas fa-exclamation-triangle';
        case 'info': return 'fas fa-info-circle';
        default: return 'fas fa-check-circle';
    }
}

async function simulateApiCall(delay = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate occasional failures for demo
            if (Math.random() > 0.9) {
                reject(new Error('API Error'));
            } else {
                resolve();
            }
        }, delay);
    });
}

function handleSuccessfulLogin() {
    showToast('Welcome back! Redirecting to dashboard...', 'success');

    setTimeout(() => {
        // In a real app, this would redirect to the main dashboard
        window.location.href = '../vehicle-search/index.html';
    }, 2000);
}

function showRegister() {
    showToast('Redirecting to registration...', 'info');
    setTimeout(() => {
        window.location.href = '../guest-registration/index.html';
    }, 1000);
}

function enableTwoFactor() {
    showToast('Two-factor authentication setup coming soon!', 'info');
}

// Demo functions for showcase
function viewTripDetails() {
    showToast('Redirecting to trip management...', 'info');
    setTimeout(() => {
        window.location.href = '../trip-management/index.html';
    }, 1000);
}

function backToSearch() {
    window.location.href = '../vehicle-search/index.html';
}

function contactHost() {
    showToast('Opening chat with host...', 'info');
}

// Add input event listeners for real-time validation
document.addEventListener('DOMContentLoaded', function() {
    // Real-time validation for login form
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');

    if (loginEmail) {
        loginEmail.addEventListener('input', () => clearError('loginEmail'));
        loginEmail.addEventListener('blur', () => {
            if (loginEmail.value && !isValidEmail(loginEmail.value)) {
                showError('loginEmail', 'Please enter a valid email address');
            }
        });
    }

    if (loginPassword) {
        loginPassword.addEventListener('input', () => clearError('loginPassword'));
    }

    // Real-time validation for reset form
    const resetEmail = document.getElementById('resetEmail');
    if (resetEmail) {
        resetEmail.addEventListener('input', () => clearError('resetEmail'));
        resetEmail.addEventListener('blur', () => {
            if (resetEmail.value && !isValidEmail(resetEmail.value)) {
                showError('resetEmail', 'Please enter a valid email address');
            }
        });
    }
});