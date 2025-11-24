/**
 * Spacing System
 * Consistent spacing scale for margins, padding, and gaps
 */

// Base spacing unit (4px)
const BASE_UNIT = 4;

// Spacing scale following 4px grid
export const spacing = {
  // Micro spacing
  '0': 0,
  '0.5': BASE_UNIT * 0.5,  // 2px
  '1': BASE_UNIT,           // 4px
  '1.5': BASE_UNIT * 1.5,  // 6px
  '2': BASE_UNIT * 2,      // 8px
  '2.5': BASE_UNIT * 2.5,  // 10px
  '3': BASE_UNIT * 3,      // 12px
  '3.5': BASE_UNIT * 3.5,  // 14px
  '4': BASE_UNIT * 4,      // 16px
  '5': BASE_UNIT * 5,      // 20px
  '6': BASE_UNIT * 6,      // 24px
  '7': BASE_UNIT * 7,      // 28px
  '8': BASE_UNIT * 8,      // 32px
  '9': BASE_UNIT * 9,      // 36px
  '10': BASE_UNIT * 10,    // 40px
  '11': BASE_UNIT * 11,    // 44px
  '12': BASE_UNIT * 12,    // 48px
  '14': BASE_UNIT * 14,    // 56px
  '16': BASE_UNIT * 16,    // 64px
  '20': BASE_UNIT * 20,    // 80px
  '24': BASE_UNIT * 24,    // 96px
  '28': BASE_UNIT * 28,    // 112px
  '32': BASE_UNIT * 32,    // 128px
} as const;

// Semantic spacing aliases
export const semanticSpacing = {
  // Component internal spacing
  componentPaddingXs: spacing['2'],   // 8px
  componentPaddingSm: spacing['3'],   // 12px
  componentPaddingMd: spacing['4'],   // 16px
  componentPaddingLg: spacing['6'],   // 24px
  componentPaddingXl: spacing['8'],   // 32px

  // Section spacing
  sectionGapSm: spacing['4'],         // 16px
  sectionGapMd: spacing['6'],         // 24px
  sectionGapLg: spacing['8'],         // 32px
  sectionGapXl: spacing['12'],        // 48px

  // Screen padding (safe areas)
  screenPaddingX: spacing['4'],       // 16px horizontal
  screenPaddingY: spacing['6'],       // 24px vertical
  screenPaddingTop: spacing['12'],    // 48px from top (with status bar)
  screenPaddingBottom: spacing['8'],  // 32px from bottom

  // List spacing
  listItemGap: spacing['3'],          // 12px between list items
  listSectionGap: spacing['6'],       // 24px between list sections

  // Form spacing
  formFieldGap: spacing['4'],         // 16px between form fields
  formLabelGap: spacing['2'],         // 8px between label and input
  formHelperGap: spacing['1'],        // 4px between input and helper text

  // Card spacing
  cardPadding: spacing['4'],          // 16px card internal padding
  cardGap: spacing['4'],              // 16px between cards

  // Button spacing
  buttonPaddingX: spacing['6'],       // 24px horizontal
  buttonPaddingY: spacing['3'],       // 12px vertical
  buttonGap: spacing['3'],            // 12px between buttons

  // Icon spacing
  iconGap: spacing['2'],              // 8px gap around icons
  iconTextGap: spacing['2'],          // 8px between icon and text

  // Touch target minimum (44px for accessibility)
  touchTarget: spacing['11'],         // 44px
} as const;

// Border radius scale
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// Border width scale
export const borderWidth = {
  none: 0,
  hairline: 0.5,
  thin: 1,
  medium: 2,
  thick: 4,
} as const;

export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;
