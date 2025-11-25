/**
 * Vehicles Mock Service
 * Mock implementation for development and testing
 */

import type {
  AvailabilitySlot,
  SearchCriteria,
  SearchResults,
  VehicleDetail,
  VehicleListItem,
  VehiclePhoto,
  VehicleHost,
  VehicleReview,
} from '@/types';
import type {
  VehicleService,
  VehicleSearchRequest,
  VehicleAvailabilityRequest,
  FavoritesResponse,
} from '../../vehicles';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock hosts
const mockHosts: VehicleHost[] = [
  {
    id: 'host-1',
    firstName: 'Carlos',
    lastName: 'Martínez',
    avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    rating: 4.9,
    reviewCount: 127,
    responseRate: 98,
    responseTime: 15,
    isSuperHost: true,
    memberSince: '2022-03-15',
    tripsCompleted: 245,
  },
  {
    id: 'host-2',
    firstName: 'María',
    lastName: 'González',
    avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    rating: 4.7,
    reviewCount: 89,
    responseRate: 95,
    responseTime: 30,
    isSuperHost: true,
    memberSince: '2022-06-20',
    tripsCompleted: 156,
  },
  {
    id: 'host-3',
    firstName: 'Roberto',
    lastName: 'Hernández',
    avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    rating: 4.5,
    reviewCount: 42,
    responseRate: 90,
    responseTime: 60,
    isSuperHost: false,
    memberSince: '2023-01-10',
    tripsCompleted: 67,
  },
  {
    id: 'host-4',
    firstName: 'Ana',
    lastName: 'López',
    avatarUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
    rating: 4.8,
    reviewCount: 156,
    responseRate: 99,
    responseTime: 10,
    isSuperHost: true,
    memberSince: '2021-11-05',
    tripsCompleted: 312,
  },
];

// Mock photos generator
const generatePhotos = (vehicleId: string, make: string, model: string): VehiclePhoto[] => {
  const baseUrl = 'https://images.unsplash.com/photo-';
  const carPhotos = [
    '1494976388531-d1058494cdd8', // sedan
    '1552519507-da3b142c6e3d', // car front
    '1503376780353-7e6692767b70', // sports car
    '1542282088-fe8426682b8f', // suv
  ];

  return carPhotos.map((photoId, index) => ({
    id: `${vehicleId}-photo-${index}`,
    url: `${baseUrl}${photoId}?w=800&q=80`,
    thumbnailUrl: `${baseUrl}${photoId}?w=200&q=60`,
    type: index === 0 ? 'exterior_front' : index === 1 ? 'exterior_rear' : index === 2 ? 'exterior_side' : 'interior',
    isPrimary: index === 0,
    order: index,
  })) as VehiclePhoto[];
};

