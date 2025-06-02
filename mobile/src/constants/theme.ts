import { DefaultTheme } from 'react-native-paper';

// Color palette for the sobriety app
export const colors = {
  // Primary colors - calming and supportive
  primary: '#4A90E2',
  primaryDark: '#357ABD',
  primaryLight: '#7BB3F0',
  
  // Secondary colors - warm and encouraging
  secondary: '#50C878',
  secondaryDark: '#3A9B5C',
  secondaryLight: '#7DD99B',
  
  // Accent colors
  accent: '#F39C12',
  accentDark: '#E67E22',
  accentLight: '#F7DC6F',
  
  // Status colors
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',
  
  // Crisis colors
  crisis: '#E74C3C',
  crisisLight: '#F1948A',
  
  // Neutral colors
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceDark: '#E9ECEF',
  
  // Text colors
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  textLight: '#BDC3C7',
  textInverse: '#FFFFFF',
  
  // Border colors
  border: '#E1E8ED',
  borderLight: '#F1F3F4',
  
  // Mood colors (1-10 scale)
  mood: {
    1: '#E74C3C', // Very bad
    2: '#EC7063',
    3: '#F1948A',
    4: '#F7DC6F',
    5: '#F4D03F', // Neutral
    6: '#82E0AA',
    7: '#58D68D',
    8: '#2ECC71',
    9: '#27AE60',
    10: '#1E8449' // Excellent
  }
};

// Typography
export const typography = {
  fontFamily: {
    regular: 'sans-serif',
    medium: 'sans-serif',
    bold: 'sans-serif',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 48,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// React Native Paper theme
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    disabled: colors.textLight,
    placeholder: colors.textSecondary,
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: colors.accent,
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: typography.fontFamily.regular,
      fontWeight: 'normal' as const,
    },
    medium: {
      fontFamily: typography.fontFamily.medium,
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: typography.fontFamily.regular,
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: typography.fontFamily.regular,
      fontWeight: '100' as const,
    },
  },
};

// Component styles
export const componentStyles = {
  button: {
    primary: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    secondary: {
      backgroundColor: colors.secondary,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    crisis: {
      backgroundColor: colors.crisis,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
  },
  card: {
    default: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      ...shadows.md,
    },
    elevated: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      ...shadows.lg,
    },
  },
  input: {
    default: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      fontSize: typography.fontSize.md,
      color: colors.text,
    },
    focused: {
      borderColor: colors.primary,
    },
    error: {
      borderColor: colors.error,
    },
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  theme,
  componentStyles,
};

