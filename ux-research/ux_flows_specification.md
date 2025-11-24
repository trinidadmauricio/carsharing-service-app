# Carsharing App UX Flows & Mockup Specifications

## Overview
This document provides comprehensive user experience flows and detailed wireframe specifications for the carsharing mobile application. Each flow includes screen-by-screen breakdowns, user actions, decision points, and technical specifications for mockup creation.

---

## 1. Core User Flows

### 1.1 Guest Registration & KYC Flow

**Flow Purpose**: Convert anonymous users to verified guests who can book vehicles
**Entry Points**: App launch, "Sign Up" CTA, booking attempt without account
**Success Criteria**: Completed profile with verified identity and payment method

#### Flow Steps:

**Screen 1: Welcome/Onboarding**
- **Layout**: Full-screen with hero image/video
- **Elements**:
  - App logo (top center)
  - Hero visual of cars/people using service
  - Primary CTA: "Get Started" (bottom 20%)
  - Secondary link: "Already have account? Sign In"
- **Actions**: Tap "Get Started" → Screen 2
- **Error States**: None
- **Mobile Patterns**: Bottom-anchored CTAs, swipeable onboarding slides

**Screen 2: Account Type Selection**
- **Layout**: Split-screen design
- **Elements**:
  - Header: "How do you want to use [AppName]?"
  - Two large cards (50% height each):
    - "Rent Cars" (Guest path) - car icon
    - "Share My Car" (Host path) - money/sharing icon
  - Each card shows key benefits (3 bullet points)
- **Actions**:
  - Tap "Rent Cars" → Screen 3
  - Tap "Share My Car" → Host flow
- **Error States**: None
- **Data**: User type preference

**Screen 3: Basic Information**
- **Layout**: Form-based with progressive disclosure
- **Elements**:
  - Progress indicator (step 1 of 4)
  - Header: "Let's get to know you"
  - Form fields:
    - First Name (required)
    - Last Name (required)
    - Email (required, validated)
    - Phone Number (required, with country code picker)
    - Password (required, strength indicator)
    - Confirm Password (required)
  - Terms checkbox (required)
  - Primary CTA: "Continue"
- **Actions**: Form validation → Screen 4
- **Error States**:
  - Invalid email format
  - Password mismatch
  - Phone number validation
  - Network errors
- **Validation Rules**:
  - Email: RFC 5322 compliant
  - Password: 8+ chars, 1 upper, 1 lower, 1 number
  - Phone: E.164 format

**Screen 4: Phone Verification**
- **Layout**: Single-purpose screen
- **Elements**:
  - Progress indicator (step 2 of 4)
  - Header: "Verify your phone"
  - Subtitle: "We sent a code to [phone number]"
  - 6-digit PIN input (large, spaced)
  - "Didn't receive code?" link
  - Timer countdown (60 seconds)
  - Primary CTA: "Verify" (disabled until 6 digits entered)
- **Actions**:
  - Enter valid code → Screen 5
  - Resend code option
- **Error States**:
  - Invalid code (3 attempts max)
  - Timeout/expired code
  - SMS delivery failure
- **Auto-behaviors**: Auto-submit when 6 digits entered

**Screen 5: Driver's License Upload**
- **Layout**: Camera-focused with guidance
- **Elements**:
  - Progress indicator (step 3 of 4)
  - Header: "Upload your driver's license"
  - Camera viewfinder with overlay guides
  - Requirements checklist:
    - Valid and not expired
    - All text clearly visible
    - No glare or shadows
  - Photo preview area
  - Retake/Continue options
  - Skip option (for later verification)
- **Actions**:
  - Take photo → Preview → Screen 6
  - Upload from gallery option
  - Skip → Screen 6 (limited functionality)
- **Error States**:
  - Poor photo quality
  - License expired/invalid
  - Camera permissions denied
- **Technical**: OCR processing, document verification API

**Screen 6: Payment Method Setup**
- **Layout**: Form with security emphasis
- **Elements**:
  - Progress indicator (step 4 of 4)
  - Header: "Add payment method"
  - Security badges/trust indicators
  - Credit card form:
    - Card number (masked input)
    - Expiry date (MM/YY)
    - CVV (3-4 digits)
    - Cardholder name
    - Billing ZIP code
  - "Save for future use" toggle
  - Primary CTA: "Complete Setup"
  - Skip option with limitations notice
- **Actions**:
  - Valid card → Success screen
  - Skip → Limited account notice
- **Error States**:
  - Invalid card details
  - Payment processing errors
  - Declined card
- **Security**: PCI compliance, tokenization

