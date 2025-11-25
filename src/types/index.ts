export interface Game {
  id: string;
  date: Date;
  team: string;
  league: string;
  opponent: string;
  shotsAgainst: number;
  goalsAllowed: number;
  result: 'W' | 'L' | 'OTL' | 'SOL'; // Win, Loss, OT Loss, Shootout Loss
  notes?: string;
  createdAt: Date;
}

export interface GameInput {
  date: Date;
  team: string;
  league: string;
  opponent: string;
  shotsAgainst: number;
  goalsAllowed: number;
  result: 'W' | 'L' | 'OTL' | 'SOL';
  notes?: string;
}

export interface Stats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  otLosses: number;
  shotsAgainst: number;
  goalsAllowed: number;
  saves: number;
  savePercentage: number;
  gaa: number; // Goals Against Average
  shutouts: number;
  winPercentage: number;
}

export interface LeagueStats extends Stats {
  league: string;
}

export type TimeFilter = 'week' | 'month' | 'year' | 'all';

export interface FilterOptions {
  timeFilter: TimeFilter;
  league?: string;
}
