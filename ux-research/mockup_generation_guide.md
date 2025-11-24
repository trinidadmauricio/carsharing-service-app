# Mockup Generation Guide for Carsharing App

## Overview
This guide provides detailed specifications for generating visual mockups from the UX flows. Each section includes exact dimensions, positioning, colors, and content specifications for rapid mockup creation.

---

## 1. Screen Templates & Layout Grid

### 1.1 Mobile Device Specifications
**Target Device**: iPhone 14 Pro (393 × 852 pt)
**Safe Areas**:
- Top: 59pt (status bar + notch)
- Bottom: 34pt (home indicator)
- Content area: 393 × 759pt

**Android Considerations**:
- Target: Pixel 7 (412 × 915 dp)
- Status bar: 24dp
- Navigation bar: 48dp
- Content area: 412 × 843dp

### 1.2 Layout Grid System
```
Container Margins: 16pt left/right
Column Grid: 8-column grid with 16pt gutters
Baseline Grid: 4pt increments
Component Spacing: 8pt, 16pt, 24pt, 32pt

Breakpoints:
- Mobile: 320-414pt width
- Tablet: 768pt+ width (future consideration)
```

### 1.3 Screen Template Structure
```
┌─────────────────────────────────┐
│ Status Bar (59pt)               │ ← System UI
├─────────────────────────────────┤
│ Header (56pt)                   │ ← Navigation
├─────────────────────────────────┤
│                                 │
│ Content Area (647pt)            │ ← Main content
│                                 │
├─────────────────────────────────┤
│ Bottom Navigation (56pt)        │ ← Tab bar
├─────────────────────────────────┤
│ Safe Area (34pt)                │ ← Home indicator
└─────────────────────────────────┘
```

---

## 2. Detailed Screen Mockup Specifications

### 2.1 Guest Registration - Screen 1: Welcome/Onboarding

**Layout Specifications**:
```
Background: Linear gradient from #667eea to #764ba2
Status Bar: Light content
Header: None (full-screen)

Content Stack (top to bottom):
1. Logo Area (0-120pt from top)
   - App logo: 64×64pt, center-aligned
   - Y position: 80pt from top

2. Hero Image Area (120-480pt)
   - Image: 361×360pt (full width - 32pt margins)
   - Content: Happy people with cars, bright lighting
   - Overlay: Semi-transparent dark overlay (20% black)

3. Text Content (480-680pt)
   - Headline: "Your next ride is just a tap away"
     - Font: SF Pro Display, 32pt, Bold, White
     - Line height: 38pt
     - Margins: 24pt left/right
   - Subtitle: "Rent nearby cars by the hour or day"
     - Font: SF Pro Text, 18pt, Regular, White (80% opacity)
     - Line height: 24pt
     - Margins: 24pt left/right
     - Top margin: 16pt from headline

4. CTA Section (680-810pt)
   - Primary Button: "Get Started"
     - Size: 345×48pt (full width - 48pt margins)
     - Background: White
     - Text: #667eea, 16pt, Semibold
     - Border radius: 8pt
     - Y position: 700pt from top
   - Secondary Link: "Already have account? Sign In"
     - Font: SF Pro Text, 14pt, Regular, White
     - Y position: 764pt from top
     - Center aligned
```

**Asset Requirements**:
- Hero image: 720×720px (2x resolution)
- App logo: 128×128px (2x resolution)
- Background gradient: CSS gradient or image overlay

### 2.2 Guest Registration - Screen 2: Account Type Selection