**Screen 7: Registration Success**
- **Layout**: Celebration screen
- **Elements**:
  - Success animation/illustration
  - Header: "Welcome to [AppName]!"
  - Summary of completed setup
  - Next steps preview
  - Primary CTA: "Start Exploring Cars"
  - Secondary: "Complete Profile Later"
- **Actions**:
  - Continue → Main app (Screen 8)
  - Profile completion → Additional screens
- **Auto-behaviors**: Auto-redirect after 3 seconds

---

### 1.2 Host Registration & KYC Flow

**Flow Purpose**: Convert users to verified hosts who can list vehicles
**Entry Points**: Account type selection, "Become a Host" from guest account
**Success Criteria**: Verified host with approved vehicle listing

#### Flow Steps:

**Screen 1: Host Benefits Overview**
- **Layout**: Feature showcase with financial emphasis
- **Elements**:
  - Header: "Start earning with your car"
  - Earnings calculator widget
  - Benefits carousel:
    - "Earn $XXX/month"
    - "Insurance included"
    - "24/7 support"
  - Testimonial section
  - Primary CTA: "Get Started"
- **Actions**: Tap "Get Started" → Screen 2

**Screen 2: Enhanced KYC Requirements**
- **Layout**: Checklist with explanations
- **Elements**:
  - Header: "Host verification requirements"
  - Requirements list:
    - Valid driver's license ✓
    - Vehicle registration documents
    - Insurance verification
    - Background check consent
    - Tax information (for earnings)
  - Time estimate: "5-10 minutes"
  - Primary CTA: "Begin Verification"
- **Actions**: Continue → Screen 3

**Screen 3: Vehicle Information**
- **Layout**: Multi-step form with car imagery
- **Elements**:
  - Progress indicator (step 1 of 6)
  - Header: "Tell us about your car"
  - Form sections:
    - Make/Model/Year (searchable dropdowns)
    - VIN number input
    - License plate
    - Mileage
    - Transmission type
    - Fuel type
  - Car photo placeholder
- **Actions**: Form completion → Screen 4
- **Validation**: VIN verification, duplicate checking

**Screen 4: Vehicle Documentation**
- **Layout**: Document upload with clear requirements
- **Elements**:
  - Progress indicator (step 2 of 6)
  - Header: "Vehicle documents"
  - Upload sections:
    - Registration certificate
    - Insurance policy
    - Recent inspection (if required)
  - Document requirements for each
  - Photo upload interface
- **Actions**: All documents uploaded → Screen 5
- **Error States**: Invalid/expired documents

**Screen 5: Vehicle Photos**
- **Layout**: Guided photo session
- **Elements**:
  - Progress indicator (step 3 of 6)
  - Header: "Vehicle photos"
  - Photo checklist (8 required):
    - Front exterior
    - Rear exterior
    - Both sides
    - Interior (dashboard, seats)
    - Odometer
    - Any damage/wear
  - Camera interface with overlay guides
  - Photo grid showing progress
- **Actions**: All photos taken → Screen 6

**Screen 6: Pricing & Availability**
- **Layout**: Interactive pricing tool
- **Elements**:
  - Progress indicator (step 4 of 6)
  - Header: "Set your pricing"
  - Market rate suggestion widget
  - Pricing inputs:
    - Daily rate
    - Weekly discount %
    - Monthly discount %
  - Calendar availability selector
  - Earnings projection
- **Actions**: Settings confirmed → Screen 7

**Screen 7: Location & Pickup**
- **Layout**: Map-based interface
- **Elements**:
  - Progress indicator (step 5 of 6)
  - Header: "Where can guests pick up?"
  - Map with current location
  - Address input/verification
  - Pickup options:
    - Host handoff
    - Self-service (with lockbox)
    - Delivery option
  - Instructions text area
- **Actions**: Location set → Screen 8

**Screen 8: Host Agreement & Tax Info**
- **Layout**: Legal document with key highlights
- **Elements**:
  - Progress indicator (step 6 of 6)
  - Header: "Final steps"
  - Host agreement (scrollable)
  - Key terms highlighted
  - Tax information form:
    - SSN/Tax ID
    - Business type (individual/company)
  - Electronic signature
  - Primary CTA: "Submit for Review"
- **Actions**: Agreement signed → Success screen

**Screen 9: Pending Approval**
- **Layout**: Status tracking screen
- **Elements**:
  - Header: "Application submitted!"
  - Review timeline (24-48 hours)
  - Status checklist:
    - Documents received ✓
    - Background check (pending)
    - Vehicle verification (pending)
    - Final approval (pending)
  - Contact support option
  - Email notification setup
