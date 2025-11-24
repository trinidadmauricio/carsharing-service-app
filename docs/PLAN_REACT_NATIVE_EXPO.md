# Plan de Implementación: Carsharing App con React Native + Expo

## Resumen Ejecutivo

Este plan adapta el roadmap de implementación, la guía de mockups y los flujos UX existentes para una implementación en **React Native con Expo**, siguiendo las convenciones del proyecto establecidas en `CLAUDE.md`.

**Actualizado:** Incluye características core de la industria basadas en análisis de Turo y Getaround (2024-2025).

---

## Sistema de Tracking y Agentes

### Tracking de Progreso

Todo el progreso del proyecto se rastrea en `.tracking/`:

```
.tracking/
├── README.md                    # Guía del sistema de tracking
├── MASTER_PROGRESS.md           # Vista general del progreso
├── sprint-01-foundation/        # Sprint 1: Foundation & Registration
│   ├── plan.md                  # Plan detallado con agentes
│   ├── tasks.md                 # Tareas granulares con checkboxes
│   └── summary.md               # Resumen al completar
├── sprint-02-search/            # Sprint 2: Search & Discovery
├── sprint-03-booking/           # Sprint 3: Booking + Protection Plans
├── sprint-04-host/              # Sprint 4: Host + Smart Pricing
├── sprint-05-trip/              # Sprint 5: Trip Management + Claims
├── sprint-06-polish/            # Sprint 6: Polish + ID Verification
├── sprint-07-keyless/           # Sprint 7: Keyless Access (Post-Launch)
├── sprint-08-teams/             # Sprint 8: Host Teams (Post-Launch)
└── sprint-09-advanced/          # Sprint 9: Advanced Features (Post-Launch)
```

### Agentes Especializados

El desarrollo se realiza con agentes especializados de `.claude/`:

| Agente | Archivo | Responsabilidad Principal |
|--------|---------|---------------------------|
| **frontend-developer** | `.claude/01-core-development/frontend-developer.md` | UI components, Atomic Design, Accessibility, Testing infrastructure |
| **react-specialist** | `.claude/02-language-specialists/react-specialist.md` | React 18+ patterns, Custom hooks, Performance, State management |
| **typescript-pro** | `.claude/02-language-specialists/typescript-pro.md` | Type safety, Interfaces, Service layer, Advanced types |
| **nextjs-developer** | `.claude/02-language-specialists/nextjs-developer.md` | Routing patterns (adaptado a Expo Router), SSR concepts |
| **ux-researcher** | `.claude/08-business-product/ux-researcher.md` | UX validation, Usability testing, Flow verification |

### Asignación de Agentes por Sprint

```
Sprint 1: Foundation
├── frontend-developer (Primary): Project setup, Design system, Atoms
├── react-specialist (Secondary): Registration flow, Auth hooks
├── typescript-pro (Support): Type definitions, Service interfaces
└── ux-researcher (Validation): Flow validation, Usability review

Sprint 2: Search & Discovery
├── react-specialist (Primary): Search hooks, Filters, Performance
├── frontend-developer (Secondary): Map components, Vehicle cards
├── typescript-pro (Support): Search types, Filter interfaces
└── ux-researcher (Validation): Search UX validation

Sprint 3: Booking + Protection
├── react-specialist (Primary): Booking flow, Protection selector
├── typescript-pro (Secondary): Protection types, Risk scoring
├── frontend-developer (Support): UI components
└── ux-researcher (Validation): Booking funnel analysis

Sprint 4: Host + Smart Pricing
├── typescript-pro (Primary): Pricing engine, Algorithm types
├── react-specialist (Secondary): Host dashboard, Pricing UI
├── frontend-developer (Support): Instant book components
└── ux-researcher (Validation): Host onboarding UX

Sprint 5: Trip Management + Claims
├── frontend-developer (Primary): Photo capture, Inspection wizard
├── react-specialist (Secondary): Trip hooks, Claims flow
├── typescript-pro (Support): Photo metadata types
└── ux-researcher (Validation): Trip UX validation

Sprint 6: Polish + ID Verification
├── frontend-developer (Primary): ID capture UI, Liveness
├── react-specialist (Secondary): Verification flow
├── typescript-pro (Support): Verification types
└── ux-researcher (Validation): Final UX audit
```

### Workflow de Desarrollo con Agentes

1. **Inicio de Feature**: Revisar `plan.md` del sprint correspondiente
2. **Durante Desarrollo**: Actualizar `tasks.md` con progreso
3. **Validación**: `ux-researcher` valida flujos
4. **Completion**: Actualizar `summary.md` y `MASTER_PROGRESS.md`

### Convenciones de Estado

```
[ ]  Pendiente
[~]  En progreso
[x]  Completado
[!]  Bloqueado
[-]  Cancelado
```

---

## 1. Adaptación de Stack Tecnológico

### 1.1 De Flutter a React Native + Expo

| Aspecto | Flutter (Original) | React Native + Expo (Adaptado) |
|---------|-------------------|-------------------------------|
| **State Management** | BLoC | TanStack React Query + Context |
| **Navigation** | go_router | Expo Router ~3.4.0 |
| **HTTP Client** | Dio + Retrofit | Fetch + apiClient custom |
| **Local Storage** | Hive | expo-secure-store + AsyncStorage |
| **Maps** | google_maps_flutter | react-native-maps |
| **Biometrics** | local_auth | expo-local-authentication |
| **Animations** | Built-in | react-native-reanimated |
| **Image Handling** | cached_network_image | expo-image |
| **Camera** | camera | expo-camera + expo-image-picker |
| **Location** | geolocator | expo-location |

### 1.2 Estructura del Proyecto (Atomic Design)

