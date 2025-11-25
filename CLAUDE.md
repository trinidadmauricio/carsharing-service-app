# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native/Expo carsharing application for El Salvador, built with TypeScript. The app enables guests to rent vehicles and hosts to list their vehicles, with comprehensive KYC, authentication, search, booking, and payment flows.

**Current Status**: Early development phase with extensive UX research, prototypes, and documentation in place. The mobile app implementation is based on detailed planning documents.

## Core Technologies

- **React**: 19.1.0 (latest with updated JSX namespace)
- **React Native**: 0.81.5 with Expo ~54.0.25
- **TypeScript**: 5.1.3 (strict mode enabled)
- **Routing**: Expo Router ~6.0.15 (file-based routing)
- **State Management**: TanStack React Query ^5.90.10 for remote state
- **Storage**: expo-secure-store for tokens, expo-local-authentication for biometrics
- **Animations**: react-native-reanimated ~4.1.1 for performance-optimized animations

## Essential Commands

### Development
```bash
npx expo start              # Start development server
npx expo start --ios        # Start iOS simulator
npx expo start --android    # Start Android emulator
npm run build               # Type check (tsc --noEmit)
npm run lint                # Run ESLint
npm run lint:fix            # Fix ESLint issues
npm test                    # Run tests
npm test:watch              # Run tests in watch mode
npm test:coverage           # Run tests with coverage
```

### Prototyping
```bash
npm run capture              # Capture screenshots of prototypes using Playwright
npm run capture:puppeteer    # Capture screenshots using Puppeteer (alternative)
```

Note: Prototyping commands are for the HTML/CSS/JS prototypes in the `prototype/` directory.

## Project-Specific Rules & Conventions

### 1. React 19 JSX Types ⚛️

This project uses **React 19** which has updated JSX type syntax:

```typescript
// ✅ CORRECT - React 19 syntax
import React from 'react';

export default function MyComponent(): React.JSX.Element {
  return <View />;
}

// ❌ WRONG - Old syntax (causes "Cannot find namespace 'JSX'" error)
export default function MyComponent(): JSX.Element {
  return <View />;
}
```

**Always**:
- Import React when using JSX types: `import React from 'react';`
- Use `React.JSX.Element` instead of `JSX.Element`
- This applies to all component return types and JSX arrays

### 2. Safe Area Handling 📱

Always respect device safe areas (notch, home indicator) using hooks:

```typescript
// ✅ CORRECT - Use hook for dynamic padding
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function MyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomCTA, {
      paddingBottom: insets.bottom + spacing['3']
    }]}>
      {/* Bottom content */}
    </View>
  );
}

// ❌ WRONG - SafeAreaView doesn't work well with absolute positioning
<SafeAreaView style={styles.bottomCTA}>
  {/* Content */}
</SafeAreaView>
```

**Critical areas requiring safe area handling**:
- Bottom navigation bars
- Fixed bottom CTAs (booking buttons, submit forms)
- Top headers with transparent backgrounds
- Modals and sheets

### 3. Platform-Specific Code 🔀

Handle iOS vs Android differences explicitly:

```typescript
// ✅ CORRECT - Platform.select for different behaviors
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  input: {
    height: 48,
    paddingHorizontal: spacing['4'],
    paddingVertical: 0,
    ...Platform.select({
      android: {
        textAlignVertical: 'center',
        includeFontPadding: false,
      },
      ios: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    }),
  },
});
```

**Common platform differences**:
- **Text centering**: `textAlignVertical` only works on Android
- **Font rendering**: iOS includes extra padding by default
- **Input behavior**: iOS and Android handle TextInput differently
- **Safe areas**: Different inset values per platform

### 4. Color Palette Usage 🎨

Use semantic color names from the design system:

```typescript
// ✅ CORRECT - Semantic color names
palette.primary[500]    // Brand purple/indigo
palette.info[500]       // Blue color
palette.success[500]    // Green
palette.warning[500]    // Yellow
palette.error[500]      // Red
palette.neutral[500]    // Gray scale

// ❌ WRONG - Non-existent direct color names
palette.blue[500]       // Does NOT exist - use palette.info
palette.green[500]      // Does NOT exist - use palette.success
palette.red[500]        // Does NOT exist - use palette.error
```