- **Actions**: Continue to limited dashboard

---

### 1.3 Vehicle Search & Discovery Flow

**Flow Purpose**: Help guests find and evaluate suitable vehicles
**Entry Points**: Main app screen, location-based search
**Success Criteria**: User finds vehicle matching their needs and proceeds to booking

#### Flow Steps:

**Screen 1: Search Input**
- **Layout**: Map-centered with search overlay
- **Elements**:
  - Location search bar (with current location)
  - Date/time pickers:
    - Pickup date & time
    - Return date & time
  - Quick duration buttons (2 hours, 1 day, weekend)
  - Map showing available cars
  - Car density indicators
  - Filters button (top right)
  - Search CTA button
- **Actions**:
  - Enter criteria → Screen 2
  - Tap car on map → Quick preview
  - Adjust filters → Filter screen
- **Default Values**: Current location, next 2 hours

**Screen 2: Search Results List**
- **Layout**: Scrollable list with map toggle
- **Elements**:
  - Search criteria summary (editable)
  - Sort options (distance, price, rating)
  - Filter chips (active filters shown)
  - Car cards showing:
    - Photo gallery (swipeable)
    - Make/model/year
    - Price per hour/day
    - Distance from pickup location
    - Host rating
    - Key features (automatic, GPS, etc.)
    - Instant book badge
  - Map view toggle
  - Load more functionality
- **Actions**:
  - Tap car → Screen 3 (Detail view)
  - Heart icon → Save to favorites
  - Quick book → Booking flow
- **Error States**: No results found, location services disabled

**Screen 3: Vehicle Detail View**
- **Layout**: Full-screen detail with booking anchor
- **Elements**:
  - Photo gallery (full-width, swipeable with indicators)
  - Vehicle information:
    - Make/model/year/trim
    - Transmission, fuel type, seats
    - Features list (GPS, Bluetooth, etc.)
    - Cleanliness/condition ratings
  - Host information:
    - Host name and photo
    - Rating and review count
    - Response time
    - Host since date
  - Location details:
    - Pickup/return address
    - Parking instructions
    - Distance from search location
  - Pricing breakdown:
    - Base rate
    - Duration calculation
    - Fees (if any)
    - Total estimate
  - Availability calendar
  - Reviews section (preview with "See all" option)
  - Bottom-anchored booking CTA
- **Actions**:
  - Book now → Booking flow
  - Contact host → Messaging
  - View all reviews → Reviews screen
  - Share vehicle → Native share
- **Interactive Elements**: Photo zoom, calendar interaction

**Screen 4: Filters & Sorting**
- **Layout**: Full-screen overlay with categories
- **Elements**:
  - Header with "Clear all" and "Apply" options
  - Filter categories:
    - Price range (slider)
    - Vehicle type (compact, SUV, luxury, etc.)
    - Transmission (automatic/manual)
    - Fuel type
    - Features (GPS, Bluetooth, backup camera)
    - Instant book only
    - Host rating minimum
    - Distance radius
  - Sort options:
    - Recommended
    - Price (low to high)
    - Distance (nearest first)
    - Rating (highest first)
    - Newest listings
  - Results count preview
- **Actions**:
  - Apply filters → Updated results
  - Clear all → Reset filters
- **Persistence**: Save user filter preferences

**Screen 5: Saved Vehicles**
- **Layout**: Grid/list view of favorited cars
- **Elements**:
  - Header: "Saved vehicles"
  - View toggle (grid/list)
  - Saved car cards with:
    - Remove from saved option
    - Availability status
    - Price changes indicator
    - Quick book option
  - Empty state with discovery suggestions
- **Actions**:
  - Tap vehicle → Detail view
  - Remove from saved
  - Quick book → Booking flow

---

### 1.4 Booking & Rental Flow

**Flow Purpose**: Complete vehicle reservation with payment and trip setup
**Entry Points**: Vehicle detail page, quick book options
**Success Criteria**: Confirmed booking with payment processed and trip details shared

#### Flow Steps:

**Screen 1: Booking Details Confirmation**
- **Layout**: Summary card with editable elements
- **Elements**:
  - Vehicle summary card:
    - Photo, make/model
    - Host name and rating
    - Pickup location
  - Trip details (editable):
    - Pickup date/time
    - Return date/time
    - Duration calculation
  - Pricing breakdown:
    - Base rate × duration
    - Service fees
    - Taxes
    - Total amount
  - Special requests text area
  - Primary CTA: "Continue to Payment"
