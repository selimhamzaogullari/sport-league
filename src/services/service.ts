import type { LeagueResponse, BadgeResponse } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log(BASE_URL)

export const leagueService = {
  /**
   * Get All Leagues
   */
  async getAllLeagues(): Promise<LeagueResponse> {
    const response = await fetch(`${BASE_URL}/all_leagues.php`);
    if (!response.ok) throw new Error('An error occurred while loading the leagues');
    return response.json();
  },

  /**
   * Get League Detail
   */
  async getLeagueBadge(id: string): Promise<string | null> {
    const response = await fetch(`${BASE_URL}/lookupleague.php?id=${id}`);
    if (!response.ok) throw new Error('Failed to fetch league badge');
    
    const data: BadgeResponse = await response.json();
    return data.leagues?.[0]?.strBadge || null;
  }
};