**Available semantic colors**:
- `primary` - Brand colors (purple/indigo)
- `secondary` - Secondary brand (teal)
- `neutral` - Gray scale
- `info` - Blue (informational)
- `success` - Green (positive actions)
- `warning` - Yellow (cautions)
- `error` - Red (errors, destructive actions)

### 5. Promise Handling 🔄

Always handle promise rejections, even for non-blocking operations:

```typescript
// ✅ CORRECT - Catch errors even for fire-and-forget promises
svc.vehicles.trackView(vehicleId).catch((err) => {
  console.warn('Failed to track vehicle view:', err);
});

// Also wrap in try-catch for queryFn
queryFn: async () => {
  try {
    svc.vehicles.trackView(vehicleId).catch(() => {});
    return await svc.vehicles.getById(vehicleId);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    throw error;
  }
}

// ❌ WRONG - Unhandled promise rejection causes runtime errors
svc.vehicles.trackView(vehicleId); // Will crash app if it fails
```

### 6. Build & Type Checking ✅

Before committing, ALWAYS verify your changes:

```bash
# Check TypeScript errors
npm run build              # Runs: tsc --noEmit
# Must show: 0 errors

# Check ESLint errors
npm run lint
# Must show: 0 errors (warnings are acceptable)
```

**Critical**: Never commit code with TypeScript or ESLint errors. Warnings are acceptable, but errors block the build.

### 7. Input Component Best Practices ⌨️

When working with text inputs:

```typescript
// ✅ CORRECT - Fixed height with platform-specific centering
const styles = StyleSheet.create({
  inputContainer: {
    height: 48,              // Fixed height, not minHeight
    justifyContent: 'center', // Helps with vertical alignment
  },
  input: {
    paddingVertical: 0,
    ...Platform.select({
      android: {
        textAlignVertical: 'center',
        includeFontPadding: false,
      },
      ios: {
        // iOS centers automatically with fixed height
        paddingTop: 0,
        paddingBottom: 0,
      },
    }),
  },
});

// ❌ WRONG - minHeight causes inconsistent sizing
inputContainer: {
  minHeight: 48,  // Don't use minHeight
}
```

## Architecture Overview

### Service Layer Pattern (Mock/REST Switchable)

All API services follow a dual-implementation pattern to support both mock data (for development) and real REST APIs:

```
services/
  ├── modes/
  │   ├── mock/     # Mock implementations with hardcoded data
  │   └── rest/     # Real REST API implementations
  └── index.ts      # Mode selector (ENV.API_MODE determines which)
```

**Critical**: When adding new API functionality:
1. Define TypeScript interfaces first (in `services/{domain}.ts`)
2. Implement mock version with realistic delays
3. Implement REST version with same interface
4. Never mix implementations - always use the service layer through `svc` export

### Component Organization (Atomic Design)

Components are organized using Atomic Design principles:

```
components/
  ├── atoms/        # Basic components (Button, Input, Card)
  ├── molecules/    # Composed components (FiltersSheet, PinInput)
  └── organisms/    # Complex components (complete forms)
```

**Rules**:
- Atoms have no UI component dependencies
- Molecules combine atoms
- Organisms combine molecules and atoms
- Use `index.ts` for clean exports

### Authentication Flow

The app implements a sophisticated auth system:
- **Access tokens**: Stored in memory only (never persisted)
- **Refresh tokens**: Stored in expo-secure-store
- **Automatic refresh**: apiClient handles 401s and token refresh
- **Biometric support**: Touch ID/Face ID via expo-local-authentication
- **2FA**: PIN-based two-factor authentication

**Security Requirements**:
- NEVER store access tokens in AsyncStorage or state
- NEVER hardcode credentials or API keys
- Always use HTTPS in production
- Validate all user inputs
- Handle token cleanup on logout

