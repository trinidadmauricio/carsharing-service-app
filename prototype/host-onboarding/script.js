// Global state management
let currentScreen = 'welcome-screen';
let hostData = {
    vehicle: {},
    identity: {},
    documents: {},
    photos: {},
    pricing: {},
    profile: {}
};
let photoCount = 0;
const requiredPhotos = 6;

// Make functions available globally from start
window.captureVehiclePhoto = function(type) {
    const photoSlot = document.querySelector(`[data-type="${type}"]`);
    if (photoSlot) {
        photoSlot.classList.add('completed');
        photoCount++;
        updatePhotoProgress();
        showToast(`${type.replace('-', ' ')} photo captured!`, 'success');
    }
};

window.updatePhotoProgress = function() {
    const photoCountEl = document.getElementById('photo-count');
    const progressFill = document.getElementById('photo-progress-fill');
    const continueBtn = document.getElementById('continue-photos-btn');

    if (photoCountEl) {
        photoCountEl.textContent = `${photoCount} of ${requiredPhotos} photos completed`;
    }

    if (progressFill) {
        const percentage = (photoCount / requiredPhotos) * 100;
        progressFill.style.width = `${percentage}%`;
    }

    if (continueBtn) {
        continueBtn.disabled = photoCount < requiredPhotos;
    }
};

window.showToast = function(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? 'fa-check-circle' :
                 type === 'error' ? 'fa-exclamation-circle' :
                 type === 'warning' ? 'fa-exclamation-triangle' :
                 'fa-info-circle';

    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 4000);
};

// Track document upload state
let documentState = {
    registration: false,
    insurance: false,
    currentUpload: null
};

// Function to select which document to upload
window.selectDocument = function(type) {
    // Check if trying to upload insurance before registration
    if (type === 'insurance' && !documentState.registration) {
        showToast('Please upload vehicle registration first', 'warning');
        return;
    }

    // Don't allow selecting already completed documents
    if (documentState[type]) {
        return; // No toast needed - visual state is clear
    }

    // Set current upload type
    documentState.currentUpload = type;

    // Update upload area
    const uploadArea = document.getElementById('document-upload');
    const uploadTitle = uploadArea.querySelector('h3');
    const uploadDescription = uploadArea.querySelector('p');

    if (type === 'registration') {
        uploadTitle.textContent = 'Upload Registration';
        uploadDescription.textContent = 'Take photo of your vehicle registration document';
    } else if (type === 'insurance') {
        uploadTitle.textContent = 'Upload Insurance';
        uploadDescription.textContent = 'Take photo of your insurance certificate';
    }

    // Show upload area and scroll to it
    uploadArea.style.display = 'block';
    uploadArea.scrollIntoView({ behavior: 'smooth' });

    // No toast needed - the UI change is clear enough
};

// Function to actually upload the document
window.startUpload = function() {
    const type = documentState.currentUpload;

    if (!type) {
        return; // This shouldn't happen in normal flow
    }

    // Only show one toast for the upload process
    showToast('Processing document...', 'info');

    // Simulate document processing
    setTimeout(() => {
        const docItem = document.getElementById(`${type}-doc`);
        if (docItem) {
            docItem.classList.add('completed');
            docItem.classList.remove('clickable');
            const statusIcon = docItem.querySelector('.doc-status i');
            if (statusIcon) {
                statusIcon.className = 'fas fa-check-circle';
                statusIcon.style.color = '#10b981';
            }
        }

        // Update state
        documentState[type] = true;
        documentState.currentUpload = null;

        // Hide upload area
        const uploadArea = document.getElementById('document-upload');
        uploadArea.style.display = 'none';

        // Check if this was registration document, then enable insurance
        if (type === 'registration') {
            // Enable the insurance document
            const insuranceDoc = document.getElementById('insurance-doc');
            if (insuranceDoc) {
                insuranceDoc.classList.remove('disabled');
                insuranceDoc.classList.add('clickable');
                insuranceDoc.onclick = () => selectDocument('insurance');
                insuranceDoc.style.border = '2px solid #667eea';
                insuranceDoc.style.backgroundColor = '#f8fafc';

                // Update tap hint
                const tapHint = insuranceDoc.querySelector('.tap-hint');
                if (tapHint) {
                    tapHint.textContent = 'Tap to upload';
                }

                // Update status icon
                const statusIcon = insuranceDoc.querySelector('.doc-status i');
                if (statusIcon) {
                    statusIcon.className = 'fas fa-camera';
                }
            }
        }

        // Enable continue button only after BOTH docs are uploaded
        const continueBtn = document.getElementById('continue-docs-btn');
        if (continueBtn && documentState.registration && documentState.insurance) {
            continueBtn.disabled = false;
            continueBtn.textContent = 'Continue to Photos';
            // Only show success toast when everything is complete
            showToast('Documents uploaded successfully!', 'success');
        }
    }, 2000);
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
    }, 2000);

    // Initialize form listeners
    initializeFormListeners();

    // Initialize interactive elements
    initializeEarningsCalculator();
    initializePhotoCapture();
    initializeCharacterCounters();
});