// Mock vehicles database - San Salvador area
const mockVehicles: VehicleListItem[] = [
  {
    id: 'v-001',
    make: 'Toyota',
    model: 'Corolla',
    year: 2023,
    type: 'sedan',
    transmission: 'automatic',
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80',
    photos: generatePhotos('v-001', 'Toyota', 'Corolla'),
    dailyRate: 45,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 87,
    distanceFromUser: 0.8,
    instantBookEnabled: true,
    hostRating: 4.9,
    hostIsSuperHost: true,
    features: ['bluetooth', 'backup_camera', 'apple_carplay', 'usb_charger'],
    location: {
      city: 'San Salvador',
      coordinates: { latitude: 13.6929, longitude: -89.2182 },
    },
    isFavorite: false,
  },
  {
    id: 'v-002',
    make: 'Honda',
    model: 'CR-V',
    year: 2022,
    type: 'suv',
    transmission: 'automatic',
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400&q=80',
    photos: generatePhotos('v-002', 'Honda', 'CR-V'),
    dailyRate: 65,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 54,
    distanceFromUser: 1.2,
    instantBookEnabled: true,
    hostRating: 4.7,
    hostIsSuperHost: true,
    features: ['gps', 'bluetooth', 'backup_camera', 'android_auto', 'sunroof'],
    location: {
      city: 'San Salvador',
      coordinates: { latitude: 13.7034, longitude: -89.2245 },
    },
    isFavorite: true,
  },
  {
    id: 'v-003',
    make: 'Mazda',
    model: '3',
    year: 2023,
    type: 'sedan',
    transmission: 'automatic',
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&q=80',
    photos: generatePhotos('v-003', 'Mazda', '3'),
    dailyRate: 50,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 32,
    distanceFromUser: 2.1,
    instantBookEnabled: false,
    hostRating: 4.5,
    hostIsSuperHost: false,
    features: ['bluetooth', 'apple_carplay', 'android_auto', 'heated_seats'],
    location: {
      city: 'Santa Tecla',
      coordinates: { latitude: 13.6769, longitude: -89.2797 },
    },
    isFavorite: false,
  },
  {
    id: 'v-004',
    make: 'BMW',
    model: '320i',
    year: 2022,
    type: 'luxury',
    transmission: 'automatic',
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80',
    photos: generatePhotos('v-004', 'BMW', '320i'),
    dailyRate: 95,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 28,
    distanceFromUser: 3.5,
    instantBookEnabled: true,
    hostRating: 4.8,
    hostIsSuperHost: true,
    features: ['gps', 'bluetooth', 'backup_camera', 'leather_seats', 'sunroof', 'heated_seats'],
    location: {
      city: 'Antiguo Cuscatlán',
      coordinates: { latitude: 13.6711, longitude: -89.2536 },
    },
    isFavorite: false,
  },
  {
    id: 'v-005',
    make: 'Nissan',
    model: 'Kicks',
    year: 2023,
    type: 'suv',
    transmission: 'automatic',
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400&q=80',
    photos: generatePhotos('v-005', 'Nissan', 'Kicks'),
    dailyRate: 55,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 41,
    distanceFromUser: 1.8,
    instantBookEnabled: true,
    hostRating: 4.7,
    hostIsSuperHost: true,
    features: ['bluetooth', 'backup_camera', 'apple_carplay', 'keyless_entry'],
    location: {
      city: 'San Salvador',
      coordinates: { latitude: 13.6889, longitude: -89.1872 },
    },
    isFavorite: false,
  },
  {
    id: 'v-006',
    make: 'Kia',
    model: 'Sportage',
    year: 2022,
    type: 'suv',
    transmission: 'automatic',
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400&q=80',
    photos: generatePhotos('v-006', 'Kia', 'Sportage'),
    dailyRate: 60,
    currency: 'USD',
    rating: 4.5,
    reviewCount: 23,
    distanceFromUser: 4.2,
    instantBookEnabled: false,
    hostRating: 4.5,
    hostIsSuperHost: false,
    features: ['gps', 'bluetooth', 'backup_camera', 'android_auto'],
    location: {
      city: 'Soyapango',
      coordinates: { latitude: 13.7143, longitude: -89.1528 },
    },
    isFavorite: false,
  },
  {
    id: 'v-007',
    make: 'Toyota',
    model: 'RAV4',
    year: 2023,
    type: 'suv',
    transmission: 'automatic',
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400&q=80',
    photos: generatePhotos('v-007', 'Toyota', 'RAV4'),
    dailyRate: 70,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 67,
    distanceFromUser: 2.5,
    instantBookEnabled: true,
    hostRating: 4.9,
    hostIsSuperHost: true,
    features: ['gps', 'bluetooth', 'backup_camera', 'apple_carplay', 'android_auto', 'sunroof'],
    location: {
      city: 'San Salvador',
      coordinates: { latitude: 13.7089, longitude: -89.2312 },
    },
    isFavorite: false,
  },
  {
    id: 'v-008',
    make: 'Hyundai',
    model: 'Elantra',
    year: 2023,
    type: 'sedan',
    transmission: 'automatic',
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80',
    photos: generatePhotos('v-008', 'Hyundai', 'Elantra'),
    dailyRate: 42,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 19,
    distanceFromUser: 1.5,
    instantBookEnabled: true,
    hostRating: 4.6,
    hostIsSuperHost: false,
    features: ['bluetooth', 'backup_camera', 'apple_carplay', 'usb_charger'],
    location: {
      city: 'San Salvador',
      coordinates: { latitude: 13.6958, longitude: -89.1945 },
    },
    isFavorite: false,
  },
  {
    id: 'v-009',
    make: 'Ford',
    model: 'Explorer',
    year: 2022,
    type: 'suv',
    transmission: 'automatic',
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400&q=80',
    photos: generatePhotos('v-009', 'Ford', 'Explorer'),
    dailyRate: 85,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 35,
    distanceFromUser: 5.0,
    instantBookEnabled: true,
    hostRating: 4.8,
    hostIsSuperHost: true,
    features: ['gps', 'bluetooth', 'backup_camera', 'leather_seats', 'child_seat'],
    location: {
      city: 'Santa Tecla',
      coordinates: { latitude: 13.6698, longitude: -89.2891 },
    },
    isFavorite: false,
  },
  {
    id: 'v-010',
    make: 'Volkswagen',
    model: 'Jetta',
    year: 2023,
    type: 'sedan',
    transmission: 'manual',
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80',
    photos: generatePhotos('v-010', 'Volkswagen', 'Jetta'),
    dailyRate: 38,
    currency: 'USD',
    rating: 4.4,
    reviewCount: 15,
    distanceFromUser: 3.8,
    instantBookEnabled: false,
    hostRating: 4.4,
    hostIsSuperHost: false,
    features: ['bluetooth', 'aux_input', 'usb_charger'],
    location: {
      city: 'Mejicanos',
      coordinates: { latitude: 13.7401, longitude: -89.2128 },
    },
    isFavorite: false,
  },
];