```
app/
├── (auth)/                    # Grupo de rutas de autenticación
│   ├── login.tsx
│   ├── register/
│   │   ├── index.tsx          # Step 1: Basic info
│   │   ├── phone-verify.tsx   # Step 2: Phone verification
│   │   ├── license.tsx        # Step 3: Driver's license + ID verification
│   │   ├── payment.tsx        # Step 4: Payment method
│   │   └── success.tsx        # Success screen
│   ├── forgot-password.tsx
│   └── reset-password.tsx
├── (tabs)/                    # Navegación principal con tabs
│   ├── _layout.tsx
│   ├── explore.tsx            # Búsqueda y mapa
│   ├── trips.tsx              # Mis viajes
│   ├── messages.tsx           # Mensajes
│   └── profile.tsx            # Perfil
├── (host)/                    # Flujo de host
│   ├── onboarding/
│   │   ├── index.tsx          # Benefits + earnings calculator
│   │   ├── requirements.tsx   # Checklist
│   │   ├── documents.tsx      # Upload docs
│   │   ├── protection.tsx     # ⭐ NEW: Protection plan selection
│   │   └── tax-info.tsx       # Tax info
│   ├── vehicle/
│   │   ├── info.tsx           # Vehicle info
│   │   ├── documents.tsx      # Registration + Insurance
│   │   ├── photos.tsx         # ⭐ ENHANCED: 15+ guided photos
│   │   ├── pricing.tsx        # ⭐ ENHANCED: Smart pricing
│   │   ├── availability.tsx   # ⭐ NEW: Instant book settings
│   │   ├── location.tsx       # Pickup location
│   │   └── review.tsx         # Final review
│   ├── dashboard.tsx
│   ├── earnings.tsx           # ⭐ NEW: Earnings analytics
│   └── teams.tsx              # ⭐ NEW: Co-hosts (Phase 2)
├── vehicle/
│   ├── [id].tsx               # Detalle de vehículo
│   └── search-results.tsx
├── booking/
│   ├── [id].tsx               # Detalle de reserva
│   ├── confirm.tsx
│   ├── protection.tsx         # ⭐ NEW: Guest protection plan
│   ├── payment.tsx
│   └── success.tsx
├── trip/
│   ├── [id]/
│   │   ├── index.tsx          # Dashboard activo
│   │   ├── inspection.tsx     # ⭐ ENHANCED: 15+ photos inspection
│   │   ├── unlock.tsx         # ⭐ NEW: Keyless unlock (Phase 2)
│   │   ├── return.tsx         # Return process
│   │   └── review.tsx         # Rate & review
├── claims/                    # ⭐ NEW: Claims management
│   ├── [id].tsx               # Claim detail
│   ├── new.tsx                # File new claim
│   └── index.tsx              # Claims list
└── _layout.tsx

components/
├── atoms/
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   ├── Badge/
│   ├── Avatar/
│   ├── Icon/
│   ├── ProgressBar/           # ⭐ NEW
│   └── Chip/                  # ⭐ NEW
├── molecules/
│   ├── VehicleCard/
│   ├── SearchBar/
│   ├── PriceBreakdown/
│   ├── RatingDisplay/
│   ├── PinInput/
│   ├── PhotoGallery/
│   ├── FiltersSheet/
│   ├── TripPhotoCapture/      # ⭐ NEW: Guided photo capture
│   ├── ProtectionPlanCard/    # ⭐ NEW: Insurance plan selector
│   ├── SmartPricingWidget/    # ⭐ NEW: Dynamic pricing display
│   ├── RiskScoreBadge/        # ⭐ NEW: Guest risk indicator
│   ├── IDVerificationFlow/    # ⭐ NEW: Face match + liveness
│   ├── EarningsChart/         # ⭐ NEW: Host earnings visualization
│   └── ClaimStatusCard/       # ⭐ NEW: Claim tracking
└── organisms/
    ├── VehicleList/
    ├── BookingForm/
    ├── RegistrationForm/
    ├── MapWithVehicles/
    ├── TripTimeline/
    ├── InspectionWizard/      # ⭐ NEW: Full inspection flow
    ├── ProtectionSelector/    # ⭐ NEW: Plan comparison
    └── PricingOptimizer/      # ⭐ NEW: Smart pricing tool

services/
├── modes/
│   ├── mock/
│   │   ├── auth.mock.ts
│   │   ├── vehicles.mock.ts
│   │   ├── bookings.mock.ts
│   │   ├── users.mock.ts
│   │   ├── protection.mock.ts  # ⭐ NEW
│   │   ├── pricing.mock.ts     # ⭐ NEW
│   │   ├── claims.mock.ts      # ⭐ NEW
│   │   └── verification.mock.ts # ⭐ NEW
│   └── rest/
│       ├── auth.rest.ts
│       ├── vehicles.rest.ts
│       ├── bookings.rest.ts
│       ├── users.rest.ts
│       ├── protection.rest.ts  # ⭐ NEW
│       ├── pricing.rest.ts     # ⭐ NEW
│       ├── claims.rest.ts      # ⭐ NEW
│       └── verification.rest.ts # ⭐ NEW
├── auth.ts
├── vehicles.ts
├── bookings.ts
├── users.ts
├── protection.ts              # ⭐ NEW
├── pricing.ts                 # ⭐ NEW
├── claims.ts                  # ⭐ NEW
├── verification.ts            # ⭐ NEW
└── index.ts

hooks/
├── useAuth.ts
├── useVehicleSearch.ts
├── useBooking.ts
├── useLocation.ts
├── useSecureStorage.ts
├── useTripPhotos.ts           # ⭐ NEW
├── useProtectionPlans.ts      # ⭐ NEW
├── useSmartPricing.ts         # ⭐ NEW
├── useRiskScore.ts            # ⭐ NEW
├── useClaims.ts               # ⭐ NEW
└── useIDVerification.ts       # ⭐ NEW

utils/
├── pricing.ts
├── validation.ts
├── formatting.ts
├── riskScoring.ts             # ⭐ NEW
├── photoValidation.ts         # ⭐ NEW
└── damageDetection.ts         # ⭐ NEW (future ML integration)

theme/
├── tokens.ts
├── colors.ts
├── typography.ts
├── spacing.ts
└── darkMode.ts
```

---

## 2. Features Core de la Industria (Turo/Getaround Standard)

### 2.1 Matriz de Features por Prioridad

| Feature | Prioridad | Sprint | Complejidad | Impacto |
|---------|-----------|--------|-------------|---------|
| **Trip Photos System (15+)** | 🔴 Crítico | 5 | Media | Alto |
| **Protection Plans (Tiered)** | 🔴 Crítico | 3-4 | Alta | Alto |
| **Smart/Dynamic Pricing** | 🔴 Crítico | 4 | Alta | Alto |
| **Instant Book Default** | 🔴 Crítico | 4 | Baja | Alto |
| **Digital ID Verification** | 🟡 Importante | 6 | Alta | Medio |
| **Risk Scoring** | 🟡 Importante | 3, 6 | Media | Medio |
| **Claims In-App** | 🟡 Importante | 5 | Media | Medio |
| **Host Teams/Co-hosts** | 🟢 Nice to Have | 8 | Media | Bajo |
| **Keyless Access** | 🟢 Nice to Have | 7-8 | Muy Alta | Alto |
| **Collections/Curated** | 🟢 Nice to Have | 9 | Baja | Bajo |
| **Pay Later** | 🟢 Nice to Have | 9 | Media | Medio |

### 2.2 Trip Photos System (Estándar Turo)

```typescript
// constants/tripPhotos.ts
export const REQUIRED_EXTERIOR_PHOTOS = [
  { id: 'front_center', label: 'Front (Center)', angle: 'front', required: true },
  { id: 'front_left', label: 'Front Left Corner', angle: 'front-left', required: true },
  { id: 'front_right', label: 'Front Right Corner', angle: 'front-right', required: true },
  { id: 'left_front', label: 'Left Side (Front)', angle: 'side-left-front', required: true },
  { id: 'left_rear', label: 'Left Side (Rear)', angle: 'side-left-rear', required: true },
  { id: 'right_front', label: 'Right Side (Front)', angle: 'side-right-front', required: true },
  { id: 'right_rear', label: 'Right Side (Rear)', angle: 'side-right-rear', required: true },
  { id: 'rear_center', label: 'Rear (Center)', angle: 'rear', required: true },
  { id: 'rear_left', label: 'Rear Left Corner', angle: 'rear-left', required: true },
  { id: 'rear_right', label: 'Rear Right Corner', angle: 'rear-right', required: true },
  { id: 'roof', label: 'Roof (if visible damage)', angle: 'top', required: false },
  { id: 'wheels_left', label: 'Wheels (Left Side)', angle: 'wheels', required: true },
  { id: 'wheels_right', label: 'Wheels (Right Side)', angle: 'wheels', required: true },
  { id: 'windshield', label: 'Windshield (Close-up)', angle: 'windshield', required: true },
  { id: 'damage_detail', label: 'Existing Damage (Close-up)', angle: 'detail', required: false },
];

export const REQUIRED_INTERIOR_PHOTOS = [
  { id: 'dashboard', label: 'Dashboard', required: true },
  { id: 'odometer', label: 'Odometer Reading', required: true },
  { id: 'fuel_gauge', label: 'Fuel/Charge Level', required: true },
  { id: 'front_seats', label: 'Front Seats', required: true },
  { id: 'rear_seats', label: 'Rear Seats', required: true },
  { id: 'trunk', label: 'Trunk/Cargo Area', required: true },
  { id: 'center_console', label: 'Center Console', required: true },
  { id: 'interior_damage', label: 'Interior Damage (if any)', required: false },
];

export const PHOTO_REQUIREMENTS = {
  minPhotos: 15,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  requiredMetadata: ['timestamp', 'geolocation', 'deviceId'],
  claimWindowHours: 24,
};
```