**Layout Specifications**:
```
Background: #F8F9FA
Status Bar: Dark content
Header: 56pt height
Navigation: Back button (24×24pt), title "Join [AppName]"

Content:
1. Header Section (56-140pt)
   - Title: "How do you want to use [AppName]?"
     - Font: SF Pro Display, 24pt, Bold, #1a1a1a
     - Margins: 24pt left/right
     - Y position: 88pt from top

2. Card Container (140-740pt)
   - Container: 345×600pt, 24pt margins

   Card 1 - Guest (140-370pt):
   - Background: White
   - Size: 345×230pt
   - Border radius: 12pt
   - Shadow: 0 2px 8px rgba(0,0,0,0.1)
   - Content:
     - Icon: Car icon, 48×48pt, #667eea
     - Title: "Rent Cars"
       - Font: SF Pro Display, 20pt, Semibold, #1a1a1a
       - Y offset: 68pt from card top
     - Benefits list:
       • "Find cars near you"
       • "Book instantly"
       • "Drive away in minutes"
       - Font: SF Pro Text, 14pt, Regular, #6c757d
       - Line spacing: 20pt between items
       - Y offset: 104pt from card top

   Card 2 - Host (390-620pt):
   - Same styling as Card 1
   - Icon: Dollar sign, 48×48pt, #28a745
   - Title: "Share My Car"
   - Benefits:
     • "Earn money from your car"
     • "Insurance included"
     • "Set your own schedule"
```

**Interactive States**:
```
Card Hover/Press:
- Scale: 0.98
- Shadow: 0 4px 16px rgba(0,0,0,0.15)
- Duration: 150ms ease-out

Card Selection:
- Border: 2pt solid #667eea
- Background: #f8f9ff
```

### 2.3 Vehicle Search - Screen 1: Search Input

**Layout Specifications**:
```
Background: #FFFFFF
Status Bar: Dark content
Header: Custom search header (80pt height)

Header Content:
1. Location Bar (8-48pt within header)
   - Background: #F8F9FA
   - Border radius: 8pt
   - Size: 345×40pt
   - Margins: 24pt left/right
   - Content: "Current location" with location icon
   - Font: SF Pro Text, 16pt, Regular, #495057

2. Search Button (52-76pt within header)
   - Size: 345×24pt
   - Text: "When do you need a car?"
   - Font: SF Pro Text, 14pt, Regular, #6c757d
   - Alignment: Left, 24pt margin

Map Section (80-600pt):
- Background: Map tiles
- Car markers: 24×24pt icons with pricing callouts
- Current location: Blue dot with accuracy circle
- Zoom controls: +/- buttons, top right

DateTime Picker Overlay (600-852pt):
- Background: White with top border radius 16pt
- Shadow: 0 -2px 16px rgba(0,0,0,0.1)
- Handle: 32×4pt rounded rectangle, center top

DateTime Content:
1. Pickup Section (620-720pt)
   - Label: "Pickup"
   - Date picker: Horizontal scroll of dates
   - Time picker: Dropdown, default "Now"

2. Return Section (720-780pt)
   - Label: "Return"
   - Date picker: Default +1 day
   - Time picker: Default +2 hours

3. CTA (780-820pt)
   - Button: "Search Cars"
   - Size: 345×40pt
   - Background: #667eea
   - Text: White, 16pt, Semibold
```

**Map Marker Specifications**:
```
Car Marker:
- Background: White circle, 32×32pt
- Border: 2pt solid #667eea
- Car icon: 16×16pt, centered
- Price callout: White bubble with price
- Shadow: 0 2px 4px rgba(0,0,0,0.2)

Selected Marker:
- Background: #667eea
- Car icon: White
- Scale: 1.2
```

### 2.4 Vehicle Search - Screen 2: Search Results List

