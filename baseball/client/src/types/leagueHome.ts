type Settings = {
    leagueName: string;
    sportId: string;
    premiumLeagueType: string;
    year: string;
    logoUrl: string;
    logoUploaded: boolean;
}

export type Team = {
    id: string;
    name: string;
    shortName: string;
    commissioner: boolean;
    logoId: string;
    logoUrl128: string;
    logoUrl256: string;
}

export type Game = {
    awayTeamId: string;
    awayTeamName: string;
    awayTeamScore: string;
    homeTeamId: string;
    homeTeamName: string;
    homeTeamScore: string;
}

export type TeamStandings = {
    teamId: string;
    teamName: string;
    rank: number;
    record: string;
    winPercentage: string;
    gamesBack: string;
    points: string;
    commissioner: boolean;
}

export type Standings = {
    divisionName: string;
    teams: TeamStandings;
}

export type Matchups = {
    periodInfo: string;
    games: Game[];
}

export type LeagueHome = {
    settings: Settings;
    teams: Team;
    standings: Standings;
    matchups: Matchups;
}