// Mock reviews
const mockReviews: VehicleReview[] = [
  {
    id: 'review-1',
    guestId: 'guest-1',
    guestName: 'Miguel R.',
    guestAvatarUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
    rating: 5,
    comment: 'Excelente vehículo, muy limpio y el host fue muy amable. Lo recomiendo totalmente.',
    createdAt: '2024-01-15T10:30:00Z',
    tripDate: '2024-01-10',
  },
  {
    id: 'review-2',
    guestId: 'guest-2',
    guestName: 'Laura M.',
    guestAvatarUrl: 'https://randomuser.me/api/portraits/women/6.jpg',
    rating: 4,
    comment: 'Buen carro, cumplió con lo esperado. El único detalle fue un pequeño retraso en la entrega.',
    createdAt: '2024-01-10T14:20:00Z',
    tripDate: '2024-01-05',
  },
  {
    id: 'review-3',
    guestId: 'guest-3',
    guestName: 'José P.',
    guestAvatarUrl: 'https://randomuser.me/api/portraits/men/7.jpg',
    rating: 5,
    comment: 'Perfecto para el viaje a la playa. Muy cómodo y económico en gasolina.',
    createdAt: '2024-01-05T09:15:00Z',
    tripDate: '2023-12-28',
  },
];

// Favorites storage (in-memory)
const favorites: Set<string> = new Set(['v-002']);
let recentlyViewed: string[] = [];

// Helper functions
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

const filterVehicles = (
  vehicles: VehicleListItem[],
  criteria: SearchCriteria
): VehicleListItem[] => {
  return vehicles.filter((vehicle) => {
    // Distance filter
    const distance = calculateDistance(
      criteria.location.coordinates.latitude,
      criteria.location.coordinates.longitude,
      vehicle.location.coordinates.latitude,
      vehicle.location.coordinates.longitude
    );
    if (distance > criteria.maxDistance) return false;

    // Price filter
    if (criteria.priceRange) {
      if (vehicle.dailyRate < criteria.priceRange.min) return false;
      if (vehicle.dailyRate > criteria.priceRange.max) return false;
    }

    // Vehicle type filter
    if (criteria.vehicleTypes?.length) {
      if (!criteria.vehicleTypes.includes(vehicle.type)) return false;
    }

    // Transmission filter
    if (criteria.transmission?.length) {
      if (!criteria.transmission.includes(vehicle.transmission)) return false;
    }

    // Features filter
    if (criteria.features?.length) {
      const hasAllFeatures = criteria.features.every((f) =>
        vehicle.features.includes(f)
      );
      if (!hasAllFeatures) return false;
    }

    // Instant book filter
    if (criteria.instantBookOnly && !vehicle.instantBookEnabled) return false;

    // Super host filter
    if (criteria.superHostOnly && !vehicle.hostIsSuperHost) return false;

    // Min host rating filter
    if (criteria.minHostRating && vehicle.hostRating < criteria.minHostRating)
      return false;

    return true;
  });
};