**Layout Specifications**:
```
Background: #F8F9FA
Status Bar: Dark content
Header: 56pt with search summary and filters

Header Content:
- Back button: 24×24pt, left aligned
- Search summary: "12 cars near you"
  - Font: SF Pro Display, 18pt, Semibold, #1a1a1a
- Filter button: "Filters" with count badge
  - Font: SF Pro Text, 14pt, Medium, #667eea
  - Badge: Red dot if filters active

Results List (56-852pt):
- Scroll container with car cards
- Card spacing: 16pt between cards
- Margins: 16pt left/right

Car Card Specifications (height: 280pt each):
1. Image Section (0-180pt)
   - Image: 361×180pt (full width)
   - Border radius: 12pt top only
   - Heart icon: 24×24pt, top right, 12pt margins
   - Price overlay: Bottom right corner
     - Background: rgba(0,0,0,0.7)
     - Text: "$45/day" in white, 14pt Bold
     - Padding: 8pt×12pt
     - Border radius: 8pt

2. Content Section (180-280pt)
   - Background: White
   - Border radius: 12pt bottom only
   - Padding: 16pt all sides

   Content Layout:
   - Title: "2021 Honda Civic"
     - Font: SF Pro Display, 16pt, Semibold, #1a1a1a
   - Location: "0.8 mi away • Downtown"
     - Font: SF Pro Text, 14pt, Regular, #6c757d
     - Top margin: 4pt
   - Features: "Automatic • GPS • Bluetooth"
     - Font: SF Pro Text, 12pt, Regular, #6c757d
     - Top margin: 8pt
   - Rating Section: 5 stars + "(23 reviews)"
     - Stars: 12×12pt, #ffc107
     - Text: SF Pro Text, 12pt, Regular, #6c757d
     - Top margin: 8pt
   - Instant Book badge: If available
     - Background: #e7f3ff
     - Text: "Instant Book" in #0066cc
     - Padding: 4pt×8pt
     - Border radius: 4pt
```

**Loading State**:
```
Skeleton Cards:
- Image area: Gray rectangle with shimmer
- Text lines: Gray rectangles of varying widths
- Animation: Left-to-right shimmer, 1.5s duration
```

### 2.5 Vehicle Detail - Screen 3: Vehicle Detail View

**Layout Specifications**:
```
Background: White
Status Bar: Light content (over image)
Header: Transparent overlay with back/share buttons

Image Gallery (0-300pt):
- Full-width image carousel
- Height: 300pt
- Page indicators: Dots at bottom, 16pt margin
- Navigation: Left/right swipe
- Buttons overlay:
  - Back: 44×44pt circle, top left, 16pt margins
  - Share: 44×44pt circle, top right, 16pt margins
  - Heart: 44×44pt circle, top right, 68pt from right
  - Background: rgba(0,0,0,0.5)
  - Icons: 24×24pt, white

Content Scroll (300-852pt):
- Background: White
- Border radius: 16pt top corners
- Overlap image by 16pt (starts at 284pt)

Content Sections:
1. Header Info (300-380pt)
   - Title: "2021 Honda Civic EX"
     - Font: SF Pro Display, 24pt, Bold, #1a1a1a
     - Margins: 24pt left/right
   - Subtitle: "Automatic • 4 seats • Sedan"
     - Font: SF Pro Text, 16pt, Regular, #6c757d
     - Top margin: 8pt
   - Rating: Stars + reviews count
     - Y position: 348pt

2. Host Info (380-460pt)
   - Host avatar: 40×40pt circle, left aligned
   - Host name: "Sarah M." next to avatar
   - Response time: "Usually responds in 10 min"
   - "View Profile" link: Right aligned

3. Features Grid (460-540pt)
   - 2-column grid of features
   - Icon + text pairs
   - Examples: GPS, Bluetooth, Backup Camera, etc.

4. Location Section (540-620pt)
   - Small map preview: 345×80pt
   - Address text below map
   - "Get Directions" button

5. Description (620-720pt)
   - "About this car" heading
   - Host-written description text
   - "Show more" link if text is long

6. Reviews Preview (720-820pt)
   - "Reviews (23)" heading
   - Latest 2 reviews with avatars
   - "See all reviews" link

Bottom CTA Bar (820-852pt):
- Background: White with top border
- Price: "$45/day" - left aligned, bold
- "Book Now" button: Right aligned, 120×40pt
```

**Photo Gallery Specifications**:
```
Image Requirements:
- Resolution: 750×563px (4:3 ratio, 2x)
- Compression: 80% JPEG quality
- Lazy loading: Load adjacent images
- Zoom: Pinch to zoom enabled
- Fallback: Gray placeholder with car icon

Navigation Dots:
- Size: 8×8pt circles
- Active: #667eea, full opacity
- Inactive: White, 50% opacity
- Spacing: 12pt between dots
```

