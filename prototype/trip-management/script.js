// Global variables and state
let tripState = {
    startTime: new Date(),
    plannedEndTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    currentCost: 22.50,
    baseRate: 8.50,
    checklist: {
        fuel: false,
        cleanliness: false,
        damage: false,
        odometer: null
    },
    photos: {
        exterior: false,
        fuel: false,
        odometer: false
    },
    ratings: {
        vehicle: 0,
        host: 0,
        overall: 0
    },
    currentPhotoType: null
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            // Asegurar que esté completamente oculto y fuera del flujo
            loadingScreen.style.display = 'none';
            loadingScreen.style.visibility = 'hidden';
            loadingScreen.style.opacity = '0';
            loadingScreen.style.pointerEvents = 'none';
            loadingScreen.style.zIndex = '-1';
            loadingScreen.style.position = 'absolute';
            loadingScreen.style.top = '-9999px';
            loadingScreen.style.left = '-9999px';
            // Asegurar que el contenido de la pantalla activa esté visible
            const activeScreen = document.querySelector('.screen.active');
            if (activeScreen) {
                activeScreen.style.visibility = 'visible';
                activeScreen.style.opacity = '1';
                activeScreen.style.display = 'block';
            }
        }
    }, 2000);

    // Asegurar que las pantallas que requieren acción estén ocultas inicialmente
    const tripReturnScreen = document.getElementById('trip-return-screen');
    const tripCompletionScreen = document.getElementById('trip-completion-screen');
    
    if (tripReturnScreen) {
        tripReturnScreen.style.display = 'none';
        tripReturnScreen.style.visibility = 'hidden';
        tripReturnScreen.classList.remove('active');
    }
    
    if (tripCompletionScreen) {
        tripCompletionScreen.style.display = 'none';
        tripCompletionScreen.style.visibility = 'hidden';
        tripCompletionScreen.classList.remove('active');
    }

    // Start trip timer
    startTripTimer();

    // Initialize event listeners
    initializeEventListeners();

    // Initialize rating system
    initializeRatings();
});

// Trip timer functionality
function startTripTimer() {
    const timerElement = document.getElementById('time-remaining');
    const costElement = document.getElementById('current-cost');

    function updateTimer() {
        const now = new Date();
        const timeRemaining = tripState.plannedEndTime - now;

        if (timeRemaining > 0) {
            const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            timerElement.textContent = `${hours}h ${minutes}m`;
        } else {
            // Trip is overtime
            const overtime = now - tripState.plannedEndTime;
            const hours = Math.floor(overtime / (1000 * 60 * 60));
            const minutes = Math.floor((overtime % (1000 * 60 * 60)) / (1000 * 60));
            timerElement.textContent = `-${hours}h ${minutes}m`;
            timerElement.style.color = '#ef4444';

            // Show cost warning
            const costWarning = document.getElementById('cost-warning');
            if (costWarning) {
                costWarning.style.display = 'flex';
            }
        }

        // Update current cost
        const elapsed = now - tripState.startTime;
        const elapsedHours = elapsed / (1000 * 60 * 60);
        const newCost = (elapsedHours * tripState.baseRate) + 1.25; // +1.25 service fee
        tripState.currentCost = newCost;
        costElement.textContent = `$${newCost.toFixed(2)}`;
    }

    // Update every minute
    updateTimer();
    setInterval(updateTimer, 60000);
}

