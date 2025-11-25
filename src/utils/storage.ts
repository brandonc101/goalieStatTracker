import AsyncStorage from '@react-native-async-storage/async-storage';
import { Game, GameInput } from '../types';

const GAMES_STORAGE_KEY = '@goalie_stats_games';

export const saveGames = async (games: Game[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(games);
    await AsyncStorage.setItem(GAMES_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving games:', error);
    throw error;
  }
};

export const loadGames = async (): Promise<Game[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(GAMES_STORAGE_KEY);
    if (jsonValue != null) {
      const games = JSON.parse(jsonValue);
      // Convert date strings back to Date objects
      return games.map((game: any) => ({
        ...game,
        date: new Date(game.date),
        createdAt: new Date(game.createdAt),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading games:', error);
    return [];
  }
};

export const addGame = async (gameInput: GameInput): Promise<Game> => {
  try {
    const games = await loadGames();
    const newGame: Game = {
      ...gameInput,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    games.push(newGame);
    games.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    await saveGames(games);
    return newGame;
  } catch (error) {
    console.error('Error adding game:', error);
    throw error;
  }
};

export const updateGame = async (id: string, gameInput: Partial<GameInput>): Promise<void> => {
  try {
    const games = await loadGames();
    const index = games.findIndex(g => g.id === id);
    if (index !== -1) {
      games[index] = { ...games[index], ...gameInput };
      games.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      await saveGames(games);
    }
  } catch (error) {
    console.error('Error updating game:', error);
    throw error;
  }
};

export const deleteGame = async (id: string): Promise<void> => {
  try {
    const games = await loadGames();
    const filteredGames = games.filter(g => g.id !== id);
    await saveGames(filteredGames);
  } catch (error) {
    console.error('Error deleting game:', error);
    throw error;
  }
};

export const clearAllGames = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(GAMES_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing games:', error);
    throw error;
  }
};
