import { Game, Stats, LeagueStats, TimeFilter } from '../types';

export const calculateStats = (games: Game[]): Stats => {
  if (games.length === 0) {
    return {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      otLosses: 0,
      shotsAgainst: 0,
      goalsAllowed: 0,
      saves: 0,
      savePercentage: 0,
      gaa: 0,
      shutouts: 0,
      winPercentage: 0,
    };
  }

  const gamesPlayed = games.length;
  const wins = games.filter(g => g.result === 'W').length;
  const losses = games.filter(g => g.result === 'L').length;
  const otLosses = games.filter(g => g.result === 'OTL' || g.result === 'SOL').length;
  const shotsAgainst = games.reduce((sum, g) => sum + g.shotsAgainst, 0);
  const goalsAllowed = games.reduce((sum, g) => sum + g.goalsAllowed, 0);
  const saves = shotsAgainst - goalsAllowed;
  const savePercentage = shotsAgainst > 0 ? (saves / shotsAgainst) * 100 : 0;
  const gaa = gamesPlayed > 0 ? goalsAllowed / gamesPlayed : 0; // Simplified GAA per game
  const shutouts = games.filter(g => g.goalsAllowed === 0).length;
  const winPercentage = gamesPlayed > 0 ? (wins / gamesPlayed) * 100 : 0;

  return {
    gamesPlayed,
    wins,
    losses,
    otLosses,
    shotsAgainst,
    goalsAllowed,
    saves,
    savePercentage,
    gaa,
    shutouts,
    winPercentage,
  };
};

export const calculateStatsByLeague = (games: Game[]): LeagueStats[] => {
  const leagueMap = new Map<string, Game[]>();
  
  games.forEach(game => {
    if (!leagueMap.has(game.league)) {
      leagueMap.set(game.league, []);
    }
    leagueMap.get(game.league)!.push(game);
  });

  return Array.from(leagueMap.entries()).map(([league, leagueGames]) => ({
    league,
    ...calculateStats(leagueGames),
  }));
};

export const filterGamesByTime = (games: Game[], filter: TimeFilter): Game[] => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (filter) {
    case 'week': {
      const weekAgo = new Date(startOfToday);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return games.filter(g => new Date(g.date) >= weekAgo);
    }
    case 'month': {
      const monthAgo = new Date(startOfToday);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return games.filter(g => new Date(g.date) >= monthAgo);
    }
    case 'year': {
      const yearAgo = new Date(startOfToday);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      return games.filter(g => new Date(g.date) >= yearAgo);
    }
    case 'all':
    default:
      return games;
  }
};

export const filterGamesByLeague = (games: Game[], league?: string): Game[] => {
  if (!league) return games;
  return games.filter(g => g.league === league);
};

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatSavePercentage = (percentage: number): string => {
  return `.${Math.round(percentage * 10).toString().padStart(3, '0')}`;
};

export const formatGAA = (gaa: number): string => {
  return gaa.toFixed(2);
};

export const getRecordString = (stats: Stats): string => {
  return `${stats.wins}-${stats.losses}-${stats.otLosses}`;
};
