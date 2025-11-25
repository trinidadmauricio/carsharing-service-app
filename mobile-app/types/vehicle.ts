/**
 * Vehicle Types
 * Complete vehicle interfaces for search, listing, and detail views
 */

/**
 * Vehicle category/type for filtering
 */
export type VehicleType =
  | 'compact'
  | 'sedan'
  | 'suv'
  | 'luxury'
  | 'sports'
  | 'minivan'
  | 'truck'
  | 'convertible'
  | 'electric';

/**
 * Transmission type
 */
export type TransmissionType = 'automatic' | 'manual';

/**
 * Fuel type
 */
export type FuelType =
  | 'gasoline'
  | 'diesel'
  | 'hybrid'
  | 'electric'
  | 'plugin_hybrid';

/**
 * Vehicle features/amenities
 */
export type VehicleFeature =
  | 'gps'
  | 'bluetooth'
  | 'backup_camera'
  | 'apple_carplay'
  | 'android_auto'
  | 'sunroof'
  | 'heated_seats'
  | 'leather_seats'
  | 'child_seat'
  | 'bike_rack'
  | 'ski_rack'
  | 'toll_pass'
  | 'usb_charger'
  | 'aux_input'
  | 'keyless_entry'
  | 'remote_start';

/**
 * Vehicle availability status
 */
export type VehicleAvailabilityStatus =
  | 'available'
  | 'booked'
  | 'unavailable'
  | 'maintenance';

/**
 * Geographic coordinates
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Vehicle location with address
 */
export interface VehicleLocation {
  coordinates: Coordinates;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  pickupInstructions?: string;
}

/**
 * Vehicle photo with metadata
 */
export interface VehiclePhoto {
  id: string;
  url: string;
  thumbnailUrl?: string;
  type: 'exterior_front' | 'exterior_rear' | 'exterior_side' | 'interior' | 'detail';
  isPrimary: boolean;
  order: number;
}

/**
 * Host information for vehicle card/detail
 */
export interface VehicleHost {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  responseRate: number;
  responseTime: number; // in minutes
  isSuperHost: boolean;
  memberSince: string;
  tripsCompleted: number;
}

/**
 * Vehicle pricing information
 */
export interface VehiclePricing {
  dailyRate: number;
  hourlyRate?: number;
  weeklyDiscount?: number; // percentage
  monthlyDiscount?: number; // percentage
  cleaningFee?: number;
  deliveryFee?: number;
  currency: string;
}

/**
 * Vehicle ratings breakdown
 */
export interface VehicleRatings {
  overall: number;
  cleanliness: number;
  communication: number;
  convenience: number;
  accuracy: number;
  value: number;
}

/**
 * Vehicle review summary
 */
export interface VehicleReview {
  id: string;
  guestId: string;
  guestName: string;
  guestAvatarUrl?: string;
  rating: number;
  comment: string;
  createdAt: string;
  tripDate: string;
}

/**
 * Main Vehicle interface for search results
 */
export interface Vehicle {
  id: string;

  // Basic info
  make: string;
  model: string;
  year: number;
  trim?: string;
  color: string;
  licensePlate?: string; // Only visible to booked guests
  vin?: string; // Only visible to host

  // Classification
  type: VehicleType;
  transmission: TransmissionType;
  fuelType: FuelType;
  seats: number;
  doors: number;

  // Media
  photos: VehiclePhoto[];
  primaryPhotoUrl: string;

  // Location
  location: VehicleLocation;
  distanceFromUser?: number; // in miles, calculated at search time

  // Pricing
  pricing: VehiclePricing;

  // Features
  features: VehicleFeature[];

  // Host
  host: VehicleHost;

  // Ratings
  rating: number;
  reviewCount: number;
  ratings?: VehicleRatings;

  // Booking options
  instantBookEnabled: boolean;
  deliveryAvailable: boolean;

  // Availability
  availabilityStatus: VehicleAvailabilityStatus;
  minTripDuration: number; // in hours
  maxTripDuration: number; // in days
  advanceNotice: number; // hours required before pickup