### 2.6 Booking Flow - Screen 1: Booking Details Confirmation

**Layout Specifications**:
```
Background: #F8F9FA
Status Bar: Dark content
Header: "Review booking" with back button

Content Scroll (56-852pt):
1. Vehicle Summary Card (72-200pt)
   - Background: White
   - Border radius: 12pt
   - Margins: 16pt left/right
   - Shadow: 0 2px 8px rgba(0,0,0,0.1)

   Card Content:
   - Vehicle image: 80×60pt, left aligned, 16pt margin
   - Vehicle info: Right of image
     - Name: "2021 Honda Civic"
     - Host: "with Sarah M."
     - Rating: 4.8 stars
   - Location: Below vehicle info
     - Address with map pin icon

2. Trip Details Section (216-350pt)
   - Background: White
   - Section title: "Trip details"
   - Pickup row: Date, time, "Edit" button
   - Return row: Date, time, "Edit" button
   - Duration: "2 days" (calculated)

3. Pricing Breakdown (366-500pt)
   - Background: White
   - Section title: "Price breakdown"
   - Line items:
     - "$45 × 2 days = $90"
     - "Service fee = $8"
     - "Taxes = $7"
   - Divider line
   - Total: "$105" (bold, larger font)

4. Special Requests (516-600pt)
   - Background: White
   - Text area: "Any special requests?"
   - Placeholder: "Let your host know..."
   - Character limit: 500 chars

5. Bottom CTA (764-852pt)
   - Sticky bottom section
   - Background: White with top border
   - Total reminder: "$105 total"
   - "Continue to Payment" button
```

**Edit DateTime Modal**:
```
Modal Background: rgba(0,0,0,0.5)
Modal Card: Center screen, 345×400pt
Border radius: 16pt
Background: White

Content:
- Title: "Edit pickup time"
- Date picker: Native iOS/Android style
- Time picker: Scrollable hours/minutes
- "Cancel" and "Save" buttons
```

---

## 3. Component Library Mockup Specifications

### 3.1 Button Components

**Primary Button**:
```
Default State:
- Background: Linear gradient #667eea to #764ba2
- Text: White, SF Pro Text, 16pt, Semibold
- Height: 48pt
- Border radius: 8pt
- Padding: 0 24pt
- Shadow: 0 2px 4px rgba(102,126,234,0.3)

Pressed State:
- Background: Solid #5a6fd8
- Shadow: 0 1px 2px rgba(102,126,234,0.3)
- Scale: 0.98

Disabled State:
- Background: #e9ecef
- Text: #6c757d
- Shadow: None
```

**Secondary Button**:
```
Default State:
- Background: Transparent
- Border: 2pt solid #667eea
- Text: #667eea, SF Pro Text, 16pt, Semibold
- Height: 48pt
- Border radius: 8pt

Pressed State:
- Background: #f8f9ff
- Border: 2pt solid #5a6fd8
```

### 3.2 Input Field Components

**Text Input**:
```
Default State:
- Background: White
- Border: 1pt solid #ced4da
- Height: 48pt
- Border radius: 8pt
- Padding: 14pt 16pt
- Font: SF Pro Text, 16pt, Regular
- Placeholder: #6c757d

Focused State:
- Border: 2pt solid #667eea
- Shadow: 0 0 0 3pt rgba(102,126,234,0.1)

Error State:
- Border: 2pt solid #dc3545
- Background: #fff5f5
- Error text: Below input, #dc3545, 12pt
```

**Search Input**:
```
Default State:
- Background: #f8f9fa
- Border: None
- Height: 44pt
- Border radius: 22pt
- Padding: 12pt 16pt 12pt 44pt
- Font: SF Pro Text, 16pt, Regular
- Search icon: 20×20pt, left aligned, 12pt margin
```