const sortVehicles = (
  vehicles: VehicleListItem[],
  sortBy: SearchCriteria['sortBy'],
  userLat: number,
  userLon: number
): VehicleListItem[] => {
  const sorted = [...vehicles];

  switch (sortBy) {
    case 'price_low_to_high':
      return sorted.sort((a, b) => a.dailyRate - b.dailyRate);
    case 'price_high_to_low':
      return sorted.sort((a, b) => b.dailyRate - a.dailyRate);
    case 'distance':
      return sorted.sort((a, b) => {
        const distA = calculateDistance(
          userLat,
          userLon,
          a.location.coordinates.latitude,
          a.location.coordinates.longitude
        );
        const distB = calculateDistance(
          userLat,
          userLon,
          b.location.coordinates.latitude,
          b.location.coordinates.longitude
        );
        return distA - distB;
      });
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => b.year - a.year);
    case 'recommended':
    default:
      // Weighted score: rating * 0.4 + instantBook * 0.3 + superHost * 0.2 + (1/distance) * 0.1
      return sorted.sort((a, b) => {
        const distA = calculateDistance(
          userLat,
          userLon,
          a.location.coordinates.latitude,
          a.location.coordinates.longitude
        );
        const distB = calculateDistance(
          userLat,
          userLon,
          b.location.coordinates.latitude,
          b.location.coordinates.longitude
        );
        const scoreA =
          a.rating * 0.4 +
          (a.instantBookEnabled ? 1 : 0) * 0.3 +
          (a.hostIsSuperHost ? 1 : 0) * 0.2 +
          (1 / (distA + 1)) * 0.1 * 5;
        const scoreB =
          b.rating * 0.4 +
          (b.instantBookEnabled ? 1 : 0) * 0.3 +
          (b.hostIsSuperHost ? 1 : 0) * 0.2 +
          (1 / (distB + 1)) * 0.1 * 5;
        return scoreB - scoreA;
      });
  }
};