  // Metadata
  createdAt: string;
  updatedAt: string;
  listingStatus: 'active' | 'inactive' | 'pending_approval' | 'suspended';
}

/**
 * Simplified vehicle for list/card display
 */
export interface VehicleListItem {
  id: string;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  transmission: TransmissionType;
  primaryPhotoUrl: string;
  photos: VehiclePhoto[];
  dailyRate: number;
  currency: string;
  rating: number;
  reviewCount: number;
  distanceFromUser?: number;
  instantBookEnabled: boolean;
  hostRating: number;
  hostIsSuperHost: boolean;
  features: VehicleFeature[];
  location: {
    city: string;
    coordinates: Coordinates;
  };
  isFavorite?: boolean;
}

/**
 * Vehicle detail with full information
 */
export interface VehicleDetail extends Vehicle {
  reviews: VehicleReview[];
  similarVehicles: VehicleListItem[];
  cancellationPolicy: CancellationPolicy;
  rules: VehicleRules;
}

/**
 * Cancellation policy
 */
export interface CancellationPolicy {
  type: 'flexible' | 'moderate' | 'strict';
  description: string;
  refundPercentage: number;
  cutoffHours: number; // hours before trip start
}

/**
 * Vehicle rules set by host
 */
export interface VehicleRules {
  smokingAllowed: boolean;
  petsAllowed: boolean;
  fuelPolicy: 'same_level' | 'full_to_full';
  mileageLimit?: number; // miles per day, undefined = unlimited
  mileageOverageFee?: number; // per mile
  additionalDriversAllowed: boolean;
  additionalDriverFee?: number;
  minimumAge: number;
  crossBorderAllowed: boolean;
}

/**
 * Vehicle availability slot
 */
export interface AvailabilitySlot {
  startDate: string;
  endDate: string;
  status: VehicleAvailabilityStatus;
  pricing?: {
    dailyRate: number;
    totalEstimate: number;
  };
}

/**
 * Feature display info for UI
 */
export const FEATURE_DISPLAY: Record<VehicleFeature, { label: string; icon: string }> = {
  gps: { label: 'GPS Navigation', icon: 'navigation' },
  bluetooth: { label: 'Bluetooth', icon: 'bluetooth' },
  backup_camera: { label: 'Backup Camera', icon: 'video' },
  apple_carplay: { label: 'Apple CarPlay', icon: 'apple' },
  android_auto: { label: 'Android Auto', icon: 'android' },
  sunroof: { label: 'Sunroof', icon: 'sun' },
  heated_seats: { label: 'Heated Seats', icon: 'thermometer' },
  leather_seats: { label: 'Leather Seats', icon: 'armchair' },
  child_seat: { label: 'Child Seat', icon: 'baby' },
  bike_rack: { label: 'Bike Rack', icon: 'bicycle' },
  ski_rack: { label: 'Ski Rack', icon: 'mountain' },
  toll_pass: { label: 'Toll Pass', icon: 'credit-card' },
  usb_charger: { label: 'USB Charger', icon: 'battery-charging' },
  aux_input: { label: 'AUX Input', icon: 'headphones' },
  keyless_entry: { label: 'Keyless Entry', icon: 'key' },
  remote_start: { label: 'Remote Start', icon: 'power' },
};

/**
 * Vehicle type display info for UI
 */
export const VEHICLE_TYPE_DISPLAY: Record<VehicleType, { label: string; icon: string }> = {
  compact: { label: 'Compact', icon: 'car-compact' },
  sedan: { label: 'Sedan', icon: 'car-side' },
  suv: { label: 'SUV', icon: 'car-suv' },
  luxury: { label: 'Luxury', icon: 'car-sports' },
  sports: { label: 'Sports', icon: 'speedometer' },
  minivan: { label: 'Minivan', icon: 'bus' },
  truck: { label: 'Truck', icon: 'truck' },
  convertible: { label: 'Convertible', icon: 'car-convertible' },
  electric: { label: 'Electric', icon: 'bolt' },
};