### 3.3 Card Components

**Vehicle Card** (for lists):
```
Container:
- Background: White
- Border radius: 12pt
- Shadow: 0 2px 8px rgba(0,0,0,0.1)
- Size: 345×280pt

Image Section:
- Height: 180pt
- Border radius: 12pt top only
- Overlay: Heart icon (top right) and price badge (bottom right)

Content Section:
- Padding: 16pt
- Height: 100pt
- Vehicle name: 16pt Semibold
- Distance/location: 14pt Regular, gray
- Features: 12pt Regular, gray
- Rating: Stars + count, 12pt
```

**Info Card** (for details):
```
Container:
- Background: White
- Border radius: 12pt
- Padding: 20pt
- Margins: 16pt left/right
- Shadow: 0 2px 8px rgba(0,0,0,0.1)

Content:
- Title: 18pt Semibold
- Body text: 14pt Regular
- Spacing: 12pt between elements
```

### 3.4 Navigation Components

**Tab Bar**:
```
Container:
- Background: White
- Height: 80pt (includes safe area)
- Top border: 1pt solid #e9ecef
- Content height: 56pt

Tab Items (4 total):
- Width: 98pt each (393pt ÷ 4)
- Height: 56pt
- Icon: 24×24pt, center aligned
- Label: 10pt, center aligned, 4pt below icon

Active State:
- Icon: #667eea
- Label: #667eea, Semibold

Inactive State:
- Icon: #6c757d
- Label: #6c757d, Regular

Badge (for notifications):
- Size: 6×6pt circle
- Background: #dc3545
- Position: Top right of icon
```

**Header Navigation**:
```
Container:
- Background: White
- Height: 56pt + status bar
- Bottom border: 1pt solid #e9ecef

Content (within 56pt section):
- Back button: 44×44pt touch target, 24×24pt icon
- Title: Center aligned, 18pt Semibold
- Action button: Right aligned, 44×44pt touch target
```

---

## 4. Asset Generation Requirements

### 4.1 Icon Library

**System Icons** (24×24pt base size):
```
Navigation:
- arrow-left (back)
- x (close)
- more-horizontal (menu)
- share
- heart (save)

Search & Filters:
- search
- filter
- map-pin
- calendar
- clock

Vehicle Related:
- car
- key
- fuel
- transmission-auto
- bluetooth
- navigation

User & Account:
- user
- user-plus
- message-circle
- phone
- camera
- check-circle

Actions:
- plus
- edit
- trash
- refresh
- download
```

**Brand Icons**:
```
Social Login:
- google-logo: 20×20pt
- apple-logo: 20×20pt
- facebook-logo: 20×20pt

Payment:
- visa-logo: 32×20pt
- mastercard-logo: 32×20pt
- amex-logo: 32×20pt
- paypal-logo: 32×20pt
```

### 4.2 Image Placeholders

**Vehicle Images**:
```
Hero Images: 750×563px (4:3 ratio)
Card Images: 690×360px (16:9 ratio)
Thumbnail Images: 160×120px (4:3 ratio)

Content: Variety of car types
- Compact cars (Honda Civic, Toyota Corolla)
- SUVs (Honda CR-V, Toyota RAV4)
- Luxury (BMW 3 Series, Mercedes C-Class)
- Trucks (Ford F-150, Chevy Silverado)

Lighting: Bright, outdoor lighting preferred
Angles: 3/4 front view, side profile
Background: Clean, minimal backgrounds
```

**User Avatars**:
```
Size: 80×80px (2x for 40pt display)
Style: Diverse representation
Format: Circular crops
Backup: Initials on colored background
```

**Illustration Assets**:
```
Empty States:
- No search results: Magnifying glass with car
- No saved cars: Heart with car outline
- Network error: WiFi symbol with warning

Success States:
- Registration complete: Checkmark with confetti
- Booking confirmed: Calendar with checkmark
- Trip completed: Thumbs up with car

Error States:
- General error: Warning triangle
- Payment failed: Credit card with X
- Location disabled: Location pin with slash
```