### Data Fetching Pattern (React Query)

All async operations use TanStack Query:

```typescript
// Queries for reading data
const { data, isLoading } = useQuery({
  queryKey: ['vehicles', filters],
  queryFn: () => getVehicles(filters),
  staleTime: 5 * 60 * 1000,  // 5 minutes
});

// Mutations for write operations
const mutation = useMutation({
  mutationFn: createBooking,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
  },
});
```

**Never** use useState + useEffect for data fetching. Always use React Query hooks.

## Key File Locations

### Planning & Documentation
- `docs/plan-detallado.md` - Complete technical implementation plan (Spanish)
- `docs/plan-app-mobile.md` - Mobile app specific plan
- `docs/plan-rest-api.md` - REST API specifications
- `docs/plan-backoffice-web.md` - Backoffice web app plan
- `ux-research/` - Comprehensive UX research, user journeys, patterns
- `ux-research/implementation_roadmap.md` - Sprint-based implementation roadmap

### Development Guidelines
- `.cursor/rules` - Comprehensive development rules and best practices (Spanish)
- `.cursor/agents/` - Specialized agent prompts for specific domains:
  - `architect-reviewer.md` - Architecture and design patterns
  - `react-specialist.md` - React optimization and patterns
  - `typescript-pro.md` - TypeScript advanced patterns
  - `security-auditor.md` - Security best practices
  - `qa-expert.md` - Testing strategies
  - `mobile-developer.md` - Mobile-specific optimizations
  - `ux-researcher.md` - UX methodology and research

### Prototypes
- `prototype/auth-login/` - Complete authentication flow prototype (HTML/CSS/JS)
- `prototype/guest-registration/` - Guest registration flow
- `prototype/host-onboarding/` - Host onboarding flow
- `prototype/trip-management/` - Trip management screens
- `prototype/vehicle-search/` - Vehicle search and discovery

These prototypes are production-ready HTML/CSS/JavaScript implementations that demonstrate the exact UX flows and can be used as implementation references.

## Critical Development Principles

### Test-Driven Development (TDD)
- **Always write tests before implementation** (Red-Green-Refactor cycle)
- Minimum 80% coverage for critical code paths
- Test types: Unit tests (components, hooks, utils), Integration tests (flows), E2E tests (critical paths)
- Mock external dependencies (API, SecureStore, etc.)

### TypeScript Strict Mode
- `strict: true` is always enabled
- Never use `any` - use `unknown` for truly unknown types
- All functions must have explicit return types
- All API requests/responses must be typed

### Security First
- Validate and sanitize all user inputs
- Never log sensitive data (tokens, passwords, personal info)
- Implement rate limiting on sensitive operations
- Use biometric auth as enhancement, not replacement for passwords
- Follow OWASP Mobile Security guidelines

### Payment Integration
**Critical**: This app uses server-side payment processing only:
- NO Stripe SDK in the app
- App calls `POST /payments/checkout` to initiate payment
- Server returns URL for web-based checkout (Stripe Checkout or similar)
- App opens URL in Custom Tab/SafariView
- Deep link returns: `carsharing://payment-result?bookingId=X&status=success`
- App queries `GET /bookings/:id` for final confirmation

Never implement direct payment processing in the mobile app.

## KYC Implementation Notes

Both guests and hosts must complete KYC:
- **Document capture**: ID/license photos with quality validation
- **Selfie verification**: Basic facial matching
- **Status tracking**: `pending` | `approved` | `rejected`
- **Conditional blocking**: Cannot complete booking (guest) or list vehicle (host) until KYC is `approved`

Show KYC status prominently in profile screen with clear CTAs.

## Common Patterns and Gotchas

### Routing with Expo Router
```typescript
// Navigate programmatically
import { router } from 'expo-router';
router.push('/vehicle/123');

// File-based routes
app/(auth)/login.tsx → /login
app/(tabs)/browse.tsx → /browse (in tab navigator)
app/vehicle/[id].tsx → /vehicle/:id
```