- **Actions**:
  - Edit dates/times → Date picker overlay
  - Add special requests
  - Continue → Screen 2
- **Validation**: Availability recheck

**Screen 2: Guest Information**
- **Layout**: Form with driver verification
- **Elements**:
  - Header: "Driver information"
  - Primary driver section:
    - Name (pre-filled from profile)
    - Driver's license status
    - Age verification (25+ requirements)
  - Additional drivers option:
    - Add driver button
    - Driver verification requirements
    - Additional fees notice
  - Emergency contact:
    - Name and phone number
  - Primary CTA: "Continue"
- **Actions**:
  - Add additional driver → Driver form
  - Verify license → Document upload
  - Continue → Screen 3
- **Error States**: Unverified license, age restrictions

**Screen 3: Payment Method**
- **Layout**: Payment selection with security emphasis
- **Elements**:
  - Header: "Payment method"
  - Saved payment methods (if any):
    - Card ending in XXXX
    - Edit/remove options
  - Add new payment method:
    - Credit/debit card form
    - Digital wallet options (Apple/Google Pay)
  - Security deposit information:
    - Amount (pre-authorized)
    - Release timeline
    - What it covers
  - Billing address verification
  - Primary CTA: "Confirm Booking"
- **Actions**:
  - Select payment method → Screen 4
  - Add new card → Card form
  - Use digital wallet → Platform flow
- **Security**: PCI compliance, encryption indicators

**Screen 4: Booking Confirmation**
- **Layout**: Full-screen confirmation with next steps
- **Elements**:
  - Success animation
  - Header: "Booking confirmed!"
  - Booking reference number
  - Trip summary card:
    - Vehicle and host info
    - Dates/times
    - Total paid
  - Next steps timeline:
    - Host will confirm (within X hours)
    - Receive pickup instructions
    - Trip reminders
  - Action buttons:
    - "View Booking Details"
    - "Contact Host"
    - "Add to Calendar"
  - Confirmation email sent notice
- **Actions**:
  - View details → Booking management
  - Contact host → Messaging
  - Calendar export → Native calendar
- **Auto-behaviors**: Email/SMS notifications sent

**Screen 5: Pickup Instructions**
- **Layout**: Step-by-step guide with contact options
- **Elements**:
  - Header: "Pickup instructions"
  - Vehicle location map (with pin)
  - Step-by-step instructions:
    - Where to meet/find car
    - What to bring (license, phone)
    - Key handoff process
    - Pre-trip inspection items
  - Host contact options:
    - Call button
    - Message button
    - Host photo and name
  - Emergency support contact
  - Vehicle access method:
    - Traditional key handoff
    - Smart lock/app unlock
    - Lockbox with code
- **Actions**:
  - Contact host → Phone/messaging
  - Get directions → Maps app
  - Report issue → Support
- **Real-time**: Host location sharing (if applicable)

**Screen 6: Vehicle Inspection**
- **Layout**: Guided checklist with photo documentation
- **Elements**:
  - Header: "Pre-trip inspection"
  - Vehicle exterior checklist:
    - Front, rear, sides
    - Lights and signals
    - Tires and wheels
    - Existing damage notation
  - Interior checklist:
    - Cleanliness assessment
    - Controls functionality
    - Fuel level
    - Odometer reading
  - Photo documentation:
    - Required photos list
    - Camera interface
    - Damage reporting tool
  - Signature/confirmation
  - Primary CTA: "Start Trip"
- **Actions**:
  - Take required photos
  - Report damage → Damage form
  - Start trip → Active trip screen
- **Data**: Inspection photos, damage reports, odometer reading

**Screen 7: Active Trip Dashboard**
- **Layout**: Trip management hub
- **Elements**:
  - Trip status indicator
  - Current trip details:
    - Time remaining
    - Return deadline
    - Current location (if shared)
  - Quick actions:
    - Extend trip
    - Get directions to return
    - Contact host
    - Emergency roadside assistance
  - Trip expenses tracker:
    - Current charges
    - Fuel/mileage tracking
    - Additional fees
  - Return location reminder
  - Primary CTA: "End Trip"
- **Actions**:
  - Extend trip → Extension flow
  - Emergency help → Support flow
  - End trip → Return process
- **Real-time**: Live trip tracking, notifications

**Screen 8: Trip Return Process**
- **Layout**: Return checklist with final documentation
- **Elements**:
  - Header: "Return vehicle"
  - Return location confirmation
  - Final inspection checklist:
    - Fuel level check
    - Cleanliness verification
    - Damage assessment
    - Odometer final reading
  - Photo documentation:
    - Final condition photos
    - Fuel gauge photo
    - Parking location photo
  - Key return process
  - Trip summary:
    - Total duration
    - Miles driven
    - Final charges
  - Primary CTA: "Complete Return"
