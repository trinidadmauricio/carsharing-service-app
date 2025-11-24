// Vehicle Search Prototype JavaScript
class VehicleSearchApp {
    constructor() {
        this.currentScreen = 'dashboard';
        this.isMapView = false;
        this.vehicles = this.initializeVehicleData();
        this.filteredVehicles = [...this.vehicles];
        this.selectedVehicle = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDateTime();
        this.setupFilterChips();
        this.setupMapPins();
        this.setupThumbnailGallery();
    }

    initializeVehicleData() {
        return [
            {
                id: 1,
                name: 'Honda Civic 2022',
                category: 'economy',
                image: 'https://images.unsplash.com/photo-1549399810-c8b8bfe0f8da?w=300&h=200&fit=crop',
                images: [
                    'https://images.unsplash.com/photo-1549399810-c8b8bfe0f8da?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1450358747620-ec2c4de2d6a8?w=400&h=300&fit=crop'
                ],
                distance: 0.2,
                rating: 4.9,
                reviews: 24,
                hourlyRate: 8.50,
                totalPrice: 34.00,
                host: {
                    name: 'Maria S.',
                    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b05b?w=60&h=60&fit=crop&crop=face',
                    type: 'superhost'
                },
                features: ['5 seats', 'Gasoline', 'WiFi'],
                location: 'Downtown Parking Garage'
            },
            {
                id: 2,
                name: 'BMW 3 Series 2023',
                category: 'luxury',
                image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&h=200&fit=crop',
                images: [
                    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1450358747620-ec2c4de2d6a8?w=400&h=300&fit=crop'
                ],
                distance: 0.4,
                rating: 4.8,
                reviews: 18,
                hourlyRate: 15.00,
                totalPrice: 60.00,
                host: {
                    name: 'David K.',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
                    type: 'superhost'
                },
                features: ['5 seats', 'Premium', 'AC'],
                location: 'Luxury Car Center'
            },
            {
                id: 3,
                name: 'Tesla Model 3 2023',
                category: 'electric',
                image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=300&h=200&fit=crop',
                images: [
                    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1450358747620-ec2c4de2d6a8?w=400&h=300&fit=crop'
                ],
                distance: 0.6,
                rating: 4.9,
                reviews: 31,
                hourlyRate: 12.00,
                totalPrice: 48.00,
                host: {
                    name: 'Sarah L.',
                    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
                    type: 'superhost'
                },
                features: ['5 seats', 'Electric', 'Autopilot'],
                location: 'Tesla Supercharger Station'
            },
            {
                id: 4,
                name: 'Toyota RAV4 2022',
                category: 'suv',
                image: 'https://images.unsplash.com/photo-1606611992954-79b164aad434?w=300&h=200&fit=crop',
                images: [
                    'https://images.unsplash.com/photo-1606611992954-79b164aad434?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1450358747620-ec2c4de2d6a8?w=400&h=300&fit=crop'
                ],
                distance: 0.8,
                rating: 4.2,
                reviews: 12,
                hourlyRate: 11.00,
                totalPrice: 44.00,
                host: {
                    name: 'Carlos M.',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
                    type: 'verified'
                },
                features: ['7 seats', 'AWD', 'Large trunk'],
                location: 'Family Car Hub'
            }
        ];
    }

