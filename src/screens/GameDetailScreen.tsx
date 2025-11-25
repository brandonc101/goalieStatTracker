import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { colors, spacing, typography, commonStyles, shadows } from '../styles/theme';
import { loadGames, deleteGame } from '../utils/storage';
import { formatDate, formatSavePercentage } from '../utils/statsCalculations';
import { Game } from '../types';

interface GameDetailScreenProps {
  navigation: any;
  route: {
    params: {
      gameId: string;
    };
  };
}

export const GameDetailScreen: React.FC<GameDetailScreenProps> = ({ navigation, route }) => {
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    loadGameData();
  }, [route.params.gameId]);

  const loadGameData = async () => {
    const games = await loadGames();
    const foundGame = games.find(g => g.id === route.params.gameId);
    if (foundGame) {
      setGame(foundGame);
    } else {
      Alert.alert('Error', 'Game not found');
      navigation.goBack();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Game',
      'Are you sure you want to delete this game? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGame(route.params.gameId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete game');
            }
          },
        },
      ]
    );
  };

  if (!game) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={[styles.container, styles.centerContent]}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const savePercentage = game.shotsAgainst > 0
    ? ((game.shotsAgainst - game.goalsAllowed) / game.shotsAgainst) * 100
    : 0;
  const saves = game.shotsAgainst - game.goalsAllowed;
  const isShutout = game.goalsAllowed === 0 && game.result === 'W';

  const getResultColor = (result: string) => {
    switch (result) {
      case 'W': return colors.win;
      case 'L': return colors.loss;
      case 'OTL':
      case 'SOL': return colors.ot;
      default: return colors.textSecondary;
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'W': return 'WIN';
      case 'L': return 'LOSS';
      case 'OTL': return 'OT LOSS';
      case 'SOL': return 'SO LOSS';
      default: return result;
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        {/* Result Badge */}
        <View style={[styles.resultBanner, { backgroundColor: getResultColor(game.result) }]}>
          <Text style={styles.resultBannerText}>{getResultText(game.result)}</Text>
          {isShutout && <Text style={styles.shutoutTag}>SHUTOUT</Text>}
        </View>

        {/* Game Info */}
        <View style={styles.content}>
          <Text style={styles.opponent}>{game.opponent}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{game.league}</Text>
            <Text style={styles.metaDivider}>•</Text>
            <Text style={styles.metaText}>{game.team}</Text>
          </View>
          <Text style={styles.dateText}>{formatDate(game.date)}</Text>

          {/* Primary Stats */}
          <View style={styles.primaryStatsContainer}>
            <View style={styles.primaryStat}>
              <Text style={styles.primaryStatLabel}>SAVE %</Text>
              <Text style={styles.primaryStatValue}>{formatSavePercentage(savePercentage)}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.primaryStat}>
              <Text style={styles.primaryStatLabel}>SAVES</Text>
              <Text style={styles.primaryStatValue}>{saves}/{game.shotsAgainst}</Text>
            </View>
          </View>

          {/* Additional Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statCardLabel}>Shots Against</Text>
              <Text style={styles.statCardValue}>{game.shotsAgainst}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statCardLabel}>Goals Allowed</Text>
              <Text style={styles.statCardValue}>{game.goalsAllowed}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statCardLabel}>Saves Made</Text>
              <Text style={styles.statCardValue}>{saves}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statCardLabel}>GAA</Text>
              <Text style={styles.statCardValue}>{game.goalsAllowed.toFixed(2)}</Text>
            </View>
          </View>

          {/* Notes */}
          {game.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>NOTES</Text>
              <Text style={styles.notesText}>{game.notes}</Text>
            </View>
          )}

          {/* Actions */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>DELETE GAME</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    paddingVertical: spacing.sm,
  },
  backButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  resultBanner: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    ...shadows.md,
  },
  resultBannerText: {
    ...typography.h2,
    color: colors.background,
    fontWeight: '800',
    letterSpacing: 1,
  },
  shutoutTag: {
    ...typography.caption,
    color: colors.background,
    fontWeight: '800',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.accent,
    borderRadius: 6,
  },
  content: {
    padding: spacing.md,
  },
  opponent: {
    ...typography.h1,
    color: colors.text,
    fontWeight: '800',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  metaText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  metaDivider: {
    ...typography.body,
    color: colors.textMuted,
    marginHorizontal: spacing.sm,
  },
  dateText: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  primaryStatsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.glow,
  },
  primaryStat: {
    flex: 1,
    alignItems: 'center',
  },
  primaryStatLabel: {
    ...typography.small,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  primaryStatValue: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: '800',
  },
  statDivider: {
    width: 2,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  statCardLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statCardValue: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  notesContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  notesLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notesText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  deleteButton: {
    backgroundColor: colors.loss,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.md,
    ...shadows.md,
  },
  deleteButtonText: {
    ...typography.body,
    color: colors.background,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