- **Actions**:
  - Take final photos
  - Complete return → Trip completed
  - Report issues → Support
- **Validation**: Required photos, inspection completion

**Screen 9: Trip Completion**
- **Layout**: Trip summary with rating request
- **Elements**:
  - Header: "Trip completed!"
  - Trip summary card:
    - Total duration and distance
    - Final charges breakdown
    - Receipt generation
  - Rating request:
    - Host rating (1-5 stars)
    - Vehicle condition rating
    - Overall experience rating
    - Written review option
  - Next steps:
    - Receipt email sent
    - Security deposit release timeline
    - Support contact if issues
  - Action buttons:
    - "Book Again"
    - "Download Receipt"
    - "Share Experience"
- **Actions**:
  - Submit rating → Thank you message
  - Book again → Search flow
  - Download receipt → PDF generation
- **Follow-up**: Automated email with receipt and feedback request

---

### 1.5 Login & Authentication Flow

**Flow Purpose**: Secure user authentication with multiple entry points
**Entry Points**: App launch, session timeout, protected actions
**Success Criteria**: Authenticated user session with appropriate access level

#### Flow Steps:

**Screen 1: Login Entry**
- **Layout**: Clean, focused login form
- **Elements**:
  - App logo (top center)
  - Header: "Welcome back"
  - Login form:
    - Email/username input
    - Password input (with show/hide toggle)
    - "Remember me" checkbox
    - "Forgot password?" link
  - Primary CTA: "Sign In"
  - Social login options:
    - "Continue with Google"
    - "Continue with Apple"
  - "Don't have an account? Sign up" link
- **Actions**:
  - Valid credentials → Main app
  - Social login → Platform auth flow
  - Forgot password → Password reset
  - Sign up → Registration flow
- **Error States**: Invalid credentials, account locked, network errors

**Screen 2: Biometric Authentication** (if enabled)
- **Layout**: Biometric prompt overlay
- **Elements**:
  - Biometric icon (fingerprint/face)
  - Header: "Use [Touch ID/Face ID]"
  - Subtitle: "Sign in to [AppName]"
  - Fallback option: "Use password instead"
  - Cancel option
- **Actions**:
  - Successful biometric → Main app
  - Failed biometric → Retry or fallback
  - Fallback → Password entry
- **Platform Integration**: Native biometric APIs

**Screen 3: Two-Factor Authentication** (if enabled)
- **Layout**: Single-purpose verification screen
- **Elements**:
  - Header: "Enter verification code"
  - Subtitle: "We sent a code to [masked email/phone]"
  - 6-digit code input (large, spaced)
  - Resend code option (with timer)
  - "Didn't receive it?" help link
  - "Try another way" option
  - Primary CTA: "Verify"
- **Actions**:
  - Valid code → Main app
  - Invalid code → Error with retry
  - Resend → New code sent
  - Alternative method → Backup options
- **Auto-behaviors**: Auto-submit when 6 digits entered

**Screen 4: Password Reset Request**
- **Layout**: Simple form with clear instructions
- **Elements**:
  - Header: "Reset your password"
  - Subtitle: "Enter your email address and we'll send you a reset link"
  - Email input field
  - Primary CTA: "Send Reset Link"
  - "Back to Sign In" link
- **Actions**:
  - Valid email → Reset sent confirmation
  - Invalid email → Error message
  - Back → Login screen
- **Validation**: Email format and account existence check

**Screen 5: Reset Link Sent**
- **Layout**: Confirmation screen with next steps
- **Elements**:
  - Success icon
  - Header: "Check your email"
  - Message: "We sent a password reset link to [email]"
  - Instructions: "Click the link in the email to reset your password"
  - "Didn't receive it?" section:
    - Check spam folder reminder
    - Resend link option
    - Contact support link
  - "Back to Sign In" button
- **Actions**:
  - Resend link → New email sent
  - Contact support → Support flow
  - Back to sign in → Login screen

**Screen 6: New Password Creation** (from email link)
- **Layout**: Secure password form
- **Elements**:
  - Header: "Create new password"
  - Password requirements list:
    - 8+ characters
    - One uppercase letter
    - One lowercase letter
    - One number
    - One special character
  - New password input (with strength indicator)
  - Confirm password input
  - Password visibility toggles
  - Primary CTA: "Update Password"
- **Actions**:
  - Valid password → Success confirmation
  - Password mismatch → Error message
