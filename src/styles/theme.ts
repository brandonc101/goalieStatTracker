import { StyleSheet } from 'react-native';

// Bold, ice rink-inspired color palette
export const colors = {
  // Primary - Ice blues and dark backgrounds
  background: '#0a0e1a',
  surface: '#141b2d',
  surfaceLight: '#1e2940',
  
  // Accent - Electric blue and sharp highlights
  primary: '#00d9ff',
  primaryDark: '#0099cc',
  secondary: '#ff4757',
  accent: '#ffd700',
  
  // Status colors
  win: '#00ff88',
  loss: '#ff4757',
  ot: '#ffaa00',
  
  // Text
  text: '#ffffff',
  textSecondary: '#8b95a8',
  textMuted: '#5a6478',
  
  // Borders and dividers
  border: '#2a3447',
  borderLight: '#3a4557',
  
  // Overlays
  overlay: 'rgba(10, 14, 26, 0.9)',
  overlayLight: 'rgba(20, 27, 45, 0.8)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 8,
  },
  glow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.md,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    color: colors.text,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: colors.primary,
    ...shadows.glow,
  },
});