// Screen navigation
function nextScreen(screenId) {
    const currentScreenEl = document.querySelector('.screen.active');
    const nextScreenEl = document.getElementById(screenId);

    if (currentScreenEl && nextScreenEl) {
        currentScreenEl.classList.remove('active');
        currentScreenEl.classList.add('prev');

        setTimeout(() => {
            nextScreenEl.classList.add('active');
            currentScreen = screenId;
        }, 100);
    }
}

function prevScreen(screenId) {
    const currentScreenEl = document.querySelector('.screen.active');
    const prevScreenEl = document.getElementById(screenId);

    if (currentScreenEl && prevScreenEl) {
        currentScreenEl.classList.remove('active');

        setTimeout(() => {
            prevScreenEl.classList.add('active');
            prevScreenEl.classList.remove('prev');
            currentScreen = screenId;
        }, 100);
    }
}

// Form handling
function initializeFormListeners() {
    // Vehicle info form
    const vehicleForm = document.getElementById('vehicle-info-form');
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', handleVehicleInfo);
    }

    // Profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }

    // Terms checkbox
    const hostTerms = document.getElementById('hostTerms');
    if (hostTerms) {
        hostTerms.addEventListener('change', function() {
            const launchBtn = document.getElementById('launch-listing-btn');
            launchBtn.disabled = !this.checked;
        });
    }

    // Home delivery toggle
    const homeDelivery = document.getElementById('homeDelivery');
    if (homeDelivery) {
        homeDelivery.addEventListener('change', function() {
            const deliveryDetails = document.getElementById('delivery-details');
            deliveryDetails.style.display = this.checked ? 'block' : 'none';
        });
    }
}

function handleVehicleInfo(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    hostData.vehicle = {
        year: formData.get('vehicleYear'),
        make: formData.get('vehicleMake'),
        model: formData.get('vehicleModel'),
        mileage: formData.get('vehicleMileage'),
        location: formData.get('vehicleLocation')
    };

    // Validate mileage
    if (parseInt(hostData.vehicle.mileage) > 200000) {
        showToast('Vehicle mileage must be under 200,000 miles', 'error');
        return;
    }

    // Show eligibility success
    showToast('Great! Your vehicle qualifies for hosting', 'success');

    // Move to next screen
    setTimeout(() => {
        nextScreen('identity-intro-screen');
    }, 1000);
}

function handleProfileSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    hostData.profile = {
        bio: formData.get('hostBio'),
        responseTime: formData.get('responseTime'),
        homeDelivery: document.getElementById('homeDelivery').checked,
        deliveryRadius: formData.get('deliveryRadius'),
        deliveryFee: formData.get('deliveryFee'),
        specialInstructions: formData.get('specialInstructions')
    };

    showToast('Profile completed successfully!', 'success');

    setTimeout(() => {
        nextScreen('review-screen');
        updateReviewScreen();
    }, 1000);
}

// Earnings calculator
function initializeEarningsCalculator() {
    const dailyRate = document.getElementById('dailyRate');
    const daysPerMonth = document.getElementById('daysPerMonth');

    if (dailyRate) {
        dailyRate.addEventListener('input', updateEarnings);
    }

    if (daysPerMonth) {
        daysPerMonth.addEventListener('input', updateEarnings);
    }

    // Initial calculation
    updateEarnings();
}

function updateEarnings() {
    const dailyRate = document.getElementById('dailyRate');
    const daysPerMonth = document.getElementById('daysPerMonth');
    const daysValue = document.getElementById('days-value');
    const calcDailyRate = document.getElementById('calc-daily-rate');
    const calcDays = document.getElementById('calc-days');
    const calcMonthly = document.getElementById('calc-monthly');
    const calcAnnual = document.getElementById('calc-annual');

    if (!dailyRate || !daysPerMonth) return;

    const rate = parseInt(dailyRate.value) || 55;
    const days = parseInt(daysPerMonth.value) || 18;
    const monthly = rate * days;
    const annual = monthly * 12;

    if (daysValue) daysValue.textContent = `${days} days`;
    if (calcDailyRate) calcDailyRate.textContent = `$${rate}`;
    if (calcDays) calcDays.textContent = `${days} days`;
    if (calcMonthly) calcMonthly.textContent = `$${monthly.toLocaleString()}`;
    if (calcAnnual) calcAnnual.textContent = `$${annual.toLocaleString()}`;

    // Save pricing data
    hostData.pricing = {
        dailyRate: rate,
        daysPerMonth: days,
        monthlyEarnings: monthly,
        annualEarnings: annual
    };
}