### 4.3 Color Palette

**Primary Colors**:
```
Primary Blue: #667eea
Primary Purple: #764ba2
Primary Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

Secondary Colors:
Success Green: #28a745
Warning Orange: #ffc107
Error Red: #dc3545
Info Blue: #17a2b8
```

**Neutral Colors**:
```
Text Colors:
- Primary: #1a1a1a (near black)
- Secondary: #495057 (dark gray)
- Tertiary: #6c757d (medium gray)
- Placeholder: #adb5bd (light gray)

Background Colors:
- White: #ffffff
- Light Gray: #f8f9fa
- Border Gray: #e9ecef
- Disabled Gray: #e9ecef
```

**Status Colors**:
```
Online: #28a745
Away: #ffc107
Offline: #6c757d
Active Trip: #17a2b8
Completed: #28a745
Cancelled: #dc3545
```

---

## 5. Mockup Creation Tools & Workflow

### 5.1 Recommended Tools

**Design Tools**:
1. **Figma** (Primary recommendation)
   - Collaborative design
   - Component system
   - Auto-layout features
   - Prototyping capabilities
   - Developer handoff tools

2. **Sketch** (Alternative)
   - Symbol library
   - Plugin ecosystem
   - Zeplin integration

3. **Adobe XD** (Alternative)
   - Design systems
   - Voice prototyping
   - Auto-animate features

### 5.2 File Organization Structure

**Figma File Structure**:
```
📁 Carsharing App Design System
├── 🎨 Foundation
│   ├── Colors
│   ├── Typography
│   ├── Icons
│   └── Grid System
├── 🧩 Components
│   ├── Buttons
│   ├── Input Fields
│   ├── Cards
│   ├── Navigation
│   └── Modals
├── 📱 Screens
│   ├── 01 Onboarding
│   ├── 02 Authentication
│   ├── 03 Search & Discovery
│   ├── 04 Vehicle Details
│   ├── 05 Booking Flow
│   ├── 06 Trip Management
│   └── 07 Profile & Settings
└── 🔗 Prototypes
    ├── Happy Path Flow
    ├── Error Scenarios
    └── Micro-interactions
```

### 5.3 Design System Setup

**Component Creation Order**:
1. **Foundation Elements**
   - Color styles
   - Text styles
   - Shadow effects
   - Grid layout

2. **Basic Components**
   - Buttons (primary, secondary, text)
   - Input fields (text, search, date)
   - Icons (system, brand)

3. **Complex Components**
   - Navigation bars
   - Cards (vehicle, info, summary)
   - Modals and overlays

4. **Screen Templates**
   - Header layouts
   - Content layouts
   - Bottom navigation

**Auto-Layout Guidelines**:
```
Stack Direction: Vertical (default)
Spacing: 16pt (standard), 24pt (sections)
Padding: 16pt (standard), 24pt (forms)
Alignment: Fill container (responsive)
Constraints: Top-left anchoring
```

### 5.4 Responsive Considerations

**Screen Size Variations**:
```
iPhone SE (375×667pt):
- Reduce font sizes by 1pt
- Tighter spacing (12pt instead of 16pt)
- Smaller button heights (44pt instead of 48pt)

iPhone 14 Pro Max (430×932pt):
- Maintain proportions
- Consider two-column layouts for lists
- Larger tap targets where appropriate

Android Large Screens (>400dp):
- Material Design 3 adaptations
- Bottom sheet behaviors
- Extended FAB usage
```

**Content Scaling**:
```
Typography Scale:
- Small devices: -1pt from base sizes
- Large devices: +0pt (maintain base)
- Accessibility: Support dynamic type up to 200%

Touch Targets:
- Minimum: 44×44pt (iOS), 48×48dp (Android)
- Recommended: 48×48pt for primary actions
- Spacing: 8pt minimum between targets
```

---

## 6. Interactive Prototype Specifications

### 6.1 Animation & Transition Guidelines