// Event listeners
function initializeEventListeners() {
    // Modal close handlers
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Extend trip options
    document.querySelectorAll('.extend-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.extend-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Key return options
    document.querySelectorAll('.return-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.return-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

// Screen navigation
function nextScreen(screenId) {
    const currentScreen = document.querySelector('.screen.active');
    const nextScreenEl = document.getElementById(screenId);

    if (!currentScreen || !nextScreenEl) return;

    // Remover clase active de la pantalla actual
    currentScreen.classList.remove('active');
    currentScreen.classList.add('prev');
    
    // Ocultar completamente las pantallas que requieren acción cuando se sale de ellas
    if (currentScreen.id === 'trip-return-screen' || currentScreen.id === 'trip-completion-screen') {
        currentScreen.style.display = 'none';
        currentScreen.style.visibility = 'hidden';
        currentScreen.style.opacity = '0';
    }

    // Mostrar y activar la siguiente pantalla
    setTimeout(() => {
        // Asegurar que la pantalla esté visible antes de agregar active
        // Especialmente importante para pantallas que requieren acción
        nextScreenEl.style.display = 'block';
        nextScreenEl.style.visibility = 'visible';
        nextScreenEl.style.opacity = '1';
        nextScreenEl.classList.add('active');
    }, 50);
}

function prevScreen(screenId) {
    const currentScreen = document.querySelector('.screen.active');
    const prevScreenEl = document.getElementById(screenId);

    if (!currentScreen || !prevScreenEl) return;

    // Ocultar completamente la pantalla actual si es una pantalla que requiere acción
    if (currentScreen.id === 'trip-return-screen' || currentScreen.id === 'trip-completion-screen') {
        currentScreen.style.display = 'none';
        currentScreen.style.visibility = 'hidden';
    }
    
    currentScreen.classList.remove('active');

    setTimeout(() => {
        // Mostrar y activar la pantalla anterior
        prevScreenEl.style.display = 'block';
        prevScreenEl.style.visibility = 'visible';
        prevScreenEl.style.opacity = '1';
        prevScreenEl.classList.remove('prev');
        prevScreenEl.classList.add('active');
    }, 50);
}

// Quick actions
function showExtendTrip() {
    const modal = document.getElementById('extend-trip-modal');
    modal.classList.add('show');
}

function closeExtendTrip() {
    const modal = document.getElementById('extend-trip-modal');
    modal.classList.remove('show');
}

function requestExtension() {
    const selectedOption = document.querySelector('.extend-option.selected');
    if (selectedOption) {
        const hours = selectedOption.dataset.hours;
        showToast('Extension request sent! Host will respond soon.', 'success');
        closeExtendTrip();

        // Update planned end time
        tripState.plannedEndTime = new Date(tripState.plannedEndTime.getTime() + (hours * 60 * 60 * 1000));
    }
}

function openDirections() {
    showToast('Opening directions to current location...', 'info');
    // In a real app, this would open maps
}

function openReturnDirections() {
    showToast('Opening directions to return location...', 'info');
    // In a real app, this would open maps
}

function contactHost() {
    showToast('Opening chat with Maria S...', 'info');
    // In a real app, this would open messaging
}

function showEmergencyContact() {
    const modal = document.getElementById('emergency-modal');
    modal.classList.add('show');
}

function closeEmergency() {
    const modal = document.getElementById('emergency-modal');
    modal.classList.remove('show');
}

function call911() {
    showToast('Dialing emergency services...', 'warning');
    closeEmergency();
}

function callRoadside() {
    showToast('Connecting to roadside assistance...', 'info');
    closeEmergency();
}

function callSupport() {
    showToast('Calling CarShare support...', 'info');
    closeEmergency();
}

// Return process functions
function updateChecklist(checkbox, type) {
    tripState.checklist[type] = checkbox.checked;

    const checklistItem = checkbox.closest('.checklist-item');
    if (checkbox.checked) {
        checklistItem.classList.add('completed');
    } else {
        checklistItem.classList.remove('completed');
    }

    updateReturnButton();
}

function updateOdometer(input) {
    const value = parseInt(input.value);
    if (value && value > 0) {
        tripState.checklist.odometer = value;

        // Calculate miles driven
        const startingMiles = 45185; // Mock starting odometer
        const milesDriven = value - startingMiles;
        document.getElementById('miles-driven').textContent = `${milesDriven} miles`;

        input.closest('.checklist-item').classList.add('completed');
    } else {
        tripState.checklist.odometer = null;
        input.closest('.checklist-item').classList.remove('completed');
    }

    updateReturnButton();
}

function updateReturnButton() {
    const button = document.getElementById('complete-return-btn');
    const allChecked = tripState.checklist.fuel &&
                      tripState.checklist.cleanliness &&
                      tripState.checklist.damage &&
                      tripState.checklist.odometer;
    const allPhotos = tripState.photos.exterior &&
                     tripState.photos.fuel &&
                     tripState.photos.odometer;

    if (allChecked && allPhotos) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}

// Photo functionality
function takePhoto(type) {
    tripState.currentPhotoType = type;
    const modal = document.getElementById('photo-modal');
    const title = document.getElementById('photo-modal-title');
    const instruction = document.getElementById('photo-instruction');
    const icon = document.getElementById('photo-icon');

    // Update modal content based on photo type
    switch(type) {
        case 'exterior':
            title.textContent = 'Vehicle Exterior Photo';
            instruction.textContent = 'Capture the full exterior of the vehicle';
            icon.className = 'fas fa-car';
            break;
        case 'fuel':
            title.textContent = 'Fuel Gauge Photo';
            instruction.textContent = 'Take a clear photo of the fuel gauge';
            icon.className = 'fas fa-gas-pump';
            break;
        case 'odometer':
            title.textContent = 'Odometer Photo';
            instruction.textContent = 'Capture the odometer reading clearly';
            icon.className = 'fas fa-tachometer-alt';
            break;
    }

    modal.classList.add('show');
}

function capturePhoto() {
    // Simulate photo capture
    const type = tripState.currentPhotoType;
    tripState.photos[type] = true;

    // Update UI
    const photoItem = document.querySelector(`[data-photo="${type}"]`);
    const status = photoItem.querySelector('.photo-status i');
    status.style.display = 'block';

    closePhotoModal();
    showToast('Photo captured successfully!', 'success');
    updateReturnButton();
}

function uploadFromGallery() {
    // Simulate gallery upload
    const type = tripState.currentPhotoType;
    tripState.photos[type] = true;

    // Update UI
    const photoItem = document.querySelector(`[data-photo="${type}"]`);
    const status = photoItem.querySelector('.photo-status i');
    status.style.display = 'block';

    closePhotoModal();
    showToast('Photo uploaded successfully!', 'success');
    updateReturnButton();
}

function closePhotoModal() {
    const modal = document.getElementById('photo-modal');
    modal.classList.remove('show');
    tripState.currentPhotoType = null;
}

// Rating system
function initializeRatings() {
    document.querySelectorAll('.star-rating').forEach(rating => {
        const stars = rating.querySelectorAll('i');
        const ratingType = rating.dataset.rating;

        stars.forEach((star, index) => {
            star.addEventListener('click', function() {
                const value = index + 1;
                tripState.ratings[ratingType] = value;

                // Update visual state
                stars.forEach((s, i) => {
                    if (i < value) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });

            star.addEventListener('mouseover', function() {
                const value = index + 1;
                stars.forEach((s, i) => {
                    if (i < value) {
                        s.style.color = '#fbbf24';
                    } else {
                        s.style.color = '#d1d5db';
                    }
                });
            });
        });

        rating.addEventListener('mouseleave', function() {
            const currentRating = tripState.ratings[ratingType];
            stars.forEach((s, i) => {
                if (i < currentRating) {
                    s.style.color = '#fbbf24';
                    s.classList.add('active');
                } else {
                    s.style.color = '#d1d5db';
                    s.classList.remove('active');
                }
            });
        });
    });
}

// Completion actions
function submitRating() {
    const vehicle = tripState.ratings.vehicle;
    const host = tripState.ratings.host;
    const overall = tripState.ratings.overall;

    if (vehicle === 0 || host === 0 || overall === 0) {
        showToast('Please rate all categories before submitting', 'warning');
        return;
    }

    // Simulate API call
    showToast('Thank you for your feedback!', 'success');

    // Show completion message after delay
    setTimeout(() => {
        showToast('Trip complete! Redirecting to dashboard...', 'info');
        setTimeout(() => {
            goToBookings();
        }, 2000);
    }, 1500);
}

function downloadReceipt() {
    showToast('Downloading receipt...', 'info');
    // In a real app, this would generate and download a PDF
}

function bookAgain() {
    showToast('Redirecting to vehicle search...', 'info');
    // In a real app, this would navigate to search page
}

function shareExperience() {
    showToast('Opening share options...', 'info');
    // In a real app, this would open native share sheet
}

// Navigation functions
function goToBookings() {
    showToast('Returning to bookings dashboard...', 'info');
    // In a real app, this would navigate back to main app
}

function viewTripDetails() {
    showToast('Opening detailed trip history...', 'info');
    // In a real app, this would show trip details page
}

function backToSearch() {
    showToast('Opening vehicle search...', 'info');
    // In a real app, this would navigate to search
}

// Utility functions
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = getToastIcon(type);
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function getToastIcon(type) {
    switch(type) {
        case 'success':
            return 'fas fa-check-circle';
        case 'error':
            return 'fas fa-exclamation-circle';
        case 'warning':
            return 'fas fa-exclamation-triangle';
        default:
            return 'fas fa-info-circle';
    }
}

// Update trip summary values dynamically
function updateTripSummary() {
    const now = new Date();
    const duration = now - tripState.startTime;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById('trip-duration').textContent = `${hours}h ${minutes}m`;
    document.getElementById('final-cost').textContent = `$${tripState.currentCost.toFixed(2)}`;
}

// Call update functions periodically
setInterval(updateTripSummary, 60000);

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// Handle screen transitions with animation callbacks
function transitionToScreen(fromScreenId, toScreenId, direction = 'forward') {
    const fromScreen = document.getElementById(fromScreenId);
    const toScreen = document.getElementById(toScreenId);

    if (direction === 'forward') {
        fromScreen.classList.remove('active');
        fromScreen.classList.add('prev');

        setTimeout(() => {
            toScreen.classList.add('active');
        }, 150);
    } else {
        fromScreen.classList.remove('active');

        setTimeout(() => {
            toScreen.classList.remove('prev');
            toScreen.classList.add('active');
        }, 150);
    }
}

// Auto-advance to completion after return process
function completeReturn() {
    updateTripSummary();
    nextScreen('trip-completion-screen');
}

// Simulate real-time updates
function simulateRealtimeUpdates() {
    // Update cost every 30 seconds
    setInterval(() => {
        const costElement = document.getElementById('current-cost');
        if (costElement) {
            tripState.currentCost += 0.25; // Increment cost
            costElement.textContent = `$${tripState.currentCost.toFixed(2)}`;
        }
    }, 30000);
}

// Start real-time simulation
simulateRealtimeUpdates();

// Export functions for global access
window.nextScreen = nextScreen;
window.prevScreen = prevScreen;
window.showExtendTrip = showExtendTrip;
window.closeExtendTrip = closeExtendTrip;
window.requestExtension = requestExtension;
window.openDirections = openDirections;
window.openReturnDirections = openReturnDirections;
window.contactHost = contactHost;
window.showEmergencyContact = showEmergencyContact;
window.closeEmergency = closeEmergency;
window.call911 = call911;
window.callRoadside = callRoadside;
window.callSupport = callSupport;
window.updateChecklist = updateChecklist;
window.updateOdometer = updateOdometer;
window.takePhoto = takePhoto;
window.capturePhoto = capturePhoto;
window.uploadFromGallery = uploadFromGallery;
window.closePhotoModal = closePhotoModal;
window.submitRating = submitRating;
window.downloadReceipt = downloadReceipt;
window.bookAgain = bookAgain;
window.shareExperience = shareExperience;
window.goToBookings = goToBookings;
window.viewTripDetails = viewTripDetails;
window.backToSearch = backToSearch;