### 2.3 Protection Plans System

```typescript
// types/protection.ts
export interface ProtectionPlan {
  id: string;
  name: string;
  type: 'host' | 'guest';
  tier: 'basic' | 'standard' | 'premium' | 'premier' | 'elite';
  earningsPercentage?: number; // Solo para hosts
  deductible: number;
  liabilityCoverage: number;
  features: string[];
  price?: number; // Solo para guests (daily rate)
}

// Host Protection Plans (Estilo Turo)
export const HOST_PROTECTION_PLANS: ProtectionPlan[] = [
  {
    id: 'host_basic',
    name: 'Basic',
    type: 'host',
    tier: 'basic',
    earningsPercentage: 85,
    deductible: 2500,
    liabilityCoverage: 750000,
    features: [
      'Third-party liability ($750K)',
      'Physical damage reimbursement',
      '$2,500 deductible',
    ],
  },
  {
    id: 'host_standard',
    name: 'Standard',
    type: 'host',
    tier: 'standard',
    earningsPercentage: 75,
    deductible: 1000,
    liabilityCoverage: 750000,
    features: [
      'Third-party liability ($750K)',
      'Physical damage reimbursement',
      '$1,000 deductible',
      '24/7 roadside assistance',
    ],
  },
  {
    id: 'host_premium',
    name: 'Premium',
    type: 'host',
    tier: 'premium',
    earningsPercentage: 70,
    deductible: 500,
    liabilityCoverage: 750000,
    features: [
      'Third-party liability ($750K)',
      'Physical damage reimbursement',
      '$500 deductible',
      '24/7 roadside assistance',
      'Expedited claims processing',
    ],
  },
  {
    id: 'host_premier',
    name: 'Premier',
    type: 'host',
    tier: 'premier',
    earningsPercentage: 65,
    deductible: 250,
    liabilityCoverage: 750000,
    features: [
      'Third-party liability ($750K)',
      'Physical damage reimbursement',
      '$250 deductible',
      '24/7 roadside assistance',
      'Expedited claims processing',
      'Lost income coverage',
    ],
  },
  {
    id: 'host_elite',
    name: 'Elite',
    type: 'host',
    tier: 'elite',
    earningsPercentage: 60,
    deductible: 0,
    liabilityCoverage: 750000,
    features: [
      'Third-party liability ($750K)',
      'Physical damage reimbursement',
      '$0 deductible',
      '24/7 roadside assistance',
      'Expedited claims processing',
      'Lost income coverage',
      'Wear & tear coverage',
    ],
  },
];

// Guest Protection Plans
export const GUEST_PROTECTION_PLANS: ProtectionPlan[] = [
  {
    id: 'guest_minimum',
    name: 'Minimum',
    type: 'guest',
    tier: 'basic',
    deductible: 3000,
    liabilityCoverage: 50000, // State minimum
    price: 0, // Included
    features: [
      'State minimum liability',
      '$3,000 damage responsibility',
    ],
  },
  {
    id: 'guest_standard',
    name: 'Standard',
    type: 'guest',
    tier: 'standard',
    deductible: 500,
    liabilityCoverage: 750000,
    price: 15, // Per day
    features: [
      'Liability coverage ($750K)',
      '$500 deductible',
      'Roadside assistance',
    ],
  },
  {
    id: 'guest_premier',
    name: 'Premier',
    type: 'guest',
    tier: 'premier',
    deductible: 0,
    liabilityCoverage: 750000,
    price: 30, // Per day
    features: [
      'Liability coverage ($750K)',
      '$0 deductible',
      'Roadside assistance',
      'Personal effects coverage',
      'Trip interruption coverage',
    ],
  },
];
```

### 2.4 Smart/Dynamic Pricing Engine

```typescript
// services/pricing.ts
export interface PricingFactors {
  basePrice: number;
  vehicleType: string;
  vehicleAge: number;
  location: { lat: number; lng: number };
  date: Date;
  dayOfWeek: number;
  isHoliday: boolean;
  isWeekend: boolean;
  localEvents: string[];
  competitorPrices: number[];
  historicalDemand: number; // 0-1
  vehicleRating: number;
  hostResponseRate: number;
  instantBookEnabled: boolean;
}

export interface SmartPriceResult {
  suggestedPrice: number;
  minRecommended: number;
  maxRecommended: number;
  confidence: number; // 0-1
  factors: {
    demandMultiplier: number;
    seasonalMultiplier: number;
    competitionAdjustment: number;
    qualityBonus: number;
  };
  projectedBookingProbability: number;
  projectedMonthlyEarnings: number;
}

// hooks/useSmartPricing.ts
export const useSmartPricing = (vehicleId: string) => {
  const [manualPrice, setManualPrice] = useState<number | null>(null);
  const [useSmartPricing, setUseSmartPricing] = useState(true);

  const { data: smartPrice, isLoading } = useQuery({
    queryKey: ['smartPrice', vehicleId],
    queryFn: () => svc.pricing.calculateSmartPrice(vehicleId),
    staleTime: 24 * 60 * 60 * 1000, // Recalculate daily
    enabled: useSmartPricing,
  });

  const effectivePrice = manualPrice ?? smartPrice?.suggestedPrice;

  return {
    smartPrice,
    effectivePrice,
    manualPrice,
    setManualPrice,
    useSmartPricing,
    setUseSmartPricing,
    isLoading,
  };
};

// Pricing algorithm (simplified - real implementation would be ML-based)
export const calculateSmartPrice = (factors: PricingFactors): SmartPriceResult => {
  let price = factors.basePrice;

  // Demand multiplier (day of week + seasonality)
  const demandMultiplier = factors.isWeekend ? 1.15 : 1.0;
  const seasonalMultiplier = factors.isHoliday ? 1.3 : 1.0;

  // Competition adjustment
  const avgCompetitorPrice = factors.competitorPrices.length > 0
    ? factors.competitorPrices.reduce((a, b) => a + b, 0) / factors.competitorPrices.length
    : factors.basePrice;
  const competitionAdjustment = avgCompetitorPrice / factors.basePrice;

  // Quality bonus
  const qualityBonus = 1 + (factors.vehicleRating - 4) * 0.05; // +5% per star above 4

  // Instant book discount/premium
  const instantBookBonus = factors.instantBookEnabled ? 1.05 : 1.0;

  price = price * demandMultiplier * seasonalMultiplier * competitionAdjustment * qualityBonus * instantBookBonus;

  return {
    suggestedPrice: Math.round(price),
    minRecommended: Math.round(price * 0.8),
    maxRecommended: Math.round(price * 1.2),
    confidence: 0.85,
    factors: {
      demandMultiplier,
      seasonalMultiplier,
      competitionAdjustment,
      qualityBonus,
    },
    projectedBookingProbability: 0.65,
    projectedMonthlyEarnings: Math.round(price * 20), // Estimate 20 booking days
  };
};
```