export const vehiclesMock: VehicleService = {
  async search(request: VehicleSearchRequest): Promise<SearchResults> {
    await delay(800); // Simulate network delay

    const { criteria, page = 1, pageSize = 10 } = request;

    // Update distances based on search location
    const vehiclesWithDistance = mockVehicles.map((v) => ({
      ...v,
      distanceFromUser: calculateDistance(
        criteria.location.coordinates.latitude,
        criteria.location.coordinates.longitude,
        v.location.coordinates.latitude,
        v.location.coordinates.longitude
      ),
      isFavorite: favorites.has(v.id),
    }));

    // Filter
    const filtered = filterVehicles(vehiclesWithDistance, criteria);

    // Sort
    const sorted = sortVehicles(
      filtered,
      criteria.sortBy,
      criteria.location.coordinates.latitude,
      criteria.location.coordinates.longitude
    );

    // Paginate
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = sorted.slice(startIndex, endIndex);

    const totalPages = Math.ceil(sorted.length / pageSize);

    return {
      vehicles: paginated,
      pagination: {
        page,
        pageSize,
        totalItems: sorted.length,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      appliedFilters: [],
      totalCount: sorted.length,
      searchId: `search-${Date.now()}`,
    };
  },

  async getById(vehicleId: string): Promise<VehicleDetail> {
    await delay(500);

    const vehicle = mockVehicles.find((v) => v.id === vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    const hostIndex = parseInt(vehicleId.split('-')[1]) % mockHosts.length;
    const host = mockHosts[hostIndex];

    const detail: VehicleDetail = {
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: 'Black',
      type: vehicle.type,
      transmission: vehicle.transmission,
      fuelType: 'gasoline',
      seats: vehicle.type === 'suv' ? 5 : 4,
      doors: 4,
      photos: vehicle.photos,
      primaryPhotoUrl: vehicle.primaryPhotoUrl,
      location: {
        coordinates: vehicle.location.coordinates,
        address: '123 Main Street',
        city: vehicle.location.city,
        state: 'San Salvador',
        zipCode: '01101',
        pickupInstructions: 'Meet at the lobby. Call when you arrive.',
      },
      pricing: {
        dailyRate: vehicle.dailyRate,
        hourlyRate: Math.round(vehicle.dailyRate / 6),
        weeklyDiscount: 10,
        monthlyDiscount: 20,
        cleaningFee: 15,
        currency: 'USD',
      },
      features: vehicle.features,
      host,
      rating: vehicle.rating,
      reviewCount: vehicle.reviewCount,
      ratings: {
        overall: vehicle.rating,
        cleanliness: 4.8,
        communication: 4.9,
        convenience: 4.7,
        accuracy: 4.8,
        value: 4.6,
      },
      instantBookEnabled: vehicle.instantBookEnabled,
      deliveryAvailable: false,
      availabilityStatus: 'available',
      minTripDuration: 2,
      maxTripDuration: 30,
      advanceNotice: 4,
      createdAt: '2023-06-15T10:00:00Z',
      updatedAt: '2024-01-20T15:30:00Z',
      listingStatus: 'active',
      reviews: mockReviews,
      similarVehicles: mockVehicles.filter((v) => v.id !== vehicleId).slice(0, 3),
      cancellationPolicy: {
        type: 'moderate',
        description: 'Full refund if cancelled 24 hours before trip start',
        refundPercentage: 100,
        cutoffHours: 24,
      },
      rules: {
        smokingAllowed: false,
        petsAllowed: false,
        fuelPolicy: 'same_level',
        mileageLimit: 200,
        mileageOverageFee: 0.25,
        additionalDriversAllowed: true,
        additionalDriverFee: 10,
        minimumAge: 21,
        crossBorderAllowed: false,
      },
    };

    return detail;
  },

  async getAvailability(request: VehicleAvailabilityRequest): Promise<AvailabilitySlot[]> {
    await delay(300);

    // Generate mock availability for the next 30 days
    const slots: AvailabilitySlot[] = [];
    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);

    let current = new Date(startDate);
    while (current <= endDate) {
      const next = new Date(current);
      next.setDate(next.getDate() + 1);

      slots.push({
        startDate: current.toISOString(),
        endDate: next.toISOString(),
        status: Math.random() > 0.2 ? 'available' : 'booked',
        pricing: {
          dailyRate: 45 + Math.floor(Math.random() * 20),
          totalEstimate: 45,
        },
      });

      current = next;
    }

    return slots;
  },

  async getFavorites(): Promise<FavoritesResponse> {
    await delay(400);

    const favoriteVehicles = mockVehicles.filter((v) => favorites.has(v.id));
    return {
      vehicles: favoriteVehicles.map((v) => ({ ...v, isFavorite: true })),
      total: favoriteVehicles.length,
    };
  },

  async addToFavorites(vehicleId: string): Promise<{ success: boolean }> {
    await delay(200);
    favorites.add(vehicleId);
    return { success: true };
  },

  async removeFromFavorites(vehicleId: string): Promise<{ success: boolean }> {
    await delay(200);
    favorites.delete(vehicleId);
    return { success: true };
  },

  async getRecentlyViewed(): Promise<VehicleListItem[]> {
    await delay(300);

    return recentlyViewed
      .slice(0, 10)
      .map((id) => mockVehicles.find((v) => v.id === id))
      .filter((v): v is VehicleListItem => v !== undefined)
      .map((v) => ({ ...v, isFavorite: favorites.has(v.id) }));
  },

  async trackView(vehicleId: string): Promise<void> {
    await delay(100);

    // Remove if exists and add to front
    recentlyViewed = recentlyViewed.filter((id) => id !== vehicleId);
    recentlyViewed.unshift(vehicleId);

    // Keep only last 20
    recentlyViewed = recentlyViewed.slice(0, 20);
  },

  async getSimilar(vehicleId: string, limit = 4): Promise<VehicleListItem[]> {
    await delay(400);

    const vehicle = mockVehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return [];

    // Find similar by type and price range
    return mockVehicles
      .filter(
        (v) =>
          v.id !== vehicleId &&
          (v.type === vehicle.type ||
            Math.abs(v.dailyRate - vehicle.dailyRate) < 20)
      )
      .slice(0, limit)
      .map((v) => ({ ...v, isFavorite: favorites.has(v.id) }));
  },

  async getPopularInArea(
    latitude: number,
    longitude: number,
    limit = 6
  ): Promise<VehicleListItem[]> {
    await delay(500);

    // Sort by rating and return top vehicles
    return mockVehicles
      .map((v) => ({
        ...v,
        distanceFromUser: calculateDistance(
          latitude,
          longitude,
          v.location.coordinates.latitude,
          v.location.coordinates.longitude
        ),
        isFavorite: favorites.has(v.id),
      }))
      .filter((v) => v.distanceFromUser <= 10)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  },
};