### Error Handling
```typescript
// Good: Structured error handling
try {
  const result = await apiClient.get('/vehicles');
  if (!result.success) {
    showToast(result.error.message);
    return;
  }
  // Use result.data
} catch (error) {
  showToast('Connection error. Please try again.');
}

// Bad: Exposing technical details
catch (error) {
  alert(error.message); // Never expose stack traces
}
```

### Performance Optimization
- Use `FlatList` for long lists, never `ScrollView`
- Implement `keyExtractor` and `getItemLayout` for lists
- Lazy load images with `expo-image`
- Use `useMemo` and `useCallback` only when necessary
- Profile before optimizing

### Accessibility Requirements
- All interactive elements need `accessibilityLabel`
- Use appropriate `accessibilityRole`
- Support screen readers (VoiceOver/TalkBack)
- Minimum contrast ratio: WCAG AA (4.5:1)
- Touch targets: 44x44pt minimum

## Environment Configuration

Variables are managed through `app.config.ts` and `.env`:

```typescript
export const ENV = {
  API_MODE: process.env.EXPO_PUBLIC_API_MODE ?? 'mock',  // 'mock' | 'live'
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4000',
  DEEP_LINK_SCHEME: process.env.EXPO_PUBLIC_DEEP_LINK_SCHEME ?? 'carsharing',
  ENV: process.env.EXPO_PUBLIC_ENV ?? 'dev',  // 'dev' | 'stage' | 'prod'
};
```

To switch from mock to live API: Change `API_MODE='live'` in `.env`

## Design System

The app uses a centralized design token system:

```
theme/
  ├── tokens.ts     # Master design tokens
  ├── colors.ts     # Color palette (light/dark mode)
  ├── typography.ts # Font scales and weights
  ├── spacing.ts    # Spacing scale
  └── darkMode.ts   # Dark mode overrides
```

**Never hardcode** colors, spacing, or font sizes. Always reference design tokens.

## UX Research Integration

The `ux-research/` directory contains extensive user research:
- User journey maps for guest and host flows
- UX patterns library with best practices
- Pain points analysis from competitor research (Turo, Getaround, etc.)
- Implementation roadmap with sprint planning

When implementing new features, **always review the relevant UX documentation first** to understand user expectations and proven patterns.

## Git Workflow

- **Commit format**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, etc.)
- **Branch naming**: `feature/`, `fix/`, `refactor/`
- **Commits**: Atomic and descriptive
- **PRs**: Small and focused

## Code Quality Checklist

Before considering any code complete:
- [ ] Tests written and passing (TDD)
- [ ] TypeScript types defined (no `any`)
- [ ] TypeScript errors: 0 (run `npm run build`)
- [ ] ESLint errors: 0 (run `npm run lint`)
- [ ] Error handling implemented
- [ ] Accessibility labels added
- [ ] Security considerations addressed
- [ ] Design tokens used (no hardcoded values)
- [ ] Performance profiled (if applicable)
- [ ] Documentation updated

## Important Notes for AI Assistants

1. **Read the planning documents first** (`docs/plan-detallado.md`) - they contain critical architectural decisions
2. **Consult specialized agents** in `.cursor/agents/` for domain-specific guidance
3. **Reference the prototypes** in `prototype/` for exact UX implementation details
4. **Follow TDD religiously** - tests must be written before implementation
5. **Never compromise security** - this app handles sensitive financial and personal data
6. **Maintain the mock/rest duality** - both implementations must always work
7. **The project is in Spanish** - many docs and rules are in Spanish, but code should use English
8. **Always verify builds** - Run `npm run build` and `npm run lint` before committing

## Quick Reference Links

- **React Native**: https://reactnative.dev/docs/
- **Expo**: https://docs.expo.dev/
- **Expo Router**: https://docs.expo.dev/router/introduction/
- **TanStack Query**: https://tanstack.com/query/latest
- **TypeScript**: https://www.typescriptlang.org/docs/
- **React 19**: https://react.dev/blog/2024/12/05/react-19
- **OWASP Mobile Security**: https://owasp.org/www-project-mobile-security/
