import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { GameCard } from '../components/GameCard';
import { colors, spacing, typography, commonStyles } from '../styles/theme';
import { loadGames } from '../utils/storage';
import { filterGamesByTime, filterGamesByLeague } from '../utils/statsCalculations';
import { Game, TimeFilter } from '../types';

interface HistoryScreenProps {
  navigation: any;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [leagueFilter, setLeagueFilter] = useState<string | undefined>(undefined);
  const [availableLeagues, setAvailableLeagues] = useState<string[]>([]);

  const loadData = async () => {
    const loadedGames = await loadGames();
    setGames(loadedGames);
    
    // Extract unique leagues
    const leagues = Array.from(new Set(loadedGames.map(g => g.league)));
    setAvailableLeagues(leagues);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const getFilteredGames = () => {
    let filtered = filterGamesByTime(games, timeFilter);
    filtered = filterGamesByLeague(filtered, leagueFilter);
    return filtered;
  };

  const filteredGames = getFilteredGames();

  const timeFilterButtons: { label: string; value: TimeFilter }[] = [
    { label: 'ALL', value: 'all' },
    { label: 'YEAR', value: 'year' },
    { label: 'MONTH', value: 'month' },
    { label: 'WEEK', value: 'week' },
  ];

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>GAME HISTORY</Text>
          <Text style={styles.subtitle}>
            {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
          </Text>
        </View>

        {/* Time Filter */}
        <View style={styles.filterContainer}>
          {timeFilterButtons.map(({ label, value }) => (
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

        {/* League Filter */}
        {availableLeagues.length > 1 && (
          <View style={styles.leagueFilterContainer}>
            <TouchableOpacity
              style={[
                styles.leagueFilterButton,
                !leagueFilter && styles.leagueFilterButtonActive,
              ]}
              onPress={() => setLeagueFilter(undefined)}
            >
              <Text
                style={[
                  styles.leagueFilterButtonText,
                  !leagueFilter && styles.leagueFilterButtonTextActive,
                ]}
              >
                All Leagues
              </Text>
            </TouchableOpacity>
            {availableLeagues.map((league) => (
              <TouchableOpacity
                key={league}
                style={[
                  styles.leagueFilterButton,
                  leagueFilter === league && styles.leagueFilterButtonActive,
                ]}
                onPress={() => setLeagueFilter(league)}
              >
                <Text
                  style={[
                    styles.leagueFilterButtonText,
                    leagueFilter === league && styles.leagueFilterButtonTextActive,
                  ]}
                >
                  {league}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Games List */}
        {filteredGames.length > 0 ? (
          <FlatList
            data={filteredGames}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <GameCard
                game={item}
                onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Games Found</Text>
            <Text style={styles.emptyStateText}>
              {timeFilter !== 'all' || leagueFilter
                ? 'Try adjusting your filters'
                : 'Start tracking by adding your first game'}
            </Text>
          </View>
        )}
      </View>
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
    marginBottom: spacing.md,
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
  leagueFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  leagueFilterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  leagueFilterButtonActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  leagueFilterButtonText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  leagueFilterButtonTextActive: {
    color: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});