// Character counters
function initializeCharacterCounters() {
    const bioTextarea = document.getElementById('hostBio');
    const bioCounter = document.getElementById('bio-count');

    if (bioTextarea && bioCounter) {
        bioTextarea.addEventListener('input', function() {
            bioCounter.textContent = this.value.length;
        });
    }

    const instructionsTextarea = document.getElementById('specialInstructions');
    const instructionsCounter = document.getElementById('instructions-count');

    if (instructionsTextarea && instructionsCounter) {
        instructionsTextarea.addEventListener('input', function() {
            instructionsCounter.textContent = this.value.length;
        });
    }
}

// Photo capture simulation
function captureVehiclePhoto(type) {
    const photoSlot = document.querySelector(`[data-type="${type}"]`);
    if (photoSlot) {
        photoSlot.classList.add('completed');
        photoCount++;
        updatePhotoProgress();
        showToast(`${type.replace('-', ' ')} photo captured!`, 'success');
    }
}

function initializePhotoCapture() {
    // Photo capture is now available globally
    // Additional initialization if needed
}

function updatePhotoProgress() {
    const photoCountEl = document.getElementById('photo-count');
    const progressFill = document.getElementById('photo-progress-fill');
    const continueBtn = document.getElementById('continue-photos-btn');

    if (photoCountEl) {
        photoCountEl.textContent = `${photoCount} of ${requiredPhotos} photos completed`;
    }

    if (progressFill) {
        const percentage = (photoCount / requiredPhotos) * 100;
        progressFill.style.width = `${percentage}%`;
    }

    if (continueBtn) {
        continueBtn.disabled = photoCount < requiredPhotos;
    }
}

// Document capture simulation
function captureDocument(type) {
    showToast('Document capture feature would integrate with device camera', 'info');

    // Simulate document processing
    setTimeout(() => {
        const docItem = document.getElementById(`${type}-doc`);
        if (docItem) {
            docItem.classList.add('completed');
            const statusIcon = docItem.querySelector('.doc-status i');
            if (statusIcon) {
                statusIcon.className = 'fas fa-check-circle';
                statusIcon.style.color = '#10b981';
            }
        }

        showToast(`${type} document processed successfully!`, 'success');

        // Check if this was registration document, then prompt for insurance
        if (type === 'registration') {
            setTimeout(() => {
                showToast('Please upload your insurance certificate next', 'info');
                // Highlight the insurance document
                const insuranceDoc = document.getElementById('insurance-doc');
                if (insuranceDoc) {
                    insuranceDoc.style.border = '2px solid #667eea';
                    insuranceDoc.style.backgroundColor = '#f8fafc';
                }
            }, 1000);
        }

        // Enable continue button after both docs are "uploaded"
        const continueBtn = document.getElementById('continue-docs-btn');
        const completedDocs = document.querySelectorAll('.doc-item.completed').length;
        if (continueBtn && completedDocs >= 2) {
            continueBtn.disabled = false;
            continueBtn.textContent = 'Continue to Photos';
            showToast('All documents uploaded! Ready to continue', 'success');
        }
    }, 2000);
}

// License capture simulation
function captureLicense() {
    const cameraContainer = document.getElementById('license-camera-container');
    const processing = document.getElementById('license-processing');

    if (cameraContainer) cameraContainer.style.display = 'none';
    if (processing) processing.style.display = 'block';

    // Simulate OCR processing
    setTimeout(() => {
        if (processing) processing.style.display = 'none';
        showToast('License verified successfully!', 'success');
        nextScreen('vehicle-docs-screen');
    }, 3000);
}

function uploadLicenseFromGallery() {
    showToast('Gallery upload feature would integrate with device photo library', 'info');
    captureLicense(); // Simulate the same flow
}

function retakeLicense() {
    const preview = document.getElementById('license-preview');
    const cameraContainer = document.getElementById('license-camera-container');

    if (preview) preview.style.display = 'none';
    if (cameraContainer) cameraContainer.style.display = 'block';
}

function processLicense() {
    const processing = document.getElementById('license-processing');
    if (processing) processing.style.display = 'block';

    setTimeout(() => {
        showToast('License processed successfully!', 'success');
        nextScreen('vehicle-docs-screen');
    }, 2000);
}

