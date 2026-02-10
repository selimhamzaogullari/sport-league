export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate: string | null;
}

export interface LeagueResponse {
  leagues: League[];
}

export interface BadgeResponse {
  leagues: {
    strBadge: string;
  }[];
}