### 2.5 Risk Scoring System

```typescript
// types/riskScore.ts
export interface RiskScore {
  score: number; // 0-100 (higher = lower risk)
  level: 'low' | 'medium' | 'high' | 'very_high';
  factors: RiskFactor[];
  canInstantBook: boolean;
  requiresManualApproval: boolean;
  restrictions: string[];
}

export interface RiskFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

// utils/riskScoring.ts
export const calculateGuestRiskScore = (guest: GuestProfile): RiskScore => {
  let score = 50; // Base score
  const factors: RiskFactor[] = [];

  // Identity verification (+20)
  if (guest.idVerified && guest.faceMatchVerified) {
    score += 20;
    factors.push({
      name: 'Identity Verified',
      impact: 'positive',
      weight: 20,
      description: 'ID and face match verified',
    });
  }

  // Booking history (+15 max)
  const completedTrips = guest.tripHistory.filter(t => t.status === 'completed').length;
  const historyBonus = Math.min(completedTrips * 3, 15);
  score += historyBonus;
  if (completedTrips > 0) {
    factors.push({
      name: 'Trip History',
      impact: 'positive',
      weight: historyBonus,
      description: `${completedTrips} completed trips`,
    });
  }

  // Rating history (+10 max)
  if (guest.averageRating >= 4.5) {
    score += 10;
    factors.push({
      name: 'Excellent Rating',
      impact: 'positive',
      weight: 10,
      description: `${guest.averageRating} average rating`,
    });
  } else if (guest.averageRating >= 4.0) {
    score += 5;
  }

  // Claims history (-20 max)
  const claimCount = guest.claims.filter(c => c.atFault).length;
  if (claimCount > 0) {
    const claimPenalty = Math.min(claimCount * 10, 20);
    score -= claimPenalty;
    factors.push({
      name: 'Claim History',
      impact: 'negative',
      weight: -claimPenalty,
      description: `${claimCount} at-fault claims`,
    });
  }

  // Account age (+5)
  const accountAgeMonths = differenceInMonths(new Date(), guest.createdAt);
  if (accountAgeMonths >= 6) {
    score += 5;
    factors.push({
      name: 'Established Account',
      impact: 'positive',
      weight: 5,
      description: 'Account older than 6 months',
    });
  }

  // Driver age consideration
  const driverAge = differenceInYears(new Date(), guest.dateOfBirth);
  if (driverAge < 25) {
    score -= 10;
    factors.push({
      name: 'Young Driver',
      impact: 'negative',
      weight: -10,
      description: 'Driver under 25 years old',
    });
  }

  // Determine level and restrictions
  const level = score >= 80 ? 'low' : score >= 60 ? 'medium' : score >= 40 ? 'high' : 'very_high';
  const restrictions: string[] = [];

  if (level === 'very_high') {
    restrictions.push('Manual approval required');
    restrictions.push('Premium vehicles restricted');
  } else if (level === 'high') {
    restrictions.push('Luxury vehicles restricted');
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    level,
    factors,
    canInstantBook: level === 'low' || level === 'medium',
    requiresManualApproval: level === 'very_high',
    restrictions,
  };
};
```

### 2.6 Digital ID Verification with Liveness

```typescript
// services/verification.ts
export interface IDVerificationRequest {
  idFrontImage: string; // Base64
  idBackImage?: string; // Base64
  selfieImage: string; // Base64
  livenessVideo?: string; // Base64 (for advanced verification)
}

export interface IDVerificationResult {
  verified: boolean;
  confidence: number;
  idData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    expirationDate: string;
    licenseNumber: string;
    state: string;
  };
  checks: {
    idAuthenticity: 'pass' | 'fail' | 'review';
    faceMatch: 'pass' | 'fail' | 'review';
    livenessDetection: 'pass' | 'fail' | 'review';
    ageVerification: 'pass' | 'fail';
    expirationCheck: 'pass' | 'fail';
  };
  failureReasons?: string[];
}

// components/molecules/IDVerificationFlow/IDVerificationFlow.tsx
export const IDVerificationFlow = ({ onComplete }: Props) => {
  const [step, setStep] = useState<'id_front' | 'id_back' | 'selfie' | 'liveness' | 'processing'>('id_front');
  const [images, setImages] = useState<Partial<IDVerificationRequest>>({});

  const captureIdFront = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setImages(prev => ({ ...prev, idFrontImage: result.assets[0].base64 }));
      setStep('id_back');
    }
  };

  const captureSelfie = async () => {
    // Use front camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
      cameraType: CameraType.front,
    });

    if (!result.canceled) {
      setImages(prev => ({ ...prev, selfieImage: result.assets[0].base64 }));
      setStep('liveness');
    }
  };

  const performLivenessCheck = async () => {
    // Instructions: "Turn your head slowly left, then right"
    // Capture short video or multiple frames
    setStep('processing');

    try {
      const result = await svc.verification.verifyID(images as IDVerificationRequest);
      onComplete(result);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <View style={styles.container}>
      {step === 'id_front' && (
        <IDCaptureStep
          title="Scan your Driver's License"
          subtitle="Position the front of your license within the frame"
          overlayType="license_front"
          onCapture={captureIdFront}
        />
      )}
      {step === 'selfie' && (
        <SelfieCaptureStep
          title="Take a Selfie"
          subtitle="Position your face within the oval"
          onCapture={captureSelfie}
        />
      )}
      {step === 'liveness' && (
        <LivenessCheckStep
          title="Verify it's you"
          instructions={['Look straight ahead', 'Slowly turn left', 'Slowly turn right']}
          onComplete={performLivenessCheck}
        />
      )}
      {step === 'processing' && (
        <ProcessingStep title="Verifying your identity..." />
      )}
    </View>
  );
};
```

---

## 3. Sprints de Implementación Actualizados

### Sprint 1: Foundation & Core Registration (Días 1-6)

#### Día 1-2: Setup del Proyecto

**Tareas de Desarrollo:**
```bash
# Inicialización
npx create-expo-app@latest carsharing-app -t tabs
cd carsharing-app

# Dependencias core
npx expo install expo-router expo-secure-store expo-local-authentication
npx expo install expo-camera expo-image-picker expo-location expo-image
npm install @tanstack/react-query zustand
npm install react-native-reanimated react-native-gesture-handler
npm install react-native-maps

# UI & Forms
npm install react-hook-form zod @hookform/resolvers
npm install nativewind tailwindcss
npm install @gorhom/bottom-sheet

# Testing
npm install -D jest @testing-library/react-native
```

**Archivos a Crear:**
- [ ] `app.config.ts` - Configuración de Expo con variables de entorno
- [ ] `theme/tokens.ts` - Design tokens (colores, tipografía, spacing)
- [ ] `services/index.ts` - Service layer con mock/rest switch
- [ ] `services/apiClient.ts` - Cliente HTTP con refresh token
- [ ] `hooks/useSecureStorage.ts` - Wrapper para expo-secure-store
- [ ] `types/protection.ts` - ⭐ NEW: Tipos para protection plans
- [ ] `types/riskScore.ts` - ⭐ NEW: Tipos para risk scoring

