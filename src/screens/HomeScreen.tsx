import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatsCard } from '../components/StatsCard';
import { GameCard } from '../components/GameCard';
import { colors, spacing, typography, commonStyles, shadows } from '../styles/theme';
import { loadGames } from '../utils/storage';
import {
  calculateStats,
  calculateStatsByLeague,
  filterGamesByTime,
  formatSavePercentage,
  formatGAA,
  getRecordString,
} from '../utils/statsCalculations';
import { Game, TimeFilter } from '../types';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const loadedGames = await loadGames();
    setGames(loadedGames);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredGames = filterGamesByTime(games, timeFilter);
  const stats = calculateStats(filteredGames);
  const leagueStats = calculateStatsByLeague(filteredGames);
  const recentGames = filteredGames.slice(0, 5);

  const filterButtons: { label: string; value: TimeFilter }[] = [
    { label: 'ALL', value: 'all' },
    { label: 'YEAR', value: 'year' },
    { label: 'MONTH', value: 'month' },
    { label: 'WEEK', value: 'week' },
  ];

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>GOALIE STATS</Text>
          <Text style={styles.subtitle}>Track your performance</Text>
        </View>

        {/* Time Filter */}
        <View style={styles.filterContainer}>
          {filterButtons.map(({ label, value }) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.filterButton,
                timeFilter === value && styles.filterButtonActive,
              ]}
              onPress={() => setTimeFilter(value)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  timeFilter === value && styles.filterButtonTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Stats */}
        {stats.gamesPlayed > 0 ? (
          <>
            <View style={styles.primaryStatsRow}>
              <StatsCard
                label="Save %"
                value={formatSavePercentage(stats.savePercentage)}
                highlight
                color={colors.primary}
              />
              <StatsCard
                label="GAA"
                value={formatGAA(stats.gaa)}
                highlight
                color={colors.secondary}
              />
            </View>

            <View style={styles.statsRow}>
              <StatsCard label="Record" value={getRecordString(stats)} />
              <StatsCard label="Games" value={stats.gamesPlayed} />
              <StatsCard label="Shutouts" value={stats.shutouts} />
            </View>

            <View style={styles.statsRow}>
              <StatsCard
                label="Shots Against"
                value={stats.shotsAgainst}
                subtitle={`${stats.saves} saves`}
              />
              <StatsCard
                label="Win %"
                value={`${stats.winPercentage.toFixed(1)}%`}
              />
            </View>

            {/* League Breakdown */}
            {leagueStats.length > 1 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>BY LEAGUE</Text>
                {leagueStats.map((ls) => (
                  <View key={ls.league} style={styles.leagueCard}>
                    <View style={styles.leagueHeader}>
                      <Text style={styles.leagueName}>{ls.league}</Text>
                      <Text style={styles.leagueRecord}>{getRecordString(ls)}</Text>
                    </View>
                    <View style={styles.leagueStats}>
                      <Text style={styles.leagueStat}>
                        SV%: <Text style={styles.leagueStatValue}>{formatSavePercentage(ls.savePercentage)}</Text>
                      </Text>
                      <Text style={styles.leagueStat}>
                        GAA: <Text style={styles.leagueStatValue}>{formatGAA(ls.gaa)}</Text>
                      </Text>
                      <Text style={styles.leagueStat}>
                        SO: <Text style={styles.leagueStatValue}>{ls.shutouts}</Text>
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Recent Games */}
            {recentGames.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>RECENT GAMES</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('History')}>
                    <Text style={styles.viewAllButton}>View All</Text>
                  </TouchableOpacity>
                </View>
                {recentGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onPress={() => navigation.navigate('GameDetail', { gameId: game.id })}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Games Yet</Text>
            <Text style={styles.emptyStateText}>
              Start tracking your performance by adding your first game
            </Text>
          </View>
        )}

        {/* Add Game Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddGame')}
        >
          <Text style={styles.addButtonText}>+ ADD GAME</Text>
        </TouchableOpacity>

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
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.glow,
  },
  filterButtonText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  filterButtonTextActive: {
    color: colors.background,
  },
  primaryStatsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  viewAllButton: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  leagueCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
  },
  leagueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  leagueName: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  leagueRecord: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  leagueStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  leagueStat: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  leagueStatValue: {
    color: colors.text,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.xl,
  },
  emptyStateTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  addButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.lg,
  },
  addButtonText: {
    ...typography.body,
    color: colors.background,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