**Screen Transitions**:
```
Navigation Push/Pop:
- Duration: 300ms
- Easing: ease-in-out
- Direction: Slide left/right

Modal Presentation:
- Duration: 400ms
- Easing: ease-out
- Animation: Slide up from bottom

Tab Switching:
- Duration: 200ms
- Easing: ease-in-out
- Animation: Crossfade
```

**Micro-interactions**:
```
Button Press:
- Scale: 0.95
- Duration: 100ms
- Easing: ease-in

Loading States:
- Skeleton shimmer: 1.5s loop
- Spinner rotation: 1s linear loop
- Progress bar: Ease-out fill

Success Feedback:
- Checkmark animation: 500ms
- Scale: 0 to 1.2 to 1
- Color: Fade in green
```

### 6.2 Gesture Interactions

**Swipe Gestures**:
```
Photo Gallery:
- Horizontal swipe: Next/previous image
- Threshold: 30% of screen width
- Animation: Slide with resistance

Search Results:
- Vertical scroll: Standard list scrolling
- Pull to refresh: Refresh search results
- Threshold: 60pt pull distance

Card Interactions:
- Swipe right: Save to favorites
- Swipe left: Remove/hide
- Threshold: 50% of card width
```

**Touch Interactions**:
```
Map:
- Pan: Move map view
- Pinch: Zoom in/out
- Tap marker: Show car preview
- Long press: Drop custom pin

Form Fields:
- Tap: Focus and show keyboard
- Tap outside: Dismiss keyboard
- Scroll: Auto-scroll to keep field visible
```

### 6.3 Prototype Flow Connections

**Primary User Journey** (Happy Path):
```
1. Welcome Screen
   ↓ (Tap "Get Started")
2. Account Type Selection
   ↓ (Tap "Rent Cars")
3. Registration Form
   ↓ (Fill & Submit)
4. Phone Verification
   ↓ (Enter Code)
5. Search Screen
   ↓ (Enter Criteria)
6. Search Results
   ↓ (Tap Vehicle)
7. Vehicle Details
   ↓ (Tap "Book Now")
8. Booking Form
   ↓ (Complete Form)
9. Payment
   ↓ (Process Payment)
10. Confirmation
```

**Error Flow Examples**:
```
Invalid Login:
- Trigger: Wrong credentials
- Response: Shake animation + error message
- Recovery: Clear form, focus first field

Network Error:
- Trigger: No internet connection
- Response: Error state with retry button
- Recovery: Retry automatically when connection restored

Payment Failed:
- Trigger: Card declined
- Response: Error modal with suggestions
- Recovery: Try different payment method
```

### 6.4 Prototype Testing Scenarios

**Usability Testing Tasks**:
```
Task 1: New User Registration
- Starting point: App launch
- Goal: Complete account setup
- Success criteria: Reach main search screen
- Time limit: 5 minutes

Task 2: Find and Book Vehicle
- Starting point: Search screen
- Goal: Book car for weekend trip
- Success criteria: Receive booking confirmation
- Time limit: 8 minutes

Task 3: Manage Active Booking
- Starting point: Confirmation screen
- Goal: Contact host and get directions
- Success criteria: Open messaging and maps
- Time limit: 3 minutes
```

**A/B Testing Variations**:
```
Registration Flow:
- Version A: Multi-step with progress indicator
- Version B: Single-page with collapsible sections
- Metric: Completion rate

Search Interface:
- Version A: Map-first with list toggle
- Version B: List-first with map toggle
- Metric: Search-to-booking conversion

Pricing Display:
- Version A: Hourly rates prominent
- Version B: Daily rates prominent
- Metric: Booking value and frequency
```

---

This comprehensive mockup generation guide provides everything needed to create detailed, consistent visual mockups for the carsharing app. Each specification includes exact measurements, colors, typography, and interaction details to ensure accurate implementation across different design tools and team members.

The structured approach allows for efficient mockup creation while maintaining design consistency and user experience quality throughout the rapid development process.