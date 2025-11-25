import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, shadows } from '../styles/theme';

interface StatsCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  highlight?: boolean;
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  subtitle,
  highlight = false,
  color = colors.primary,
}) => {
  return (
    <View style={[styles.card, highlight && styles.cardHighlight]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: highlight ? color : colors.text }]}>
        {value}
      </Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {highlight && <View style={[styles.highlightBar, { backgroundColor: color }]} />}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    flex: 1,
    marginHorizontal: spacing.xs,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.md,
  },
  cardHighlight: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
  },
  highlightBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  label: {
    ...typography.small,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '800',
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