- **Validation**: Real-time password strength checking

**Screen 7: Password Reset Success**
- **Layout**: Success confirmation
- **Elements**:
  - Success animation
  - Header: "Password updated!"
  - Message: "Your password has been successfully changed"
  - Security note: "You're now signed in on this device"
  - Primary CTA: "Continue to App"
- **Actions**: Continue → Main app dashboard
- **Auto-behaviors**: User automatically signed in

---

## 2. Wireframe Structures & Component Specifications

### 2.1 Screen Layout Patterns

**Mobile Layout Grid**:
- Container width: 100% viewport
- Horizontal padding: 16px (default), 24px (forms)
- Vertical spacing: 8px, 16px, 24px, 32px intervals
- Safe area considerations for notched devices
- Bottom navigation space: 80px

**Typography Scale**:
- H1 (Titles): 28px, Bold
- H2 (Section headers): 24px, Semi-bold
- H3 (Card titles): 20px, Semi-bold
- Body Large: 16px, Regular
- Body: 14px, Regular
- Caption: 12px, Regular
- Button text: 16px, Semi-bold

**Color System**:
- Primary: App brand color (CTAs, links)
- Secondary: Supporting brand color
- Success: Green (#28A745)
- Warning: Orange (#FFC107)
- Error: Red (#DC3545)
- Gray scale: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- Background: White (#FFFFFF)
- Surface: Light gray (#F8F9FA)

### 2.2 Component Library

**Button Specifications**:
```
Primary Button:
- Height: 48px
- Border radius: 8px
- Padding: 12px 24px
- Background: Primary color
- Text: White, 16px, Semi-bold
- States: Default, Pressed, Disabled

Secondary Button:
- Height: 48px
- Border: 2px solid Primary
- Background: Transparent
- Text: Primary color
- States: Default, Pressed, Disabled

Text Button:
- Height: 44px
- Background: Transparent
- Text: Primary color, 16px
- Padding: 12px 16px
```

**Input Field Specifications**:
```
Text Input:
- Height: 48px
- Border: 1px solid Gray-300
- Border radius: 8px
- Padding: 12px 16px
- Font: 16px Regular
- Placeholder: Gray-500
- Focus state: Primary border, shadow
- Error state: Red border, error text below

Search Input:
- Height: 44px
- Border radius: 22px
- Leading icon: Search (16px)
- Placeholder: "Search..."
- Background: Gray-100
```

**Card Specifications**:
```
Standard Card:
- Border radius: 12px
- Shadow: 0 2px 8px rgba(0,0,0,0.1)
- Padding: 16px
- Background: White
- Border: None

Vehicle Card:
- Image: 16:9 aspect ratio
- Content padding: 12px
- Price: Bold, right-aligned
- Rating: Stars + number
- Distance: Caption text
```

### 2.3 Navigation Patterns

**Tab Bar Navigation** (Bottom):
```
Tabs: Explore, Trips, Messages, Account
Height: 80px (including safe area)
Icons: 24x24px
Labels: 12px
Active state: Primary color
Badge indicators: Red dot for notifications
```

**Header Navigation**:
```
Height: 56px + status bar
Back button: 24x24px, left-aligned
Title: 20px Semi-bold, center
Action buttons: 24x24px, right-aligned
Background: White with bottom border
```

### 2.4 Error States & Empty States

**Error State Patterns**:
```
Network Error:
- Icon: Wifi slash (48px)
- Title: "Connection problem"
- Message: "Check your internet connection"
- CTA: "Try again"

No Results:
- Icon: Search (48px)
- Title: "No cars found"
- Message: "Try adjusting your filters"
- CTA: "Clear filters"

Permission Error:
- Icon: Location slash (48px)
- Title: "Location access needed"
- Message: "Enable location to find nearby cars"
- CTA: "Enable location"
```

**Loading States**:
```
Screen Loading:
- Skeleton screens matching content structure
- Shimmer animation
- No progress indicators unless process >3 seconds

Button Loading:
- Spinner (16px) replaces text
- Button remains same size
- Disabled state styling
```

---

## 3. Mockup Creation Strategy

### 3.1 Priority Order for Mockup Creation

**Phase 1: Core MVP Screens** (Week 1)
1. Welcome/Onboarding (Guest registration Screen 1)
2. Account Type Selection (Guest registration Screen 2)
3. Basic Information Form (Guest registration Screen 3)
4. Search Input (Vehicle search Screen 1)
5. Search Results (Vehicle search Screen 2)
6. Vehicle Detail (Vehicle search Screen 3)
7. Booking Confirmation (Booking Screen 1)
8. Login Screen (Authentication Screen 1)

**Phase 2: Essential User Journey** (Week 2)
9. Phone Verification (Guest registration Screen 4)
10. Payment Method Setup (Guest registration Screen 6)
11. Registration Success (Guest registration Screen 7)
12. Booking Details (Booking Screen 2)
13. Payment Method Selection (Booking Screen 3)
14. Booking Confirmation (Booking Screen 4)
15. Trip Dashboard (Booking Screen 7)

**Phase 3: Enhanced Features** (Week 3)
16. Filters & Sorting (Vehicle search Screen 4)
17. Host Registration Overview (Host Screen 1)
18. Vehicle Information (Host Screen 3)
19. Vehicle Photos (Host Screen 5)
20. Pickup Instructions (Booking Screen 5)
21. Vehicle Inspection (Booking Screen 6)
22. Password Reset Flow (Authentication Screens 4-7)

### 3.2 Flutter/Mobile UI Patterns

**Material Design Integration**:
- Use Material 3 components where applicable
- Custom branded components for unique features
- Consistent elevation and shadow system
- Gesture-based interactions (swipe, pull-to-refresh)

**iOS Design Considerations**:
- Cupertino widgets for iOS-specific patterns
- Native navigation feel
- Platform-appropriate haptic feedback
- iOS-style modal presentations

**Responsive Design**:
- Layouts adapt to different screen sizes
- Text scaling for accessibility
- Safe area handling for different device types
- Landscape orientation support where appropriate

### 3.3 Interactive Prototype Structure

**Prototype Flows**:
1. **Happy Path Demo**: Complete user journey from registration to completed trip
2. **Error Handling Demo**: Common error scenarios and recovery
3. **Feature Deep Dive**: Advanced features like filters, host registration
4. **Accessibility Demo**: Screen reader and large text support

**Transition Specifications**:
```
Screen Transitions:
- Push/Pop: 300ms ease-in-out
- Modal presentation: 400ms ease-out
- Tab switching: 200ms ease-in-out
- Loading states: Immediate with skeleton

Micro-interactions:
- Button press: Scale 0.95, 100ms
- Card tap: Subtle scale and shadow increase
- Form validation: Shake animation for errors
- Success actions: Checkmark animation
```

### 3.4 Design System Integration

**Component Documentation**:
Each component should include:
- Visual specifications (dimensions, colors, typography)
- Interaction states (default, hover, active, disabled)
- Usage guidelines and best practices
- Code implementation notes for developers
- Accessibility requirements

**Asset Requirements**:
- Vector icons (SVG format)
- Vehicle placeholder images (multiple ratios)
- User avatar placeholders
- Brand logos and marks
- Illustration assets for empty/error states

---

## 4. Technical Specifications for Development

### 4.1 Data Requirements by Screen

**User Registration Screens**:
```dart
// User model for registration
class UserRegistration {
  String firstName;
  String lastName;
  String email;
  String phoneNumber;
  String password;
  bool termsAccepted;
  String userType; // 'guest' or 'host'
  String? verificationCode;
  File? driverLicensePhoto;
  PaymentMethod? paymentMethod;
}
```

**Vehicle Search Screens**:
```dart
// Search criteria model
class SearchCriteria {
  LatLng location;
  DateTime pickupDateTime;
  DateTime returnDateTime;
  double maxDistance;
  PriceRange? priceRange;
  List<VehicleType> vehicleTypes;
  List<String> features;
  bool instantBookOnly;
  double minHostRating;
}

// Vehicle model for display
class Vehicle {
  String id;
  String make;
  String model;
  int year;
  List<String> photoUrls;
  double pricePerHour;
  double pricePerDay;
  LatLng location;
  Host host;
  double rating;
  int reviewCount;
  List<String> features;
  bool instantBookAvailable;
}
```

**Booking Screens**:
```dart
// Booking model
class Booking {
  String id;
  Vehicle vehicle;
  User guest;
  DateTime pickupDateTime;
  DateTime returnDateTime;
  double totalPrice;
  BookingStatus status;
  PaymentMethod paymentMethod;
  List<AdditionalDriver> additionalDrivers;
  String? specialRequests;
  String? emergencyContact;
}
```

### 4.2 API Integration Points

**Authentication APIs**:
- POST /auth/register
- POST /auth/login
- POST /auth/verify-phone
- POST /auth/reset-password
- POST /auth/refresh-token

**Search APIs**:
- GET /vehicles/search
- GET /vehicles/{id}
- GET /vehicles/{id}/availability
- GET /vehicles/{id}/reviews

**Booking APIs**:
- POST /bookings
- GET /bookings/{id}
- PUT /bookings/{id}/status
- POST /bookings/{id}/extend

**User Management APIs**:
- GET /users/profile
- PUT /users/profile
- POST /users/documents
- GET /users/bookings

### 4.3 Validation Rules

**Form Validation**:
```dart
// Email validation
bool isValidEmail(String email) {
  return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
}

// Password strength
class PasswordValidator {
  static bool hasMinLength(String password) => password.length >= 8;
  static bool hasUpperCase(String password) => password.contains(RegExp(r'[A-Z]'));
  static bool hasLowerCase(String password) => password.contains(RegExp(r'[a-z]'));
  static bool hasNumber(String password) => password.contains(RegExp(r'[0-9]'));
  static bool hasSpecialChar(String password) => password.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'));
}

// Phone number validation
bool isValidPhoneNumber(String phone) {
  return RegExp(r'^\+?[1-9]\d{1,14}$').hasMatch(phone);
}
```

### 4.4 State Management Structure

**BLoC Pattern Implementation**:
```dart
// Authentication BLoC
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc() : super(AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
    on<RegisterRequested>(_onRegisterRequested);
    on<LogoutRequested>(_onLogoutRequested);
    on<VerifyPhoneRequested>(_onVerifyPhoneRequested);
  }
}

// Search BLoC
class SearchBloc extends Bloc<SearchEvent, SearchState> {
  SearchBloc() : super(SearchInitial()) {
    on<SearchVehicles>(_onSearchVehicles);
    on<UpdateFilters>(_onUpdateFilters);
    on<LoadVehicleDetails>(_onLoadVehicleDetails);
  }
}

// Booking BLoC
class BookingBloc extends Bloc<BookingEvent, BookingState> {
  BookingBloc() : super(BookingInitial()) {
    on<CreateBooking>(_onCreateBooking);
    on<UpdateBookingDetails>(_onUpdateBookingDetails);
    on<ProcessPayment>(_onProcessPayment);
  }
}
```

---

## 5. Success Metrics & Testing Strategy

### 5.1 UX Success Metrics

**Registration Flow**:
- Registration completion rate: >85%
- Time to complete registration: <5 minutes
- Phone verification success rate: >95%
- Payment method setup rate: >80%

**Search & Discovery**:
- Search-to-view rate: >60%
- View-to-book rate: >25%
- Filter usage rate: >40%
- Search refinement rate: <30%

**Booking Flow**:
- Booking completion rate: >90%
- Payment success rate: >98%
- Booking confirmation time: <2 minutes
- Cancellation rate: <15%

### 5.2 Usability Testing Plan

**Testing Phases**:

**Phase 1: Concept Testing** (Week 1)
- Participants: 8 potential users (4 guests, 4 hosts)
- Method: Moderated interviews with mockups
- Focus: Information architecture, user flows, concept validation
- Duration: 45 minutes per session

**Phase 2: Prototype Testing** (Week 3)
- Participants: 12 users (mix of guest/host, experience levels)
- Method: Moderated usability testing with interactive prototype
- Focus: Task completion, error recovery, satisfaction
- Duration: 60 minutes per session

**Phase 3: Beta Testing** (Week 6)
- Participants: 50 beta users
- Method: Unmoderated testing with real app
- Focus: Real-world usage, performance, edge cases
- Duration: 2 weeks of usage

**Testing Scenarios**:
1. **New User Registration**: Complete account setup as guest
2. **Vehicle Search**: Find car for weekend trip in specific area
3. **Booking Process**: Reserve vehicle and complete payment
4. **Host Onboarding**: Set up host account with vehicle listing
5. **Trip Management**: Handle pickup, active trip, and return

### 5.3 A/B Testing Opportunities

**Registration Optimization**:
- Test A: Single-page registration vs. multi-step
- Test B: Social login prominence
- Test C: Payment method timing (during vs. after registration)

**Search Experience**:
- Test A: Map view vs. list view default
- Test B: Filter placement (drawer vs. overlay)
- Test C: Pricing display format

**Booking Conversion**:
- Test A: Booking form length (single vs. multi-page)
- Test B: Payment method order
- Test C: Trust signals placement

---

This comprehensive specification provides the foundation for creating detailed mockups and prototypes for the carsharing app. Each flow is designed with mobile-first principles, considers edge cases and error states, and includes technical specifications for implementation.

The modular structure allows for iterative development and testing, ensuring that user feedback can be incorporated efficiently during the 6-day sprint cycles.