// Profile photo upload simulation
function uploadProfilePhoto() {
    showToast('Profile photo upload feature would integrate with device camera/gallery', 'info');

    const placeholder = document.querySelector('#profile-photo-upload .photo-placeholder');
    if (placeholder) {
        placeholder.innerHTML = '<i class="fas fa-check-circle"></i><span>Photo Added</span>';
        placeholder.style.borderColor = '#10b981';
        placeholder.style.color = '#10b981';
    }
}

// Review screen updates
function updateReviewScreen() {
    // Update vehicle name
    const vehicleNameEl = document.getElementById('preview-vehicle-name');
    if (vehicleNameEl && hostData.vehicle) {
        vehicleNameEl.textContent = `${hostData.vehicle.year} ${hostData.vehicle.make} ${hostData.vehicle.model}`;
    }

    // Update pricing display
    const priceDisplays = document.querySelectorAll('.pricing-display .price');
    priceDisplays.forEach(el => {
        if (hostData.pricing) {
            el.textContent = `$${hostData.pricing.dailyRate}`;
        }
    });

    // Update earnings projections
    if (hostData.pricing) {
        const conservative = hostData.pricing.dailyRate * 12;
        const expected = hostData.pricing.monthlyEarnings;
        const optimistic = hostData.pricing.dailyRate * 25;

        document.querySelector('.projection-item:nth-child(1) .amount').textContent = `$${conservative.toLocaleString()}`;
        document.querySelector('.projection-item:nth-child(2) .amount').textContent = `$${expected.toLocaleString()}`;
        document.querySelector('.projection-item:nth-child(3) .amount').textContent = `$${optimistic.toLocaleString()}`;
    }
}

// Launch listing
function launchListing() {
    showToast('Publishing your listing...', 'info');

    // Simulate API call
    setTimeout(() => {
        showToast('Listing published successfully!', 'success');
        nextScreen('success-screen');
    }, 2000);
}

// Modal handling
function showHowItWorks() {
    const modal = document.getElementById('how-it-works-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeHowItWorks() {
    const modal = document.getElementById('how-it-works-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Success screen actions
function goToHostDashboard() {
    showToast('Redirecting to host dashboard...', 'info');
    // In a real app, this would navigate to the host dashboard
}

function shareOnSocial() {
    showToast('Social sharing feature would integrate with native sharing', 'info');
    // In a real app, this would open native share dialog
}

function openHostEducation() {
    showToast('Opening host education center...', 'info');
    // In a real app, this would navigate to education resources
}

function contactSupport() {
    showToast('Support contact feature would open chat or phone options', 'info');
    // In a real app, this would open support chat or contact options
}

function joinHostCommunity() {
    showToast('Community feature would connect hosts for networking', 'info');
    // In a real app, this would open community forum or chat
}

// Toast notification system
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? 'fa-check-circle' :
                 type === 'error' ? 'fa-exclamation-circle' :
                 type === 'warning' ? 'fa-exclamation-triangle' :
                 'fa-info-circle';

    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Form validation helpers
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else {
            clearError(input);
        }
    });

    return isValid;
}

function showError(input, message) {
    input.classList.add('error');
    const errorEl = document.getElementById(`${input.name}-error`);
    if (errorEl) {
        errorEl.textContent = message;
    }
}

function clearError(input) {
    input.classList.remove('error');
    const errorEl = document.getElementById(`${input.name}-error`);
    if (errorEl) {
        errorEl.textContent = '';
    }
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
}

// Handle window events
window.addEventListener('resize', function() {
    // Handle responsive adjustments if needed
});

// Handle back button (for web)
window.addEventListener('popstate', function(e) {
    // Handle browser back button if needed
});

// Export functions for global access
window.nextScreen = nextScreen;
window.prevScreen = prevScreen;
window.showHowItWorks = showHowItWorks;
window.closeHowItWorks = closeHowItWorks;
window.captureLicense = captureLicense;
window.uploadLicenseFromGallery = uploadLicenseFromGallery;
window.retakeLicense = retakeLicense;
window.processLicense = processLicense;
window.captureDocument = captureDocument;
window.captureVehiclePhoto = captureVehiclePhoto;
window.uploadProfilePhoto = uploadProfilePhoto;
window.updateEarnings = updateEarnings;
window.launchListing = launchListing;
window.goToHostDashboard = goToHostDashboard;
window.shareOnSocial = shareOnSocial;
window.openHostEducation = openHostEducation;
window.contactSupport = contactSupport;
window.joinHostCommunity = joinHostCommunity;