    setupEventListeners() {
        // Search functionality
        const locationInput = document.getElementById('location-search');
        if (locationInput) {
            locationInput.addEventListener('input', this.debounce(this.handleLocationSearch.bind(this), 300));
        }

        // Favorite button toggles
        document.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-btn')) {
                this.toggleFavorite(e.target.closest('.favorite-btn'));
            }
        });

        // Map pin clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.map-pin')) {
                const vehicleId = parseInt(e.target.closest('.map-pin').dataset.vehicle);
                this.showMapPreview(vehicleId);
            }
        });

        // Thumbnail gallery
        document.addEventListener('click', (e) => {
            if (e.target.closest('.gallery-thumb')) {
                const thumbnail = e.target.closest('.gallery-thumb');
                this.updateActiveThumbnail(thumbnail);
                // Don't switch main image since we're using placeholders
            }
        });

        // Filter chips
        document.addEventListener('click', (e) => {
            if (e.target.matches('.filter-chip')) {
                handleFilterChip(e.target);
            }
        });

        // Close modal on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal')) {
                this.hideFilters();
            }
        });
    }

    updateDateTime() {
        const now = new Date();
        const pickup = new Date(now.getTime() + (2 * 60 * 60 * 1000)); // 2 hours from now
        const return_ = new Date(pickup.getTime() + (4 * 60 * 60 * 1000)); // 4 hours later

        const pickupInput = document.getElementById('pickup-time');
        const returnInput = document.getElementById('return-time');

        if (pickupInput) {
            pickupInput.value = this.formatDateTimeLocal(pickup);
        }
        if (returnInput) {
            returnInput.value = this.formatDateTimeLocal(return_);
        }
    }

    formatDateTimeLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    setupFilterChips() {
        const filterChips = document.querySelectorAll('.filter-chip');
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const filter = chip.dataset.filter;
                this.applyFilter(filter);
            });
        });
    }

    setupMapPins() {
        const mapPins = document.querySelectorAll('.map-pin');
        mapPins.forEach(pin => {
            pin.addEventListener('click', () => {
                const vehicleId = parseInt(pin.dataset.vehicle);
                this.showMapPreview(vehicleId);
            });
        });
    }

    setupThumbnailGallery() {
        const thumbnails = document.querySelectorAll('.gallery-thumb');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                this.updateActiveThumbnail(thumb);
                // Don't switch main image since we're using placeholders
            });
        });
    }

    // Screen Navigation
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            targetScreen.classList.add('fade-in');
            this.currentScreen = screenId;
        }
    }

    // Search and Filter Functions
    handleLocationSearch(e) {
        const query = e.target.value.toLowerCase();
        // Simulate location search - in real app would call geocoding API
        console.log('Searching for location:', query);

        // Add visual feedback
        this.showSearchSuggestions(query);
    }

    showSearchSuggestions(query) {
        // Simulate showing location suggestions
        if (query.length > 2) {
            console.log('Showing suggestions for:', query);
            // In real app, would show dropdown with suggestions
        }
    }

    applyFilter(filter) {
        // Update active filter chip
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });

        const activeChip = document.querySelector(`[data-filter="${filter}"]`);
        if (activeChip) {
            activeChip.classList.add('active');
        }

        // Filter vehicles
        if (filter === 'all') {
            this.filteredVehicles = [...this.vehicles];
        } else {
            this.filteredVehicles = this.vehicles.filter(vehicle =>
                vehicle.category === filter
            );
        }

        this.updateVehicleList();
        this.addFilterAnimation();
    }

    updateVehicleList() {
        const vehicleCards = document.querySelectorAll('.vehicle-card');

        vehicleCards.forEach(card => {
            const category = card.dataset.category;
            const isVisible = this.filteredVehicles.some(v => v.category === category);

            if (isVisible) {
                card.style.display = 'block';
                card.classList.add('slide-up');
            } else {
                card.style.display = 'none';
            }
        });
    }

    addFilterAnimation() {
        const resultsList = document.querySelector('.results-list');
        if (resultsList) {
            resultsList.classList.add('fade-in');
            setTimeout(() => {
                resultsList.classList.remove('fade-in');
            }, 300);
        }
    }

    // View Toggle Functions
    toggleView() {
        this.isMapView = !this.isMapView;

        const listView = document.getElementById('list-view');
        const mapView = document.getElementById('map-view');
        const viewIcon = document.getElementById('view-icon');

        if (this.isMapView) {
            listView.classList.remove('active');
            mapView.classList.add('active');
            viewIcon.className = 'fas fa-list';
        } else {
            mapView.classList.remove('active');
            listView.classList.add('active');
            viewIcon.className = 'fas fa-map';
        }

        this.animateViewTransition();
    }

    animateViewTransition() {
        const container = document.querySelector('.search-results-container');
        if (container) {
            container.classList.add('fade-in');
            setTimeout(() => {
                container.classList.remove('fade-in');
            }, 300);
        }
    }

    // Map Functions
    showMapPreview(vehicleId) {
        const vehicle = this.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        const preview = document.getElementById('map-preview');
        if (preview) {
            preview.innerHTML = this.generateMapPreviewCard(vehicle);
            preview.classList.add('show');

            // Auto-hide after 5 seconds
            setTimeout(() => {
                preview.classList.remove('show');
            }, 5000);
        }
    }

    generateMapPreviewCard(vehicle) {
        return `
            <div class="vehicle-card" onclick="showVehicleDetail(${vehicle.id})">
                <div class="vehicle-image">
                    <img src="${vehicle.image}" alt="${vehicle.name}">
                    <div class="distance-badge">${vehicle.distance} mi</div>
                </div>
                <div class="vehicle-info">
                    <div class="vehicle-header">
                        <h3>${vehicle.name}</h3>
                        <div class="rating">
                            <span class="stars">${this.generateStars(vehicle.rating)}</span>
                            <span class="rating-count">(${vehicle.reviews})</span>
                        </div>
                    </div>
                    <div class="pricing">
                        <span class="price">$${vehicle.hourlyRate.toFixed(2)}<small>/hour</small></span>
                        <span class="total">$${vehicle.totalPrice.toFixed(2)} total</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Vehicle Detail Functions
    showVehicleDetail(vehicleId) {
        const vehicle = this.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        this.selectedVehicle = vehicle;
        this.populateVehicleDetail(vehicle);
        this.showScreen('vehicle-detail-screen');
    }

    populateVehicleDetail(vehicle) {
        // Update main image and title
        const mainImage = document.getElementById('detail-main-image');
        const title = document.getElementById('detail-title');

        if (mainImage) mainImage.src = vehicle.images[0];
        if (title) title.textContent = vehicle.name;

        // Update thumbnail strip with placeholders (keep our custom placeholders)
        const thumbnailStrip = document.querySelector('.thumbnail-strip');
        if (thumbnailStrip) {
            // Don't override - keep the existing placeholder thumbnails
            // Just ensure the first one is marked as active
            const thumbs = thumbnailStrip.querySelectorAll('.gallery-thumb');
            thumbs.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === 0);
            });
        }

        // Update pricing
        const totalPrice = document.querySelector('.pricing-summary .total-price');
        const priceDetails = document.querySelector('.pricing-summary .price-details');

        if (totalPrice) totalPrice.textContent = `$${vehicle.totalPrice.toFixed(2)}`;
        if (priceDetails) priceDetails.textContent = `$${vehicle.hourlyRate.toFixed(2)}/hour • 4 hours`;
    }

    switchMainImage(src) {
        const mainImage = document.getElementById('detail-main-image');
        if (mainImage) {
            // Add loading effect
            mainImage.style.opacity = '0.5';

            setTimeout(() => {
                mainImage.src = src.replace('w=80&h=60', 'w=400&h=300');
                mainImage.style.opacity = '1';
            }, 150);
        }
    }

    updateActiveThumbnail(activeThumbnail) {
        document.querySelectorAll('.gallery-thumb').forEach(thumb => {
            thumb.classList.remove('active');
        });
        activeThumbnail.classList.add('active');
    }

    // Booking Functions
    showBookingSummary() {
        if (!this.selectedVehicle) return;

        this.populateBookingSummary(this.selectedVehicle);
        this.showScreen('booking-summary-screen');
    }

    populateBookingSummary(vehicle) {
        // Update vehicle summary card
        const summaryCard = document.querySelector('.vehicle-summary-card');
        if (summaryCard) {
            summaryCard.querySelector('img').src = vehicle.image;
            summaryCard.querySelector('h3').textContent = vehicle.name;
            summaryCard.querySelector('p').textContent = `${vehicle.host.name} • ${vehicle.host.type === 'superhost' ? 'Superhost' : 'Verified'}`;
        }

        // Update price breakdown
        const priceRows = document.querySelectorAll('.price-breakdown-card .price-row');
        if (priceRows.length >= 4) {
            priceRows[0].querySelector('span:last-child').textContent = `$${vehicle.totalPrice.toFixed(2)}`;
            priceRows[3].querySelector('span:last-child').textContent = '$40.50'; // Total with fees
        }
    }

    // Modal Functions
    showFilters() {
        const modal = document.getElementById('filters-modal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    hideFilters() {
        const modal = document.getElementById('filters-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    applyFilters() {
        // Collect filter values
        const minPrice = document.getElementById('min-price')?.value || 5;
        const maxPrice = document.getElementById('max-price')?.value || 25;
        const distance = document.querySelector('input[name="distance"]:checked')?.value || 5;
        const rating = document.querySelector('input[name="rating"]:checked')?.value || 'any';

        // Apply filters
        this.filteredVehicles = this.vehicles.filter(vehicle => {
            const priceMatch = vehicle.hourlyRate >= minPrice && vehicle.hourlyRate <= maxPrice;
            const distanceMatch = vehicle.distance <= parseFloat(distance);
            const ratingMatch = rating === 'any' || vehicle.rating >= parseFloat(rating);

            return priceMatch && distanceMatch && ratingMatch;
        });

        this.updateVehicleList();
        this.hideFilters();
        this.showFilterFeedback();
    }

    showFilterFeedback() {
        // Show a brief message about applied filters
        const filterChip = document.querySelector('.filter-chip.active');
        if (filterChip) {
            filterChip.textContent = `Filtered (${this.filteredVehicles.length})`;
            setTimeout(() => {
                filterChip.textContent = filterChip.dataset.filter === 'all' ? 'All' :
                    filterChip.dataset.filter.charAt(0).toUpperCase() + filterChip.dataset.filter.slice(1);
            }, 2000);
        }
    }

    // Interactive Functions
    toggleFavorite(btn) {
        const icon = btn.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.style.background = '#ffebee';
            this.animateFavorite(btn, true);
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.style.background = '';
            this.animateFavorite(btn, false);
        }
    }

    animateFavorite(btn, isAdding) {
        btn.style.transform = 'scale(1.2)';
        btn.style.transition = 'all 0.2s ease';

        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);

        // Show feedback
        if (isAdding) {
            this.showToast('Added to favorites!');
        } else {
            this.showToast('Removed from favorites');
        }
    }

    showToast(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 3000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

    // Utility Functions
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }

        if (hasHalfStar) {
            stars += '☆';
        }

        while (stars.length < 5) {
            stars += '☆';
        }

        return stars;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Loading States
    showLoading(element) {
        if (element) {
            element.classList.add('loading');
        }
    }

    hideLoading(element) {
        if (element) {
            element.classList.remove('loading');
        }
    }

    // Simulate API calls
    async simulateApiCall(delay = 1000) {
        return new Promise(resolve => {
            setTimeout(resolve, delay);
        });
    }
}

// Global functions for onclick handlers
function showSearchResults() {
    app.showScreen('search-results-screen');
}

function showDashboard() {
    app.showScreen('dashboard-screen');
}

function showVehicleDetail(vehicleId) {
    app.showVehicleDetail(vehicleId);
}

function showSearchResults() {
    app.showScreen('search-results-screen');
}

// Note: showBookingSummary is defined later in the file with enhanced functionality

function toggleView() {
    app.toggleView();
}

function showFilters() {
    app.showFilters();
}

function hideFilters() {
    app.hideFilters();
}

function applyFilters() {
    app.applyFilters();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new VehicleSearchApp();

    // Add some demo interactions
    setTimeout(() => {
        console.log('Vehicle Search App initialized!');
        console.log('Try searching, filtering, or switching to map view.');
    }, 1000);
});

// Add some touch interactions for mobile
document.addEventListener('touchstart', function() {}, true);

// Handle back button on mobile browsers
window.addEventListener('popstate', function(event) {
    if (window.app && window.app.currentScreen !== 'dashboard-screen') {
        window.app.showScreen('dashboard-screen');
    }
});

// Add swipe gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0 && window.app) {
            // Swipe right - go back
            switch(window.app.currentScreen) {
                case 'search-results-screen':
                    showDashboard();
                    break;
                case 'vehicle-detail-screen':
                    showSearchResults();
                    break;
                case 'booking-summary-screen':
                    showVehicleDetail(window.app.selectedVehicle?.id);
                    break;
            }
        }
    }
}

// Add keyboard shortcuts for desktop testing
document.addEventListener('keydown', (e) => {
    if (!window.app) return;

    switch(e.key) {
        case 'Escape':
            if (window.app.currentScreen !== 'dashboard-screen') {
                showDashboard();
            }
            hideFilters();
            break;
        case 'm':
            if (window.app.currentScreen === 'search-results-screen') {
                toggleView();
            }
            break;
        case 'f':
            if (window.app.currentScreen === 'search-results-screen') {
                showFilters();
            }
            break;
    }
});

// Analytics tracking (placeholder)
function trackEvent(category, action, label) {
    console.log(`Analytics: ${category} - ${action} - ${label}`);
    // In real app, would send to analytics service
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    // In real app, would send to error reporting service
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`App loaded in ${loadTime.toFixed(2)}ms`);
    trackEvent('Performance', 'Load Time', Math.round(loadTime));
});

// Booking flow functions
function showBookingConfirmation() {
    showToast('Processing payment...', 'info');
    trackEvent('Booking', 'Confirm Payment', 'Started');

    setTimeout(() => {
        hideScreen('booking-summary-screen');
        showScreen('booking-confirmation-screen');

        // Simulate payment processing
        setTimeout(() => {
            showBookingSuccess();
        }, 3000);
    }, 500);
}

function showBookingSuccess() {
    hideScreen('booking-confirmation-screen');
    showScreen('booking-success-screen');
    showToast('Booking confirmed! Check your email for details.', 'success');
    trackEvent('Booking', 'Payment Success', 'Completed');

    // Update app state
    if (window.app) {
        window.app.currentScreen = 'booking-success-screen';
        window.app.hasActiveBooking = true;
    }
}

function viewTripDetails() {
    showToast('Opening trip details...', 'info');
    trackEvent('Booking', 'View Details', 'Clicked');
    // In real app, would navigate to trip management
}

function backToSearch() {
    showDashboard();
    showToast('Ready to book your next ride!', 'info');
    trackEvent('Booking', 'Book Another', 'Clicked');
}

function contactHost() {
    showToast('Opening host contact...', 'info');
    trackEvent('Booking', 'Contact Host', 'Clicked');
    // In real app, would open messaging
}

// Enhanced showBookingSummary function with data population
function showBookingSummary() {
    const selectedVehicle = window.app?.selectedVehicle;
    if (!selectedVehicle) {
        showToast('Please select a vehicle first', 'error');
        return;
    }

    // Update booking summary with selected vehicle data
    updateBookingSummaryData(selectedVehicle);

    hideScreen('vehicle-detail-screen');
    showScreen('booking-summary-screen');

    if (window.app) {
        window.app.currentScreen = 'booking-summary-screen';
    }

    trackEvent('Booking', 'View Summary', selectedVehicle.name);
}

function updateBookingSummaryData(vehicle) {
    // Update vehicle info in booking summary
    const summaryCard = document.querySelector('#booking-summary-screen .vehicle-summary-card');
    if (summaryCard) {
        const vehicleThumb = summaryCard.querySelector('.vehicle-thumb');
        const vehicleName = summaryCard.querySelector('h3');
        const hostName = summaryCard.querySelector('p');

        if (vehicleThumb) {
            vehicleThumb.className = `vehicle-thumb ${vehicle.category}`;
        }
        if (vehicleName) {
            vehicleName.textContent = vehicle.name;
        }
        if (hostName) {
            hostName.textContent = `${vehicle.host.name} • ${vehicle.host.type}`;
        }
    }

    // Update pricing
    updatePricingBreakdown(vehicle);
}

function updatePricingBreakdown(vehicle) {
    const duration = 4; // hours - in real app would calculate from selected times
    const basePrice = vehicle.hourlyRate * duration;
    const serviceFee = basePrice * 0.15;
    const taxes = basePrice * 0.08;
    const total = basePrice + serviceFee + taxes;

    // Update price breakdown in the UI
    const confirmBtn = document.querySelector('.confirm-booking-btn');
    if (confirmBtn) {
        confirmBtn.textContent = `Confirm & Pay $${total.toFixed(2)}`;
    }

    // Update the detailed price breakdown in the booking summary
    updateDetailedPriceBreakdown(basePrice, serviceFee, taxes, total);
}

function updateDetailedPriceBreakdown(basePrice, serviceFee, taxes, total) {
    // Update the price breakdown card if it exists
    const priceBreakdown = document.querySelector('.price-breakdown-card');
    if (priceBreakdown) {
        const rows = priceBreakdown.querySelectorAll('.price-row');
        if (rows.length >= 4) {
            // Safely update each row with null checks
            const valueElements = [
                rows[0]?.querySelector('.value'),
                rows[1]?.querySelector('.value'),
                rows[2]?.querySelector('.value'),
                rows[3]?.querySelector('.value')
            ];

            const prices = [
                `$${basePrice.toFixed(2)}`,
                `$${serviceFee.toFixed(2)}`,
                `$${taxes.toFixed(2)}`,
                `$${total.toFixed(2)}`
            ];

            valueElements.forEach((element, index) => {
                if (element) {
                    element.textContent = prices[index];
                }
            });
        }
    }
}

// Helper functions for screen management in booking flow
function hideScreen(screenId) {
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.remove('active');
    }
}

function showScreen(screenId) {
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }
}

// Handle filter chip clicks
function handleFilterChip(chip) {
    // Remove active class from all chips
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));

    // Add active class to clicked chip
    chip.classList.add('active');

    const filter = chip.dataset.filter;

    // Filter vehicles based on selection
    filterVehicles(filter);

    // Track the filter selection
    trackEvent('Search', 'Filter Applied', filter);
}

// Filter vehicles by category
function filterVehicles(filter) {
    const vehicles = document.querySelectorAll('.vehicle-card');

    vehicles.forEach(vehicle => {
        if (filter === 'all') {
            vehicle.style.display = 'block';
        } else {
            const category = vehicle.dataset.category;
            vehicle.style.display = category === filter ? 'block' : 'none';
        }
    });

    // Update results count
    const visibleVehicles = document.querySelectorAll('.vehicle-card[style*="block"], .vehicle-card:not([style])').length;
    showToast(`Found ${visibleVehicles} vehicles`, 'info');
}

// Global showToast function for use outside the class
function showToast(message, type = 'info') {
    // Remove any existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    // Set color based on type
    let backgroundColor;
    switch(type) {
        case 'success':
            backgroundColor = 'rgba(16, 185, 129, 0.9)';
            break;
        case 'error':
            backgroundColor = 'rgba(239, 68, 68, 0.9)';
            break;
        case 'warning':
            backgroundColor = 'rgba(245, 158, 11, 0.9)';
            break;
        default:
            backgroundColor = 'rgba(59, 130, 246, 0.9)';
    }

    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${backgroundColor};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 3000;
        opacity: 0;
        transition: opacity 0.3s ease;
        max-width: 300px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 2500);
}