**Design System Base:**
```typescript
// theme/tokens.ts
export const colors = {
  primary: {
    main: '#667eea',
    gradient: ['#667eea', '#764ba2'],
  },
  secondary: {
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
  },
  neutral: {
    white: '#ffffff',
    gray50: '#f8f9fa',
    gray100: '#e9ecef',
    gray500: '#6c757d',
    gray900: '#1a1a1a',
  },
  // ⭐ NEW: Risk score colors
  risk: {
    low: '#28a745',
    medium: '#ffc107',
    high: '#fd7e14',
    veryHigh: '#dc3545',
  },
  // ⭐ NEW: Protection plan colors
  protection: {
    basic: '#6c757d',
    standard: '#17a2b8',
    premium: '#667eea',
    premier: '#764ba2',
    elite: '#ffd700',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 38 },
  h2: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
};
```

#### Día 3-4: Registration Flow

**Pantallas a Implementar:**

1. **Welcome Screen** (`app/(auth)/index.tsx`)
   - Full-screen con hero image
   - Gradient background (#667eea → #764ba2)
   - CTAs: "Get Started", "Sign In"
   - Lottie animation para hero

2. **Account Type Selection** (`app/(auth)/register/type.tsx`)
   - Dos cards grandes (Guest/Host)
   - Animación de selección con Reanimated
   - Navegación condicional

3. **Basic Information** (`app/(auth)/register/index.tsx`)
   - Form con react-hook-form + zod
   - Campos: firstName, lastName, email, phone, password
   - Progress indicator (step 1/4)
   - Validación en tiempo real

4. **Phone Verification** (`app/(auth)/register/phone-verify.tsx`)
   - PinInput de 6 dígitos
   - Auto-submit cuando completo
   - Timer para reenvío (60s)
   - Animación shake en error

#### Día 5-6: Authentication & Testing

**Login Screen** (`app/(auth)/login.tsx`)
- Email/password form
- Biometric toggle (expo-local-authentication)
- Social login buttons (Google, Apple)
- "Forgot password?" link

**Tests Sprint 1:**
```typescript
// __tests__/screens/Register.test.tsx
describe('Registration Flow', () => {
  it('validates email format', async () => {});
  it('validates password strength', async () => {});
  it('navigates to phone verification on valid form', async () => {});
  it('shows error on invalid credentials', async () => {});
});
```

---

### Sprint 2: Search & Discovery Core (Días 7-12)

#### Día 1-2: Search Infrastructure

**Map Integration:**
```typescript
// components/organisms/MapWithVehicles/MapWithVehicles.tsx
import MapView, { Marker } from 'react-native-maps';
import { useVehicleSearch } from '@/hooks/useVehicleSearch';

export const MapWithVehicles = () => {
  const { vehicles, isLoading } = useVehicleSearch();

  return (
    <MapView
      style={styles.map}
      initialRegion={defaultRegion}
      showsUserLocation
    >
      {vehicles.map(vehicle => (
        <VehicleMarker
          key={vehicle.id}
          vehicle={vehicle}
          showInstantBookBadge={vehicle.instantBookEnabled} // ⭐ NEW
        />
      ))}
    </MapView>
  );
};
```

#### Día 3-4: Results & Filtering

**Vehicle Card Component (Enhanced):**
```typescript
// components/molecules/VehicleCard/VehicleCard.tsx
interface VehicleCardProps {
  vehicle: Vehicle;
  onPress: () => void;
  onFavorite: () => void;
}

// Especificaciones visuales:
// - Image: 16:9 ratio, border-radius 12
// - Heart icon: absolute top-right
// - Price badge: absolute bottom-right sobre imagen
// - ⭐ NEW: Instant Book badge (lightning icon)
// - ⭐ NEW: Smart Price indicator (trending up/down)
// - Info section: padding 16, fondo blanco
```

**Filters Bottom Sheet (Enhanced):**
```typescript
// Filtros:
// - Price range (slider)
// - Vehicle type (chips)
// - Transmission
// - Features (multi-select)
// - ⭐ Instant Book only toggle (prominent)
// - Host rating minimum
// - ⭐ NEW: Protection included filter
```

#### Día 5-6: Vehicle Details & Polish

**Vehicle Detail Screen** (`app/vehicle/[id].tsx`)
```typescript
// Secciones:
// 1. Photo Gallery (swipeable, full-width)
// 2. Vehicle Info (make, model, year, features)
// 3. ⭐ NEW: Instant Book badge (if enabled)
// 4. Host Info (avatar, rating, response time)
// 5. Location Map Preview
// 6. ⭐ NEW: Protection plans preview
// 7. Reviews Preview
// 8. Sticky Bottom CTA ("Book Now" + price)
```

---

### Sprint 3: Booking Flow + Protection Plans (Días 13-18)

#### Día 1-2: Booking Logic + Risk Scoring

**Booking Confirmation Screen** (`app/booking/confirm.tsx`)
- Vehicle summary card
- Trip details (editable dates)
- ⭐ NEW: Guest risk check (background)
- Pricing breakdown
- Special requests text area

**Risk Check Integration:**
```typescript
// hooks/useBookingEligibility.ts
export const useBookingEligibility = (guestId: string, vehicleId: string) => {
  const { data: riskScore } = useQuery({
    queryKey: ['riskScore', guestId],
    queryFn: () => svc.verification.calculateRiskScore(guestId),
  });

  const { data: vehicle } = useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: () => svc.vehicles.getById(vehicleId),
  });

  const canInstantBook = useMemo(() => {
    if (!riskScore || !vehicle) return false;
    return vehicle.instantBookEnabled && riskScore.canInstantBook;
  }, [riskScore, vehicle]);

  const requiresApproval = riskScore?.requiresManualApproval || !canInstantBook;

  return {
    riskScore,
    canInstantBook,
    requiresApproval,
    restrictions: riskScore?.restrictions || [],
  };
};
```

#### Día 3-4: Protection Plan Selection (Guest)

**⭐ NEW: Protection Selection Screen** (`app/booking/protection.tsx`)
```typescript
// components/organisms/ProtectionSelector/ProtectionSelector.tsx
export const ProtectionSelector = ({ onSelect }: Props) => {
  const [selectedPlan, setSelectedPlan] = useState<ProtectionPlan | null>(null);
  const { data: plans } = useProtectionPlans('guest');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose your protection</Text>
      <Text style={styles.subtitle}>
        All plans include 24/7 roadside assistance
      </Text>

      <View style={styles.plansContainer}>
        {plans?.map(plan => (
          <ProtectionPlanCard
            key={plan.id}
            plan={plan}
            selected={selectedPlan?.id === plan.id}
            onSelect={() => setSelectedPlan(plan)}
            recommended={plan.tier === 'standard'}
          />
        ))}
      </View>

      <View style={styles.comparison}>
        <TouchableOpacity onPress={() => showComparisonModal()}>
          <Text style={styles.compareLink}>Compare all plans</Text>
        </TouchableOpacity>
      </View>

      <Button
        variant="primary"
        onPress={() => onSelect(selectedPlan)}
        disabled={!selectedPlan}
      >
        Continue with {selectedPlan?.name || 'selected plan'}
      </Button>
    </View>
  );
};
```

#### Día 5-6: Payment Integration + Booking Completion

**Payment Flow (sin cambios, pero incluye protection):**
```typescript
// Pricing breakdown ahora incluye:
// - Base rate × duration
// - Service fees
// - ⭐ Protection plan fee
// - Taxes
// - Total
```

**Booking Success Screen** (`app/booking/success.tsx`)
- Animación de confetti/checkmark
- Booking reference number
- ⭐ NEW: Protection plan summary
- Timeline de próximos pasos
- CTAs: "View Booking", "Contact Host", "Add to Calendar"

---

### Sprint 4: Host Onboarding + Smart Pricing + Instant Book (Días 19-24)

#### Día 1-2: Host Registration + Protection Selection

**⭐ NEW: Host Protection Selection** (`app/(host)/onboarding/protection.tsx`)
```typescript
// Similar al guest pero con planes de host
// Muestra earnings percentage para cada plan
// Incluye calculadora de earnings proyectados
```

**Enhanced KYC Flow:**
```
app/(host)/onboarding/
├── index.tsx          # Benefits overview + earnings calculator
├── requirements.tsx   # Checklist de requisitos
├── documents.tsx      # Upload de documentos
├── protection.tsx     # ⭐ NEW: Protection plan selection
├── background.tsx     # Consent para background check
└── tax-info.tsx       # Información fiscal + payout setup
```

#### Día 3-4: Vehicle Listing + Smart Pricing

**⭐ NEW: Smart Pricing Screen** (`app/(host)/vehicle/pricing.tsx`)
```typescript
export const VehiclePricingScreen = () => {
  const { vehicleId } = useLocalSearchParams();
  const {
    smartPrice,
    effectivePrice,
    manualPrice,
    setManualPrice,
    useSmartPricing,
    setUseSmartPricing,
  } = useSmartPricing(vehicleId);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Set your pricing</Text>
        <Text style={styles.subtitle}>
          Smart pricing automatically adjusts your price based on demand
        </Text>
      </View>

      {/* Smart Pricing Toggle */}
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Use Smart Pricing</Text>
        <Switch
          value={useSmartPricing}
          onValueChange={setUseSmartPricing}
        />
      </View>

      {useSmartPricing && smartPrice && (
        <SmartPricingWidget
          suggestedPrice={smartPrice.suggestedPrice}
          confidence={smartPrice.confidence}
          factors={smartPrice.factors}
          projectedEarnings={smartPrice.projectedMonthlyEarnings}
        />
      )}

      {!useSmartPricing && (
        <View style={styles.manualPricing}>
          <Text style={styles.label}>Daily rate</Text>
          <CurrencyInput
            value={manualPrice}
            onChangeValue={setManualPrice}
            prefix="$"
          />
          {smartPrice && manualPrice && (
            <Text style={styles.comparison}>
              {manualPrice > smartPrice.suggestedPrice
                ? `$${manualPrice - smartPrice.suggestedPrice} above suggested`
                : `$${smartPrice.suggestedPrice - manualPrice} below suggested`}
            </Text>
          )}
        </View>
      )}

      {/* Weekly/Monthly discounts */}
      <View style={styles.discounts}>
        <Text style={styles.sectionTitle}>Discounts</Text>
        <DiscountInput
          label="Weekly discount"
          value={weeklyDiscount}
          onChange={setWeeklyDiscount}
          suggestedValue={10}
        />
        <DiscountInput
          label="Monthly discount"
          value={monthlyDiscount}
          onChange={setMonthlyDiscount}
          suggestedValue={15}
        />
      </View>
    </ScrollView>
  );
};
```

#### Día 5-6: Instant Book + Availability Settings

**⭐ NEW: Instant Book Settings** (`app/(host)/vehicle/availability.tsx`)
```typescript
export const VehicleAvailabilityScreen = () => {
  const [instantBookEnabled, setInstantBookEnabled] = useState(true);
  const [guestRequirements, setGuestRequirements] = useState({
    minRating: 4.0,
    minTrips: 0,
    verifiedIdRequired: true,
    minAge: 21,
  });

  return (
    <ScrollView style={styles.container}>
      {/* Instant Book Toggle - Prominent */}
      <View style={styles.instantBookSection}>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <Ionicons name="flash" size={24} color={colors.primary.main} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Instant Book</Text>
            <Text style={styles.subtitle}>
              Let guests book immediately without approval
            </Text>
          </View>
          <Switch
            value={instantBookEnabled}
            onValueChange={setInstantBookEnabled}
          />
        </View>

        {instantBookEnabled && (
          <View style={styles.benefits}>
            <Text style={styles.benefitItem}>⚡ Guests prefer Instant Book</Text>
            <Text style={styles.benefitItem}>📈 Up to 2x more bookings</Text>
            <Text style={styles.benefitItem}>🔍 Higher search ranking</Text>
          </View>
        )}
      </View>

      {/* Guest Requirements */}
      {instantBookEnabled && (
        <View style={styles.requirements}>
          <Text style={styles.sectionTitle}>Guest requirements for Instant Book</Text>

          <View style={styles.requirement}>
            <Text>Minimum rating</Text>
            <Picker
              selectedValue={guestRequirements.minRating}
              onValueChange={(value) =>
                setGuestRequirements(prev => ({ ...prev, minRating: value }))
              }
            >
              <Picker.Item label="No minimum" value={0} />
              <Picker.Item label="3.0+ stars" value={3.0} />
              <Picker.Item label="4.0+ stars" value={4.0} />
              <Picker.Item label="4.5+ stars" value={4.5} />
            </Picker>
          </View>

          <View style={styles.requirement}>
            <Text>Verified ID required</Text>
            <Switch
              value={guestRequirements.verifiedIdRequired}
              onValueChange={(value) =>
                setGuestRequirements(prev => ({ ...prev, verifiedIdRequired: value }))
              }
            />
          </View>

          <View style={styles.requirement}>
            <Text>Minimum age</Text>
            <Picker
              selectedValue={guestRequirements.minAge}
              onValueChange={(value) =>
                setGuestRequirements(prev => ({ ...prev, minAge: value }))
              }
            >
              <Picker.Item label="18+" value={18} />
              <Picker.Item label="21+" value={21} />
              <Picker.Item label="25+" value={25} />
            </Picker>
          </View>
        </View>
      )}

      {/* Availability Calendar */}
      <View style={styles.calendar}>
        <Text style={styles.sectionTitle}>Set your availability</Text>
        <AvailabilityCalendar
          vehicleId={vehicleId}
          onUpdate={handleAvailabilityUpdate}
        />
      </View>
    </ScrollView>
  );
};
```

---

### Sprint 5: Trip Management + Trip Photos + Claims (Días 25-30)

#### Día 1-2: Enhanced Trip Photos System

**⭐ ENHANCED: Pre-Trip Inspection** (`app/trip/[id]/inspection.tsx`)
```typescript
export const TripInspectionScreen = () => {
  const { tripId, type } = useLocalSearchParams(); // type: 'pre' | 'post'
  const [photos, setPhotos] = useState<TripPhoto[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const requiredPhotos = [
    ...REQUIRED_EXTERIOR_PHOTOS,
    ...REQUIRED_INTERIOR_PHOTOS,
  ];

  const currentRequirement = requiredPhotos[currentPhotoIndex];
  const progress = photos.length / requiredPhotos.filter(p => p.required).length;

  const capturePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
      exif: true, // Get metadata
    });

    if (!result.canceled) {
      const location = await Location.getCurrentPositionAsync({});

      const photo: TripPhoto = {
        id: generateId(),
        type: currentRequirement.id,
        uri: result.assets[0].uri,
        base64: result.assets[0].base64,
        timestamp: new Date().toISOString(),
        location: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
        metadata: result.assets[0].exif,
      };

      setPhotos(prev => [...prev, photo]);

      // Auto-advance to next required photo
      const nextRequired = requiredPhotos.findIndex(
        (p, i) => i > currentPhotoIndex && p.required && !photos.find(ph => ph.type === p.id)
      );
      if (nextRequired !== -1) {
        setCurrentPhotoIndex(nextRequired);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <ProgressBar progress={progress} style={styles.progressBar} />

      {/* Photo count */}
      <Text style={styles.photoCount}>
        {photos.length} of {requiredPhotos.filter(p => p.required).length} required photos
      </Text>

      {/* Camera view with overlay */}
      <View style={styles.cameraContainer}>
        <Camera style={styles.camera} type={CameraType.back}>
          {/* Overlay guide for current photo */}
          <PhotoOverlayGuide
            type={currentRequirement.angle}
            label={currentRequirement.label}
          />
        </Camera>
      </View>

      {/* Photo strip preview */}
      <ScrollView horizontal style={styles.photoStrip}>
        {requiredPhotos.map((req, index) => {
          const photo = photos.find(p => p.type === req.id);
          return (
            <TouchableOpacity
              key={req.id}
              style={[
                styles.photoThumb,
                currentPhotoIndex === index && styles.photoThumbActive,
              ]}
              onPress={() => setCurrentPhotoIndex(index)}
            >
              {photo ? (
                <Image source={{ uri: photo.uri }} style={styles.thumbImage} />
              ) : (
                <View style={styles.emptyThumb}>
                  <Ionicons
                    name={req.required ? 'camera' : 'camera-outline'}
                    size={20}
                    color={req.required ? colors.primary.main : colors.neutral.gray500}
                  />
                </View>
              )}
              {req.required && !photo && (
                <View style={styles.requiredBadge}>
                  <Text style={styles.requiredText}>!</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Capture button */}
      <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
        <View style={styles.captureButtonInner} />
      </TouchableOpacity>

      {/* Damage reporting */}
      <TouchableOpacity style={styles.damageButton} onPress={openDamageReporter}>
        <Ionicons name="warning" size={20} color={colors.secondary.warning} />
        <Text style={styles.damageButtonText}>Report existing damage</Text>
      </TouchableOpacity>

      {/* Complete button */}
      {progress >= 1 && (
        <Button variant="primary" onPress={submitInspection}>
          Complete {type === 'pre' ? 'Pickup' : 'Return'} Inspection
        </Button>
      )}
    </View>
  );
};
```

#### Día 3-4: In-App Claims Filing

**⭐ NEW: File Claim Screen** (`app/claims/new.tsx`)
```typescript
export const NewClaimScreen = () => {
  const { tripId } = useLocalSearchParams();
  const { data: trip } = useTrip(tripId);

  const [claimType, setClaimType] = useState<'damage' | 'theft' | 'accident' | 'other'>();
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [incidentDate, setIncidentDate] = useState(new Date());

  // Check if within 24-hour window
  const tripEndTime = trip?.endTime ? new Date(trip.endTime) : null;
  const isWithinWindow = tripEndTime
    ? differenceInHours(new Date(), tripEndTime) <= 24
    : false;

  return (
    <ScrollView style={styles.container}>
      {!isWithinWindow && (
        <View style={styles.warningBanner}>
          <Ionicons name="warning" size={20} color={colors.secondary.warning} />
          <Text style={styles.warningText}>
            Claims must be filed within 24 hours of trip end.
            Late claims may not be eligible for coverage.
          </Text>
        </View>
      )}

      <Text style={styles.title}>File a Claim</Text>
      <Text style={styles.subtitle}>
        Trip #{trip?.referenceNumber} • {trip?.vehicle.make} {trip?.vehicle.model}
      </Text>

      {/* Claim type selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What happened?</Text>
        <View style={styles.claimTypes}>
          {[
            { type: 'damage', icon: 'car', label: 'Vehicle Damage' },
            { type: 'theft', icon: 'lock-open', label: 'Theft' },
            { type: 'accident', icon: 'alert-circle', label: 'Accident' },
            { type: 'other', icon: 'help-circle', label: 'Other' },
          ].map(item => (
            <TouchableOpacity
              key={item.type}
              style={[
                styles.claimTypeCard,
                claimType === item.type && styles.claimTypeCardSelected,
              ]}
              onPress={() => setClaimType(item.type as any)}
            >
              <Ionicons name={item.icon} size={24} />
              <Text>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Date/time */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>When did this occur?</Text>
        <DateTimePicker
          value={incidentDate}
          onChange={setIncidentDate}
          maximumDate={new Date()}
        />
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Describe what happened</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={5}
          value={description}
          onChangeText={setDescription}
          placeholder="Please provide details about the incident..."
        />
      </View>

      {/* Photo evidence */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add photos</Text>
        <Text style={styles.sectionSubtitle}>
          Include photos of any damage or relevant evidence
        </Text>
        <PhotoUploader
          photos={photos}
          onPhotosChange={setPhotos}
          maxPhotos={10}
        />
      </View>

      {/* Pre/post trip photos comparison */}
      {trip && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip inspection photos</Text>
          <TripPhotosComparison
            preTrip={trip.preInspectionPhotos}
            postTrip={trip.postInspectionPhotos}
          />
        </View>
      )}

      {/* Submit */}
      <Button
        variant="primary"
        onPress={submitClaim}
        disabled={!claimType || !description || photos.length === 0}
      >
        Submit Claim
      </Button>

      <Text style={styles.disclaimer}>
        By submitting, you confirm this information is accurate.
        False claims may result in account suspension.
      </Text>
    </ScrollView>
  );
};
```

#### Día 5-6: Communication System + Emergency Support

**In-App Messaging (sin cambios mayores)**

**Enhanced Emergency Support:**
```typescript
// components/molecules/EmergencySupport/EmergencySupport.tsx
export const EmergencySupport = ({ tripId }: Props) => {
  const { data: trip } = useTrip(tripId);

  const emergencyOptions = [
    {
      id: 'roadside',
      icon: 'car',
      title: 'Roadside Assistance',
      subtitle: '24/7 help for breakdowns, flat tires, lockouts',
      action: () => callRoadsideAssistance(),
      included: trip?.protectionPlan?.tier !== 'basic',
    },
    {
      id: 'accident',
      icon: 'alert-circle',
      title: 'Report an Accident',
      subtitle: 'Get immediate help and file a claim',
      action: () => router.push(`/claims/new?tripId=${tripId}&type=accident`),
    },
    {
      id: 'emergency',
      icon: 'call',
      title: 'Emergency Services',
      subtitle: 'Call 911 for life-threatening emergencies',
      action: () => Linking.openURL('tel:911'),
    },
    {
      id: 'support',
      icon: 'headset',
      title: 'Contact Support',
      subtitle: 'Chat or call our support team',
      action: () => openSupportChat(),
    },
  ];

  return (
    <View style={styles.container}>
      {emergencyOptions.map(option => (
        <TouchableOpacity
          key={option.id}
          style={styles.optionCard}
          onPress={option.action}
          disabled={option.included === false}
        >
          <Ionicons name={option.icon} size={24} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{option.title}</Text>
            <Text style={styles.subtitle}>{option.subtitle}</Text>
          </View>
          {option.included === false && (
            <Badge variant="warning">Upgrade plan</Badge>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};
```

---

### Sprint 6: Polish + ID Verification + Risk Refinement (Días 31-36)

#### Día 1-2: Digital ID Verification with Liveness

**⭐ NEW: ID Verification Flow** (`app/(auth)/register/license.tsx`)
- Integrar `IDVerificationFlow` component (definido anteriormente)
- Face match con selfie
- Liveness detection
- Automatic data extraction from license

#### Día 3-4: Risk Score Refinement + Beta Testing

**Risk Score Display:**
```typescript
// components/molecules/RiskScoreBadge/RiskScoreBadge.tsx
export const RiskScoreBadge = ({ score, showDetails = false }: Props) => {
  const color = {
    low: colors.risk.low,
    medium: colors.risk.medium,
    high: colors.risk.high,
    very_high: colors.risk.veryHigh,
  }[score.level];

  return (
    <View style={[styles.container, { borderColor: color }]}>
      <View style={[styles.indicator, { backgroundColor: color }]} />
      <Text style={styles.label}>
        {score.level === 'low' && '✓ Trusted Guest'}
        {score.level === 'medium' && 'Verified Guest'}
        {score.level === 'high' && 'New Guest'}
        {score.level === 'very_high' && 'Requires Review'}
      </Text>
      {showDetails && (
        <TouchableOpacity onPress={() => showScoreDetails(score)}>
          <Ionicons name="information-circle" size={16} color={color} />
        </TouchableOpacity>
      )}
    </View>
  );
};
```

#### Día 5-6: Performance, Security & Launch Prep

**Performance Checklist:**
- [ ] FlatList para todas las listas largas
- [ ] Image caching con expo-image
- [ ] Lazy loading de pantallas
- [ ] Bundle splitting con Expo Router
- [ ] Profiling con React DevTools

**Security Audit:**
- [ ] No tokens en AsyncStorage (solo SecureStore)
- [ ] Validación de inputs en cliente Y servidor
- [ ] HTTPS everywhere
- [ ] Rate limiting en auth endpoints
- [ ] ⭐ NEW: Photo metadata validation
- [ ] ⭐ NEW: Claim fraud detection

---

## 4. Sprints Post-Launch (Días 37-54)

### Sprint 7: Keyless Access Integration (Días 37-42)

#### Opciones de Implementación

**Opción A: OEM Connected Car (Recomendada para fase inicial)**
```typescript
// services/keyless.ts
export interface KeylessProvider {
  type: 'oem' | 'aftermarket' | 'lockbox';
  supportedMakes: string[];
  connect(vehicleId: string): Promise<KeylessConnection>;
  unlock(connectionId: string): Promise<void>;
  lock(connectionId: string): Promise<void>;
  getStatus(connectionId: string): Promise<VehicleStatus>;
}

// Integración con APIs de fabricantes
// BMW ConnectedDrive, Ford SYNC, etc.
```

**Opción B: Dispositivo OBD-II (Tipo Turo Go)**
```typescript
// Requiere hardware adicional
// Instalación en puerto OBD del vehículo
// Comunicación via Bluetooth
```

**Opción C: Smart Lockbox (Más simple)**
```typescript
// Caja con código para llaves
// Código generado por viaje
// No requiere modificación del vehículo
```

### Sprint 8: Host Teams & Fleet Management (Días 43-48)

**⭐ NEW: Host Teams** (`app/(host)/teams.tsx`)
```typescript
// Funcionalidades:
// - Invitar co-hosts por email
// - Asignar permisos granulares:
//   - pricing: Modificar precios
//   - availability: Gestionar calendario
//   - trips: Ver/gestionar reservas
//   - earnings: Ver ganancias
//   - settings: Configuración del vehículo
// - Activity log por usuario
// - Multi-vehicle management para flotas
```

### Sprint 9: Advanced Features (Días 49-54)

**Collections & Curated Content:**
- Listas curateadas: "Best for Road Trips", "Luxury", "Electric"
- Favorites compartibles
- ML-based recommendations

**Pay Later:**
- $0 al reservar
- Pago 24h antes del viaje
- Integración con buy-now-pay-later providers

---

## 5. Métricas de Éxito Actualizadas

### 5.1 KPIs de UX

| Métrica | Target | Medición |
|---------|--------|----------|
| Registration completion | >80% | Analytics funnel |
| Time to complete registration | <4 min | Task timing |
| ID verification success rate | >95% | Verification API |
| Search-to-booking conversion | >25% | Analytics |
| Instant Book usage | >70% | Booking data |
| Booking completion rate | >85% | Analytics |
| Trip photo completion rate | >95% | Inspection data |
| Claims filed within 24h | >90% | Claims data |
| App crash rate | <0.5% | Crashlytics |
| App rating | >4.5 | App Store |

### 5.2 Business KPIs

| Métrica | Target | Sprint |
|---------|--------|--------|
| Host protection plan adoption | >80% | Sprint 4 |
| Guest protection plan upgrade rate | >40% | Sprint 3 |
| Smart pricing adoption | >60% | Sprint 4 |
| Average booking value | +15% | Sprint 4 |
| Claim resolution time | <72h | Sprint 5 |
| Host earnings per vehicle | +20% | Sprint 4 |

### 5.3 Performance Targets

| Métrica | Target |
|---------|--------|
| App launch time | <2s |
| Screen transition | <300ms |
| API response (p95) | <500ms |
| Image load time | <1s |
| Photo upload time | <5s per photo |
| ID verification time | <30s |
| Bundle size (iOS) | <50MB |

---

## 6. API Endpoints Adicionales

### Protection Service
```
POST   /protection/plans                 # Get available plans
GET    /protection/plans/:id             # Get plan details
POST   /protection/select                # Select plan for booking/host
```

### Pricing Service
```
GET    /pricing/smart/:vehicleId         # Get smart price recommendation
POST   /pricing/calculate                # Calculate trip price
GET    /pricing/market/:location         # Get market rates
```

### Verification Service
```
POST   /verification/id                  # Submit ID for verification
POST   /verification/selfie              # Submit selfie for face match
POST   /verification/liveness            # Submit liveness check
GET    /verification/status/:userId      # Get verification status
```

### Claims Service
```
POST   /claims                           # File new claim
GET    /claims/:id                       # Get claim details
PUT    /claims/:id                       # Update claim
GET    /claims/trip/:tripId              # Get claims for trip
POST   /claims/:id/evidence              # Add evidence to claim
```

### Risk Scoring Service
```
GET    /risk/score/:userId               # Get user risk score
GET    /risk/eligibility/:userId/:vehicleId  # Check booking eligibility
```

---

## 7. Referencias

- [CLAUDE.md](/CLAUDE.md) - Lineamientos del proyecto
- [implementation_roadmap.md](/ux-research/implementation_roadmap.md) - Roadmap original
- [mockup_generation_guide.md](/ux-research/mockup_generation_guide.md) - Guía de mockups
- [ux_flows_specification.md](/ux-research/ux_flows_specification.md) - Flujos UX
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/)

### Industry References
- [Turo 2024 Product Updates](https://www.prnewswire.com/news-releases/turo-announced-over-70-key-product-updates-302182448.html)
- [Turo Go Technology](https://www.ridester.com/turo-go/)
- [Turo Host Protection](https://turo.com/us/en/car-rental/united-states/insurance)
- [Turo Trip Photos Guide](https://help.turo.com/en_us/trip-photos-guide-or-hosts-BkKcBEeN5)
- [Turo Dynamic Pricing](https://turo.com/blog/news/introducing-dynamic-pricing-to-help-maximize-your-earnings/)
