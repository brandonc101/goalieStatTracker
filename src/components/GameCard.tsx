import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Game } from '../types';
import { colors, spacing, typography, shadows } from '../styles/theme';
import { formatDate, formatSavePercentage } from '../utils/statsCalculations';

interface GameCardProps {
  game: Game;
  onPress?: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPress }) => {
  const savePercentage = game.shotsAgainst > 0 
    ? ((game.shotsAgainst - game.goalsAllowed) / game.shotsAgainst) * 100 
    : 0;
  
  const getResultColor = (result: string) => {
    switch (result) {
      case 'W':
        return colors.win;
      case 'L':
        return colors.loss;
      case 'OTL':
      case 'SOL':
        return colors.ot;
      default:
        return colors.textSecondary;
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'W':
        return 'WIN';
      case 'L':
        return 'LOSS';
      case 'OTL':
        return 'OT LOSS';
      case 'SOL':
        return 'SO LOSS';
      default:
        return result;
    }
  };

  const isShutout = game.goalsAllowed === 0 && game.result === 'W';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.resultBadge, { backgroundColor: getResultColor(game.result) }]}>
        <Text style={styles.resultText}>{getResultText(game.result)}</Text>
      </View>
      
      {isShutout && (
        <View style={styles.shutoutBadge}>
          <Text style={styles.shutoutText}>SHUTOUT</Text>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.opponent}>{game.opponent}</Text>
          <Text style={styles.leagueDate}>
            {game.league} • {formatDate(game.date)}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatSavePercentage(savePercentage)}</Text>
          <Text style={styles.statLabel}>SV%</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{game.goalsAllowed}</Text>
          <Text style={styles.statLabel}>GA</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{game.shotsAgainst - game.goalsAllowed}/{game.shotsAgainst}</Text>
          <Text style={styles.statLabel}>SAVES</Text>
        </View>
      </View>

      {game.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notes} numberOfLines={2}>{game.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.md,
  },
  resultBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    ...shadows.sm,
  },
  resultText: {
    ...typography.caption,
    color: colors.background,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  shutoutBadge: {
    position: 'absolute',
    top: spacing.md + 28,
    right: spacing.md,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  shutoutText: {
    ...typography.caption,
    color: colors.background,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    paddingRight: 80,
  },
  headerLeft: {
    flex: 1,
  },
  opponent: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  leagueDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    ...typography.small,
    color: colors.textMuted,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  notesContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  notes: {
    ...typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
